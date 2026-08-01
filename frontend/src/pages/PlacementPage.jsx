import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import FAQAccordion from '../components/FAQAccordion';
import { PLACEMENT_FAQS } from '../data/faqs';
import sections from '../data/sections.json';
import { applySEO } from '../utils/seo';
import { openDemoModal, PHONE_DISPLAY, PHONE_TEL } from '../data/site';

/**
 * /placement — what career support actually includes.
 *
 * ============================ ACTION REQUIRED =============================
 * SUCCESS_STORIES and HIRING_PARTNERS below are intentionally EMPTY.
 *
 * Their sections do not render while the arrays are empty, so the page ships
 * honest today and lights up the moment real data is added. They were left
 * empty rather than filled with sample content because invented testimonials,
 * placement percentages or partner logos on a page selling training to job
 * seekers are a consumer-protection problem, not a copy problem — and Google's
 * spam policies treat fabricated review content as a manual-action risk.
 *
 * To populate: add real, permission-cleared entries in the shape shown in the
 * comments above each array. Nothing else needs to change.
 * ==========================================================================
 */

/** @type {{name: string, role: string, background: string, quote: string}[]} */
const SUCCESS_STORIES = [];

/** @type {{name: string, logo?: string}[]} */
const HIRING_PARTNERS = [];

/** Copy lives in src/data/sections.json so prerender.mjs renders it too. */
const SUPPORT_PILLARS = sections.placementPillars;

const PlacementPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    applySEO('/placement');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <PageHero
        eyebrow="CAREER & PLACEMENT SUPPORT"
        title="Placement Assistance,"
        accent="Described Honestly"
        lead="Resume review, portfolio guidance, mock interviews and job search strategy — running alongside the course, not tacked on at the end. Here is exactly what that includes, and what it does not."
      />

      <section style={{ padding: '3.5rem 1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
        {/* Intro */}
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
            Why we do not advertise a placement percentage
          </h2>
          <p style={{ color: '#374151', lineHeight: 1.85, marginBottom: '1rem' }}>
            Training institutes routinely advertise placement rates of 90% or higher.
            Those numbers are almost never auditable — they typically exclude
            everyone who did not complete the course, everyone who did not opt into
            the placement track, and everyone who stopped responding. A figure
            calculated that way tells you nothing useful about your own odds.
          </p>
          <p style={{ color: '#374151', lineHeight: 1.85 }}>
            So instead of a statistic you cannot verify, this page lists the specific
            things we do for you, and states plainly what is outside our control. If
            that reads as less impressive than a guarantee, that is the point — you
            can hold us to everything written below.
          </p>
        </div>

        {/* Support pillars */}
        <h2
          style={{
            fontSize: 'clamp(1.35rem, 2.6vw, 1.85rem)',
            fontWeight: 800,
            color: '#1f2937',
            marginBottom: '0.35rem',
            letterSpacing: '-0.02em',
          }}
        >
          What placement support includes
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
          className="placement-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
            gap: '1.25rem',
            marginBottom: '3.5rem',
          }}
        >
          {SUPPORT_PILLARS.map((pillar) => (
            <article
              key={pillar.title}
              style={{
                background: '#ffffff',
                border: '1px solid #FFE2D2',
                borderRadius: '18px',
                padding: '1.6rem',
                borderTop: `4px solid ${pillar.accent}`,
                boxShadow: '0 12px 36px rgba(194, 65, 12, 0.05)',
              }}
            >
              <h3
                style={{
                  fontSize: '1.12rem',
                  fontWeight: 700,
                  color: pillar.accent,
                  margin: '0 0 0.6rem',
                }}
              >
                {pillar.title}
              </h3>
              <p style={{ margin: 0, color: '#374151', lineHeight: 1.75, fontSize: '0.96rem' }}>
                {pillar.body}
              </p>
            </article>
          ))}
        </div>

        {/* Explicit scope boundary — unusual on a page like this, and the reason
            the rest of the page is credible. */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #FFE2D2',
            borderLeft: '5px solid #B42318',
            borderRadius: '16px',
            padding: '1.9rem',
            marginBottom: '3.5rem',
            maxWidth: '820px',
          }}
        >
          <h2
            style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              color: '#B42318',
              marginTop: 0,
              marginBottom: '1rem',
            }}
          >
            What placement support does not include
          </h2>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#374151', lineHeight: 1.9 }}>
            <li>
              <strong>A guaranteed job offer.</strong> We prepare you and open doors
              where we can. We do not control hiring decisions.
            </li>
            <li>
              <strong>A guaranteed salary figure.</strong> Compensation depends on
              your experience, location, the employer and the market.
            </li>
            <li>
              <strong>Applying on your behalf.</strong> You run your own job search.
              We make sure you are running it well.
            </li>
            <li>
              <strong>Support without participation.</strong> Learners who finish the
              projects and turn up to mock interviews get materially better results,
              and that is the one variable most under your control.
            </li>
          </ul>
        </div>

        {/* Success stories — renders only when real, cleared entries exist. */}
        {SUCCESS_STORIES.length > 0 && (
          <div style={{ marginBottom: '3.5rem' }}>
            <h2
              style={{
                fontSize: 'clamp(1.35rem, 2.6vw, 1.85rem)',
                fontWeight: 800,
                color: '#1f2937',
                marginBottom: '1.75rem',
              }}
            >
              Student success stories
            </h2>
            <div
              className="placement-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {SUCCESS_STORIES.map((story) => (
                <blockquote
                  key={story.name}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #FFE2D2',
                    borderRadius: '18px',
                    padding: '1.6rem',
                    margin: 0,
                  }}
                >
                  <p style={{ color: '#374151', lineHeight: 1.75, margin: '0 0 1rem' }}>
                    “{story.quote}”
                  </p>
                  <footer style={{ fontSize: '0.9rem', color: '#9A3412', fontWeight: 600 }}>
                    {story.name} — {story.role}
                    <span style={{ display: 'block', color: '#6b7280', fontWeight: 400 }}>
                      Previously: {story.background}
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        )}

        {/* Hiring partners — same rule: real names only. */}
        {HIRING_PARTNERS.length > 0 && (
          <div style={{ marginBottom: '3.5rem' }}>
            <h2
              style={{
                fontSize: 'clamp(1.35rem, 2.6vw, 1.85rem)',
                fontWeight: 800,
                color: '#1f2937',
                marginBottom: '1.75rem',
              }}
            >
              Hiring partners
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              {HIRING_PARTNERS.map((partner) => (
                <span
                  key={partner.name}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #FFE2D2',
                    borderRadius: '12px',
                    padding: '0.85rem 1.4rem',
                    fontWeight: 600,
                    color: '#374151',
                  }}
                >
                  {partner.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* FAQs */}
        <h2
          style={{
            fontSize: 'clamp(1.35rem, 2.6vw, 1.85rem)',
            fontWeight: 800,
            color: '#1f2937',
            marginBottom: '1.5rem',
          }}
        >
          Placement questions
        </h2>
        <div style={{ maxWidth: '820px', marginBottom: '3rem' }}>
          <FAQAccordion items={PLACEMENT_FAQS} allowMultiple defaultOpen={0} />
        </div>

        {/* CTA */}
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
              fontSize: 'clamp(1.3rem, 2.6vw, 1.75rem)',
              fontWeight: 800,
              color: '#1f2937',
              marginBottom: '0.75rem',
            }}
          >
            Ask us the hard questions before you enrol
          </h2>
          <p
            style={{
              color: '#4b5568',
              lineHeight: 1.75,
              maxWidth: '560px',
              margin: '0 auto 1.75rem',
            }}
          >
            Bring your CV and your target roles to a free demo class. You will get a
            straight answer about whether our program is the right route for you —
            including if the answer is no.
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
            <Link
              to="/faq"
              style={{
                padding: '0.85rem 1.75rem',
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: '0.875rem',
                border: '2px solid #FFE2D2',
                color: '#9A3412',
                background: '#ffffff',
                textDecoration: 'none',
              }}
            >
              Read all FAQs
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 640px) {
          .placement-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default PlacementPage;
