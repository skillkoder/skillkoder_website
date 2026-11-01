<#
  Installs the SkillKoder Virtual Try-On GPU server and (optionally) downloads its models.

    .\setup.ps1                 # install Python env + FASHN VTON, then download all models (~2.9 GB)
    .\setup.ps1 -SkipModels     # install only; models download on the server's first start

  Safe to re-run: finished steps are skipped or quickly re-checked.
  Needs: NVIDIA GPU (8 GB+), driver for CUDA 12.8 (570+), Python (any 3.x, for uv), Git.
#>
param([switch]$SkipModels)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$FashnRepo   = 'https://github.com/fashn-AI/fashn-vton-1.5.git'
$FashnCommit = '7c0f10a'
$Py          = Join-Path $PSScriptRoot '.venv-fashn\Scripts\python.exe'

function Step($text) { Write-Host "`n==> $text" -ForegroundColor Cyan }
function Run {
  param([string]$Exe, [string[]]$Arguments)
  & $Exe @Arguments
  if ($LASTEXITCODE -ne 0) { throw "Failed: $Exe $($Arguments -join ' ')" }
}

Step 'Checking tools'
foreach ($tool in 'python', 'git') {
  if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) { throw "$tool is not installed or not on PATH." }
}
if (Get-Command nvidia-smi -ErrorAction SilentlyContinue) {
  nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader
} else {
  Write-Warning 'nvidia-smi not found: an NVIDIA GPU and driver are required to run the server.'
}

# uv hard-links files by default, which fails inside OneDrive folders.
if ($PSScriptRoot -match 'OneDrive') { $env:UV_LINK_MODE = 'copy' }

Step 'Installing uv'
Run python @('-m', 'pip', 'install', '--quiet', '--upgrade', 'uv')

Step 'Creating Python 3.12 environment (.venv-fashn)'
if (Test-Path $Py) { Write-Host 'already exists' } else { Run python @('-m', 'uv', 'venv', '--python', '3.12', '.venv-fashn') }

Step 'Installing PyTorch 2.11 with CUDA 12.8'
Run python @('-m', 'uv', 'pip', 'install', '--python', $Py, 'torch==2.11.0', 'torchvision==0.26.0',
  '--index-url', 'https://download.pytorch.org/whl/cu128')

Step 'Installing packages from requirements-fashn.txt'
Run python @('-m', 'uv', 'pip', 'install', '--python', $Py, '-r', 'requirements-fashn.txt')

Step "Getting FASHN VTON v1.5 source (commit $FashnCommit)"
if (-not (Test-Path 'vendor\fashn-vton\.git')) {
  Run git @('clone', '--quiet', $FashnRepo, 'vendor\fashn-vton')
}
Run git @('-C', 'vendor\fashn-vton', 'checkout', '--quiet', $FashnCommit)

Step 'Installing FASHN VTON (without its non-commercial human parser)'
Run python @('-m', 'uv', 'pip', 'install', '--python', $Py, '--no-deps', '-e', 'vendor\fashn-vton')

Step 'Checking the GPU is usable'
Run $Py @('-c', "import torch, onnxruntime as o; ok = torch.cuda.is_available() and 'CUDAExecutionProvider' in o.get_available_providers(); print('torch', torch.__version__, '| cuda', torch.cuda.is_available(), '| onnxruntime', o.__version__, o.get_available_providers()); raise SystemExit(0 if ok else 'GPU not usable: update the NVIDIA driver (CUDA 12.8 needs 570+).')")

if ($SkipModels) {
  Write-Host "`nModels skipped; they download on the first start (~2.9 GB)."
} else {
  Step 'Downloading models: FASHN VTON, DWPose, IS-Net, SAM 2.1 (~2.9 GB, skipped if present)'
  Run $Py @('-c', "import tryon_server, garment_prep; from huggingface_hub import snapshot_download; tryon_server.download_weights(); snapshot_download(garment_prep.SAM_REPO, revision=garment_prep.SAM_REVISION); print('all models present')")
}

Write-Host "`nDone. Start the server with:  .\start.ps1" -ForegroundColor Green
