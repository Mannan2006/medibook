// src/components/Footer.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Footer = () => {
  const navigate = useNavigate();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast.error('Please enter your email address');
      return;
    }
    
    setIsSubscribing(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Successfully subscribed to newsletter!');
      toast.success(`Check your inbox at ${newsletterEmail}`);
      setNewsletterEmail('');
      setIsSubscribing(false);
    }, 1000);
  };

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'Contact', path: '/contact' },
  ];

  const services = [
    { name: 'General Medicine', path: '/services' },
    { name: 'Cardiology', path: '/services' },
    { name: 'Neurology', path: '/services' },
    { name: 'Dentistry', path: '/services' },
    { name: 'Pediatrics', path: '/services' },
    { name: 'Orthopedics', path: '/services' },
  ];

  const patientResources = [
    { name: 'Book Appointment', path: '/book' },
    { name: 'My Appointments', path: '/my-appointments' },
    { name: 'Medical Records', path: '/profile' },
    { name: 'Insurance Info', path: '/profile' },
    { name: 'FAQs', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
  ];

  const contactInfo = [
    { icon: '📍', text: '123 Healthcare Ave, New York, NY 10001', link: null },
    { icon: '📞', text: '+1 (800) 123-4567', link: 'tel:+18001234567' },
    { icon: '✉️', text: 'support@medibook.com', link: 'mailto:support@medibook.com' },
    { icon: '🕒', text: '24/7 Emergency Support', link: null },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: 'https://facebook.com', color: '#1877f2' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com', color: '#1da1f2' },
    { name: 'Instagram', icon: '📸', url: 'https://instagram.com', color: '#e4405f' },
    { name: 'LinkedIn', icon: '🔗', url: 'https://linkedin.com', color: '#0077b5' },
    { name: 'YouTube', icon: '📺', url: 'https://youtube.com', color: '#ff0000' },
  ];

  const appLinks = [
    { name: 'App Store', icon: '📱', url: '#' },
    { name: 'Google Play', icon: '🤖', url: '#' },
  ];

  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="footer-premium">
      {/* Main Footer */}
      <div className="footer-main">
        <div className="footer-container">
          <motion.div 
            className="footer-grid"
            variants={footerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Company Info */}
            <motion.div className="footer-section" variants={itemVariants}>
              <div className="footer-logo">
                <span className="logo-icon">🏥</span>
                <span className="logo-text">MediBook</span>
              </div>
              <p className="footer-description">
                Your trusted healthcare partner. Book appointments with top doctors, 
                access medical records, and manage your health seamlessly.
              </p>
              <div className="footer-trust-badge">
                <span className="trust-icon">⭐</span>
                <span>Trusted by 50,000+ patients</span>
              </div>
              <div className="footer-rating">
                <div className="rating-stars">
                  ★★★★★
                </div>
                <span>4.9/5 from 2,500+ reviews</span>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div className="footer-section" variants={itemVariants}>
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link to={link.path} className="footer-link">
                      <span className="link-arrow">→</span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Our Services */}
            <motion.div className="footer-section" variants={itemVariants}>
              <h3 className="footer-title">Our Services</h3>
              <ul className="footer-links">
                {services.map((service, index) => (
                  <li key={index}>
                    <Link to={service.path} className="footer-link">
                      <span className="link-arrow">→</span>
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Patient Resources */}
            <motion.div className="footer-section" variants={itemVariants}>
              <h3 className="footer-title">Patient Resources</h3>
              <ul className="footer-links">
                {patientResources.map((resource, index) => (
                  <li key={index}>
                    <Link to={resource.path} className="footer-link">
                      <span className="link-arrow">→</span>
                      {resource.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Information */}
            <motion.div className="footer-section" variants={itemVariants}>
              <h3 className="footer-title">Contact Us</h3>
              <ul className="contact-list">
                {contactInfo.map((info, index) => (
                  <li key={index}>
                    <span className="contact-icon">{info.icon}</span>
                    {info.link ? (
                      <a href={info.link} className="contact-link">{info.text}</a>
                    ) : (
                      <span className="contact-text">{info.text}</span>
                    )}
                  </li>
                ))}
              </ul>
              
              {/* Social Links */}
              <div className="social-section">
                <h4 className="social-title">Follow Us</h4>
                <div className="social-links">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                      style={{ '--social-color': social.color }}
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="social-icon">{social.icon}</span>
                      <span className="social-name">{social.name}</span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Newsletter Subscription */}
            <motion.div className="footer-section" variants={itemVariants}>
              <h3 className="footer-title">Newsletter</h3>
              <p className="newsletter-text">
                Subscribe to get health tips, medical updates, and exclusive offers.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                <div className="newsletter-input-group">
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="newsletter-input"
                    required
                  />
                  <button 
                    type="submit" 
                    className="newsletter-btn"
                    disabled={isSubscribing}
                  >
                    {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
              </form>
              <p className="newsletter-note">
                No spam, unsubscribe anytime.
              </p>

              {/* App Downloads */}
              <div className="app-downloads">
                <h4 className="app-title">Download App</h4>
                <div className="app-buttons">
                  {appLinks.map((app, index) => (
                    <a key={index} href={app.url} className="app-btn">
                      <span className="app-icon">{app.icon}</span>
                      <span className="app-text">{app.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="bottom-content">
            <div className="copyright">
              <p>© {currentYear} MediBook. All rights reserved.</p>
            </div>
            
            <div className="footer-legal">
              <Link to="/privacy" className="legal-link">Privacy Policy</Link>
              <Link to="/terms" className="legal-link">Terms of Service</Link>
              <Link to="/cookies" className="legal-link">Cookie Policy</Link>
              <Link to="/accessibility" className="legal-link">Accessibility</Link>
            </div>

            <div className="payment-methods">
              <span className="payment-text">Secure Payments:</span>
              <div className="payment-icons">
                <span className="payment-icon">💳</span>
                <span className="payment-icon">🔒</span>
                <span className="payment-icon">🏦</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ↑
      </motion.button>

      <style>{`
        .footer-premium {
          background: var(--gray-800);
          color: var(--gray-300);
          position: relative;
          margin-top: auto;
        }

        .footer-main {
          padding: 60px 20px 40px;
          border-bottom: 1px solid var(--gray-700);
        }

        .footer-container {
          max-width: var(--container-2xl);
          margin: 0 auto;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 40px;
        }

        /* Footer Logo */
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .logo-icon {
          font-size: 2rem;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 800;
          background: var(--gradient-primary);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .footer-description {
          color: var(--gray-400);
          line-height: 1.6;
          margin-bottom: 20px;
          font-size: 0.875rem;
        }

        .footer-trust-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--gray-700);
          padding: 6px 12px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          margin-bottom: 12px;
        }

        .trust-icon {
          font-size: 0.875rem;
        }

        .footer-rating {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .rating-stars {
          color: #fbbf24;
          font-size: 0.875rem;
        }

        /* Footer Titles */
        .footer-title {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: 20px;
          color: white;
          position: relative;
          padding-bottom: 10px;
        }

        .footer-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 3px;
          background: var(--gradient-primary);
          border-radius: var(--radius-full);
        }

        /* Footer Links */
        .footer-links {
          list-style: none;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-link {
          color: var(--gray-400);
          text-decoration: none;
          transition: all var(--transition-fast);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .footer-link:hover {
          color: var(--primary-500);
          transform: translateX(5px);
        }

        .link-arrow {
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .footer-link:hover .link-arrow {
          opacity: 1;
        }

        /* Contact List */
        .contact-list {
          list-style: none;
          padding: 0;
        }

        .contact-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          font-size: 0.875rem;
        }

        .contact-icon {
          font-size: 1.125rem;
          min-width: 24px;
        }

        .contact-link {
          color: var(--gray-400);
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .contact-link:hover {
          color: var(--primary-500);
        }

        .contact-text {
          color: var(--gray-400);
        }

        /* Social Section */
        .social-section {
          margin-top: 24px;
        }

        .social-title {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 12px;
          color: white;
        }

        .social-links {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .social-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: var(--gray-700);
          border-radius: var(--radius-full);
          color: var(--gray-300);
          text-decoration: none;
          transition: all var(--transition-fast);
          font-size: 0.75rem;
        }

        .social-link:hover {
          background: var(--social-color);
          color: white;
          transform: translateY(-2px);
        }

        .social-icon {
          font-size: 0.875rem;
        }

        .social-name {
          font-weight: 500;
        }

        /* Newsletter */
        .newsletter-text {
          font-size: 0.875rem;
          color: var(--gray-400);
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .newsletter-form {
          margin-bottom: 12px;
        }

        .newsletter-input-group {
          display: flex;
          gap: 8px;
        }

        .newsletter-input {
          flex: 1;
          padding: 10px 12px;
          background: var(--gray-700);
          border: 1px solid var(--gray-600);
          border-radius: var(--radius-lg);
          color: white;
          font-size: 0.875rem;
          transition: all var(--transition-fast);
        }

        .newsletter-input:focus {
          outline: none;
          border-color: var(--primary-500);
        }

        .newsletter-input::placeholder {
          color: var(--gray-500);
        }

        .newsletter-btn {
          padding: 10px 20px;
          background: var(--gradient-primary);
          color: white;
          border: none;
          border-radius: var(--radius-lg);
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-fast);
          white-space: nowrap;
        }

        .newsletter-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .newsletter-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .newsletter-note {
          font-size: 0.7rem;
          color: var(--gray-500);
        }

        /* App Downloads */
        .app-downloads {
          margin-top: 24px;
        }

        .app-title {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 12px;
          color: white;
        }

        .app-buttons {
          display: flex;
          gap: 12px;
        }

        .app-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--gray-700);
          border-radius: var(--radius-lg);
          color: var(--gray-300);
          text-decoration: none;
          transition: all var(--transition-fast);
          font-size: 0.75rem;
        }

        .app-btn:hover {
          background: var(--gray-600);
          transform: translateY(-2px);
        }

        .app-icon {
          font-size: 1rem;
        }

        /* Footer Bottom */
        .footer-bottom {
          padding: 20px;
          background: var(--gray-900);
        }

        .bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }

        .copyright {
          font-size: 0.75rem;
          color: var(--gray-500);
        }

        .footer-legal {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }

        .legal-link {
          color: var(--gray-500);
          text-decoration: none;
          font-size: 0.75rem;
          transition: color var(--transition-fast);
        }

        .legal-link:hover {
          color: var(--primary-500);
        }

        .payment-methods {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .payment-text {
          font-size: 0.75rem;
          color: var(--gray-500);
        }

        .payment-icons {
          display: flex;
          gap: 8px;
        }

        .payment-icon {
          font-size: 1.125rem;
          cursor: pointer;
          transition: transform var(--transition-fast);
        }

        .payment-icon:hover {
          transform: scale(1.1);
        }

        /* Back to Top Button */
        .back-to-top {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 50px;
          height: 50px;
          background: var(--gradient-primary);
          color: white;
          border: none;
          border-radius: var(--radius-full);
          font-size: 1.5rem;
          cursor: pointer;
          box-shadow: var(--shadow-lg);
          z-index: var(--z-fixed);
          transition: all var(--transition-fast);
        }

        .back-to-top:hover {
          transform: scale(1.1);
          box-shadow: var(--shadow-xl);
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .bottom-content {
            flex-direction: column;
            text-align: center;
          }

          .footer-legal {
            justify-content: center;
          }

          .payment-methods {
            justify-content: center;
          }

          .newsletter-input-group {
            flex-direction: column;
          }

          .newsletter-btn {
            width: 100%;
          }

          .app-buttons {
            justify-content: center;
          }

          .social-links {
            justify-content: center;
          }

          .back-to-top {
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            font-size: 1.2rem;
          }
        }

        @media (max-width: 480px) {
          .footer-main {
            padding: 40px 16px 30px;
          }

          .footer-legal {
            gap: 12px;
          }

          .legal-link {
            font-size: 0.7rem;
          }
        }

        /* Animation Classes */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .footer-section {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </footer>
  );
};

export default Footer;