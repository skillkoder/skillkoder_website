import { ALL_ROUTES, ORIGIN } from '../seo/allRoutes';

export { ORIGIN };

/**
 * Look up the canonical SEO record for a route.
 *
 * ALL_ROUTES is the single source of truth — routes.json plus the SEO fields
 * carried by each content page. The same merge drives the static shells emitted
 * by scripts/prerender.mjs, so the crawled HTML and the client-rendered HTML
 * can never drift apart.
 */
export function getRouteSEO(path) {
  return ALL_ROUTES.find((r) => r.path === path) || null;
}

/**
 * GitHub Pages serves a directory as <path>/ and 301-redirects the bare form.
 * The canonical must therefore carry the trailing slash — otherwise every page
 * declares a canonical that immediately redirects, which is a self-conflicting
 * signal and burns a hop for every crawl.
 */
export function canonicalUrl(path, origin = ORIGIN) {
  if (!path || path === '/') return origin + '/';
  return origin + path + (path.endsWith('/') ? '' : '/');
}

function upsertMeta(name, content, property = false) {
  if (!content) return;
  const attr = property ? 'property' : 'name';
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

/**
 * Replace any JSON-LD blocks this module previously injected.
 * Marked with data-seo so the static Organization block in index.html survives.
 */
function setJSONLD(blocks) {
  document
    .querySelectorAll('script[type="application/ld+json"][data-seo="route"]')
    .forEach((el) => el.remove());

  blocks.filter(Boolean).forEach((block) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo', 'route');
    script.text = JSON.stringify(block);
    document.head.appendChild(script);
  });
}

export function buildCourseSchema(route, origin = ORIGIN) {
  if (!route.course) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: route.course.name,
    description: route.description,
    url: canonicalUrl(route.path, origin),
    provider: {
      '@type': 'EducationalOrganization',
      name: 'SkillKoder',
      url: origin + '/',
    },
    teaches: route.course.tools,
    occupationalCategory: route.course.roles,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      courseWorkload: 'PT8H',
    },
  };
}

export function buildFAQSchema(route) {
  if (!route.faqs || route.faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: route.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/**
 * Article schema for blog posts.
 *
 * `headline` uses the post's own h1 rather than the <title>, because the title
 * carries the "| SkillKoder" suffix and Google truncates headline at 110
 * characters. datePublished/dateModified come straight from blog.json.
 */
export function buildArticleSchema(route, origin = ORIGIN) {
  if (!route.isBlogPost) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: route.h1 || route.title,
    description: route.description,
    url: canonicalUrl(route.path, origin),
    datePublished: route.published,
    dateModified: route.updated || route.published,
    author: { '@type': 'Organization', name: 'SkillKoder', url: origin + '/' },
    publisher: {
      '@type': 'EducationalOrganization',
      name: 'SkillKoder',
      url: origin + '/',
      logo: { '@type': 'ImageObject', url: origin + '/sk_logo.webp' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl(route.path, origin) },
    ...(route.ogImage ? { image: origin + route.ogImage } : {}),
  };
}

export function buildBreadcrumbSchema(route, origin = ORIGIN) {
  if (route.path === '/') return null;

  const crumbs = [{ name: 'Home', url: origin + '/' }];
  const segments = route.path.split('/').filter(Boolean);

  if (segments[0] === 'courses' && segments.length > 1) {
    crumbs.push({ name: 'Courses', url: canonicalUrl('/courses', origin) });
  }
  if (segments[0] === 'careers' && segments.length > 1) {
    crumbs.push({ name: 'Careers', url: canonicalUrl('/careers', origin) });
  }
  if (segments[0] === 'blog' && segments.length > 1) {
    crumbs.push({ name: 'Blog', url: canonicalUrl('/blog', origin) });
  }
  crumbs.push({ name: route.h1 || route.title, url: canonicalUrl(route.path, origin) });

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

/**
 * Apply every head tag for a route in one call.
 *
 * Pass a path — `applySEO('/courses/data-analytics')` — and the metadata and
 * structured data are read from routes.json. Explicit overrides are still
 * accepted for dynamic pages that have no static entry.
 */
export function applySEO(pathOrOverrides, overrides = {}) {
  const route =
    typeof pathOrOverrides === 'string'
      ? { ...(getRouteSEO(pathOrOverrides) || { path: pathOrOverrides }), ...overrides }
      : pathOrOverrides;

  const canonical = route.canonical || canonicalUrl(route.path || '/');
  const ogImage = route.ogImage ? ORIGIN + route.ogImage : null;

  if (route.title) document.title = route.title;
  upsertMeta('description', route.description);
  upsertMeta('keywords', route.keywords);

  // The 404 route sets noindex. Without this the SPA would keep whatever
  // robots value the previous route left in the head, and a soft-404 page
  // would advertise itself as indexable.
  upsertMeta('robots', route.noindex ? 'noindex, follow' : 'index, follow');

  upsertMeta('og:title', route.ogTitle || route.title, true);
  upsertMeta('og:description', route.ogDescription || route.description, true);
  upsertMeta('og:url', canonical, true);
  upsertMeta('og:type', route.path === '/' ? 'website' : 'article', true);
  if (ogImage) upsertMeta('og:image', ogImage, true);

  upsertMeta('twitter:card', 'summary_large_image');
  upsertMeta('twitter:title', route.ogTitle || route.title);
  upsertMeta('twitter:description', route.ogDescription || route.description);
  if (ogImage) upsertMeta('twitter:image', ogImage);

  upsertLink('canonical', canonical);

  setJSONLD([
    buildCourseSchema(route),
    buildArticleSchema(route),
    buildFAQSchema(route),
    buildBreadcrumbSchema(route),
  ]);
}

/**
 * Backwards-compatible wrapper for the original call signature.
 * Prefer applySEO('/route') in new code.
 */
export function applySEOMeta(options) {
  applySEO(options);
}
