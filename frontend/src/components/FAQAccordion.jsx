import React, { useId, useState } from 'react';

/**
 * Accessible FAQ accordion, used on /faq, the homepage and /placement.
 *
 * WHY ANSWERS ARE ALWAYS IN THE DOM
 * ---------------------------------
 * Collapsed answers are hidden with CSS (max-height + overflow), never by
 * conditionally rendering them. Googlebot indexes text that is present in the
 * DOM but visually collapsed; it does not index text that was never rendered.
 * Since the whole point of an FAQ block is to rank for the questions in it,
 * `{open && <p>…</p>}` would quietly delete the SEO value of this component.
 *
 * Keyboard and screen-reader behaviour follows the WAI-ARIA disclosure pattern:
 * a real <button> toggles, aria-expanded tracks state, and the answer region is
 * labelled by its trigger.
 */
const FAQItem = ({ q, a, footer, isOpen, onToggle }) => {
  const id = useId();
  const panelId = `faq-panel-${id}`;
  const buttonId = `faq-button-${id}`;

  return (
    <div
      style={{
        borderBottom: '1px solid #FFE2D2',
        background: isOpen ? '#FFF9F5' : 'transparent',
        transition: 'background 0.25s ease',
      }}
    >
      <h3 style={{ margin: 0 }}>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '1rem',
            padding: '1.15rem 1.25rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            font: 'inherit',
            fontSize: 'clamp(0.98rem, 1.6vw, 1.08rem)',
            fontWeight: 600,
            color: isOpen ? '#9A3412' : '#1f2937',
            lineHeight: 1.5,
          }}
        >
          <span>{q}</span>
          <span
            aria-hidden="true"
            style={{
              flexShrink: 0,
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: isOpen ? '#C2410C' : '#FFE8DC',
              color: isOpen ? '#ffffff' : '#9A3412',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 700,
              lineHeight: 1,
              transition: 'all 0.25s ease',
              marginTop: '0.1rem',
            }}
          >
            {isOpen ? '−' : '+'}
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        style={{
          maxHeight: isOpen ? '46rem' : 0,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
        }}
      >
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          <p
            style={{
              margin: 0,
              color: '#374151',
              fontSize: '0.98rem',
              lineHeight: 1.75,
            }}
          >
            {a}
          </p>
          {footer}
        </div>
      </div>
    </div>
  );
};

/**
 * @param {{q: string, a: string, footer?: React.ReactNode}[]} items
 * @param {boolean} allowMultiple  keep several answers open at once
 * @param {number|null} defaultOpen  index open on mount, or null for all closed
 */
const FAQAccordion = ({ items, allowMultiple = false, defaultOpen = 0 }) => {
  const [openSet, setOpenSet] = useState(
    () => new Set(defaultOpen === null ? [] : [defaultOpen])
  );

  const toggle = (index) => {
    setOpenSet((prev) => {
      const next = allowMultiple ? new Set(prev) : new Set();
      if (prev.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '18px',
        border: '1px solid #FFE2D2',
        overflow: 'hidden',
        boxShadow: '0 12px 36px rgba(194, 65, 12, 0.06)',
      }}
    >
      {items.map((item, index) => (
        <FAQItem
          key={item.q}
          q={item.q}
          a={item.a}
          footer={item.footer}
          isOpen={openSet.has(index)}
          onToggle={() => toggle(index)}
        />
      ))}
    </div>
  );
};

export default FAQAccordion;
