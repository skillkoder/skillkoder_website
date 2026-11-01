#!/usr/bin/env bash
# =============================================================================
# Adds a free Let's Encrypt HTTPS certificate for the API (auto-renewing).
#
#   sudo API_DOMAIN=api.skillkoder.com bash enable-https.sh
#
# Run AFTER the DNS "A" record for API_DOMAIN points to this VM's public IP.
# =============================================================================
set -euo pipefail
API_DOMAIN="${API_DOMAIN:-api.skillkoder.com}"
[ "$(id -u)" -eq 0 ] || { echo "Run as root (sudo)." >&2; exit 1; }

MY_IP="$(curl -s -m 5 -H Metadata:true \
  'http://169.254.169.254/metadata/instance/network/interface/0/ipv4/ipAddress/0/publicIpAddress?api-version=2021-02-01&format=text' || true)"
# Standard-SKU public IPs are often missing from the metadata service: ask an echo service instead.
[ -n "$MY_IP" ] || MY_IP="$(curl -s -4 -m 5 https://api.ipify.org || true)"
DNS_IP="$(getent ahostsv4 "$API_DOMAIN" | awk 'NR==1{print $1}')"
if [ "$DNS_IP" != "$MY_IP" ]; then
  echo "DNS for $API_DOMAIN points to '${DNS_IP:-nothing}', but this VM is $MY_IP."
  echo "Add/fix the A record at your domain registrar, wait a few minutes, then re-run."
  exit 1
fi

certbot --nginx -d "$API_DOMAIN" --non-interactive --agree-tos \
  --register-unsafely-without-email --redirect
systemctl reload nginx
curl -s -o /dev/null -w "https://$API_DOMAIN/api/v1/courses/ -> HTTP %{http_code}\n" "https://$API_DOMAIN/api/v1/courses/"
echo "HTTPS enabled. Certificates renew automatically (systemctl list-timers | grep certbot)."
