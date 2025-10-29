import React, { useState } from 'react';
import Features from './Features';
import Contact from './Contact';

const DataAnalytics = () => {
  const [hoveredTopic, setHoveredTopic] = useState(null);
  const [hoveredTool, setHoveredTool] = useState(null);

  const topics = [
    'Power BI Course',
    'Power BI Ecosystem & Report Design',
    'Visual Interaction, Grouping & Hierarchies',
    'Data Transformation with Power Query',
    'Power BI Service & Cloud Features',
    'Data Analysis Expressions (DAX) & Data Modeling',
    'Power BI Administration & Security',
    'Introduction to Python',
    'Core Python Concepts',
    'Essential Libraries for Al & Data Science',
    'Data Handling & Preprocessing',
    'Introduction to SQL',
    'Working with Multiple Tables',
    'Probability for Data Analysis',
    'Inferential Statistics for Decision Making',
    'Exploratory Data Analysis (EDA) for Better Insights',
    'Statistical Methods for Data Modeling',
    'Introduction to Machine Learning in Data Analytics',
    'Supervised Learning for Data Analytics',
    'Unsupervised Learning for Data Exploration & Insights',
    'Model Evaluation & Optimization in Analytics',
    'Feature Engineering for Improved Data Insights'
  ];

  const tools = [
    'Python (pandas, NumPy)',
    'SQL (MySQL / PostgreSQL)',
    'Power BI',
    'Tableau',
    'Excel (Advanced)',
    'Jupyter Notebooks',
    'scikit-learn',
    'Git & GitHub',
    'VS Code'
  ];

  return (
    <section style={{ 
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF5F2 50%, #FFFFFF 100%)', 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      padding: 0,
      margin: 0,
      width: '100%'
    }}>
      {/* Decorative Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '-5%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,138,84,0.1) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,176,136,0.15) 0%, transparent 70%)',
        filter: 'blur(80px)',
        pointerEvents: 'none'
      }}></div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem 1rem 0 1rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', marginLeft: '1rem' }}>
          <button
            onClick={() => { window.location.hash = '/'; window.scrollTo(0, 0); }}
            style={{ 
              padding: '0.75rem 1.8rem', 
              borderRadius: 50, 
              border: 'none',
              background: 'white',
              color: '#FF8A54',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.3s',
              boxShadow: '0 4px 20px rgba(255,138,84,0.1)'
            }}
            onMouseEnter={e => {
              e.target.style.background = 'linear-gradient(135deg, #FF8A54, #FFB088)';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateX(-5px)';
              e.target.style.boxShadow = '0 6px 25px rgba(255,138,84,0.3)';
            }}
            onMouseLeave={e => {
              e.target.style.background = 'white';
              e.target.style.color = '#FF8A54';
              e.target.style.transform = 'translateX(0)';
              e.target.style.boxShadow = '0 4px 20px rgba(255,138,84,0.1)';
            }}
          >
            Back to Home
          </button>
          
          <div
            onClick={() => window.open('/documents/data-analytics-curriculum.pdf', '_blank')}
            role="button"
            tabIndex={0}
            style={{
              display: 'inline-block',
              padding: '0.6rem 1.5rem',
              background: 'linear-gradient(135deg, #FFF5F2, #FFE8DD)',
              borderRadius: 50,
              border: '2px solid rgba(255,138,84,0.2)',
              boxShadow: '0 8px 30px rgba(255,138,84,0.15)',
              animation: 'float 3s ease-in-out infinite',
              cursor: 'pointer'
            }}
          >
            <span style={{
              fontWeight: '700',
              fontSize: '0.95rem',
              letterSpacing: '2px'
            }}>
              ✦ DATA ANALYTICS ✦
            </span>
          </div>
        </div>

        {/* Hero Section */}
        <div style={{ 
          textAlign: 'left',
          marginLeft: '1rem',
          marginBottom: '2rem'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
            margin: '0 0 1rem 0',
            background: 'linear-gradient(135deg, #FF8A54 0%, #FFB088 50%, #FF8A54 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '800',
            lineHeight: 1.1,
            letterSpacing: '-1px'
          }}>
            Turn Data Into Decisions
          </h1>
          <p style={{ 
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', 
            color: '#666',
            maxWidth: '750px',
            margin: 0,
            lineHeight: 1.7,
            fontWeight: '400'
          }}>
            Master the art and science of analytics with cutting-edge tools and real-world techniques that drive business growth
          </p>
        </div>

        {/* Main Content Section with Full Width Image */}
        <div style={{ 
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '2rem',
          marginLeft: 0,
          marginRight: 0,
          width: '100vw',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw'
        }}>
          {/* Full Width Image Background */}
          <div className="hero-image" style={{
            width: '100vw',
            height: '450px',
            position: 'relative',
            overflow: 'hidden',
            background: '#1a1a2e'
          }}>
            {/* Replace the src with your image URL */}
            <img 
              src ="data_analytics.webp"
              alt="Data Analytics" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                display: 'block',
                opacity: 1
              }}
            />

            {/* Floating Stats */}
            <div className="floating-stats" style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'white',
              padding: '0.75rem 1.2rem',
              borderRadius: 15,
              boxShadow: '0 10px 40px rgba(255,138,84,0.2)',
              animation: 'float 4s ease-in-out infinite',
              zIndex: 3
            }}>
              <div style={{ 
                fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
                fontWeight: '700', 
                color: '#FF8A54',
                lineHeight: 1.2
              }}>20+</div>
              <div style={{ 
                fontSize: 'clamp(0.7rem, 2vw, 0.85rem)', 
                color: '#666', 
                fontWeight: '600' 
              }}>Topics</div>
            </div>

            {/* Content directly on image */}
            <div className="hero-overlay" style={{
              position: 'absolute',
              bottom: '40px',
              left: '50px',
              right: '50px',
              zIndex: 2
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1.5rem',
                background: 'white',
                borderRadius: 50,
                marginBottom: '1.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
              }}>
                <span style={{ fontSize: '1.2rem' }}>🎯</span>
                <span style={{ 
                  color: '#FF8A54', 
                  fontWeight: '700', 
                  fontSize: '0.9rem',
                  letterSpacing: '1px'
                }}>
                  PROGRAM OVERVIEW
                </span>
              </div>

              <h2 style={{ 
                fontSize: 'clamp(2rem, 4vw, 3rem)', 
                margin: '0 0 1.2rem 0',
                color: 'white',
                fontWeight: '800',
                lineHeight: 1.2,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}>
                What You'll Master
              </h2>

              <p style={{ 
                fontSize: '1.1rem', 
                color: 'white', 
                marginBottom: '1.2rem',
                lineHeight: 1.8,
                textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                maxWidth: '800px'
              }}>
                Transform your career with our industry-focused Data Analytics program, designed to turn raw data into powerful business insights. Learn to analyze, visualize, and interpret data using tools like Excel, SQL, Power BI, and Tableau. Master the essentials of statistics, data cleaning, and reporting through real-world projects. Develop the analytical mindset needed to make data-driven decisions confidently. Step into the world of opportunities as a skilled Data Analyst ready for today’s data-driven industry.
              </p>

              <p style={{ 
                fontSize: '1.1rem', 
                color: 'white', 
                marginBottom: '2rem',
                lineHeight: 1.8,
                textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                maxWidth: '800px'
              }}>
                Work with industry-standard tools like Python, SQL, Tableau, and Power BI while building real-world projects that showcase your expertise to employers.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('skillkoder:openEnrollment', { detail: { course: 'Data Analytics' } }))}
                  style={{ 
                    background: 'linear-gradient(135deg, #FF8A54, #FFB088)', 
                    color: 'white', 
                    padding: '1.2rem 3rem', 
                    borderRadius: 50, 
                    border: 'none', 
                    cursor: 'pointer',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    boxShadow: '0 10px 30px rgba(255,138,84,0.4)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => {
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 15px 40px rgba(255,138,84,0.5)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 30px rgba(255,138,84,0.4)';
                  }}
                >
                  Start Your Journey 
                </button>
                
                <button
                  onClick={() => window.open('/documents/DATA ANALYTICS.pdf', '_blank')}
                  style={{ 
                    background: 'white', 
                    color: '#FF8A54', 
                    padding: '1.2rem 3rem', 
                    borderRadius: 50, 
                    border: '2px solid white', 
                    cursor: 'pointer',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => {
                    e.target.style.background = '#FFF5F2';
                    e.target.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
                  }}
                  onMouseLeave={e => {
                    e.target.style.background = 'white';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
                  }}
                >
                  View Curriculum
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Topics + Tools Side-by-side */}
        <div style={{ padding: '0' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Topics Column */}
            <div style={{ flex: '1 1 520px', minWidth: '280px' }}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1.5rem',
                  background: 'linear-gradient(135deg, #FFF5F2, #FFE8DD)',
                  borderRadius: 50,
                  marginBottom: '1rem',
                  border: '2px solid rgba(255,138,84,0.2)'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>📚</span>
                  <span style={{
                    color: '#FF8A54',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    letterSpacing: '1px'
                  }}>COMPREHENSIVE CURRICULUM</span>
                </div>
                <h2 style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  margin: '0 0 1rem 0',
                  color: '#1a1a1a',
                  fontWeight: '800'
                }}>Topics We Cover</h2>
                <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                  A complete toolkit for modern data analytics professionals
                </p>
              </div>

              <div style={{ maxWidth: '100%', margin: '0', position: 'relative' }}>
                <div style={{
                  background: 'white',
                  borderRadius: 20,
                  padding: '2rem',
                  boxShadow: '0 15px 40px rgba(255,138,84,0.15)',
                  border: '2px solid #FFE8DD',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  overflowX: 'hidden'
                }} className="topics-scroll-container">
                  <div>
                    {topics.map((topic, i) => (
                      <div key={i} onMouseEnter={() => setHoveredTopic(i)} onMouseLeave={() => setHoveredTopic(null)}
                        style={{
                          padding: '0.9rem 1.2rem',
                          background: hoveredTopic === i ? 'linear-gradient(135deg, #FF8A54, #FFB088)' : 'transparent',
                          borderBottom: i !== topics.length - 1 ? '1px solid #FFE8DD' : 'none',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          borderRadius: '12px'
                        }}>
                        <span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', fontWeight: '700', color: hoveredTopic === i ? 'white' : '#FF8A54', minWidth: '30px' }}>{String(i + 1).padStart(2, '0')}.</span>
                        <span style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', fontWeight: '600', color: hoveredTopic === i ? 'white' : '#1a1a1a' }}>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tools Column */}
            <div style={{ flex: '0 1 420px', minWidth: '260px' }}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1.5rem',
                  background: 'linear-gradient(135deg, #FFF5F2, #FFE8DD)',
                  borderRadius: 50,
                  marginBottom: '1rem',
                  border: '2px solid rgba(255,138,84,0.2)'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>🛠️</span>
                  <span style={{ color: '#FF8A54', fontWeight: '700', fontSize: '0.9rem', letterSpacing: '1px' }}>TOOLS WE USE</span>
                </div>
                <h3 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.5rem)', margin: '0 0 0.6rem 0', color: '#1a1a1a', fontWeight: '800' }}>Tools & Frameworks</h3>
                <p style={{ fontSize: '1rem', color: '#666', maxWidth: '600px', margin: '0 auto 1rem auto' }}>Key tools and libraries you'll use throughout this program</p>
              </div>

              <div style={{ maxWidth: '100%', margin: '0 auto', position: 'relative' }}>
                <div style={{
                  background: 'white',
                  borderRadius: 20,
                  padding: '1.5rem',
                  boxShadow: '0 15px 40px rgba(255,138,84,0.15)',
                  border: '2px solid #FFE8DD',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  overflowX: 'hidden'
                }} className="topics-scroll-container">
                  <div>
                    {tools.map((tool, i) => (
                      <div key={i} onMouseEnter={() => setHoveredTool(i)} onMouseLeave={() => setHoveredTool(null)}
                        style={{
                          padding: '0.7rem 1rem',
                          background: hoveredTool === i ? 'linear-gradient(135deg, #FF8A54, #FFB088)' : 'transparent',
                          borderBottom: i !== tools.length - 1 ? '1px solid #FFE8DD' : 'none',
                          transition: 'all 0.25s ease',
                          cursor: 'default',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          borderRadius: '10px'
                        }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: '700', color: hoveredTool === i ? 'white' : '#FF8A54', minWidth: '30px' }}>{String(i + 1).padStart(2, '0')}.</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: '600', color: hoveredTool === i ? 'white' : '#1a1a1a' }}>{tool}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features and Contact sections imported from main site */}
          <Features />
          <Contact />

          {/* Scroll Indicator */}
          <div style={{
            textAlign: 'center',
            marginTop: '2rem',
            fontSize: '0.9rem',
            color: '#999',
            fontStyle: 'italic'
          }}>
            ↓ Scroll to see more topics ↓
          </div>

          <style>{`
            .topics-scroll-container::-webkit-scrollbar {
              width: 8px;
            }
            .topics-scroll-container::-webkit-scrollbar-track {
              background: #FFF5F2;
              border-radius: 10px;
            }
            .topics-scroll-container::-webkit-scrollbar-thumb {
              background: linear-gradient(180deg, #FF8A54, #FFB088);
              border-radius: 10px;
            }
            .topics-scroll-container::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(180deg, #FFB088, #FF8A54);
            }
            /* Responsive adjustments for hero overlay and badges */
            @media (max-width: 640px) {
              .hero-image {
                width: 100% !important;
                left: 0 !important;
                right: 0 !important;
                margin-left: 0 !important;
                margin-right: 0 !important;
                height: 360px !important;
              }
              .hero-overlay {
                left: 16px !important;
                right: 16px !important;
                bottom: 18px !important;
              }
              .hero-overlay h2 { font-size: 1.5rem !important; }
              .hero-overlay p { font-size: 1rem !important; }
              .course-badge { margin-left: 12px !important; display: inline-block; }
              .floating-stats { right: 12px !important; top: 12px !important; }
            }
          `}</style>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes morph {
          0%, 100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
          50% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};

export default DataAnalytics;