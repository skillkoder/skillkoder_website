import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import ContentBlocks from '../components/ContentBlocks';
import FAQAccordion from '../components/FAQAccordion';
import { findRoute } from '../seo/allRoutes';
import { COURSE_LABELS } from '../data/tools';
import { applySEO } from '../utils/seo';
import { openDemoModal, openBrochureModal } from '../data/site';

/**
 * One template for every JSON-defined content page — career guides, location
 * pages, keyword landing pages and legal pages.
 *
 * App.js maps over CONTENT_ROUTES to register these, so adding a page is a
 * matter of appending an object to a content JSON file. There is no per-page
 * component to write and no route to remember to add, which is what keeps
 * roughly twenty pages maintainable.
 *
 * Blog posts use their own template (BlogPostPage) because they need a byline,
 * dates and related-post links that these pages have no use for.
 */
const ContentPage = ({ path }) => {
  const route = findRoute(path);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    applySEO(path);
  }, [path]);

  if (!route) return null;

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <PageHero
        eyebrow={route.eyebrow}
        title={route.h1}
        accent={route.accent}
        lead={route.intro}
      />

      <article
        style={{
          maxWidth: '820px',
          margin: '0 auto',
          padding: '3rem 1.5rem',
        }}
      >
        <ContentBlocks blocks={route.blocks} />

        {route.faqs?.length > 0 && (
          <section style={{ marginTop: '3rem' }}>
            <h2
              style={{
                fontSize: 'clamp(1.35rem, 2.6vw, 1.85rem)',
                fontWeight: 800,
                color: '#1f2937',
                marginBottom: '1.35rem',
                letterSpacing: '-0.02em',
              }}
            >
              Frequently asked questions
            </h2>
            <FAQAccordion items={route.faqs} allowMultiple defaultOpen={0} />
          </section>
        )}

        {/* Closing CTA. Legal pages carry their own and skip this one. */}
        {route.coursePath && (
          <section
            style={{
              marginTop: '3rem',
              background: 'linear-gradient(135deg, #FFF5F0 0%, #ffffff 100%)',
              border: '1px solid #FFE2D2',
              borderRadius: '20px',
              padding: '2.25rem 2rem',
              textAlign: 'center',
            }}
          >
            <h2
              style={{
                fontSize: 'clamp(1.25rem, 2.4vw, 1.6rem)',
                fontWeight: 800,
                color: '#1f2937',
                marginTop: 0,
                marginBottom: '0.75rem',
              }}
            >
              Ready to start?
            </h2>
            <p
              style={{
                color: '#4b5568',
                lineHeight: 1.75,
                maxWidth: '520px',
                margin: '0 auto 1.6rem',
              }}
            >
              Sit in on a live class before you decide anything. It costs nothing
              and it is the only honest way to judge the teaching.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '0.7rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                onClick={openDemoModal}
                style={{
                  padding: '0.8rem 1.6rem',
                  fontWeight: 700,
                  fontSize: '0.98rem',
                  borderRadius: '0.8rem',
                  border: 'none',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #C2410C, #9A3412)',
                  color: '#ffffff',
                }}
              >
                Book Free Demo
              </button>
              <Link
                to={route.coursePath}
                style={{
                  padding: '0.8rem 1.6rem',
                  fontWeight: 700,
                  fontSize: '0.98rem',
                  borderRadius: '0.8rem',
                  border: '2px solid #C2410C',
                  color: '#C2410C',
                  background: '#ffffff',
                  textDecoration: 'none',
                }}
              >
                {COURSE_LABELS[route.coursePath]
                  ? `${COURSE_LABELS[route.coursePath]} course`
                  : 'See the course'}
              </Link>
              {/* Phone and WhatsApp are already permanently available in
                  StickyCTA, so this slot offers the lower-commitment action
                  instead — a brochure converts visitors who are not ready to
                  book a call. */}
              <button
                type="button"
                onClick={() => openBrochureModal(COURSE_LABELS[route.coursePath] || '')}
                style={{
                  padding: '0.8rem 1.6rem',
                  fontWeight: 700,
                  fontSize: '0.98rem',
                  borderRadius: '0.8rem',
                  border: '2px solid #FFE2D2',
                  color: '#9A3412',
                  background: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                Download Brochure
              </button>
            </div>
          </section>
        )}
      </article>
    </div>
  );
};

export default ContentPage;
