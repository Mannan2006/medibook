// src/pages/Register.jsx (Corrected - No JSX prop error)
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { auth, db } from '../firebase/config';
import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaGoogle,
  FaFacebook,
  FaArrowRight,
  FaArrowLeft,
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaPhone,
  FaCalendarAlt,
  FaUserMd,
  FaHeartbeat,
  FaStethoscope,
  FaAmbulance,
  FaHospitalUser,
  FaSpinner,
  FaIdCard,
  FaMapMarkerAlt,
  FaClipboardList,
  FaTerms,
  FaRegCheckCircle
} from 'react-icons/fa';

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // Form Data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    bloodGroup: '',
    allergies: '',
    password: '',
    confirmPassword: ''
  });

  // Validation Errors
  const [errors, setErrors] = useState({});

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Check password strength
  useEffect(() => {
    checkPasswordStrength(formData.password);
  }, [formData.password]);

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return { text: 'Weak', color: '#f56565' };
    if (passwordStrength <= 3) return { text: 'Medium', color: '#ed8936' };
    if (passwordStrength <= 4) return { text: 'Strong', color: '#48bb78' };
    return { text: 'Very Strong', color: '#38a169' };
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      else if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.phone)) 
        newErrors.phone = 'Phone number is invalid';
    }
    
    if (currentStep === 2) {
      if (!formData.password) newErrors.password = 'Password is required';
      else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) 
        newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (currentStep === 3 && !acceptedTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;
    
    setLoading(true);
    
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: formData.fullName
      });
      
      // Send email verification
      await sendEmailVerification(userCredential.user);
      
      // Save user data to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        bloodGroup: formData.bloodGroup,
        allergies: formData.allergies,
        createdAt: new Date().toISOString(),
        role: 'patient',
        emailVerified: false,
        appointmentsCount: 0,
        profileComplete: true
      });
      
      toast.success('Account created successfully! Please verify your email.');
      toast.success('Verification email sent to ' + formData.email);
      navigate('/login');
      
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email already registered. Please login instead.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address format.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please use a stronger password.';
          break;
        default:
          errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    try {
      let authProvider;
      if (provider === 'google') {
        authProvider = new GoogleAuthProvider();
      } else if (provider === 'facebook') {
        authProvider = new FacebookAuthProvider();
      }
      
      const result = await signInWithPopup(auth, authProvider);
      
      // Check if user exists in Firestore
      const userData = {
        fullName: result.user.displayName,
        email: result.user.email,
        createdAt: new Date().toISOString(),
        role: 'patient',
        appointmentsCount: 0,
        profileComplete: true
      };
      
      await setDoc(doc(db, 'users', result.user.uid), userData, { merge: true });
      
      toast.success(`Welcome ${result.user.displayName}!`);
      navigate('/');
    } catch (error) {
      toast.error(`${provider} signup failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  // Floating particles for background
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 8 + Math.random() * 15
  }));

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <>
      <Helmet>
        <title>Register - MediBook | Create Healthcare Account</title>
        <meta name="description" content="Create your MediBook account to book appointments, access health records, and connect with top doctors." />
      </Helmet>

      <div className="register-premium">
        {/* Animated Background */}
        <div className="animated-bg-register">
          <div className="gradient-bg-register"></div>
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              className="particle-register"
              initial={{ x: particle.x + '%', y: particle.y + '%' }}
              animate={{
                y: [particle.y + '%', (particle.y + 30) + '%', particle.y + '%'],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.id * 0.5
              }}
            />
          ))}
        </div>

        <div className="register-container">
          <motion.div 
            className="register-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Progress Steps */}
            <div className="progress-steps">
              <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Personal Info</div>
              </div>
              <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Security</div>
              </div>
              <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`}></div>
              <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-label">Verify</div>
              </div>
            </div>

            <div className="register-content">
              <motion.div 
                className="brand-header-register"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="logo-register">
                  <span className="logo-icon">🏥</span>
                  <span className="logo-text">MediBook</span>
                </div>
                <div className="secure-badge">
                  <FaShieldAlt /> 100% Secure
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="step-content"
                  >
                    <h2>Create Your Account</h2>
                    <p>Join MediBook for seamless healthcare access</p>

                    <div className="form-grid">
                      <div className="input-group full-width">
                        <FaUser className="input-icon" />
                        <input
                          type="text"
                          name="fullName"
                          placeholder="Full Name"
                          value={formData.fullName}
                          onChange={handleChange}
                        />
                        {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                      </div>

                      <div className="input-group">
                        <FaEnvelope className="input-icon" />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                      </div>

                      <div className="input-group">
                        <FaPhone className="input-icon" />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                      </div>

                      <div className="input-group">
                        <FaCalendarAlt className="input-icon" />
                        <input
                          type="date"
                          name="dateOfBirth"
                          placeholder="Date of Birth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="input-group full-width">
                        <FaMapMarkerAlt className="input-icon" />
                        <input
                          type="text"
                          name="address"
                          placeholder="Full Address"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="input-group">
                        <FaUserMd className="input-icon" />
                        <select
                          name="bloodGroup"
                          value={formData.bloodGroup}
                          onChange={handleChange}
                        >
                          <option value="">Select Blood Group</option>
                          {bloodGroups.map(group => (
                            <option key={group} value={group}>{group}</option>
                          ))}
                        </select>
                      </div>

                      <div className="input-group full-width">
                        <FaClipboardList className="input-icon" />
                        <textarea
                          name="allergies"
                          placeholder="Any known allergies or medical conditions?"
                          value={formData.allergies}
                          onChange={handleChange}
                          rows="2"
                        />
                      </div>
                    </div>

                    <button onClick={handleNext} className="next-btn">
                      Continue <FaArrowRight />
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Security */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="step-content"
                  >
                    <h2>Set Your Password</h2>
                    <p>Create a strong password to protect your account</p>

                    <div className="input-group">
                      <FaLock className="input-icon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    {formData.password && (
                      <div className="password-strength">
                        <div className="strength-bar">
                          <div 
                            className="strength-fill" 
                            style={{ 
                              width: `${(passwordStrength / 5) * 100}%`,
                              background: getPasswordStrengthText().color
                            }}
                          ></div>
                        </div>
                        <span style={{ color: getPasswordStrengthText().color }}>
                          Password Strength: {getPasswordStrengthText().text}
                        </span>
                      </div>
                    )}

                    <div className="input-group">
                      <FaLock className="input-icon" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                    </div>

                    <div className="password-requirements">
                      <h4>Password Requirements:</h4>
                      <ul>
                        <li className={formData.password.length >= 6 ? 'valid' : ''}>
                          {formData.password.length >= 6 ? <FaCheckCircle /> : <FaTimesCircle />}
                          At least 6 characters
                        </li>
                        <li className={/[a-z]/.test(formData.password) ? 'valid' : ''}>
                          {/[a-z]/.test(formData.password) ? <FaCheckCircle /> : <FaTimesCircle />}
                          Contains lowercase letter
                        </li>
                        <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
                          {/[A-Z]/.test(formData.password) ? <FaCheckCircle /> : <FaTimesCircle />}
                          Contains uppercase letter
                        </li>
                        <li className={/[0-9]/.test(formData.password) ? 'valid' : ''}>
                          {/[0-9]/.test(formData.password) ? <FaCheckCircle /> : <FaTimesCircle />}
                          Contains number
                        </li>
                      </ul>
                    </div>

                    <div className="step-buttons">
                      <button onClick={handleBack} className="back-btn">
                        <FaArrowLeft /> Back
                      </button>
                      <button onClick={handleNext} className="next-btn">
                        Continue <FaArrowRight />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Terms & Conditions */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="step-content"
                  >
                    <h2>Verify & Complete</h2>
                    <p>Review and accept terms to create your account</p>

                    <div className="summary-section">
                      <h3>Account Summary</h3>
                      <div className="summary-item">
                        <strong>Name:</strong> {formData.fullName}
                      </div>
                      <div className="summary-item">
                        <strong>Email:</strong> {formData.email}
                      </div>
                      <div className="summary-item">
                        <strong>Phone:</strong> {formData.phone}
                      </div>
                      {formData.bloodGroup && (
                        <div className="summary-item">
                          <strong>Blood Group:</strong> {formData.bloodGroup}
                        </div>
                      )}
                    </div>

                    <div className="terms-section">
                      <h3>Terms & Conditions</h3>
                      <div className="terms-content">
                        <p>By creating an account, you agree to:</p>
                        <ul>
                          <li>Receive appointment reminders and health tips</li>
                          <li>Keep your personal information accurate and updated</li>
                          <li>Not share your account credentials with others</li>
                          <li>Follow the healthcare provider's guidelines</li>
                          <li>Pay applicable fees for consultations and services</li>
                        </ul>
                      </div>
                      
                      <label className="terms-checkbox">
                        <input
                          type="checkbox"
                          checked={acceptedTerms}
                          onChange={(e) => setAcceptedTerms(e.target.checked)}
                        />
                        <span>I agree to the Terms and Conditions and Privacy Policy</span>
                      </label>
                      {errors.terms && <span className="error-text">{errors.terms}</span>}
                    </div>

                    <div className="step-buttons">
                      <button onClick={handleBack} className="back-btn">
                        <FaArrowLeft /> Back
                      </button>
                      <button 
                        onClick={handleSubmit} 
                        className="submit-btn"
                        disabled={loading}
                      >
                        {loading ? (
                          <><FaSpinner className="spinner" /> Creating Account...</>
                        ) : (
                          <>Create Account <FaRegCheckCircle /></>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Social Signup */}
              {currentStep === 1 && (
                <>
                  <div className="divider">
                    <span>or sign up with</span>
                  </div>

                  <div className="social-signup">
                    <motion.button
                      type="button"
                      className="social-btn google"
                      onClick={() => handleSocialLogin('google')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaGoogle /> Google
                    </motion.button>
                    <motion.button
                      type="button"
                      className="social-btn facebook"
                      onClick={() => handleSocialLogin('facebook')}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaFacebook /> Facebook
                    </motion.button>
                  </div>

                  <div className="login-link">
                    Already have an account? <Link to="/login">Sign In</Link>
                  </div>
                </>
              )}
            </div>

            {/* Right Side - Benefits */}
            <div className="benefits-side">
              <div className="benefits-content">
                <h3>Why Join MediBook?</h3>
                <div className="benefit-list">
                  <div className="benefit">
                    <FaHeartbeat />
                    <div>
                      <h4>50,000+ Happy Patients</h4>
                      <p>Join thousands of satisfied patients</p>
                    </div>
                  </div>
                  <div className="benefit">
                    <FaUserMd />
                    <div>
                      <h4>150+ Expert Doctors</h4>
                      <p>Access top healthcare professionals</p>
                    </div>
                  </div>
                  <div className="benefit">
                    <FaStethoscope />
                    <div>
                      <h4>24/7 Online Consultations</h4>
                      <p>Get medical advice anytime, anywhere</p>
                    </div>
                  </div>
                  <div className="benefit">
                    <FaAmbulance />
                    <div>
                      <h4>Emergency Support</h4>
                      <p>Quick access to emergency services</p>
                    </div>
                  </div>
                </div>

                <div className="offer-badge">
                  <FaHospitalUser />
                  <div>
                    <strong>Special Offer!</strong>
                    <p>Get 20% off on first consultation</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Styles moved to regular CSS block - NO JSX PROP */}
      <style>{`
        .register-premium {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
        }

        .animated-bg-register {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .gradient-bg-register {
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%);
        }

        .particle-register {
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(255,255,255,0.4);
          border-radius: 50%;
        }

        .register-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1300px;
        }

        .register-card {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          background: white;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 0 25px 50px rgba(0,0,0,0.3);
        }

        .progress-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 2rem 0 2rem;
          gap: 0.5rem;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #718096;
          transition: all 0.3s ease;
        }

        .step.active .step-number {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .step-label {
          font-size: 0.75rem;
          color: #a0aec0;
        }

        .step.active .step-label {
          color: #667eea;
          font-weight: 600;
        }

        .step-line {
          width: 60px;
          height: 2px;
          background: #e2e8f0;
          transition: all 0.3s ease;
        }

        .step-line.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .register-content {
          padding: 2rem;
        }

        .brand-header-register {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .logo-register {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.3rem;
          font-weight: bold;
        }

        .secure-badge {
          background: #e6f7e6;
          color: #48bb78;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .step-content h2 {
          font-size: 1.8rem;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .step-content > p {
          color: #718096;
          margin-bottom: 2rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .full-width {
          grid-column: span 2;
        }

        .input-group {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
        }

        .input-group input,
        .input-group select,
        .input-group textarea {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .input-group textarea {
          resize: vertical;
          padding-top: 0.75rem;
        }

        .input-group input:focus,
        .input-group select:focus,
        .input-group textarea:focus {
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

        .error-text {
          color: #f56565;
          font-size: 0.75rem;
          margin-top: 0.25rem;
          display: block;
        }

        .password-strength {
          margin: 0.5rem 0 1rem;
        }

        .strength-bar {
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .strength-fill {
          height: 100%;
          transition: all 0.3s ease;
        }

        .password-requirements {
          background: #f7fafc;
          padding: 1rem;
          border-radius: 10px;
          margin: 1rem 0;
        }

        .password-requirements h4 {
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .password-requirements ul {
          list-style: none;
        }

        .password-requirements li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          margin-bottom: 0.25rem;
          color: #a0aec0;
        }

        .password-requirements li.valid {
          color: #48bb78;
        }

        .step-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .next-btn, .back-btn, .submit-btn {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .next-btn, .submit-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .back-btn {
          background: #f7fafc;
          color: #4a5568;
          border: 2px solid #e2e8f0;
        }

        .next-btn:hover, .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102,126,234,0.4);
        }

        .summary-section {
          background: #f7fafc;
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }

        .summary-section h3 {
          margin-bottom: 1rem;
          color: #2d3748;
        }

        .summary-item {
          margin-bottom: 0.5rem;
          color: #4a5568;
        }

        .terms-section {
          margin: 1.5rem 0;
        }

        .terms-content {
          background: #f7fafc;
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 1rem;
          max-height: 150px;
          overflow-y: auto;
        }

        .terms-content p {
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .terms-content ul {
          padding-left: 1.5rem;
        }

        .terms-content li {
          margin-bottom: 0.25rem;
          color: #4a5568;
        }

        .terms-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .divider {
          text-align: center;
          margin: 1.5rem 0;
          position: relative;
        }

        .divider::before,
        .divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 42%;
          height: 1px;
          background: #e2e8f0;
        }

        .divider::before { left: 0; }
        .divider::after { right: 0; }

        .divider span {
          background: white;
          padding: 0 1rem;
          color: #a0aec0;
          font-size: 0.875rem;
        }

        .social-signup {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .social-btn {
          flex: 1;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
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

        .login-link {
          text-align: center;
          color: #718096;
        }

        .login-link a {
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }

        .benefits-side {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 3rem;
          color: white;
          display: flex;
          align-items: center;
        }

        .benefits-content h3 {
          font-size: 1.5rem;
          margin-bottom: 2rem;
        }

        .benefit-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .benefit {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .benefit svg {
          font-size: 1.5rem;
          margin-top: 0.25rem;
        }

        .benefit h4 {
          margin-bottom: 0.25rem;
        }

        .benefit p {
          opacity: 0.9;
          font-size: 0.875rem;
        }

        .offer-badge {
          background: rgba(255,255,255,0.2);
          padding: 1rem;
          border-radius: 12px;
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 968px) {
          .register-card {
            grid-template-columns: 1fr;
          }
          
          .benefits-side {
            display: none;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .full-width {
            grid-column: span 1;
          }
        }
      `}</style>
    </>
  );
};

export default Register;