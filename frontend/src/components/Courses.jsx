import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

// Cycle through these accent colours for each card badge
const BADGE_COLORS = ['#FF8A54', '#6C63FF', '#00C6A2', '#0078D4', '#E91E8C', '#F59E0B'];

// Fallback images if a course has no hero_banner
const FALLBACK_IMAGES = [
  'course1.png',
  'course2.webp',
  'course3.webp',
  'course4.webp',
];

const FEATURED_LINKS = [
  { title: 'Data Analytics', subtitle: 'Dashboards, SQL, Power BI', path: '/courses/data-analytics' },
  { title: 'Data Science', subtitle: 'Python, ML, NLP & modeling', path: '/courses/data-science' },
  { title: 'Generative AI', subtitle: 'ChatGPT, prompt engineering & AI apps', path: '/courses/generative-ai' },
  { title: 'Azure Data Engineering', subtitle: 'Azure Data Factory, Synapse, Databricks', path: '/courses/azure-data-engineering' },
];

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService
      .getCourses({ is_active: true })
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="courses" style={{
      padding: '6rem 2rem 4rem',
      background: 'linear-gradient(180deg, #fff9f6 0%, #fff3eb 100%)',
      position: 'relative'
    }}>
      {/* Decorative Background Element */}
      <div style={{
        position: 'absolute', top: '8%', right: '6%',
        width: '320px', height: '320px',
        background: 'radial-gradient(circle, rgba(255, 201, 171, 0.32) 0%, transparent 72%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            padding: '0.75rem 1.75rem',
            background: 'rgba(255, 248, 244, 0.95)', borderRadius: '999px',
            marginBottom: '1rem', border: '1px solid rgba(255, 183, 132, 0.26)',
            boxShadow: '0 16px 40px rgba(255, 173, 130, 0.14)'
          }}>
            <span style={{ color: '#FF7A45', fontWeight: '700', fontSize: '0.95rem', letterSpacing: '0.08em' }}>
              EXPLORE OUR PREMIUM PROGRAMS
            </span>
          </div>
          <h2 style={{ fontSize: '3.25rem', fontWeight: '900', color: '#2b334e', marginBottom: '1rem', letterSpacing: '-0.05em' }}>
            Transform Your <span style={{ color: '#FF8A54' }}>Career Path</span>
          </h2>
          <p style={{ fontSize: '1.15rem', color: '#4b5568', maxWidth: '670px', margin: '0 auto', lineHeight: '1.8' }}>
            Industry-leading programs designed to take you from beginner to expert in Data Analytics, Data Science, Generative AI and Azure Data Engineering.
          </p>
          <p style={{ fontSize: '1rem', color: '#6b7280', maxWidth: '740px', margin: '1.25rem auto 0', lineHeight: '1.85' }}>
            Learn Python, Power BI, SQL, Tableau, Excel and ChatGPT through real projects, live training and placement-focused career guidance.
          </p>
        </div>

        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '3rem' }}>
          {FEATURED_LINKS.map(link => (
            <div key={link.path} style={{
              background: 'white', borderRadius: '26px', padding: '1.5rem',
              boxShadow: '0 18px 40px rgba(15, 23, 42, 0.06)',
              border: '1px solid #f6eff0'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1f2937' }}>
                {link.title}
              </h3>
              <p style={{ margin: '0.75rem 0 1.25rem', color: '#4a5568', lineHeight: '1.7' }}>
                {link.subtitle}
              </p>
              <button
                style={{
                  background: 'linear-gradient(135deg, #FF8A54, #FFB088)',
                  color: 'white', border: 'none', borderRadius: '999px',
                  padding: '0.85rem 1.5rem', fontWeight: 700, cursor: 'pointer'
                }}
                onClick={() => {
                  navigate(link.path);
                  window.scrollTo(0, 0);
                }}
              >
                Explore
              </button>
            </div>
          ))}
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <div style={{
              width: 48, height: 48, margin: '0 auto',
              border: '4px solid #FFE8DC', borderTopColor: '#FF8A54',
              borderRadius: '50%', animation: 'sk-spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes sk-spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Course Cards */}
        {!loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {courses.map((course, index) => {
              const badge = BADGE_COLORS[index % BADGE_COLORS.length];
              const image = course.hero_banner_url || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
              const isEven = index % 2 === 0;

              return (
                <div
                  key={course.slug}
                  className="course-card"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isEven ? '1.2fr 1fr' : '1fr 1.2fr',
                    gap: '3rem', alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.96)', borderRadius: '36px',
                    padding: '2rem', border: '1px solid rgba(255, 176, 136, 0.18)',
                    transition: 'all 0.4s ease',
                    boxShadow: '0 24px 70px rgba(255, 160, 110, 0.12)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 32px 90px rgba(255, 150, 90, 0.18)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 24px 70px rgba(255, 160, 110, 0.12)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Image */}
                  <div style={{
                    order: isEven ? 1 : 2,
                    position: 'relative', borderRadius: '25px',
                    overflow: 'hidden', height: '300px', minHeight: '250px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)', width: '100%'
                  }}>
                    <img
                      src={image}
                      alt={course.title}
                      style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'center',
                        transition: 'transform 0.4s ease', display: 'block'
                      }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                      onError={e => { e.target.src = FALLBACK_IMAGES[0]; }}
                    />
                    <div style={{
                      position: 'absolute', top: '1rem', right: '1rem',
                      background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
                      padding: '0.5rem 1rem', borderRadius: '20px',
                      fontWeight: '600', fontSize: '0.85rem', color: badge
                    }}>
                      {course.difficulty_display || course.difficulty}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ order: isEven ? 2 : 1, padding: '1rem' }}>
                    <div style={{
                      display: 'inline-block', padding: '0.4rem 1rem',
                      background: '#FFF5F0', borderRadius: '20px',
                      marginBottom: '1.5rem', fontSize: '0.85rem',
                      color: '#FF8A54', fontWeight: '600'
                    }}>
                      {course.duration_weeks} Weeks
                    </div>

                    <h3 style={{ fontSize: '2rem', fontWeight: '700', color: '#2d3748', marginBottom: '1rem' }}>
                      {course.title}
                    </h3>

                    <p style={{ color: '#4a5568', lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                      {course.tagline || course.meta_description}
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <button
                        style={{
                          background: 'linear-gradient(135deg, #FF8A54 0%, #FFB088 100%)',
                          color: 'white', padding: '1rem 2.25rem', borderRadius: '999px',
                          border: 'none', fontWeight: '700', fontSize: '1rem',
                          cursor: 'pointer', transition: 'all 0.25s ease',
                          boxShadow: '0 18px 45px rgba(255, 138, 84, 0.25)'
                        }}
                        onClick={() => window.dispatchEvent(new CustomEvent('skillkoder:openEnrollment', { detail: { course: course.title } }))}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 24px 55px rgba(255, 138, 84, 0.32)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 18px 45px rgba(255, 138, 84, 0.25)';
                        }}
                      >
                        Enroll Now
                      </button>

                      <button
                        style={{
                          background: 'white', color: '#FF8A54',
                          padding: '1rem 2.25rem', borderRadius: '999px',
                          border: '2px solid rgba(255, 176, 136, 0.45)', fontWeight: '700',
                          fontSize: '1rem', cursor: 'pointer', transition: 'all 0.25s ease',
                          boxShadow: '0 10px 30px rgba(255, 155, 110, 0.12)'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = '#FFF7F2';
                          e.currentTarget.style.borderColor = '#FFAB72';
                          e.currentTarget.style.transform = 'translateY(-3px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'white';
                          e.currentTarget.style.borderColor = 'rgba(255, 176, 136, 0.45)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                        onClick={() => {
                          navigate(`/courses/${course.slug}`);
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
        )}
      </div>

      <style>{`
        @media (max-width: 968px) {
          #courses h2 { font-size: 2.2rem !important; }
          .course-card { grid-template-columns: 1fr !important; }
          .course-card > div { order: 1 !important; }
          .course-card > div:first-child { height: 250px !important; min-height: 200px !important; }
        }
        @media (max-width: 640px) {
          #courses { padding: 3rem 1rem !important; }
          #courses h2 { font-size: 1.8rem !important; }
          .course-card > div:first-child { height: 220px !important; min-height: 180px !important; }
          #courses button { width: 100% !important; padding: 0.8rem 1.5rem !important; }
        }
      `}</style>
    </section>
  );
};

export default Courses;