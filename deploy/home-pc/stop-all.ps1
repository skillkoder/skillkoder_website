# Stops the windows opened by start-all.ps1 (try-on, backend, tunnel) and everything they started.
$found = Get-CimInstance Win32_Process -Filter "Name = 'cmd.exe'" |
  Where-Object { $_.CommandLine -match 'run-(tryon|backend|tunnel)\.cmd' }
foreach ($p in $found) {
  taskkill /PID $p.ProcessId /T /F | Out-Null
  Write-Host "Stopped PID $($p.ProcessId): $($p.CommandLine)"
}
if (-not $found) { Write-Host 'Nothing to stop.' }
