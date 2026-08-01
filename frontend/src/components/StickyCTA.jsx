import React, { useEffect, useState } from 'react';
import { PHONE_TEL, WHATSAPP_CHAT, openDemoModal } from '../data/site';

/**
 * Persistent conversion CTAs — WhatsApp, call, and Book Free Demo.
 *
 * LAYOUT DIFFERS BY BREAKPOINT, DELIBERATELY
 * ------------------------------------------
 * Desktop: a floating column in the bottom-right corner. There is room, and it
 * never overlaps content.
 *
 * Mobile: a full-width bar pinned to the bottom. A floating pill on a phone
 * covers the content you are trying to read, and the thumb-reachable bottom
 * edge is where a tap CTA belongs anyway. The bar is ~64px tall, so the page
 * gets matching bottom padding (see the injected rule below) to guarantee the
 * footer's last line is never trapped underneath it.
 *
 * It stays hidden until the visitor has scrolled past the hero. Showing a
 * "book a demo" bar to someone who has read one line is what makes these feel
 * like a popup; showing it to someone who scrolled is what makes it useful.
 */

const SHOW_AFTER_PX = 520;

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.943c0 2.096.549 4.142 1.595 5.945L0 24l6.305-1.654a11.9 11.9 0 0 0 5.683 1.448h.005c6.585 0 11.946-5.359 11.949-11.945a11.9 11.9 0 0 0-3.421-8.4" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02z" />
  </svg>
);

const StickyCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const circle = {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 10px 26px rgba(0, 0, 0, 0.18)',
    transition: 'transform 0.25s ease',
  };

  return (
    <>
      <style>{`
        /* Reserve room for the mobile bar so the footer is never covered. */
        @media (max-width: 768px) {
          body { padding-bottom: 68px; }
          .sticky-cta-desktop { display: none !important; }
        }
        @media (min-width: 769px) {
          .sticky-cta-mobile { display: none !important; }
        }
        .sticky-cta-desktop a:hover,
        .sticky-cta-desktop button:hover { transform: scale(1.08); }

        /* Respect users who have asked the OS to reduce motion. */
        @media (prefers-reduced-motion: reduce) {
          .sticky-cta-desktop,
          .sticky-cta-mobile,
          .sticky-cta-desktop a,
          .sticky-cta-desktop button { transition: none !important; }
        }
      `}</style>

      {/* Desktop: floating column, bottom-right */}
      <div
        className="sticky-cta-desktop"
        style={{
          position: 'fixed',
          right: '1.5rem',
          bottom: '1.5rem',
          zIndex: 990,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '0.75rem',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          pointerEvents: visible ? 'auto' : 'none',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        <a
          href={WHATSAPP_CHAT}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with SkillKoder on WhatsApp"
          title="Chat on WhatsApp"
          style={{ ...circle, background: '#25D366' }}
        >
          <WhatsAppIcon />
        </a>

        <a
          href={PHONE_TEL}
          aria-label="Call SkillKoder"
          title="Call us"
          style={{ ...circle, background: '#2f365d' }}
        >
          <PhoneIcon />
        </a>

        <button
          type="button"
          onClick={openDemoModal}
          style={{
            padding: '0.85rem 1.5rem',
            borderRadius: '999px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: '#ffffff',
            background: 'linear-gradient(135deg, #C2410C, #9A3412)',
            boxShadow: '0 12px 30px rgba(194, 65, 12, 0.35)',
            transition: 'transform 0.25s ease',
          }}
        >
          Book Free Demo
        </button>
      </div>

      {/* Mobile: full-width bottom bar */}
      <div
        className="sticky-cta-mobile"
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 990,
          display: 'flex',
          alignItems: 'stretch',
          gap: '0.5rem',
          padding: '0.6rem 0.75rem',
          background: 'rgba(255, 255, 255, 0.97)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderTop: '1px solid #FFE2D2',
          boxShadow: '0 -6px 24px rgba(0, 0, 0, 0.08)',
          transform: visible ? 'translateY(0)' : 'translateY(110%)',
          transition: 'transform 0.3s ease',
        }}
      >
        <a
          href={WHATSAPP_CHAT}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with SkillKoder on WhatsApp"
          style={{
            width: '48px',
            borderRadius: '12px',
            background: '#25D366',
            color: '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <WhatsAppIcon />
        </a>

        <a
          href={PHONE_TEL}
          aria-label="Call SkillKoder"
          style={{
            width: '48px',
            borderRadius: '12px',
            background: '#2f365d',
            color: '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <PhoneIcon />
        </a>

        <button
          type="button"
          onClick={openDemoModal}
          style={{
            flex: 1,
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.98rem',
            color: '#ffffff',
            background: 'linear-gradient(135deg, #C2410C, #9A3412)',
            padding: '0.85rem 1rem',
          }}
        >
          Book Free Demo
        </button>
      </div>
    </>
  );
};

export default StickyCTA;
