import React from 'react';

const Features = () => {
  const styles = {
    section: {
      padding: '6rem 1.5rem',
      backgroundColor: '#fff',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '4rem',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '800',
      color: '#1a202c',
      marginBottom: '1rem',
    },
    subtitle: {
      fontSize: '1.25rem',
      color: '#4a5568',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: '1.6',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      padding: '2rem 0',
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '1rem',
      padding: '2rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s ease',
      ':hover': {
        transform: 'translateY(-5px)',
      },
    },
    icon: {
      width: '48px',
      height: '48px',
      marginBottom: '1rem',
      padding: '0.75rem',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #FF6B6B20, #FFB08820)',
    },
    featureTitle: {
      fontSize: '1.25rem',
      fontWeight: '700',
      color: '#2d3748',
      marginBottom: '0.75rem',
    },
    description: {
      color: '#4a5568',
      lineHeight: '1.6',
    },
  };

  const features = [
    {
      icon: "🎯",
      title: "Personalized Learning",
      description: "Adaptive learning paths tailored to your skill level and goals."
    },
    {
      icon: "🤖",
      title: "AI-Powered Support",
      description: "24/7 intelligent assistance to help you learn and solve problems."
    },
    {
      icon: "💻",
      title: "Real-World Projects",
      description: "Hands-on experience with industry-relevant projects and case studies."
    },
    {
      icon: "🎓",
      title: "Expert Mentorship",
      description: "Learn from industry professionals with years of experience."
    },
    {
      icon: "📈",
      title: "Progress Tracking",
      description: "Detailed analytics and insights to monitor your learning journey."
    },
    {
      icon: "🏆",
      title: "Certifications",
      description: "Earn recognized certificates upon completing courses and projects."
    }
  ];

  return (
    <section id="features" style={styles.section}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h2 style={styles.title}>Why Choose SkillKoder?</h2>
          <p style={styles.subtitle}>
            Discover the features that make our platform the best choice for your coding journey
          </p>
        </header>

        <div style={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.icon}>{feature.icon}</div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.description}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;