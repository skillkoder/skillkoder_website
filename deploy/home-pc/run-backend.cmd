@echo off
rem Runs the SkillKoder Django backend (production) and restarts it if it exits. Started by start-all.ps1.
title SkillKoder - backend
set LOG=%USERPROFILE%\skillkoder-server\logs\backend.log
if not exist "%USERPROFILE%\skillkoder-server\logs" mkdir "%USERPROFILE%\skillkoder-server\logs"
:loop
echo [%date% %time%] starting backend>> "%LOG%"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-backend.ps1" >> "%LOG%" 2>&1
echo Exited; restarting in 10 s...
timeout /t 10 /nobreak >nul
goto loop
