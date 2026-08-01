import React, { useState } from 'react';

const Features = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // `color` is decorative only — fills, glows, borders. Each of these six
  // measures between 1.8:1 and 2.9:1 on white, so none of them may carry text.
  // `ink` is the accessible partner used for any text, all >= 5:1 on white.
  const features = [
    {
      title: "Placement Assistance",
      description: "Career support with resume guidance, interview prep, and placement-ready project portfolios.",
      color: "#FF8A54",
      ink: "#C2410C"
    },
    {
      title: "Tools Mastery",
      description: "Learn industry-standard tools like Python, Power BI, SQL, Tableau, Excel, and ChatGPT.",
      color: "#FFB088",
      ink: "#9A3412"
    },
    {
      title: "Real-World Projects",
      description: "Build authentic case studies and portfolio projects aligned with top hiring needs.",
      color: "#FF7A3D",
      ink: "#B45309"
    },
    {
      title: "Expert Mentorship",
      description: "Guidance from working professionals to help you learn fast and stay industry-ready.",
      color: "#FF6B6B",
      ink: "#B42318"
    },
    {
      title: "Career Growth",
      description: "Step into roles like Data Analyst, Data Scientist, AI Developer, and Business Intelligence Analyst.",
      color: "#FFA07A",
      ink: "#BE185D"
    },
    {
      title: "High-Confidence Learning",
      description: "A structured path from beginner to career-ready with measurable progress every week.",
      color: "#FF9966",
      ink: "#7C2D12"
    }
  ];

  return (
    <section id="features" style={{
      position: 'relative',
      padding: '3rem 1.5rem',
      background: 'linear-gradient(135deg, #FFF5F0 0%, #ffffff 100%)',
      overflow: 'hidden'
    }}>
      {/* Animated background circles */}
      <div style={{
        position: 'absolute',
        top: '18%',
        left: '-6%',
        width: '260px',
        height: '260px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${features[activeIndex].color}10 0%, transparent 70%)`,
        transition: 'all 1s ease',
        filter: 'blur(48px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '8%',
        right: '-3%',
        width: '220px',
        height: '220px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${features[activeIndex].color}08 0%, transparent 70%)`,
        transition: 'all 1s ease',
        filter: 'blur(48px)'
      }} />

      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h2 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: '800',
              color: '#2d3748',
              marginBottom: '0.5rem',
              letterSpacing: '-0.02em'
            }}>
              Why Choose <span style={{
                background: 'linear-gradient(135deg, #C2410C, #9A3412)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>SkillKoder</span>?
            </h2>
            <p style={{
              fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)',
              color: '#4a5568',
              marginTop: '0.75rem',
              maxWidth: '500px'
            }}>
              Experience the future of learning with our innovative platform
            </p>
            <div style={{
              width: '120px',
              height: '4px',
              background: `linear-gradient(90deg, ${features[activeIndex].color}, transparent)`,
              borderRadius: '2px',
              transition: 'all 0.5s ease',
              marginTop: '1rem'
            }} />
          </div>
        </div>

        {/* Main Content Area */}
        <div 
          className="features-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.25fr',
            gap: '1.5rem',
            alignItems: 'center'
          }}
        >
          {/* Left Side - Feature List */}
          <div 
            className="features-list"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="features-item"
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
                style={{
                  padding: '1rem 1.25rem',
                  cursor: 'pointer',
                  borderLeft: `4px solid ${activeIndex === index ? feature.color : 'transparent'}`,
                  background: activeIndex === index ? '#ffffff' : 'transparent',
                  transition: 'all 0.25s ease',
                  borderRadius: '0 10px 10px 0',
                  transform: activeIndex === index ? 'translateX(8px)' : 'translateX(0)'
                }}
              >
                <h3 style={{
                  fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
                  fontWeight: activeIndex === index ? '700' : '600',
                  color: activeIndex === index ? feature.ink : '#4a5568',
                  transition: 'all 0.3s ease',
                  marginBottom: '0.25rem'
                }}>
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>

          {/* Right Side - Active Feature Details */}
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '18px',
            boxShadow: `0 12px 36px ${features[activeIndex].color}10`,
            minHeight: '280px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s ease'
          }}>
            {/* Decorative shape */}
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${features[activeIndex].color}12, ${features[activeIndex].color}06)`,
              transition: 'all 0.4s ease'
            }} />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                background: `${features[activeIndex].color}12`,
                borderRadius: '24px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: features[activeIndex].ink,
                transition: 'all 0.4s ease'
              }}>
                Feature Highlight
              </div>

              <h3 style={{
                fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                fontWeight: '800',
                color: '#2d3748',
                marginBottom: '1rem',
                lineHeight: '1.2',
                transition: 'all 0.4s ease'
              }}>
                {features[activeIndex].title}
              </h3>

              <p style={{
                fontSize: 'clamp(0.95rem, 1.6vw, 1.05rem)',
                color: '#4a5568',
                lineHeight: '1.6',
                marginBottom: '1rem',
                transition: 'all 0.4s ease'
              }}>
                {features[activeIndex].description}
              </p>

              <div style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center'
              }}>
                <div style={{
                  width: '44px',
                  height: '4px',
                  background: features[activeIndex].color,
                  borderRadius: '2px',
                  transition: 'all 0.4s ease'
                }} />
                <span style={{
                  fontSize: '0.85rem',
                  color: '#718096',
                  fontWeight: '500'
                }}>
                  {activeIndex + 1} of {features.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Progress Indicators */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '1.5rem',
          justifyContent: 'center'
        }}>
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => setActiveIndex(index)}
              style={{
                width: activeIndex === index ? '28px' : '10px',
                height: '10px',
                borderRadius: '6px',
                background: activeIndex === index ? feature.color : '#E2E8F0',
                cursor: 'pointer',
                transition: 'all 0.25s ease'
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 968px) {
          .features-grid {
            grid-template-columns: 1fr !important;
            gap: 1.75rem !important;
          }
          .features-list {
            flex-direction: row !important;
            overflow-x: auto !important;
            white-space: nowrap !important;
            gap: 0.75rem !important;
            padding: 0.5rem 0.25rem !important;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }
          .features-list::-webkit-scrollbar {
            display: none;
          }
          .features-item {
            border-left: none !important;
            border-radius: 24px !important;
            padding: 0.65rem 1.25rem !important;
            display: inline-block !important;
            flex-shrink: 0 !important;
            transform: none !important;
            background: rgba(255, 255, 255, 0.6) !important;
            border: 1px solid rgba(255, 176, 136, 0.15) !important;
          }
          .features-item h3 {
            font-size: 0.95rem !important;
            margin: 0 !important;
          }
        }

        @media (max-width: 640px) {
          #features {
            padding: 2.5rem 1rem !important;
          }
          #features > div > div:first-child {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Features;