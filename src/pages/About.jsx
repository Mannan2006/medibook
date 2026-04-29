// src/pages/About.jsx
import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import CountUp from 'react-countup';

const About = () => {
  const [activeTab, setActiveTab] = useState('mission');
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const stats = [
    { value: 50000, label: 'Happy Patients', icon: '😊', suffix: '+' },
    { value: 150, label: 'Expert Doctors', icon: '👨‍⚕️', suffix: '+' },
    { value: 24, label: 'Hour Support', icon: '🕒', suffix: '/7' },
    { value: 98, label: 'Satisfaction Rate', icon: '⭐', suffix: '%' },
    { value: 12, label: 'Years of Excellence', icon: '🏆', suffix: '+' },
    { value: 2500, label: '5-Star Reviews', icon: '📝', suffix: '+' }
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      role: 'Chief Medical Officer',
      specialty: 'Cardiology',
      experience: '15+ years',
      education: 'Harvard Medical School',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      bio: 'Leading cardiologist with expertise in interventional cardiology and heart disease prevention.',
      social: { twitter: '#', linkedin: '#', email: 'sarah@medibook.com' }
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      role: 'Head of Surgery',
      specialty: 'Neurosurgery',
      experience: '20+ years',
      education: 'Johns Hopkins University',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      bio: 'Renowned neurosurgeon specializing in minimally invasive brain and spine surgeries.',
      social: { twitter: '#', linkedin: '#', email: 'michael@medibook.com' }
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      role: 'Pediatric Director',
      specialty: 'Pediatrics',
      experience: '12+ years',
      education: 'Stanford University',
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
      bio: 'Compassionate pediatrician dedicated to children\'s health and developmental care.',
      social: { twitter: '#', linkedin: '#', email: 'emily@medibook.com' }
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      role: 'Research Director',
      specialty: 'Oncology',
      experience: '18+ years',
      education: 'MIT & Harvard',
      image: 'https://randomuser.me/api/portraits/men/4.jpg',
      bio: 'Leading cancer researcher focusing on innovative immunotherapy treatments.',
      social: { twitter: '#', linkedin: '#', email: 'james@medibook.com' }
    }
  ];

  const milestones = [
    { year: 2012, title: 'Company Founded', description: 'MediBook started with a vision to revolutionize healthcare access' },
    { year: 2015, title: 'First 10,000 Patients', description: 'Reached milestone of serving 10,000 happy patients' },
    { year: 2018, title: 'Expanded to 5 Cities', description: 'Opened clinics in major metropolitan areas' },
    { year: 2020, title: 'Telemedicine Launch', description: 'Introduced video consultations during global pandemic' },
    { year: 2022, title: '50,000+ Patients', description: 'Served over 50,000 patients across the country' },
    { year: 2024, title: 'AI Integration', description: 'Launched AI-powered health predictions and recommendations' }
  ];

  const values = [
    {
      icon: '❤️',
      title: 'Patient First',
      description: 'Every decision we make prioritizes patient well-being and satisfaction.'
    },
    {
      icon: '🔬',
      title: 'Medical Excellence',
      description: 'We maintain the highest standards of medical care and continuous learning.'
    },
    {
      icon: '🤝',
      title: 'Trust & Transparency',
      description: 'Building lasting relationships through honest and clear communication.'
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'Embracing cutting-edge technology to improve healthcare delivery.'
    },
    {
      icon: '🌍',
      title: 'Accessibility',
      description: 'Making quality healthcare available to everyone, everywhere.'
    },
    {
      icon: '🤲',
      title: 'Compassion',
      description: 'Treating every patient with empathy, respect, and kindness.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <Helmet>
        <title>About Us - MediBook | Healthcare Excellence Since 2012</title>
        <meta name="description" content="Learn about MediBook's mission to provide quality healthcare, our expert team, company milestones, and commitment to patient care." />
      </Helmet>

      <div className="about-page">
        {/* Hero Section */}
        <section className="about-hero">
          <div className="hero-overlay"></div>
          <div className="hero-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="hero-content"
            >
              <h1>About MediBook</h1>
              <p>Transforming Healthcare Through Innovation and Compassion</p>
              <div className="hero-breadcrumb">
                <Link to="/">Home</Link> / <span>About Us</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="story-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="story-grid"
            >
              <div className="story-content">
                <span className="section-badge">Our Story</span>
                <h2>Revolutionizing Healthcare Access Since 2012</h2>
                <p className="story-text">
                  MediBook was founded with a simple yet powerful vision: to make quality healthcare 
                  accessible to everyone. What started as a small clinic in downtown has now grown 
                  into a comprehensive healthcare platform serving thousands of patients daily.
                </p>
                <p className="story-text">
                  We believe that technology should bridge the gap between patients and healthcare 
                  providers, not create barriers. That's why we've built an intuitive platform that 
                  makes booking appointments, consulting doctors, and managing health records 
                  seamless and stress-free.
                </p>
                <div className="story-stats">
                  <div className="stat">
                    <span className="stat-number">12+</span>
                    <span className="stat-label">Years of Excellence</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">50K+</span>
                    <span className="stat-label">Happy Patients</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">150+</span>
                    <span className="stat-label">Expert Doctors</span>
                  </div>
                </div>
              </div>
              <div className="story-image">
                <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=500" alt="Hospital" />
                <div className="experience-badge">
                  <span>12+ Years</span>
                  <p>of Healthcare Excellence</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision Tabs */}
        <section className="mission-section">
          <div className="container">
            <div className="tabs-container">
              <div className="tabs-header">
                <button 
                  className={`tab-btn ${activeTab === 'mission' ? 'active' : ''}`}
                  onClick={() => setActiveTab('mission')}
                >
                  🎯 Our Mission
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'vision' ? 'active' : ''}`}
                  onClick={() => setActiveTab('vision')}
                >
                  👁️ Our Vision
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'values' ? 'active' : ''}`}
                  onClick={() => setActiveTab('values')}
                >
                  💎 Our Values
                </button>
              </div>
              <div className="tabs-content">
                {activeTab === 'mission' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mission-content"
                  >
                    <h3>Our Mission</h3>
                    <p>To provide accessible, affordable, and high-quality healthcare services to every individual through innovative technology and compassionate care.</p>
                    <div className="mission-points">
                      <div className="point">
                        <span>✓</span>
                        <div>
                          <h4>Accessibility</h4>
                          <p>Making healthcare available to everyone, everywhere</p>
                        </div>
                      </div>
                      <div className="point">
                        <span>✓</span>
                        <div>
                          <h4>Quality Care</h4>
                          <p>Maintaining highest medical standards</p>
                        </div>
                      </div>
                      <div className="point">
                        <span>✓</span>
                        <div>
                          <h4>Innovation</h4>
                          <p>Leveraging technology for better health outcomes</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                {activeTab === 'vision' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="vision-content"
                  >
                    <h3>Our Vision</h3>
                    <p>To become the world's most trusted healthcare ecosystem, empowering millions to live healthier lives through seamless digital health experiences.</p>
                    <div className="vision-goals">
                      <div className="goal">
                        <span>🌍</span>
                        <p>Global healthcare access by 2030</p>
                      </div>
                      <div className="goal">
                        <span>🤖</span>
                        <p>AI-powered personalized medicine</p>
                      </div>
                      <div className="goal">
                        <span>🏥</span>
                        <p>1 million+ happy patients</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                {activeTab === 'values' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="values-grid"
                  >
                    {values.map((value, index) => (
                      <div key={index} className="value-card">
                        <div className="value-icon">{value.icon}</div>
                        <h4>{value.title}</h4>
                        <p>{value.description}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="stats-section" ref={ref}>
          <div className="container">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={controls}
              className="stats-grid"
            >
              {stats.map((stat, index) => (
                <motion.div key={index} variants={itemVariants} className="stat-card">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-number">
                    {inView && <CountUp end={stat.value} duration={2.5} />}
                    {stat.suffix}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Leadership Team</span>
              <h2>Meet Our Expert Doctors</h2>
              <p>World-class medical professionals dedicated to your health</p>
            </div>
            <div className="team-grid">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  className="team-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="team-image">
                    <img src={member.image} alt={member.name} />
                    <div className="team-overlay">
                      <div className="social-links">
                        <a href={member.social.twitter}>🐦</a>
                        <a href={member.social.linkedin}>🔗</a>
                        <a href={`mailto:${member.social.email}`}>✉️</a>
                      </div>
                    </div>
                  </div>
                  <div className="team-info">
                    <h3>{member.name}</h3>
                    <p className="role">{member.role}</p>
                    <p className="specialty">{member.specialty}</p>
                    <div className="team-details">
                      <span>📅 {member.experience}</span>
                      <span>🎓 {member.education}</span>
                    </div>
                    <p className="bio">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Milestones Timeline */}
        <section className="milestones-section">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Our Journey</span>
              <h2>Company Milestones</h2>
              <p>Celebrating our journey of growth and excellence</p>
            </div>
            <div className="timeline">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-year">{milestone.year}</div>
                    <h3>{milestone.title}</h3>
                    <p>{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="why-choose-section">
          <div className="container">
            <div className="why-choose-grid">
              <div className="why-choose-content">
                <span className="section-badge">Why Choose Us</span>
                <h2>Why Patients Trust MediBook</h2>
                <div className="features-list">
                  <div className="feature">
                    <div className="feature-icon">🏆</div>
                    <div>
                      <h4>Best-in-Class Doctors</h4>
                      <p>Hand-picked specialists with years of experience</p>
                    </div>
                  </div>
                  <div className="feature">
                    <div className="feature-icon">💳</div>
                    <div>
                      <h4>Affordable Pricing</h4>
                      <p>Quality healthcare at competitive rates</p>
                    </div>
                  </div>
                  <div className="feature">
                    <div className="feature-icon">📱</div>
                    <div>
                      <h4>Seamless Experience</h4>
                      <p>Easy booking, reminders, and digital records</p>
                    </div>
                  </div>
                  <div className="feature">
                    <div className="feature-icon">🔒</div>
                    <div>
                      <h4>Secure & Private</h4>
                      <p>HIPAA compliant platform with data protection</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="why-choose-image">
                <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500" alt="Doctor with patient" />
                <div className="rating-badge">
                  <span>⭐ 4.9</span>
                  <p>Patient Rating</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="cta-content"
            >
              <h2>Join Our Healthcare Family</h2>
              <p>Experience the best medical care with India's most trusted healthcare platform</p>
              <div className="cta-buttons">
                <Link to="/register" className="cta-primary">Get Started Today</Link>
                <Link to="/contact" className="cta-secondary">Contact Us</Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <style>{`
        .about-page {
          min-height: 100vh;
          background: #ffffff;
        }

        /* Hero Section */
        .about-hero {
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 4rem 2rem;
          text-align: center;
          overflow: hidden;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%);
        }

        .hero-container {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-content h1 {
          font-size: 3rem;
          color: white;
          margin-bottom: 1rem;
        }

        .hero-content p {
          font-size: 1.2rem;
          color: rgba(255,255,255,0.9);
          margin-bottom: 1rem;
        }

        .hero-breadcrumb {
          color: rgba(255,255,255,0.8);
        }

        .hero-breadcrumb a {
          color: white;
          text-decoration: none;
        }

        /* Story Section */
        .story-section {
          padding: 5rem 2rem;
          background: #f7fafc;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .section-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.25rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .story-content h2 {
          font-size: 2rem;
          color: #2d3748;
          margin-bottom: 1.5rem;
        }

        .story-text {
          color: #4a5568;
          line-height: 1.8;
          margin-bottom: 1rem;
        }

        .story-stats {
          display: flex;
          gap: 2rem;
          margin-top: 2rem;
        }

        .story-stats .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
          color: #667eea;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #718096;
        }

        .story-image {
          position: relative;
        }

        .story-image img {
          width: 100%;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        .experience-badge {
          position: absolute;
          bottom: -20px;
          right: -20px;
          background: white;
          padding: 1rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          text-align: center;
        }

        .experience-badge span {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
          color: #667eea;
        }

        /* Mission Section */
        .mission-section {
          padding: 5rem 2rem;
          background: white;
        }

        .tabs-container {
          max-width: 900px;
          margin: 0 auto;
        }

        .tabs-header {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .tab-btn {
          padding: 0.75rem 1.5rem;
          background: #f7fafc;
          border: none;
          border-radius: 40px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .mission-content h3, .vision-content h3 {
          text-align: center;
          font-size: 1.8rem;
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .mission-content > p, .vision-content > p {
          text-align: center;
          color: #4a5568;
          margin-bottom: 2rem;
        }

        .mission-points {
          display: grid;
          gap: 1.5rem;
        }

        .point {
          display: flex;
          gap: 1rem;
        }

        .point span {
          width: 30px;
          height: 30px;
          background: #48bb78;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .vision-goals {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .goal {
          text-align: center;
          padding: 1.5rem;
          background: #f7fafc;
          border-radius: 12px;
        }

        .goal span {
          font-size: 2rem;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .value-card {
          text-align: center;
          padding: 1.5rem;
          background: #f7fafc;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .value-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .value-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        /* Stats Section */
        .stats-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 5rem 2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 2rem;
        }

        .stat-card {
          text-align: center;
          color: white;
        }

        .stat-icon {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        /* Team Section */
        .team-section {
          padding: 5rem 2rem;
          background: #f7fafc;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-size: 2rem;
          margin-top: 0.5rem;
          color: #2d3748;
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .team-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .team-image {
          position: relative;
          overflow: hidden;
          height: 300px;
        }

        .team-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .team-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .team-card:hover .team-overlay {
          opacity: 1;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-links a {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-size: 1.2rem;
        }

        .team-info {
          padding: 1.5rem;
        }

        .team-info h3 {
          font-size: 1.2rem;
          margin-bottom: 0.25rem;
          color: #2d3748;
        }

        .role {
          color: #667eea;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .specialty {
          color: #718096;
          margin-bottom: 0.5rem;
        }

        .team-details {
          display: flex;
          gap: 1rem;
          margin: 0.5rem 0;
          font-size: 0.875rem;
          color: #718096;
        }

        .bio {
          margin-top: 0.5rem;
          color: #4a5568;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        /* Milestones Timeline */
        .milestones-section {
          padding: 5rem 2rem;
          background: white;
        }

        .timeline {
          position: relative;
          max-width: 800px;
          margin: 2rem auto;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 50%;
          width: 2px;
          height: 100%;
          background: #e2e8f0;
        }

        .timeline-item {
          position: relative;
          margin: 2rem 0;
        }

        .timeline-item.left {
          padding-right: 50%;
        }

        .timeline-item.right {
          padding-left: 50%;
        }

        .timeline-dot {
          position: absolute;
          width: 16px;
          height: 16px;
          background: #667eea;
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
        }

        .timeline-item.left .timeline-dot {
          right: -8px;
        }

        .timeline-item.right .timeline-dot {
          left: -8px;
        }

        .timeline-content {
          background: #f7fafc;
          padding: 1.5rem;
          border-radius: 12px;
        }

        .timeline-year {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        /* Why Choose Section */
        .why-choose-section {
          padding: 5rem 2rem;
          background: #f7fafc;
        }

        .why-choose-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .why-choose-content h2 {
          font-size: 2rem;
          margin-bottom: 2rem;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .feature {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .feature-icon {
          font-size: 2rem;
        }

        .why-choose-image {
          position: relative;
        }

        .why-choose-image img {
          width: 100%;
          border-radius: 16px;
        }

        .rating-badge {
          position: absolute;
          bottom: -20px;
          left: 20px;
          background: white;
          padding: 1rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .rating-badge span {
          font-size: 1.2rem;
          font-weight: bold;
          color: #fbbf24;
        }

        /* CTA Section */
        .cta-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 5rem 2rem;
          text-align: center;
        }

        .cta-content h2 {
          font-size: 2rem;
          color: white;
          margin-bottom: 1rem;
        }

        .cta-content p {
          color: rgba(255,255,255,0.9);
          margin-bottom: 2rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .cta-primary, .cta-secondary {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
        }

        .cta-primary {
          background: white;
          color: #667eea;
        }

        .cta-secondary {
          border: 2px solid white;
          color: white;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .story-grid,
          .why-choose-grid {
            grid-template-columns: 1fr;
          }
          
          .timeline::before {
            left: 0;
          }
          
          .timeline-item.left,
          .timeline-item.right {
            padding-left: 2rem;
            padding-right: 0;
          }
          
          .timeline-item.left .timeline-dot,
          .timeline-item.right .timeline-dot {
            left: -8px;
          }
          
          .hero-content h1 {
            font-size: 2rem;
          }
          
          .cta-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
};

export default About;