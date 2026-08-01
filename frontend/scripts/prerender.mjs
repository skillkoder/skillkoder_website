/**
 * Emit a real static HTML file for every route.
 *
 * WHY THIS EXISTS
 * ---------------
 * The site is a client-rendered SPA hosted on GitHub Pages. GitHub Pages only
 * serves a file if it physically exists, so a request for
 * /courses/data-analytics used to fall through to 404.html — which returns an
 * HTTP 404 status and *then* redirects via JavaScript.
 *
 * Googlebot sees the 404 and drops the URL. Every course page was effectively
 * uncrawlable no matter how good the content was.
 *
 * This script writes build/courses/data-analytics/index.html (and one per
 * route), so the same URL now returns HTTP 200 with route-correct title,
 * description, canonical, Open Graph tags and JSON-LD already in the markup —
 * no JavaScript execution required to read any of it.
 *
 * The static body content is a faithful summary of what React renders on that
 * route (same H1, same intro, same links), read from the same routes.json the
 * app itself uses. React replaces it on mount. This is progressive
 * enhancement, not cloaking: crawler and user are shown the same claims.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const BUILD = path.join(ROOT, 'build');
const SRC = path.join(ROOT, 'src');
const ROUTES_FILE = path.join(SRC, 'seo', 'routes.json');
const CONTENT_DIR = path.join(SRC, 'content');

if (!fs.existsSync(BUILD)) {
  console.error('prerender: build/ not found — run the build first.');
  process.exit(1);
}

const readJSON = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

const { origin, routes: baseRoutes } = readJSON(ROUTES_FILE);

/* ----------------------------------------------------------------- routes */

/**
 * Mirror of the merge in src/seo/allRoutes.js.
 *
 * It is duplicated rather than imported because this script runs in plain Node
 * and src/ is compiled by webpack — there is no shared module both can consume.
 * The content files are JSON precisely so that both sides can read them without
 * a build step.
 *
 * IF YOU ADD A CONTENT FILE, ADD IT IN BOTH PLACES. This is the one seam where
 * the crawled HTML and the rendered app can drift apart.
 */
const content = ['careers', 'locations', 'landings', 'legal'].map((name) =>
  readJSON(path.join(CONTENT_DIR, `${name}.json`))
);
const blog = readJSON(path.join(CONTENT_DIR, 'blog.json'));

const contentRoutes = content.flatMap((file) => file.pages);

const blogCategoryRoutes = blog.categories.map((category) => ({
  path: `/blog/category/${category.slug}`,
  title: `${category.label} Articles & Guides | SkillKoder Blog`,
  description: category.description,
  keywords: category.keywords,
  ogImage: '/logo512.png',
  h1: `${category.label} Articles`,
  intro: category.description,
  isBlogCategory: true,
  category: category.slug,
}));

const blogPostRoutes = blog.posts.map((post) => ({
  ...post,
  path: `/blog/${post.slug}`,
  isBlogPost: true,
}));

const routes = [
  ...baseRoutes,
  ...contentRoutes,
  ...blogCategoryRoutes,
  ...blogPostRoutes,
];

const template = fs.readFileSync(path.join(BUILD, 'index.html'), 'utf8');

const canonicalUrl = (pth) =>
  !pth || pth === '/' ? origin + '/' : origin + pth + (pth.endsWith('/') ? '' : '/');

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* ------------------------------------------------------------------ schema */

function courseSchema(r) {
  if (!r.course) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: r.course.name,
    description: r.description,
    url: canonicalUrl(r.path),
    provider: {
      '@type': 'EducationalOrganization',
      name: 'SkillKoder',
      url: origin + '/',
    },
    teaches: r.course.tools,
    occupationalCategory: r.course.roles,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      courseWorkload: 'PT8H',
    },
  };
}

function faqSchema(r) {
  if (!r.faqs?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: r.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

function articleSchema(r) {
  if (!r.isBlogPost) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: r.h1 || r.title,
    description: r.description,
    url: canonicalUrl(r.path),
    datePublished: r.published,
    dateModified: r.updated || r.published,
    author: { '@type': 'Organization', name: 'SkillKoder', url: origin + '/' },
    publisher: {
      '@type': 'EducationalOrganization',
      name: 'SkillKoder',
      url: origin + '/',
      logo: { '@type': 'ImageObject', url: origin + '/sk_logo.webp' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl(r.path) },
    ...(r.ogImage ? { image: origin + r.ogImage } : {}),
  };
}

function breadcrumbSchema(r) {
  if (r.path === '/') return null;
  const crumbs = [{ name: 'Home', url: origin + '/' }];
  const seg = r.path.split('/').filter(Boolean);
  if (seg[0] === 'courses' && seg.length > 1) {
    crumbs.push({ name: 'Courses', url: canonicalUrl('/courses') });
  }
  if (seg[0] === 'careers' && seg.length > 1) {
    crumbs.push({ name: 'Careers', url: canonicalUrl('/careers') });
  }
  if (seg[0] === 'blog' && seg.length > 1) {
    crumbs.push({ name: 'Blog', url: canonicalUrl('/blog') });
  }
  crumbs.push({ name: r.h1 || r.title, url: canonicalUrl(r.path) });
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

/* -------------------------------------------------------------------- head */

function applyHead(html, r) {
  const canonical = canonicalUrl(r.path);
  const ogImage = origin + (r.ogImage || '/logo512.png');
  const ogType = r.path === '/' ? 'website' : 'article';

  const swap = (pattern, replacement) => {
    if (pattern.test(html)) html = html.replace(pattern, replacement);
    else html = html.replace('</head>', `  ${replacement}\n  </head>`);
  };

  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${esc(r.title)}</title>`
  );

  swap(
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="${esc(r.description)}"/>`
  );
  swap(
    /<meta name="keywords"[^>]*>/,
    `<meta name="keywords" content="${esc(r.keywords || '')}"/>`
  );
  // /404 is the only noindex route. Without this it would ship the template's
  // "index, follow" and advertise itself as a real page.
  swap(
    /<meta name="robots"[^>]*>/,
    `<meta name="robots" content="${r.noindex ? 'noindex, follow' : 'index, follow'}"/>`
  );
  swap(
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${canonical}"/>`
  );
  swap(
    /<meta property="og:title"[^>]*>/,
    `<meta property="og:title" content="${esc(r.title)}"/>`
  );
  swap(
    /<meta property="og:description"[^>]*>/,
    `<meta property="og:description" content="${esc(r.description)}"/>`
  );
  swap(
    /<meta property="og:url"[^>]*>/,
    `<meta property="og:url" content="${canonical}"/>`
  );
  swap(
    /<meta property="og:type"[^>]*>/,
    `<meta property="og:type" content="${ogType}"/>`
  );
  swap(
    /<meta property="og:image"[^>]*>/,
    `<meta property="og:image" content="${ogImage}"/>`
  );
  swap(
    /<meta name="twitter:title"[^>]*>/,
    `<meta name="twitter:title" content="${esc(r.title)}"/>`
  );
  swap(
    /<meta name="twitter:description"[^>]*>/,
    `<meta name="twitter:description" content="${esc(r.description)}"/>`
  );
  swap(
    /<meta name="twitter:image"[^>]*>/,
    `<meta name="twitter:image" content="${ogImage}"/>`
  );

  const blocks = [courseSchema(r), articleSchema(r), faqSchema(r), breadcrumbSchema(r)]
    .filter(Boolean)
    .map(
      (b) =>
        `<script type="application/ld+json" data-seo="route">${JSON.stringify(
          b
        )}</script>`
    )
    .join('\n    ');

  if (blocks) html = html.replace('</head>', `  ${blocks}\n  </head>`);
  return html;
}

/* -------------------------------------------------------------------- body */

const NAV = [
  ['/', 'Home'],
  ['/courses', 'Courses'],
  ['/courses/data-analytics', 'Data Analytics Course'],
  ['/courses/data-science', 'Data Science Course'],
  ['/courses/generative-ai', 'Generative AI Course'],
  ['/courses/azure-data-engineering', 'Azure Data Engineering Course'],
  ['/courses/power-bi', 'Power BI Course'],
  ['/tools', 'Tools We Teach'],
  ['/placement', 'Placement Support'],
  ['/blog', 'Blog'],
  ['/careers/data-analyst', 'Data Analyst Career'],
  ['/careers/data-scientist', 'Data Scientist Career'],
  ['/faq', 'FAQs'],
  ['/features', 'Why SkillKoder'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

/**
 * Renders the content blocks from src/content/*.json into static HTML.
 *
 * This is the Node-side twin of src/components/ContentBlocks.jsx. Both must
 * support the same block types, because the whole point of storing body copy as
 * data is that the crawler sees the same article the reader does. A blog post
 * whose static shell contained only its title would be a post Google cannot
 * rank for anything in its body.
 *
 * Inline markup mirrors renderInline() in the React component: [text](/href)
 * becomes a link and **text** becomes bold.
 */
function inline(text) {
  return esc(String(text))
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_, label, href) => `<a href="${href}">${label}</a>`
    )
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

function renderBlocks(blocks = []) {
  return blocks
    .map((b) => {
      switch (b.type) {
        case 'h2':
          return `<h2>${esc(b.text)}</h2>`;
        case 'h3':
          return `<h3>${esc(b.text)}</h3>`;
        case 'p':
          return `<p>${inline(b.text)}</p>`;
        case 'ul':
          return `<ul>${b.items.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`;
        case 'ol':
          return `<ol>${b.items.map((i) => `<li>${inline(i)}</li>`).join('')}</ol>`;
        case 'callout':
          return `<aside>${b.title ? `<strong>${esc(b.title)}</strong> ` : ''}${inline(b.text)}</aside>`;
        case 'table':
          return (
            '<table><thead><tr>' +
            b.headers.map((h) => `<th>${esc(h)}</th>`).join('') +
            '</tr></thead><tbody>' +
            b.rows
              .map(
                (row) =>
                  '<tr>' + row.map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>'
              )
              .join('') +
            '</tbody></table>'
          );
        case 'cta':
          return `<p>${inline(b.text)} <a href="${b.href}">${esc(b.label)}</a></p>`;
        default:
          return '';
      }
    })
    .join('');
}

function staticBody(r) {
  const parts = [];

  parts.push(`<h1>${esc(r.h1 || r.title)}</h1>`);

  // Byline and dates, so the crawled shell matches the rendered post header.
  if (r.isBlogPost) {
    parts.push(
      `<p><span>SkillKoder</span> · <time datetime="${esc(r.published)}">${esc(
        r.published
      )}</time> · <span>${esc(String(r.readingMinutes))} min read</span></p>`
    );
  }

  parts.push(`<p>${esc(r.intro || r.description)}</p>`);

  if (r.bullets?.length) {
    parts.push(
      `<ul>${r.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`
    );
  }

  // The article body itself — the reason this script exists for content pages.
  if (r.blocks?.length) {
    parts.push(renderBlocks(r.blocks));
  }

  // Category listings get the post links they render client-side, so a crawler
  // arriving on a category page has a path to every post in it.
  if (r.isBlogCategory) {
    const posts = blogPostRoutes.filter((p) => p.category === r.category);
    if (posts.length) {
      parts.push(
        `<ul>${posts
          .map(
            (p) =>
              `<li><a href="${p.path}">${esc(p.h1)}</a> — ${esc(p.excerpt)}</li>`
          )
          .join('')}</ul>`
      );
    }
  }

  // Same for the blog index.
  if (r.path === '/blog') {
    parts.push(
      `<ul>${blogPostRoutes
        .map(
          (p) => `<li><a href="${p.path}">${esc(p.h1)}</a> — ${esc(p.excerpt)}</li>`
        )
        .join('')}</ul>`
    );
    parts.push(
      `<nav aria-label="Blog categories">${blogCategoryRoutes
        .map((c) => `<a href="${c.path}">${esc(c.h1)}</a>`)
        .join(' ')}</nav>`
    );
  }

  if (r.course) {
    parts.push(`<h2>Tools you will learn</h2>`);
    parts.push(
      `<ul>${r.course.tools.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`
    );
    parts.push(`<h2>Career opportunities</h2>`);
    parts.push(
      `<ul>${r.course.roles.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`
    );
  }

  if (r.faqs?.length) {
    parts.push(`<h2>Frequently asked questions</h2>`);
    parts.push(
      r.faqs
        .map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`)
        .join('')
    );
  }

  // Internal links give the crawler a path to every other page from any entry
  // point — the crawl graph for a site with no external backlinks yet.
  parts.push(
    `<nav aria-label="Site">${NAV.filter(([p]) => p !== r.path)
      .map(([p, label]) => `<a href="${p}">${esc(label)}</a>`)
      .join(' ')}</nav>`
  );

  return `<div id="root"><main style="max-width:860px;margin:0 auto;padding:2rem 1.25rem;font-family:Inter,system-ui,sans-serif;color:#1f2937;line-height:1.7">${parts.join(
    ''
  )}</main></div>`;
}

/* ------------------------------------------------------------------- write */

let written = 0;
for (const r of routes) {
  let html = applyHead(template, r);
  html = html.replace(/<div id="root"><\/div>/, staticBody(r));

  const dir = r.path === '/' ? BUILD : path.join(BUILD, r.path);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');

  written++;
  console.log(
    `  ${r.noindex ? 'noix' : '200 '} ${r.path.padEnd(42)} ${r.title.slice(0, 52)}`
  );
}

console.log(`\nprerender: wrote ${written} static route shells.`);

/* ----------------------------------------------------------------- sitemap */

/**
 * The sitemap is generated, not hand-maintained.
 *
 * public/sitemap.xml was written by hand and had already fallen behind twice.
 * With blog posts being added regularly, a manual list guarantees that some
 * URLs never get submitted and, worse, that deleted ones keep being submitted.
 * Generating it from the same route list that produces the shells means the
 * sitemap cannot disagree with what actually exists.
 *
 * public/sitemap.xml is left in place for local reference but the build
 * overwrites build/sitemap.xml, which is what gets deployed.
 */
const PRIORITY = (p) => {
  if (p === '/') return '1.0';
  if (p.startsWith('/courses/')) return '0.9';
  if (p === '/courses' || p === '/blog' || p === '/tools' || p === '/placement') return '0.8';
  if (p.startsWith('/careers/') || p.startsWith('/blog/')) return '0.7';
  if (p.startsWith('/privacy') || p.startsWith('/terms') || p.startsWith('/refund')) return '0.3';
  return '0.6';
};

const CHANGEFREQ = (p) =>
  p === '/' || p === '/blog' || p.startsWith('/courses') ? 'weekly' : 'monthly';

// Blog posts carry their real dates; everything else is stamped with the build
// date. lastmod is a hint, and an honest approximate beats a fabricated one.
const BUILD_DATE = new Date().toISOString().slice(0, 10);

const sitemapEntries = routes
  .filter((r) => !r.noindex)
  .map((r) => {
    const lastmod = r.updated || r.published || BUILD_DATE;
    return [
      '  <url>',
      `    <loc>${canonicalUrl(r.path)}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <changefreq>${CHANGEFREQ(r.path)}</changefreq>`,
      `    <priority>${PRIORITY(r.path)}</priority>`,
      '  </url>',
    ].join('\n');
  })
  .join('\n');

fs.writeFileSync(
  path.join(BUILD, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<!-- Generated by scripts/prerender.mjs. Do not edit by hand. -->\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${sitemapEntries}\n</urlset>\n`,
  'utf8'
);

console.log(
  `prerender: wrote sitemap.xml with ${routes.filter((r) => !r.noindex).length} URLs.`
);
