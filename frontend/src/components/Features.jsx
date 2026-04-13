import React, { useState } from 'react';

const Features = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const features = [
    {
      title: "Personalized Learning",
      description: "Adaptive learning paths tailored to your skill level and goals.",
      color: "#FF8A54"
    },
    {
      title: "AI-Powered Support",
      description: "24/7 intelligent assistance to help you learn and solve problems.",
      color: "#FFB088"
    },
    {
      title: "Real-World Projects",
      description: "Hands-on experience with industry-relevant projects and case studies.",
      color: "#FF7A3D"
    },
    {
      title: "Expert Mentorship",
      description: "Learn from industry professionals with years of experience.",
      color: "#FF6B6B"
    },
    {
      title: "Progress Tracking",
      description: "Detailed analytics and insights to monitor your learning journey.",
      color: "#FFA07A"
    },
    {
      title: "Certifications",
      description: "Earn recognized certificates upon completing courses and projects.",
      color: "#FF9966"
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
                background: 'linear-gradient(135deg, #FF8A54, #FFB088)',
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.25fr',
          gap: '1.5rem',
          alignItems: 'center'
        }}>
          {/* Left Side - Feature List */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
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
                  color: activeIndex === index ? feature.color : '#4a5568',
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
                color: features[activeIndex].color,
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
          /* Keep the list and details side-by-side on narrower screens.
             Use horizontal scrolling if viewport is too narrow so the
             right-side card remains to the right instead of stacking below. */
          #features > div > div:nth-child(2) {
            grid-auto-flow: column !important;
            grid-auto-columns: minmax(260px, 1fr) !important;
            gap: 1rem !important;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            scroll-snap-type: x mandatory;
            padding-bottom: 0.5rem; /* allow space for scrolling */
          }

          /* Make each child snap into view when scrolling */
          #features > div > div:nth-child(2) > div {
            scroll-snap-align: start;
          }

          #features > div > div:nth-child(2) > div:last-child {
            min-height: 240px !important;
          }
        }

        @media (max-width: 640px) {
          #features {
            padding: 2rem 1rem !important;
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