"""
WSGI config for skillkoder_project.
Gunicorn on EC2 uses this entry point.

Run with: gunicorn skillkoder_project.wsgi:application --bind 0.0.0.0:8000
"""

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'skillkoder_project.settings')
application = get_wsgi_application()
