#!/usr/bin/env bash
# =============================================================================
# Deploys the latest backend code from GitHub to the VM.
#
#   sudo bash /srv/skillkoder/app/deploy/azure-vm/update.sh            # same branch
#   sudo BRANCH=main bash /srv/skillkoder/app/deploy/azure-vm/update.sh
#
# Keeps .env, the database and uploaded media. Takes a database backup first.
# =============================================================================
set -euo pipefail
BASE=/srv/skillkoder
APP="$BASE/app"
VENV="$BASE/venv"
BACKEND="$APP/backend"
[ "$(id -u)" -eq 0 ] || { echo "Run as root (sudo)." >&2; exit 1; }
BRANCH="${BRANCH:-$(sudo -u skillkoder git -C "$APP" rev-parse --abbrev-ref HEAD)}"

if [ -f "$BASE/data/db.sqlite3" ]; then
  mkdir -p "$BASE/backups"
  sqlite3 "$BASE/data/db.sqlite3" ".backup '$BASE/backups/db-$(date +%Y%m%d-%H%M%S).sqlite3'"
  ls -1t "$BASE"/backups/db-*.sqlite3 | tail -n +11 | xargs -r rm --   # keep the last 10
fi

sudo -u skillkoder git -C "$APP" fetch --quiet origin "$BRANCH"
sudo -u skillkoder git -C "$APP" checkout --quiet -B "$BRANCH" "origin/$BRANCH"
sudo -u skillkoder "$VENV/bin/pip" install --quiet -r "$BACKEND/requirements.txt"
sudo -u skillkoder bash -c "cd '$BACKEND' && '$VENV/bin/python' manage.py migrate --noinput && '$VENV/bin/python' manage.py collectstatic --noinput --verbosity 0"
install -m 644 "$APP/deploy/azure-vm/skillkoder-backend.service" /etc/systemd/system/skillkoder-backend.service
systemctl daemon-reload
systemctl restart skillkoder-backend
sleep 2
systemctl is-active skillkoder-backend
echo "Deployed $(sudo -u skillkoder git -C "$APP" log --oneline -1)"
