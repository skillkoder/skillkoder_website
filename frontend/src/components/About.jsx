import React from 'react';
import { BRAND_TEXT, BRAND_TEXT_STRONG } from '../theme/colors';

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
          color: BRAND_TEXT_STRONG,
          marginBottom: '3rem',
          textAlign: 'center'
        }}>
          About Us
        </h2>

        <div style={{
          position: 'relative',
          minHeight: '520px',
          display: 'grid',
          gridTemplateColumns: '1.05fr 0.95fr',
          gap: '2rem',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            position: 'relative',
            zIndex: 2,
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '36px',
            padding: '2.5rem 2rem',
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.08)'
          }}>
            <p style={{
              fontSize: '1.15rem',
              lineHeight: '1.8',
              color: '#4a5568',
              marginBottom: '1.5rem',
              fontWeight: '300'
            }}>
              SkillKoder is a specialist academy for Data Analytics, Data Science, and Generative AI training. We focus on career-ready programs, real projects, tool mastery, and placement support for learners in India and beyond.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                padding: '1.5rem',
                borderRadius: '24px',
                background: '#fff6f0',
                border: '1px solid #ffe2d2'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: BRAND_TEXT,
                  marginBottom: '0.75rem'
                }}>
                  Tools You Will Learn
                </h3>
                <ul style={{
                  listStyle: 'disc inside',
                  color: '#4a5568',
                  lineHeight: '1.8',
                  margin: 0,
                  paddingLeft: '1rem'
                }}>
                  <li>Python</li>
                  <li>Excel</li>
                  <li>Power BI</li>
                  <li>Tableau</li>
                  <li>SQL</li>
                  <li>ChatGPT</li>
                </ul>
              </div>

              <div style={{
                padding: '1.5rem',
                borderRadius: '24px',
                background: '#fff6f0',
                border: '1px solid #ffe2d2'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: BRAND_TEXT,
                  marginBottom: '0.75rem'
                }}>
                  Career Opportunities
                </h3>
                <ul style={{
                  listStyle: 'disc inside',
                  color: '#4a5568',
                  lineHeight: '1.8',
                  margin: 0,
                  paddingLeft: '1rem'
                }}>
                  <li>Data Analyst</li>
                  <li>Data Scientist</li>
                  <li>AI Developer</li>
                  <li>Business Intelligence Analyst</li>
                  <li>Prompt Engineering Specialist</li>
                </ul>
              </div>
            </div>

            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              justifyContent: 'center'
            }}>
              {['Python', 'Power BI', 'SQL', 'Tableau', 'Excel', 'ChatGPT', 'Midjourney', 'Google Colab'].map((tag) => (
                <span key={tag} style={{
                  display: 'inline-block',
                  padding: '0.55rem 1rem',
                  borderRadius: '999px',
                  backgroundColor: '#FFE8DC',
                  color: BRAND_TEXT_STRONG,
                  fontWeight: '600',
                  fontSize: '0.9rem'
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div style={{
            position: 'relative',
            minHeight: '420px'
          }}>
            <div className="top-right-image" style={{
              position: 'absolute',
              top: '0',
              right: '-180px',
              width: '460px',
              height: '180px',
              borderRadius: '90px 0 0 90px',
              overflow: 'hidden',
              backgroundColor: '#e2e8f0',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
              zIndex: 1
            }}>
              <img
                src="/about2.jpg"
                alt="SkillKoder learners collaborating on a data analytics project"
                width="920"
                height="826"
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            <div className="bottom-left-image" style={{
              position: 'absolute',
              bottom: '0',
              left: '-180px',
              width: '460px',
              height: '180px',
              borderRadius: '0 90px 90px 0',
              overflow: 'hidden',
              backgroundColor: '#e2e8f0',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
              zIndex: 1
            }}>
              <img
                src="/about4.jpg"
                alt="Live instructor-led SkillKoder training session"
                width="920"
                height="792"
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 968px) {
          #about > div > div:nth-child(2) {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
            gap: 2.5rem !important;
          }
          /* Image container parent */
          #about > div > div:nth-child(2) > div:nth-child(2) {
            min-height: auto !important;
            display: flex !important;
            justify-content: center !important;
            gap: 1.25rem !important;
            margin-top: 1rem !important;
            padding: 0 !important;
          }
          /* Visual images inside container */
          .top-right-image,
          .bottom-left-image {
            position: relative !important;
            top: auto !important;
            right: auto !important;
            left: auto !important;
            bottom: auto !important;
            width: 47% !important;
            height: 150px !important;
            border-radius: 20px !important;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06) !important;
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
          .top-right-image,
          .bottom-left-image {
            height: 120px !important;
            border-radius: 16px !important;
          }
        }

        @media (max-width: 480px) {
          .top-right-image,
          .bottom-left-image {
            height: 100px !important;
            border-radius: 12px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default About;