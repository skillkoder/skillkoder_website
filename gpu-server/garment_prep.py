"""
Garment photo handling for tryon_server.py (FASHN VTON), the SkillKoder Virtual Try-On server, using only commercially usable models.
It replaces FASHN's own human parser, whose weights are non-commercial.

- worn_by_person(): tells photos of someone wearing the garment from photos of the cloth alone,
  using the DWPose model the pipeline already loads (Apache-2.0).
- Cloth alone → cutout(): removes the background (carpet, bed, floor...) with IS-Net general-use
  (DIS, Apache-2.0; ONNX export from rembg, MIT) and puts the garment on white.
- Worn by someone → segment_worn(): finds just that garment on them with SAM 2.1 (Apache-2.0),
  prompted with points from their pose (e.g. side panels for a top, thighs for trousers; face and
  hands as "not this"). FASHN then uses its "model photo" mode, which greys out everything except
  the garment, as its own parser would have.
"""

import cv2
import numpy as np
import onnxruntime as ort
import torch
from PIL import Image
from transformers import Sam2Model, Sam2Processor

ISNET_URL = "https://github.com/danielgatis/rembg/releases/download/v0.0.0/isnet-general-use.onnx"
ISNET_SHA256 = "60920e99c45464f2ba57bee2ad08c919a52bbf852739e96947fbb4358c0d964a"
ISNET_SIZE = 1024

# DWPose whole-body keypoint ranges (COCO-WholeBody order). Its body points alone can't tell:
# it "finds" shoulders, elbows and even a face on a laid-flat shirt. Face and hand landmark
# confidences can. Measured: worn photos face >= 0.97, a hand >= 0.58 or feet >= 0.72 (headless
# shots still show hands or shoes); flat-lays face <= 0.32, hands <= 0.18, feet <= 0.08.
FACE, FEET, L_HAND, R_HAND = slice(24, 92), slice(18, 24), slice(92, 113), slice(113, 134)
FACE_MIN, HAND_MIN, FEET_MIN = 0.65, 0.4, 0.45

# OpenPose-18 body keypoints (DWPose puts them first, neck included)
R_SHO, R_ELB, R_WRI, L_SHO, L_ELB, L_WRI = 2, 3, 4, 5, 6, 7
R_HIP, R_KNEE, R_ANK, L_HIP, L_KNEE, L_ANK = 8, 9, 10, 11, 12, 13
KP_MIN = 0.3  # DWPose's own visibility threshold
SKIN_DELTA_E = 18  # forearm colour this close (CIELAB) to the face's counts as bare skin

SAM_REPO = "facebook/sam2.1-hiera-base-plus"
SAM_REVISION = "b7320756a13354e7530a63935656d35b2f91a290"  # pinned commit (weights + configs only)

# Shown on skillkoder.com/virtualtryon next to the garment preview (HTTP 422), which then
# focuses the "Which item?" selector.
NOT_FOUND = (
    "Couldn't find the item chosen under \"Which item?\" in that photo. Pick a different item, "
    "or use a front-facing photo that shows it fully."
)

# FASHN category → parser label that marks the garment's pixels (see fashn_stubs/)
GARMENT_LABEL = {"tops": "top", "bottoms": "pants", "one-pieces": "dress"}


class SkinReference:
    """The person's skin colour (CIELAB), sampled around `points` (the face, or the hands in a
    headless photo), to tell bare skin from fabric."""

    def __init__(self, image: Image.Image, points):
        self.lab = cv2.cvtColor(np.asarray(image).astype(np.float32) / 255, cv2.COLOR_RGB2LAB)
        self.r = max(4, int(0.02 * max(image.size)))
        patches = [self._patch(p) for p in points]
        patches = [p for p in patches if len(p)]
        self.colour = np.median(np.concatenate(patches), axis=0) if patches else None

    def _patch(self, p) -> np.ndarray:
        x, y, r = int(p[0]), int(p[1]), self.r
        return self.lab[max(0, y - r): y + r, max(0, x - r): x + r].reshape(-1, 3)

    def _close(self, values: np.ndarray) -> bool:
        if self.colour is None or not len(values):
            return False
        return bool(np.linalg.norm(np.median(values, axis=0) - self.colour) < SKIN_DELTA_E)

    def at(self, point) -> bool:
        return self._close(self._patch(point))

    def matches(self, mask: np.ndarray) -> bool:
        return self._close(self.lab[mask])


def clean_mask(mask: np.ndarray) -> np.ndarray:
    """Drop the speckle SAM leaves in low-confidence areas, keep the solid parts, fill holes."""
    k = max(3, int(0.008 * max(mask.shape))) | 1
    m = cv2.morphologyEx(mask.astype(np.uint8), cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
    n, labels, stats, _ = cv2.connectedComponentsWithStats(m, connectivity=8)
    if n <= 1:
        return np.zeros_like(mask, dtype=bool)
    areas = stats[1:, cv2.CC_STAT_AREA]
    keep = 1 + np.nonzero(areas >= 0.05 * areas.max())[0]
    m = np.isin(labels, keep).astype(np.uint8)
    contours, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(m, contours, -1, 1, thickness=cv2.FILLED)
    return m.astype(bool)


class GarmentPrep:
    def __init__(self, pose_model, isnet_path: str, device: str = "cuda"):
        self.pose_model = pose_model
        self.device = device
        self.isnet = ort.InferenceSession(isnet_path, providers=["CUDAExecutionProvider", "CPUExecutionProvider"])
        self.isnet_input = self.isnet.get_inputs()[0].name
        self.sam_processor = Sam2Processor.from_pretrained(SAM_REPO, revision=SAM_REVISION)
        self.sam = Sam2Model.from_pretrained(SAM_REPO, revision=SAM_REVISION).to(device).eval()

    def _pose(self, image: Image.Image) -> tuple[np.ndarray, np.ndarray]:
        bgr = np.ascontiguousarray(np.asarray(image)[..., ::-1])  # DWPose expects BGR
        return self.pose_model.pose_estimation(bgr)  # (people, 134, 2) pixels, (people, 134) confidences

    def worn_by_person(self, image: Image.Image) -> bool:
        _, scores = self._pose(image)
        for s in scores:
            hand = max(s[L_HAND].mean(), s[R_HAND].mean())
            if s[FACE].mean() >= FACE_MIN or hand >= HAND_MIN or s[FEET].mean() >= FEET_MIN:
                return True
        return False

    # --- Worn garments (SAM 2.1) -------------------------------------------------------------

    @torch.inference_mode()
    def _sam_candidates(self, image: Image.Image, embeddings, positive, negative):
        """SAM's three masks (part / whole object / larger) for one prompt set, cleaned, with a
        quality score: SAM's own confidence times how much of the mask survived cleaning (unsure
        masks come out speckled and lose most of it)."""
        prompts = list(positive) + list(negative)
        inputs = self.sam_processor(
            images=image,
            input_points=[[[[float(x), float(y)] for x, y in prompts]]],
            input_labels=[[[1] * len(positive) + [0] * len(negative)]],
            return_tensors="pt",
        ).to(self.device)
        out = self.sam(
            input_points=inputs["input_points"],
            input_labels=inputs["input_labels"],
            image_embeddings=embeddings,
            multimask_output=True,
        )
        masks = self.sam_processor.post_process_masks(out.pred_masks.cpu(), inputs["original_sizes"])[0][0]
        cleaned, quality = [], []
        for raw, iou in zip(masks.numpy().astype(bool), out.iou_scores[0, 0].float().cpu().tolist()):
            mask = clean_mask(raw)
            cleaned.append(mask)
            quality.append(iou * (mask & raw).sum() / max(raw.sum(), 1))
        return cleaned, quality

    def _best_mask(self, image, embeddings, prompt_sets, must_include, must_exclude):
        """Best-quality candidate that covers every `must_include` point and none of the
        `must_exclude` points; otherwise the one that breaks the fewest of those rules."""
        h, w = image.height, image.width

        def at(m, p):
            return bool(m[min(max(int(p[1]), 0), h - 1), min(max(int(p[0]), 0), w - 1)])

        best, best_key = None, None
        for positive, negative in prompt_sets:
            for mask, quality in zip(*self._sam_candidates(image, embeddings, positive, negative)):
                if not mask.any():
                    continue
                misses = sum(not at(mask, p) for p in must_include) + sum(at(mask, p) for p in must_exclude)
                key = (-misses, quality)
                if best_key is None or key > best_key:
                    best, best_key = mask, key
        return best

    def segment_worn(self, image: Image.Image, category: str) -> np.ndarray:
        """Mask (bool, image size) of the garment of `category` worn in `image`."""
        points, scores = self._pose(image)
        if not len(scores):
            raise ValueError("Couldn't find the person wearing the clothes in that photo. Use a front-facing photo.")
        person = int(np.argmax(scores[:, :18].sum(1)))  # the most visible person
        kp, conf = points[person], scores[person]

        def pt(i):
            return kp[i] if conf[i] >= KP_MIN else None

        def mid(a, b):
            return None if a is None or b is None else (a + b) / 2

        def lerp(a, b, t):
            return None if a is None or b is None else a + (b - a) * t

        def centroid(sl):
            v = kp[sl][conf[sl] >= KP_MIN]
            return v.mean(0) if len(v) else None

        def present(*ps):
            return [p for p in ps if p is not None]

        sho, hip = mid(pt(R_SHO), pt(L_SHO)), mid(pt(R_HIP), pt(L_HIP))
        sides = [(pt(R_SHO), pt(R_HIP), pt(R_KNEE), pt(R_ANK)), (pt(L_SHO), pt(L_HIP), pt(L_KNEE), pt(L_ANK))]
        face, feet = centroid(FACE), centroid(FEET)
        hands = present(centroid(L_HAND), centroid(R_HAND))
        chest = lerp(sho, hip, 0.35)

        def panels(t):
            # A third of the way in from each side, `t` of the way down the torso. On an open
            # jacket these are on the jacket, while the centre of the chest is the shirt underneath.
            return present(*[lerp(lerp(s, h, t), lerp(sho, hip, t), 0.35) for s, h, _, _ in sides])

        def legs(t):  # 0 = hip, 1 = knee, 2 = ankle
            return present(*[lerp(h, k, t) if t <= 1 else lerp(k, a, t - 1) for _, h, k, a in sides])

        # Points at two heights at least, so one stripe or one colour block can't satisfy them.
        if category == "tops":
            candidates, exclude = panels(0.3) + panels(0.7), present(face, *hands)
        elif category == "bottoms":
            candidates, exclude = legs(0.3) + legs(0.8) + legs(1.4), present(chest, face, *hands, feet)
        else:  # one-pieces
            candidates, exclude = panels(0.3) + panels(0.7) + legs(0.2), present(face, *hands, feet)
        # Points that land on bare skin (crossed arms, shins below shorts) may not be the garment,
        # so they're dropped, but not marked "not this": beige or tan fabric can pass for skin.
        # If nearly all of them look like skin, the garment itself is skin-toned: keep them all.
        skin = SkinReference(image, [face] if face is not None else hands)
        on_skin = [skin.at(p) for p in candidates]
        skin_toned_garment = len(candidates) - sum(on_skin) < 2
        if not skin_toned_garment:
            include = [p for p, s in zip(candidates, on_skin) if not s]
            for elb, wri in ((R_ELB, R_WRI), (L_ELB, L_WRI)):
                fore = lerp(pt(elb), pt(wri), 0.5)
                if fore is not None and skin.at(fore):
                    exclude += [fore]
        else:
            include = candidates
        if len(include) < 2:
            raise ValueError(NOT_FOUND)
        # SAM does best with a few points, but a few points can be satisfied by one stripe or
        # colour block. So: try a few small prompt sets and the full one, then let the full set
        # of points (`include`, `exclude`) pick the winner.
        if category == "tops":
            simple = [panels(0.5), present(chest, lerp(sho, hip, 0.65))]
        elif category == "bottoms":
            simple = [legs(0.3), legs(0.3) + legs(0.6)]
        else:
            simple = [panels(0.5) + legs(0.2), present(chest, lerp(sho, hip, 0.65))]
        simple = [s if skin_toned_garment else [p for p in s if not skin.at(p)] for s in simple]
        prompt_sets = [(s, neg) for s in simple if len(s) >= 2 for neg in ([], exclude)]
        prompt_sets += [(include, []), (include, exclude), (include[: max(2, len(include) // 2)], exclude)]

        pixel_values = self.sam_processor(images=image, return_tensors="pt")["pixel_values"].to(self.device)
        with torch.inference_mode():
            embeddings = self.sam.get_image_embeddings(pixel_values)
        mask = self._best_mask(image, embeddings, prompt_sets, include, exclude)
        if mask is None:
            raise ValueError(NOT_FOUND)

        if category != "bottoms":
            mask &= ~self._bare_forearms(image, embeddings, kp, conf, mask, skin, chest)
            mask = clean_mask(mask)
        if mask.mean() < 0.01:
            raise ValueError(NOT_FOUND)
        return mask

    def _bare_forearms(self, image, embeddings, kp, conf, garment, skin: SkinReference, chest) -> np.ndarray:
        """Bare forearms lying over the garment (e.g. crossed arms), which SAM tends to include.
        A forearm counts as bare if its colour matches the person's skin; sleeves match the
        garment instead and are kept."""
        h, w = garment.shape
        bare = np.zeros_like(garment)
        for elb, wri in ((R_ELB, R_WRI), (L_ELB, L_WRI)):
            if conf[elb] < KP_MIN or conf[wri] < KP_MIN:
                continue
            fore = kp[elb] + (kp[wri] - kp[elb]) * 0.5
            if not garment[min(int(fore[1]), h - 1), min(int(fore[0]), w - 1)]:
                continue  # this forearm isn't over the garment
            masks, _ = self._sam_candidates(image, embeddings, [fore, kp[wri]], [chest] if chest is not None else [])
            arms = [m for m in masks if m.any() and m.sum() < 0.5 * garment.sum()]
            if not arms:
                continue
            arm = min(arms, key=lambda m: m.sum())  # the forearm itself, not the whole person
            if skin.matches(arm):
                bare |= arm
        return bare

    # --- Cloth on its own (IS-Net) -----------------------------------------------------------

    def mask(self, image: Image.Image) -> np.ndarray:
        """Foreground probability (0-1) at the image's size."""
        x = np.asarray(image.resize((ISNET_SIZE, ISNET_SIZE), Image.BILINEAR), dtype=np.float32)
        x = x / max(x.max(), 1e-6) - 0.5  # IS-Net preprocessing (as in rembg)
        pred = self.isnet.run(None, {self.isnet_input: x.transpose(2, 0, 1)[None]})[0][0, 0]
        pred = (pred - pred.min()) / max(pred.max() - pred.min(), 1e-6)
        alpha = Image.fromarray((pred * 255).astype(np.uint8)).resize(image.size, Image.BILINEAR)
        return np.asarray(alpha, dtype=np.float32) / 255

    def cutout(self, image: Image.Image, margin: float = 0.06) -> Image.Image:
        alpha = self.mask(image)
        ys, xs = np.nonzero(alpha > 0.5)
        if len(ys) < 0.01 * alpha.size:
            raise ValueError("Couldn't find any clothing in that photo. Use a photo where the whole garment is visible.")
        rgb = np.asarray(image).astype(np.float32)
        out = rgb * alpha[..., None] + 255 * (1 - alpha[..., None])  # soft edges onto white

        pad = int(margin * max(np.ptp(ys), np.ptp(xs)))
        y0, y1 = max(0, ys.min() - pad), min(alpha.shape[0], ys.max() + pad + 1)
        x0, x1 = max(0, xs.min() - pad), min(alpha.shape[1], xs.max() + pad + 1)
        return Image.fromarray(out[y0:y1, x0:x1].round().astype(np.uint8))
