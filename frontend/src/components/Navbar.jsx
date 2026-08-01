import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegistrationModal from './RegistrationModal';
import EnrollmentModal from './EnrollmentModal';
import BrochureModal from './BrochureModal';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [enrollmentCourse, setEnrollmentCourse] = useState('');
  const [showBrochure, setShowBrochure] = useState(false);
  const [brochureCourse, setBrochureCourse] = useState('');

  // Scroll to a section without touching the URL.
  // If not on the homepage, navigate there first then scroll.

  const scrollToTop = (e) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };



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

  // Brochure downloads are triggered from content pages and the footer, none of
  // which are ancestors of this component — hence the event rather than props.
  React.useEffect(() => {
    const onOpenBrochure = (e) => {
      setBrochureCourse(e?.detail?.course || '');
      setShowBrochure(true);
    };
    window.addEventListener('skillkoder:openBrochure', onOpenBrochure);
    return () => window.removeEventListener('skillkoder:openBrochure', onOpenBrochure);
  }, []);

  const styles = {
    nav: {
      position: 'sticky',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      background: 'rgba(255, 255, 255, 0.78)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      borderBottom: '1px solid rgba(255, 183, 132, 0.2)',
      boxShadow: '0 18px 45px rgba(0, 0, 0, 0.06)',
      transition: 'all 0.25s ease',
    },
    container: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0.85rem 1.5rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '1.5rem',
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
    },
    menuItem: {
      color: '#2d3748',
      textDecoration: 'none',
      fontSize: '0.95rem',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative',
      padding: '0.5rem 0',
      letterSpacing: '0.01em'
    },
    menuItemUnderline: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '0%',
      height: '2px',
      background: 'linear-gradient(90deg, #FF8A54, #FFB088)',
      transition: 'width 0.3s ease',
      borderRadius: '999px'
    },
    registerBtn: {
      background: 'linear-gradient(135deg, #C2410C, #9A3412)',
      color: 'white',
      padding: '0.6rem 1.5rem',
      borderRadius: '999px',
      border: 'none',
      fontWeight: '700',
      cursor: 'pointer',
      fontSize: '0.95rem',
      boxShadow: '0 18px 40px rgba(255, 138, 84, 0.25)',
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
        /* allow the sticky navbar glass surface to appear over the page without forcing full transparency */
        nav { background: rgba(255, 255, 255, 0.82) !important; }
        nav > div { background: transparent !important; }
        .desktop-menu { background: transparent !important; box-shadow: none !important; border-bottom: none !important; }

        /* Three extra links (Tools, Blog, Placement) tighten the row, so the
           gap steps down earlier than it used to rather than overflowing. */
        @media (max-width: 1320px) {
          .desktop-menu {
            gap: 1.15rem !important;
          }
          .desktop-menu a {
            font-size: 0.9rem !important;
          }
          .desktop-menu button {
            padding: 0.55rem 1.2rem !important;
            font-size: 0.9rem !important;
          }
        }
        @media (max-width: 1024px) {
          .desktop-menu {
            gap: 1rem !important;
          }
          .desktop-menu a {
            font-size: 0.86rem !important;
          }
          .desktop-menu button {
            padding: 0.6rem 1.15rem !important;
            font-size: 0.86rem !important;
          }
        }
        @media (max-width: 768px) {
          .desktop-menu {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
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
            <img loading="eager" fetchpriority="high" decoding="async" 
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
                href="/"
                onClick={scrollToTop}
                onMouseEnter={(e) => e.target.style.color = '#C2410C'}
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
                href="/about"
                onClick={(e) => { e.preventDefault(); navigate('/about'); }}
                onMouseEnter={(e) => e.target.style.color = '#C2410C'}
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
                href="/courses"
                onClick={(e) => { e.preventDefault(); navigate('/courses'); }}
                onMouseEnter={(e) => e.target.style.color = '#C2410C'}
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
                href="/tools"
                onClick={(e) => { e.preventDefault(); navigate('/tools'); }}
                onMouseEnter={(e) => e.target.style.color = '#C2410C'}
                onMouseLeave={(e) => e.target.style.color = '#1a202c'}
              >
                Tools
                <div className="underline" style={styles.menuItemUnderline}></div>
              </a>
            </li>
            <li>
              <a
                className="menu-item"
                style={styles.menuItem}
                href="/blog"
                onClick={(e) => { e.preventDefault(); navigate('/blog'); }}
                onMouseEnter={(e) => e.target.style.color = '#C2410C'}
                onMouseLeave={(e) => e.target.style.color = '#1a202c'}
              >
                Blog
                <div className="underline" style={styles.menuItemUnderline}></div>
              </a>
            </li>
            <li>
              <a
                className="menu-item"
                style={styles.menuItem}
                href="/placement"
                onClick={(e) => { e.preventDefault(); navigate('/placement'); }}
                onMouseEnter={(e) => e.target.style.color = '#C2410C'}
                onMouseLeave={(e) => e.target.style.color = '#1a202c'}
              >
                Placement
                <div className="underline" style={styles.menuItemUnderline}></div>
              </a>
            </li>
            <li>
              <a
                className="menu-item"
                style={styles.menuItem}
                href="/features"
                onClick={(e) => { e.preventDefault(); navigate('/features'); }}
                onMouseEnter={(e) => e.target.style.color = '#C2410C'}
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
                href="/contact"
                onClick={(e) => { e.preventDefault(); navigate('/contact'); }}
                onMouseEnter={(e) => e.target.style.color = '#C2410C'}
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
                Book Free Demo
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
              href="/"
              onClick={(e) => { setIsMenuOpen(false); scrollToTop(e); }}
            >
              Home
            </a>
          </li>
          <li>
            <a
              style={styles.mobileMenuItem}
              href="/about"
              onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); navigate('/about'); }}
            >
              About
            </a>
          </li>
          <li>
            <a
              style={styles.mobileMenuItem}
              href="/courses"
              onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); navigate('/courses'); }}
            >
              Courses
            </a>
          </li>
          <li>
            <a
              style={styles.mobileMenuItem}
              href="/tools"
              onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); navigate('/tools'); }}
            >
              Tools
            </a>
          </li>
          <li>
            <a
              style={styles.mobileMenuItem}
              href="/blog"
              onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); navigate('/blog'); }}
            >
              Blog
            </a>
          </li>
          <li>
            <a
              style={styles.mobileMenuItem}
              href="/placement"
              onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); navigate('/placement'); }}
            >
              Placement
            </a>
          </li>
          <li>
            <a
              style={styles.mobileMenuItem}
              href="/features"
              onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); navigate('/features'); }}
            >
              Features
            </a>
          </li>
          <li>
            <a
              style={styles.mobileMenuItem}
              href="/faq"
              onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); navigate('/faq'); }}
            >
              FAQs
            </a>
          </li>
          <li>
            <a
              style={styles.mobileMenuItem}
              href="/contact"
              onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); navigate('/contact'); }}
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
      <BrochureModal open={showBrochure} onClose={() => setShowBrochure(false)} initialCourse={brochureCourse} />
    </>
  );
};

export default Navbar;