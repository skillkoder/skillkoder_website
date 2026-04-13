import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

// Cycle through these accent colours for each card badge
const BADGE_COLORS = ['#FF8A54', '#6C63FF', '#00C6A2', '#0078D4', '#E91E8C', '#F59E0B'];

// Fallback images if a course has no hero_banner
const FALLBACK_IMAGES = [
  'course1.webp',
  'course2.webp',
  'course3.webp',
  'course4.png',
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
      padding: '5rem 2rem',
      background: 'radial-gradient(ellipse at center, #ffffff 0%, #fffaf6 45%, #fff2ea 85%)',
      position: 'relative'
    }}>
      {/* Decorative Background Element */}
      <div style={{
        position: 'absolute', top: '10%', right: '5%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(255, 228, 196, 0.3) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative' }}>
          <div style={{
            display: 'inline-block', padding: '0.5rem 1.5rem',
            background: '#FFF5F0', borderRadius: '25px',
            marginBottom: '1rem', border: '1px solid #FFE8DC'
          }}>
            <span style={{ color: '#FF8A54', fontWeight: '600', fontSize: '0.9rem' }}>
              EXPLORE OUR PROGRAMS
            </span>
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: '700', color: '#2d3748', marginBottom: '1rem' }}>
            Transform Your <span style={{ color: '#FFB088' }}>Career Path</span>
          </h2>
          <p style={{ fontSize: '1.15rem', color: '#4a5568', maxWidth: '650px', margin: '0 auto', lineHeight: '1.7' }}>
            Industry-leading programs designed to take you from beginner to expert
          </p>
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
                    background: '#ffffff', borderRadius: '35px',
                    padding: '2rem', border: '2px solid #f5f5f5',
                    transition: 'all 0.4s ease',
                    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.04)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = '0 15px 50px rgba(255, 176, 136, 0.15)';
                    e.currentTarget.style.borderColor = '#FFE8DC';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.04)';
                    e.currentTarget.style.borderColor = '#f5f5f5';
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
                          color: 'white', padding: '0.9rem 2.5rem', borderRadius: '25px',
                          border: 'none', fontWeight: '600', fontSize: '1rem',
                          cursor: 'pointer', transition: 'all 0.3s ease',
                          boxShadow: '0 4px 15px rgba(255, 138, 84, 0.3)'
                        }}
                        onClick={() => window.dispatchEvent(new CustomEvent('skillkoder:openEnrollment', { detail: { course: course.title } }))}
                        onMouseEnter={e => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 25px rgba(255, 138, 84, 0.4)';
                        }}
                        onMouseLeave={e => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 15px rgba(255, 138, 84, 0.3)';
                        }}
                      >
                        Enroll Now
                      </button>

                      <button
                        style={{
                          background: 'transparent', color: '#FF8A54',
                          padding: '0.9rem 2.5rem', borderRadius: '25px',
                          border: '2px solid #FFE8DC', fontWeight: '600',
                          fontSize: '1rem', cursor: 'pointer', transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={e => {
                          e.target.style.background = '#FFF5F0';
                          e.target.style.borderColor = '#FFB088';
                        }}
                        onMouseLeave={e => {
                          e.target.style.background = 'transparent';
                          e.target.style.borderColor = '#FFE8DC';
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