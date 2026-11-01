# Virtual Try-On — GPU server setup

The `/virtualtryon` page needs a **try-on GPU server** running on a PC with an NVIDIA GPU. This
guide installs that server and every model it uses, then connects it to the website.

```
Browser ──► skillkoder.com/virtualtryon                    (frontend, this repo)
   └─ POST /api/v1/virtualtryon/                          (Django proxy, this repo: backend/virtualtryon/)
          │   header X-Tryon-Key: <secret>
          ▼
      TRYON_SERVER_URL/tryon                              (tryon_server.py on the GPU PC — NOT in this repo)
```

> **The GPU server code is not in this repository.** It lives in the Attire project at
> `attire\apps\local-ai\`. That folder is not under version control — back it up (or put it in its
> own git repo) so it can be reinstalled on another PC.

---

## 1. Requirements

| Item | Needed |
|---|---|
| OS | Windows 10/11 (commands below are PowerShell) |
| GPU | NVIDIA, **8 GB VRAM or more** (uses ~7.3 GB while running) |
| NVIDIA driver | Recent enough for CUDA 12.8 (driver 570 or newer). Check with `nvidia-smi` |
| Python | 3.12 (installed automatically by `uv` in step 3 if missing) |
| Git | To download the FASHN VTON source |
| Disk | About 8 GB (Python packages ~5 GB + models ~2.9 GB) |
| Internet | For the first install and the first start (model downloads) |

Tested on: RTX 5050 Laptop (8 GB), driver 610.60, torch 2.11.0+cu128, onnxruntime-gpu 1.22.0.

---

## 2. Get the server files

Copy these from `attire\apps\local-ai\` into a folder on the GPU PC (for example
`C:\tryon\local-ai\`). Everything else in that folder is not needed for the website.

| File / folder | Purpose |
|---|---|
| `tryon_server.py` | The server: `/tryon` and `/health`, API-key check |
| `garment_prep.py` | Finds the chosen item in the garment photo; removes backgrounds |
| `fashn_stubs\` | Stand-in for FASHN's non-commercial human parser (do not replace it) |
| `requirements-fashn.txt` | Pinned Python packages |

All commands below run **inside that folder**.

---

## 3. Install the Python environment

```powershell
cd C:\tryon\local-ai                       # the folder from step 2

# uv: fast installer that also fetches Python 3.12 if needed
python -m pip install --upgrade uv

# Only needed when the folder is inside OneDrive (avoids hard-link errors)
$env:UV_LINK_MODE = "copy"

# 1) Separate virtual environment, Python 3.12
python -m uv venv --python 3.12 .venv-fashn

# 2) PyTorch with CUDA 12.8 (must come first, from PyTorch's own index)
python -m uv pip install --python .venv-fashn\Scripts\python.exe torch==2.11.0 torchvision==0.26.0 --index-url https://download.pytorch.org/whl/cu128

# 3) Everything else (onnxruntime-gpu, transformers, fastapi, ...)
python -m uv pip install --python .venv-fashn\Scripts\python.exe -r requirements-fashn.txt

# 4) FASHN VTON v1.5 source, pinned to the tested commit
git clone https://github.com/fashn-AI/fashn-vton-1.5.git vendor\fashn-vton
git -C vendor\fashn-vton checkout 7c0f10a

# 5) Install it WITHOUT its dependencies — this keeps out fashn-human-parser,
#    whose weights are non-commercial (fashn_stubs\ replaces it)
python -m uv pip install --python .venv-fashn\Scripts\python.exe --no-deps -e vendor\fashn-vton
```

Check that the GPU is visible (expect `cuda True` and `CUDAExecutionProvider`):

```powershell
.venv-fashn\Scripts\python.exe -c "import torch, onnxruntime as o; print('torch', torch.__version__, 'cuda', torch.cuda.is_available(), '| onnxruntime', o.__version__, o.get_available_providers())"
```

---

## 4. Install the models

The server downloads every model **automatically on its first start** (about 2.9 GB). To download
them ahead of time instead — useful before a demo or on a slow connection — run:

```powershell
.venv-fashn\Scripts\python.exe -c "import tryon_server, garment_prep; from huggingface_hub import snapshot_download; tryon_server.download_weights(); snapshot_download(garment_prep.SAM_REPO, revision=garment_prep.SAM_REVISION); print('all models present')"
```

It is safe to re-run: models already on disk are skipped.

| Model | Job | Saved to | Licence |
|---|---|---|---|
| `fashn-ai/fashn-vton-1.5` (`model.safetensors`) | The try-on itself | `checkpoints\fashn\` | Apache-2.0 |
| `fashn-ai/DWPose` (`yolox_l.onnx`, `dw-ll_ucoco_384.onnx`) | Body pose; spots people in garment photos | `checkpoints\fashn\dwpose\` | Apache-2.0 |
| IS-Net general-use (`isnet-general-use.onnx`, from rembg) | Removes the garment photo's background (SHA-256 checked) | `checkpoints\fashn\` | Apache-2.0 |
| `facebook/sam2.1-hiera-base-plus` (pinned revision) | Finds the chosen item on someone wearing it | Hugging Face cache (`%USERPROFILE%\.cache\huggingface`) | Apache-2.0 |

All four allow commercial use. FASHN's own human parser (NVIDIA non-commercial licence) is
deliberately **not** installed. Not legal advice — have someone review licences before a large
commercial launch.

Optional: set `$env:HF_TOKEN = "<your Hugging Face token>"` before downloading for faster,
less rate-limited downloads.

---

## 5. Start the server

```powershell
cd C:\tryon\local-ai

# Make a long random secret once and keep it — the website needs the SAME value
$env:TRYON_API_KEY = [guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
$env:TRYON_API_KEY                         # copy this value for step 6

$env:PORT = "8002"
.venv-fashn\Scripts\python.exe -u tryon_server.py
```

Wait for `[tryon] FASHN VTON ready in …s`. Optional settings:

| Variable | Default | Effect |
|---|---|---|
| `TRYON_API_KEY` | (none) | Shared secret. **Always set it** — without it anyone who reaches the port can use your GPU |
| `PORT` | `8002` | Port to listen on |
| `HOST` | `127.0.0.1` | Keep this; use a tunnel (step 6) instead of opening the port |
| `TRYON_STEPS` | `30` | `20` ≈ a third faster, `50` = best quality |

Close other GPU-heavy apps (games, the Attire studio's `server.py`) while it runs.

---

## 6. Connect the website

The website's backend reads two **server-only** variables (never put them in the frontend):

```
TRYON_SERVER_URL=<where the GPU server is reachable>
TRYON_API_KEY=<exactly the same secret as step 5>
```

**Local development** (website and GPU server on the same PC) — in `backend\.env`:

```
TRYON_SERVER_URL=http://127.0.0.1:8002
TRYON_API_KEY=<secret from step 5>
```

then restart `python manage.py runserver`.

**Production** (backend on Azure, GPU server on your PC) — expose the port with a tunnel:

```powershell
winget install Cloudflare.cloudflared
cloudflared tunnel --url http://127.0.0.1:8002      # prints https://<random>.trycloudflare.com
```

In Azure → App Service `skillkoder-backend` → **Settings → Environment variables**, add
`TRYON_SERVER_URL` (the https tunnel URL) and `TRYON_API_KEY`, then restart the app. Quick tunnels
get a new URL on every restart; use a named Cloudflare tunnel for a fixed one. The PC must stay on
with the server running, or the page shows "offline".

---

## 7. Check it works

```powershell
# GPU server directly (expect "ready": true)
curl.exe -H "X-Tryon-Key: <secret>" http://127.0.0.1:8002/health

# Through the website backend (expect {"ready": true, "busy": false})
curl.exe http://127.0.0.1:8000/api/v1/virtualtryon/health/
```

Then open `/virtualtryon`, add an outfit photo, pick **Which item?**, add your photo and click
**Try it on** — the result appears under the button after about 65–100 seconds.

---

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Page says **offline**, GPU server is running | `TRYON_API_KEY` differs between the server and `backend\.env` (the server answers 401). Restart one of them with the same value |
| Page says **offline**, `curl` to `:8002` fails | Server not running, still downloading models, or wrong `TRYON_SERVER_URL` / tunnel URL |
| `cuda False` in the step 3 check | NVIDIA driver too old for CUDA 12.8, or torch was installed without `--index-url …/cu128` — redo step 3.2 |
| Error 507 / "out of GPU memory" | Close other GPU apps; or set `$env:TRYON_STEPS = "20"` |
| "Couldn't find that garment in the photo" (422) | The item chosen under **Which item?** isn't visible in the garment photo (e.g. **Top** for a trousers-only photo) |
| `uv` hard-link / access errors in OneDrive | Set `$env:UV_LINK_MODE = "copy"` before installing |
| Port 8002 already in use | Another copy is running — stop it, or set `$env:PORT` and update `TRYON_SERVER_URL` |
