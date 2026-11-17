# Backend + Virtual Try-On on the home PC (Cloudflare Tunnel)

```
www.skillkoder.com (GitHub Pages)  ──HTTPS──►  api.skillkoder.com (Cloudflare)
                                                  │ tunnel "skillkoder-home" (outbound from the PC;
                                                  │ works with a changing home IP, no port-forwarding)
                                                  ▼
                                    this PC: waitress + Django   127.0.0.1:8001
                                               └─ try-on GPU server  127.0.0.1:8002
```

DNS for `skillkoder.com` is on Cloudflare (nameservers changed at GoDaddy; the domain is still
registered there). `api` is a tunnel CNAME created by `cloudflared tunnel route dns`. The GitHub
Pages records (`@` A ×4, `www` CNAME) should be **DNS only** (grey cloud).

## Start / stop

```powershell
.\deploy\home-pc\start-all.ps1     # try-on + backend + tunnel, each in a minimized window that auto-restarts
.\deploy\home-pc\stop-all.ps1
```

The site's API and try-on work only while the PC is on, awake and online with these running.

## Files outside the repo

| Path | What |
|---|---|
| `%USERPROFILE%\skillkoder-server\server.env` | production settings (SECRET_KEY, hosts, CORS, DB path, try-on key) — secret |
| `%USERPROFILE%\skillkoder-server\data\db.sqlite3` | production database (kept out of OneDrive) |
| `%USERPROFILE%\skillkoder-server\media\` | uploaded files (course banners) |
| `%USERPROFILE%\skillkoder-server\logs\` | `tryon.log`, `backend.log`, `tunnel.log` |
| `%USERPROFILE%\.cloudflared\` | tunnel `config.yml`, credentials JSON, `cert.pem` — secret |

`server.env` values override `backend\.env`, which remains the local-development config
(`python manage.py runserver` on :8000 still works alongside this).

## Notes

- Cloudflare cuts off any request after 100 s, and a try-on takes 65–100 s. So the page uses job
  mode: `POST /api/v1/virtualtryon/?async=1` → `202 {"job": id}`, then polls
  `GET /api/v1/virtualtryon/jobs/<id>/` until it returns the PNG. Jobs live in the backend
  process's memory, so the backend must stay a single process (waitress, not several workers).
- Rate limiting uses Cloudflare's `CF-Connecting-IP` header for the visitor's address.
- Admin: https://api.skillkoder.com/admin/login
