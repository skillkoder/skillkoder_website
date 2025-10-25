import React from 'react';

const About = () => {
  return (
    <section id="about" style={{
      position: 'relative',
      /* reduced vertical padding to make the section shorter */
      padding: '2rem 0',
      background: 'radial-gradient(ellipse at center, #FFF5F0 0%, #FFEDE5 30%, #FFE8DC 60%, #ffffff 100%)',
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        padding: '0 2rem'
      }}>
        {/* Title */}
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#FFB088',
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          About Us
        </h2>

        {/* Main Content Container */}
        <div style={{
          position: 'relative',
          /* increase height to accommodate larger images */
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Top Right Image - D Shape */}
          <div style={{
            position: 'absolute',
            /* anchor the image to the top-right edge touching the container edge */
            top: '0',
            right: '0',
            width: '380px',
            height: '180px',
            borderRadius: '90px 0 0 90px',
            overflow: 'hidden',
            backgroundColor: '#e2e8f0',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
            zIndex: 1
          }}>
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=300&fit=crop" 
              alt="Team collaboration"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          {/* Center Content */}
          <div style={{
            position: 'relative',
            maxWidth: '650px',
            margin: '0 auto',
            /* adjust padding to balance with larger images */
            padding: '2rem 3rem',
            textAlign: 'center',
            zIndex: 2
          }}>
            <p style={{
              fontSize: '1.15rem',
              lineHeight: '1.8',
              color: '#4a5568',
              marginBottom: '1.5rem',
              fontWeight: '300'
            }}>
              At <span style={{ fontWeight: '700', color: '#FF8A54' }}>Skillkoder</span>, we empower learners to master the most in-demand skills of the digital era.
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
              marginBottom: '1.5rem'
            }}>
              <span style={{
                display: 'inline-block',
                padding: '0.4rem 1rem',
                backgroundColor: '#FFE8DC',
                borderRadius: '20px',
                color: '#FF7A3D',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>Data Analytics</span>
              <span style={{
                display: 'inline-block',
                padding: '0.4rem 1rem',
                backgroundColor: '#FFE8DC',
                borderRadius: '20px',
                color: '#FF7A3D',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>Data Science</span>
              <span style={{
                display: 'inline-block',
                padding: '0.4rem 1rem',
                backgroundColor: '#FFE8DC',
                borderRadius: '20px',
                color: '#FF7A3D',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>Generative AI</span>
            </div>

            <p style={{
              fontSize: '1.05rem',
              lineHeight: '1.8',
              color: '#4a5568',
              fontWeight: '300'
            }}>
              Our virtual training programs are designed for students and job seekers who aspire to build careers at the intersection of data, technology, and innovation.
            </p>
          </div>

          {/* Bottom Left Image - D Shape (Flipped) */}
          <div style={{
            position: 'absolute',
            /* anchor the image to the bottom-left edge touching the container edge */
            bottom: '0',
            left: '0',
            width: '380px',
            height: '180px',
            borderRadius: '0 90px 90px 0',
            overflow: 'hidden',
            backgroundColor: '#e2e8f0',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
            zIndex: 1
          }}>
            <img 
              src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=300&fit=crop" 
              alt="Learning environment"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 968px) {
          /* slightly taller on tablet but images shrink so they don't intrude */
          #about > div > div:nth-child(2) {
            min-height: 360px !important;
          }
          #about > div > div:nth-child(2) > div:first-child,
          #about > div > div:nth-child(2) > div:last-child {
            width: 280px !important;
            height: 140px !important;
          }
          #about > div > div:nth-child(2) > div:nth-child(2) {
            padding: 2rem 1.5rem !important;
          }
        }

        @media (max-width: 640px) {
          #about {
            padding: 2rem 1rem !important;
          }
          #about h2 {
            font-size: 1.75rem !important;
            margin-bottom: 1.25rem !important;
          }
          #about > div > div:nth-child(2) {
            min-height: 420px !important;
          }
          #about > div > div:nth-child(2) > div:first-child,
          #about > div > div:nth-child(2) > div:last-child {
            width: 180px !important;
            height: 100px !important;
            border-radius: 50px 0 0 50px !important;
          }
          #about > div > div:nth-child(2) > div:last-child {
            border-radius: 0 50px 50px 0 !important;
          }
          #about > div > div:nth-child(2) > div:nth-child(2) {
            padding: 1.5rem 1rem !important;
          }
          #about > div > div:nth-child(2) > div:nth-child(2) p {
            font-size: 0.95rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default About;