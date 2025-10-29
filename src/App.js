import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Courses from './components/Courses.jsx';
import Features from './components/Features.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import DataScience from './components/DataScience.jsx';
import DataAnalytics from './components/DataAnalytics.jsx';
import GenerativeAI from './components/GenerativeAI.jsx';

const App = () => {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // simple hash router
  const renderRoute = () => {
    const path = (route.replace('#', '') || '/') .toLowerCase();
    if (path.startsWith('/courses/data-science')) return <DataScience />;
    if (path.startsWith('/courses/data-analytics')) return <DataAnalytics />;
    if (path.startsWith('/courses/generative-ai')) return <GenerativeAI />;

    // default: landing sections
    return (
      <>
        <Hero />
        <About />
        <Courses />
        <Features />
        <Contact />
      </>
    );
  };

  return (
    <div>
      <Navbar />
      {renderRoute()}
      <Footer />
    </div>
  );
};

export default App;