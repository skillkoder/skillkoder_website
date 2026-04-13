import React, { useEffect, useRef, useState } from 'react';

const EnrollmentModal = ({ open, onClose, initialCourse = '' }) => {
  const overlayRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', contact: '', course: initialCourse, message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Replace this with your actual Google Apps Script web app URL
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxtnW7ZRYaw7nxNpm8eQHAom6IR_xxBXrIEJus5P1kCgBUdc6n5WqIugkg2E1CA3cdw/exec';

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (initialCourse) setForm((f) => ({ ...f, course: initialCourse }));
  }, [initialCourse]);

  useEffect(() => {
    if (open) {
      setError('');
      setSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  const courses = ['Data Analytics', 'Data Science', 'Generative AI'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          contact: form.contact,
          course: form.course,
          message: form.message,
          timestamp: new Date().toISOString()
        })
      });

      // Note: With no-cors mode, we can't read the response
      // Assume success if no error is thrown
      console.log('Enrollment submitted successfully', form);
      
      // Reset form
      setForm({ name: '', email: '', contact: '', course: initialCourse, message: '' });
      
      // Show success message
      alert('Thank you for enrolling! We will contact you soon.');
      
      onClose();
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to submit enrollment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      ref={overlayRef}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div role="dialog" aria-modal="true" aria-label="Course enrollment form" style={{ width: '100%', maxWidth: '560px', background: 'white', borderRadius: 12, padding: '1.25rem 1.5rem', boxShadow: '0 24px 60px rgba(0,0,0,0.25)' }}>
        <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>Enroll in a Course</h3>
        <p style={{ marginTop: 0, marginBottom: '1rem', color: '#555' }}>Enter your details and we'll reach out to you with next steps.</p>

        {error && (
          <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#fee', border: '1px solid #fcc', borderRadius: 6, color: '#c33' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Name
            <input 
              required 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              disabled={submitting}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', borderRadius: 6, border: '1px solid #e5e7eb' }} 
            />
          </label>

          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Email
            <input 
              required 
              type="email" 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
              disabled={submitting}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', borderRadius: 6, border: '1px solid #e5e7eb' }} 
            />
          </label>

          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Contact Number
            <input 
              required 
              type="tel" 
              value={form.contact} 
              onChange={(e) => setForm({ ...form, contact: e.target.value })} 
              placeholder="e.g. +1 555 555 5555" 
              disabled={submitting}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', borderRadius: 6, border: '1px solid #e5e7eb' }} 
            />
          </label>

          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Course
            <select 
              required 
              value={form.course} 
              onChange={(e) => setForm({ ...form, course: e.target.value })} 
              disabled={submitting}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', borderRadius: 6, border: '1px solid #e5e7eb' }}
            >
              <option value="">Select a course</option>
              {courses.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>

          <label style={{ display: 'block', marginBottom: '0.75rem' }}>
            Message (optional)
            <textarea 
              value={form.message} 
              onChange={(e) => setForm({ ...form, message: e.target.value })} 
              rows={3} 
              disabled={submitting}
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', borderRadius: 6, border: '1px solid #e5e7eb' }} 
            />
          </label>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              onClick={onClose} 
              disabled={submitting}
              style={{ padding: '0.5rem 0.9rem', borderRadius: 8, background: '#f3f4f6', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1 }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={submitting}
              style={{ padding: '0.5rem 0.9rem', borderRadius: 8, background: 'linear-gradient(135deg,#FF6B6B,#FFB088)', color: 'white', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.6 : 1 }}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentModal;