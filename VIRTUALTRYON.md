# Virtual Try-On — GPU server setup

The `/virtualtryon` page needs a **try-on GPU server** running on a PC with an NVIDIA GPU. Its
code is in this repo under [`gpu-server/`](gpu-server/). This guide installs it with every model
it uses, then connects it to the website.

```
Browser ──► skillkoder.com/virtualtryon                    frontend/src/pages/VirtualTryOnPage.jsx
   └─ POST /api/v1/virtualtryon/                          backend/virtualtryon/views.py (holds the secret)
          │   header X-Tryon-Key: <secret>
          ▼
      TRYON_SERVER_URL/tryon                              gpu-server/tryon_server.py (on the GPU PC)
          ├─ garment photo worn by someone → find the "Which item?" piece (DWPose + SAM 2.1)
          ├─ cloth on its own → remove background (IS-Net)
          └─ FASHN VTON v1.5 try-on → PNG (about 65–100 s)
```

## What's in `gpu-server/`

| File | Purpose |
|---|---|
| `tryon_server.py` | The server: `POST /tryon`, `GET /health`, API-key check, one try-on at a time |
| `garment_prep.py` | Finds the chosen item in the garment photo; removes backgrounds |
| `fashn_stubs/fashn_human_parser.py` | Stand-in for FASHN's non-commercial human parser (do not replace it) |
| `requirements-fashn.txt` | Pinned Python packages |
| `setup.ps1` | Installs everything and downloads the models |
| `start.ps1` | Starts the server (reads the key from `backend/.env` if not set) |

Not committed (see `gpu-server/.gitignore`), created by `setup.ps1`: `.venv-fashn/` (Python
environment), `vendor/fashn-vton/` (FASHN source), `checkpoints/` (models).

---

## 1. Requirements

| Item | Needed |
|---|---|
| OS | Windows 10/11 (scripts are PowerShell) |
| GPU | NVIDIA, **8 GB VRAM or more** (uses ~7.3 GB while running) |
| NVIDIA driver | New enough for CUDA 12.8 (570 or newer). Check with `nvidia-smi` |
| Python | Any Python 3 on PATH (only used to install `uv`; `uv` fetches Python 3.12 itself) |
| Git | To download the FASHN VTON source |
| Disk | About 8 GB (Python packages ~5 GB + models ~2.9 GB) |
| Internet | For the install and the model download |

Tested on: RTX 5050 Laptop (8 GB), driver 610.60, torch 2.11.0+cu128, onnxruntime-gpu 1.22.0.

---

## 2. Install (one command)

```powershell
cd gpu-server
.\setup.ps1
```

This installs `uv`, creates `.venv-fashn` (Python 3.12), installs CUDA PyTorch and the pinned
packages, downloads FASHN VTON v1.5 (commit `7c0f10a`), checks the GPU is usable, and downloads
all models. It is safe to re-run. Use `.\setup.ps1 -SkipModels` to let the server download the
models on its first start instead.

If PowerShell refuses to run scripts: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` (once).

<details>
<summary>Manual install (what setup.ps1 runs)</summary>

```powershell
cd gpu-server
python -m pip install --upgrade uv
$env:UV_LINK_MODE = "copy"                 # only needed inside OneDrive folders

python -m uv venv --python 3.12 .venv-fashn
python -m uv pip install --python .venv-fashn\Scripts\python.exe torch==2.11.0 torchvision==0.26.0 --index-url https://download.pytorch.org/whl/cu128
python -m uv pip install --python .venv-fashn\Scripts\python.exe -r requirements-fashn.txt
git clone https://github.com/fashn-AI/fashn-vton-1.5.git vendor\fashn-vton
git -C vendor\fashn-vton checkout 7c0f10a
# --no-deps keeps out fashn-human-parser (non-commercial weights); fashn_stubs\ replaces it
python -m uv pip install --python .venv-fashn\Scripts\python.exe --no-deps -e vendor\fashn-vton

# GPU check — expect "cuda True" and CUDAExecutionProvider
.venv-fashn\Scripts\python.exe -c "import torch, onnxruntime as o; print('torch', torch.__version__, 'cuda', torch.cuda.is_available(), '| onnxruntime', o.__version__, o.get_available_providers())"
```
</details>

---

## 3. Models

`setup.ps1` downloads them; the server also downloads any that are missing on start. To
(re)download them on their own:

```powershell
cd gpu-server
.venv-fashn\Scripts\python.exe -c "import tryon_server, garment_prep; from huggingface_hub import snapshot_download; tryon_server.download_weights(); snapshot_download(garment_prep.SAM_REPO, revision=garment_prep.SAM_REVISION); print('all models present')"
```

| Model | Job | Saved to | Licence |
|---|---|---|---|
| `fashn-ai/fashn-vton-1.5` (`model.safetensors`) | The try-on itself | `gpu-server\checkpoints\fashn\` | Apache-2.0 |
| `fashn-ai/DWPose` (`yolox_l.onnx`, `dw-ll_ucoco_384.onnx`) | Body pose; spots people in garment photos | `gpu-server\checkpoints\fashn\dwpose\` | Apache-2.0 |
| IS-Net general-use (`isnet-general-use.onnx`, from rembg) | Removes the garment photo's background (SHA-256 checked) | `gpu-server\checkpoints\fashn\` | Apache-2.0 |
| `facebook/sam2.1-hiera-base-plus` (pinned revision) | Finds the chosen item on someone wearing it | Hugging Face cache (`%USERPROFILE%\.cache\huggingface`) | Apache-2.0 |

All four allow commercial use. FASHN's own human parser (NVIDIA non-commercial licence) is
deliberately **not** installed. Not legal advice — have someone review licences before a large
commercial launch. Optional: `$env:HF_TOKEN = "<Hugging Face token>"` for faster downloads.

---

## 4. Start the server

The server and the website backend must share **one secret**. On the PC that runs the website,
put it in `backend\.env` once and `start.ps1` reads it from there:

```powershell
# one-time: create a secret and add it to backend\.env (with TRYON_SERVER_URL)
$key = [guid]::NewGuid().ToString("N") + [guid]::NewGuid().ToString("N")
Add-Content backend\.env "TRYON_SERVER_URL=http://127.0.0.1:8002"
Add-Content backend\.env "TRYON_API_KEY=$key"

# every time
cd gpu-server
.\start.ps1                       # options: -Port 8003  -Steps 20
```

On a GPU PC without the website, set the key first: `$env:TRYON_API_KEY = "<secret>"; .\start.ps1`.
Wait for `[tryon] FASHN VTON ready in …s`, and close other GPU-heavy apps while it runs.

| Variable | Default | Effect |
|---|---|---|
| `TRYON_API_KEY` | from `backend\.env` | Shared secret. **Required** by `start.ps1` |
| `PORT` (`-Port`) | `8002` | Port to listen on |
| `TRYON_STEPS` (`-Steps`) | `30` | `20` ≈ a third faster, `50` = best quality |
| `HOST` | `127.0.0.1` | Keep this; use a tunnel (step 5) instead of opening the port |
| `TRYON_WEIGHTS_DIR` | `gpu-server\checkpoints\fashn` | Use model files from another folder |

---

## 5. Connect the website

The backend reads two **server-only** variables (never put them in the frontend):
`TRYON_SERVER_URL` and `TRYON_API_KEY` (the same secret as the server).

**Local development** — `backend\.env` from step 4 is all you need. Restart
`python manage.py runserver` after changing it.

**Production** (backend on Azure, GPU server on your PC) — expose the port with a tunnel:

```powershell
winget install Cloudflare.cloudflared
cloudflared tunnel --url http://127.0.0.1:8002      # prints https://<random>.trycloudflare.com
```

In Azure → App Service `skillkoder-backend` → **Settings → Environment variables**, add
`TRYON_SERVER_URL` (the https tunnel URL) and `TRYON_API_KEY`, then restart the app. Quick tunnels
get a new URL on every restart; use a named Cloudflare tunnel for a fixed one. The PC must stay on
with the server running, or the page shows "offline". Azure cuts requests off at ~230 s, so a
try-on that waits behind several others in the queue can time out.

---

## 6. Check it works

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
| Page says **offline**, GPU server is running | The server and `backend\.env` use different `TRYON_API_KEY`s (the server answers 401). Start it with `.\start.ps1` so it reads the same key |
| Page says **offline**, `curl` to `:8002` fails | Server not running, still loading/downloading models, or wrong `TRYON_SERVER_URL` / tunnel URL |
| `setup.ps1` stops at "GPU not usable" | NVIDIA driver too old for CUDA 12.8 (needs 570+), or no NVIDIA GPU |
| Error 507 / "out of GPU memory" | Close other GPU apps, or `.\start.ps1 -Steps 20` |
| 422 "Couldn't find the item chosen under "Which item?"…" | That item isn't visible in the garment photo (e.g. **Top** for a trousers-only photo) — pick another item or photo |
| `uv` hard-link / access errors in OneDrive | Set `$env:UV_LINK_MODE = "copy"` (setup.ps1 does this automatically in OneDrive folders) |
| Port 8002 already in use | Another copy is running — stop it, or `.\start.ps1 -Port 8003` and update `TRYON_SERVER_URL` |
| "running scripts is disabled on this system" | `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
