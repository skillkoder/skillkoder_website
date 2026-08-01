import React, { useEffect, useRef, useState } from 'react';
import { LEAD_CAPTURE_URL } from '../data/site';

/**
 * "Download Brochure" lead capture.
 *
 * The PDFs already existed in public/documents/ with nothing linking to them.
 * This puts them behind a short form, which is the point of a brochure CTA —
 * it converts anonymous traffic into a contactable lead at a much lower
 * commitment than booking a demo.
 *
 * TWO DELIBERATE DECISIONS
 * ------------------------
 * 1. The download is NOT blocked on the network call succeeding. The submit
 *    goes out in no-cors mode (same as RegistrationModal), which means we
 *    cannot read the response and cannot distinguish success from failure. If
 *    the visitor were gated on a result we cannot observe, an outage would
 *    silently withhold a PDF we were always going to hand over. Capture is
 *    best-effort; the brochure is not.
 *
 * 2. Azure Data Engineering has no PDF yet. Rather than a dead link or a fake
 *    file, that option states plainly that it will be emailed. Add the file to
 *    public/documents/ and set its `file` below to switch it to a direct
 *    download — no other change needed.
 */

const BROCHURES = [
  { course: 'Data Analytics', file: '/documents/DATA ANALYTICS.pdf' },
  { course: 'Data Science', file: '/documents/DataScience.pdf' },
  { course: 'Generative AI', file: '/documents/GenAi.pdf' },
  { course: 'Azure Data Engineering', file: null },
];

const inputStyle = {
  width: '100%',
  padding: '0.625rem 0.75rem',
  borderRadius: '8px',
  border: '2px solid #e5e7eb',
  fontSize: '0.9375rem',
  transition: 'border-color 0.2s',
  outline: 'none',
  fontFamily: 'inherit',
};

const labelTextStyle = {
  display: 'block',
  marginBottom: '0.375rem',
  fontWeight: 600,
  color: '#374151',
};

const BrochureModal = ({ open, onClose, initialCourse = '' }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    course: initialCourse || BROCHURES[0].course,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [delivered, setDelivered] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setDelivered(false);
      setIsSubmitting(false);
    } else if (initialCourse) {
      setForm((f) => ({ ...f, course: initialCourse }));
    }
  }, [open, initialCourse]);

  if (!open) return null;

  const selected = BROCHURES.find((b) => b.course === form.course);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch(LEAD_CAPTURE_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: 'brochure_download' }),
      });
    } catch (error) {
      // Deliberately swallowed — see note 1 at the top of this file. The
      // visitor gets the brochure either way; only our lead record is lost.
      console.error('Brochure lead capture failed:', error);
    }

    setIsSubmitting(false);
    setDelivered(true);
  };

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(4px)',
      }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Download course brochure"
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem 1.75rem',
          boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.5rem',
            gap: '1rem',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '1.6rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #C2410C, #9A3412)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {delivered ? 'Your brochure is ready' : 'Download Course Brochure'}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#9ca3af',
              padding: '0.25rem',
              lineHeight: 1,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {delivered ? (
          <div>
            {selected?.file ? (
              <>
                <p style={{ color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                  Thanks{form.name ? `, ${form.name.split(' ')[0]}` : ''}. The{' '}
                  <strong>{form.course}</strong> brochure covers the curriculum,
                  tools and career outcomes in detail.
                </p>
                <a
                  href={selected.file}
                  download
                  onClick={() => setTimeout(onClose, 1200)}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '0.9rem 1.5rem',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #C2410C, #9A3412)',
                    color: '#ffffff',
                    fontWeight: 700,
                    textDecoration: 'none',
                    marginBottom: '1rem',
                  }}
                >
                  Download the {form.course} brochure (PDF)
                </a>
              </>
            ) : (
              <p style={{ color: '#374151', lineHeight: 1.75, marginBottom: '1.25rem' }}>
                Thanks{form.name ? `, ${form.name.split(' ')[0]}` : ''}. The{' '}
                <strong>{form.course}</strong> brochure is not available as a
                download yet — we will email it to{' '}
                <strong>{form.email}</strong> instead. If you would rather not
                wait, call us and we will talk you through the curriculum now.
              </p>
            )}

            <p style={{ color: '#6b7280', fontSize: '0.86rem', lineHeight: 1.7, margin: 0 }}>
              We will use your details only to send course information you asked
              for. You can ask us to delete them at any time — see our privacy
              policy.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ color: '#4b5568', lineHeight: 1.7, marginTop: 0, marginBottom: '1.25rem', fontSize: '0.94rem' }}>
              Curriculum, tools covered, project work and career outcomes — the
              full detail in one PDF.
            </p>

            <label style={{ display: 'block', marginBottom: '0.875rem' }}>
              <span style={labelTextStyle}>Which brochure? *</span>
              <select
                required
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                style={inputStyle}
              >
                {BROCHURES.map((b) => (
                  <option key={b.course} value={b.course}>
                    {b.course}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: 'block', marginBottom: '0.875rem' }}>
              <span style={labelTextStyle}>Full Name *</span>
              <input
                name="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Your name"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#FFB088')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
              />
            </label>

            <label style={{ display: 'block', marginBottom: '0.875rem' }}>
              <span style={labelTextStyle}>Email Address *</span>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#FFB088')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
              />
            </label>

            <label style={{ display: 'block', marginBottom: '1.25rem' }}>
              <span style={labelTextStyle}>Phone Number *</span>
              <input
                name="contact"
                type="tel"
                required
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
                placeholder="+91 98765 43210"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#FFB088')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '0.9rem 1.5rem',
                borderRadius: '10px',
                border: 'none',
                cursor: isSubmitting ? 'wait' : 'pointer',
                background: 'linear-gradient(135deg, #C2410C, #9A3412)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1rem',
                opacity: isSubmitting ? 0.75 : 1,
              }}
            >
              {isSubmitting ? 'Preparing…' : 'Get the brochure'}
            </button>

            <p style={{ color: '#6b7280', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: 0, marginTop: '0.9rem' }}>
              We will only use these details to send you course information. No
              spam, and you can ask us to delete them at any time.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default BrochureModal;
