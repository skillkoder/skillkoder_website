import React, { useEffect } from 'react';
import About from '../components/About';
import PageHero from '../components/PageHero';
import { applySEO } from '../utils/seo';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    applySEO('/about');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <PageHero
        eyebrow="WHO WE ARE"
        title="About"
        accent="SkillKoder"
        lead="Empowering learners to master the most in-demand skills of the digital era — from data to AI."
      />

      {/* Existing About section */}
      <About />
    </div>
  );
};

export default AboutPage;
