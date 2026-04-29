// src/pages/Home.jsx - Premium Animated Version
import React from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const { user } = useAuth();
  const heroRef = React.useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, type: 'spring', stiffness: 100 } }
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const services = [
    { icon: '👨‍⚕️', name: 'General Medicine', desc: 'Comprehensive primary care', color: '#667eea', delay: 0 },
    { icon: '❤️', name: 'Cardiology', desc: 'Expert heart care', color: '#f56565', delay: 0.1 },
    { icon: '🧠', name: 'Neurology', desc: 'Brain & nervous system', color: '#48bb78', delay: 0.2 },
    { icon: '🦷', name: 'Dentistry', desc: 'Complete dental care', color: '#ed8936', delay: 0.3 },
    { icon: '👶', name: 'Pediatrics', desc: 'Child healthcare', color: '#9f7aea', delay: 0.4 },
    { icon: '🦴', name: 'Orthopedics', desc: 'Bone & joint care', color: '#4299e1', delay: 0.5 },
  ];

  return (
    <>
      <Helmet>
        <title>MediBook - Premium Healthcare Appointment System</title>
      </Helmet>

      {/* Hero Section */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-particles">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="particle"
                initial={{ x: Math.random() * 100 + '%', y: Math.random() * 100 + '%' }}
                animate={{ y: ['-100%', '200%'], opacity: [0, 1, 0] }}
                transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: Math.random() * 5 }}
              />
            ))}
          </div>
        </div>

        <div className="hero-container">
          <motion.div
            initial="hidden"
            animate={isHeroInView ? "visible" : "hidden"}
            variants={fadeUpVariants}
            className="hero-content"
          >
            <motion.div 
              className="hero-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
            >
              ⭐ Trusted by 50,000+ Patients
            </motion.div>
            
            <motion.h1 className="hero-title">
              Your Health, Our
              <span className="gradient-text"> Priority</span>
            </motion.h1>
            
            <motion.p className="hero-subtitle">
              Experience premium healthcare with instant appointments, expert doctors, 
              and seamless digital experience. Your wellness journey starts here.
            </motion.p>
            
            <motion.div 
              className="hero-buttons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {user ? (
                <Link to="/book" className="btn-primary">
                  <span>📅</span> Book Appointment
                </Link>
              ) : (
                <Link to="/register" className="btn-primary">
                  <span>🎉</span> Get Started Free
                </Link>
              )}
              <Link to="/doctors" className="btn-secondary">
                <span>👨‍⚕️</span> Find Doctors
              </Link>
            </motion.div>

            <motion.div 
              className="hero-stats"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Happy Patients</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">150+</div>
                <div className="stat-label">Expert Doctors</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Online Support</div>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <div className="stat-number">4.9⭐</div>
                <div className="stat-label">Patient Rating</div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="hero-wave">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 32L60 37.3C120 43 240 53 360 58.7C480 64 600 64 720 58.7C840 53 960 43 1080 37.3C1200 32 1320 32 1380 32L1440 32V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V32Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <span className="section-badge">Our Services</span>
            <h2>Comprehensive Medical Care</h2>
            <p>We provide top-quality healthcare services with modern technology</p>
          </motion.div>

          <motion.div
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="services-grid"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={fadeUpVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="service-card"
                style={{ '--service-color': service.color }}
              >
                <div className="service-icon-wrapper">
                  <div className="service-icon-bg" style={{ background: service.color }}>
                    <span className="service-icon">{service.icon}</span>
                  </div>
                </div>
                <h3>{service.name}</h3>
                <p>{service.desc}</p>
                <Link to="/book" className="service-link">
                  Learn More <span>→</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="features-content"
            >
              <span className="section-badge">Why Choose Us</span>
              <h2>Why Patients Trust MediBook</h2>
              <p>We combine medical expertise with cutting-edge technology to provide the best healthcare experience.</p>
              
              <div className="features-list">
                {[
                  { icon: '⚡', title: 'Instant Booking', desc: 'Schedule appointments in seconds' },
                  { icon: '🛡️', title: 'Secure & Private', desc: 'HIPAA compliant platform' },
                  { icon: '💰', title: 'Best Prices', desc: 'Affordable healthcare for all' },
                  { icon: '🎥', title: 'Video Consultations', desc: 'Connect from anywhere' },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    className="feature-item"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="feature-icon">{feature.icon}</div>
                    <div className="feature-info">
                      <h4>{feature.title}</h4>
                      <p>{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="features-image"
            >
              <div className="image-card">
                <div className="image-glow"></div>
                <div className="image-placeholder">
                  <span>🏥</span>
                  <div className="floating-badge badge-1">⭐ 4.9 Rating</div>
                  <div className="floating-badge badge-2">👥 50K+ Patients</div>
                  <div className="floating-badge badge-3">🏆 Award Winning</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            viewport={{ once: true }}
            className="cta-card"
          >
            <div className="cta-glow"></div>
            <h2>Ready to Transform Your Healthcare Journey?</h2>
            <p>Join thousands of satisfied patients who trust MediBook for their health needs</p>
            {!user && (
              <Link to="/register" className="btn-primary">
                <span>🎉</span> Create Free Account
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      <style>{`
        .hero-section {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        .hero-gradient {
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%);
          animation: rotate-slow 20s linear infinite;
        }

        .hero-particles {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(255,255,255,0.5);
          border-radius: 50%;
        }

        .hero-container {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          text-align: center;
          color: white;
        }

        .hero-badge {
          display: inline-block;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          margin-bottom: 1.5rem;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .gradient-text {
          background: linear-gradient(135deg, #ffd89b, #c7e9fb);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 3rem;
        }

        .btn-primary, .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.8rem;
          border-radius: var(--radius-full);
          font-weight: 600;
          text-decoration: none;
          transition: all var(--transition-normal);
          cursor: pointer;
        }

        .btn-primary {
          background: white;
          color: #667eea;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-xl);
        }

        .btn-secondary {
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(10px);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
        }

        .btn-secondary:hover {
          background: white;
          color: #667eea;
          transform: translateY(-3px);
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          align-items: center;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 1.8rem;
          font-weight: 700;
        }

        .stat-label {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        .stat-divider {
          width: 1px;
          height: 30px;
          background: rgba(255,255,255,0.3);
        }

        .hero-wave {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          line-height: 0;
        }

        .services-section {
          padding: 5rem 2rem;
          background: white;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-badge {
          display: inline-block;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 0.25rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .section-header h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: var(--gray-800);
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .service-card {
          background: var(--white);
          padding: 2rem;
          border-radius: var(--radius-xl);
          text-align: center;
          transition: all var(--transition-normal);
          box-shadow: var(--shadow-md);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .service-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: var(--service-color);
          transform: scaleX(0);
          transition: transform var(--transition-normal);
        }

        .service-card:hover::before {
          transform: scaleX(1);
        }

        .service-icon-wrapper {
          margin-bottom: 1.5rem;
        }

        .service-icon-bg {
          width: 70px;
          height: 70px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .service-icon {
          font-size: 2rem;
        }

        .service-card h3 {
          margin-bottom: 0.5rem;
        }

        .service-card p {
          color: var(--gray-600);
          margin-bottom: 1rem;
        }

        .service-link {
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
        }

        .service-link span {
          transition: transform var(--transition-fast);
          display: inline-block;
        }

        .service-link:hover span {
          transform: translateX(5px);
        }

        .features-section {
          padding: 5rem 2rem;
          background: var(--gray-100);
        }

        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .features-content h2 {
          font-size: 2rem;
          margin: 1rem 0;
        }

        .features-list {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .feature-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .feature-icon {
          width: 50px;
          height: 50px;
          background: white;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          box-shadow: var(--shadow-md);
        }

        .features-image {
          position: relative;
        }

        .image-card {
          position: relative;
          background: var(--gradient-primary);
          border-radius: var(--radius-2xl);
          padding: 3rem;
          text-align: center;
          overflow: hidden;
        }

        .image-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .image-placeholder {
          position: relative;
          z-index: 1;
          font-size: 5rem;
        }

        .floating-badge {
          position: absolute;
          background: white;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--gray-800);
          white-space: nowrap;
          box-shadow: var(--shadow-lg);
        }

        .badge-1 {
          top: -20px;
          right: -20px;
        }

        .badge-2 {
          bottom: -20px;
          left: -20px;
        }

        .badge-3 {
          bottom: 50%;
          right: -30px;
        }

        .cta-section {
          padding: 5rem 2rem;
          background: var(--gradient-dark);
        }

        .cta-card {
          position: relative;
          background: var(--gradient-primary);
          border-radius: var(--radius-2xl);
          padding: 4rem;
          text-align: center;
          color: white;
          overflow: hidden;
        }

        .cta-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 30% 50%, rgba(255,255,255,0.2) 0%, transparent 50%);
        }

        .cta-card h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          position: relative;
          z-index: 1;
        }

        .cta-card p {
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
        }

        .cta-card .btn-primary {
          background: white;
          color: var(--primary);
          position: relative;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
          .features-grid {
            grid-template-columns: 1fr;
          }
          .hero-stats {
            flex-wrap: wrap;
          }
          .stat-divider {
            display: none;
          }
          .floating-badge {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Home;