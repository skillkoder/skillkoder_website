import baseRoutes from './routes.json';
import careers from '../content/careers.json';
import locations from '../content/locations.json';
import landings from '../content/landings.json';
import legal from '../content/legal.json';
import blog from '../content/blog.json';

/**
 * The complete route registry — every indexable URL on the site.
 *
 * WHY THE MERGE EXISTS
 * --------------------
 * routes.json used to be the single source of truth, and for a dozen routes
 * that was right. With blog posts, career guides, location pages and legal
 * pages, keeping each page's title and description in routes.json while its
 * body lived in a content file meant editing two files per page and a standing
 * risk that the <title> stopped describing the copy underneath it.
 *
 * So each content page now carries its own SEO fields alongside its blocks,
 * and this module concatenates everything into one list with the same shape
 * routes.json always had. Nothing downstream had to change: applySEO() and
 * canonicalUrl() still just look up a path.
 *
 * scripts/prerender.mjs performs this identical merge in plain Node (it cannot
 * import from src/, which is compiled by webpack). If you add a content file
 * here, add it there too — that is the one place these can drift.
 */

/** Blog category listing pages, derived rather than hand-written. */
export const blogCategoryRoutes = blog.categories.map((category) => ({
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

/**
 * Post routes. `blocks` stays attached so the page template and prerender both
 * read the body from the same object they read the metadata from.
 */
export const blogPostRoutes = blog.posts.map((post) => ({
  ...post,
  path: `/blog/${post.slug}`,
  isBlogPost: true,
}));

export const CONTENT_ROUTES = [
  ...careers.pages,
  ...locations.pages,
  ...landings.pages,
  ...legal.pages,
];

export const ALL_ROUTES = [
  ...baseRoutes.routes,
  ...CONTENT_ROUTES,
  ...blogCategoryRoutes,
  ...blogPostRoutes,
];

export const ORIGIN = baseRoutes.origin;

export const BLOG_CATEGORIES = blog.categories;
export const BLOG_POSTS = blogPostRoutes;

/** Newest first — the order the blog index and category pages list posts in. */
export const postsNewestFirst = () =>
  [...blogPostRoutes].sort((a, b) => (a.published < b.published ? 1 : -1));

export const postsInCategory = (slug) =>
  postsNewestFirst().filter((p) => p.category === slug);

export const findRoute = (path) => ALL_ROUTES.find((r) => r.path === path) || null;

export default ALL_ROUTES;
