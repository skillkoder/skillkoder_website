"""
Courses app URL patterns — all mounted under /api/v1/
"""

from django.urls import path
from . import views

app_name = 'courses'

urlpatterns = [
    # ------------------------------------------------------------------
    # Public endpoints
    # ------------------------------------------------------------------
    # List all active courses  →  GET /api/v1/courses/
    path('courses/', views.CourseListView.as_view(), name='course-list'),

    # Course detail by slug   →  GET /api/v1/courses/<slug>/
    path('courses/<slug:slug>/', views.CourseDetailView.as_view(), name='course-detail'),

    # List all tools          →  GET /api/v1/tools/
    path('tools/', views.ToolListView.as_view(), name='tool-list'),

    # ------------------------------------------------------------------
    # Admin JWT-protected endpoints
    # ------------------------------------------------------------------
    # Create course            →  POST  /api/v1/admin/courses/
    path('admin/courses/', views.AdminCourseCreateView.as_view(), name='admin-course-create'),

    # Update / Delete course   →  PUT|PATCH|DELETE /api/v1/admin/courses/<slug>/
    path(
        'admin/courses/<slug:slug>/',
        views.AdminCourseUpdateDeleteView.as_view(),
        name='admin-course-update-delete'
    ),

    # Tool CRUD                →  GET|POST /api/v1/admin/tools/
    path('admin/tools/', views.AdminToolListCreateView.as_view(), name='admin-tool-list-create'),

    # Tool update/delete       →  PUT|PATCH|DELETE /api/v1/admin/tools/<pk>/
    path(
        'admin/tools/<int:pk>/',
        views.AdminToolUpdateDeleteView.as_view(),
        name='admin-tool-update-delete'
    ),
]
