import toolsData from './tools.json';

/**
 * Tool catalogue — the data itself lives in tools.json.
 *
 * WHY THE DATA MOVED OUT OF THIS FILE
 * -----------------------------------
 * scripts/prerender.mjs runs in plain Node and cannot import an ESM module from
 * src/, which webpack compiles. While the arrays lived here, prerender had no
 * way to read them, so the static shell for /tools contained only its title and
 * intro — 262 words standing in for a page that renders 14 detailed entries.
 * Googlebot renders JavaScript and would eventually see the full page, but that
 * rendering sits in a slower second queue, and Bing plus most LLM and social
 * crawlers do not render at all.
 *
 * As JSON the same file feeds both renderers, so the crawled HTML and the
 * rendered page cannot disagree.
 *
 * This module stays as the import surface for React code — every existing
 * `import { TOOLS } from '../data/tools'` keeps working unchanged.
 */

export const TOOL_CATEGORIES = toolsData.toolCategories;
export const TOOLS = toolsData.tools;
export const COURSE_LABELS = toolsData.courseLabels;

export const toolsByCategory = (categoryId) =>
  TOOLS.filter((t) => t.category === categoryId);
