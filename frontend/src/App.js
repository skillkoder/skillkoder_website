import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Courses from './components/Courses.jsx';
import Features from './components/Features.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import CourseDetail from './components/CourseDetail.jsx';
import CoursesPage from './pages/CoursesPage.jsx';
import DataAnalyticsPage from './pages/DataAnalyticsPage.jsx';
import DataSciencePage from './pages/DataSciencePage.jsx';
import GenerativeAIPage from './pages/GenerativeAIPage.jsx';
import AzureDataEngineeringPage from './pages/AzureDataEngineeringPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import FeaturesPage from './pages/FeaturesPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import DrugFreeCertificatePage from './pages/DrugFreeCertificatePage.jsx';

const HomePage = () => (
  <>
    <Hero />
    <About />
    <Courses />
    <Features />
    <Contact />
  </>
);

const CourseDetailPage = () => {
  const { slug } = useParams();
  return <CourseDetail slug={slug} />;
};

const App = () => (
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/"                  element={<HomePage />} />
      <Route path="/about"             element={<AboutPage />} />
      <Route path="/courses"                     element={<CoursesPage />} />
      <Route path="/courses/data-analytics"      element={<DataAnalyticsPage />} />
      <Route path="/courses/data-science"        element={<DataSciencePage />} />
      <Route path="/courses/generative-ai"       element={<GenerativeAIPage />} />
      <Route path="/courses/azure-data-engineering" element={<AzureDataEngineeringPage />} />
      <Route path="/courses/:slug"               element={<CourseDetailPage />} />
      <Route path="/features"                    element={<FeaturesPage />} />
      <Route path="/contact"           element={<ContactPage />} />
      <Route path="/drug-free-certificates" element={<DrugFreeCertificatePage />} />
      {/* Catch-all → homepage */}
      <Route path="*"                  element={<HomePage />} />
    </Routes>
    <Footer />
  </BrowserRouter>
);

export default App;
