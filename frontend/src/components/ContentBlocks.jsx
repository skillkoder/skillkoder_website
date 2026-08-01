import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Renders the block arrays stored in src/content/*.json.
 *
 * WHY BODY COPY IS DATA, NOT JSX
 * ------------------------------
 * Roughly thirty content pages (blog posts, career guides, location pages,
 * legal pages) all need the same thing: readable prose, correct heading order,
 * and — critically — the identical text baked into the static shell that
 * scripts/prerender.mjs writes for crawlers.
 *
 * If the copy lived in JSX, prerender.mjs (plain Node, no JSX transform) could
 * not read it, and every page would ship a static shell containing only its
 * title and intro while the article itself existed solely after React booted.
 * Storing copy as JSON blocks lets this component and prerender's renderBlocks()
 * render the same source, so the crawled HTML and the rendered page match.
 *
 * Keep the two renderers in sync: any block type added here needs a matching
 * case in scripts/prerender.mjs.
 *
 * Block types:
 *   {type:'h2'|'h3', text}
 *   {type:'p', text}
 *   {type:'ul'|'ol', items:[string]}
 *   {type:'callout', title?, text}
 *   {type:'table', headers:[string], rows:[[string]]}
 *   {type:'cta', text, href, label}
 */

const linkStyle = { color: '#C2410C', fontWeight: 600 };

/** Internal routes use <Link>; anything else is a plain anchor. */
const SmartLink = ({ href, children }) =>
  href?.startsWith('/') ? (
    <Link to={href} style={linkStyle}>
      {children}
    </Link>
  ) : (
    <a href={href} style={linkStyle} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );

/**
 * Minimal inline markup so body copy can link and emphasise without needing a
 * full markdown parser in the bundle.
 *   [label](/path)  → link
 *   **bold**        → <strong>
 */
function renderInline(text) {
  const tokens = String(text).split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);

  return tokens.map((token, i) => {
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
    if (link) {
      return (
        <SmartLink key={i} href={link[2]}>
          {link[1]}
        </SmartLink>
      );
    }
    const bold = /^\*\*([^*]+)\*\*$/.exec(token);
    if (bold) {
      return <strong key={i}>{bold[1]}</strong>;
    }
    return <React.Fragment key={i}>{token}</React.Fragment>;
  });
}

const Block = ({ block }) => {
  switch (block.type) {
    case 'h2':
      return (
        <h2
          style={{
            fontSize: 'clamp(1.4rem, 2.8vw, 1.9rem)',
            fontWeight: 800,
            color: '#1f2937',
            letterSpacing: '-0.02em',
            margin: '2.5rem 0 0.9rem',
            lineHeight: 1.3,
          }}
        >
          {block.text}
        </h2>
      );

    case 'h3':
      return (
        <h3
          style={{
            fontSize: 'clamp(1.1rem, 2.2vw, 1.3rem)',
            fontWeight: 700,
            color: '#9A3412',
            margin: '1.9rem 0 0.7rem',
            lineHeight: 1.4,
          }}
        >
          {block.text}
        </h3>
      );

    case 'p':
      return (
        <p
          style={{
            color: '#374151',
            fontSize: '1.02rem',
            lineHeight: 1.85,
            margin: '0 0 1.15rem',
          }}
        >
          {renderInline(block.text)}
        </p>
      );

    case 'ul':
      return (
        <ul style={{ margin: '0 0 1.4rem', paddingLeft: '1.3rem' }}>
          {block.items.map((item, i) => (
            <li
              key={i}
              style={{
                color: '#374151',
                fontSize: '1rem',
                lineHeight: 1.8,
                marginBottom: '0.5rem',
              }}
            >
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );

    case 'ol':
      return (
        <ol style={{ margin: '0 0 1.4rem', paddingLeft: '1.3rem' }}>
          {block.items.map((item, i) => (
            <li
              key={i}
              style={{
                color: '#374151',
                fontSize: '1rem',
                lineHeight: 1.8,
                marginBottom: '0.5rem',
              }}
            >
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );

    case 'callout':
      return (
        <aside
          style={{
            background: '#FFF9F5',
            border: '1px solid #FFE2D2',
            borderLeft: '5px solid #C2410C',
            borderRadius: '14px',
            padding: '1.35rem 1.5rem',
            margin: '0 0 1.6rem',
          }}
        >
          {block.title && (
            <strong
              style={{
                display: 'block',
                color: '#9A3412',
                fontSize: '1rem',
                marginBottom: '0.5rem',
              }}
            >
              {block.title}
            </strong>
          )}
          <span style={{ color: '#374151', fontSize: '0.99rem', lineHeight: 1.8 }}>
            {renderInline(block.text)}
          </span>
        </aside>
      );

    case 'table':
      return (
        <div style={{ overflowX: 'auto', margin: '0 0 1.6rem' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.94rem',
              minWidth: '520px',
            }}
          >
            <thead>
              <tr>
                {block.headers.map((header) => (
                  <th
                    key={header}
                    style={{
                      textAlign: 'left',
                      padding: '0.75rem 0.9rem',
                      background: '#FFE8DC',
                      color: '#7C2D12',
                      fontWeight: 700,
                      borderBottom: '2px solid #FFD9C4',
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} style={{ background: i % 2 ? '#FFFBF8' : '#ffffff' }}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      style={{
                        padding: '0.75rem 0.9rem',
                        color: '#374151',
                        borderBottom: '1px solid #FFE2D2',
                        lineHeight: 1.65,
                        verticalAlign: 'top',
                      }}
                    >
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'cta':
      return (
        <div
          style={{
            background: 'linear-gradient(135deg, #FFF5F0 0%, #ffffff 100%)',
            border: '1px solid #FFE2D2',
            borderRadius: '18px',
            padding: '1.75rem',
            margin: '2rem 0',
          }}
        >
          <p style={{ margin: '0 0 1.1rem', color: '#374151', lineHeight: 1.8 }}>
            {renderInline(block.text)}
          </p>
          <Link
            to={block.href}
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #C2410C, #9A3412)',
              color: '#ffffff',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.96rem',
            }}
          >
            {block.label}
          </Link>
        </div>
      );

    default:
      return null;
  }
};

const ContentBlocks = ({ blocks = [] }) => (
  <>
    {blocks.map((block, i) => (
      <Block key={i} block={block} />
    ))}
  </>
);

export default ContentBlocks;
