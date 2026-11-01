"""
Virtual Try-On proxy views.

    POST /api/v1/virtualtryon/
        multipart/form-data: person (image), garment (image),
                             slot (top | outerwear | bottom | dress)
        → 200 image/png, or {"error": "..."} with a 4xx/5xx status

    GET  /api/v1/virtualtryon/health/
        → {"ready": bool, "busy": bool}   or   {"ready": false, "offline": true}

Privacy: uploads are read into memory only (see InMemoryOnlyUploadHandler) and
are never written to disk, the database or logs. The upstream URL and key never
appear in responses or log lines.

Configuration (server-only env vars, read through python-decouple):
    TRYON_SERVER_URL   e.g. http://127.0.0.1:8002 or a Cloudflare tunnel URL
    TRYON_API_KEY      shared secret, sent upstream as X-Tryon-Key
"""

import json
import logging
import secrets
import threading
import time
import urllib.error
import urllib.request
from collections import defaultdict, deque

from decouple import config
from django.core.files.uploadhandler import MemoryFileUploadHandler, StopUpload
from django.http import HttpResponse, JsonResponse
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

logger = logging.getLogger(__name__)

ALLOWED_SLOTS = {'top', 'outerwear', 'bottom', 'dress'}
MAX_IMAGE_BYTES = 10 * 1024 * 1024          # per image
MAX_REQUEST_BYTES = 2 * MAX_IMAGE_BYTES + 512 * 1024  # two images + form overhead

TRYON_TIMEOUT_S = 300   # generation is ~50 s, longer when others are queued
HEALTH_TIMEOUT_S = 3

RATE_LIMIT_REQUESTS = 10
RATE_LIMIT_WINDOW_S = 10 * 60

OFFLINE_MESSAGE = 'Virtual try-on is offline right now. Please try again later.'


def _settings():
    """Read lazily so a missing value disables the feature instead of crashing boot."""
    url = config('TRYON_SERVER_URL', default='').strip().rstrip('/')
    key = config('TRYON_API_KEY', default='').strip()
    return url, key


def _error(message, status):
    response = JsonResponse({'error': message}, status=status)
    response['Cache-Control'] = 'no-store'
    return response


# ---------------------------------------------------------------------------
# Rate limiting — small in-memory sliding window, per client IP, this route only.
# Per-process: with several gunicorn workers each keeps its own window, which
# is acceptable for a soft abuse guard in front of a one-request-at-a-time GPU.
# ---------------------------------------------------------------------------
_hits = defaultdict(deque)
_hits_lock = threading.Lock()


def _client_ip(request):
    # Azure App Service appends the real client address (as "ip:port") to the
    # end of X-Forwarded-For. Earlier entries are client-supplied and spoofable,
    # so only the last one is trusted.
    forwarded = request.META.get('HTTP_X_FORWARDED_FOR', '')
    if forwarded:
        ip = forwarded.split(',')[-1].strip()
        if ip.count(':') == 1:  # IPv4 with a port; leave bare IPv6 alone
            ip = ip.split(':')[0]
        if ip.startswith('[') and ']' in ip:  # [IPv6]:port
            ip = ip[1:ip.index(']')]
        if ip:
            return ip
    return request.META.get('REMOTE_ADDR', 'unknown')


def _rate_limited(ip):
    now = time.monotonic()
    with _hits_lock:
        window = _hits[ip]
        while window and now - window[0] > RATE_LIMIT_WINDOW_S:
            window.popleft()
        if len(window) >= RATE_LIMIT_REQUESTS:
            return True
        window.append(now)
        # Drop idle entries so the dict cannot grow without bound.
        if len(_hits) > 5000:
            for stale in [k for k, v in _hits.items() if not v or now - v[-1] > RATE_LIMIT_WINDOW_S]:
                del _hits[stale]
        return False


# ---------------------------------------------------------------------------
# Uploads — memory only, never a temp file on disk.
# ---------------------------------------------------------------------------
class InMemoryOnlyUploadHandler(MemoryFileUploadHandler):
    """
    Django's default handlers spill uploads above FILE_UPLOAD_MAX_MEMORY_SIZE
    (2.5 MB) to a temporary file on disk. Photos of people must not touch disk,
    so this handler always keeps the file in memory and aborts the upload once
    a single file passes MAX_IMAGE_BYTES (the whole request is already capped
    by the Content-Length check before parsing starts).
    """

    def handle_raw_input(self, input_data, META, content_length, boundary, encoding=None):
        self.activated = True

    def new_file(self, *args, **kwargs):
        self._received = 0
        return super().new_file(*args, **kwargs)

    def receive_data_chunk(self, raw_data, start):
        self._received += len(raw_data)
        if self._received > MAX_IMAGE_BYTES:
            raise StopUpload(connection_reset=False)
        return super().receive_data_chunk(raw_data, start)


def _encode_multipart(fields, files):
    """Build a multipart/form-data body with the standard library only."""
    boundary = 'vtryon' + secrets.token_hex(16)
    parts = []
    for name, value in fields.items():
        parts.append(
            f'--{boundary}\r\n'
            f'Content-Disposition: form-data; name="{name}"\r\n\r\n'
            f'{value}\r\n'.encode()
        )
    for name, (filename, content_type, data) in files.items():
        parts.append(
            f'--{boundary}\r\n'
            f'Content-Disposition: form-data; name="{name}"; filename="{filename}"\r\n'
            f'Content-Type: {content_type}\r\n\r\n'.encode()
            + data
            + b'\r\n'
        )
    parts.append(f'--{boundary}--\r\n'.encode())
    return b''.join(parts), f'multipart/form-data; boundary={boundary}'


def _upstream_error_message(raw, status):
    """Pass through the GPU server's {"error": "..."} message, or a safe default."""
    try:
        message = json.loads(raw.decode('utf-8')).get('error')
        if isinstance(message, str) and message:
            return message[:300]
    except (ValueError, AttributeError, UnicodeDecodeError):
        pass
    if status == 503:
        return 'Virtual try-on is still starting up. Please try again in a minute.'
    return 'Virtual try-on failed. Please try again.'


@csrf_exempt  # Cross-origin JSON/multipart API with no cookie auth; CORS limits callers.
@require_POST
@never_cache
def tryon(request):
    server_url, api_key = _settings()
    if not server_url or not api_key:
        return _error(OFFLINE_MESSAGE, 503)

    if _rate_limited(_client_ip(request)):
        return _error('Too many try-ons from your network. Please wait a few minutes and try again.', 429)

    try:
        content_length = int(request.META.get('CONTENT_LENGTH') or 0)
    except ValueError:
        content_length = 0
    if content_length > MAX_REQUEST_BYTES:
        return _error('Each photo must be 10 MB or smaller.', 413)
    if not request.content_type or not request.content_type.startswith('multipart/form-data'):
        return _error('Send the photos as multipart/form-data.', 400)

    request.upload_handlers = [InMemoryOnlyUploadHandler(request)]
    try:
        files = request.FILES
        slot = request.POST.get('slot', '').strip().lower()
    except Exception:  # malformed multipart body
        return _error('Could not read the uploaded photos.', 400)

    person = files.get('person')
    garment = files.get('garment')
    if person is None or garment is None:
        # StopUpload drops the oversized file, so it shows up here as missing.
        if content_length > MAX_IMAGE_BYTES:
            return _error('Each photo must be 10 MB or smaller.', 413)
        return _error('Both a person photo and a garment photo are required.', 400)
    for label, upload in (('person', person), ('garment', garment)):
        if not (upload.content_type or '').startswith('image/'):
            return _error(f'The {label} file must be an image.', 400)
        if upload.size == 0:
            return _error(f'The {label} photo is empty.', 400)
        if upload.size > MAX_IMAGE_BYTES:
            return _error('Each photo must be 10 MB or smaller.', 413)
    if slot not in ALLOWED_SLOTS:
        return _error('Garment type must be one of: top, outerwear, bottom, dress.', 400)

    body, content_type = _encode_multipart(
        {'slot': slot},
        {
            'person': ('person.jpg', person.content_type, person.read()),
            'garment': ('garment.jpg', garment.content_type, garment.read()),
        },
    )
    upstream = urllib.request.Request(
        f'{server_url}/tryon',
        data=body,
        method='POST',
        headers={'Content-Type': content_type, 'X-Tryon-Key': api_key},
    )

    started = time.monotonic()
    try:
        with urllib.request.urlopen(upstream, timeout=TRYON_TIMEOUT_S) as resp:
            png = resp.read()
    except urllib.error.HTTPError as exc:
        raw = exc.read()
        logger.warning('virtualtryon: upstream returned %s', exc.code)
        if exc.code == 401:
            # Key mismatch is our misconfiguration, not the visitor's fault.
            return _error(OFFLINE_MESSAGE, 503)
        return _error(_upstream_error_message(raw, exc.code), exc.code)
    except (urllib.error.URLError, TimeoutError, ConnectionError, OSError) as exc:
        logger.warning('virtualtryon: upstream unreachable (%s)', type(exc).__name__)
        return _error(OFFLINE_MESSAGE, 503)
    finally:
        del body  # release the image bytes promptly

    logger.info('virtualtryon: ok slot=%s in %.1fs', slot, time.monotonic() - started)
    response = HttpResponse(png, content_type='image/png')
    response['Cache-Control'] = 'no-store'
    return response


@require_GET
@never_cache
def health(request):
    server_url, api_key = _settings()
    if not server_url or not api_key:
        return JsonResponse({'ready': False, 'offline': True})

    upstream = urllib.request.Request(f'{server_url}/health', headers={'X-Tryon-Key': api_key})
    try:
        with urllib.request.urlopen(upstream, timeout=HEALTH_TIMEOUT_S) as resp:
            data = json.loads(resp.read().decode('utf-8'))
    except (urllib.error.URLError, TimeoutError, ConnectionError, OSError, ValueError) as exc:
        logger.info('virtualtryon: health check failed (%s)', type(exc).__name__)
        return JsonResponse({'ready': False, 'offline': True})

    return JsonResponse({'ready': bool(data.get('ready')), 'busy': bool(data.get('busy'))})
