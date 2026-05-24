import React, { useState } from 'react';

// Define the custom peach colors
const PEACH_MAIN = '#FFB088';
const PEACH_LIGHT_BG = '#FFF0F0';

const Hero = () => {
  const [activeStep, setActiveStep] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section style={{
      minHeight: 'auto',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      backgroundColor: PEACH_LIGHT_BG,
      color: '#1f2937',
      paddingTop: isMobile ? '2rem' : '3rem',
      paddingBottom: isMobile ? '2rem' : '3rem'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          width: '20rem',
          height: '20rem',
          borderRadius: '9999px',
          mixBlendMode: 'multiply',
          filter: 'blur(60px)',
          opacity: 0.35,
          animation: 'blob 8s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95)',
          backgroundColor: PEACH_MAIN,
          top: '4rem',
          left: '2rem'
        }}></div>
        <div style={{
          position: 'absolute',
          width: '20rem',
          height: '20rem',
          borderRadius: '9999px',
          mixBlendMode: 'multiply',
          filter: 'blur(60px)',
          opacity: 0.35,
          animation: 'blob 8s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95)',
          backgroundColor: PEACH_MAIN,
          top: '8rem',
          right: '2rem',
          animationDelay: '2s'
        }}></div>
        <div style={{
          position: 'absolute',
          width: '20rem',
          height: '20rem',
          borderRadius: '9999px',
          mixBlendMode: 'multiply',
          filter: 'blur(60px)',
          opacity: 0.35,
          animation: 'blob 8s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95)',
          backgroundColor: PEACH_MAIN,
          bottom: '-3rem',
          left: '5rem',
          animationDelay: '4s'
        }}></div>
      </div>

      {/* Grid overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'linear-gradient(rgba(255, 176, 136, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 176, 136, 0.06) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
      }}></div>

      <div style={{
        position: 'relative',
        maxWidth: '1280px',
        marginLeft: 'auto',
        marginRight: 'auto',
        paddingLeft: isMobile ? '1rem' : '1.5rem',
        paddingRight: isMobile ? '1rem' : '1.5rem'
      }}>
        {/* Header badge */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1.5rem',
          animation: 'fadeIn 1.2s ease-out'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.625rem 1.25rem',
            background: 'linear-gradient(135deg, white, rgba(255, 240, 240, 0.8))',
            border: `2px solid ${PEACH_MAIN}30`,
            borderRadius: '9999px',
            boxShadow: '0 8px 20px rgba(255, 176, 136, 0.25)',
            backdropFilter: 'blur(10px)'
          }}>
            <span style={{
              width: '0.5rem',
              height: '0.5rem',
              borderRadius: '9999px',
              backgroundColor: PEACH_MAIN,
              boxShadow: `0 0 10px ${PEACH_MAIN}80`,
              animation: 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}></span>
            <span style={{
              color: '#1f2937',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em'
            }}>AI-POWERED LEARNING PLATFORM</span>
          </div>
        </div>

        {/* Main hero content */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2.5rem',
          marginTop: '1rem',
          paddingTop: '0.5rem',
          animation: 'slideUp 1s ease-out 0.3s both'
        }}>
          <h1 style={{
            fontWeight: 900,
            lineHeight: 1.05,
            backgroundImage: `linear-gradient(135deg, ${PEACH_MAIN}, #E55B5B)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            marginBottom: '0.75rem',
            fontSize: isMobile ? '2.5rem' : isTablet ? '3.25rem' : '4.25rem',
            letterSpacing: '-0.04em',
            filter: `drop-shadow(0 5px 18px ${PEACH_MAIN}30)`,
            maxWidth: '12ch',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            SkillKoder
          </h1>
          
          <h2 style={{
            fontSize: isMobile ? '1.35rem' : isTablet ? '1.75rem' : '2.25rem',
            fontWeight: 700,
            maxWidth: '56rem',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.3,
            marginBottom: '1rem',
            color: '#2f365d'
          }}>
            Premium Data, AI & Analytics training for career-ready professionals
          </h2>
          <p style={{
            fontSize: isMobile ? '1rem' : '1.05rem',
            color: '#4b5568',
            maxWidth: '52rem',
            margin: '0 auto 1.75rem',
            lineHeight: 1.85
          }}>
            Transform your skills with live mentorship, hands-on projects, and placement-ready support across Data Analytics, Data Science, Generative AI, and Azure Data Engineering.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta-container" style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '0.75rem',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: '1rem'
          }}>
            <button style={{
              position: 'relative',
              padding: '0.875rem 1.75rem',
              fontWeight: 700,
              borderRadius: '0.875rem',
              fontSize: '1rem',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              cursor: 'pointer',
              border: 'none',
              backgroundColor: PEACH_MAIN,
              color: 'white',
              overflow: 'hidden',
              boxShadow: `0 15px 35px -5px ${PEACH_MAIN}60`
            }}
            onClick={() => window.dispatchEvent(new CustomEvent('skillkoder:openRegistration'))}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
              e.currentTarget.querySelector('.btn-hover-overlay').style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.querySelector('.btn-hover-overlay').style.opacity = '0';
            }}>
              <span style={{ position: 'relative', zIndex: 10 }}>Book Free Demo</span>
              <div className="btn-hover-overlay" style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '0.875rem',
                opacity: 0,
                transition: 'opacity 0.4s ease',
                backgroundImage: `linear-gradient(135deg, #E55B5B, ${PEACH_MAIN})`
              }}></div>
            </button>
            
            <button style={{
              position: 'relative',
              padding: '0.875rem 1.75rem',
              fontWeight: 700,
              borderRadius: '0.875rem',
              fontSize: '1rem',
              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              cursor: 'pointer',
              backgroundColor: 'white',
              border: `2.5px solid ${PEACH_MAIN}`,
              color: PEACH_MAIN,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
            }}
            onClick={() => window.open('https://chat.whatsapp.com/GlHfkuwLD2Q0Rd8pBDVWoj?mode=wwt', '_blank')}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
              e.currentTarget.style.backgroundColor = `${PEACH_MAIN}08`;
              e.currentTarget.style.boxShadow = `0 8px 20px ${PEACH_MAIN}30`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
            }}>
              <span>Talk to Career Expert</span>
            </button>
          </div>

          <div className="hero-features-list" style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            {['Live instructor-led classes', 'Project-based portfolio', 'Career guidance & placement support'].map((item, idx) => (
              <div key={idx} style={{
                padding: '0.75rem 1rem',
                borderRadius: '999px',
                backgroundColor: 'rgba(255, 176, 136, 0.15)',
                color: '#4b5568',
                fontWeight: 600,
                fontSize: '0.95rem',
                textAlign: 'center',
                minWidth: '180px'
              }}>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Journey Flow Section */}
        <div style={{
          marginTop: '3rem',
          padding: '2rem 0'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '2.5rem',
            animation: 'fadeInUp 1s ease-out'
          }}>
            <p className="journey-title" style={{
              fontSize: isMobile ? '1.5rem' : isTablet ? '1.75rem' : '2rem',
              fontWeight: 800,
              letterSpacing: '-0.01em',
              textShadow: '0 4px 20px rgba(255, 176, 136, 0.3)',
              color: PEACH_MAIN
            }}>
              Your Learning Journey
            </p>
          </div>

          <div className="journey-flow-container" style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '2rem',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}>
            {/* Step 1: Learn - Left */}
            <div style={{
              flex: window.innerWidth >= 768 ? '1' : '1',
              animation: 'flowSlideIn 0.8s ease-out 0.2s backwards'
            }}
            onMouseEnter={() => setActiveStep(1)}
            onMouseLeave={() => setActiveStep(null)}>
              <div style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  position: 'relative',
                  zIndex: 2,
                  backgroundColor: PEACH_MAIN,
                  boxShadow: `0 0 0 8px ${PEACH_MAIN}20`,
                  transform: activeStep === 1 ? 'scale(1.2) rotate(360deg)' : 'scale(1) rotate(0deg)'
                }}>
                  <svg viewBox="0 0 24 24" fill="white" style={{ width: '28px', height: '28px' }}>
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
              </div>
              
              <div style={{
                transition: 'all 0.4s ease',
                transform: activeStep === 1 ? 'translateY(-5px)' : 'translateY(0)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '0.75rem',
                  justifyContent: 'center'
                }}>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    opacity: 0.4,
                    letterSpacing: '0.05em',
                    color: PEACH_MAIN
                  }}>01</span>
                  <h3 style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    margin: 0,
                    transition: 'all 0.3s ease',
                    color: PEACH_MAIN
                  }}>Learn</h3>
                </div>
                <p style={{
                  color: '#4b5563',
                  lineHeight: 1.7,
                  marginBottom: '1.25rem',
                  fontSize: '0.9375rem',
                  textAlign: 'center'
                }}>
                  Master cutting-edge AI technologies and data science fundamentals through hands-on projects
                </p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  {['Interactive Courses', 'Real Projects', 'Expert Guidance'].map((feature, i) => (
                    <div key={i} style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease',
                      backgroundColor: `${PEACH_MAIN}20`,
                      borderLeft: `3px solid ${PEACH_MAIN}`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(8px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: PEACH_MAIN }}>→</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Evolve - Center */}
            <div style={{
              flex: window.innerWidth >= 768 ? '1' : '1',
              animation: 'flowSlideIn 0.8s ease-out 0.4s backwards'
            }}
            onMouseEnter={() => setActiveStep(2)}
            onMouseLeave={() => setActiveStep(null)}>
              <div style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  position: 'relative',
                  zIndex: 2,
                  backgroundColor: '#E55B5B',
                  boxShadow: '0 0 0 8px #E55B5B20',
                  transform: activeStep === 2 ? 'scale(1.2) rotate(360deg)' : 'scale(1) rotate(0deg)'
                }}>
                  <svg viewBox="0 0 24 24" fill="white" style={{ width: '28px', height: '28px' }}>
                    <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
              </div>
              
              <div style={{
                transition: 'all 0.4s ease',
                transform: activeStep === 2 ? 'translateY(-5px)' : 'translateY(0)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '0.75rem',
                  justifyContent: 'center'
                }}>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    opacity: 0.4,
                    letterSpacing: '0.05em',
                    color: '#E55B5B'
                  }}>02</span>
                  <h3 style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    margin: 0,
                    transition: 'all 0.3s ease',
                    color: '#E55B5B'
                  }}>Evolve</h3>
                </div>
                <p style={{
                  color: '#4b5563',
                  lineHeight: 1.7,
                  marginBottom: '1.25rem',
                  fontSize: '0.9375rem',
                  textAlign: 'center'
                }}>
                  Transform your skills with advanced techniques, mentorship, and continuous learning support
                </p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  {['1:1 Mentorship', 'Code Reviews', 'Career Coaching'].map((feature, i) => (
                    <div key={i} style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease',
                      backgroundColor: '#E55B5B20',
                      borderLeft: '3px solid #E55B5B'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(8px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#E55B5B' }}>→</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Excel - Right */}
            <div style={{
              flex: window.innerWidth >= 768 ? '1' : '1',
              animation: 'flowSlideIn 0.8s ease-out 0.6s backwards'
            }}
            onMouseEnter={() => setActiveStep(3)}
            onMouseLeave={() => setActiveStep(null)}>
              <div style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  position: 'relative',
                  zIndex: 2,
                  backgroundColor: '#FF6B9D',
                  boxShadow: '0 0 0 8px #FF6B9D20',
                  transform: activeStep === 3 ? 'scale(1.2) rotate(360deg)' : 'scale(1) rotate(0deg)'
                }}>
                  <svg viewBox="0 0 24 24" fill="white" style={{ width: '28px', height: '28px' }}>
                    <path d="M5 3l14 9-14 9V3z"/>
                  </svg>
                </div>
              </div>
              
              <div style={{
                transition: 'all 0.4s ease',
                transform: activeStep === 3 ? 'translateY(-5px)' : 'translateY(0)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '0.75rem',
                  justifyContent: 'center'
                }}>
                  <span style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    opacity: 0.4,
                    letterSpacing: '0.05em',
                    color: '#FF6B9D'
                  }}>03</span>
                  <h3 style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    margin: 0,
                    transition: 'all 0.3s ease',
                    color: '#FF6B9D'
                  }}>Excel</h3>
                </div>
                <p style={{
                  color: '#4b5563',
                  lineHeight: 1.7,
                  marginBottom: '1.25rem',
                  fontSize: '0.9375rem',
                  textAlign: 'center'
                }}>
                  Launch your dream career with portfolio projects, interview prep, and job placement assistance
                </p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  {['Portfolio Building', 'Interview Prep', 'Job Placement'].map((feature, i) => (
                    <div key={i} style={{
                      padding: '0.75rem 1rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease',
                      backgroundColor: '#FF6B9D20',
                      borderLeft: '3px solid #FF6B9D'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(8px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FF6B9D' }}>→</span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-cta-container {
            flex-direction: column !important;
            width: 100%;
            gap: 1rem !important;
          }
          .hero-cta-container button {
            width: 100% !important;
          }
          .hero-features-list {
            flex-direction: column !important;
            gap: 0.5rem !important;
          }
          .hero-features-list > div {
            width: 100% !important;
          }
          .journey-flow-container {
            flex-direction: column !important;
            align-items: center !important;
            gap: 3rem !important;
          }
          .journey-title {
            font-size: 1.75rem !important;
          }
        }

        @keyframes blob {
          0%, 100% { 
            transform: translate(0px, 0px) scale(1) rotate(0deg); 
          }
          33% { 
            transform: translate(40px, -60px) scale(1.15) rotate(120deg); 
          }
          66% { 
            transform: translate(-30px, 30px) scale(0.9) rotate(240deg); 
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1);
          }
          50% { 
            opacity: 0.5; 
            transform: scale(1.1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes flowSlideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes lineGrow {
          from {
            height: 0;
            opacity: 0;
          }
          to {
            height: 120px;
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;