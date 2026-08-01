import React, { useEffect } from 'react';
import Features from '../components/Features';
import PageHero from '../components/PageHero';
import { applySEO } from '../utils/seo';

const FeaturesPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    applySEO('/features');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <PageHero
        eyebrow="PLATFORM HIGHLIGHTS"
        title="Why Choose"
        accent="SkillKoder?"
        lead="Experience the future of learning with our innovative, industry-aligned platform built for real outcomes."
      />

      {/* Existing Features section */}
      <Features />
    </div>
  );
};

export default FeaturesPage;
