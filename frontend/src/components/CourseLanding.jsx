import React from 'react';
import { useNavigate } from 'react-router-dom';
import Features from './Features';
import Contact from './Contact';

const CourseLanding = ({
  course,
  heroLabel,
  heroTitle,
  heroTagline,
  heroDescription,
  imageSrc,
  overview,
  topics,
  tools,
  brochureLink,
  brochureLabel,
  ctaLabel,
  enrollCourse,
  stats,
  highlights
}) => {
  const navigate = useNavigate();

  return (
    <section style={{
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF9F3 48%, #FFFFFF 100%)',
      position: 'relative',
      overflow: 'hidden',
      paddingBottom: '4rem'
    }}>
      <div style={{
        position: 'absolute',
        top: '8%',
        left: '-10%',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,138,84,0.18) 0%, transparent 68%)',
        filter: 'blur(100px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '5%',
        right: '-8%',
        width: '520px',
        height: '520px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,176,136,0.14) 0%, transparent 70%)',
        filter: 'blur(110px)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '2rem 1rem 0 1rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
          <button
            onClick={() => { navigate('/'); window.scrollTo(0, 0); }}
            style={{
              padding: '0.9rem 1.9rem',
              borderRadius: 999,
              border: 'none',
              background: 'white',
              color: '#FF6B40',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 18px 45px rgba(255,109,64,0.14)',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease'
            }}
            onMouseEnter={e => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 22px 50px rgba(255,109,64,0.22)';
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 18px 45px rgba(255,109,64,0.14)';
            }}
          >
            Back to Home
          </button>

          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.7rem 1.4rem',
            borderRadius: 999,
            background: 'rgba(255,234,221,0.95)',
            color: '#D14B1E',
            fontWeight: 700,
            letterSpacing: '0.08em',
            fontSize: '0.95rem',
            border: '1px solid rgba(255,138,84,0.14)'
          }}>
            {heroLabel}
          </span>
        </div>

        <div className="course-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.85fr', gap: '2rem', alignItems: 'start' }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
              lineHeight: 1.04,
              margin: '0 0 1.2rem 0',
              color: '#1F2937',
              fontWeight: 900
            }}>
              {heroTitle}
            </h1>
            <p style={{
              fontSize: 'clamp(1.05rem, 1.7vw, 1.3rem)',
              color: '#475569',
              maxWidth: '760px',
              margin: '0 0 1.5rem 0',
              lineHeight: 1.78
            }}>
              {heroTagline}
            </p>
            <p style={{
              fontSize: '1rem',
              color: '#4B5563',
              maxWidth: '760px',
              lineHeight: 1.8,
              marginBottom: '2rem'
            }}>
              {heroDescription}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.85rem', marginBottom: '2rem' }}>
              {['Career-ready projects', 'Live training', 'Expert mentorship', 'Industry tools', 'Placement support'].map(item => (
                <div key={item} style={{
                  background: 'white',
                  borderRadius: '22px',
                  padding: '1rem 1.2rem',
                  boxShadow: '0 18px 35px rgba(255,138,84,0.08)',
                  border: '1px solid rgba(255,138,84,0.12)',
                  color: '#334155',
                  fontWeight: 600,
                  fontSize: '0.94rem'
                }}>
                  {item}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('skillkoder:openEnrollment', { detail: { course: enrollCourse } }))}
                style={{
                  padding: '1rem 2.4rem',
                  borderRadius: 999,
                  border: 'none',
                  background: 'linear-gradient(135deg, #FF6B40, #FFAE7F)',
                  color: 'white',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 18px 40px rgba(255,109,64,0.28)',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                }}
                onMouseEnter={e => {
                  e.target.style.transform = 'translateY(-3px)';
                  e.target.style.boxShadow = '0 22px 45px rgba(255,109,64,0.34)';
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 18px 40px rgba(255,109,64,0.28)';
                }}
              >
                {ctaLabel}
              </button>

              <button
                onClick={() => window.open(brochureLink, '_blank')}
                style={{
                  padding: '1rem 2.4rem',
                  borderRadius: 999,
                  border: '2px solid #FFB088',
                  background: 'white',
                  color: '#FF6B40',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.25s ease, transform 0.25s ease'
                }}
                onMouseEnter={e => {
                  e.target.style.background = '#FFF5F2';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'white';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {brochureLabel}
              </button>
            </div>
          </div>

          <div style={{
            borderRadius: '32px',
            background: 'linear-gradient(180deg, #FFF7F0 0%, #FFFFFF 100%)',
            boxShadow: '0 40px 80px rgba(255,138,84,0.12)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.75rem'
          }}>
            <img
              src={imageSrc}
              alt={`${course} hero image`}
              style={{
                width: '100%',
                borderRadius: '24px',
                objectFit: 'cover',
                minHeight: '340px'
              }}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
              {stats.map(item => (
                <div key={item.label} style={{
                  borderRadius: '24px',
                  background: 'white',
                  padding: '1.2rem',
                  border: '1px solid rgba(255,138,84,0.12)',
                  boxShadow: '0 14px 30px rgba(255,138,84,0.08)'
                }}>
                  <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#FF6B40', marginBottom: '0.4rem' }}>{item.value}</div>
                  <div style={{ color: '#475569', fontWeight: 700 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: '2rem', marginTop: '3rem' }}>
          <div style={{
            background: 'white',
            borderRadius: '30px',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(255,138,84,0.12)',
            border: '1px solid rgba(255,138,84,0.1)'
          }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '1rem', color: '#1F2937' }}>What you'll learn</h2>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>{overview[0]}</p>
            <ul style={{ listStyle: 'disc inside', color: '#475569', lineHeight: 1.9, fontSize: '1rem' }}>
              {overview.slice(1).map(item => (
                <li key={item} style={{ marginBottom: '0.75rem' }}>{item}</li>
              ))}
            </ul>
          </div>

          <div style={{
            background: 'linear-gradient(180deg, #FFF8F2 0%, #FFFFFF 100%)',
            borderRadius: '30px',
            padding: '2rem',
            boxShadow: '0 25px 60px rgba(255,138,84,0.1)',
            border: '1px solid rgba(255,138,84,0.12)'
          }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '1rem', color: '#1F2937' }}>Why this program works</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {highlights.map((item, index) => (
                <div key={index} style={{
                  background: 'white',
                  borderRadius: '22px',
                  padding: '1rem 1.2rem',
                  border: '1px solid rgba(255,138,84,0.12)',
                  boxShadow: '0 14px 30px rgba(255,138,84,0.08)'
                }}>
                  <p style={{ margin: 0, color: '#334155', fontWeight: 700 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '2rem', marginTop: '3rem' }}>
          <div style={{ background: 'white', borderRadius: '30px', padding: '2rem', boxShadow: '0 25px 60px rgba(255,138,84,0.12)', border: '1px solid rgba(255,138,84,0.1)' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '1rem', color: '#1F2937' }}>Course curriculum highlights</h2>
            <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', listStyle: 'none', padding: 0, margin: 0 }}>
              {topics.slice(0, 6).map((topic, index) => (
                <li key={index} style={{ background: '#FFF7F1', borderRadius: '18px', padding: '1rem 1rem', color: '#D14B1E', fontWeight: 700 }}>{topic}</li>
              ))}
            </ul>
          </div>

          <div style={{ background: 'white', borderRadius: '30px', padding: '2rem', boxShadow: '0 25px 60px rgba(255,138,84,0.12)', border: '1px solid rgba(255,138,84,0.1)' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, marginBottom: '1rem', color: '#1F2937' }}>Tools you'll master</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {tools.map((tool, index) => (
                <div key={index} style={{ background: '#FFFAF7', borderRadius: '18px', padding: '1rem 1rem', color: '#334155', fontWeight: 700 }}>{tool}</div>
              ))}
            </div>
          </div>
        </div>

        <Features />
        <Contact />
      </div>

      <style>{`
        .course-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .course-scrollbar::-webkit-scrollbar-track {
          background: #FFF4ED;
          border-radius: 10px;
        }
        .course-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #FF6B40, #FFB088);
          border-radius: 10px;
        }
        .course-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #FF9B6B, #FF6B40);
        }
        @media (max-width: 980px) {
          .course-hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 760px) {
          .course-hero-grid,
          .course-info-grid,
          .course-metrics-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default CourseLanding;
