import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const BADGE_COLORS = ['#FF8A54', '#6C63FF', '#00C6A2', '#0078D4', '#E91E8C', '#F59E0B'];
const FALLBACK_IMAGES = ['course1.png', 'course2.webp', 'course3.webp', 'course4.webp'];

// Derive short bullet highlights from curriculum (first 4 items)
function getHighlights(course) {
  if (Array.isArray(course.curriculum) && course.curriculum.length > 0) {
    return course.curriculum.slice(0, 4).map(item =>
      typeof item === 'string' ? item : item?.module || ''
    );
  }
  return [];
}

const FEATURED_PAGES = [
  {
    title: 'Data Analytics',
    description: 'Build analytical dashboards, SQL skills, and Power BI expertise with our Data Analytics course.',
    path: '/courses/data-analytics',
  },
  {
    title: 'Data Science',
    description: 'Learn machine learning, Python, NLP, and data modeling in a job-ready Data Science program.',
    path: '/courses/data-science',
  },
  {
    title: 'Generative AI',
    description: 'Master AI models, prompt engineering, and generative workflows for modern applications.',
    path: '/courses/generative-ai',
  },
  {
    title: 'Azure Data Engineering',
    description: 'Learn Azure Data Factory, Databricks, Synapse and modern data pipelines for cloud careers.',
    path: '/courses/azure-data-engineering',
  },
];

const CoursesPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.title = 'Courses — SkillKoder';

    apiService
      .getCourses({ is_active: true })
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>

      {/* ── Page Hero ── */}
      <section style={{
        background: 'linear-gradient(135deg, #fff6f0 0%, #fff 60%, #f0f4ff 100%)',
        padding: '5rem 2rem 4rem', textAlign: 'center',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <div style={{
          display: 'inline-block', padding: '0.45rem 1.4rem',
          background: '#FFF5F0', borderRadius: '25px',
          marginBottom: '1rem', border: '1px solid #FFE8DC',
        }}>
          <span style={{ color: '#FF8A54', fontWeight: '600', fontSize: '0.88rem', letterSpacing: '0.05em' }}>
            OUR PROGRAMS
          </span>
        </div>
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: '800',
          color: '#1a202c', marginBottom: '1rem', lineHeight: 1.2,
        }}>
          Courses Built for the{' '}
          <span style={{
            background: 'linear-gradient(135deg, #FF6B6B, #FFB088)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Real World</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#4a5568', maxWidth: '600px', margin: '0 auto', lineHeight: 1.75 }}>
          Industry-aligned programs taught by practitioners. Pick your path and start building job-ready skills today.
        </p>
      </section>

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem 0' }}>
        <div style={{ display: 'grid', gap: '1.25rem', gridTemplateColumns: 'repeat(auto-fit, minmax(235px, 1fr))' }}>
          {FEATURED_PAGES.map(page => (
            <div key={page.path} style={{
              padding: '1.75rem', borderRadius: '28px', background: '#fff',
              border: '1px solid #f0f0f0', boxShadow: '0 18px 45px rgba(15, 23, 42, 0.04)',
            }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#1c2938', marginBottom: '0.75rem' }}>
                {page.title}
              </h2>
              <p style={{ color: '#596174', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                {page.description}
              </p>
              <button
                style={{
                  border: 'none', borderRadius: '999px', padding: '0.9rem 1.85rem',
                  background: 'linear-gradient(135deg, #FF8A54, #FFB088)',
                  color: '#fff', fontWeight: 700, cursor: 'pointer'
                }}
                onClick={() => {
                  navigate(page.path);
                  window.scrollTo(0, 0);
                }}
              >
                Explore Page
              </button>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{
              width: 52, height: 52, margin: '0 auto',
              border: '4px solid #FFE8DC', borderTopColor: '#FF8A54',
              borderRadius: '50%', animation: 'sk-spin 0.8s linear infinite',
            }} />
            <p style={{ marginTop: '1.25rem', color: '#aaa', fontSize: '0.95rem' }}>Loading courses…</p>
            <style>{`@keyframes sk-spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Empty state */}
        {!loading && courses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#aaa' }}>
            <p style={{ fontSize: '1.1rem' }}>No courses available right now. Check back soon!</p>
          </div>
        )}

        {/* Dynamic cards */}
        {!loading && courses.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {courses.map((course, index) => {
              const badge = BADGE_COLORS[index % BADGE_COLORS.length];
              const image = course.hero_banner_url || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
              const highlights = getHighlights(course);
              const isEven = index % 2 === 0;

              return (
                <div
                  key={course.slug}
                  className="cp-card"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isEven ? '1.15fr 1fr' : '1fr 1.15fr',
                    gap: '3rem', alignItems: 'center',
                    background: '#fff', borderRadius: '32px',
                    padding: '2rem', border: '2px solid #f5f5f5',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 16px 48px rgba(255,176,136,0.15)';
                    e.currentTarget.style.borderColor = '#FFE8DC';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.04)';
                    e.currentTarget.style.borderColor = '#f5f5f5';
                  }}
                >
                  {/* Image */}
                  <div
                    className="cp-img"
                    style={{
                      order: isEven ? 1 : 2,
                      position: 'relative', borderRadius: '24px',
                      overflow: 'hidden', height: '320px',
                      boxShadow: '0 8px 28px rgba(0,0,0,0.1)',
                    }}
                  >
                    <img
                      src={image}
                      alt={course.hero_banner_alt || course.title}
                      style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'center',
                        display: 'block', transition: 'transform 0.4s ease',
                      }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                      onError={e => { e.target.src = FALLBACK_IMAGES[0]; }}
                    />
                    {/* Level badge */}
                    <div style={{
                      position: 'absolute', top: '1rem', right: '1rem',
                      background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
                      padding: '0.45rem 1rem', borderRadius: '20px',
                      fontWeight: '600', fontSize: '0.82rem', color: badge,
                    }}>
                      {course.difficulty_display || course.difficulty}
                    </div>
                  </div>

                  {/* Body */}
                  <div
                    className="cp-body"
                    style={{ order: isEven ? 2 : 1, padding: '0.5rem 0' }}
                  >
                    {/* Duration pill */}
                    <div style={{
                      display: 'inline-block', padding: '0.35rem 1rem',
                      background: '#FFF5F0', borderRadius: '20px',
                      marginBottom: '1.25rem', fontSize: '0.83rem',
                      color: '#FF8A54', fontWeight: '600',
                    }}>
                      {course.duration_weeks} Weeks
                    </div>

                    <h2 style={{
                      fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: '700',
                      color: '#1a202c', marginBottom: '0.9rem', lineHeight: 1.25,
                    }}>
                      {course.title}
                    </h2>

                    <p style={{ color: '#4a5568', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1rem' }}>
                      {course.tagline || course.meta_description}
                    </p>

                    {/* Highlights from curriculum */}
                    {highlights.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                        {highlights.map(h => (
                          <span key={h} style={{
                            padding: '0.3rem 0.85rem',
                            background: '#f9f9f9', border: '1px solid #eee',
                            borderRadius: '14px', fontSize: '0.82rem',
                            color: '#555', fontWeight: '500',
                          }}>
                            {h}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="cp-btns" style={{ display: 'flex', gap: '0.9rem', flexWrap: 'wrap' }}>
                      <button
                        style={{
                          background: 'linear-gradient(135deg, #FF8A54 0%, #FFB088 100%)',
                          color: '#fff', padding: '0.85rem 2.2rem', borderRadius: '25px',
                          border: 'none', fontWeight: '600', fontSize: '0.95rem',
                          cursor: 'pointer', boxShadow: '0 4px 14px rgba(255,138,84,0.3)',
                          transition: 'all 0.3s ease',
                        }}
                        onClick={() =>
                          window.dispatchEvent(new CustomEvent('skillkoder:openEnrollment', { detail: { course: course.title } }))
                        }
                        onMouseEnter={e => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 24px rgba(255,138,84,0.4)';
                        }}
                        onMouseLeave={e => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 14px rgba(255,138,84,0.3)';
                        }}
                      >
                        Enroll Now
                      </button>

                      <button
                        style={{
                          background: 'transparent', color: '#FF8A54',
                          padding: '0.85rem 2.2rem', borderRadius: '25px',
                          border: '2px solid #FFE8DC', fontWeight: '600',
                          fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.3s ease',
                        }}
                        onClick={() => {
                          navigate(`/courses/${course.slug}`);
                          window.scrollTo(0, 0);
                        }}
                        onMouseEnter={e => {
                          e.target.style.background = '#FFF5F0';
                          e.target.style.borderColor = '#FFB088';
                        }}
                        onMouseLeave={e => {
                          e.target.style.background = 'transparent';
                          e.target.style.borderColor = '#FFE8DC';
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
        )}
      </section>

      <style>{`
        @media (max-width: 900px) {
          .cp-card { grid-template-columns: 1fr !important; }
          .cp-img  { order: 0 !important; height: 260px !important; }
          .cp-body { order: 1 !important; }
        }
        @media (max-width: 560px) {
          .cp-img  { height: 210px !important; }
          .cp-btns { flex-direction: column !important; }
          .cp-btns button { width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default CoursesPage;
