import {
  PEACH,
  PEACH_TINT,
  PEACH_WASH,
  PEACH_BORDER,
  BRAND_TEXT,
  BRAND_TEXT_STRONG,
  CTA_GRADIENT,
  CTA_GRADIENT_HOVER,
  INK,
  INK_BODY,
  INK_MUTED,
} from '../../theme/colors';

/**
 * Scoped styles for /virtualtryon. Every selector is prefixed `vtryon-` so
 * nothing leaks into the rest of the site. Colours come only from theme/colors;
 * buttons, cards and alerts mirror the existing Navbar CTA, company cards and
 * Contact form alerts.
 */
const css = `
  .vtryon { background: #fafafa; padding: 3rem 1.5rem 5rem; color: ${INK}; }
  .vtryon *, .vtryon *::before, .vtryon *::after { box-sizing: border-box; }
  .vtryon-wrap { max-width: 960px; margin: 0 auto; display: grid; gap: 1.5rem; }

  .vtryon-card { background: #fff; border: 1px solid ${PEACH_BORDER}; border-radius: 20px; padding: 1.75rem;
    box-shadow: 0 12px 30px rgba(255,176,136,0.12); }
  .vtryon-card.is-muted { opacity: 0.6; }
  .vtryon-step-head { display: flex; align-items: center; gap: 0.85rem; margin-bottom: 1.25rem; }
  .vtryon-step-num { flex-shrink: 0; width: 2.25rem; height: 2.25rem; border-radius: 999px; display: grid; place-items: center;
    background: ${PEACH_TINT}; color: ${BRAND_TEXT_STRONG}; font-weight: 800; border: 1px solid ${PEACH_BORDER}; }
  .vtryon-step-num.is-done { background: ${CTA_GRADIENT}; color: #fff; border-color: transparent; }
  .vtryon-step-head h2 { margin: 0; font-size: 1.3rem; font-weight: 800; color: ${INK}; }
  .vtryon-step-head p { margin: 0.15rem 0 0; color: ${INK_MUTED}; font-size: 0.95rem; }

  .vtryon-btn { display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem 1.4rem;
    border-radius: 999px; font: inherit; font-weight: 700; font-size: 0.95rem; cursor: pointer; text-decoration: none;
    transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease; border: 2px solid transparent; }
  .vtryon-btn:focus-visible, .vtryon-slot input:focus-visible + span { outline: 3px solid ${BRAND_TEXT}; outline-offset: 2px; }
  .vtryon-btn:disabled { cursor: not-allowed; opacity: 0.55; transform: none !important; box-shadow: none !important; }
  .vtryon-btn-primary { background: ${CTA_GRADIENT}; color: #fff; box-shadow: 0 18px 40px rgba(255,138,84,0.25); }
  .vtryon-btn-primary:hover:not(:disabled) { background: ${CTA_GRADIENT_HOVER}; transform: translateY(-2px); }
  .vtryon-btn-ghost { background: #fff; color: ${BRAND_TEXT}; border-color: ${BRAND_TEXT}; }
  .vtryon-btn-ghost:hover:not(:disabled) { background: ${PEACH_WASH}; }
  .vtryon-btn-lg { padding: 0.95rem 2rem; font-size: 1.05rem; }
  .vtryon-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem; }

  .vtryon-hint { margin: 0 0 0.85rem; padding: 0.75rem 1rem; background: ${PEACH_WASH}; border: 1px solid ${PEACH_BORDER};
    border-radius: 12px; color: ${INK_BODY}; font-size: 0.93rem; line-height: 1.5; }
  .vtryon-privacy { margin: 0.75rem 0 0; color: ${INK_MUTED}; font-size: 0.85rem; }

  .vtryon-camera-frame { position: relative; border-radius: 16px; overflow: hidden; background: ${INK}; aspect-ratio: 4 / 3; max-height: 70vh; }
  .vtryon-video { width: 100%; height: 100%; object-fit: cover; display: block; }
  .vtryon-video.is-mirrored { transform: scaleX(-1); }
  .vtryon-camera-msg { position: absolute; inset: 0; display: grid; place-items: center; color: #fff; font-weight: 600; }
  .vtryon-countdown { position: absolute; inset: 0; display: grid; place-items: center; color: #fff; font-size: 6rem;
    font-weight: 900; text-shadow: 0 6px 30px rgba(0,0,0,0.45); animation: vtryon-pop 1s ease-out infinite; }

  .vtryon-preview { display: flex; flex-wrap: wrap; gap: 1.25rem; align-items: center; }
  .vtryon-preview img { width: 160px; height: 200px; object-fit: contain; border-radius: 14px; background: ${PEACH_WASH};
    border: 1px solid ${PEACH_BORDER}; }
  .vtryon-preview-side { display: grid; gap: 0.5rem; flex: 1; min-width: 200px; }
  .vtryon-preview-side b { font-size: 1rem; }

  .vtryon-slots { border: none; margin: 1.25rem 0 0; padding: 0; }
  .vtryon-slots legend { font-weight: 700; margin-bottom: 0.6rem; padding: 0; }
  .vtryon-slot-row { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .vtryon-slot { position: relative; }
  .vtryon-slot input { position: absolute; opacity: 0; width: 1px; height: 1px; }
  .vtryon-slot span { display: inline-block; padding: 0.55rem 1.1rem; border-radius: 999px; border: 2px solid ${PEACH_BORDER};
    background: #fff; color: ${INK_BODY}; font-weight: 600; cursor: pointer; transition: all 0.2s ease; }
  .vtryon-slot span:hover { border-color: ${PEACH}; background: ${PEACH_WASH}; }
  .vtryon-slot input:checked + span { border-color: ${BRAND_TEXT}; background: ${PEACH_TINT}; color: ${BRAND_TEXT_STRONG}; }

  .vtryon-pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
  .vtryon-thumb { position: relative; border-radius: 16px; overflow: hidden; background: ${PEACH_WASH}; border: 1px solid ${PEACH_BORDER};
    aspect-ratio: 3 / 4; display: grid; place-items: center; color: ${INK_MUTED}; font-size: 0.9rem; text-align: center; padding: 0.5rem; }
  .vtryon-thumb img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; }
  .vtryon-thumb-label { position: absolute; left: 0.6rem; top: 0.6rem; z-index: 1; background: rgba(255,255,255,0.92);
    border-radius: 999px; padding: 0.2rem 0.7rem; font-size: 0.78rem; font-weight: 700; color: ${INK}; }
  .vtryon-loading { position: absolute; inset: 0; z-index: 2; display: grid; place-items: center; align-content: center; gap: 0.85rem;
    background: rgba(255,246,240,0.88); padding: 1rem; color: ${INK}; font-weight: 700; }
  .vtryon-spinner { width: 46px; height: 46px; border-radius: 999px; border: 4px solid ${PEACH_TINT}; border-top-color: ${BRAND_TEXT};
    animation: vtryon-spin 0.9s linear infinite; }
  .vtryon-loading small { font-weight: 500; color: ${INK_MUTED}; }

  .vtryon-result { display: grid; gap: 1rem; }
  .vtryon-result-img { position: relative; border-radius: 18px; overflow: hidden; background: ${PEACH_WASH}; border: 1px solid ${PEACH_BORDER};
    max-width: 560px; width: 100%; margin: 0 auto; }
  .vtryon-result-img img { display: block; width: 100%; height: auto; }
  .vtryon-result .vtryon-actions { justify-content: center; }
  .vtryon-hold { user-select: none; -webkit-user-select: none; touch-action: none; }
  .vtryon-hold[aria-pressed="true"] { background: ${PEACH_TINT}; }

  .vtryon-alert { display: flex; align-items: flex-start; gap: 0.5rem; padding: 1rem; border-radius: 8px; line-height: 1.5; margin-top: 1rem; }
  .vtryon-alert svg { flex-shrink: 0; margin-top: 0.1rem; }
  .vtryon-alert.is-error { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
  .vtryon-alert.is-warn { background: ${PEACH_WASH}; border: 1px solid ${PEACH}; color: ${BRAND_TEXT_STRONG}; margin-top: 0; }
  .vtryon-alert .vtryon-link-btn { background: none; border: none; padding: 0; font: inherit; font-weight: 700; color: inherit;
    text-decoration: underline; cursor: pointer; }

  .vtryon-note { color: ${INK_MUTED}; font-size: 0.85rem; text-align: center; margin: 0; }
  .vtryon-sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

  @keyframes vtryon-spin { to { transform: rotate(360deg); } }
  @keyframes vtryon-pop { 0% { transform: scale(1.25); opacity: 0.4; } 30% { transform: scale(1); opacity: 1; } 100% { opacity: 1; } }

  @media (max-width: 600px) {
    .vtryon { padding: 2rem 1rem 4rem; }
    .vtryon-card { padding: 1.25rem; }
    .vtryon-actions .vtryon-btn { flex: 1 1 100%; }
    .vtryon-preview img { width: 120px; height: 150px; }
    .vtryon-countdown { font-size: 4.5rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    .vtryon-btn, .vtryon-slot span { transition: none; }
    .vtryon-btn-primary:hover:not(:disabled) { transform: none; }
    .vtryon-countdown { animation: none; }
    .vtryon-spinner { animation: none; border-top-color: ${PEACH}; }
  }
`;

export default css;
