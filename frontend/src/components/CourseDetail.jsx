/**
 * CourseDetail — Dynamic Course Landing Page Template
 * ====================================================
 * Fetches course data from the Django API by slug.
 * Injects SEO meta tags and JSON-LD FAQ schema into <head>.
 * Falls back to static data when the API is unreachable.
 *
 * Props:
 *   slug  {string}  — course slug, e.g. 'data-analytics-course-online'
 *
 * Usage in App.js:
 *   <CourseDetail slug="data-analytics-course-online" />
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Features from './Features';
import Contact from './Contact';
import { apiService } from '../services/api';

// ---------------------------------------------------------------------------
// Static fallback data (shown if API is down)
// ---------------------------------------------------------------------------
const STATIC_FALLBACK = {
  'data-analytics': {
    title: 'Data Analytics Course Online',
    tagline: 'Transform raw data into actionable insights',
    description:
      'Master the full data analytics stack — Power BI, Python, SQL, and Statistics — ' +
      'with real-world projects and mentorship.',
    curriculum: [
      'Power BI & Report Design',
      'Data Transformation with Power Query',
      'DAX & Data Modeling',
      'Python for Data Analysis',
      'SQL Fundamentals & Advanced Queries',
      'Statistics for Data Analytics',
      'Machine Learning Basics',
      'Exploratory Data Analysis (EDA)',
    ],
    salary_insights:
      'Data Analysts in India earn ₹4–12 LPA. With Power BI + Python expertise, ' +
      'senior roles reach ₹18–25 LPA.',
    tools: [
      { id: 1, name: 'Power BI', alt_text: 'Power BI logo', icon_url: null },
      { id: 2, name: 'Python', alt_text: 'Python logo', icon_url: null },
      { id: 3, name: 'SQL', alt_text: 'SQL logo', icon_url: null },
      { id: 4, name: 'Excel', alt_text: 'Excel logo', icon_url: null },
      { id: 5, name: 'Tableau', alt_text: 'Tableau logo', icon_url: null },
    ],
    duration_weeks: 12,
    difficulty_display: 'Beginner to Advanced',
    seo: {
      meta_title: 'Data Analytics Course Online | SkillKoder',
      meta_description:
        'Learn Data Analytics online with Power BI, Python & SQL. ' +
        'Job-ready curriculum. Enroll at SkillKoder.',
      faq_jsonld: null,
    },
  },
  'data-science': {
    title: 'Data Science Course Online',
    tagline: 'From data to machine learning at scale',
    description:
      'A comprehensive Data Science program covering Python, machine learning, ' +
      'deep learning, and MLOps with industry-grade projects.',
    curriculum: [
      'Python for Data Science',
      'Numpy, Pandas & Matplotlib',
      'Statistical Learning',
      'Supervised & Unsupervised Learning',
      'Deep Learning & Neural Networks',
      'NLP Fundamentals',
      'Model Deployment with FastAPI',
      'MLOps & CI/CD for ML',
    ],
    salary_insights:
      'Data Scientists in India earn ₹8–20 LPA. ' +
      'ML Engineers at top firms reach ₹25–40 LPA.',
    tools: [
      { id: 1, name: 'Python', alt_text: 'Python logo', icon_url: null },
      { id: 2, name: 'scikit-learn', alt_text: 'scikit-learn logo', icon_url: null },
      { id: 3, name: 'TensorFlow', alt_text: 'TensorFlow logo', icon_url: null },
      { id: 4, name: 'Jupyter', alt_text: 'Jupyter logo', icon_url: null },
    ],
    duration_weeks: 16,
    difficulty_display: 'Intermediate',
    seo: {
      meta_title: 'Data Science Course Online | SkillKoder',
      meta_description:
        'Master Data Science with Python, ML, and Deep Learning. ' +
        'Industry projects. Enroll at SkillKoder.',
      faq_jsonld: null,
    },
  },
  'generative-ai': {
    title: 'Generative AI Course Online',
    tagline: 'Build with the latest AI models',
    description:
      'Dive into Generative AI — prompt engineering, LangChain, RAG pipelines, ' +
      'fine-tuning, and building production AI applications.',
    curriculum: [
      'Intro to Generative AI & LLMs',
      'Prompt Engineering Best Practices',
      'LangChain & LlamaIndex',
      'RAG (Retrieval-Augmented Generation)',
      'Fine-tuning Open-Source Models',
      'AI Agents & Tool Use',
      'Deploying AI Applications',
      'AI Ethics & Safety',
    ],
    salary_insights:
      'Generative AI Engineers are among the highest paid in tech, ' +
      'earning ₹12–35 LPA in India, $150k–$250k globally.',
    tools: [
      { id: 1, name: 'Python', alt_text: 'Python logo', icon_url: null },
      { id: 2, name: 'LangChain', alt_text: 'LangChain logo', icon_url: null },
      { id: 3, name: 'OpenAI API', alt_text: 'OpenAI logo', icon_url: null },
      { id: 4, name: 'HuggingFace', alt_text: 'HuggingFace logo', icon_url: null },
    ],
    duration_weeks: 10,
    difficulty_display: 'Advanced',
    seo: {
      meta_title: 'Generative AI Course Online | SkillKoder',
      meta_description:
        'Learn Generative AI, prompt engineering & LangChain. ' +
        'Build real AI apps. Enroll at SkillKoder.',
      faq_jsonld: null,
    },
  },
  'azure-data-engineering': {
    title: 'Azure Data Engineering Course Online',
    tagline: 'Master the Cloud Data Ecosystem',
    description:
      'Become a specialist in cloud data solutions. Master Azure Data Factory, Databricks, ' +
      'Synapse Analytics, and PySpark to build scalable production-grade data pipelines.',
    curriculum: [
      'Azure Cloud Fundamentals',
      'Data Lake Storage Gen2',
      'Azure Data Factory (ADF)',
      'ETL/ELT Pipeline Design',
      'Databricks & PySpark',
      'Azure Synapse Analytics',
      'Lakehouse Architecture',
      'CI/CD with Azure DevOps',
    ],
    salary_insights:
      'Azure Data Engineers in India earn ₹12–25 LPA. ' +
      'Senior Architects reach ₹30–50+ LPA.',
    tools: [
      { id: 1, name: 'Azure Data Factory', alt_text: 'ADF logo', icon_url: null },
      { id: 2, name: 'Databricks', alt_text: 'Databricks logo', icon_url: null },
      { id: 3, name: 'Synapse', alt_text: 'Synapse logo', icon_url: null },
      { id: 4, name: 'Python', alt_text: 'Python logo', icon_url: null },
      { id: 5, name: 'Spark', alt_text: 'Spark logo', icon_url: null },
    ],
    duration_weeks: 14,
    difficulty_display: 'Intermediate to Advanced',
    seo: {
      meta_title: 'Azure Data Engineering Course Online | SkillKoder',
      meta_description:
        'Master Azure Data Factory, Databricks & Synapse. ' +
        '14-week program. Enroll at SkillKoder.',
      faq_jsonld: null,
    },
  },
};

// Map URL paths / slugs to static fallback key
function nicheKeyFromSlug(slug) {
  if (slug?.includes('data-analytics') || slug === 'data-analytics') return 'data-analytics';
  if (slug?.includes('data-science') || slug === 'data-science') return 'data-science';
  if (slug?.includes('generative-ai') || slug === 'generative-ai') return 'generative-ai';
  if (slug?.includes('azure-data-engineering') || slug === 'azure-data-engineering') return 'azure-data-engineering';
  return null;
}

// ---------------------------------------------------------------------------
// SEO head injector
// ---------------------------------------------------------------------------
function injectSEO(seo, title) {
  if (!seo) return;
  document.title = seo.meta_title || title;
  const setMeta = (name, content, property = false) => {
    const attr = property ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };
  if (seo.meta_description) setMeta('description', seo.meta_description);
  if (seo.og_title) setMeta('og:title', seo.og_title, true);
  if (seo.og_description) setMeta('og:description', seo.og_description, true);
  if (seo.og_image_url) setMeta('og:image', seo.og_image_url, true);

  // Inject JSON-LD FAQ schema
  if (seo.faq_jsonld && seo.faq_jsonld.mainEntity?.length) {
    const existing = document.getElementById('faq-jsonld');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = 'faq-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(seo.faq_jsonld);
    document.head.appendChild(script);
  }
}

// Clean up SEO when component unmounts
function cleanupSEO() {
  document.title = 'SkillKoder - EdTech Platform';
  const el = document.getElementById('faq-jsonld');
  if (el) el.remove();
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
    <div style={{
      width: 48, height: 48,
      border: '4px solid #FFE8DC',
      borderTopColor: '#FF8A54',
      borderRadius: '50%',
      animation: 'sk-spin 0.8s linear infinite',
    }} />
    <style>{`@keyframes sk-spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const ErrorBanner = ({ message }) => (
  <div style={{
    background: '#fff3e0', border: '1px solid #FFB088',
    borderRadius: 8, padding: '1rem 1.5rem', margin: '1rem 0',
    color: '#e65100', fontSize: 14,
  }}>
    {message}
  </div>
);

const ToolBadge = ({ tool }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    background: '#FFF5F0', border: '1px solid #FFE0D0',
    borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 500,
    color: '#333',
  }}>
    {tool.icon_url ? (
      <img
        src={tool.icon_url}
        alt={tool.alt_text}
        style={{ width: 24, height: 24, objectFit: 'contain' }}
      />
    ) : (
      <span style={{
        width: 24, height: 24, background: '#FFB088',
        borderRadius: 4, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 10, color: '#fff', fontWeight: 700,
      }}>
        {tool.name[0]}
      </span>
    )}
    {tool.name}
  </div>
);

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
const CourseDetail = ({ slug }) => {
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredTopic, setHoveredTopic] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        let data = null;

        // 1st attempt: try the slug as-is (full slug like 'data-science-course-online')
        try {
          data = await apiService.getCourseBySlug(slug);
        } catch {
          // 2nd attempt: if slug is a short niche slug (e.g. 'data-science'),
          // append '-course-online' to build the full API slug
          if (!slug.endsWith('-course-online')) {
            data = await apiService.getCourseBySlug(`${slug}-course-online`);
          } else {
            throw new Error('not found');
          }
        }

        if (!cancelled) {
          setCourse(data);
          if (data?.seo) injectSEO(data.seo, data.title);
        }
      } catch (err) {
        // API unreachable — use static fallback
        const nicheKey = nicheKeyFromSlug(slug);
        const fallback = STATIC_FALLBACK[nicheKey];
        if (!cancelled) {
          if (fallback) {
            setCourse(fallback);
            if (fallback.seo) injectSEO(fallback.seo, fallback.title);
            setError('Showing cached content. Live data unavailable.');
          } else {
            setError('Course not found.');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      cleanupSEO();
    };
  }, [slug]);

  if (loading) return <LoadingSpinner />;
  if (!course) return <ErrorBanner message={error || 'Course not found.'} />;

  const curriculum = Array.isArray(course.curriculum) ? course.curriculum : [];
  const tools = Array.isArray(course.tools) ? course.tools : [];

  return (
    <section style={{
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F2 50%, #FFFFFF 100%)',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{
        position: 'absolute', top: '8%', right: '-8%',
        width: 380, height: 380,
        background: 'radial-gradient(circle, rgba(255,176,120,0.18) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', left: '-5%',
        width: 260, height: 260,
        background: 'radial-gradient(circle, rgba(255,107,107,0.12) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#FF8A54', fontSize: 14, fontWeight: 600,
            padding: '8px 0', marginBottom: '1.5rem',
          }}
        >
          ← Back to Home
        </button>

        {/* API error notice */}
        {error && <ErrorBanner message={error} />}

        {/* Hero */}
        <div style={{
          borderRadius: 16,
          overflow: 'hidden',
          marginBottom: '2.5rem',
          background: 'linear-gradient(135deg, #FF8A54 0%, #FF6B6B 100%)',
          position: 'relative',
          minHeight: 260,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '2rem',
        }}>
          {course.hero_banner_url && (
            <img
              src={course.hero_banner_url}
              alt={course.hero_banner_alt || course.title}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', opacity: 0.35,
              }}
            />
          )}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 20, padding: '4px 14px',
              fontSize: 12, fontWeight: 600, color: '#fff',
              marginBottom: 12,
            }}>
              {course.duration_weeks} Weeks &nbsp;|&nbsp; {course.difficulty_display}
            </div>
            <h1 style={{ color: '#fff', fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, margin: '0 0 8px' }}>
              {course.title}
            </h1>
            {course.tagline && (
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16, margin: 0 }}>
                {course.tagline}
              </p>
            )}
          </div>
        </div>

        {/* Description */}
        {course.description && (
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ color: '#1a1a2e', fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
              About This Course
            </h2>
            <p style={{ color: '#555', lineHeight: 1.8, fontSize: 15, whiteSpace: 'pre-line' }}>
              {course.description}
            </p>
          </div>
        )}

        {/* Curriculum */}
        {curriculum.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ color: '#1a1a2e', fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
              Curriculum
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 10,
            }}>
              {curriculum.map((item, idx) => {
                const label = typeof item === 'string' ? item : item?.module || JSON.stringify(item);
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredTopic(idx)}
                    onMouseLeave={() => setHoveredTopic(null)}
                    style={{
                      background: hoveredTopic === idx ? '#FF8A54' : '#FFF5F0',
                      border: '1px solid #FFE0D0',
                      borderRadius: 8,
                      padding: '10px 16px',
                      fontSize: 13,
                      fontWeight: 500,
                      color: hoveredTopic === idx ? '#fff' : '#333',
                      cursor: 'default',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span style={{
                      width: 20, height: 20, borderRadius: '50%',
                      background: hoveredTopic === idx ? 'rgba(255,255,255,0.3)' : '#FFB088',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700,
                      color: hoveredTopic === idx ? '#fff' : '#fff',
                      flexShrink: 0,
                    }}>
                      {idx + 1}
                    </span>
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tools */}
        {tools.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ color: '#1a1a2e', fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
              Tools You'll Learn
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {tools.map(tool => <ToolBadge key={tool.id} tool={tool} />)}
            </div>
          </div>
        )}

        {/* Salary Insights */}
        {course.salary_insights && (
          <div style={{
            background: 'linear-gradient(135deg, #FFF5F0 0%, #FFE8DC 100%)',
            border: '1px solid #FFD0B8',
            borderRadius: 12,
            padding: '1.5rem',
            marginBottom: '2.5rem',
          }}>
            <h2 style={{ color: '#1a1a2e', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              💼 Salary Insights & Career Outlook
            </h2>
            <p style={{ color: '#555', lineHeight: 1.75, fontSize: 15, margin: 0 }}>
              {course.salary_insights}
            </p>
          </div>
        )}

        {/* FAQ (rendered for users — JSON-LD is injected into <head>) */}
        {course.seo?.faq_schema?.length > 0 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ color: '#1a1a2e', fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
              Frequently Asked Questions
            </h2>
            {course.seo.faq_schema.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('skillkoder:openEnrollment', {
              detail: { course: course.title }
            }))}
            style={{
              background: 'linear-gradient(135deg, #FF8A54, #FF6B6B)',
              color: '#fff', border: 'none', borderRadius: 30,
              padding: '14px 40px', fontSize: 16, fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 6px 20px rgba(255,107,107,0.35)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
          >
            Enroll Now — {course.title}
          </button>
        </div>

      </div>

      {/* Reuse site-wide Features & Contact sections */}
      <Features />
      <Contact />
    </section>
  );
};

// Simple accordion FAQ item
const FAQItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      border: '1px solid #FFE0D0', borderRadius: 8,
      marginBottom: 8, overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left',
          background: open ? '#FFF5F0' : '#fff',
          border: 'none', padding: '14px 16px',
          cursor: 'pointer', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          fontSize: 14, fontWeight: 600, color: '#1a1a2e',
        }}
      >
        {question}
        <span style={{ color: '#FF8A54', fontSize: 18, lineHeight: 1 }}>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div style={{ padding: '12px 16px', fontSize: 14, color: '#555', lineHeight: 1.7, borderTop: '1px solid #FFE0D0' }}>
          {answer}
        </div>
      )}
    </div>
  );
};

export default CourseDetail;
