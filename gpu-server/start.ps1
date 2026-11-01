<#
  Starts the SkillKoder Virtual Try-On GPU server.

    .\start.ps1                 # port 8002, key from $env:TRYON_API_KEY or ..\backend\.env
    .\start.ps1 -Port 8003 -Steps 20

  The key must equal TRYON_API_KEY in the website backend's settings, or the page shows
  "offline". On the PC that also runs the website, it is read from ..\backend\.env automatically.
  Run .\setup.ps1 first.
#>
param(
  [int]$Port = 8002,
  [ValidateRange(10, 50)][int]$Steps = 30
)

$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot

$Py = Join-Path $PSScriptRoot '.venv-fashn\Scripts\python.exe'
if (-not (Test-Path $Py)) { throw 'Python environment missing. Run .\setup.ps1 first.' }

if (-not $env:TRYON_API_KEY) {
  $backendEnv = Join-Path $PSScriptRoot '..\backend\.env'
  if (Test-Path $backendEnv) {
    $line = Get-Content $backendEnv | Where-Object { $_ -match '^\s*TRYON_API_KEY\s*=' } | Select-Object -Last 1
    if ($line) { $env:TRYON_API_KEY = ($line -split '=', 2)[1].Trim().Trim('"', "'") }
  }
}
if (-not $env:TRYON_API_KEY) {
  throw ('No TRYON_API_KEY. Set it first, e.g.:  $env:TRYON_API_KEY = "<same secret as the website backend>"' +
         '   (or add TRYON_API_KEY=... to ..\backend\.env)')
}

$env:PORT = "$Port"
$env:TRYON_STEPS = "$Steps"
Write-Host "Starting try-on server on http://127.0.0.1:$Port  ($Steps steps; key ends ...$($env:TRYON_API_KEY.Substring([Math]::Max(0, $env:TRYON_API_KEY.Length - 4))))"
& $Py -u tryon_server.py
