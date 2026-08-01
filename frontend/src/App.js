import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
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
import HomePage from './pages/HomePage.jsx';
import ToolsPage from './pages/ToolsPage.jsx';
import FaqPage from './pages/FaqPage.jsx';
import PlacementPage from './pages/PlacementPage.jsx';
import ContentPage from './pages/ContentPage.jsx';
import BlogIndexPage from './pages/BlogIndexPage.jsx';
import BlogPostPage from './pages/BlogPostPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import StickyCTA from './components/StickyCTA.jsx';
import { CONTENT_ROUTES } from './seo/allRoutes';

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

      {/*
        Career guides, location pages, keyword landing pages and legal pages are
        all defined in src/content/*.json and rendered by one template. Adding a
        page to a content file registers its route here automatically — there is
        no per-page component and nothing to remember to wire up.

        These are declared BEFORE /courses/:slug on purpose for readability;
        React Router v6 ranks static segments above dynamic ones regardless of
        order, so /courses/power-bi resolves here and not to CourseDetail.
      */}
      {CONTENT_ROUTES.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={<ContentPage path={route.path} />}
        />
      ))}

      <Route path="/courses/:slug"               element={<CourseDetailPage />} />
      <Route path="/features"                    element={<FeaturesPage />} />
      <Route path="/tools"             element={<ToolsPage />} />
      <Route path="/placement"         element={<PlacementPage />} />
      <Route path="/faq"               element={<FaqPage />} />

      <Route path="/blog"                        element={<BlogIndexPage />} />
      <Route path="/blog/category/:category"     element={<BlogIndexPage />} />
      <Route path="/blog/:slug"                  element={<BlogPostPage />} />

      <Route path="/contact"           element={<ContactPage />} />

      {/*
        Unknown URLs render a real 404 rather than the homepage.

        The previous `path="*" element={<HomePage />}` produced a soft 404: a
        full, indexable homepage served for every mistyped or dead URL. GitHub
        Pages already returns HTTP 404 for these paths — this makes the SPA
        agree with the status code instead of contradicting it.
      */}
      <Route path="/404"               element={<NotFoundPage />} />
      <Route path="*"                  element={<NotFoundPage />} />
    </Routes>
    <Footer />
    <StickyCTA />
  </BrowserRouter>
);

export default App;
