"""
SkillKoder Course Models
========================
Course         — main course entity (3 niches)
Tool           — tools/software covered in a course (with icon image)
SEOMetadata    — per-course meta tags + FAQ JSON-LD schema
"""

from django.db import models
from django.utils.text import slugify


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def course_banner_path(instance, filename):
    """Upload path: media/courses/<slug>/banner/<filename>"""
    return f'courses/{instance.slug}/banner/{filename}'


def tool_icon_path(instance, filename):
    """Upload path: media/tools/icons/<filename>"""
    return f'tools/icons/{filename}'


def seo_og_image_path(instance, filename):
    """Upload path: media/seo/<course-slug>/og/<filename>"""
    return f'seo/{instance.course.slug}/og/{filename}'


# ---------------------------------------------------------------------------
# Tool
# ---------------------------------------------------------------------------

class Tool(models.Model):
    """A software tool or technology taught in a course."""

    name = models.CharField(max_length=100)
    icon = models.ImageField(
        upload_to=tool_icon_path,
        null=True, blank=True,
        help_text='PNG/SVG icon shown on the course page'
    )
    alt_text = models.CharField(
        max_length=200,
        help_text='Alt text for the tool icon image (SEO & accessibility)'
    )
    website_url = models.URLField(blank=True, help_text='Official tool website (optional)')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Tool'
        verbose_name_plural = 'Tools'

    def __str__(self):
        return self.name


# ---------------------------------------------------------------------------
# Course
# ---------------------------------------------------------------------------

class Course(models.Model):
    """
    A SkillKoder course.
    Niche is a free-text field (e.g. 'data-analytics', 'generative-ai').
    Any value entered in admin is automatically reflected on the frontend.
    """

    class DifficultyLevel(models.TextChoices):
        BEGINNER = 'beginner', 'Beginner'
        INTERMEDIATE = 'intermediate', 'Intermediate'
        ADVANCED = 'advanced', 'Advanced'
        BEGINNER_TO_ADVANCED = 'beginner-to-advanced', 'Beginner to Advanced'

    # Core fields
    title = models.CharField(max_length=200)
    slug = models.SlugField(
        unique=True,
        max_length=120,
        help_text='URL slug, e.g. data-analytics-course-online'
    )
    niche = models.CharField(
        max_length=100,
        help_text='e.g. data-analytics, data-science, generative-ai, azure-data-engineering'
    )
    tagline = models.CharField(
        max_length=200, blank=True,
        help_text='Short tagline shown below the title'
    )
    description = models.TextField(
        help_text='Full course description (1500+ words capacity)'
    )

    # Curriculum stored as a JSON array of topic strings or structured objects
    # e.g. [{"module": "Power BI", "topics": ["Report Design", "DAX"]}]
    curriculum = models.JSONField(
        default=list,
        help_text='Array of topics or module objects (JSON)'
    )

    # Salary & career info
    salary_insights = models.TextField(
        blank=True,
        help_text='Salary range, job outlook, and career information'
    )

    # Tools covered (ManyToMany — one tool can appear in multiple courses)
    tools = models.ManyToManyField(
        Tool,
        blank=True,
        related_name='courses',
        help_text='Tools / technologies taught in this course'
    )

    # Hero banner image
    hero_banner = models.ImageField(
        upload_to=course_banner_path,
        null=True, blank=True,
        help_text='Hero banner image (recommended: 1200×630px)'
    )
    hero_banner_alt = models.CharField(
        max_length=200, blank=True,
        help_text='Alt text for the hero banner (SEO & accessibility)'
    )

    # Course meta
    duration_weeks = models.PositiveSmallIntegerField(default=12)
    difficulty = models.CharField(
        max_length=25,
        choices=DifficultyLevel.choices,
        default=DifficultyLevel.BEGINNER_TO_ADVANCED
    )
    price = models.DecimalField(
        max_digits=10, decimal_places=2,
        null=True, blank=True,
        help_text='Course price in INR (null = contact for pricing)'
    )

    # Status
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', 'niche', 'title']
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        """Auto-generate slug from title if not provided."""
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


# ---------------------------------------------------------------------------
# SEO Metadata
# ---------------------------------------------------------------------------

class SEOMetadata(models.Model):
    """
    Per-course SEO metadata injected into <head> by the React frontend.
    Also stores FAQ JSON-LD schema for Google's rich results.
    """

    course = models.OneToOneField(
        Course,
        on_delete=models.CASCADE,
        related_name='seo'
    )

    # Standard meta tags
    meta_title = models.CharField(
        max_length=70,
        help_text='<title> tag — keep under 60 characters for best display'
    )
    meta_description = models.CharField(
        max_length=160,
        help_text='Meta description — keep 120–155 characters'
    )

    # Open Graph / Social
    og_title = models.CharField(max_length=70, blank=True)
    og_description = models.CharField(max_length=200, blank=True)
    og_image = models.ImageField(
        upload_to=seo_og_image_path,
        null=True, blank=True,
        help_text='Open Graph image (recommended: 1200×630px)'
    )

    # Canonical URL (important for pages with duplicate slugs or UTM variants)
    canonical_url = models.URLField(
        blank=True,
        help_text='Canonical URL — leave blank to auto-generate from slug'
    )

    # FAQ JSON-LD schema
    # Stored as:
    # [
    #   {"question": "Who is this course for?", "answer": "Beginners and..."},
    #   ...
    # ]
    faq_schema = models.JSONField(
        default=list,
        help_text='FAQ pairs — injected as JSON-LD FAQPage schema by the frontend'
    )

    # Additional schema keywords for breadcrumb / course schema
    schema_keywords = models.CharField(
        max_length=300, blank=True,
        help_text='Comma-separated keywords for Course schema markup'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'SEO Metadata'
        verbose_name_plural = 'SEO Metadata'

    def __str__(self):
        return f'SEO: {self.course.title}'

    def get_faq_jsonld(self):
        """Return the FAQ schema as a valid JSON-LD dict ready for the frontend."""
        if not self.faq_schema:
            return {}
        return {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': [
                {
                    '@type': 'Question',
                    'name': item.get('question', ''),
                    'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': item.get('answer', '')
                    }
                }
                for item in self.faq_schema
                if item.get('question') and item.get('answer')
            ]
        }
