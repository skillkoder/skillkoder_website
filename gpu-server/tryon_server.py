"""
SkillKoder Virtual Try-On GPU server: FASHN VTON v1.5 on an NVIDIA GPU.

Serves skillkoder.com/virtualtryon. The browser never calls this server: the Django backend
(backend/virtualtryon/views.py) proxies to it and adds the shared X-Tryon-Key secret.

    Browser → /api/v1/virtualtryon/ (Django) → TRYON_SERVER_URL/tryon (this server)

Every model it loads allows commercial use:
  fashn-ai/fashn-vton-1.5 (try-on, Apache-2.0), fashn-ai/DWPose (pose: YOLOX + DWPose, Apache-2.0),
  IS-Net general-use (garment background removal, Apache-2.0),
  facebook/sam2.1-hiera-base-plus (finding the garment on someone wearing it, Apache-2.0).
FASHN's human parser (NVIDIA non-commercial licence) is NOT used: fashn_stubs/ replaces it, and
garment_prep.py does its job. The garment photo ("The outfit to copy" on the page) can be:
  - the cloth on its own (laid flat, on a hanger, a product shot): background removed, then
    FASHN's "flat-lay" mode;
  - someone else wearing it (a model photo, a friend's picture): the `slot` garment ("Which item?"
    on the page) is found on them, everything else greyed out, then FASHN's "model" mode.
The person photo is never masked (segmentation-free). Nothing is written to disk.

    POST /tryon      multipart: person, garment, slot (top|outerwear|bottom|dress); optional steps, seed → PNG
                     header:    X-Tryon-Key: <TRYON_API_KEY>
    GET  /health     → {"ready": bool, "loading": bool, "error": str|null, "gpu": str|null, "busy": bool}

Env: TRYON_API_KEY (shared secret; must equal TRYON_API_KEY in backend/.env), HOST (default
     127.0.0.1), PORT (default 8002), TRYON_STEPS (default 30; 20 is faster, 50 is best quality),
     TRYON_WEIGHTS_DIR (default gpu-server/checkpoints/fashn).
Setup: .\\setup.ps1        Run: .\\start.ps1        (first start downloads ~2.9 GB of models)
See VIRTUALTRYON.md at the repo root.
"""

import hashlib
import hmac
import io
import os
import sys
import threading
import time
import urllib.request
from contextlib import asynccontextmanager
from pathlib import Path

ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT / "fashn_stubs"))  # must come before importing fashn_vton

os.environ.setdefault("HF_HUB_DISABLE_XET", "1")
os.environ.setdefault("HF_HUB_DISABLE_SYMLINKS_WARNING", "1")

import numpy as np  # noqa: E402
import torch  # noqa: E402  (loads the CUDA DLLs that onnxruntime-gpu reuses)
from fastapi import FastAPI, File, Form, Header, HTTPException, UploadFile  # noqa: E402
from fastapi.responses import JSONResponse, Response  # noqa: E402
from huggingface_hub import hf_hub_download  # noqa: E402
from PIL import Image, ImageOps  # noqa: E402

from fashn_human_parser import LABELS_TO_IDS  # noqa: E402  (fashn_stubs/)
from fashn_vton import TryOnPipeline  # noqa: E402  (vendor/fashn-vton, installed by setup.ps1)
from garment_prep import GARMENT_LABEL, ISNET_SHA256, ISNET_URL, GarmentPrep  # noqa: E402

WEIGHTS_DIR = Path(os.environ.get("TRYON_WEIGHTS_DIR") or ROOT / "checkpoints" / "fashn")
ISNET_PATH = WEIGHTS_DIR / "isnet-general-use.onnx"
DEFAULT_STEPS = int(os.environ.get("TRYON_STEPS", 30))
API_KEY = os.environ.get("TRYON_API_KEY", "")
MAX_IMAGE_BYTES = 10 * 1024 * 1024  # same limit as the website's proxy (backend/virtualtryon/views.py)
MAX_SIDE = 1536  # larger inputs only slow down pose detection; the model works at 864 px tall

# Keys are the page's "Which item?" choices: Top / Jacket / Bottom / Dress.
SLOT_TO_CATEGORY = {"top": "tops", "outerwear": "tops", "bottom": "bottoms", "dress": "one-pieces"}

state: dict = {"ready": False, "error": None, "loading": False}
gpu_lock = threading.Lock()


def download_weights():
    WEIGHTS_DIR.mkdir(parents=True, exist_ok=True)
    hf_hub_download("fashn-ai/fashn-vton-1.5", "model.safetensors", local_dir=WEIGHTS_DIR)
    for name in ("yolox_l.onnx", "dw-ll_ucoco_384.onnx"):
        hf_hub_download("fashn-ai/DWPose", name, local_dir=WEIGHTS_DIR / "dwpose")
    if not ISNET_PATH.exists():
        partial = ISNET_PATH.with_suffix(".part")
        urllib.request.urlretrieve(ISNET_URL, partial)
        partial.replace(ISNET_PATH)
    if hashlib.sha256(ISNET_PATH.read_bytes()).hexdigest() != ISNET_SHA256:
        ISNET_PATH.unlink()
        raise RuntimeError("Background-removal model download is corrupt; restart to retry.")


def load_models():
    state["loading"] = True
    try:
        started = time.time()
        download_weights()
        state["pipeline"] = TryOnPipeline(weights_dir=str(WEIGHTS_DIR), device="cuda")
        state["garment_prep"] = GarmentPrep(state["pipeline"].pose_model, str(ISNET_PATH))
        state["ready"] = True
        print(f"[tryon] FASHN VTON ready in {time.time() - started:.0f}s", flush=True)
    except Exception as error:  # surfaced through /health
        state["error"] = f"{type(error).__name__}: {error}"
        print(f"[tryon] failed to load models: {state['error']}", flush=True)
        raise
    finally:
        state["loading"] = False


@asynccontextmanager
async def lifespan(_app: FastAPI):
    if not API_KEY:
        print("[tryon] WARNING: TRYON_API_KEY is not set; anyone who can reach this port can use your GPU.", flush=True)
    if torch.cuda.is_available():
        threading.Thread(target=load_models, daemon=True).start()
    else:
        state["error"] = "No CUDA GPU found. Try-on needs an NVIDIA GPU."
    yield


app = FastAPI(title="SkillKoder Virtual Try-On", lifespan=lifespan, docs_url=None, redoc_url=None)


def check_key(key: str | None):
    if API_KEY and not hmac.compare_digest(key or "", API_KEY):
        raise HTTPException(401, "Invalid try-on key.")


@app.get("/health")
def health(x_tryon_key: str | None = Header(None)):
    check_key(x_tryon_key)
    return {
        "ready": state["ready"],
        "loading": state["loading"],
        "error": state["error"],
        "gpu": torch.cuda.get_device_name(0) if torch.cuda.is_available() else None,
        "busy": gpu_lock.locked(),
        "model": "fashn-vton-1.5",
        "slots": list(SLOT_TO_CATEGORY),
    }


def read_image(upload: UploadFile) -> Image.Image:
    data = upload.file.read(MAX_IMAGE_BYTES + 1)
    if len(data) > MAX_IMAGE_BYTES:
        raise HTTPException(413, "Each photo must be 10 MB or smaller.")
    try:
        image = ImageOps.exif_transpose(Image.open(io.BytesIO(data))).convert("RGB")
    except Exception:
        raise HTTPException(400, "Couldn't read one of the photos. Try a JPG or PNG.")
    image.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
    return image


@app.post("/tryon")
def tryon(
    person: UploadFile = File(...),
    garment: UploadFile = File(...),
    slot: str = Form(...),
    steps: int = Form(DEFAULT_STEPS),
    seed: int = Form(42),
    x_tryon_key: str | None = Header(None),
):
    check_key(x_tryon_key)
    if not state["ready"]:
        msg = state["error"] or "Virtual try-on is still starting up. Please try again in a minute."
        return JSONResponse({"error": msg}, status_code=503)
    category = SLOT_TO_CATEGORY.get(slot)
    if not category:
        return JSONResponse({"error": "Garment type must be one of: top, outerwear, bottom, dress."}, status_code=422)

    person_img = read_image(person)
    garment_img = read_image(garment)
    steps = max(10, min(steps, 50))

    with gpu_lock:  # one generation at a time on a single GPU; others wait in line
        started = time.time()
        pipeline: TryOnPipeline = state["pipeline"]
        prep: GarmentPrep = state["garment_prep"]
        worn = prep.worn_by_person(garment_img)
        try:
            if worn:
                # Same resize the pipeline applies (a no-op the second time), so the mask lines up
                # with the exact image the parser stand-in is asked about.
                garment_img = pipeline.pre_resize(garment_img, allow_upsampling=False)
                mask = prep.segment_worn(garment_img, category)
                labels = np.where(mask, LABELS_TO_IDS[GARMENT_LABEL[category]], 0).astype(np.uint8)
                pipeline.hp_model.provide(np.asarray(garment_img), labels)
            else:
                garment_img = prep.cutout(garment_img)
        except ValueError as error:
            # 422 = the chosen item isn't in the garment photo; the page shows this message next
            # to the garment preview and focuses "Which item?".
            return JSONResponse({"error": str(error)}, status_code=422)
        try:
            result = pipeline(
                person_image=person_img,
                garment_image=garment_img,
                category=category,
                garment_photo_type="model" if worn else "flat-lay",
                segmentation_free=True,  # the person photo isn't masked
                num_timesteps=steps,
                seed=seed,
            ).images[0]
        except torch.cuda.OutOfMemoryError:
            torch.cuda.empty_cache()
            return JSONResponse(
                {"error": "The try-on server ran out of GPU memory. Please try again in a minute."}, status_code=507
            )
        finally:
            pipeline.hp_model.clear()
        kind = "worn" if worn else "flat"
        print(f"[tryon] {slot} try-on from {kind} garment photo in {time.time() - started:.1f}s ({steps} steps)", flush=True)

    out = io.BytesIO()
    result.save(out, format="PNG")
    return Response(out.getvalue(), media_type="image/png", headers={"cache-control": "no-store"})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=os.environ.get("HOST", "127.0.0.1"), port=int(os.environ.get("PORT", 8002)))
