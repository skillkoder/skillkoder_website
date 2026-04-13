@echo off
echo ================================================
echo  SkillKoder Backend — Local Dev Server
echo ================================================

cd /d "%~dp0"

if not exist "venv\Scripts\activate.bat" (
    echo [ERROR] venv not found. Run setup first:
    echo   py -3.13 -m venv venv
    echo   venv\Scripts\pip install -r requirements.txt
    pause
    exit /b 1
)

call venv\Scripts\activate.bat

echo [OK] Virtual environment activated
echo [OK] Starting Django server on http://127.0.0.1:8000

echo.
echo   Admin portal :  http://127.0.0.1:8000/admin/login
echo   Courses API  :  http://127.0.0.1:8000/api/v1/courses/
echo   JWT login    :  POST http://127.0.0.1:8000/api/v1/auth/token/
echo.
echo   Admin creds  :  admin / Admin@1234
echo   (change password after first login)
echo.
echo Press Ctrl+C to stop the server.
echo ================================================

python manage.py runserver
