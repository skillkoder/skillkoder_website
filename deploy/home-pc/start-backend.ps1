<#
  Runs the SkillKoder Django backend in production mode on this PC (waitress on 127.0.0.1:8001).
  The Cloudflare tunnel publishes it as https://api.skillkoder.com.

  Settings come from %USERPROFILE%\skillkoder-server\server.env (outside OneDrive and git).
  Values there override backend\.env, which stays as the local-development config.
#>
param([int]$Port = 8001)

$ErrorActionPreference = 'Stop'
$Root    = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$Backend = Join-Path $Root 'backend'
$Py      = Join-Path $Backend 'venv\Scripts\python.exe'
$EnvFile = Join-Path $env:USERPROFILE 'skillkoder-server\server.env'

if (-not (Test-Path $EnvFile)) { throw "Missing $EnvFile (production settings)." }
foreach ($line in Get-Content $EnvFile) {
  if ($line -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=(.*)$') {
    [Environment]::SetEnvironmentVariable($Matches[1], $Matches[2].Trim(), 'Process')
  }
}

Set-Location $Backend
& $Py manage.py migrate --noinput
if ($LASTEXITCODE -ne 0) { throw 'migrate failed' }
& $Py manage.py collectstatic --noinput -v 0
if ($LASTEXITCODE -ne 0) { throw 'collectstatic failed' }

Write-Host "Backend (production) on http://127.0.0.1:$Port"
# One process, several threads: try-on jobs are kept in this process's memory.
& $Py -m waitress --listen="127.0.0.1:$Port" --threads=8 skillkoder_project.wsgi:application
