// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  sendEmailVerification
} from 'firebase/auth';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
  FaApple,
  FaArrowRight,
  FaShieldAlt,
  FaUserCheck,
  FaClock,
  FaHeartbeat,
  FaStethoscope,
  FaAmbulance,
  FaHospitalUser,
  FaPhoneAlt,
  FaEnvelopeOpenText,
  FaCheckCircle,
  FaSpinner
} from 'react-icons/fa';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Floating particles animation
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 10 + Math.random() * 20,
    delay: Math.random() * 5
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (loginAttempts >= 5) {
      toast.error('Too many failed attempts. Please try again later.');
      return;
    }

    setLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if email is verified (optional - uncomment if you want email verification)
      // if (!user.emailVerified) {
      //   await sendEmailVerification(user);
      //   toast.error('Please verify your email before logging in. Check your inbox!');
      //   setLoading(false);
      //   return;
      // }
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userEmail', email);
      }
      
      toast.success(`Welcome back! ${user.displayName || 'Patient'}`);
      
      // Redirect to intended page or home
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      
    } catch (error) {
      setLoginAttempts(prev => prev + 1);
      
      let errorMessage = 'Login failed. Please try again.';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please register first.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password. Please try again.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        default:
          errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success(`Welcome ${result.user.displayName}!`);
      navigate('/');
    } catch (error) {
      toast.error('Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success(`Welcome ${result.user.displayName}!`);
      navigate('/');
    } catch (error) {
      toast.error('Facebook login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      toast.error('Please enter your email address');
      return;
    }
    
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success('Password reset email sent! Check your inbox.');
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  // Load saved email if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // Demo credentials for testing
  const demoCredentials = {
    email: 'demo@medibook.com',
    password: 'demo123456'
  };

  const fillDemoCredentials = () => {
    setEmail(demoCredentials.email);
    setPassword(demoCredentials.password);
    toast.success('Demo credentials filled! Click login to continue.');
  };

  return (
    <>
      <Helmet>
        <title>Login - MediBook | Secure Healthcare Portal</title>
        <meta name="description" content="Login to your MediBook account to manage appointments, access health records, and connect with doctors." />
      </Helmet>

      <div className="login-premium">
        {/* Animated Background */}
        <div className="animated-bg">
          <div className="gradient-bg"></div>
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="particle"
              initial={{ x: particle.x + '%', y: particle.y + '%' }}
              animate={{
                y: [particle.y + '%', (particle.y + 20) + '%', particle.y + '%'],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay
              }}
            />
          ))}
        </div>

        {/* Healthcare Icons Decoration */}
        <div className="health-icons">
          <motion.div 
            className="icon-float icon-1"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <FaHeartbeat />
          </motion.div>
          <motion.div 
            className="icon-float icon-2"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          >
            <FaStethoscope />
          </motion.div>
          <motion.div 
            className="icon-float icon-3"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 2 }}
          >
            <FaAmbulance />
          </motion.div>
          <motion.div 
            className="icon-float icon-4"
            animate={{ y: [0, 25, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, delay: 0.5 }}
          >
            <FaHospitalUser />
          </motion.div>
        </div>

        <div className="login-container">
          <motion.div 
            className="login-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Left Side - Form */}
            <div className="login-form-side">
              <motion.div 
                className="brand-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="logo">
                  <span className="logo-icon">🏥</span>
                  <span className="logo-text">MediBook</span>
                </div>
                <div className="verified-badge">
                  <FaShieldAlt /> HIPAA Compliant
                </div>
              </motion.div>

              <motion.div 
                className="welcome-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h1>Welcome Back</h1>
                <p>Access your medical dashboard and manage appointments</p>
              </motion.div>

              <AnimatePresence mode="wait">
                {!showForgotPassword ? (
                  <motion.form 
                    key="login-form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="input-group">
                      <FaEnvelope className="input-icon" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                      />
                    </div>

                    <div className="input-group">
                      <FaLock className="input-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>

                    <div className="form-options">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <span>Remember me</span>
                      </label>
                      <button
                        type="button"
                        className="forgot-password"
                        onClick={() => setShowForgotPassword(true)}
                      >
                        Forgot Password?
                      </button>
                    </div>

                    <motion.button
                      type="submit"
                      className="login-btn"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <><FaSpinner className="spinner" /> Signing in...</>
                      ) : (
                        <>Sign In <FaArrowRight /></>
                      )}
                    </motion.button>

                    <div className="demo-credentials">
                      <button 
                        type="button"
                        onClick={fillDemoCredentials}
                        className="demo-btn"
                      >
                        Try Demo Account
                      </button>
                    </div>

                    <div className="divider">
                      <span>or continue with</span>
                    </div>

                    <div className="social-login">
                      <motion.button
                        type="button"
                        className="social-btn google"
                        onClick={handleGoogleLogin}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaGoogle /> Google
                      </motion.button>
                      <motion.button
                        type="button"
                        className="social-btn facebook"
                        onClick={handleFacebookLogin}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaFacebook /> Facebook
                      </motion.button>
                    </div>

                    <div className="register-link">
                      Don't have an account? <Link to="/register">Create Account</Link>
                    </div>
                  </motion.form>
                ) : (
                  <motion.form
                    key="reset-form"
                    onSubmit={handleForgotPassword}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="reset-header">
                      <h3>Reset Password</h3>
                      <p>Enter your email to receive reset instructions</p>
                    </div>

                    <div className="input-group">
                      <FaEnvelope className="input-icon" />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                      />
                    </div>

                    <motion.button
                      type="submit"
                      className="reset-btn"
                      disabled={resetLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {resetLoading ? (
                        <><FaSpinner className="spinner" /> Sending...</>
                      ) : (
                        <>Send Reset Email</>
                      )}
                    </motion.button>

                    <button
                      type="button"
                      className="back-to-login"
                      onClick={() => setShowForgotPassword(false)}
                    >
                      ← Back to Login
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Right Side - Features & Info */}
            <motion.div 
              className="login-info-side"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="info-content">
                <h2>Secure Healthcare Portal</h2>
                <div className="feature-list">
                  <div className="feature">
                    <FaUserCheck className="feature-icon" />
                    <div>
                      <h4>Easy Appointment Booking</h4>
                      <p>Book appointments with top doctors instantly</p>
                    </div>
                  </div>
                  <div className="feature">
                    <FaClock className="feature-icon" />
                    <div>
                      <h4>24/7 Access</h4>
                      <p>Manage your health anytime, anywhere</p>
                    </div>
                  </div>
                  <div className="feature">
                    <FaPhoneAlt className="feature-icon" />
                    <div>
                      <h4>Video Consultations</h4>
                      <p>Connect with doctors from home</p>
                    </div>
                  </div>
                  <div className="feature">
                    <FaEnvelopeOpenText className="feature-icon" />
                    <div>
                      <h4>Digital Reports</h4>
                      <p>Access all medical records online</p>
                    </div>
                  </div>
                </div>

                <div className="trust-badge">
                  <FaCheckCircle />
                  <div>
                    <strong>Trusted by 50,000+ Patients</strong>
                    <p>Secure & Confidential Healthcare Platform</p>
                  </div>
                </div>

                <div className="support-info">
                  <p>Need help? <Link to="/contact">Contact Support</Link></p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <style jsx>{`
          .login-premium {
            min-height: 100vh;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .animated-bg {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }

          .gradient-bg {
            position: absolute;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
            animation: rotate 20s linear infinite;
          }

          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255,255,255,0.5);
            border-radius: 50%;
          }

          .health-icons {
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
          }

          .icon-float {
            position: absolute;
            font-size: 2rem;
            color: rgba(255,255,255,0.1);
          }

          .icon-1 { top: 10%; left: 5%; }
          .icon-2 { bottom: 15%; right: 8%; }
          .icon-3 { top: 20%; right: 15%; }
          .icon-4 { bottom: 25%; left: 10%; }

          .login-container {
            position: relative;
            z-index: 2;
            width: 100%;
            max-width: 1200px;
            padding: 2rem;
          }

          .login-card {
            display: grid;
            grid-template-columns: 1fr 1fr;
            background: white;
            border-radius: 30px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }

          .login-form-side {
            padding: 3rem;
            background: white;
          }

          .brand-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
          }

          .logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.5rem;
            font-weight: bold;
          }

          .logo-icon {
            font-size: 2rem;
          }

          .logo-text {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .verified-badge {
            background: #e6f7e6;
            color: #48bb78;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
          }

          .welcome-text {
            margin-bottom: 2rem;
          }

          .welcome-text h1 {
            font-size: 2rem;
            color: #2d3748;
            margin-bottom: 0.5rem;
          }

          .welcome-text p {
            color: #718096;
          }

          .input-group {
            position: relative;
            margin-bottom: 1.5rem;
          }

          .input-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: #a0aec0;
          }

          .input-group input {
            width: 100%;
            padding: 1rem 1rem 1rem 3rem;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            font-size: 1rem;
            transition: all 0.3s ease;
          }

          .input-group input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
          }

          .toggle-password {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #a0aec0;
          }

          .form-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
          }

          .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            color: #718096;
          }

          .forgot-password {
            background: none;
            border: none;
            color: #667eea;
            cursor: pointer;
            font-size: 0.9rem;
          }

          .login-btn, .reset-btn {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
          }

          .login-btn:hover, .reset-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102,126,234,0.4);
          }

          .demo-credentials {
            margin: 1rem 0;
          }

          .demo-btn {
            width: 100%;
            padding: 0.75rem;
            background: #f7fafc;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            cursor: pointer;
            color: #4a5568;
            transition: all 0.3s ease;
          }

          .demo-btn:hover {
            background: #edf2f7;
          }

          .divider {
            text-align: center;
            margin: 1.5rem 0;
            position: relative;
          }

          .divider::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            width: 45%;
            height: 1px;
            background: #e2e8f0;
          }

          .divider::after {
            content: '';
            position: absolute;
            right: 0;
            top: 50%;
            width: 45%;
            height: 1px;
            background: #e2e8f0;
          }

          .divider span {
            background: white;
            padding: 0 1rem;
            color: #a0aec0;
            font-size: 0.875rem;
          }

          .social-login {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
          }

          .social-btn {
            flex: 1;
            padding: 0.75rem;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            background: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
          }

          .social-btn.google:hover {
            border-color: #db4437;
            color: #db4437;
          }

          .social-btn.facebook:hover {
            border-color: #4267b2;
            color: #4267b2;
          }

          .register-link {
            text-align: center;
            color: #718096;
          }

          .register-link a {
            color: #667eea;
            text-decoration: none;
            font-weight: 600;
          }

          .login-info-side {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 3rem;
            color: white;
            display: flex;
            align-items: center;
          }

          .info-content h2 {
            font-size: 1.8rem;
            margin-bottom: 2rem;
          }

          .feature-list {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .feature {
            display: flex;
            gap: 1rem;
            align-items: flex-start;
          }

          .feature-icon {
            font-size: 1.5rem;
            margin-top: 0.25rem;
          }

          .feature h4 {
            margin-bottom: 0.25rem;
          }

          .feature p {
            opacity: 0.9;
            font-size: 0.875rem;
          }

          .trust-badge {
            background: rgba(255,255,255,0.1);
            padding: 1rem;
            border-radius: 12px;
            display: flex;
            gap: 1rem;
            align-items: center;
            margin-bottom: 1rem;
          }

          .trust-badge svg {
            font-size: 2rem;
          }

          .support-info {
            text-align: center;
            margin-top: 1rem;
          }

          .support-info a {
            color: white;
            text-decoration: underline;
          }

          .spinner {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @media (max-width: 968px) {
            .login-card {
              grid-template-columns: 1fr;
            }
            
            .login-info-side {
              display: none;
            }
            
            .login-form-side {
              padding: 2rem;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Login;