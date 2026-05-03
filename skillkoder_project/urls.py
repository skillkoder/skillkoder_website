"""
SkillKoder URL Configuration
Admin:   /admin/login          → Django admin (secure portal)
API v1:  /api/v1/              → DRF endpoints
Auth:    /api/v1/auth/token/   → JWT obtain
         /api/v1/auth/refresh/ → JWT refresh
         /api/v1/auth/logout/  → JWT blacklist (logout)
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from courses.views import LogoutView

# Customise admin header/title
admin.site.site_header = 'SkillKoder Admin'
admin.site.site_title = 'SkillKoder Portal'
admin.site.index_title = 'Content Management'

# Change the default /admin/ login URL to /admin/login  (already Django default)
admin.site.login_url = '/admin/login/'

urlpatterns = [
    # -----------------------------------------------------------------------
    # Admin portal — accessible at /admin/login
    # -----------------------------------------------------------------------
    path('admin/', admin.site.urls),

    # -----------------------------------------------------------------------
    # JWT Authentication endpoints
    # -----------------------------------------------------------------------
    path('api/v1/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/auth/logout/', LogoutView.as_view(), name='token_logout'),

    # -----------------------------------------------------------------------
    # Courses API
    # -----------------------------------------------------------------------
    path('api/v1/', include('courses.urls')),
]

# Serve media files in development (DEBUG=True).
# In production Nginx handles /media/ directly — see nginx/skillkoder_nginx.conf
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
