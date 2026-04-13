"""
SkillKoder Django Admin
=======================
Provides a rich admin portal for managing Courses, Tools, and SEO Metadata.
Accessible at:  /admin/login
"""

from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
import json

from .models import Course, Tool, SEOMetadata


# ---------------------------------------------------------------------------
# Tool Admin
# ---------------------------------------------------------------------------

@admin.register(Tool)
class ToolAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon_preview', 'alt_text', 'website_url', 'created_at']
    list_display_links = ['name']
    search_fields = ['name']
    readonly_fields = ['icon_preview', 'created_at']

    fieldsets = (
        ('Tool Information', {
            'fields': ('name', 'website_url')
        }),
        ('Image', {
            'fields': ('icon', 'icon_preview', 'alt_text'),
            'description': 'Upload a PNG or SVG icon. Recommended size: 64×64px.'
        }),
        ('Meta', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    def icon_preview(self, obj):
        if obj.icon:
            return format_html(
                '<img src="{}" style="height:40px; width:40px; object-fit:contain; '
                'border-radius:4px; background:#f5f5f5; padding:4px;" '
                'alt="{}" />',
                obj.icon.url, obj.alt_text
            )
        return mark_safe('<span style="color:#999;">No icon</span>')
    icon_preview.short_description = 'Icon Preview'


# ---------------------------------------------------------------------------
# SEO Metadata — inline on Course
# ---------------------------------------------------------------------------

class SEOMetadataInline(admin.StackedInline):
    model = SEOMetadata
    can_delete = False
    verbose_name = 'SEO Metadata'
    verbose_name_plural = 'SEO Metadata'
    extra = 1

    fieldsets = (
        ('Meta Tags', {
            'fields': (
                'meta_title',
                'meta_description',
            ),
            'description': (
                'meta_title: 50–60 chars • '
                'meta_description: 120–155 chars'
            )
        }),
        ('Open Graph / Social', {
            'fields': ('og_title', 'og_description', 'og_image'),
            'classes': ('collapse',)
        }),
        ('Canonical URL', {
            'fields': ('canonical_url',),
            'classes': ('collapse',),
            'description': 'Leave blank to let the frontend auto-generate from slug.'
        }),
        ('FAQ Schema (JSON-LD)', {
            'fields': ('faq_schema', 'schema_keywords'),
            'description': mark_safe(
                'Enter FAQ as a JSON array. Example:<br>'
                '<pre style="font-size:12px;background:#f8f8f8;padding:8px;border-radius:4px;">'
                '[\n'
                '  {"question": "Who is this course for?", "answer": "Anyone who..."},\n'
                '  {"question": "What tools will I learn?", "answer": "Python, SQL..."}\n'
                ']</pre>'
            )
        }),
    )


# ---------------------------------------------------------------------------
# Course Admin
# ---------------------------------------------------------------------------

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'niche_badge', 'difficulty', 'duration_weeks',
        'is_active', 'is_featured', 'hero_thumbnail', 'updated_at'
    ]
    list_display_links = ['title']
    list_filter = ['niche', 'difficulty', 'is_active', 'is_featured']
    search_fields = ['title', 'slug', 'description', 'tagline']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['hero_thumbnail', 'created_at', 'updated_at']
    filter_horizontal = ['tools']
    inlines = [SEOMetadataInline]
    save_on_top = True

    fieldsets = (
        ('Course Identity', {
            'fields': (
                'title', 'slug', 'niche', 'tagline',
                'is_active', 'is_featured'
            )
        }),
        ('Hero Banner', {
            'fields': ('hero_banner', 'hero_thumbnail', 'hero_banner_alt'),
            'description': 'Recommended banner size: 1200×630px. Max 5 MB.'
        }),
        ('Course Details', {
            'fields': ('description', 'salary_insights')
        }),
        ('Curriculum', {
            'fields': ('curriculum',),
            'description': mark_safe(
                'Enter curriculum as a JSON array of strings or module objects. Example:<br>'
                '<pre style="font-size:12px;background:#f8f8f8;padding:8px;border-radius:4px;">'
                '[\n'
                '  "Introduction to Python",\n'
                '  "Data Wrangling with Pandas",\n'
                '  {"module": "Power BI", "topics": ["Report Design", "DAX", "Power Query"]}\n'
                ']</pre>'
            )
        }),
        ('Pricing & Meta', {
            'fields': ('duration_weeks', 'difficulty', 'price')
        }),
        ('Tools Covered', {
            'fields': ('tools',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    # -----------------------------------------------------------------------
    # Custom display methods
    # -----------------------------------------------------------------------

    def niche_badge(self, obj):
        colors = {
            'data-analytics': '#2196F3',
            'data-science': '#9C27B0',
            'generative-ai': '#FF6B35',
        }
        color = colors.get(obj.niche, '#666')
        return format_html(
            '<span style="background:{};color:#fff;padding:3px 10px;'
            'border-radius:12px;font-size:11px;font-weight:600;">{}</span>',
            color, obj.get_niche_display()
        )
    niche_badge.short_description = 'Niche'
    niche_badge.admin_order_field = 'niche'

    def hero_thumbnail(self, obj):
        if obj.hero_banner:
            return format_html(
                '<img src="{}" style="height:60px; width:107px; object-fit:cover; '
                'border-radius:6px;" alt="{}" />',
                obj.hero_banner.url, obj.hero_banner_alt or obj.title
            )
        return mark_safe('<span style="color:#999;">No image</span>')
    hero_thumbnail.short_description = 'Banner'

    # -----------------------------------------------------------------------
    # Admin actions
    # -----------------------------------------------------------------------

    @admin.action(description='Mark selected courses as Active')
    def activate_courses(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} course(s) marked as active.')

    @admin.action(description='Mark selected courses as Inactive')
    def deactivate_courses(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} course(s) marked as inactive.')

    @admin.action(description='Feature selected courses')
    def feature_courses(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} course(s) featured.')

    actions = [activate_courses, deactivate_courses, feature_courses]


# ---------------------------------------------------------------------------
# SEO Metadata standalone admin (for bulk view)
# ---------------------------------------------------------------------------

@admin.register(SEOMetadata)
class SEOMetadataAdmin(admin.ModelAdmin):
    list_display = [
        'course', 'meta_title', 'meta_description_preview',
        'has_faq', 'updated_at'
    ]
    list_display_links = ['course']
    search_fields = ['course__title', 'meta_title', 'meta_description']
    readonly_fields = ['course', 'created_at', 'updated_at', 'faq_preview']

    fieldsets = (
        ('Course', {'fields': ('course',)}),
        ('Meta Tags', {'fields': ('meta_title', 'meta_description')}),
        ('Open Graph', {
            'fields': ('og_title', 'og_description', 'og_image'),
            'classes': ('collapse',)
        }),
        ('Canonical', {
            'fields': ('canonical_url',),
            'classes': ('collapse',)
        }),
        ('FAQ Schema', {
            'fields': ('faq_schema', 'faq_preview', 'schema_keywords')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def meta_description_preview(self, obj):
        text = obj.meta_description or ''
        return text[:80] + '…' if len(text) > 80 else text
    meta_description_preview.short_description = 'Meta Description'

    def has_faq(self, obj):
        count = len(obj.faq_schema) if obj.faq_schema else 0
        if count:
            return format_html(
                '<span style="color:#2e7d32;font-weight:600;">✓ {} FAQ(s)</span>', count
            )
        return mark_safe('<span style="color:#999;">–</span>')
    has_faq.short_description = 'FAQ'

    def faq_preview(self, obj):
        if not obj.faq_schema:
            return mark_safe('<em>No FAQs added yet.</em>')
        lines = []
        for i, item in enumerate(obj.faq_schema[:5], 1):
            lines.append(
                f'<strong>Q{i}:</strong> {item.get("question","")}<br>'
                f'<em>A:</em> {item.get("answer","")[:120]}…'
            )
        preview = '<hr>'.join(lines)
        if len(obj.faq_schema) > 5:
            preview += f'<br><em>+ {len(obj.faq_schema) - 5} more…</em>'
        return mark_safe(f'<div style="max-width:600px;font-size:13px;">{preview}</div>')
    faq_preview.short_description = 'FAQ Preview'
