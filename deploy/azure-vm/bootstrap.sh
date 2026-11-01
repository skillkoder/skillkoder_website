#!/usr/bin/env bash
# =============================================================================
# SkillKoder backend — one-time setup of an Ubuntu 24.04 Azure VM
#
#   sudo API_DOMAIN=api.skillkoder.com BRANCH=feature/virtual-tryon bash bootstrap.sh
#
# Installs nginx + Python, clones the repo, creates the Django .env (random
# SECRET_KEY, SQLite database), migrates, seeds the courses, creates an admin
# user, and runs gunicorn under systemd behind nginx on port 80.
# HTTPS is added afterwards by enable-https.sh, once DNS points here.
#
# Safe to re-run: an existing .env, database and admin user are kept.
# =============================================================================
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/skillkoder/skillkoder_website.git}"
BRANCH="${BRANCH:-main}"
API_DOMAIN="${API_DOMAIN:-api.skillkoder.com}"
EXTRA_HOSTS="${EXTRA_HOSTS:-}"          # e.g. the VM's *.cloudapp.azure.com name, comma-separated
FRONTEND_ORIGINS="${FRONTEND_ORIGINS:-https://www.skillkoder.com,https://skillkoder.com}"

APP_USER=skillkoder
BASE=/srv/skillkoder
APP="$BASE/app"
VENV="$BASE/venv"
DATA="$BASE/data"
BACKEND="$APP/backend"
ENV_FILE="$BACKEND/.env"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log() { printf '\n==> %s\n' "$*"; }
[ "$(id -u)" -eq 0 ] || { echo "Run as root (sudo)." >&2; exit 1; }
export DEBIAN_FRONTEND=noninteractive

log "System packages"
apt-get update -q
apt-get install -y -q python3 python3-venv python3-dev build-essential git nginx \
  certbot python3-certbot-nginx sqlite3 curl

log "Swap (the free-tier VM has 1 GB RAM)"
if ! swapon --show | grep -q /swapfile; then
  fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

log "App user and folders"
id "$APP_USER" >/dev/null 2>&1 || useradd --system --home "$BASE" --shell /usr/sbin/nologin "$APP_USER"
mkdir -p "$BASE" "$DATA"
chown "$APP_USER":"$APP_USER" "$BASE" "$DATA"

log "Code ($REPO_URL @ $BRANCH)"
if [ -d "$APP/.git" ]; then
  sudo -u "$APP_USER" git -C "$APP" fetch --quiet origin "$BRANCH"
  sudo -u "$APP_USER" git -C "$APP" checkout --quiet -B "$BRANCH" "origin/$BRANCH"
else
  sudo -u "$APP_USER" git clone --quiet --branch "$BRANCH" "$REPO_URL" "$APP"
fi

log "Python environment"
[ -x "$VENV/bin/python" ] || sudo -u "$APP_USER" python3 -m venv "$VENV"
sudo -u "$APP_USER" "$VENV/bin/pip" install --quiet --upgrade pip
sudo -u "$APP_USER" "$VENV/bin/pip" install --quiet -r "$BACKEND/requirements.txt"

log "Django settings (.env)"
PUBLIC_IP="$(curl -s -m 5 -H Metadata:true \
  'http://169.254.169.254/metadata/instance/network/interface/0/ipv4/ipAddress/0/publicIpAddress?api-version=2021-02-01&format=text' || true)"
if [ ! -f "$ENV_FILE" ]; then
  SECRET="$("$VENV/bin/python" -c 'import secrets; print(secrets.token_urlsafe(50))')"
  HOSTS="$API_DOMAIN,localhost,127.0.0.1${EXTRA_HOSTS:+,$EXTRA_HOSTS}${PUBLIC_IP:+,$PUBLIC_IP}"
  CSRF="https://$API_DOMAIN,$FRONTEND_ORIGINS"
  for h in ${EXTRA_HOSTS//,/ }; do CSRF="$CSRF,https://$h"; done
  cat > "$ENV_FILE" <<EOF
# SkillKoder backend — production settings on the Azure VM (not in git)
SECRET_KEY=$SECRET
DEBUG=False
ALLOWED_HOSTS=$HOSTS
CORS_ALLOWED_ORIGINS=$FRONTEND_ORIGINS
CSRF_TRUSTED_ORIGINS=$CSRF
DATABASE_URL=sqlite:///$DATA/db.sqlite3

# Virtual Try-On GPU server (see VIRTUALTRYON.md). Empty = page shows "offline".
TRYON_SERVER_URL=
TRYON_API_KEY=
EOF
  chown "$APP_USER":"$APP_USER" "$ENV_FILE"
  chmod 600 "$ENV_FILE"
  echo "created $ENV_FILE"
else
  echo "keeping existing $ENV_FILE"
fi

manage() { sudo -u "$APP_USER" bash -c "cd '$BACKEND' && '$VENV/bin/python' manage.py $*"; }

log "Database, static files, course data"
manage migrate --noinput
manage collectstatic --noinput --verbosity 0
manage seed_courses
mkdir -p "$BACKEND/media" && chown "$APP_USER":"$APP_USER" "$BACKEND/media"

log "Admin user"
ADMIN_PASS_FILE=/root/skillkoder-admin-password.txt
if [ ! -f "$ADMIN_PASS_FILE" ]; then
  ADMIN_PASS="$("$VENV/bin/python" -c 'import secrets; print(secrets.token_urlsafe(14))')"
  if sudo -u "$APP_USER" env DJANGO_SUPERUSER_PASSWORD="$ADMIN_PASS" bash -c \
      "cd '$BACKEND' && '$VENV/bin/python' manage.py createsuperuser --noinput --username admin --email admin@skillkoder.com" 2>/dev/null; then
    echo "admin / $ADMIN_PASS" > "$ADMIN_PASS_FILE"
    chmod 600 "$ADMIN_PASS_FILE"
    echo "ADMIN LOGIN  username: admin  password: $ADMIN_PASS   (also saved in $ADMIN_PASS_FILE)"
  else
    echo "admin user already exists — password unchanged"
  fi
else
  echo "admin user already set up — see $ADMIN_PASS_FILE"
fi

log "gunicorn service"
install -m 644 "$HERE/skillkoder-backend.service" /etc/systemd/system/skillkoder-backend.service
systemctl daemon-reload
systemctl enable --now skillkoder-backend
systemctl restart skillkoder-backend

log "nginx"
SERVER_NAMES="$API_DOMAIN${EXTRA_HOSTS:+ ${EXTRA_HOSTS//,/ }}"
sed "s/__SERVER_NAMES__/$SERVER_NAMES/" "$HERE/nginx-skillkoder-api.conf" > /etc/nginx/sites-available/skillkoder-api
ln -sf /etc/nginx/sites-available/skillkoder-api /etc/nginx/sites-enabled/skillkoder-api
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

log "Check"
sleep 2
curl -s -o /dev/null -w "local API /api/v1/courses/ -> HTTP %{http_code}\n" \
  -H "Host: $API_DOMAIN" -H "X-Forwarded-Proto: https" http://127.0.0.1/api/v1/courses/
echo "Done. Public IP: ${PUBLIC_IP:-unknown}. Next: point DNS for $API_DOMAIN here, then run enable-https.sh."
