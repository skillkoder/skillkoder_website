import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const styles = {
    contact: {
      padding: '6rem 2rem',
      background: 'linear-gradient(135deg, #FFFFFF 0%, #FFE4DD 100%)',
    },
    container: {
      maxWidth: '800px',
      margin: '0 auto',
    },
    title: {
      fontSize: '3rem',
      fontWeight: '700',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #FF6B6B, #FFB088)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '3rem',
      '@media (max-width: 768px)': {
        fontSize: '2.5rem',
        marginBottom: '2rem',
      },
      '@media (max-width: 480px)': {
        fontSize: '2rem',
        marginBottom: '1.5rem',
      },
    },
    formContainer: {
      background: 'rgba(255, 255, 255, 0.4)',
      backdropFilter: 'blur(20px)',
      borderRadius: '25px',
      padding: '3rem',
      border: '1px solid rgba(255, 182, 136, 0.3)',
      boxShadow: '0 10px 40px rgba(255, 182, 159, 0.2)',
      '@media (max-width: 768px)': {
        padding: '2rem',
      },
      '@media (max-width: 480px)': {
        padding: '1.5rem',
      },
    },
    inputGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      color: '#2d3748',
      fontWeight: '600',
      marginBottom: '0.5rem',
      fontSize: '1rem',
    },
    input: {
      width: '100%',
      padding: '1rem',
      borderRadius: '15px',
      border: '2px solid rgba(255, 182, 136, 0.3)',
      background: 'rgba(255, 255, 255, 0.6)',
      fontSize: '1rem',
      outline: 'none',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '1rem',
      borderRadius: '15px',
      border: '2px solid rgba(255, 182, 136, 0.3)',
      background: 'rgba(255, 255, 255, 0.6)',
      fontSize: '1rem',
      outline: 'none',
      minHeight: '150px',
      resize: 'vertical',
      fontFamily: 'inherit',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
    },
    submitBtn: {
      background: 'linear-gradient(135deg, #FFB088, #FF6B6B)',
      color: 'white',
      padding: '1rem 3rem',
      borderRadius: '50px',
      border: 'none',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      fontSize: '1.1rem',
      boxShadow: '0 5px 20px rgba(255, 107, 107, 0.3)',
      transition: 'all 0.3s ease',
    },
  };

  return (
    <section id="contact" style={styles.contact}>
      <div style={styles.container}>
        <h2 style={styles.title}>Get In Touch</h2>
        <div style={styles.formContainer}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Name</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#FFB088'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 182, 136, 0.3)'}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#FFB088'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 182, 136, 0.3)'}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Message</label>
            <textarea 
              name="message"
              value={formData.message}
              onChange={handleChange}
              style={styles.textarea}
              onFocus={(e) => e.target.style.borderColor = '#FFB088'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 182, 136, 0.3)'}
            />
          </div>
          <button 
            type="button"
            onClick={handleSubmit}
            style={styles.submitBtn}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 5px 20px rgba(255, 107, 107, 0.3)';
            }}
          >
            Send Message
          </button>
        </div>
      </div>
    </section>
  );
};

export default Contact;