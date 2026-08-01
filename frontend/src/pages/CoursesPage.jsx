import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { applySEO } from '../utils/seo';

const BADGE_COLORS = ['#FF8A54', '#6C63FF', '#00C6A2', '#0078D4', '#E91E8C', '#F59E0B'];

const FLAGSHIP_COURSES = [
  {
    title: 'Data Analytics',
    tagline: 'Master analytical tools and build industry-grade interactive dashboards.',
    description: 'Acquire high-demand expertise in database querying, data modeling, advanced analytical computations, and interactive visualizations. Learn how to transform raw, complex data sets into highly actionable commercial insights.',
    duration: '12 Weeks',
    level: 'Beginner to Professional',
    image: '/data_analytics.webp',
    badgeColor: '#FF8A54',
    badgeBg: '#FFF5F0',
    path: '/courses/data-analytics',
    tools: ['SQL', 'Power BI', 'Tableau', 'Excel', 'Python', 'ETL Pipelines', 'Data Visualisation']
  },
  {
    title: 'Data Science',
    tagline: 'Unlock predictive power through machine learning and advanced statistical modeling.',
    description: 'Step into the vanguard of modern technology. Master comprehensive statistical testing, supervised and unsupervised machine learning algorithms, natural language processing (NLP), and sophisticated predictive architectures.',
    duration: '16 Weeks',
    level: 'Intermediate to Advanced',
    image: '/data_science.webp',
    badgeColor: '#6C63FF',
    badgeBg: '#F3F2FF',
    path: '/courses/data-science',
    tools: ['Python', 'Machine Learning', 'NLP', 'Pandas & NumPy', 'Scikit-Learn', 'Statistics', 'Deep Learning']
  },
  {
    title: 'Generative AI',
    tagline: 'Engineer state-of-the-art AI solutions and build custom LLM-powered applications.',
    description: 'Position yourself at the leading edge of AI innovation. Gain hands-on mastery in advanced prompt engineering, Large Language Models (LLMs), LangChain orchestrations, vector databases, and seamless api agent deployments.',
    duration: '8 Weeks',
    level: 'Beginner to Advanced',
    image: '/genai.webp',
    badgeColor: '#00C6A2',
    badgeBg: '#E6FCF7',
    path: '/courses/generative-ai',
    tools: ['LLMs', 'Prompt Engineering', 'LangChain', 'Vector DBs', 'ChatGPT API', 'AI Agents', 'Automation']
  },
  {
    title: 'Azure Data Engineering',
    tagline: 'Design and deploy robust enterprise data pipelines in the Microsoft Cloud ecosystem.',
    description: 'Build enterprise-grade cloud architectures. Master comprehensive data processing workflows using Azure Data Factory, Azure Databricks, PySpark scripting, and high-performance Synapse Analytics clusters.',
    duration: '14 Weeks',
    level: 'Intermediate to Expert',
    image: '/azure_data_bg.jpg',
    badgeColor: '#0078D4',
    badgeBg: '#EBF6FF',
    path: '/courses/azure-data-engineering',
    tools: ['Azure Data Factory', 'Azure Databricks', 'Synapse Analytics', 'PySpark', 'ETL Pipelines', 'Data Lake', 'SQL Warehouse']
  }
];

const CoursesPage = () => {
  const navigate = useNavigate();
  const [extraCourses, setExtraCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    applySEO('/courses');

    apiService
      .getCourses({ is_active: true })
      .then(fetched => {
        // Exclude the flagship courses if they are fetched from dynamic backend to avoid duplication
        const flagships = ['data-analytics', 'data-science', 'generative-ai', 'azure-data-engineering'];
        const filtered = fetched.filter(c => !flagships.includes(c.slug));
        setExtraCourses(filtered);
      })
      .catch(() => setExtraCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', fontFamily: "'Outfit', 'Inter', sans-serif" }}>

      {/* ── Page Hero ── */}
      <section style={{
        background: 'linear-gradient(135deg, #fff7f2 0%, #ffffff 50%, #f1f5ff 100%)',
        padding: '6rem 2rem 5rem', textAlign: 'center',
        borderBottom: '1px solid #f3f4f6',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '300px',
          background: 'radial-gradient(circle, rgba(255, 138, 84, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none', borderRadius: '50%'
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center',
          padding: '0.5rem 1.5rem',
          background: '#FFF5F0', borderRadius: '30px',
          marginBottom: '1.5rem', border: '1px solid #FFE8DC',
          boxShadow: '0 4px 15px rgba(255, 138, 84, 0.05)'
        }}>
          <span style={{ color: '#C2410C', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.08em' }}>
            CAREER-ACCELERATING PROGRAMS
          </span>
        </div>
        
        <h1 style={{
          fontSize: 'clamp(2.25rem, 6vw, 3.5rem)', fontWeight: '900',
          color: '#1e293b', marginBottom: '1.25rem', lineHeight: 1.15,
          letterSpacing: '-0.03em'
        }}>
          Courses Built for the{' '}
          <span style={{
            background: 'linear-gradient(135deg, #FF6B6B, #FF8A54)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Real World</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#475569', maxWidth: '680px', margin: '0 auto', lineHeight: 1.8 }}>
          Industry-aligned curricula taught by seasoned technical practitioners. Pick your learning path, master highly valued production tools, and launch your career.
        </p>
      </section>

      {/* ── Flagship Programs Sections ── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 2rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Our Flagship Specializations
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.05rem', maxWidth: '580px', margin: '0 auto', lineHeight: 1.6 }}>
            Deep-dive programs with live training, custom industry projects, and dedicated career guidance.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
          {FLAGSHIP_COURSES.map((course, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={course.path}
                className="course-section-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: isEven ? '1.2fr 1fr' : '1fr 1.2fr',
                  gap: '4rem',
                  alignItems: 'center',
                  background: '#ffffff',
                  borderRadius: '36px',
                  padding: '2.5rem',
                  border: '1px solid rgba(255, 176, 136, 0.15)',
                  boxShadow: '0 12px 36px rgba(15, 23, 42, 0.03)',
                  transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Visual Container */}
                <div
                  className="course-visual-container"
                  style={{
                    order: isEven ? 1 : 2,
                    position: 'relative',
                    borderRadius: '28px',
                    overflow: 'hidden',
                    height: '350px',
                    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.07)',
                  }}
                >
                  <img loading="lazy" decoding="async"
                    src={course.image}
                    alt={course.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                      transition: 'transform 0.5s ease',
                    }}
                    className="course-visual-img"
                  />
                  {/* Floating Level Badge */}
                  <div style={{
                    position: 'absolute',
                    top: '1.25rem',
                    right: '1.25rem',
                    background: 'rgba(255, 255, 255, 0.96)',
                    backdropFilter: 'blur(8px)',
                    padding: '0.5rem 1.1rem',
                    borderRadius: '24px',
                    fontWeight: '700',
                    fontSize: '0.82rem',
                    color: course.badgeColor,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    border: `1px solid ${course.badgeColor}22`
                  }}>
                    {course.level}
                  </div>
                </div>

                {/* Information Container */}
                <div
                  className="course-info-container"
                  style={{
                    order: isEven ? 2 : 1,
                    padding: '0.5rem'
                  }}
                >
                  {/* Duration Capsule */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.4rem 1.1rem',
                    background: course.badgeBg,
                    borderRadius: '24px',
                    marginBottom: '1.25rem',
                    fontSize: '0.85rem',
                    color: course.badgeColor,
                    fontWeight: '700',
                    border: `1px solid ${course.badgeColor}15`
                  }}>
                    ⏳ {course.duration} Program
                  </div>

                  <h3 style={{
                    fontSize: '2.25rem',
                    fontWeight: '800',
                    color: '#0f172a',
                    marginBottom: '0.5rem',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2
                  }}>
                    {course.title}
                  </h3>

                  <p style={{
                    fontSize: '1.05rem',
                    color: course.badgeColor,
                    fontWeight: '600',
                    marginBottom: '1.25rem',
                    lineHeight: 1.4
                  }}>
                    {course.tagline}
                  </p>

                  <p style={{
                    color: '#475569',
                    lineHeight: 1.75,
                    marginBottom: '1.75rem',
                    fontSize: '1rem'
                  }}>
                    {course.description}
                  </p>

                  {/* Curated Tool Badges */}
                  <div style={{ marginBottom: '2.25rem' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                      Key Tools & Skills Covered:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                      {course.tools.map(tool => (
                        <span
                          key={tool}
                          style={{
                            padding: '0.35rem 0.9rem',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '16px',
                            fontSize: '0.82rem',
                            color: '#334155',
                            fontWeight: '600',
                          }}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Buttons */}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                      style={{
                        background: 'linear-gradient(135deg, #FF8A54 0%, #FFB088 100%)',
                        color: '#ffffff',
                        padding: '0.9rem 2.25rem',
                        borderRadius: '30px',
                        border: 'none',
                        fontWeight: '700',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        boxShadow: '0 8px 20px rgba(255, 138, 84, 0.25)',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      className="btn-enroll"
                      onClick={() =>
                        window.dispatchEvent(new CustomEvent('skillkoder:openEnrollment', { detail: { course: course.title } }))
                      }
                    >
                      Enroll Now
                    </button>

                    <button
                      style={{
                        background: '#ffffff',
                        color: '#C2410C',
                        padding: '0.9rem 2.25rem',
                        borderRadius: '30px',
                        border: '2px solid #FFE8DC',
                        fontWeight: '700',
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      className="btn-details"
                      onClick={() => {
                        navigate(course.path);
                        window.scrollTo(0, 0);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Extra/Dynamic Specializations ── */}
      {!loading && extraCourses.length > 0 && (
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.75rem' }}>
              Additional Pathways & Electives
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>
              Explore other highly focused curriculum offerings.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {extraCourses.map((course, index) => {
              const badge = BADGE_COLORS[index % BADGE_COLORS.length];
              const image = course.hero_banner_url || '/course1.jpg';

              return (
                <div
                  key={course.slug}
                  style={{
                    background: '#ffffff',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                    <img loading="lazy" decoding="async"
                      src={image}
                      alt={course.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.src = '/course1.jpg'; }}
                    />
                    <div style={{
                      position: 'absolute', top: '1rem', right: '1rem',
                      background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)',
                      padding: '0.4rem 0.9rem', borderRadius: '16px',
                      fontWeight: '700', fontSize: '0.8rem', color: badge
                    }}>
                      {course.difficulty_display || course.difficulty}
                    </div>
                  </div>
                  <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ color: '#C2410C', fontWeight: '700', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                      ⏳ {course.duration_weeks} WEEKS
                    </div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.75rem' }}>
                      {course.title}
                    </h3>
                    <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                      {course.tagline || course.meta_description}
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #C2410C, #9A3412)',
                          color: '#fff', border: 'none', borderRadius: '20px',
                          padding: '0.7rem', fontWeight: '700', cursor: 'pointer', fontSize: '0.88rem'
                        }}
                        onClick={() =>
                          window.dispatchEvent(new CustomEvent('skillkoder:openEnrollment', { detail: { course: course.title } }))
                        }
                      >
                        Enroll
                      </button>
                      <button
                        style={{
                          flex: 1,
                          background: '#fff', color: '#C2410C',
                          border: '1.5px solid #FFE8DC', borderRadius: '20px',
                          padding: '0.7rem', fontWeight: '700', cursor: 'pointer', fontSize: '0.88rem'
                        }}
                        onClick={() => {
                          navigate(`/courses/${course.slug}`);
                          window.scrollTo(0, 0);
                        }}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Global Page Hover / Transition Effects (via standard CSS injection) ── */}
      <style>{`
        .course-section-row:hover {
          box-shadow: 0 24px 60px rgba(255, 138, 84, 0.08) !important;
          border-color: rgba(255, 176, 136, 0.35) !important;
          transform: translateY(-4px);
        }
        .course-visual-container:hover .course-visual-img {
          transform: scale(1.05);
        }
        .btn-enroll:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(255, 138, 84, 0.45) !important;
        }
        .btn-details:hover {
          background: #FFF5F0 !important;
          border-color: #FFB088 !important;
        }
        @media (max-width: 992px) {
          .course-section-row {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            padding: 2rem !important;
          }
          .course-visual-container {
            order: 0 !important;
            height: 280px !important;
          }
          .course-info-container {
            order: 1 !important;
          }
        }
        @media (max-width: 576px) {
          .course-visual-container {
            height: 200px !important;
          }
          .course-section-row {
            padding: 1.5rem !important;
            border-radius: 24px !important;
          }
          .course-info-container button {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CoursesPage;
