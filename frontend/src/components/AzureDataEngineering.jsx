import React from 'react';
import { useNavigate } from 'react-router-dom';
import Features from './Features';
import Contact from './Contact';

const AzureDataEngineering = () => {
  const navigate = useNavigate();

  const topics = [
    'Azure Data Factory ETL Pipelines',
    'Databricks Spark Development',
    'Azure Synapse Analytics',
    'Azure Data Lake Storage',
    'Python for Data Engineering',
    'Structured Streaming & Batch Processing',
    'Data Warehousing Best Practices',
    'Data Modeling for Analytics',
    'Data Governance & Security',
    'Azure DevOps for Data Projects',
    'Performance Tuning and Cost Optimization',
    'Power BI Reporting for Data Engineers'
  ];

  const tools = [
    'Azure Data Factory',
    'Databricks',
    'Azure Synapse',
    'Azure Data Lake',
    'Python',
    'Apache Spark',
    'SQL',
    'Power BI',
    'Git & GitHub'
  ];

  return (
    <section style={{
      background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF8F4 55%, #FFFFFF 100%)',
      position: 'relative',
      overflow: 'hidden',
      minHeight: '100vh'
    }}>
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '-5%',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,138,84,0.12) 0%, transparent 70%)',
        filter: 'blur(90px)',
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '2rem 1rem 4rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <button
            onClick={() => { navigate('/'); window.scrollTo(0, 0); }}
            style={{
              padding: '0.85rem 1.75rem',
              borderRadius: 50,
              border: 'none',
              background: 'white',
              color: '#FF8A54',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(255,138,84,0.12)'
            }}
            onMouseEnter={e => {
              e.target.style.transform = 'translateX(-3px)';
              e.target.style.background = 'linear-gradient(135deg, #FF8A54, #FFB088)';
              e.target.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.target.style.transform = 'translateX(0)';
              e.target.style.background = 'white';
              e.target.style.color = '#FF8A54';
            }}
          >
            Back to Home
          </button>

          <button
            onClick={() => window.open('https://chat.whatsapp.com/GlHfkuwLD2Q0Rd8pBDVWoj?mode=wwt', '_blank')}
            style={{
              padding: '0.85rem 1.75rem',
              borderRadius: 50,
              border: '2px solid #FFB088',
              background: 'white',
              color: '#FF8A54',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(255,138,84,0.12)'
            }}
          >
            Talk to Career Expert
          </button>
        </div>

        <div className="azure-main-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2rem', alignItems: 'start' }}>
          <div>
            <div style={{ marginBottom: '1rem', display: 'inline-block', padding: '0.55rem 1rem', borderRadius: 999, background: '#FFF3EB', color: '#D14B1E', fontWeight: 700, fontSize: '0.85rem' }}>
              Azure Data Engineering Course Online
            </div>
            <h1 style={{ fontSize: 'clamp(2.8rem, 5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.05, marginBottom: '1.25rem', color: '#1f2937' }}>
              Launch your career as an Azure Data Engineer
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#4b5568', lineHeight: 1.8, marginBottom: '1.75rem' }}>
              Master Azure Data Factory, Databricks, Synapse, and modern data engineering workflows with a 14-week job-oriented program designed for working professionals and freshers.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
              {['14-week program', 'Hands-on projects', 'Placement-focused', 'Azure certified tools', 'Career mentoring'].map(item => (
                <span key={item} style={{
                  display: 'inline-flex',
                  background: '#FFF5F0',
                  color: '#D14B1E',
                  padding: '0.65rem 1rem',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}>
                  {item}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('skillkoder:openEnrollment', { detail: { course: 'Azure Data Engineering' } }))}
                style={{
                  background: 'linear-gradient(135deg, #FF8A54, #FFB088)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 999,
                  padding: '0.95rem 2.2rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 16px 40px rgba(255,138,84,0.22)'
                }}
              >
                Enroll Now
              </button>

              <button
                onClick={() => window.open('/documents/azure-data-engineering.pdf', '_blank')}
                style={{
                  background: 'white',
                  color: '#FF8A54',
                  border: '2px solid #FFE0D0',
                  borderRadius: 999,
                  padding: '0.95rem 2.2rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Download Brochure
              </button>
            </div>

            <div className="azure-info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1.4rem', borderRadius: '24px', background: '#fff', border: '1px solid #F5E2D8' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1f2937' }}>Job roles</h3>
                <p style={{ margin: '0.75rem 0 0', color: '#57534e', lineHeight: 1.7 }}>
                  Azure Data Engineer, Data Platform Engineer, ETL Developer, Analytics Engineer.
                </p>
              </div>
              <div style={{ padding: '1.4rem', borderRadius: '24px', background: '#fff', border: '1px solid #F5E2D8' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1f2937' }}>Tools covered</h3>
                <p style={{ margin: '0.75rem 0 0', color: '#57534e', lineHeight: 1.7 }}>
                  Azure Data Factory, Synapse, Databricks, Spark, Python, SQL, Power BI.
                </p>
              </div>
            </div>
          </div>

          <div style={{
            borderRadius: '30px',
            minHeight: '420px',
            background: 'linear-gradient(180deg, #FFF8F2 0%, #FFFFFF 100%)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <img
                src="/course1.png"
                alt="Azure Data Engineering course"
                style={{
                  width: '100%',
                  borderRadius: '24px',
                  objectFit: 'cover',
                  minHeight: '260px',
                  marginBottom: '1.75rem',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.12)'
                }}
              />
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 78,
                height: 78,
                borderRadius: '50%',
                background: 'rgba(255,138,84,0.14)',
                color: '#D14B1E',
                fontWeight: 800,
                fontSize: '1.5rem',
                marginBottom: '1.5rem',
              }}>AD</div>
              <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#1f2937', marginBottom: '1rem' }}>
                Why this program works
              </h2>
              <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Learn cloud-first data engineering with practical pipeline projects, Azure-native tooling, and role-specific career mentorship.
              </p>
              <ul style={{ listStyle: 'disc inside', color: '#475569', lineHeight: 1.9 }}>
                <li>End-to-end Azure pipeline development</li>
                <li>Production-grade ETL and streaming workflows</li>
                <li>Cloud architecture for analytics teams</li>
                <li>Resume, interview and placement support</li>
              </ul>
            </div>

            <button
              onClick={() => { navigate('/contact'); window.scrollTo(0, 0); }}
              style={{
                marginTop: '2rem',
                background: 'white',
                color: '#FF8A54',
                border: '2px solid #FFE0D0',
                borderRadius: 999,
                padding: '0.95rem 2.2rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Talk to our team
            </button>
          </div>
        </div>

        <div className="azure-details-grid" style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div style={{ padding: '2rem', background: '#fff', borderRadius: '28px', boxShadow: '0 20px 50px rgba(255,138,84,0.08)' }}>
            <h2 style={{ fontSize: '1.95rem', fontWeight: 800, color: '#1f2937', marginBottom: '1rem' }}>What you will learn</h2>
            <ul style={{ listStyle: 'disc inside', color: '#475569', lineHeight: 1.9, fontSize: '1rem' }}>
              {topics.map(topic => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </div>

          <div style={{ padding: '2rem', background: '#fff', borderRadius: '28px', boxShadow: '0 20px 50px rgba(255,138,84,0.08)' }}>
            <h2 style={{ fontSize: '1.95rem', fontWeight: 800, color: '#1f2937', marginBottom: '1rem' }}>Tools covered</h2>
            <div className="azure-tools-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
              {tools.map(tool => (
                <div key={tool} style={{ padding: '1rem 1.25rem', background: '#FFF4EB', borderRadius: '18px', fontWeight: 600, color: '#c2410c' }}>
                  {tool}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '3rem', padding: '2.5rem', borderRadius: '28px', background: '#fff5ef', border: '1px solid #ffe0d2' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: '#1f2937' }}>Career growth with Azure Data Engineering</h2>
          <p style={{ color: '#475569', lineHeight: 1.9, fontSize: '1rem', maxWidth: '860px' }}>
            Azure data engineers are in high demand across startups and enterprises. This course prepares you to own data pipelines, build analytics platforms, and support business intelligence teams using Microsoft Azure technologies.
          </p>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', color: '#1f2937' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '22px', boxShadow: '0 12px 32px rgba(0,0,0,0.06)' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1f2937' }}>Is Azure Data Engineering suitable for beginners?</h3>
              <p style={{ color: '#555', marginTop: '0.75rem', lineHeight: 1.8 }}>
                Yes, the course begins with data engineering fundamentals and includes guided learning paths. It is especially suited to learners with basic programming knowledge.
              </p>
            </div>
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '22px', boxShadow: '0 12px 32px rgba(0,0,0,0.06)' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1f2937' }}>Do you offer placement assistance?</h3>
              <p style={{ color: '#555', marginTop: '0.75rem', lineHeight: 1.8 }}>
                Yes, SkillKoder provides placement-focused mentorship, resume support, and interview preparation as part of the program.
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <Features />
        </div>

        <div style={{ marginTop: '3rem' }}>
          <Contact />
        </div>
      </div>
      <style>{`
        @media (max-width: 968px) {
          .azure-main-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .azure-details-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .azure-info-grid, .azure-tools-grid {
            grid-template-columns: 1fr !important;
          }
          h1 {
            font-size: 2.2rem !important;
          }
          .azure-main-grid button {
            width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AzureDataEngineering;
