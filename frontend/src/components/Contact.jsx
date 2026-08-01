import React, { useState } from 'react';
import { Mail, User, MessageSquare, Send, MapPin, Phone, CheckCircle, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [focused, setFocused] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  // Replace this with your Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwWw5V-G4asjNXQoP33hVYbNUtGvx0f6Mo0MYE5ue30cai2kNbxQ5KMkGi_IbX5eDvI/exec';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          timestamp: new Date().toISOString()
        })
      });

      // Since mode is 'no-cors', we can't read the response
      // Assume success if no error is thrown
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Clear success message after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: <Mail size={24} />,
      title: 'Email',
      info: 'Skillkoder2025@gmail.com'
    },
    {
      icon: <Phone size={24} />,
      title: 'Phone',
      info: '+91 9951599922'
    },
    {
      icon: <MapPin size={24} />,
      title: 'Location',
      info: 'Hyderabad, India'
    }
  ];

  return (
    <section id="contact" style={{
      position: 'relative',
      padding: '3rem 1.5rem',
      background: 'linear-gradient(135deg, #ffffff 0%, #FFF5F0 30%, #FFE8DC 60%, #ffffff 100%)',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '5%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(255, 176, 136, 0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 8s ease-in-out infinite'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '5%',
        width: '250px',
        height: '250px',
        background: 'radial-gradient(circle, rgba(255, 138, 84, 0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 6s ease-in-out infinite reverse'
      }} />

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1,
        fontFamily: "'Outfit', 'Inter', sans-serif"
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h3 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #C2410C, #9A3412)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.2
          }}>
            Book a Free Demo or Talk to a Career Expert
          </h3>
          <p style={{
            fontSize: '1.05rem',
            color: '#475569',
            maxWidth: '680px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Get personalized guidance for Data Analytics, Data Science, and Generative AI training with placement support, resume help, and live mentorship.
          </p>
        </div>

        {/* Small & Middle-aligned Snug Container */}
        <div style={{
          maxWidth: '650px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2.5rem'
        }}>
          {/* Contact Info Cards */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            textAlign: 'left'
          }}>
            <h4 style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              color: '#0f172a',
              marginBottom: '0.25rem',
              textAlign: 'center'
            }}>
              Contact Information
            </h4>
            <p style={{
              color: '#64748b',
              fontSize: '0.95rem',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              Reach out to us through any of these channels
            </p>

            {contactInfo.map((item, index) => (
              <div key={index} style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1.25rem',
                border: '1px solid rgba(255, 176, 136, 0.25)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(255, 138, 84, 0.04)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(255, 138, 84, 0.12)';
                e.currentTarget.style.borderColor = '#FFB088';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 138, 84, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(255, 176, 136, 0.25)';
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem'
                }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #FFE8DC, #FFB088)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    {React.cloneElement(item.icon, { size: 20 })}
                  </div>
                  <div>
                    <div style={{
                      fontSize: '0.82rem',
                      color: '#64748b',
                      fontWeight: '700',
                      letterSpacing: '0.03em',
                      textTransform: 'uppercase'
                    }}>
                      {item.title}
                    </div>
                    <div style={{
                      fontSize: '1.05rem',
                      color: '#0f172a',
                      fontWeight: '700',
                      marginTop: '0.15rem'
                    }}>
                      {item.info}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '2rem',
            border: '1px solid rgba(255, 176, 136, 0.2)',
            boxShadow: '0 12px 36px rgba(255, 138, 84, 0.06)',
            textAlign: 'left'
          }}>
            <form onSubmit={handleSubmit}>
              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem',
                  marginBottom: '1rem',
                  background: '#d4edda',
                  border: '1px solid #c3e6cb',
                  borderRadius: '8px',
                  color: '#155724'
                }}>
                  <CheckCircle size={20} />
                  <span>Message sent successfully! We\'ll get back to you soon.</span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '1rem',
                  marginBottom: '1rem',
                  background: '#f8d7da',
                  border: '1px solid #f5c6cb',
                  borderRadius: '8px',
                  color: '#721c24'
                }}>
                  <AlertCircle size={20} />
                  <span>Failed to send message. Please try again.</span>
                </div>
              )}

              {/* Name Input */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  color: '#334155',
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem'
                }}>
                  Your Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: focused === 'name' ? '#FF8A54' : '#94a3b8',
                    transition: 'color 0.3s ease'
                  }} />
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused('')}
                    placeholder="John Doe"
                    required
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '0.8rem 0.8rem 0.8rem 2.75rem',
                      borderRadius: '12px',
                      border: `2px solid ${focused === 'name' ? '#FFB088' : '#e2e8f0'}`,
                      background: focused === 'name' ? '#FFF5F0' : '#ffffff',
                      fontSize: '0.95rem',
                      color: '#0f172a',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box',
                      opacity: isSubmitting ? 0.6 : 1
                    }}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{
                  display: 'block',
                  color: '#334155',
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem'
                }}>
                  Your Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: focused === 'email' ? '#FF8A54' : '#94a3b8',
                    transition: 'color 0.3s ease'
                  }} />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    placeholder="john@example.com"
                    required
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '0.8rem 0.8rem 0.8rem 2.75rem',
                      borderRadius: '12px',
                      border: `2px solid ${focused === 'email' ? '#FFB088' : '#e2e8f0'}`,
                      background: focused === 'email' ? '#FFF5F0' : '#ffffff',
                      fontSize: '0.95rem',
                      color: '#0f172a',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box',
                      opacity: isSubmitting ? 0.6 : 1
                    }}
                  />
                </div>
              </div>

              {/* Message Textarea */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  color: '#334155',
                  fontWeight: '700',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem'
                }}>
                  Your Message
                </label>
                <div style={{ position: 'relative' }}>
                  <MessageSquare size={18} style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '1rem',
                    color: focused === 'message' ? '#FF8A54' : '#94a3b8',
                    transition: 'color 0.3s ease'
                  }} />
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused('')}
                    placeholder="Tell us about your project or inquiry..."
                    required
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      padding: '0.8rem 0.8rem 0.8rem 2.75rem',
                      borderRadius: '12px',
                      border: `2px solid ${focused === 'message' ? '#FFB088' : '#e2e8f0'}`,
                      background: focused === 'message' ? '#FFF5F0' : '#ffffff',
                      fontSize: '0.95rem',
                      color: '#0f172a',
                      outline: 'none',
                      minHeight: '120px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box',
                      opacity: isSubmitting ? 0.6 : 1
                    }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  background: isSubmitting 
                    ? 'linear-gradient(135deg, #cbd5e0, #a0aec0)' 
                    : 'linear-gradient(135deg, #C2410C, #9A3412)',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: '700',
                  fontSize: '1rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 6px 18px rgba(255, 138, 84, 0.2)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  opacity: isSubmitting ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 10px 24px rgba(255, 138, 84, 0.35)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(255, 138, 84, 0.2)';
                  }
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }

        input::placeholder,
        textarea::placeholder {
          color: #a0aec0;
        }

        @media (max-width: 768px) {
          #contact > div > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;