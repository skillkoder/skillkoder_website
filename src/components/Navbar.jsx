import React, { useState, useEffect } from 'react';
import RegistrationModal from './RegistrationModal';
import EnrollmentModal from './EnrollmentModal';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [enrollmentCourse, setEnrollmentCourse] = useState('');
  const [scrolled, setScrolled] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fix cleanup: add a separate effect to register the openRegistration listener with proper cleanup
  React.useEffect(() => {
    const onOpenRegistration = () => setShowRegistration(true);
    window.addEventListener('skillkoder:openRegistration', onOpenRegistration);
    return () => window.removeEventListener('skillkoder:openRegistration', onOpenRegistration);
  }, []);

  // Listen for enrollment open events from other components
  React.useEffect(() => {
    const onOpenEnrollment = (e) => {
      const course = e?.detail?.course || '';
      setEnrollmentCourse(course);
      setShowEnrollment(true);
    };
    window.addEventListener('skillkoder:openEnrollment', onOpenEnrollment);
    return () => window.removeEventListener('skillkoder:openEnrollment', onOpenEnrollment);
  }, []);

  const styles = {
    nav: {
      /* static navbar: participates in normal document flow and does not float */
      position: 'static',
      /* full width appearance */
      width: '100%',
      /* Always transparent - no background color */
      background: 'transparent',
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      borderBottom: 'none',
      boxShadow: 'none',
      transition: 'all 0.15s ease',
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      /* decreased vertical padding to make navbar shorter */
      padding: '0.5rem 1.25rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '1.5rem',
      /* position relative so absolute dropdowns anchor to the container */
      position: 'relative',
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      flexShrink: 0,
    },
    logoImg: {
      height: '48px',
      width: 'auto',
      objectFit: 'contain',
      display: 'block',
      /* small nudge left on wide screens only; reset on narrow devices via media queries */
      marginLeft: '-1rem',
    },
    desktopMenu: {
      display: 'flex',
      gap: '2rem',
      listStyle: 'none',
      alignItems: 'center',
      flexWrap: 'nowrap',
      '@media (max-width: 768px)': {
  display: isMenuOpen ? 'flex' : 'none',
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  flexDirection: 'column',
  /* keep menu transparent so navbar area doesn't show white */
  background: 'transparent',
  padding: '1rem 0',
  boxShadow: 'none',
  gap: '1rem',
      },
    },
    menuItem: {
      color: '#1a202c',
      textDecoration: 'none',
      fontSize: '0.95rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      padding: '0.5rem 0',
    },
    menuItemUnderline: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '0%',
      height: '2px',
      background: 'linear-gradient(90deg, #FF6B6B, #FFB088)',
      transition: 'width 0.3s ease',
    },
    registerBtn: {
      background: 'linear-gradient(135deg, #FF6B6B, #FFB088)',
      color: 'white',
      /* slightly smaller button to reduce navbar height */
      padding: '0.5rem 1.25rem',
      borderRadius: '40px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '0.9rem',
      boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      position: 'relative',
      overflow: 'hidden',
    },
    mobileMenuBtn: {
      display: 'none',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0.5rem',
      '@media (max-width: 768px)': {
        display: 'block',
      },
      padding: '0.5rem',
      color: '#1a202c',
      transition: 'all 0.3s ease',
      fontSize: '1.75rem',
      lineHeight: 1,
    },
    mobileMenu: {
      position: 'fixed',
      top: 0,
      right: isMenuOpen ? 0 : '-100%',
      width: '280px',
      height: '100vh',
      background: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(20px)',
      boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.1)',
      padding: '2rem',
      transition: 'right 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      zIndex: 1001,
    },
    mobileMenuList: {
      listStyle: 'none',
      marginTop: '4rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    mobileMenuItem: {
      color: '#1a202c',
      textDecoration: 'none',
      fontSize: '1.1rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      display: 'block',
      padding: '0.75rem 0',
    },
    closeBtn: {
      position: 'absolute',
      top: '1.5rem',
      right: '1.5rem',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '0.5rem',
      color: '#1a202c',
      fontSize: '1.75rem',
      lineHeight: 1,
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      opacity: isMenuOpen ? 1 : 0,
      pointerEvents: isMenuOpen ? 'auto' : 'none',
      transition: 'opacity 0.3s ease',
      zIndex: 1000,
    },
  };

  return (
    <>
      <style>{`
        /* ensure navbar area stays transparent */
        nav, nav > div, .desktop-menu { background: transparent !important; box-shadow: none !important; border-bottom: none !important; }

        @media (max-width: 1024px) {
          .desktop-menu { 
            gap: 1.5rem !important; 
          }
          .desktop-menu button {
            padding: 0.65rem 1.5rem !important;
            font-size: 0.9rem !important;
          }
        }
        @media (max-width: 900px) {
          .desktop-menu { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
        @media (max-width: 768px) {
          nav > div {
            padding: 0.875rem 1rem !important;
            gap: 1rem !important;
          }
          .logo-img {
            height: 50px !important;
            margin-left: 0 !important;
          }
        }
        @media (max-width: 480px) {
          nav > div {
            padding: 0.75rem 0.75rem !important;
            gap: 0.5rem !important;
          }
          .logo-img {
            height: 45px !important;
            margin-left: 0 !important;
          }
          .mobile-menu-btn {
            font-size: 1.5rem !important;
            padding: 0.25rem !important;
          }
        }
        @media (max-width: 360px) {
          nav > div {
            padding: 0.65rem 0.5rem !important;
          }
          .logo-img {
            height: 40px !important;
          }
        }
        .menu-item:hover .underline {
          width: 100% !important;
        }
      `}</style>

      <nav style={styles.nav}>
        <div style={styles.container}>
          <div style={styles.logoContainer}>
            <img 
              src="/sk_logo.webp" 
              alt="SkillKoder Logo" 
              style={styles.logoImg}
              className="logo-img"
            />
          </div>

          <ul className="desktop-menu" style={styles.desktopMenu}>
            <li>
              <a 
                className="menu-item"
                style={styles.menuItem} 
                href="#home"
                onMouseEnter={(e) => e.target.style.color = '#FF6B6B'}
                onMouseLeave={(e) => e.target.style.color = '#1a202c'}
              >
                Home
                <div className="underline" style={styles.menuItemUnderline}></div>
              </a>
            </li>
            <li>
              <a 
                className="menu-item"
                style={styles.menuItem} 
                href="#about"
                onMouseEnter={(e) => e.target.style.color = '#FF6B6B'}
                onMouseLeave={(e) => e.target.style.color = '#1a202c'}
              >
                About
                <div className="underline" style={styles.menuItemUnderline}></div>
              </a>
            </li>
            <li>
              <a 
                className="menu-item"
                style={styles.menuItem} 
                href="#courses"
                onMouseEnter={(e) => e.target.style.color = '#FF6B6B'}
                onMouseLeave={(e) => e.target.style.color = '#1a202c'}
              >
                Courses
                <div className="underline" style={styles.menuItemUnderline}></div>
              </a>
            </li>
            <li>
              <a 
                className="menu-item"
                style={styles.menuItem} 
                href="#features"
                onMouseEnter={(e) => e.target.style.color = '#FF6B6B'}
                onMouseLeave={(e) => e.target.style.color = '#1a202c'}
              >
                Features
                <div className="underline" style={styles.menuItemUnderline}></div>
              </a>
            </li>
            <li>
              <a 
                className="menu-item"
                style={styles.menuItem} 
                href="#contact"
                onMouseEnter={(e) => e.target.style.color = '#FF6B6B'}
                onMouseLeave={(e) => e.target.style.color = '#1a202c'}
              >
                Contact Us
                <div className="underline" style={styles.menuItemUnderline}></div>
              </a>
            </li>
            <li>
              <button 
                style={styles.registerBtn}
                onClick={() => setShowRegistration(true)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px) scale(1.02)';
                  e.target.style.boxShadow = '0 8px 24px rgba(255, 107, 107, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.3)';
                }}
              >
                Register Now
              </button>
            </li>
          </ul>

          <button 
            className="mobile-menu-btn"
            style={styles.mobileMenuBtn}
            onClick={() => setIsMenuOpen(true)}
          >
            ☰
          </button>
        </div>
      </nav>

      <div style={styles.overlay} onClick={() => setIsMenuOpen(false)} />

      <div style={styles.mobileMenu}>
        <button style={styles.closeBtn} onClick={() => setIsMenuOpen(false)}>
          ✕
        </button>
        <ul style={styles.mobileMenuList}>
          <li>
            <a 
              style={styles.mobileMenuItem} 
              href="#home"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
          </li>
          <li>
            <a 
              style={styles.mobileMenuItem} 
              href="#about"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
          </li>
          <li>
            <a 
              style={styles.mobileMenuItem} 
              href="#courses"
              onClick={() => setIsMenuOpen(false)}
            >
              Courses
            </a>
          </li>
          <li>
            <a 
              style={styles.mobileMenuItem} 
              href="#features"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
          </li>
          <li>
            <a 
              style={styles.mobileMenuItem} 
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </a>
          </li>
          <li style={{ marginTop: '1rem' }}>
            <button 
              style={{...styles.registerBtn, width: '100%'}}
              onClick={() => { setIsMenuOpen(false); setShowRegistration(true); }}
            >
              Register Now
            </button>
          </li>
        </ul>
      </div>
      <RegistrationModal open={showRegistration} onClose={() => setShowRegistration(false)} />
      <EnrollmentModal open={showEnrollment} onClose={() => setShowEnrollment(false)} initialCourse={enrollmentCourse} />
    </>
  );
};

export default Navbar;