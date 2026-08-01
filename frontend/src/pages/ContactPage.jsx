import React, { useEffect } from 'react';
import Contact from '../components/Contact';
import PageHero from '../components/PageHero';
import { applySEO } from '../utils/seo';

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    applySEO('/contact');
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <PageHero
        eyebrow="GET IN TOUCH"
        title="We'd Love to"
        accent="Hear from You"
        lead="Have a question or want to learn more? Reach out and our team will get back to you promptly."
      />

      {/* Existing Contact section */}
      <Contact />
    </div>
  );
};

export default ContactPage;
