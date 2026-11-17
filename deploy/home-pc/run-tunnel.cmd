@echo off
rem Runs the Cloudflare tunnel (api.skillkoder.com -> 127.0.0.1:8001) and restarts it if it exits.
rem Started by start-all.ps1. Tunnel config: %USERPROFILE%\.cloudflared\config.yml
title SkillKoder - tunnel
set LOG=%USERPROFILE%\skillkoder-server\logs\tunnel.log
if not exist "%USERPROFILE%\skillkoder-server\logs" mkdir "%USERPROFILE%\skillkoder-server\logs"
:loop
echo [%date% %time%] starting tunnel>> "%LOG%"
"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --no-autoupdate run skillkoder-home >> "%LOG%" 2>&1
echo Exited; restarting in 10 s...
timeout /t 10 /nobreak >nul
goto loop
