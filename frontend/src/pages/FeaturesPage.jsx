import React, { useEffect } from 'react';
import Features from '../components/Features';

const FeaturesPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = 'Features — SkillKoder';
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      {/* Page Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #fff6f0 0%, #fff 60%, #f0f4ff 100%)',
        padding: '5rem 2rem 4rem',
        textAlign: 'center',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <div style={{
          display: 'inline-block',
          padding: '0.45rem 1.4rem',
          background: '#FFF5F0',
          borderRadius: '25px',
          marginBottom: '1rem',
          border: '1px solid #FFE8DC',
        }}>
          <span style={{ color: '#FF8A54', fontWeight: '600', fontSize: '0.88rem', letterSpacing: '0.05em' }}>
            PLATFORM HIGHLIGHTS
          </span>
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.25rem)',
          fontWeight: '800',
          color: '#1a202c',
          marginBottom: '1rem',
          lineHeight: 1.2,
        }}>
          Why Choose <span style={{
            background: 'linear-gradient(135deg, #FF6B6B, #FFB088)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>SkillKoder</span>?
        </h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#4a5568',
          maxWidth: '580px',
          margin: '0 auto',
          lineHeight: 1.75,
        }}>
          Experience the future of learning with our innovative, industry-aligned platform built for real outcomes.
        </p>
      </section>

      {/* Existing Features section */}
      <Features />
    </div>
  );
};

export default FeaturesPage;
