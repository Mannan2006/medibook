// src/pages/Contact.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email',
    urgency: 'normal'
  });
  const [loading, setLoading] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { type: 'bot', message: 'Hello! 👋 How can I help you today?' }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [showChat, setShowChat] = useState(false);
  const chatEndRef = useRef(null);

  const locations = [
    {
      city: 'New York',
      address: '123 Healthcare Ave, Manhattan, NY 10001',
      phone: '+1 (212) 555-1234',
      email: 'nyc@medibook.com',
      hours: 'Mon-Fri: 9AM - 8PM, Sat: 10AM - 4PM',
      mapLink: 'https://maps.google.com/?q=New+York'
    },
    {
      city: 'Los Angeles',
      address: '456 Wellness Blvd, LA, CA 90001',
      phone: '+1 (310) 555-5678',
      email: 'la@medibook.com',
      hours: 'Mon-Fri: 8AM - 7PM, Sat: 9AM - 3PM',
      mapLink: 'https://maps.google.com/?q=Los+Angeles'
    },
    {
      city: 'Chicago',
      address: '789 Medical Plaza, Chicago, IL 60601',
      phone: '+1 (312) 555-9012',
      email: 'chicago@medibook.com',
      hours: 'Mon-Fri: 9AM - 6PM, Sat: 10AM - 2PM',
      mapLink: 'https://maps.google.com/?q=Chicago'
    }
  ];

  const faqs = [
    {
      question: 'How do I book an appointment?',
      answer: 'You can book an appointment by clicking on the "Book Appointment" button on our homepage or navigation bar. Select your preferred service, doctor, date, and time, then fill in your patient information. You\'ll receive instant confirmation via email.'
    },
    {
      question: 'What services do you offer?',
      answer: 'We offer a wide range of medical services including General Medicine, Cardiology, Neurology, Dentistry, Pediatrics, Orthopedics, Ophthalmology, and more. Check our Services page for complete details.'
    },
    {
      question: 'Do you accept insurance?',
      answer: 'Yes, we accept most major insurance plans. Please contact our billing department or provide your insurance information during booking for verification.'
    },
    {
      question: 'Can I cancel or reschedule my appointment?',
      answer: 'Yes, you can cancel or reschedule your appointment up to 24 hours before the scheduled time without any penalty. You can do this from your "My Appointments" dashboard.'
    },
    {
      question: 'Do you offer telemedicine consultations?',
      answer: 'Yes, we offer video consultations for many of our services. You can select "Video Call" option when booking your appointment for remote consultation.'
    },
    {
      question: 'How do I access my medical records?',
      answer: 'Your medical records are available in your profile dashboard. You can download reports, prescriptions, and view your medical history anytime.'
    },
    {
      question: 'What if I need emergency medical care?',
      answer: 'For medical emergencies, please call 911 immediately or go to your nearest emergency room. MediBook is for non-emergency medical consultations.'
    },
    {
      question: 'How can I contact a doctor directly?',
      answer: 'You can message your doctor through your patient portal after booking an appointment. For urgent matters, please call our support line.'
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call - In production, you would send this to your backend
    setTimeout(() => {
      // Save to localStorage for demo purposes
      const inquiries = JSON.parse(localStorage.getItem('contactInquiries') || '[]');
      inquiries.push({
        ...formData,
        timestamp: new Date().toISOString(),
        id: Date.now()
      });
      localStorage.setItem('contactInquiries', JSON.stringify(inquiries));
      
      toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
      toast.success(`A confirmation will be sent to ${formData.email}`);
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        preferredContact: 'email',
        urgency: 'normal'
      });
      setLoading(false);
    }, 1500);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    // Add user message
    setChatMessages(prev => [...prev, { type: 'user', message: userMessage }]);
    
    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "Thanks for your message! How can I assist you today?",
        "I'm here to help! What questions do you have about our services?",
        "Would you like to book an appointment? I can guide you through the process.",
        "Our support team will get back to you shortly via email.",
        "You can also call us at 1-800-MEDIBOOK for immediate assistance.",
        "For emergencies, please call 911 immediately.",
        "You can check doctor availability on our Doctors page.",
        "Would you like me to help you find a specialist?"
      ];
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      setChatMessages(prev => [...prev, { type: 'bot', message: randomResponse }]);
    }, 1000);
    
    setUserMessage('');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - MediBook | Get in Touch</title>
        <meta name="description" content="Contact MediBook for appointments, inquiries, or support. Visit our locations, call us, or send a message. We're here to help 24/7." />
      </Helmet>

      <div className="contact-page">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="hero-overlay"></div>
          <div className="hero-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="hero-content"
            >
              <h1>Get in Touch</h1>
              <p>We're here to help and answer any questions you might have</p>
            </motion.div>
          </div>
        </section>

        {/* Contact Information Cards */}
        <section className="contact-info-section">
          <div className="container">
            <div className="info-grid">
              <motion.div 
                className="info-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="info-icon">📞</div>
                <h3>Phone Support</h3>
                <p>24/7 Customer Service</p>
                <a href="tel:+1800MEDIBOOK">1-800-MEDIBOOK</a>
                <small>International: +1 (555) 123-4567</small>
              </motion.div>

              <motion.div 
                className="info-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="info-icon">✉️</div>
                <h3>Email Us</h3>
                <p>Response within 24 hours</p>
                <a href="mailto:support@medibook.com">support@medibook.com</a>
                <a href="mailto:careers@medibook.com">careers@medibook.com</a>
              </motion.div>

              <motion.div 
                className="info-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="info-icon">💬</div>
                <h3>Live Chat</h3>
                <p>Chat with our support team</p>
                <button onClick={() => setShowChat(true)} className="chat-btn">
                  Start Live Chat
                </button>
              </motion.div>

              <motion.div 
                className="info-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="info-icon">🏥</div>
                <h3>Visit Us</h3>
                <p>Multiple locations nationwide</p>
                <button className="locations-btn" onClick={() => {
                  document.getElementById('locations').scrollIntoView({ behavior: 'smooth' });
                }}>
                  Find Nearest Location
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Contact Form & Map Section */}
        <section className="contact-form-section" id="locations">
          <div className="container">
            <div className="form-map-grid">
              {/* Contact Form */}
              <motion.div 
                className="contact-form-container"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="form-header">
                  <h2>Send Us a Message</h2>
                  <p>Fill out the form below and we'll get back to you as soon as possible</p>
                </div>

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div className="form-group">
                      <label>Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="How can we help?"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Preferred Contact Method</label>
                      <select
                        name="preferredContact"
                        value={formData.preferredContact}
                        onChange={handleChange}
                      >
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="sms">SMS</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Urgency Level</label>
                      <select
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleChange}
                      >
                        <option value="normal">Normal</option>
                        <option value="urgent">Urgent</option>
                        <option value="emergency">Emergency (Call 911)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label>Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="5"
                      placeholder="Please provide details about your inquiry..."
                    ></textarea>
                  </div>

                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </motion.div>

              {/* Map & Locations */}
              <motion.div 
                className="locations-container"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2>Our Locations</h2>
                <div className="locations-list">
                  {locations.map((location, index) => (
                    <div key={index} className="location-card">
                      <div className="location-header">
                        <span className="city-icon">📍</span>
                        <h3>{location.city}</h3>
                      </div>
                      <div className="location-details">
                        <p><strong>Address:</strong> {location.address}</p>
                        <p><strong>Phone:</strong> {location.phone}</p>
                        <p><strong>Email:</strong> {location.email}</p>
                        <p><strong>Hours:</strong> {location.hours}</p>
                        <a href={location.mapLink} target="_blank" rel="noopener noreferrer" className="map-link">
                          View on Map →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="map-placeholder">
                  <iframe
                    title="MediBook Locations Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.1583091352!2d-74.11976397304688!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s"
                    width="100%"
                    height="300"
                    style={{ border: 0, borderRadius: '12px' }}
                    allowFullScreen=""
                    loading="lazy"
                  ></iframe>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">FAQ</span>
              <h2>Frequently Asked Questions</h2>
              <p>Find answers to common questions about our services</p>
            </div>

            <div className="faq-grid">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="faq-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    className={`faq-question ${activeFAQ === index ? 'active' : ''}`}
                    onClick={() => toggleFAQ(index)}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-icon">{activeFAQ === index ? '−' : '+'}</span>
                  </button>
                  <AnimatePresence>
                    {activeFAQ === index && (
                      <motion.div
                        className="faq-answer"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p>{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency Section */}
        <section className="emergency-section">
          <div className="container">
            <motion.div
              className="emergency-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="emergency-icon">🚨</div>
              <h2>Medical Emergency?</h2>
              <p>If you're experiencing a medical emergency, please call 911 immediately or go to your nearest emergency room.</p>
              <div className="emergency-buttons">
                <button className="emergency-btn" onClick={() => window.location.href = 'tel:911'}>
                  Call 911 Now
                </button>
                <button className="emergency-btn secondary" onClick={() => window.open('https://www.google.com/maps/search/emergency+room+near+me', '_blank')}>
                  Find Nearest ER
                </button>
              </div>
              <div className="emergency-note">
                <strong>Note:</strong> MediBook is for non-emergency medical consultations only.
              </div>
            </motion.div>
          </div>
        </section>

        {/* Business Hours */}
        <section className="hours-section">
          <div className="container">
            <div className="hours-grid">
              <div className="hours-content">
                <h2>Business Hours</h2>
                <p>Our support team is available during these hours</p>
              </div>
              <div className="hours-table">
                <div className="hour-row">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 8:00 PM</span>
                </div>
                <div className="hour-row">
                  <span>Saturday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </div>
                <div className="hour-row">
                  <span>Sunday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="hour-row highlighted">
                  <span>24/7 Emergency Support</span>
                  <span>Always Available</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Chat Modal */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              className="chat-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="chat-container"
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
              >
                <div className="chat-header">
                  <div className="chat-header-info">
                    <span className="chat-avatar">💬</span>
                    <div>
                      <h3>MediBook Support</h3>
                      <p>Online • Typically replies in seconds</p>
                    </div>
                  </div>
                  <button onClick={() => setShowChat(false)} className="chat-close">✕</button>
                </div>

                <div className="chat-messages">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.type}`}>
                      <div className="message-bubble">
                        {msg.message}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleChatSubmit} className="chat-input-form">
                  <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="chat-input"
                  />
                  <button type="submit" className="chat-send">Send</button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .contact-page {
          min-height: 100vh;
          background: #f7fafc;
        }

        /* Hero Section */
        .contact-hero {
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
        }

        /* Contact Info Section */
        .contact-info-section {
          padding: 4rem 2rem;
          background: white;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .info-card {
          text-align: center;
          padding: 2rem;
          background: #f7fafc;
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .info-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .info-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .info-card h3 {
          margin-bottom: 0.5rem;
          color: #2d3748;
        }

        .info-card p {
          color: #718096;
          margin-bottom: 1rem;
        }

        .info-card a, .chat-btn, .locations-btn {
          display: inline-block;
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
          margin: 0.25rem 0;
          background: none;
          border: none;
          cursor: pointer;
        }

        /* Contact Form Section */
        .contact-form-section {
          padding: 4rem 2rem;
          background: #f7fafc;
        }

        .form-map-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
        }

        .contact-form-container {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .form-header {
          margin-bottom: 2rem;
        }

        .form-header h2 {
          font-size: 1.8rem;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group.full-width {
          grid-column: span 2;
        }

        .form-group label {
          font-weight: 600;
          color: #2d3748;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .submit-btn {
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102,126,234,0.4);
        }

        /* Locations */
        .locations-container h2 {
          font-size: 1.8rem;
          margin-bottom: 1.5rem;
          color: #2d3748;
        }

        .locations-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .location-card {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .location-card:hover {
          transform: translateX(5px);
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .location-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .city-icon {
          font-size: 1.5rem;
        }

        .location-details p {
          margin: 0.25rem 0;
          color: #4a5568;
          font-size: 0.875rem;
        }

        .map-link {
          display: inline-block;
          margin-top: 0.5rem;
          color: #667eea;
          text-decoration: none;
          font-weight: 600;
        }

        /* FAQ Section */
        .faq-section {
          padding: 4rem 2rem;
          background: white;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
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

        .section-header h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: #2d3748;
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 1rem;
        }

        .faq-item {
          background: #f7fafc;
          border-radius: 12px;
          overflow: hidden;
        }

        .faq-question {
          width: 100%;
          padding: 1rem;
          background: none;
          border: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          font-weight: 600;
          color: #2d3748;
        }

        .faq-question.active {
          background: #667eea;
          color: white;
        }

        .faq-icon {
          font-size: 1.2rem;
          font-weight: bold;
        }

        .faq-answer {
          padding: 1rem;
          color: #4a5568;
          line-height: 1.6;
        }

        /* Emergency Section */
        .emergency-section {
          padding: 4rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .emergency-card {
          background: white;
          border-radius: 20px;
          padding: 3rem;
          text-align: center;
        }

        .emergency-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .emergency-card h2 {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          color: #2d3748;
        }

        .emergency-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin: 1.5rem 0;
        }

        .emergency-btn {
          padding: 0.75rem 1.5rem;
          background: #f56565;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .emergency-btn.secondary {
          background: #4299e1;
        }

        .emergency-note {
          margin-top: 1rem;
          color: #718096;
          font-size: 0.875rem;
        }

        /* Business Hours */
        .hours-section {
          padding: 4rem 2rem;
          background: #f7fafc;
        }

        .hours-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
        }

        .hours-content h2 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
          color: #2d3748;
        }

        .hours-table {
          background: white;
          border-radius: 16px;
          padding: 2rem;
        }

        .hour-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .hour-row.highlighted {
          background: #f7fafc;
          padding: 0.75rem;
          border-radius: 8px;
          margin-top: 0.5rem;
          font-weight: 600;
        }

        /* Chat Modal */
        .chat-modal {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 1000;
        }

        .chat-container {
          width: 350px;
          height: 500px;
          background: white;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          overflow: hidden;
        }

        .chat-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .chat-avatar {
          font-size: 2rem;
        }

        .chat-header-info h3 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .chat-header-info p {
          font-size: 0.75rem;
          opacity: 0.9;
        }

        .chat-close {
          background: none;
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .chat-message {
          display: flex;
        }

        .chat-message.bot {
          justify-content: flex-start;
        }

        .chat-message.user {
          justify-content: flex-end;
        }

        .message-bubble {
          max-width: 70%;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-size: 0.875rem;
        }

        .chat-message.bot .message-bubble {
          background: #f7fafc;
          color: #2d3748;
        }

        .chat-message.user .message-bubble {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .chat-input-form {
          display: flex;
          padding: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .chat-input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          margin-right: 0.5rem;
        }

        .chat-send {
          padding: 0.5rem 1rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        /* Responsive */
        @media (max-width: 968px) {
          .form-map-grid,
          .hours-grid,
          .faq-grid {
            grid-template-columns: 1fr;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .form-group.full-width {
            grid-column: span 1;
          }
          
          .hero-content h1 {
            font-size: 2rem;
          }
          
          .emergency-buttons {
            flex-direction: column;
          }
          
          .chat-modal {
            bottom: 1rem;
            right: 1rem;
            left: 1rem;
          }
          
          .chat-container {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default Contact;