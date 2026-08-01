import React from 'react';

/**
 * The page-top banner used by every standalone route.
 *
 * AboutPage, FeaturesPage and ContactPage each carried a byte-identical copy of
 * this markup, differing only in the eyebrow text, heading and lead paragraph.
 * Three copies meant three places to fix a spacing or contrast bug, so it lives
 * here now.
 *
 * The <h1> is intentionally rendered by this component rather than the page:
 * exactly one h1 per route is what the heading outline needs, and centralising
 * it makes that impossible to get wrong by accident.
 *
 *   <PageHero
 *     eyebrow="TOOLS WE TEACH"
 *     title="Tools You Will"
 *     accent="Actually Use"
 *     lead="…"
 *   />
 */
const PageHero = ({ eyebrow, title, accent, lead, children }) => (
  <section
    style={{
      background: 'linear-gradient(135deg, #fff6f0 0%, #fff 60%, #f0f4ff 100%)',
      padding: '5rem 2rem 4rem',
      textAlign: 'center',
      borderBottom: '1px solid #f0f0f0',
    }}
  >
    {eyebrow && (
      <div
        style={{
          display: 'inline-block',
          padding: '0.45rem 1.4rem',
          background: '#FFF5F0',
          borderRadius: '25px',
          marginBottom: '1rem',
          border: '1px solid #FFE8DC',
        }}
      >
        <span
          style={{
            color: '#C2410C',
            fontWeight: '600',
            fontSize: '0.88rem',
            letterSpacing: '0.05em',
          }}
        >
          {eyebrow}
        </span>
      </div>
    )}

    <h1
      style={{
        fontSize: 'clamp(2rem, 5vw, 3.25rem)',
        fontWeight: '800',
        color: '#1a202c',
        marginBottom: '1rem',
        lineHeight: 1.2,
      }}
    >
      {title}
      {accent && (
        <>
          {' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #FF6B6B, #FFB088)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {accent}
          </span>
        </>
      )}
    </h1>

    {lead && (
      <p
        style={{
          fontSize: '1.1rem',
          color: '#4a5568',
          maxWidth: '640px',
          margin: '0 auto',
          lineHeight: 1.75,
        }}
      >
        {lead}
      </p>
    )}

    {children}
  </section>
);

export default PageHero;
