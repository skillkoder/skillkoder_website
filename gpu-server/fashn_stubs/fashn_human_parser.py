"""
Stand-in for the `fashn_human_parser` package, so FASHN VTON runs without its parser weights.

The real parser is a SegFormer model under NVIDIA's non-commercial licence. FASHN VTON uses its
output only for masking:
- the person photo: tryon_server.py turns that off (segmentation_free=True);
- a garment photo of someone wearing it: tryon_server.py segments the garment itself
  (garment_prep.py, SAM 2.1) and hands the result over with provide(). predict() returns it for
  that exact image and an empty map for anything else.
"""

import hashlib

import numpy as np

LABELS_TO_IDS = {
    "background": 0, "face": 1, "hair": 2, "top": 3, "dress": 4, "skirt": 5, "pants": 6, "belt": 7,
    "bag": 8, "hat": 9, "scarf": 10, "glasses": 11, "arms": 12, "hands": 13, "legs": 14, "feet": 15,
    "torso": 16, "jewelry": 17,
}
IDS_TO_LABELS = {v: k for k, v in LABELS_TO_IDS.items()}
IDENTITY_LABELS = ["face", "hair", "hat", "glasses", "jewelry", "bag"]
CATEGORY_TO_BODY_COVERAGE = {"tops": "upper", "bottoms": "lower", "one-pieces": "full"}
BODY_COVERAGE_TO_LABELS = {
    "upper": ["top", "dress", "scarf"],
    "lower": ["skirt", "pants", "dress", "belt"],
    "full": ["top", "dress", "skirt", "pants", "belt", "scarf"],
}


def _digest(image: np.ndarray) -> str:
    return hashlib.sha1(np.ascontiguousarray(image).tobytes()).hexdigest() + str(image.shape)


class FashnHumanParser:
    def __init__(self, device: str = "cpu"):
        self.device = device
        self._provided: tuple[str, np.ndarray] | None = None

    def provide(self, image: np.ndarray, labels: np.ndarray) -> None:
        """Use `labels` as the parse of `image` (until the next provide or clear)."""
        self._provided = (_digest(image), labels)

    def clear(self) -> None:
        self._provided = None

    def predict(self, image: np.ndarray) -> np.ndarray:
        if self._provided and self._provided[0] == _digest(image):
            return self._provided[1]
        return np.zeros(image.shape[:2], dtype=np.uint8)
