import React from 'react';
import { Link } from 'react-router-dom';
import FAQAccordion from './FAQAccordion';
import { HOMEPAGE_FAQS } from '../data/faqs';

/**
 * Homepage question block.
 *
 * These six questions are a subset of GENERAL_FAQS, which /faq owns as FAQPage
 * structured data. This section is presentation only — no schema — so one FAQ
 * entity never appears on two URLs. See src/data/faqs.js for the full rule.
 *
 * It sits low on the homepage on purpose: it answers the objections that stop
 * someone enquiring, right before the contact form they would use to enquire.
 */
const HomeFAQ = () => (
  <section
    id="faq"
    style={{
      padding: '3.5rem 1.5rem',
      background: 'linear-gradient(135deg, #FFF7F2 0%, #ffffff 100%)',
    }}
  >
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 800,
            color: '#1f2937',
            marginBottom: '0.85rem',
            letterSpacing: '-0.02em',
          }}
        >
          Common{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #C2410C, #9A3412)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Questions
          </span>
        </h2>
        <p style={{ color: '#374151', lineHeight: 1.8, fontSize: '1.02rem' }}>
          The things people ask us most before they enrol — eligibility,
          prerequisites, class format and what placement support really covers.
        </p>
      </div>

      <FAQAccordion items={HOMEPAGE_FAQS} allowMultiple defaultOpen={0} />

      <p style={{ marginTop: '1.5rem', color: '#4b5568', lineHeight: 1.8 }}>
        <Link
          to="/faq"
          style={{
            fontWeight: 700,
            color: '#C2410C',
            textDecoration: 'none',
            borderBottom: '2px solid #FFD9C4',
            paddingBottom: '3px',
          }}
        >
          Read all frequently asked questions →
        </Link>
      </p>
    </div>
  </section>
);

export default HomeFAQ;
