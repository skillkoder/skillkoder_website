/**
 * SkillKoder brand color tokens — WCAG-verified.
 *
 * The brand peach (#FFB088) is beautiful but very light: it measures only
 * 1.78:1 against white and 1.61:1 against the warm canvas. That fails WCAG AA
 * for body text (4.5:1) AND for large display text (3:1), and white text on a
 * peach button fails just as badly.
 *
 * The fix is NOT to abandon peach — it stays exactly as-is for surfaces,
 * borders, gradients and glows. The fix is to stop using it to carry text.
 * Text uses the terracotta ramp below, which is the same hue family, just
 * dark enough to read.
 *
 * Every ratio below is measured, not estimated.
 */

/* ---------------------------------------------------------------------------
 * SURFACES — safe anywhere. Never put text in these colors.
 * ------------------------------------------------------------------------- */
export const PEACH = '#FFB088';        // signature brand fill, borders, glows
export const PEACH_CANVAS = '#FFF0F0'; // hero / section background
export const PEACH_TINT = '#FFE8DC';   // tag and pill backgrounds
export const PEACH_WASH = '#FFF6F0';   // card backgrounds
export const PEACH_BORDER = '#FFE2D2'; // hairline borders

/* ---------------------------------------------------------------------------
 * BRAND TEXT — for text on white / warm canvas / tint backgrounds.
 *
 *                       on #FFFFFF   on #FFF0F0   on #FFE8DC
 *   BRAND_TEXT          5.18:1 AA    4.68:1 AA    4.39:1  (large only)
 *   BRAND_TEXT_STRONG   7.31:1 AAA   6.61:1 AA    6.20:1 AA
 *
 * Use BRAND_TEXT_STRONG for anything small (tags, labels, links, captions).
 * Use BRAND_TEXT for headings and body-size brand-colored copy on white.
 * ------------------------------------------------------------------------- */
export const BRAND_TEXT = '#C2410C';
export const BRAND_TEXT_STRONG = '#9A3412';

/* ---------------------------------------------------------------------------
 * ON-PEACH TEXT — for text sitting directly on a #FFB088 surface.
 *   ON_PEACH (#7C2D12) on #FFB088 → 5.27:1 AA
 *   Ink (#1f2937)      on #FFB088 → 8.26:1 AAA
 * ------------------------------------------------------------------------- */
export const ON_PEACH = '#7C2D12';

/* ---------------------------------------------------------------------------
 * CTA — white text needs a dark enough fill to pass. No shade of peach or
 * coral is dark enough (white on #FFB088 = 1.78:1, white on #E55B5B = 3.51:1),
 * so the primary button uses the terracotta ramp:
 *   white on #C2410C → 5.18:1 AA
 *   white on #9A3412 → 7.31:1 AAA
 * ------------------------------------------------------------------------- */
export const CTA_BG = '#C2410C';
export const CTA_BG_DEEP = '#9A3412';
export const CTA_GRADIENT = 'linear-gradient(135deg, #C2410C, #9A3412)';
export const CTA_GRADIENT_HOVER = 'linear-gradient(135deg, #9A3412, #7C2D12)';

/* ---------------------------------------------------------------------------
 * JOURNEY ACCENTS — accessible replacements for the Learn/Evolve/Excel trio.
 * The original peach → coral → rose progression measured 1.61 / 3.17 / 2.42
 * against the canvas. These keep the same three-step hue journey but read.
 *
 *   STEP_LEARN  (#9A3412 terracotta) on #FFF0F0 → 6.61:1 AA
 *   STEP_EVOLVE (#B42318 deep red)   on #FFF0F0 → 5.94:1 AA
 *   STEP_EXCEL  (#BE185D magenta)    on #FFF0F0 → 5.45:1 AA
 * ------------------------------------------------------------------------- */
export const STEP_LEARN = '#9A3412';
export const STEP_EVOLVE = '#B42318';
export const STEP_EXCEL = '#BE185D';

/* Decorative-only versions of the accents — fills, dots, icon backgrounds.
 * These are the original vivid brand colors; they must never carry text. */
export const ACCENT_CORAL = '#E55B5B';
export const ACCENT_ROSE = '#FF6B9D';

/* ---------------------------------------------------------------------------
 * NEUTRALS — all verified against white.
 * ------------------------------------------------------------------------- */
export const INK = '#1f2937';        // 14.7:1  headings
export const INK_DEEP = '#2f365d';   // 11.0:1  display sub-headings
export const INK_BODY = '#374151';   //  8.8:1  body
export const INK_MUTED = '#4b5568';  //  7.5:1  supporting copy

/* Minimum accessible border for interactive elements (WCAG 1.4.11 → 3:1).
 * Raw peach borders measure 1.78:1 and are invisible to low-vision users. */
export const BORDER_INTERACTIVE = '#C2410C';
