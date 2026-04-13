# SkillKoder — Local Development Guide

Quick reference for starting the frontend, backend, and accessing the admin portal.

---

## Directory Layout

```
skillkoder_website/           ← project root
├── frontend/                 ← React app lives here
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── node_modules/
├── backend/                  ← Django API lives here
│   ├── manage.py
│   ├── requirements.txt
│   ├── venv/
│   └── skillkoder_project/
├── nginx/                    ← EC2 Nginx config
├── DEPLOY.md                 ← Production deployment guide
└── RUNNING.md                ← This file
```

---

## 1. Backend (Django REST API)

Open a terminal inside the **`backend/`** folder.

### First-time setup (run once)

```bash
cd backend

# Create virtual environment  (requires Python 3.13)
py -3.13 -m venv venv

# Activate venv
venv\Scripts\activate          # Windows CMD
# OR
source venv/Scripts/activate   # Git Bash

# Install dependencies
pip install -r requirements.txt

# Create database tables
python manage.py makemigrations courses
python manage.py migrate

# Create admin superuser (no interactive prompt)
python -c "import django, os; os.environ.setdefault('DJANGO_SETTINGS_MODULE','skillkoder_project.settings'); django.setup(); from django.contrib.auth import get_user_model; U=get_user_model(); U.objects.filter(username='admin').exists() or U.objects.create_superuser('admin','admin@skillkoder.com','Admin@1234')"

# Seed the 3 courses into the database
python manage.py seed_courses
```

### Start backend (every time)

```bash
cd backend

# Activate venv
venv\Scripts\activate          # Windows CMD
# OR
source venv/Scripts/activate   # Git Bash

# Run server
python manage.py runserver
```

Backend runs at → **http://127.0.0.1:8000**

> **Windows shortcut:** double-click `backend\start_local.bat` — activates venv and starts the server automatically.

---

## 2. Frontend (React)

Open a **separate** terminal inside the **`frontend/`** folder.

### First-time setup (run once)

```bash
cd frontend
npm install
```

### Start frontend (every time)

```bash
cd frontend
npm start
```

Frontend runs at → **http://localhost:3000**

> Start the backend first. If it's not running, the site still loads using static fallback data but API features won't work.

---

## 3. Admin Portal

With the backend running, open:

```
http://127.0.0.1:8000/admin/login
```

| Field    | Value                   |
|----------|-------------------------|
| Username | `admin`                 |
| Password | `Admin@1234`            |

> Change this password after first login via **Admin → Users → admin → Change password**.

**What you can manage in the admin:**
- **Courses** — add, edit, delete courses; upload hero banners
- **Tools** — manage tool icons shown in course pages
- **SEO Metadata** — meta title, description, OG tags, FAQ schema per course

---

## 4. Running Both at Once (two terminals)

**Terminal 1 — Backend:**
```bash
cd backend
source venv/Scripts/activate
python manage.py runserver
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
```

---

## 5. Useful URLs

| URL | Description |
|-----|-------------|
| http://localhost:3000 | React frontend (home) |
| http://localhost:3000/courses | All courses page |
| http://localhost:3000/about | About page |
| http://localhost:3000/features | Features page |
| http://localhost:3000/contact | Contact page |
| http://127.0.0.1:8000/admin/login | Django admin portal |
| http://127.0.0.1:8000/api/v1/courses/ | Courses API (JSON) |
| http://127.0.0.1:8000/api/v1/auth/token/ | JWT login endpoint |

---

## 6. Common Backend Commands

Run these from inside `backend/` with the venv active.

```bash
# Re-seed courses (safe to run again — skips existing)
python manage.py seed_courses

# Reset and re-seed from scratch
python manage.py seed_courses --reset

# Apply new migrations after model changes
python manage.py makemigrations
python manage.py migrate

# Open Django shell
python manage.py shell

# Collect static files (production only)
python manage.py collectstatic

# Change admin password
python manage.py changepassword admin
```

## 7. Common Frontend Commands

Run these from inside `frontend/`.

```bash
# Install / update packages
npm install

# Start dev server
npm start

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

---

## 8. Deploy to Production

```bash
# Frontend → GitHub Pages (run from frontend/)
cd frontend
npm run deploy

# Backend → EC2
# See DEPLOY.md for the full step-by-step guide
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `venv\Scripts\activate` fails in PowerShell | Run `Set-ExecutionPolicy RemoteSigned` once as admin |
| `npm: command not found` in Git Bash | Run `export PATH="/c/Program Files/nodejs:$PATH"` first |
| `ModuleNotFoundError` on `runserver` | Venv not active — check that `(venv)` shows in your prompt |
| Port 8000 already in use | `python manage.py runserver 8001` and update `REACT_APP_API_URL` in `frontend/.env.development` |
| Port 3000 already in use | React asks to use a different port — press `Y` |
| Admin password forgotten | `python manage.py changepassword admin` |
| `npm install` errors | Make sure you are inside the `frontend/` folder, not the project root |
