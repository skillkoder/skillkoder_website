"""
SkillKoder API Views
====================
Public endpoints (no auth required):
  GET  /api/v1/courses/               — list active courses (with filters)
  GET  /api/v1/courses/<slug>/        — course detail
  GET  /api/v1/tools/                 — list all tools

Admin JWT-protected endpoints (IsAdminUser):
  POST   /api/v1/admin/courses/               — create course
  PUT    /api/v1/admin/courses/<slug>/        — full update
  PATCH  /api/v1/admin/courses/<slug>/        — partial update
  DELETE /api/v1/admin/courses/<slug>/        — delete course
  POST   /api/v1/admin/tools/                 — create tool
  PUT    /api/v1/admin/tools/<pk>/            — update tool
  DELETE /api/v1/admin/tools/<pk>/            — delete tool

Auth:
  POST /api/v1/auth/logout/          — blacklist refresh token (logout)
"""

from rest_framework import generics, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django_filters.rest_framework import DjangoFilterBackend

from .models import Course, Tool, SEOMetadata
from .serializers import (
    CourseListSerializer,
    CourseDetailSerializer,
    CourseWriteSerializer,
    ToolSerializer,
    SEOMetadataSerializer,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

class StandardResponse(Response):
    """Wraps API response in a consistent {success, data, message} envelope."""

    def __init__(self, data=None, message='', success=True, status=status.HTTP_200_OK):
        payload = {'success': success, 'message': message, 'data': data}
        super().__init__(payload, status=status)


# ---------------------------------------------------------------------------
# Auth — Logout (blacklist refresh token)
# ---------------------------------------------------------------------------

class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {'success': False, 'message': 'Refresh token is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError as e:
            return Response(
                {'success': False, 'message': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response({'success': True, 'message': 'Logged out successfully.'})


# ---------------------------------------------------------------------------
# Public — Course list & detail
# ---------------------------------------------------------------------------

class CourseListView(generics.ListAPIView):
    """
    GET /api/v1/courses/
    Public. Returns all active courses.

    Filter params:
      ?niche=data-analytics
      ?niche=data-science
      ?niche=generative-ai
      ?is_featured=true
      ?search=python
      ?ordering=-created_at
    """
    serializer_class = CourseListSerializer
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['niche', 'is_featured', 'difficulty']
    search_fields = ['title', 'tagline', 'description']
    ordering_fields = ['created_at', 'title', 'duration_weeks']
    ordering = ['-is_featured', 'niche']

    def get_queryset(self):
        return (
            Course.objects
            .filter(is_active=True)
            .prefetch_related('tools')
            .select_related('seo')
        )


class CourseDetailView(generics.RetrieveAPIView):
    """
    GET /api/v1/courses/<slug>/
    Public. Full course detail including tools and SEO metadata.
    """
    serializer_class = CourseDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        return (
            Course.objects
            .filter(is_active=True)
            .prefetch_related('tools')
            .select_related('seo')
        )


# ---------------------------------------------------------------------------
# Public — Tool list
# ---------------------------------------------------------------------------

class ToolListView(generics.ListAPIView):
    """GET /api/v1/tools/ — all tools"""
    serializer_class = ToolSerializer
    permission_classes = [AllowAny]
    queryset = Tool.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']


# ---------------------------------------------------------------------------
# Admin — Course CRUD (JWT IsAdminUser)
# ---------------------------------------------------------------------------

class AdminCourseCreateView(generics.CreateAPIView):
    """POST /api/v1/admin/courses/ — create a new course"""
    serializer_class = CourseWriteSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Return detail view of the created course
        course = Course.objects.select_related('seo').prefetch_related('tools').get(
            slug=serializer.data.get('slug') or serializer.instance.slug
        )
        detail = CourseDetailSerializer(course, context={'request': request})
        return Response(
            {'success': True, 'message': 'Course created.', 'data': detail.data},
            status=status.HTTP_201_CREATED
        )


class AdminCourseUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    PUT   /api/v1/admin/courses/<slug>/  — full update
    PATCH /api/v1/admin/courses/<slug>/  — partial update
    DELETE /api/v1/admin/courses/<slug>/ — delete
    """
    permission_classes = [IsAdminUser]
    lookup_field = 'slug'
    queryset = Course.objects.select_related('seo').prefetch_related('tools')

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return CourseWriteSerializer
        return CourseDetailSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        title = instance.title
        instance.delete()
        return Response(
            {'success': True, 'message': f'Course "{title}" deleted.'},
            status=status.HTTP_200_OK
        )


# ---------------------------------------------------------------------------
# Admin — Tool CRUD
# ---------------------------------------------------------------------------

class AdminToolListCreateView(generics.ListCreateAPIView):
    """
    GET  /api/v1/admin/tools/ — list all tools
    POST /api/v1/admin/tools/ — create tool
    """
    serializer_class = ToolSerializer
    permission_classes = [IsAdminUser]
    queryset = Tool.objects.all()


class AdminToolUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    PUT    /api/v1/admin/tools/<pk>/
    PATCH  /api/v1/admin/tools/<pk>/
    DELETE /api/v1/admin/tools/<pk>/
    """
    serializer_class = ToolSerializer
    permission_classes = [IsAdminUser]
    queryset = Tool.objects.all()
