import React, { useState } from 'react';
import Features from './Features';
import Contact from './Contact';

const GenerativeAI = () => {
  const [hoveredTopic, setHoveredTopic] = useState(null);
  const [hoveredTool, setHoveredTool] = useState(null);

  const topics = [
    'Introduction to Statistics for Al & Data Science',
    'Descriptive Statistics',
    'Probability Basics',
    'Inferential Statistics',
    'Exploratory Data Analysis (EDA)',
    'Statistical Foundations for Machine Learning',
    'Introduction to Machine Learning',
    'Supervised Learning',
    'Unsupervised Learning',
    'Model Evaluation & Optimization',
    'Feature Engineering',
    'Neural Networks Basics',
    'Artificial Neural Networks (ANNs):',
    'Convolutional Neural Networks (CNNs)',
    'Natural Language Processing (NLP)',
    'Recurrent Neural Networks (RNNs)',
    'Introduction to Generative Al',
    'Prompt Engineering',
    'Transformer Architecture, LLMs & Other Generative Models',
    'Tools and Frameworks',
    'Introduction to AI Agents',
    'AI Agent Frameworks',
    'Building AI Agents'
  ];

  const tools = [
    'Python (pandas, NumPy)',
    'PyTorch',
    'Hugging Face Transformers',
    'TensorFlow',
    'Jupyter Notebooks',
    'Docker',
    'Weights & Biases (W&B)',
    'OpenAI / API clients',
    'LangChain',
    'Git & GitHub'
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
            <style>{`
            @media (max-width: 640px) {
              .hero-image { width: 100% !important; left: 0 !important; right: 0 !important; margin-left: 0 !important; margin-right: 0 !important; height: 360px !important; }
              .hero-overlay { left: 16px !important; right: 16px !important; bottom: 18px !important; }
              .hero-overlay h2 { font-size: 1.5rem !important; }
              .hero-overlay p { font-size: 1rem !important; }
              .floating-stats { right: 12px !important; top: 12px !important; }
            }
            `}</style>
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
          
          <div style={{
            display: 'inline-block',
            padding: '0.6rem 1.5rem',
            background: 'linear-gradient(135deg, #FFF5F2, #FFE8DD)',
            borderRadius: 50,
            border: '2px solid rgba(255,138,84,0.2)',
            boxShadow: '0 8px 30px rgba(255,138,84,0.15)',
            animation: 'float 3s ease-in-out infinite'
          }}>
            <span style={{ 
              color: '#FF8A54', 
              fontWeight: '700', 
              fontSize: '0.95rem', 
              letterSpacing: '2px'
            }}>
              ✦ GENERATIVE AI ✦
            </span>
          </div>
        </div>

        {/* (removed tools here — moved to combined Topics+Tools section below) */}
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
            Create with AI Power
          </h1>
          <p style={{ 
            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', 
            color: '#666',
            maxWidth: '750px',
            margin: 0,
            lineHeight: 1.7,
            fontWeight: '400'
          }}>
            Master the latest AI technologies and learn to build powerful generative systems that transform industries
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
          <div style={{
            width: '100vw',
            height: '450px',
            position: 'relative',
            overflow: 'hidden',
            background: '#1a1a2e'
          }}>
            {/* Replace the src with your image URL */}
            <img 
              src="genai.webp"
              alt="Generative AI" 
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
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Topics</div>
            </div>

            {/* Content directly on image (overlay) */}
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
                Build Production-Ready AI
              </h2>

              <p style={{ 
                fontSize: '1.1rem', 
                color: 'white', 
                marginBottom: '1.2rem',
                lineHeight: 1.8,
                textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                maxWidth: '800px'
              }}>
                Transform your future with our cutting-edge Generative AI program, crafted to help you master the power of intelligent creation. Learn how to build AI models that generate text, images, code, and more using tools like Python, TensorFlow, and OpenAI APIs. Explore deep learning, NLP, and diffusion models through real-world, hands-on projects. Gain the expertise to innovate with AI across industries and solve complex challenges creatively. Step confidently into the world of Generative AI and advanced machine intelligence.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('skillkoder:openEnrollment', { detail: { course: 'Generative AI' } }))}
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
                  Start Building →
                </button>
                
                <button
                  onClick={() => window.open('/documents/GenAi.pdf', '_blank')}
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
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.5rem', background: 'linear-gradient(135deg, #FFF5F2, #FFE8DD)', borderRadius: 50, marginBottom: '1rem', border: '2px solid rgba(255,138,84,0.2)' }}>
                  <span style={{ fontSize: '1.2rem' }}>📚</span>
                  <span style={{ color: '#FF8A54', fontWeight: '700', fontSize: '0.9rem', letterSpacing: '1px' }}>COMPREHENSIVE CURRICULUM</span>
                </div>
                <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '0 0 1rem 0', color: '#1a1a1a', fontWeight: '800' }}>Topics We Cover</h2>
                <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>A complete toolkit for modern generative AI development</p>
              </div>

              <div style={{ maxWidth: '100%', margin: '0', position: 'relative' }}>
                <div style={{ background: 'white', borderRadius: 20, padding: '2rem', boxShadow: '0 15px 40px rgba(255,138,84,0.15)', border: '2px solid #FFE8DD', maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden' }} className="topics-scroll-container">
                  <div>
                    {topics.map((topic, i) => (
                      <div key={i} onMouseEnter={() => setHoveredTopic(i)} onMouseLeave={() => setHoveredTopic(null)} style={{ padding: '0.9rem 1.2rem', background: hoveredTopic === i ? 'linear-gradient(135deg, #FF8A54, #FFB088)' : 'transparent', borderBottom: i !== topics.length - 1 ? '1px solid #FFE8DD' : 'none', transition: 'all 0.3s ease', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem', borderRadius: '12px' }}>
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
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1.5rem', background: 'linear-gradient(135deg, #FFF5F2, #FFE8DD)', borderRadius: 50, marginBottom: '1rem', border: '2px solid rgba(255,138,84,0.2)' }}>
                  <span style={{ fontSize: '1.2rem' }}>🛠️</span>
                  <span style={{ color: '#FF8A54', fontWeight: '700', fontSize: '0.9rem', letterSpacing: '1px' }}>TOOLS WE USE</span>
                </div>
                <h3 style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.5rem)', margin: '0 0 0.6rem 0', color: '#1a1a1a', fontWeight: '800' }}>Tools & Frameworks</h3>
                <p style={{ fontSize: '1rem', color: '#666', maxWidth: '600px', margin: '0 auto 1rem auto' }}>Tools and libraries commonly used in generative AI workflows</p>
              </div>

              <div style={{ maxWidth: '100%', margin: '0 auto', position: 'relative' }}>
                <div style={{ background: 'white', borderRadius: 20, padding: '1.5rem', boxShadow: '0 15px 40px rgba(255,138,84,0.15)', border: '2px solid #FFE8DD', maxHeight: '400px', overflowY: 'auto', overflowX: 'hidden' }} className="topics-scroll-container">
                  <div>
                    {tools.map((tool, i) => (
                      <div key={i} onMouseEnter={() => setHoveredTool(i)} onMouseLeave={() => setHoveredTool(null)} style={{ padding: '0.7rem 1rem', background: hoveredTool === i ? 'linear-gradient(135deg, #FF8A54, #FFB088)' : 'transparent', borderBottom: i !== tools.length - 1 ? '1px solid #FFE8DD' : 'none', transition: 'all 0.25s ease', cursor: 'default', display: 'flex', alignItems: 'center', gap: '1rem', borderRadius: '10px' }}>
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
          `}</style>
        </div>
      </div>
    </section>
  );
};

export default GenerativeAI;
