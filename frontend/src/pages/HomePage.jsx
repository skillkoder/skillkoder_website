import React, { useEffect } from 'react';
import Hero from '../components/Hero.jsx';
import About from '../components/About.jsx';
import Courses from '../components/Courses.jsx';
import ToolsCovered from '../components/ToolsCovered.jsx';
import Features from '../components/Features.jsx';
import CareerOutcomes from '../components/CareerOutcomes.jsx';
import HomeFAQ from '../components/HomeFAQ.jsx';
import Contact from '../components/Contact.jsx';
import { applySEO } from '../utils/seo';

/**
 * Section order follows the visitor's actual question sequence:
 * who are you (Hero, About) → what do you teach (Courses, Tools) → why you
 * (Features) → what do I get out of it (Careers) → what's the catch (FAQ) →
 * how do I start (Contact).
 *
 * Tools and Careers also carry most of the homepage's keyword surface: tool
 * names and job titles are what people search, and neither appeared in the
 * homepage body copy before.
 */
const HomePage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    applySEO('/');
  }, []);

  return (
    <>
      <Hero />
      <About />
      <Courses />
      <ToolsCovered />
      <Features />
      <CareerOutcomes />
      <HomeFAQ />
      <Contact />
    </>
  );
};

export default HomePage;
