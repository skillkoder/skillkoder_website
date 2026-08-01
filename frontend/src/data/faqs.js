/**
 * FAQ content for /faq and the homepage question block.
 *
 * DUPLICATE-SCHEMA RULE
 * ---------------------
 * Course-specific questions already ship as FAQPage structured data on their
 * own course pages (see the `faqs` arrays in src/seo/routes.json). Emitting the
 * same Q&A pairs again as FAQPage markup on /faq would put one FAQ entity on
 * two URLs, which Google treats as duplicate structured data and may ignore
 * for both.
 *
 * So: /faq *displays* everything (useful to a human landing there from search)
 * but only declares GENERAL_FAQS in its schema. The course questions stay
 * schema-owned by the course page they belong to, and /faq links back to it.
 *
 * Nothing here should assert an outcome the academy cannot evidence — no
 * placement percentages, no salary guarantees, no partner names.
 */

import seoRoutes from '../seo/routes.json';
import { COURSE_LABELS } from './tools';

const routeFaqs = (path) =>
  seoRoutes.routes.find((r) => r.path === path)?.faqs || [];

/**
 * Questions that belong to the academy as a whole, not to one course.
 *
 * The copy lives in routes.json rather than here because two consumers need
 * it: this module (for rendering) and scripts/prerender.mjs, which runs in
 * Node and builds the FAQPage JSON-LD for the static /faq shell. Keeping one
 * copy means the rendered answers and the structured data cannot disagree.
 */
export const GENERAL_FAQS = routeFaqs('/faq');

/** Placement-specific questions — schema-owned by /placement. */
export const PLACEMENT_FAQS = routeFaqs('/placement');

/**
 * Course questions pulled straight from routes.json so the two never drift.
 * Each group carries the course path, which /faq uses to link the answer back
 * to the page that owns its structured data.
 */
export const COURSE_FAQ_GROUPS = seoRoutes.routes
  .filter((r) => r.faqs?.length && COURSE_LABELS[r.path])
  .map((r) => ({
    id: r.path,
    label: COURSE_LABELS[r.path],
    path: r.path,
    faqs: r.faqs,
  }));

/** Short set for the homepage — the questions asked before anyone enquires. */
export const HOMEPAGE_FAQ_SLUGS = [
  'Who can join a SkillKoder course?',
  'Is coding experience required to start?',
  'Are classes live or pre-recorded?',
  'Do SkillKoder courses include placement assistance?',
  'Can I attend a class before paying?',
  'Which course should I choose?',
];

export const HOMEPAGE_FAQS = HOMEPAGE_FAQ_SLUGS.map((q) =>
  GENERAL_FAQS.find((f) => f.q === q)
).filter(Boolean);
