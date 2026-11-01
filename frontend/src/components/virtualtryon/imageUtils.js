/**
 * Browser-side image helpers for the Virtual Try-On page.
 *
 * Everything here uses plain <canvas> — no image libraries. Photos are only
 * ever held as in-memory Blobs and object URLs; nothing is persisted.
 */

export const PERSON_MAX_SIDE = 1280;
export const GARMENT_MAX_SIDE = 1024;
const JPEG_QUALITY = 0.92;

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Couldn't read that image. Try a JPG or PNG photo."));
    img.src = src;
  });
}

/**
 * Draw any image source onto a white canvas (so transparent PNGs become white
 * rather than black), scaled so its longest side is at most `maxSide`, and
 * encode it as JPEG. `mirror` flips it horizontally.
 */
export function drawToJpeg(source, width, height, maxSide = Infinity, { mirror = false } = {}) {
  const scale = Math.min(1, maxSide / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  if (mirror) {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(source, 0, 0, w, h);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Couldn't process that photo."))),
      'image/jpeg',
      JPEG_QUALITY
    );
  });
}

/** Grab the current video frame as a JPEG Blob (full camera resolution). */
export function captureVideoFrame(video, { mirror = false } = {}) {
  return drawToJpeg(video, video.videoWidth, video.videoHeight, Infinity, { mirror });
}

/** Downscale + flatten + JPEG-encode a photo right before upload. */
export async function prepareForUpload(blob, maxSide) {
  const url = URL.createObjectURL(blob);
  try {
    const img = await loadImage(url);
    return await drawToJpeg(img, img.naturalWidth, img.naturalHeight, maxSide);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Fetch a garment image passed in `?garment=` as a Blob.
 *
 * Same-origin images (the site's own product shots) always work. Cross-origin
 * ones only work if that host sends CORS headers — otherwise the canvas would
 * be tainted and the photo could not be uploaded — so the caller falls back to
 * asking the visitor to upload the image instead.
 */
export async function fetchGarmentImage(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl, window.location.href);
  } catch {
    throw new Error('That garment link is not a valid image address.');
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('That garment link is not a valid image address.');
  }

  let res;
  try {
    res = await fetch(url.href, {
      mode: url.origin === window.location.origin ? 'same-origin' : 'cors',
      credentials: 'omit',
    });
  } catch {
    throw new Error("Couldn't load the garment image from that link. Upload a photo of it instead.");
  }
  if (!res.ok) {
    throw new Error("Couldn't load the garment image from that link. Upload a photo of it instead.");
  }
  const blob = await res.blob();
  if (!blob.type.startsWith('image/')) {
    throw new Error("That garment link doesn't point to an image. Upload a photo of it instead.");
  }
  return blob;
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
}
