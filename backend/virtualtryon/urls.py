"""
Virtual Try-On URL patterns — mounted under /api/v1/

    POST /api/v1/virtualtryon/          person + garment + slot  →  image/png
    GET  /api/v1/virtualtryon/health/   →  {"ready": bool, "busy": bool}
"""

from django.urls import path
from . import views

app_name = 'virtualtryon'

urlpatterns = [
    path('virtualtryon/', views.tryon, name='tryon'),
    path('virtualtryon/health/', views.health, name='health'),
]
