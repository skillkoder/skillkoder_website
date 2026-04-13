"""
SkillKoder DRF Serializers
==========================
ToolSerializer             — read-only tool info including icon URL
SEOMetadataSerializer      — full SEO fields + computed faq_jsonld
CourseListSerializer       — lightweight list view (no heavy fields)
CourseDetailSerializer     — full detail view including SEO & tools
CourseWriteSerializer      — used for POST/PUT/PATCH from admin JWT endpoints
"""

from rest_framework import serializers
from .models import Course, Tool, SEOMetadata


# ---------------------------------------------------------------------------
# Tool
# ---------------------------------------------------------------------------

class ToolSerializer(serializers.ModelSerializer):
    icon_url = serializers.SerializerMethodField()

    class Meta:
        model = Tool
        fields = ['id', 'name', 'icon_url', 'alt_text', 'website_url']

    def get_icon_url(self, obj):
        request = self.context.get('request')
        if obj.icon and request:
            return request.build_absolute_uri(obj.icon.url)
        return None


# ---------------------------------------------------------------------------
# SEO Metadata
# ---------------------------------------------------------------------------

class SEOMetadataSerializer(serializers.ModelSerializer):
    og_image_url = serializers.SerializerMethodField()
    faq_jsonld = serializers.SerializerMethodField()

    class Meta:
        model = SEOMetadata
        fields = [
            'meta_title', 'meta_description',
            'og_title', 'og_description', 'og_image_url',
            'canonical_url',
            'faq_schema', 'faq_jsonld',
            'schema_keywords',
        ]

    def get_og_image_url(self, obj):
        request = self.context.get('request')
        if obj.og_image and request:
            return request.build_absolute_uri(obj.og_image.url)
        return None

    def get_faq_jsonld(self, obj):
        """Return ready-to-inject JSON-LD dict for FAQPage schema."""
        return obj.get_faq_jsonld()


# ---------------------------------------------------------------------------
# SEO write serializer (for Admin API)
# ---------------------------------------------------------------------------

class SEOMetadataWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SEOMetadata
        fields = [
            'meta_title', 'meta_description',
            'og_title', 'og_description', 'og_image',
            'canonical_url', 'faq_schema', 'schema_keywords',
        ]


# ---------------------------------------------------------------------------
# Course — List (lightweight)
# ---------------------------------------------------------------------------

class CourseListSerializer(serializers.ModelSerializer):
    hero_banner_url = serializers.SerializerMethodField()
    niche_display = serializers.SerializerMethodField()
    difficulty_display = serializers.CharField(source='get_difficulty_display', read_only=True)
    # Include minimal SEO for list cards
    meta_title = serializers.SerializerMethodField()
    meta_description = serializers.SerializerMethodField()

    def get_niche_display(self, obj):
        """Return a human-readable niche label from the slug value."""
        return obj.niche.replace('-', ' ').title()

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'niche', 'niche_display',
            'tagline', 'difficulty', 'difficulty_display',
            'duration_weeks', 'price',
            'hero_banner_url', 'hero_banner_alt',
            'is_featured',
            'meta_title', 'meta_description',
        ]

    def get_hero_banner_url(self, obj):
        request = self.context.get('request')
        if obj.hero_banner and request:
            return request.build_absolute_uri(obj.hero_banner.url)
        return None

    def get_meta_title(self, obj):
        if hasattr(obj, 'seo'):
            return obj.seo.meta_title
        return obj.title

    def get_meta_description(self, obj):
        if hasattr(obj, 'seo'):
            return obj.seo.meta_description
        return obj.tagline


# ---------------------------------------------------------------------------
# Course — Detail (full)
# ---------------------------------------------------------------------------

class CourseDetailSerializer(serializers.ModelSerializer):
    hero_banner_url = serializers.SerializerMethodField()
    niche_display = serializers.SerializerMethodField()
    difficulty_display = serializers.CharField(source='get_difficulty_display', read_only=True)
    tools = ToolSerializer(many=True, read_only=True)
    seo = SEOMetadataSerializer(read_only=True)

    def get_niche_display(self, obj):
        """Return a human-readable niche label from the slug value."""
        return obj.niche.replace('-', ' ').title()

    class Meta:
        model = Course
        fields = [
            'id', 'title', 'slug', 'niche', 'niche_display',
            'tagline', 'description', 'curriculum', 'salary_insights',
            'difficulty', 'difficulty_display', 'duration_weeks', 'price',
            'hero_banner_url', 'hero_banner_alt',
            'tools', 'seo',
            'is_active', 'is_featured',
            'created_at', 'updated_at',
        ]

    def get_hero_banner_url(self, obj):
        request = self.context.get('request')
        if obj.hero_banner and request:
            return request.build_absolute_uri(obj.hero_banner.url)
        return None


# ---------------------------------------------------------------------------
# Course — Write (Admin JWT CRUD)
# Handles nested SEO metadata creation/update in one request.
# ---------------------------------------------------------------------------

class CourseWriteSerializer(serializers.ModelSerializer):
    seo = SEOMetadataWriteSerializer(required=False)
    tool_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Tool.objects.all(),
        source='tools',
        required=False
    )

    class Meta:
        model = Course
        fields = [
            'title', 'slug', 'niche', 'tagline', 'description',
            'curriculum', 'salary_insights',
            'difficulty', 'duration_weeks', 'price',
            'hero_banner', 'hero_banner_alt',
            'tool_ids',
            'is_active', 'is_featured',
            'seo',
        ]

    def create(self, validated_data):
        seo_data = validated_data.pop('seo', None)
        tools = validated_data.pop('tools', [])
        course = Course.objects.create(**validated_data)
        course.tools.set(tools)
        if seo_data:
            SEOMetadata.objects.create(course=course, **seo_data)
        return course

    def update(self, instance, validated_data):
        seo_data = validated_data.pop('seo', None)
        tools = validated_data.pop('tools', None)

        # Update course fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if tools is not None:
            instance.tools.set(tools)

        # Update or create SEO
        if seo_data:
            if hasattr(instance, 'seo'):
                for attr, value in seo_data.items():
                    setattr(instance.seo, attr, value)
                instance.seo.save()
            else:
                SEOMetadata.objects.create(course=instance, **seo_data)

        return instance
