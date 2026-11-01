# Backend on an Azure free-tier VM

```
www.skillkoder.com  (GitHub Pages, frontend/)  ──HTTPS──►  api.skillkoder.com  (Azure VM)
                                                             nginx :443 (Let's Encrypt)
                                                               └─ gunicorn (unix socket) → Django
                                                                    └─ SQLite  /srv/skillkoder/data/db.sqlite3
```

## The VM

| | |
|---|---|
| Subscription | Azure free trial (`nickrahju@gmail.com`), resource group `skillkoder-rg` |
| Region | South India |
| VM | `skillkoder-api`, Ubuntu 24.04, **Standard_B2ats_v2** (2 vCPU, 1 GB RAM + 2 GB swap) — free-account size, 750 h/month |
| Disk | 64 GB Premium SSD (P6) — free-account size |
| Public IP | `20.235.20.37` (static), also `skillkoder-api.southindia.cloudapp.azure.com` |
| Firewall (NSG) | 22 (SSH, key only), 80, 443 |
| SSH | `ssh azureuser@20.235.20.37` (key: `~/.ssh/id_rsa` on the PC that created it) |

On the VM:

| Path | What |
|---|---|
| `/srv/skillkoder/app` | git checkout of this repo |
| `/srv/skillkoder/app/backend/.env` | production settings (SECRET_KEY, hosts, CORS, try-on) — not in git |
| `/srv/skillkoder/data/db.sqlite3` | database |
| `/srv/skillkoder/backups/` | DB backups taken by `update.sh` (last 10) |
| `/root/skillkoder-admin-password.txt` | first admin password |
| `skillkoder-backend` (systemd) | gunicorn; logs: `journalctl -u skillkoder-backend -f` |

## First-time setup (already done for skillkoder-api)

```bash
# Create the VM (from a PC with the Azure CLI logged in)
az group create -n skillkoder-rg -l southindia
az vm create -g skillkoder-rg -n skillkoder-api -l southindia \
  --image Canonical:ubuntu-24_04-lts:server:latest --size Standard_B2ats_v2 \
  --admin-username azureuser --ssh-key-values ~/.ssh/id_rsa.pub \
  --os-disk-size-gb 64 --storage-sku Premium_LRS \
  --public-ip-sku Standard --public-ip-address-dns-name skillkoder-api --nsg-rule SSH
az vm open-port -g skillkoder-rg -n skillkoder-api --port 80,443 --priority 1010

# Install the backend on it
ssh azureuser@<VM IP>
sudo apt-get update && sudo apt-get install -y git
git clone --depth 1 --branch <branch> https://github.com/skillkoder/skillkoder_website.git /tmp/sk
sudo API_DOMAIN=api.skillkoder.com EXTRA_HOSTS=skillkoder-api.southindia.cloudapp.azure.com \
     BRANCH=<branch> bash /tmp/sk/deploy/azure-vm/bootstrap.sh
```

## HTTPS for api.skillkoder.com

1. At the registrar where `skillkoder.com` is managed, add a DNS record:
   **Type `A`, Name/Host `api`, Value `20.235.20.37`, TTL 600** (or lowest offered).
2. When `nslookup api.skillkoder.com` shows `20.235.20.37`, run on the VM:
   ```bash
   sudo bash /srv/skillkoder/app/deploy/azure-vm/enable-https.sh
   ```
   Free Let's Encrypt certificate, auto-renewed, http → https redirect.

## Deploy backend changes

```bash
ssh azureuser@20.235.20.37 'sudo bash /srv/skillkoder/app/deploy/azure-vm/update.sh'
# or another branch:  'sudo BRANCH=main bash /srv/skillkoder/app/deploy/azure-vm/update.sh'
```

## Frontend (GitHub Pages)

`frontend/src/services/api.js` defaults to `https://api.skillkoder.com/api/v1`, so a normal
`cd frontend && npm run deploy` publishes a site that talks to this VM. Deploy the frontend
only **after** HTTPS works on `api.skillkoder.com` — an `https://` page cannot call an
`http://` API.

## Admin portal

`https://api.skillkoder.com/admin/login` — user `admin`, password in
`/root/skillkoder-admin-password.txt` (`sudo cat` it). Change it after the first login
(Admin → Users → admin). Admin login only works over HTTPS (secure cookies).

## Virtual Try-On

Set `TRYON_SERVER_URL` (Cloudflare tunnel URL of the GPU PC) and `TRYON_API_KEY` in
`/srv/skillkoder/app/backend/.env`, then `sudo systemctl restart skillkoder-backend`.
See [VIRTUALTRYON.md](../../VIRTUALTRYON.md). The VM has no App Service 230 s limit; nginx and
gunicorn allow 300 s.

## Free-tier notes

- B2ats v2 and the 64 GB P6 disk are in the free account's 12-month allowance (750 VM hours a
  month = one VM running all month). Check *Cost Management* in the portal monthly.
- A **free trial** subscription (spending limit on) is disabled when its 30-day credit ends unless
  it is upgraded to pay-as-you-go; the 12-month free services continue only after upgrading.
  Upgrading removes the spending limit, so set a budget alert (Cost Management → Budgets).
- Back up `/srv/skillkoder/data/db.sqlite3` occasionally (or snapshot the disk).
