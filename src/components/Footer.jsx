import React from 'react';

const Footer = () => {
  const styles = {
    footer: {
      background: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(20px)',
      padding: '3rem 1rem',
      borderTop: '1px solid rgba(255, 182, 136, 0.3)',
      '@media (max-width: 480px)': {
        padding: '2rem 1rem',
      },
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      textAlign: 'center',
    },
    logo: {
      fontSize: '2rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #FF6B6B, #FFB088)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '1rem',
    },
    links: {
      display: 'flex',
      justifyContent: 'center',
      gap: '2rem',
      marginBottom: '1.5rem',
      flexWrap: 'wrap',
      '@media (max-width: 480px)': {
        gap: '1rem',
        flexDirection: 'column',
        alignItems: 'center',
      },
    },
    link: {
      color: '#4a5568',
      textDecoration: 'none',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
    },
    copyright: {
      color: '#718096',
      fontSize: '0.9rem',
    },
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.logo}>SkillKoder</div>
        <div style={styles.links}>
          <a 
            href="#home" 
            style={styles.link}
            onMouseEnter={(e) => e.target.style.color = '#FF6B6B'}
            onMouseLeave={(e) => e.target.style.color = '#4a5568'}
          >
            Home
          </a>
          <a 
            href="#about" 
            style={styles.link}
            onMouseEnter={(e) => e.target.style.color = '#FF6B6B'}
            onMouseLeave={(e) => e.target.style.color = '#4a5568'}
          >
            About
          </a>
          <a 
            href="#courses" 
            style={styles.link}
            onMouseEnter={(e) => e.target.style.color = '#FF6B6B'}
            onMouseLeave={(e) => e.target.style.color = '#4a5568'}
          >
            Courses
          </a>
          <a 
            href="#contact" 
            style={styles.link}
            onMouseEnter={(e) => e.target.style.color = '#FF6B6B'}
            onMouseLeave={(e) => e.target.style.color = '#4a5568'}
          >
            Contact
          </a>
        </div>
        <p style={styles.copyright}>
          © 2025 SkillKoder. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;