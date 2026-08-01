import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import FAQAccordion from '../components/FAQAccordion';
import { GENERAL_FAQS, COURSE_FAQ_GROUPS } from '../data/faqs';
import { applySEO } from '../utils/seo';
import { openDemoModal, PHONE_DISPLAY, PHONE_TEL } from '../data/site';

/**
 * /faq — one place for every question asked before enrolling.
 *
 * The page displays both the general questions and the course-specific ones,
 * but only the general set is declared as FAQPage structured data. The course
 * questions are already schema-owned by their own course pages via
 * routes.json; repeating them here as markup would create the same FAQ entity
 * on two URLs. See the note at the top of src/data/faqs.js.
 *
 * Course answers therefore render with a link back to the page that owns them,
 * which also feeds internal link equity toward the high-intent course URLs.
 */

const SectionHeading = ({ children, sub }) => (
  <>
    <h2
      style={{
        fontSize: 'clamp(1.35rem, 2.6vw, 1.85rem)',
        fontWeight: 800,
        color: '#1f2937',
        marginBottom: sub ? '0.4rem' : '1.25rem',
        letterSpacing: '-0.02em',
      }}
    >
      {children}
    </h2>
    {sub && (
      <p style={{ color: '#4b5568', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: '660px' }}>
        {sub}
      </p>
    )}
  </>
);

const FaqPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    applySEO('/faq');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <PageHero
        eyebrow="FREQUENTLY ASKED QUESTIONS"
        title="Everything You Asked"
        accent="Before Enrolling"
        lead="Eligibility, prerequisites, batch format, placement support and cost — answered plainly. If your question is not here, ask us directly and we will answer it the same way."
      />

      <section style={{ padding: '3.5rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
        <SectionHeading sub="General questions about how SkillKoder programs run, who they are for, and what you get.">
          About SkillKoder
        </SectionHeading>

        <FAQAccordion items={GENERAL_FAQS} allowMultiple defaultOpen={0} />

        {/* Course-specific questions, grouped by the course that owns them */}
        <div style={{ marginTop: '3.5rem' }}>
          <SectionHeading sub="Questions specific to each program. Follow the link in any answer for the full curriculum, tools and career outcomes.">
            Course-specific questions
          </SectionHeading>

          {COURSE_FAQ_GROUPS.map((group) => (
            <div key={group.id} style={{ marginBottom: '2.25rem' }}>
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  color: '#9A3412',
                  marginBottom: '0.9rem',
                }}
              >
                {group.label}
              </h3>
              <FAQAccordion
                allowMultiple
                defaultOpen={null}
                items={group.faqs.map((f) => ({
                  ...f,
                  footer: (
                    <Link
                      to={group.path}
                      style={{
                        display: 'inline-block',
                        marginTop: '0.9rem',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: '#C2410C',
                        textDecoration: 'none',
                        borderBottom: '1px solid #FFD9C4',
                        paddingBottom: '2px',
                      }}
                    >
                      See the full {group.label} course →
                    </Link>
                  ),
                }))}
              />
            </div>
          ))}
        </div>

        {/* Still stuck */}
        <div
          style={{
            marginTop: '3rem',
            background: 'linear-gradient(135deg, #FFF5F0 0%, #ffffff 100%)',
            border: '1px solid #FFE2D2',
            borderRadius: '20px',
            padding: '2.5rem 2rem',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.3rem, 2.6vw, 1.75rem)',
              fontWeight: 800,
              color: '#1f2937',
              marginBottom: '0.75rem',
            }}
          >
            Still have a question?
          </h2>
          <p
            style={{
              color: '#4b5568',
              lineHeight: 1.75,
              maxWidth: '540px',
              margin: '0 auto 1.75rem',
            }}
          >
            Talk to a career expert — no sales pressure, no obligation. Or sit in on
            a live class first and decide afterwards.
          </p>
          <div
            style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}
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
            <a
              href={PHONE_TEL}
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
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FaqPage;
