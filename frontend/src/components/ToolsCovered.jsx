import React from 'react';
import { Link } from 'react-router-dom';
import { TOOLS, TOOL_CATEGORIES, toolsByCategory } from '../data/tools';

/**
 * Homepage "Tools Covered" section.
 *
 * seo.md calls this the highest-value section to add, and the reason is
 * mechanical: tool names are what people type into Google. The homepage
 * previously never mentioned Power BI, SQL or Tableau in body text, so it could
 * not be considered relevant to any of those searches no matter how strong the
 * rest of the page was.
 *
 * Reads from src/data/tools.js, the same source as /tools, so the two can never
 * advertise a different list.
 */
const ToolsCovered = () => (
  <section
    id="tools"
    style={{
      padding: '3.5rem 1.5rem',
      background: 'linear-gradient(135deg, #ffffff 0%, #FFF7F2 100%)',
    }}
  >
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ maxWidth: '720px', marginBottom: '2.5rem' }}>
        <h2
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 800,
            color: '#1f2937',
            marginBottom: '0.85rem',
            letterSpacing: '-0.02em',
          }}
        >
          Tools You Will Learn at{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #C2410C, #9A3412)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SkillKoder
          </span>
        </h2>
        <p style={{ color: '#374151', lineHeight: 1.85, fontSize: '1.02rem' }}>
          Hiring managers screen on tools, not on course titles. Across our four
          programs you work hands-on with {TOOLS.length} of the tools that appear
          most often in Indian data and AI job descriptions — from Excel and SQL
          through Power BI and Python, up to PyTorch and the Azure data stack.
        </p>
      </div>

      <div
        className="tools-covered-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.25rem',
        }}
      >
        {TOOL_CATEGORIES.map((category) => (
          <div
            key={category.id}
            style={{
              background: '#ffffff',
              border: '1px solid #FFE2D2',
              borderRadius: '18px',
              padding: '1.5rem',
              boxShadow: '0 12px 36px rgba(194, 65, 12, 0.05)',
            }}
          >
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#9A3412',
                margin: '0 0 1rem',
              }}
            >
              {category.label}
            </h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {toolsByCategory(category.id).map((tool) => (
                <li
                  key={tool.slug}
                  style={{
                    display: 'flex',
                    gap: '0.6rem',
                    alignItems: 'flex-start',
                    marginBottom: '0.6rem',
                    color: '#374151',
                    fontSize: '0.95rem',
                    lineHeight: 1.5,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#FF8A54',
                      flexShrink: 0,
                      marginTop: '0.5rem',
                    }}
                  />
                  <Link
                    to={`/tools#${tool.slug}`}
                    style={{ color: '#374151', textDecoration: 'none' }}
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Link
        to="/tools"
        style={{
          display: 'inline-block',
          fontWeight: 700,
          fontSize: '0.98rem',
          color: '#C2410C',
          textDecoration: 'none',
          borderBottom: '2px solid #FFD9C4',
          paddingBottom: '3px',
        }}
      >
        See what you build with each tool →
      </Link>
    </div>

    <style>{`
      @media (max-width: 640px) {
        .tools-covered-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
  </section>
);

export default ToolsCovered;
