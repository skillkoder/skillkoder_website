import React from 'react';
import { Link } from 'react-router-dom';
import seoRoutes from '../seo/routes.json';
import { COURSE_LABELS } from '../data/tools';

/**
 * Homepage "Career Opportunities" section.
 *
 * Roles are read from the `course.roles` arrays in src/seo/routes.json — the
 * same data that populates each course page's `occupationalCategory` in its
 * Course JSON-LD. Duplicating the list here in JSX would let the visible page
 * and the structured data drift apart, which is exactly the mismatch Google
 * penalises.
 *
 * ---------------------------------------------------------------------------
 * SALARY FIGURES — deliberately absent.
 *
 * seo.md asks for salary insights on this section, and they would genuinely
 * help it rank ("data analyst salary in India" is a high-volume query). They
 * are not here because a salary range invented to fill a layout is a false
 * claim to someone choosing where to spend course fees.
 *
 * To add them properly: put a real figure and its source in SALARY_BY_ROLE
 * below (e.g. from Glassdoor India, AmbitionBox, LinkedIn Salary or a NASSCOM
 * report), keyed by role name. Roles without an entry simply render without a
 * salary line — no layout change needed. Cite the source and the year in
 * `source`; an uncited number is worth less than no number.
 * ---------------------------------------------------------------------------
 *
 * @type {Record<string, {range: string, source: string}>}
 */
const SALARY_BY_ROLE = {};

const ROLE_BLURBS = {
  'Data Analyst':
    'Turns raw business data into the reports and dashboards that leadership actually decides from. The most common entry point into the field.',
  'Business Intelligence Analyst':
    'Owns the reporting layer end to end — data models, metric definitions and the BI tooling the rest of the company relies on.',
  'Reporting Analyst':
    'Builds and maintains the recurring reporting that operations teams run on, and automates what used to be assembled by hand.',
  'Data Scientist':
    'Moves past describing what happened into predicting what will. Builds and validates models that feed real product and business decisions.',
  'Machine Learning Engineer':
    'Takes models out of notebooks and into production, where they have to be reliable, monitored and fast.',
  'Applied Data Analyst':
    'Sits between analytics and data science, using statistical methods on business problems that a dashboard cannot answer.',
  'AI Developer':
    'Builds applications on top of large language models — retrieval, structured prompting, evaluation and the plumbing around them.',
  'Prompt Engineering Specialist':
    'Designs and tests the prompts and guardrails that make an LLM behave consistently across thousands of real inputs.',
  'AI Application Engineer':
    'Ships user-facing AI features, owning the trade-offs between model quality, latency and cost.',
  'Azure Data Engineer':
    'Designs the pipelines and storage that everyone else queries. Less crowded than analytics and typically better paid.',
  'Cloud Data Engineer':
    'Runs data infrastructure on cloud platforms, from ingestion through transformation to serving.',
  'Analytics Engineer':
    'Bridges engineering and analytics — models and tests the transformed data layer that analysts build on.',
};

const COURSE_ACCENTS = {
  '/courses/data-analytics': '#C2410C',
  '/courses/data-science': '#B42318',
  '/courses/generative-ai': '#BE185D',
  '/courses/azure-data-engineering': '#9A3412',
};

const CAREER_TRACKS = seoRoutes.routes
  .filter((r) => r.course?.roles?.length && COURSE_LABELS[r.path])
  .map((r) => ({
    path: r.path,
    label: COURSE_LABELS[r.path],
    accent: COURSE_ACCENTS[r.path] || '#C2410C',
    roles: r.course.roles,
  }));

const CareerOutcomes = () => (
  <section
    id="careers"
    style={{ padding: '3.5rem 1.5rem', background: '#ffffff' }}
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
          Where These Programs{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #C2410C, #9A3412)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Lead
          </span>
        </h2>
        <p style={{ color: '#374151', lineHeight: 1.85, fontSize: '1.02rem' }}>
          Every program is built backwards from a specific set of job titles rather
          than from a syllabus. Below is what each track prepares you for, so you
          can start from the role you want and pick the course that reaches it.
        </p>
      </div>

      <div
        className="career-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {CAREER_TRACKS.map((track) => (
          <article
            key={track.path}
            style={{
              background: '#ffffff',
              border: '1px solid #FFE2D2',
              borderTop: `4px solid ${track.accent}`,
              borderRadius: '18px',
              padding: '1.6rem',
              boxShadow: '0 12px 36px rgba(194, 65, 12, 0.05)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: track.accent,
                margin: '0 0 1.1rem',
              }}
            >
              {track.label}
            </h3>

            <ul style={{ listStyle: 'none', margin: '0 0 1.25rem', padding: 0, flex: 1 }}>
              {track.roles.map((role) => {
                const salary = SALARY_BY_ROLE[role];
                return (
                  <li key={role} style={{ marginBottom: '1rem' }}>
                    <strong
                      style={{
                        display: 'block',
                        color: '#1f2937',
                        fontSize: '0.98rem',
                        marginBottom: '0.2rem',
                      }}
                    >
                      {role}
                    </strong>
                    {ROLE_BLURBS[role] && (
                      <span
                        style={{
                          display: 'block',
                          color: '#4b5568',
                          fontSize: '0.9rem',
                          lineHeight: 1.6,
                        }}
                      >
                        {ROLE_BLURBS[role]}
                      </span>
                    )}
                    {salary && (
                      <span
                        style={{
                          display: 'block',
                          color: '#9A3412',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          marginTop: '0.25rem',
                        }}
                      >
                        {salary.range}{' '}
                        <span style={{ color: '#6b7280', fontWeight: 400 }}>
                          ({salary.source})
                        </span>
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>

            <Link
              to={track.path}
              style={{
                fontWeight: 700,
                fontSize: '0.92rem',
                color: track.accent,
                textDecoration: 'none',
                borderBottom: '2px solid #FFE2D2',
                paddingBottom: '3px',
                alignSelf: 'flex-start',
              }}
            >
              Explore {track.label} →
            </Link>
          </article>
        ))}
      </div>

      <p
        style={{
          marginTop: '2rem',
          color: '#4b5568',
          lineHeight: 1.8,
          maxWidth: '760px',
        }}
      >
        Not sure which of these fits your background?{' '}
        <Link to="/placement" style={{ color: '#C2410C', fontWeight: 600 }}>
          See how our placement support works
        </Link>
        , or{' '}
        <Link to="/contact" style={{ color: '#C2410C', fontWeight: 600 }}>
          talk to a career expert
        </Link>{' '}
        and get a straight recommendation.
      </p>
    </div>

    <style>{`
      @media (max-width: 640px) {
        .career-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
  </section>
);

export default CareerOutcomes;
