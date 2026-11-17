@echo off
rem Runs the SkillKoder try-on GPU server and restarts it if it exits. Started by start-all.ps1.
title SkillKoder - try-on
set LOG=%USERPROFILE%\skillkoder-server\logs\tryon.log
if not exist "%USERPROFILE%\skillkoder-server\logs" mkdir "%USERPROFILE%\skillkoder-server\logs"
:loop
echo [%date% %time%] starting try-on server>> "%LOG%"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0..\..\gpu-server\start.ps1" >> "%LOG%" 2>&1
echo Exited; restarting in 10 s...
timeout /t 10 /nobreak >nul
goto loop
