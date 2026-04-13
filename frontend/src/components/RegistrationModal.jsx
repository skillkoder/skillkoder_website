import React, { useEffect, useRef, useState } from 'react';

const RegistrationModal = ({ open, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', contact: '', course: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const overlayRef = useRef(null);

  // Replace this with your actual Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyJ2RwSHwZiBYKBr71Qpcv6H9HiT5okqHuOOdWu_QBhxphZsRctyoQxtmXDG5kyJ3VM/exec';

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    // Reset status when modal closes
    if (!open) {
      setSubmitStatus({ type: '', message: '' });
    }
  }, [open]);

  if (!open) return null;

  const courses = [
    'Data Analytics',
    'Data Science',
    'Generative AI'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      // Send data to Google Sheets
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Important for Google Apps Script
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      // Note: With 'no-cors' mode, we can't read the response
      // We'll assume success if no error is thrown
      setSubmitStatus({
        type: 'success',
        message: 'Registration successful! Check your email for confirmation.'
      });

      // Clear form
      setForm({ name: '', email: '', contact: '', course: '' });

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Registration failed. Please try again or contact support.'
      });
    } finally {
      setIsSubmitting(false);
    }
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
        backdropFilter: 'blur(4px)'
      }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Registration form"
        style={{
          width: '100%',
          maxWidth: '520px',
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem 1.75rem',
          boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
          position: 'relative',
          animation: 'modalSlideIn 0.3s ease-out'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: '1.75rem', 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #FFB088, #E55B5B)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent'
          }}>
            Start Your Journey
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
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#374151'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {submitStatus.message && (
          <div style={{
            padding: '0.875rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            backgroundColor: submitStatus.type === 'success' ? '#d1fae5' : '#fee2e2',
            border: `1px solid ${submitStatus.type === 'success' ? '#6ee7b7' : '#fca5a5'}`,
            color: submitStatus.type === 'success' ? '#065f46' : '#991b1b',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            {submitStatus.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '0.875rem' }}>
            <span style={{ display: 'block', marginBottom: '0.375rem', fontWeight: 600, color: '#374151' }}>
              Full Name *
            </span>
            <input
              name="name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="John Doe"
              style={{ 
                width: '100%', 
                padding: '0.625rem 0.75rem', 
                borderRadius: '8px', 
                border: '2px solid #e5e7eb',
                fontSize: '0.9375rem',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#FFB088'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '0.875rem' }}>
            <span style={{ display: 'block', marginBottom: '0.375rem', fontWeight: 600, color: '#374151' }}>
              Email Address *
            </span>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="john@example.com"
              style={{ 
                width: '100%', 
                padding: '0.625rem 0.75rem', 
                borderRadius: '8px', 
                border: '2px solid #e5e7eb',
                fontSize: '0.9375rem',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#FFB088'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '0.875rem' }}>
            <span style={{ display: 'block', marginBottom: '0.375rem', fontWeight: 600, color: '#374151' }}>
              Contact Number *
            </span>
            <input
              name="contact"
              type="tel"
              required
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              placeholder="+1 555 555 5555"
              style={{ 
                width: '100%', 
                padding: '0.625rem 0.75rem', 
                borderRadius: '8px', 
                border: '2px solid #e5e7eb',
                fontSize: '0.9375rem',
                transition: 'border-color 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#FFB088'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
          </label>

          <label style={{ display: 'block', marginBottom: '1.25rem' }}>
            <span style={{ display: 'block', marginBottom: '0.375rem', fontWeight: 600, color: '#374151' }}>
              Select Course *
            </span>
            <select
              name="course"
              required
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              style={{ 
                width: '100%', 
                padding: '0.625rem 0.75rem', 
                borderRadius: '8px', 
                border: '2px solid #e5e7eb',
                fontSize: '0.9375rem',
                transition: 'border-color 0.2s',
                outline: 'none',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#FFB088'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              <option value="">Choose your path...</option>
              {courses.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              onClick={onClose}
              disabled={isSubmitting}
              style={{ 
                padding: '0.625rem 1.25rem', 
                borderRadius: '8px', 
                background: '#f3f4f6', 
                border: 'none', 
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                fontSize: '0.9375rem',
                transition: 'all 0.2s',
                opacity: isSubmitting ? 0.5 : 1
              }}
              onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.background = '#e5e7eb')}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              style={{ 
                padding: '0.625rem 1.5rem', 
                borderRadius: '8px', 
                background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg,#FF6B6B,#FFB088)', 
                color: 'white', 
                border: 'none', 
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: '0.9375rem',
                transition: 'all 0.3s',
                boxShadow: isSubmitting ? 'none' : '0 4px 12px rgba(255, 107, 107, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {isSubmitting ? (
                <>
                  <span style={{
                    width: '14px',
                    height: '14px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite'
                  }}></span>
                  Submitting...
                </>
              ) : (
                'Register Now'
              )}
            </button>
          </div>
        </form>

        <style>{`
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translateY(-20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default RegistrationModal;