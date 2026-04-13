# SkillKoder — Deployment Guide

## Architecture Overview

```
GitHub Pages (skillkoder.com)          AWS EC2 (api.skillkoder.com)
┌─────────────────────────┐            ┌──────────────────────────────┐
│  React SPA (frontend)   │  HTTPS     │  Nginx                       │
│  - Course landing pages │ ─────────► │  ├── /api/v1/  → Gunicorn   │
│  - Hash-based routing   │            │  ├── /admin/   → Gunicorn   │
│  - JWT auth             │            │  ├── /media/   → EBS disk   │
└─────────────────────────┘            │  └── /static/  → EBS disk   │
                                       │       ↓                      │
                                       │  Gunicorn → Django (DRF)     │
                                       │       ↓                      │
                                       │  PostgreSQL                  │
                                       └──────────────────────────────┘
```

---

## Part 1 — AWS EC2 Setup

### 1.1 Launch EC2 Instance
- **AMI**: Ubuntu Server 22.04 LTS
- **Instance type**: t3.micro (free tier) or t3.small for production
- **Storage**: EBS volume — **set "Delete on Termination = No"**
  > This protects your uploaded course images if you stop/start the instance.
- **Security Group**: open ports 22 (SSH), 80 (HTTP), 443 (HTTPS)

### 1.2 Connect and Install Dependencies
```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Install Python, pip, Nginx, PostgreSQL
sudo apt install -y python3 python3-pip python3-venv nginx postgresql postgresql-contrib

# Start & enable Nginx and PostgreSQL
sudo systemctl enable nginx postgresql
sudo systemctl start nginx postgresql
```

### 1.3 Create PostgreSQL Database
```bash
sudo -u postgres psql

-- Inside psql:
CREATE DATABASE skillkoder_db;
CREATE USER skillkoder_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE skillkoder_db TO skillkoder_user;
\q
```

### 1.4 Create Media and Static Directories (on EBS)
```bash
sudo mkdir -p /var/www/skillkoder/media
sudo mkdir -p /var/www/skillkoder/staticfiles
sudo chown -R ubuntu:ubuntu /var/www/skillkoder
```

---

## Part 2 — Deploy Django Backend

### 2.1 Clone / Upload the Repository
```bash
# Option A: Git clone
git clone https://github.com/YOUR_USERNAME/skillkoder_website.git /home/ubuntu/skillkoder

# Option B: SCP from local machine
scp -i your-key.pem -r ./backend ubuntu@YOUR_EC2_IP:/home/ubuntu/skillkoder/backend
```

### 2.2 Set Up Python Virtual Environment
```bash
cd /home/ubuntu/skillkoder/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2.3 Create Production .env File
```bash
cp .env.example .env
nano .env
```

Fill in these values for production:
```
SECRET_KEY=<generate with: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())">
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,YOUR_EC2_PUBLIC_IP,api.skillkoder.com

DB_NAME=skillkoder_db
DB_USER=skillkoder_user
DB_PASSWORD=your-secure-password
DB_HOST=localhost
DB_PORT=5432

MEDIA_ROOT=/var/www/skillkoder/media
STATIC_ROOT=/var/www/skillkoder/staticfiles

CORS_ALLOWED_ORIGINS=https://skillkoder.com,https://www.skillkoder.com
```

### 2.4 Run Migrations and Collect Static Files
```bash
source venv/bin/activate
python manage.py migrate
python manage.py collectstatic --noinput
```

### 2.5 Create Django Superuser (Admin Portal)
```bash
python manage.py createsuperuser
# Enter: username, email, password
# Login at: http://api.skillkoder.com/admin/login
```

### 2.6 Set Up Gunicorn systemd Service
```bash
sudo nano /etc/systemd/system/skillkoder.service
```

Paste:
```ini
[Unit]
Description=SkillKoder Gunicorn Application Server
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/skillkoder/backend
Environment="PATH=/home/ubuntu/skillkoder/backend/venv/bin"
EnvironmentFile=/home/ubuntu/skillkoder/backend/.env
ExecStart=/home/ubuntu/skillkoder/backend/venv/bin/gunicorn \
    --access-logfile - \
    --workers 3 \
    --bind 127.0.0.1:8000 \
    skillkoder_project.wsgi:application
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable skillkoder
sudo systemctl start skillkoder
sudo systemctl status skillkoder  # should show "active (running)"
```

### 2.7 Configure Nginx
```bash
sudo cp /home/ubuntu/skillkoder/nginx/skillkoder_nginx.conf \
        /etc/nginx/sites-available/skillkoder

# Edit the file to replace YOUR_EC2_PUBLIC_IP with your actual IP
sudo nano /etc/nginx/sites-available/skillkoder

sudo ln -s /etc/nginx/sites-available/skillkoder \
           /etc/nginx/sites-enabled/skillkoder

# Remove default nginx site if it conflicts
sudo rm -f /etc/nginx/sites-enabled/default

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### 2.8 (Optional) Add SSL with Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.skillkoder.com
# Certbot auto-updates Nginx for HTTPS redirect
```

---

## Part 3 — Frontend (GitHub Pages)

### 3.1 Configure the API URL
Create a `.env.production` file in the project root:
```bash
# skillkoder_website/.env.production
REACT_APP_API_URL=https://api.skillkoder.com/api/v1
```

For local development, create `.env.development`:
```bash
REACT_APP_API_URL=http://localhost:8000/api/v1
```

### 3.2 Build and Deploy to GitHub Pages
```bash
# From the project root (skillkoder_website/)
npm run deploy
# This runs: npm run build → gh-pages -d build
```

The site deploys to: **https://skillkoder.com**

---

## Part 4 — Seed Initial Course Data (Optional)

Create `backend/courses/fixtures/initial_courses.json` and run:
```bash
python manage.py loaddata initial_courses
```

Or use the Django admin at `/admin/login` to create courses manually.

---

## Part 5 — EBS Backup Strategy

Since images are stored on EC2 EBS (not S3):

```bash
# Create an EBS snapshot from the AWS Console:
# EC2 → Volumes → Select your volume → Actions → Create Snapshot

# Or via AWS CLI:
aws ec2 create-snapshot \
  --volume-id vol-XXXXXXXXXX \
  --description "SkillKoder media backup $(date +%Y-%m-%d)"
```

Set up a cron job on EC2 for weekly snapshots:
```bash
crontab -e
# Add:
0 2 * * 0 aws ec2 create-snapshot --volume-id vol-XXXXXXXXXX --description "Weekly backup"
```

---

## Quick Reference: Key URLs

| URL | Purpose |
|-----|---------|
| `https://skillkoder.com` | React frontend (GitHub Pages) |
| `https://api.skillkoder.com/admin/login` | Django admin portal |
| `https://api.skillkoder.com/api/v1/courses/` | List courses (public) |
| `https://api.skillkoder.com/api/v1/courses/<slug>/` | Course detail (public) |
| `https://api.skillkoder.com/api/v1/auth/token/` | JWT login |
| `https://api.skillkoder.com/api/v1/auth/refresh/` | JWT refresh |
| `https://api.skillkoder.com/media/` | Uploaded images (Nginx) |

---

## Quick Reference: Common Commands (on EC2)

```bash
# Restart Django
sudo systemctl restart skillkoder

# View Django logs
sudo journalctl -u skillkoder -f

# Reload Nginx
sudo systemctl reload nginx

# Run Django management commands
cd /home/ubuntu/skillkoder/backend
source venv/bin/activate
python manage.py <command>
```
