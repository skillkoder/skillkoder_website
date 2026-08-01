import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { applySEO } from '../utils/seo';

/**
 * The 404 page.
 *
 * WHAT THIS FIXES
 * ---------------
 * App.js previously routed `path="*"` to the homepage. Any mistyped or dead URL
 * therefore returned a full homepage with HTTP 200 and an indexable robots tag
 * — a textbook soft 404. Google's own documentation calls this out: it wastes
 * crawl budget on URLs that do not exist, and it can put junk URLs in the index
 * that all show identical content, which reads as duplication across the site.
 *
 * Two things make this a real 404 now:
 *
 *   1. `noindex` in routes.json for /404, applied through applySEO, so the page
 *      never enters the index however it is reached.
 *
 *   2. GitHub Pages already returns a genuine HTTP 404 status for unknown paths
 *      and serves public/404.html, which bounces into the SPA. The status code
 *      is therefore correct at the HTTP level — what was missing was the SPA
 *      agreeing with it once it booted. It does now.
 *
 * The links below are not decoration: a 404 is a dead end for a crawler unless
 * it offers a route back into the site.
 */

const DESTINATIONS = [
  ['/courses', 'All courses', 'Compare the four programs side by side'],
  ['/tools', 'Tools we teach', 'Power BI, SQL, Python, Tableau, Azure and more'],
  ['/blog', 'Blog', 'Guides on analytics, data science and AI'],
  ['/placement', 'Placement support', 'What career support actually includes'],
  ['/faq', 'FAQs', 'Eligibility, batches, duration and fees'],
  ['/contact', 'Contact us', 'Book a free demo or talk to a career expert'],
];

const NotFoundPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    applySEO('/404');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <PageHero
        eyebrow="404"
        title="That page"
        accent="doesn't exist"
        lead="The link may be out of date, or the address may have a typo in it. Here is where most people were heading."
      />

      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem 4rem' }}>
        <div
          className="notfound-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
          }}
        >
          {DESTINATIONS.map(([path, label, description]) => (
            <Link
              key={path}
              to={path}
              style={{
                display: 'block',
                background: '#ffffff',
                border: '1px solid #FFE2D2',
                borderRadius: '16px',
                padding: '1.35rem',
                textDecoration: 'none',
                boxShadow: '0 12px 36px rgba(194, 65, 12, 0.05)',
              }}
            >
              <strong
                style={{
                  display: 'block',
                  color: '#C2410C',
                  fontSize: '1.02rem',
                  marginBottom: '0.35rem',
                }}
              >
                {label}
              </strong>
              <span style={{ color: '#4b5568', fontSize: '0.92rem', lineHeight: 1.6 }}>
                {description}
              </span>
            </Link>
          ))}
        </div>

        <p
          style={{
            marginTop: '2.5rem',
            textAlign: 'center',
            color: '#4b5568',
            lineHeight: 1.8,
          }}
        >
          Or go back to the{' '}
          <Link to="/" style={{ color: '#C2410C', fontWeight: 600 }}>
            homepage
          </Link>
          . If you followed a link from our own site and landed here, please{' '}
          <Link to="/contact" style={{ color: '#C2410C', fontWeight: 600 }}>
            tell us
          </Link>{' '}
          — that is a bug on our side.
        </p>
      </section>

      <style>{`
        @media (max-width: 640px) {
          .notfound-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;
