import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { TOOLS, TOOL_CATEGORIES, COURSE_LABELS, toolsByCategory } from '../data/tools';
import { applySEO } from '../utils/seo';
import { openDemoModal } from '../data/site';

/**
 * /tools — the tool-keyword landing page.
 *
 * People search "power bi course", "sql course online" and "tableau training"
 * far more often than they search for a category name like "data analytics".
 * Those searches had nowhere to land on this site: the tools were buried inside
 * course pages that are optimised for a different keyword. This page gives each
 * tool a named, linkable section and routes the visitor onward to the course
 * that teaches it.
 */

const CourseChips = ({ paths }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
    {paths.map((path) => (
      <Link
        key={path}
        to={path}
        style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#9A3412',
          background: '#FFE8DC',
          padding: '0.35rem 0.8rem',
          borderRadius: '999px',
          textDecoration: 'none',
          border: '1px solid #FFD9C4',
        }}
      >
        {COURSE_LABELS[path]}
      </Link>
    ))}
  </div>
);

const ToolCard = ({ tool }) => (
  <article
    id={tool.slug}
    style={{
      background: '#ffffff',
      border: '1px solid #FFE2D2',
      borderRadius: '18px',
      padding: '1.6rem',
      boxShadow: '0 12px 36px rgba(194, 65, 12, 0.05)',
      scrollMarginTop: '6rem',
    }}
  >
    <h3
      style={{
        fontSize: '1.3rem',
        fontWeight: 800,
        color: '#1f2937',
        margin: '0 0 0.3rem',
        letterSpacing: '-0.01em',
      }}
    >
      {tool.name}
    </h3>
    <p
      style={{
        margin: '0 0 1rem',
        color: '#C2410C',
        fontWeight: 600,
        fontSize: '0.9rem',
      }}
    >
      {tool.tagline}
    </p>

    <p style={{ margin: '0 0 1rem', color: '#374151', lineHeight: 1.75, fontSize: '0.97rem' }}>
      {tool.description}
    </p>

    <p style={{ margin: 0, color: '#4b5568', lineHeight: 1.7, fontSize: '0.93rem' }}>
      <strong style={{ color: '#9A3412' }}>What you build: </strong>
      {tool.youWillBuild}
    </p>

    <CourseChips paths={tool.courses} />
  </article>
);

const ToolsPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    applySEO('/tools');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <PageHero
        eyebrow="TOOLS WE TEACH"
        title="Tools You Will"
        accent="Actually Use at Work"
        lead={`Every tool below is taught inside a SkillKoder program with hands-on project work — not demonstrated once and moved past. ${TOOLS.length} tools across analysis, visualization, machine learning and cloud data engineering.`}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center',
            marginTop: '1.75rem',
            maxWidth: '760px',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          {TOOLS.map((tool) => (
            <a
              key={tool.slug}
              href={`#${tool.slug}`}
              style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#9A3412',
                background: '#ffffff',
                border: '1px solid #FFE2D2',
                padding: '0.4rem 0.9rem',
                borderRadius: '999px',
                textDecoration: 'none',
              }}
            >
              {tool.name}
            </a>
          ))}
        </div>
      </PageHero>

      <section style={{ padding: '3.5rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ maxWidth: '760px', marginBottom: '3rem' }}>
          <h2
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 800,
              color: '#1f2937',
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}
          >
            Why the tool list matters more than the course title
          </h2>
          <p style={{ color: '#374151', lineHeight: 1.85, fontSize: '1rem', marginBottom: '1rem' }}>
            Job descriptions in India do not ask for "a data analytics course". They
            ask for SQL, for Power BI, for Python, for experience with a cloud data
            platform. Recruiters filter on those exact words, which means the honest
            way to evaluate any training program is to look at what it puts in your
            hands and how much time you spend using it.
          </p>
          <p style={{ color: '#374151', lineHeight: 1.85, fontSize: '1rem' }}>
            That is why this page exists as a plain list rather than a marketing
            grid. Each entry says what the tool is for, what you will have built by
            the end, and which program covers it — so you can work backwards from
            the roles you want to the course that gets you there.
          </p>
        </div>

        {TOOL_CATEGORIES.map((category) => {
          const tools = toolsByCategory(category.id);
          if (!tools.length) return null;

          return (
            <div key={category.id} style={{ marginBottom: '3.25rem' }}>
              <h2
                style={{
                  fontSize: 'clamp(1.35rem, 2.6vw, 1.75rem)',
                  fontWeight: 800,
                  color: '#1f2937',
                  marginBottom: '0.35rem',
                  letterSpacing: '-0.02em',
                }}
              >
                {category.label}
              </h2>
              <div
                style={{
                  width: '90px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #FF8A54, transparent)',
                  borderRadius: '2px',
                  marginBottom: '1.75rem',
                }}
              />
              <div
                className="tools-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {tools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </div>
          );
        })}

        {/* Closing CTA */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FFF5F0 0%, #ffffff 100%)',
            border: '1px solid #FFE2D2',
            borderRadius: '20px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.35rem, 2.6vw, 1.85rem)',
              fontWeight: 800,
              color: '#1f2937',
              marginBottom: '0.75rem',
            }}
          >
            Not sure which tools your target role needs?
          </h2>
          <p
            style={{
              color: '#4b5568',
              lineHeight: 1.75,
              maxWidth: '560px',
              margin: '0 auto 1.75rem',
            }}
          >
            Book a free demo class and we will map the roles you are aiming for to
            the specific tools and program that get you there.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={openDemoModal}
              style={{
                padding: '0.85rem 1.75rem',
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #C2410C, #9A3412)',
                color: '#ffffff',
              }}
            >
              Book Free Demo
            </button>
            <Link
              to="/courses"
              style={{
                padding: '0.85rem 1.75rem',
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: '0.875rem',
                border: '2px solid #C2410C',
                color: '#C2410C',
                background: '#ffffff',
                textDecoration: 'none',
              }}
            >
              Compare all programs
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) {
          .tools-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default ToolsPage;
