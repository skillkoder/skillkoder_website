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
      const response = await fetch(GOOGLE_SCRIPT_URL, {
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
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #FF8A54, #FFB088)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
            letterSpacing: '-0.02em'
          }}>
            we can't wait to see you grow!
          </h3>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#4a5568',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            For any queries please reach out to
          </p>
        </div>

        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          {/* Contact Info Cards */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#2d3748',
              marginBottom: '0.5rem'
            }}>
              Contact Information
            </h3>
            <p style={{
              color: '#4a5568',
              fontSize: '1rem',
              marginBottom: '1rem'
            }}>
              Reach out to us through any of these channels
            </p>

            {contactInfo.map((item, index) => (
              <div key={index} style={{
                background: 'white',
                borderRadius: '16px',
                padding: '1rem',
                border: '2px solid #FFE8DC',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(255, 138, 84, 0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(255, 138, 84, 0.2)';
                e.currentTarget.style.borderColor = '#FFB088';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 138, 84, 0.1)';
                e.currentTarget.style.borderColor = '#FFE8DC';
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '10px',
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
                      fontSize: '0.875rem',
                      color: '#718096',
                      fontWeight: '500'
                    }}>
                      {item.title}
                    </div>
                    <div style={{
                      fontSize: '1rem',
                      color: '#2d3748',
                      fontWeight: '600',
                      marginTop: '0.25rem'
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
            borderRadius: '22px',
            padding: 'clamp(1rem, 2.5vw, 1.5rem)',
            border: '2px solid #FFE8DC',
            boxShadow: '0 8px 30px rgba(255, 138, 84, 0.12)'
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
                  <span>Message sent successfully! We'll get back to you soon.</span>
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
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  color: '#2d3748',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  fontSize: '0.95rem'
                }}>
                  Your Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: focused === 'name' ? '#FFB088' : '#a0aec0',
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
                      padding: '0.75rem 0.75rem 0.75rem 2.75rem',
                      borderRadius: '12px',
                      border: `2px solid ${focused === 'name' ? '#FFB088' : '#FFE8DC'}`,
                      background: focused === 'name' ? '#FFF5F0' : '#ffffff',
                      fontSize: '0.95rem',
                      color: '#2d3748',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box',
                      opacity: isSubmitting ? 0.6 : 1
                    }}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  color: '#2d3748',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  fontSize: '0.95rem'
                }}>
                  Your Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: focused === 'email' ? '#FFB088' : '#a0aec0',
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
                      padding: '0.75rem 0.75rem 0.75rem 2.75rem',
                      borderRadius: '12px',
                      border: `2px solid ${focused === 'email' ? '#FFB088' : '#FFE8DC'}`,
                      background: focused === 'email' ? '#FFF5F0' : '#ffffff',
                      fontSize: '0.95rem',
                      color: '#2d3748',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      boxSizing: 'border-box',
                      opacity: isSubmitting ? 0.6 : 1
                    }}
                  />
                </div>
              </div>

              {/* Message Textarea */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  color: '#2d3748',
                  fontWeight: '600',
                  marginBottom: '0.5rem',
                  fontSize: '0.95rem'
                }}>
                  Your Message
                </label>
                <div style={{ position: 'relative' }}>
                  <MessageSquare size={18} style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '1rem',
                    color: focused === 'message' ? '#FFB088' : '#a0aec0',
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
                      padding: '0.75rem 0.75rem 0.75rem 2.75rem',
                      borderRadius: '12px',
                      border: `2px solid ${focused === 'message' ? '#FFB088' : '#FFE8DC'}`,
                      background: focused === 'message' ? '#FFF5F0' : '#ffffff',
                      fontSize: '0.95rem',
                      color: '#2d3748',
                      outline: 'none',
                      minHeight: '100px',
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
                    : 'linear-gradient(135deg, #FF8A54, #FFB088)',
                  color: 'white',
                  padding: '0.9rem',
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
                  transition: 'all 0.3s ease',
                  opacity: isSubmitting ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 10px 30px rgba(255, 138, 84, 0.32)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 6px 18px rgba(255, 138, 84, 0.2)';
                  }
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send size={20} />
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