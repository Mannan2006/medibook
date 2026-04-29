// src/components/Navbar.jsx - Premium Animated Version
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('/');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const handleLogout = async () => {
    await signOut(auth);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 20,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const navLinks = [
    { to: '/', icon: '🏠', text: 'Home' },
    { to: '/doctors', icon: '👨‍⚕️', text: 'Doctors' },
    { to: '/services', icon: '⭐', text: 'Services' },
    { to: '/about', icon: '📖', text: 'About' },
    { to: '/contact', icon: '📞', text: 'Contact' },
  ];

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 1000,
        background: scrolled 
          ? 'rgba(255, 255, 255, 0.98)' 
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: scrolled ? 'var(--shadow-lg)' : 'none',
        transition: 'all var(--transition-normal)',
        borderBottom: scrolled ? '1px solid rgba(0,0,0,0.05)' : 'none',
      }}
    >
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="logo-wrapper">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <span className="logo-icon">🏥</span>
            <div>
              <span className="logo-text">MediBook</span>
              <span className="logo-badge">Premium</span>
            </div>
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-desktop">
          {navLinks.map((link) => (
            <motion.div
              key={link.to}
              variants={itemVariants}
              className="nav-item-wrapper"
            >
              <Link
                to={link.to}
                className={`nav-link ${activeLink === link.to ? 'active' : ''}`}
              >
                <span className="nav-icon">{link.icon}</span>
                <span>{link.text}</span>
                {activeLink === link.to && (
                  <motion.div
                    className="nav-active-indicator"
                    layoutId="activeNav"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
          
          {user ? (
            <>
              <motion.div variants={itemVariants}>
                <Link to="/book" className="nav-link">
                  <span className="nav-icon">📅</span>
                  <span>Book</span>
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link to="/my-appointments" className="nav-link">
                  <span className="nav-icon">📋</span>
                  <span>My Appointments</span>
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link to="/profile" className="nav-link">
                  <span className="nav-icon">👤</span>
                  <span>Profile</span>
                </Link>
              </motion.div>
              <motion.button
                variants={itemVariants}
                onClick={handleLogout}
                className="nav-logout-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>🚪</span>
                <span>Logout</span>
              </motion.button>
            </>
          ) : (
            <motion.div variants={itemVariants}>
              <Link to="/login" className="nav-login-btn">
                <span>🔑</span>
                <span>Login</span>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className="mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.95 }}
        >
          <span>{isOpen ? '✕' : '☰'}</span>
        </motion.button>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="nav-mobile"
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="nav-mobile-header">
                <span className="logo-icon">🏥</span>
                <span className="logo-text">MediBook</span>
                <button onClick={() => setIsOpen(false)}>✕</button>
              </div>
              <div className="nav-mobile-links">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className="nav-mobile-link"
                  >
                    <span>{link.icon}</span>
                    <span>{link.text}</span>
                    <span className="arrow">→</span>
                  </Link>
                ))}
                {user ? (
                  <>
                    <Link to="/book" onClick={() => setIsOpen(false)} className="nav-mobile-link">
                      <span>📅</span>
                      <span>Book Appointment</span>
                      <span className="arrow">→</span>
                    </Link>
                    <Link to="/my-appointments" onClick={() => setIsOpen(false)} className="nav-mobile-link">
                      <span>📋</span>
                      <span>My Appointments</span>
                      <span className="arrow">→</span>
                    </Link>
                    <Link to="/profile" onClick={() => setIsOpen(false)} className="nav-mobile-link">
                      <span>👤</span>
                      <span>Profile</span>
                      <span className="arrow">→</span>
                    </Link>
                    <button onClick={handleLogout} className="nav-mobile-logout">
                      <span>🚪</span>
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="nav-mobile-login">
                    <span>🔑</span>
                    <span>Login / Register</span>
                    <span className="arrow">→</span>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0.75rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-wrapper {
          text-decoration: none;
        }

        .logo-icon {
          font-size: 1.8rem;
        }

        .logo-text {
          font-size: 1.2rem;
          font-weight: 800;
          background: var(--gradient-primary);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-right: 0.5rem;
        }

        .logo-badge {
          font-size: 0.6rem;
          background: var(--gradient-primary);
          color: white;
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-full);
          font-weight: 600;
        }

        .nav-desktop {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .nav-item-wrapper {
          position: relative;
        }

        .nav-link, .nav-logout-btn, .nav-login-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          text-decoration: none;
          color: var(--gray-700);
          font-weight: 500;
          border-radius: var(--radius-lg);
          transition: all var(--transition-fast);
          position: relative;
          overflow: hidden;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .nav-link:hover, .nav-logout-btn:hover, .nav-login-btn:hover {
          background: var(--gradient-primary);
          color: white;
          transform: translateY(-2px);
        }

        .nav-link.active {
          background: var(--gradient-primary);
          color: white;
        }

        .nav-active-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--primary);
        }

        .nav-login-btn {
          background: var(--gradient-primary);
          color: white;
        }

        .nav-logout-btn {
          color: var(--error);
        }

        .nav-logout-btn:hover {
          background: var(--error);
          color: white;
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
        }

        .nav-mobile {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 280px;
          background: var(--white);
          box-shadow: var(--shadow-2xl);
          z-index: 1001;
          display: flex;
          flex-direction: column;
        }

        .nav-mobile-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          border-bottom: 1px solid var(--gray-200);
          background: var(--gradient-primary);
          color: white;
        }

        .nav-mobile-header button {
          margin-left: auto;
          background: none;
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
        }

        .nav-mobile-links {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem;
        }

        .nav-mobile-link, .nav-mobile-login, .nav-mobile-logout {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          text-decoration: none;
          color: var(--gray-700);
          border-radius: var(--radius-lg);
          transition: all var(--transition-fast);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
        }

        .nav-mobile-link:hover, .nav-mobile-login:hover {
          background: var(--gray-100);
          transform: translateX(5px);
        }

        .nav-mobile-link .arrow, .nav-mobile-login .arrow {
          margin-left: auto;
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .nav-mobile-link:hover .arrow, .nav-mobile-login:hover .arrow {
          opacity: 1;
        }

        .nav-mobile-logout {
          color: var(--error);
          margin-top: auto;
        }

        .nav-mobile-logout:hover {
          background: var(--error);
          color: white;
        }

        @media (max-width: 968px) {
          .nav-desktop {
            display: none;
          }
          .mobile-menu-btn {
            display: block;
          }
          .nav-container {
            padding: 0.75rem 1rem;
          }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;