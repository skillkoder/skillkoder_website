<#
  Starts everything that makes this PC the SkillKoder server:
    1. Virtual Try-On GPU server   127.0.0.1:8002   (run-tryon.cmd   -> gpu-server\start.ps1)
    2. Django backend (production) 127.0.0.1:8001   (run-backend.cmd -> start-backend.ps1)
    3. Cloudflare tunnel           api.skillkoder.com -> 127.0.0.1:8001   (run-tunnel.cmd)

  Each runs in its own minimized window and restarts if it exits.
  Logs: %USERPROFILE%\skillkoder-server\logs\
  Stop: .\stop-all.ps1
#>
foreach ($name in 'tryon', 'backend', 'tunnel') {
  $cmd = Join-Path $PSScriptRoot "run-$name.cmd"
  Start-Process cmd.exe -WindowStyle Minimized -ArgumentList '/c', "`"$cmd`""
  Write-Host "Started $name"
}
Write-Host "Logs: $env:USERPROFILE\skillkoder-server\logs"
