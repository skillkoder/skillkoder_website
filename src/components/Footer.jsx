import React from 'react';

const Footer = () => {
  const styles = {
    footer: {
      background: 'linear-gradient(135deg, #ffffff 0%, #fff5f0 50%, #ffe8dc 100%)',
      padding: '3rem 1.5rem',
      borderTop: '1px solid rgba(255, 182, 136, 0.3)',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem',
      marginBottom: '2rem',
    },
    logoSection: {
      display: 'flex',
      flexDirection: 'column',
    },
    logo: {
      height: '48px',
      marginBottom: '1rem',
      cursor: 'pointer',
      transition: 'transform 0.3s ease',
      objectFit: 'contain',
      display: 'block',
    },
    logoDescription: {
      color: '#4a5568',
      fontSize: '0.875rem',
      lineHeight: '1.5',
    },
    sectionTitle: {
      color: '#2d3748',
      fontWeight: '600',
      marginBottom: '1rem',
      fontSize: '1rem',
    },
    linksList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    linkItem: {
      marginBottom: '0.5rem',
    },
    link: {
      color: '#4a5568',
      textDecoration: 'none',
      fontSize: '0.875rem',
      display: 'inline-block',
      transition: 'all 0.3s ease',
    },
    socialContainer: {
      display: 'flex',
      gap: '1rem',
    },
    socialIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
    },
    bottomBar: {
      paddingTop: '2rem',
      borderTop: '1px solid rgba(255, 182, 136, 0.3)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
    },
    copyright: {
      color: '#718096',
      fontSize: '0.875rem',
    },
    policyLinks: {
      display: 'flex',
      gap: '1.5rem',
    },
    policyLink: {
      color: '#718096',
      textDecoration: 'none',
      fontSize: '0.875rem',
      transition: 'all 0.3s ease',
    },
  };

  const handleLogoHover = (e, isHover) => {
    e.currentTarget.style.transform = isHover ? 'scale(1.05)' : 'scale(1)';
  };

  const handleLogoClick = (e) => {
    const el = e.currentTarget;
    if (!el) return;
    el.style.transform = 'scale(0.95)';
    setTimeout(() => {
      el.style.transform = 'scale(1)';
    }, 150);
  };

  const handleLinkHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.style.color = '#ff6b6b';
      e.currentTarget.style.transform = 'translateX(4px)';
    } else {
      e.currentTarget.style.color = '#4a5568';
      e.currentTarget.style.transform = 'translateX(0)';
    }
  };

  const handleLinkClick = (e) => {
    const el = e.currentTarget;
    if (!el) return;
    el.style.transform = 'scale(0.95)';
    setTimeout(() => {
      el.style.transform = 'translateX(4px)';
    }, 150);
  };

  const handleSocialHover = (e, isHover, color, bgColor) => {
    if (isHover) {
      e.currentTarget.style.transform = 'scale(1.1) rotate(-6deg)';
      e.currentTarget.style.backgroundColor = bgColor;
      e.currentTarget.style.color = '#ffffff';
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
    } else {
      e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
      e.currentTarget.style.backgroundColor = '#ffffff';
      e.currentTarget.style.color = color;
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    }
  };

  const handleSocialClick = (e) => {
    const el = e.currentTarget;
    if (!el) return;
    el.style.transform = 'scale(0.95)';
    setTimeout(() => {
      el.style.transform = 'scale(1.1) rotate(-6deg)';
    }, 150);
  };

  const handlePolicyHover = (e, isHover) => {
    if (isHover) {
      e.currentTarget.style.color = '#ff6b6b';
      e.currentTarget.style.transform = 'translateY(-2px)';
    } else {
      e.currentTarget.style.color = '#718096';
      e.currentTarget.style.transform = 'translateY(0)';
    }
  };

  const handlePolicyClick = (e) => {
    const el = e.currentTarget;
    if (!el) return;
    el.style.transform = 'scale(0.95)';
    setTimeout(() => {
      el.style.transform = 'translateY(-2px)';
    }, 150);
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Main Footer Content */}
        <div style={styles.gridContainer}>
          {/* Logo Section */}
          <div style={styles.logoSection}>
            <img
              src="/sk_logo.webp"
              alt="SkillKoder Logo"
              style={styles.logo}
              className="logo-img"
              onMouseEnter={(e) => handleLogoHover(e, true)}
              onMouseLeave={(e) => handleLogoHover(e, false)}
              onClick={handleLogoClick}
            />
            <p style={styles.logoDescription}>
              Empowering learners with cutting-edge skills for the digital future.
            </p>
          </div>

          {/* Quick Links - Matching Navbar */}
          <div>
            <h3 style={styles.sectionTitle}>Quick Links</h3>
            <ul style={styles.linksList}>
              <li style={styles.linkItem}>
                <a
                  href="#home"
                  style={styles.link}
                  onMouseEnter={(e) => handleLinkHover(e, true)}
                  onMouseLeave={(e) => handleLinkHover(e, false)}
                  onClick={(e) => {
                    handleLinkClick(e);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Home
                </a>
              </li>
              <li style={styles.linkItem}>
                <a
                  href="#about"
                  style={styles.link}
                  onMouseEnter={(e) => handleLinkHover(e, true)}
                  onMouseLeave={(e) => handleLinkHover(e, false)}
                  onClick={(e) => {
                    handleLinkClick(e);
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  About
                </a>
              </li>
              <li style={styles.linkItem}>
                <a
                  href="#courses"
                  style={styles.link}
                  onMouseEnter={(e) => handleLinkHover(e, true)}
                  onMouseLeave={(e) => handleLinkHover(e, false)}
                  onClick={(e) => {
                    handleLinkClick(e);
                    document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Courses
                </a>
              </li>
              <li style={styles.linkItem}>
                <a
                  href="#features"
                  style={styles.link}
                  onMouseEnter={(e) => handleLinkHover(e, true)}
                  onMouseLeave={(e) => handleLinkHover(e, false)}
                  onClick={(e) => {
                    handleLinkClick(e);
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Features
                </a>
              </li>
              <li style={styles.linkItem}>
                <a
                  href="#contact"
                  style={styles.link}
                  onMouseEnter={(e) => handleLinkHover(e, true)}
                  onMouseLeave={(e) => handleLinkHover(e, false)}
                  onClick={(e) => {
                    handleLinkClick(e);
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 style={styles.sectionTitle}>Resources</h3>
            <ul style={styles.linksList}>
              {['Case Studies', 'Learning Path', 'Blog', 'Support'].map((item) => (
                <li key={item} style={styles.linkItem}>
                  <a
                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                    style={styles.link}
                    onMouseEnter={(e) => handleLinkHover(e, true)}
                    onMouseLeave={(e) => handleLinkHover(e, false)}
                    onClick={handleLinkClick}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect with Social Icons */}
          <div>
            <h3 style={styles.sectionTitle}>Connect</h3>
            <div style={styles.socialContainer}>
              {/* Facebook */}
              <a
                  href="https://www.facebook.com/profile.php?id=61582789902427"
                  target="_blank"
                  rel="noopener noreferrer"
                style={{...styles.socialIcon, color: '#1877f2'}}
                onMouseEnter={(e) => handleSocialHover(e, true, '#1877f2', '#1877f2')}
                onMouseLeave={(e) => handleSocialHover(e, false, '#1877f2', '#ffffff')}
                onClick={handleSocialClick}
              >
                <svg style={{width: '20px', height: '20px'}} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                  href="https://www.linkedin.com/in/skill-koder?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                  target="_blank"
                  rel="noopener noreferrer"
                style={{...styles.socialIcon, color: '#0a66c2'}}
                onMouseEnter={(e) => handleSocialHover(e, true, '#0a66c2', '#0a66c2')}
                onMouseLeave={(e) => handleSocialHover(e, false, '#0a66c2', '#ffffff')}
                onClick={handleSocialClick}
              >
                <svg style={{width: '20px', height: '20px'}} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a
                  href="https://www.instagram.com/skillkoder/"
                  target="_blank"
                  rel="noopener noreferrer"
                style={{...styles.socialIcon, color: '#e4405f'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) rotate(6deg)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #833ab4, #e4405f, #fd8d32)';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.color = '#e4405f';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
                onClick={handleSocialClick}
              >
                <svg style={{width: '20px', height: '20px'}} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              {/* YouTube */}
              <a
                  href="https://youtube.com/@skillkoder?si=09iO8YNo_z9gZ8BN"
                  target="_blank"
                  rel="noopener noreferrer"
                style={{...styles.socialIcon, color: '#ff0000'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1) rotate(6deg)';
                  e.currentTarget.style.backgroundColor = '#ff0000';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.color = '#ff0000';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
                onClick={handleSocialClick}
              >
                <svg style={{width: '20px', height: '20px'}} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={styles.bottomBar}>
          <p style={styles.copyright}>
            © 2025 SkillKoder. All rights reserved.
          </p>
          <div style={styles.policyLinks}>
            <a 
              href="#privacy" 
              style={styles.policyLink}
              onMouseEnter={(e) => handlePolicyHover(e, true)}
              onMouseLeave={(e) => handlePolicyHover(e, false)}
              onClick={handlePolicyClick}
            >
              Privacy Policy
            </a>
            <a 
              href="#terms" 
              style={styles.policyLink}
              onMouseEnter={(e) => handlePolicyHover(e, true)}
              onMouseLeave={(e) => handlePolicyHover(e, false)}
              onClick={handlePolicyClick}
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;