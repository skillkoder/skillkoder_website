import React from 'react';

const About = () => {
  return (
    <section id="about" style={{
      position: 'relative',
      padding: '2rem 0',
      /* subtle white + light-peach combination */
      background: 'radial-gradient(ellipse at center, #ffffff 0%, #fffaf6 45%, #fff2ea 85%)',
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        padding: '0 2rem'
      }}>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#FFB088',
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          About Us
        </h2>

        <div style={{
          position: 'relative',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="top-right-image" style={{
            position: 'absolute',
            top: '0',
            right: '-200px',
            width: '500px',
            height: '160px',
            borderRadius: '90px 0 0 90px',
            overflow: 'hidden',
            backgroundColor: '#e2e8f0',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
            zIndex: 1
          }}>
            <img 
              src="about2.png" 
              alt="Team collaboration"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          <div style={{
            position: 'relative',
            maxWidth: '650px',
            margin: '0 auto',
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

          <div className="bottom-left-image" style={{
            position: 'absolute',
            bottom: '0',
            left: '-200px',
            width: '500px',
            height: '160px',
            borderRadius: '0 90px 90px 0',
            overflow: 'hidden',
            backgroundColor: '#e2e8f0',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
            zIndex: 1
          }}>
            <img 
              src="about4.png" 
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
          #about > div > div:nth-child(2) {
            min-height: 360px !important;
          }
          .top-right-image,
          .bottom-left-image {
            width: 280px !important;
            height: 140px !important;
          }
          .top-right-image {
            right: -120px !important;
          }
          .bottom-left-image {
            left: -120px !important;
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
            min-height: 460px !important;
          }
          .top-right-image,
          .bottom-left-image {
            /* increase image size on small screens so visuals are more prominent */
            width: 220px !important;
            height: 120px !important;
            border-radius: 50px 0 0 50px !important;
          }
          .top-right-image {
            right: -90px !important;
          }
          .bottom-left-image {
            left: -90px !important;
            border-radius: 0 50px 50px 0 !important;
          }
          #about > div > div:nth-child(2) > div:nth-child(2) {
            padding: 1.5rem 1rem !important;
          }
          #about > div > div:nth-child(2) > div:nth-child(2) p {
            font-size: 0.95rem !important;
          }
        }

        @media (max-width: 480px) {
          /* slightly larger images for very small screens */
          .top-right-image,
          .bottom-left-image {
            width: 180px !important;
            height: 100px !important;
            border-radius: 40px 0 0 40px !important;
          }
          .top-right-image {
            right: -40px !important;
          }
          .bottom-left-image {
            left: -40px !important;
            border-radius: 0 40px 40px 0 !important;
          }
        }
      `}</style>
    </section>
  );
};

export default About;