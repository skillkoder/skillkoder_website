import React from 'react';

const Courses = () => {
  const courses = [
    { 
      title: 'Data Analytics', 
      desc: 'Transform raw data into actionable insights with powerful analytics tools and visualization techniques',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
      stats: { duration: '12 Weeks', level: 'Beginner to Advanced' }
    },
    { 
      title: 'Data Science', 
      desc: 'Master machine learning, statistical modeling, and predictive analytics to solve complex problems',
      image: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=800&h=400&fit=crop',
      stats: { duration: '16 Weeks', level: 'Intermediate' }
    },
    { 
      title: 'Generative AI', 
      desc: 'Explore cutting-edge AI, prompt engineering, and build intelligent applications with large language models',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
      stats: { duration: '10 Weeks', level: 'Advanced' }
    },
  ];

  return (
    <section id="courses" style={{
      padding: '5rem 2rem',
      background: '#ffffff',
      position: 'relative'
    }}>
      {/* Decorative Background Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(255, 228, 196, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }}></div>

      <div style={{
        maxWidth: '1300px',
        margin: '0 auto'
      }}>
        {/* Title Section */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '4rem',
          position: 'relative'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '0.5rem 1.5rem',
            background: '#FFF5F0',
            borderRadius: '25px',
            marginBottom: '1rem',
            border: '1px solid #FFE8DC'
          }}>
            <span style={{
              color: '#FF8A54',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>EXPLORE OUR PROGRAMS</span>
          </div>
          <h2 style={{
            fontSize: '3rem',
            fontWeight: '700',
            color: '#2d3748',
            marginBottom: '1rem'
          }}>
            Transform Your <span style={{ color: '#FFB088' }}>Career Path</span>
          </h2>
          <p style={{
            fontSize: '1.15rem',
            color: '#4a5568',
            maxWidth: '650px',
            margin: '0 auto',
            lineHeight: '1.7'
          }}>
            Industry-leading programs designed to take you from beginner to expert
          </p>
        </div>

        {/* Course Cards - Staggered Layout */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem'
        }}>
          {courses.map((course, index) => (
            <div 
              key={index}
              className="course-card"
              style={{
                display: 'grid',
                gridTemplateColumns: index % 2 === 0 ? '1.2fr 1fr' : '1fr 1.2fr',
                gap: '3rem',
                alignItems: 'center',
                background: '#ffffff',
                borderRadius: '35px',
                padding: '2rem',
                border: '2px solid #f5f5f5',
                transition: 'all 0.4s ease',
                boxShadow: '0 5px 20px rgba(0, 0, 0, 0.04)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 15px 50px rgba(255, 176, 136, 0.15)';
                e.currentTarget.style.borderColor = '#FFE8DC';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.borderColor = '#f5f5f5';
              }}
            >
              {/* Image Section */}
              <div style={{
                order: index % 2 === 0 ? 1 : 2,
                position: 'relative',
                borderRadius: '25px',
                overflow: 'hidden',
                height: '300px',
                minHeight: '250px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                width: '100%'
              }}>
                <img 
                  src={course.image}
                  alt={course.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    transition: 'transform 0.4s ease',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  color: '#FF8A54'
                }}>
                  {course.stats.level}
                </div>
              </div>

              {/* Content Section */}
              <div style={{
                order: index % 2 === 0 ? 2 : 1,
                padding: '1rem'
              }}>
                <div style={{
                  display: 'inline-block',
                  padding: '0.4rem 1rem',
                  background: '#FFF5F0',
                  borderRadius: '20px',
                  marginBottom: '1.5rem',
                  fontSize: '0.85rem',
                  color: '#FF8A54',
                  fontWeight: '600'
                }}>
                  {course.stats.duration}
                </div>
                
                <h3 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  color: '#2d3748',
                  marginBottom: '1rem'
                }}>
                  {course.title}
                </h3>
                
                <p style={{
                  color: '#4a5568',
                  lineHeight: '1.8',
                  marginBottom: '2rem',
                  fontSize: '1.05rem'
                }}>
                  {course.desc}
                </p>

                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <button style={{
                    background: 'linear-gradient(135deg, #FF8A54 0%, #FFB088 100%)',
                    color: 'white',
                    padding: '0.9rem 2.5rem',
                    borderRadius: '25px',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(255, 138, 84, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(255, 138, 84, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(255, 138, 84, 0.3)';
                  }}>
                    Enroll Now
                  </button>
                  
                  <button style={{
                    background: 'transparent',
                    color: '#FF8A54',
                    padding: '0.9rem 2.5rem',
                    borderRadius: '25px',
                    border: '2px solid #FFE8DC',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#FFF5F0';
                    e.target.style.borderColor = '#FFB088';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.borderColor = '#FFE8DC';
                  }}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 968px) {
          #courses h2 {
            font-size: 2.2rem !important;
          }
          #courses > div > div:nth-child(2) > div {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          #courses > div > div:nth-child(2) > div > div {
            order: 1 !important;
          }
          #courses > div > div:nth-child(2) > div > div:first-child {
            height: 250px !important;
            min-height: 200px !important;
          }
        }

        @media (max-width: 640px) {
          #courses {
            padding: 3rem 1rem !important;
          }
          #courses h2 {
            font-size: 1.8rem !important;
          }
          #courses > div > div:nth-child(2) > div {
            padding: 1.5rem !important;
          }
          #courses > div > div:nth-child(2) > div > div:first-child {
            height: 220px !important;
            min-height: 180px !important;
          }
          #courses button {
            width: 100% !important;
            padding: 0.8rem 1.5rem !important;
          }
        }

        @media (max-width: 480px) {
          #courses > div > div:nth-child(2) > div > div:first-child {
            height: 200px !important;
            min-height: 160px !important;
          }
          #courses h3 {
            font-size: 1.5rem !important;
          }
          #courses p {
            font-size: 0.95rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Courses;