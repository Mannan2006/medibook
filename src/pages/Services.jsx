// src/pages/Services.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Helmet } from 'react-helmet-async';
import { 
  FaStethoscope, 
  FaHeartbeat, 
  FaBrain, 
  FaTooth, 
  FaEye, 
  FaChild,
  FaBone,
  FaLungs,
  FaMicroscope,
  FaSyringe,
  FaPills,
  FaAmbulance,
  FaSearch,
  FaTimes,
  FaClock,
  FaUserMd,
  FaShieldAlt,
  FaStar,
  FaMoneyBillWave,
  FaCalendarCheck,
  FaVideo,
  FaHospitalUser,
  FaArrowRight,
  FaCheckCircle,
  FaChartLine,
  FaFilter,
  FaInfoCircle
} from 'react-icons/fa';
import { GiKidneys } from 'react-icons/gi';

const Services = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showComparison, setShowComparison] = useState(false);

  const categories = [
    { id: 'all', name: 'All Services', icon: <FaStethoscope />, count: 12 },
    { id: 'general', name: 'General Medicine', icon: <FaStethoscope />, count: 4 },
    { id: 'cardiology', name: 'Cardiology', icon: <FaHeartbeat />, count: 1 },
    { id: 'neurology', name: 'Neurology', icon: <FaBrain />, count: 1 },
    { id: 'dentistry', name: 'Dentistry', icon: <FaTooth />, count: 1 },
    { id: 'pediatrics', name: 'Pediatrics', icon: <FaChild />, count: 1 },
    { id: 'orthopedics', name: 'Orthopedics', icon: <FaBone />, count: 1 },
    { id: 'ophthalmology', name: 'Ophthalmology', icon: <FaEye />, count: 1 }
  ];

  const services = [
    {
      id: 1,
      name: 'General Physician Consultation',
      category: 'general',
      icon: <FaStethoscope />,
      description: 'Comprehensive primary healthcare consultation for all age groups.',
      longDescription: 'Our general physicians provide complete primary healthcare services including routine checkups, diagnosis, treatment of common illnesses, preventive care, and health counseling.',
      price: '$50',
      discountPrice: '$40',
      duration: '30 mins',
      rating: 4.8,
      reviews: 1250,
      doctors: 25,
      availability: '24/7',
      features: [
        'Routine health checkups',
        'Common illness treatment',
        'Preventive care',
        'Health counseling',
        'Prescription management'
      ],
      color: '#667eea',
      popular: true,
      inPerson: true,
      videoCall: true
    },
    {
      id: 2,
      name: 'Cardiology Consultation',
      category: 'cardiology',
      icon: <FaHeartbeat />,
      description: 'Expert heart care and cardiovascular disease management.',
      longDescription: 'Our cardiologists specialize in diagnosing and treating heart conditions including coronary artery disease, heart failure, arrhythmias, and hypertension.',
      price: '$80',
      discountPrice: '$65',
      duration: '45 mins',
      rating: 4.9,
      reviews: 890,
      doctors: 12,
      availability: 'Mon-Sat',
      features: [
        'ECG/EKG monitoring',
        'Stress tests',
        'Cardiac rehabilitation',
        'Blood pressure management',
        'Cholesterol treatment'
      ],
      color: '#f56565',
      popular: true,
      inPerson: true,
      videoCall: true
    },
    {
      id: 3,
      name: 'Neurology Consultation',
      category: 'neurology',
      icon: <FaBrain />,
      description: 'Advanced care for brain, spine, and nervous system disorders.',
      longDescription: 'Neurologists provide expert diagnosis and treatment for conditions like epilepsy, multiple sclerosis, Parkinson\'s disease, migraines, and stroke.',
      price: '$90',
      discountPrice: '$75',
      duration: '60 mins',
      rating: 4.7,
      reviews: 670,
      doctors: 8,
      availability: 'Mon-Fri',
      features: [
        'Brain MRI analysis',
        'Seizure management',
        'Migraine treatment',
        'Memory disorders',
        'Motor skill assessment'
      ],
      color: '#48bb78',
      popular: false,
      inPerson: true,
      videoCall: true
    },
    {
      id: 4,
      name: 'Dental Care',
      category: 'dentistry',
      icon: <FaTooth />,
      description: 'Complete dental care including cleaning, fillings, and cosmetic dentistry.',
      longDescription: 'Our dental clinic offers comprehensive oral healthcare including routine checkups, cleanings, fillings, root canals, crowns, bridges, and cosmetic dentistry.',
      price: '$60',
      discountPrice: '$45',
      duration: '45 mins',
      rating: 4.8,
      reviews: 2100,
      doctors: 15,
      availability: 'Mon-Sat',
      features: [
        'Teeth cleaning',
        'Fillings and crowns',
        'Root canal treatment',
        'Teeth whitening',
        'Orthodontics'
      ],
      color: '#ed8936',
      popular: true,
      inPerson: true,
      videoCall: false
    },
    {
      id: 5,
      name: 'Pediatric Care',
      category: 'pediatrics',
      icon: <FaChild />,
      description: 'Specialized healthcare for infants, children, and adolescents.',
      longDescription: 'Our pediatricians provide compassionate care for children from birth through adolescence including vaccinations, growth monitoring, developmental assessments, and treatment of childhood illnesses.',
      price: '$55',
      discountPrice: '$45',
      duration: '30 mins',
      rating: 4.9,
      reviews: 1560,
      doctors: 18,
      availability: '24/7',
      features: [
        'Child vaccinations',
        'Growth monitoring',
        'Developmental screening',
        'Nutrition counseling',
        'Childhood illness treatment'
      ],
      color: '#9f7aea',
      popular: true,
      inPerson: true,
      videoCall: true
    },
    {
      id: 6,
      name: 'Orthopedic Consultation',
      category: 'orthopedics',
      icon: <FaBone />,
      description: 'Expert care for bones, joints, muscles, and spine conditions.',
      longDescription: 'Orthopedic specialists treat conditions affecting the musculoskeletal system including fractures, arthritis, sports injuries, back pain, and joint replacements.',
      price: '$75',
      discountPrice: '$60',
      duration: '45 mins',
      rating: 4.7,
      reviews: 980,
      doctors: 10,
      availability: 'Mon-Fri',
      features: [
        'Fracture care',
        'Joint pain treatment',
        'Sports injury rehab',
        'Arthritis management',
        'Physical therapy'
      ],
      color: '#4299e1',
      popular: false,
      inPerson: true,
      videoCall: true
    },
    {
      id: 7,
      name: 'Eye Care',
      category: 'ophthalmology',
      icon: <FaEye />,
      description: 'Comprehensive eye exams and vision care services.',
      longDescription: 'Our ophthalmologists provide complete eye care including vision testing, prescription glasses, contact lenses, and treatment for eye diseases like glaucoma and cataracts.',
      price: '$50',
      discountPrice: '$40',
      duration: '30 mins',
      rating: 4.8,
      reviews: 1340,
      doctors: 12,
      availability: 'Mon-Sat',
      features: [
        'Vision testing',
        'Glaucoma screening',
        'Cataract evaluation',
        'Contact lens fitting',
        'Laser eye surgery'
      ],
      color: '#38a169',
      popular: false,
      inPerson: true,
      videoCall: false
    },
    {
      id: 8,
      name: 'Pulmonology',
      category: 'general',
      icon: <FaLungs />,
      description: 'Respiratory health and lung disease management.',
      longDescription: 'Pulmonologists specialize in treating respiratory conditions including asthma, COPD, pneumonia, bronchitis, and sleep apnea.',
      price: '$85',
      discountPrice: '$70',
      duration: '45 mins',
      rating: 4.6,
      reviews: 560,
      doctors: 7,
      availability: 'Mon-Fri',
      features: [
        'Asthma treatment',
        'COPD management',
        'Pulmonary function tests',
        'Sleep apnea care',
        'Bronchoscopy'
      ],
      color: '#4fd1c5',
      popular: false,
      inPerson: true,
      videoCall: true
    },
    {
      id: 9,
      name: 'Nephrology',
      category: 'general',
      icon: <GiKidneys />,
      description: 'Kidney disease diagnosis and treatment.',
      longDescription: 'Nephrologists provide expert care for kidney conditions including chronic kidney disease, dialysis management, kidney stones, and hypertension.',
      price: '$85',
      discountPrice: '$70',
      duration: '45 mins',
      rating: 4.7,
      reviews: 430,
      doctors: 6,
      availability: 'Mon-Fri',
      features: [
        'Kidney function tests',
        'Dialysis consultation',
        'Kidney stone treatment',
        'Hypertension management',
        'Transplant evaluation'
      ],
      color: '#d53f8c',
      popular: false,
      inPerson: true,
      videoCall: true
    },
    {
      id: 10,
      name: 'Laboratory Tests',
      category: 'general',
      icon: <FaMicroscope />,
      description: 'Complete diagnostic laboratory services.',
      longDescription: 'Our state-of-the-art laboratory offers comprehensive diagnostic testing including blood work, urine analysis, pathology, and genetic testing.',
      price: '$30',
      discountPrice: '$25',
      duration: '15 mins',
      rating: 4.8,
      reviews: 1890,
      doctors: 5,
      availability: '24/7',
      features: [
        'Blood tests',
        'Urine analysis',
        'Pathology',
        'Genetic testing',
        'Rapid results'
      ],
      color: '#ecc94b',
      popular: false,
      inPerson: true,
      videoCall: false
    },
    {
      id: 11,
      name: 'Vaccination Services',
      category: 'general',
      icon: <FaSyringe />,
      description: 'Complete vaccination and immunization services.',
      longDescription: 'We provide all recommended vaccines for children and adults including flu shots, COVID-19 vaccines, travel vaccines, and routine immunizations.',
      price: '$25',
      discountPrice: '$20',
      duration: '15 mins',
      rating: 4.9,
      reviews: 2450,
      doctors: 8,
      availability: '24/7',
      features: [
        'Flu shots',
        'COVID-19 vaccines',
        'Travel vaccines',
        'Childhood immunizations',
        'Booster shots'
      ],
      color: '#fbbf24',
      popular: true,
      inPerson: true,
      videoCall: false
    },
    {
      id: 12,
      name: 'Pharmacy Delivery',
      category: 'general',
      icon: <FaPills />,
      description: 'Prescription medications delivered to your doorstep.',
      longDescription: 'Our pharmacy service delivers prescription medications directly to your home with free delivery and medication counseling.',
      price: '$0',
      discountPrice: '$0',
      duration: '24 hours',
      rating: 4.8,
      reviews: 1670,
      doctors: 4,
      availability: '24/7',
      features: [
        'Free delivery',
        'Medication counseling',
        '24-hour service',
        'Insurance accepted',
        'Refill reminders'
      ],
      color: '#a0aec0',
      popular: false,
      inPerson: false,
      videoCall: true
    }
  ];

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularServices = services.filter(s => s.popular);
  const getAverageRating = (services.reduce((acc, s) => acc + s.rating, 0) / services.length).toFixed(1);

  // Install react-icons/gi if not already installed
  // npm install react-icons

  return (
    <>
      <Helmet>
        <title>Medical Services - MediBook | Healthcare Solutions</title>
        <meta name="description" content="Explore our comprehensive medical services including general medicine, cardiology, neurology, dentistry, and more. Book appointments with top doctors." />
      </Helmet>

      <div className="services-premium-page">
        {/* Hero Section */}
        <section className="services-hero">
          <div className="hero-overlay"></div>
          <div className="hero-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="hero-content"
            >
              <h1>Our Medical Services</h1>
              <p>Comprehensive healthcare solutions tailored to your needs</p>
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="stat-number">{services.length}+</span>
                  <span className="stat-label">Medical Services</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-number">{services.reduce((acc, s) => acc + s.doctors, 0)}+</span>
                  <span className="stat-label">Expert Doctors</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-number">{getAverageRating}</span>
                  <span className="stat-label">Avg Rating</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-number">{services.reduce((acc, s) => acc + s.reviews, 0)}+</span>
                  <span className="stat-label">Patient Reviews</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <div className="services-controls">
          <div className="controls-container">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search services by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="clear-search">
                  <FaTimes />
                </button>
              )}
            </div>

            <div className="view-toggle">
              <button 
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
              >
                Grid View
              </button>
              <button 
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
              >
                List View
              </button>
            </div>

            <button 
              className="compare-btn"
              onClick={() => setShowComparison(!showComparison)}
            >
              <FaChartLine /> Compare Services
            </button>
          </div>
        </div>

        {/* Categories Section */}
        <div className="categories-section">
          <div className="categories-container">
            <div className="categories-scroll">
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  className={`category-chip ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">{category.count}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Services Display */}
        <div className="services-container">
          <AnimatePresence>
            {filteredServices.length === 0 ? (
              <motion.div 
                className="empty-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="empty-icon">🔍</div>
                <h3>No Services Found</h3>
                <p>No medical services match your search criteria.</p>
                <button onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }} className="reset-btn">
                  Reset Filters
                </button>
              </motion.div>
            ) : (
              <div className={`services-${viewMode}`}>
                <AnimatePresence>
                  {filteredServices.map((service, index) => (
                    <motion.div
                      key={service.id}
                      className={`service-card-${viewMode}`}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={viewMode === 'grid' ? { y: -10 } : {}}
                    >
                      {service.popular && <div className="popular-badge">🔥 Popular</div>}
                      
                      <div className="service-icon-large" style={{ background: service.color }}>
                        {service.icon}
                      </div>

                      <div className="service-info">
                        <h3>{service.name}</h3>
                        <div className="service-rating">
                          <div className="stars">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} color={i < Math.floor(service.rating) ? '#fbbf24' : '#e2e8f0'} />
                            ))}
                          </div>
                          <span>({service.reviews} reviews)</span>
                        </div>
                        <p className="service-description">{service.description}</p>

                        <div className="service-meta">
                          <div className="meta-item">
                            <FaClock />
                            <span>{service.duration}</span>
                          </div>
                          <div className="meta-item">
                            <FaUserMd />
                            <span>{service.doctors} doctors</span>
                          </div>
                          <div className="meta-item">
                            <FaShieldAlt />
                            <span>Secure</span>
                          </div>
                        </div>

                        <div className="service-pricing">
                          <div className="price">
                            <span className="current-price">{service.discountPrice}</span>
                            {service.price !== service.discountPrice && (
                              <span className="original-price">{service.price}</span>
                            )}
                          </div>
                          <div className="service-buttons">
                            <Link to={user ? "/book" : "/login"} className="book-now-btn">
                              Book Now <FaArrowRight />
                            </Link>
                            <button 
                              className="details-btn"
                              onClick={() => setSelectedService(service)}
                            >
                              Details
                            </button>
                          </div>
                        </div>

                        <div className="appointment-types">
                          {service.inPerson && (
                            <span className="type-badge in-person">
                              <FaHospitalUser /> In-Person
                            </span>
                          )}
                          {service.videoCall && (
                            <span className="type-badge video-call">
                              <FaVideo /> Video Call
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Service Details Modal */}
        <AnimatePresence>
          {selectedService && (
            <motion.div 
              className="service-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
            >
              <motion.div 
                className="modal-content"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header" style={{ background: selectedService.color }}>
                  <div className="modal-icon">{selectedService.icon}</div>
                  <h2>{selectedService.name}</h2>
                  <button onClick={() => setSelectedService(null)} className="modal-close">
                    <FaTimes />
                  </button>
                </div>
                <div className="modal-body">
                  <p className="modal-description">{selectedService.longDescription}</p>
                  <div className="modal-features">
                    <h3>What's Included:</h3>
                    <ul>
                      {selectedService.features.map((feature, i) => (
                        <li key={i}><FaCheckCircle className="check-icon" /> {feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="modal-details">
                    <div className="detail">
                      <strong>Price:</strong> {selectedService.discountPrice}
                    </div>
                    <div className="detail">
                      <strong>Duration:</strong> {selectedService.duration}
                    </div>
                    <div className="detail">
                      <strong>Rating:</strong> {selectedService.rating} ★ ({selectedService.reviews} reviews)
                    </div>
                    <div className="detail">
                      <strong>Doctors:</strong> {selectedService.doctors} specialists
                    </div>
                  </div>
                  <Link to={user ? "/book" : "/login"} className="modal-book-btn">
                    Book Appointment <FaArrowRight />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="cta-content"
            >
              <h2>Ready to Get Started?</h2>
              <p>Book an appointment with our expert doctors today</p>
              <div className="cta-buttons">
                <Link to={user ? "/book" : "/register"} className="cta-primary">
                  Book Appointment Now
                </Link>
                <Link to="/contact" className="cta-secondary">
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .services-premium-page {
          min-height: 100vh;
          background: #f7fafc;
        }

        .services-hero {
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 4rem 2rem;
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
          text-align: center;
          color: white;
        }

        .hero-content h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .hero-content p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .hero-stat {
          background: rgba(255,255,255,0.1);
          padding: 1rem 2rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: bold;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .services-controls {
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: sticky;
          top: 70px;
          z-index: 100;
        }

        .controls-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-bar {
          flex: 1;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
        }

        .search-bar input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
        }

        .clear-search {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #a0aec0;
        }

        .view-toggle {
          display: flex;
          gap: 0;
        }

        .view-toggle button {
          padding: 0.5rem 1rem;
          border: 2px solid #e2e8f0;
          background: white;
          cursor: pointer;
          font-weight: 600;
        }

        .view-toggle button:first-child {
          border-radius: 8px 0 0 8px;
        }

        .view-toggle button:last-child {
          border-radius: 0 8px 8px 0;
        }

        .view-toggle button.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .compare-btn {
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .categories-section {
          background: white;
          border-bottom: 1px solid #e2e8f0;
        }

        .categories-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1rem 2rem;
        }

        .categories-scroll {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .category-chip {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f7fafc;
          border: 2px solid #e2e8f0;
          border-radius: 40px;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .category-chip.active {
          background: #667eea;
          border-color: #667eea;
          color: white;
        }

        .category-count {
          background: rgba(0,0,0,0.1);
          padding: 0.125rem 0.5rem;
          border-radius: 20px;
          font-size: 0.75rem;
        }

        .services-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .services-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .service-card-grid {
          position: relative;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }

        .service-card-list {
          position: relative;
          background: white;
          border-radius: 12px;
          padding: 1rem;
          display: flex;
          gap: 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .popular-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: #ed8936;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          z-index: 1;
        }

        .service-icon-large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 1.5rem auto;
          font-size: 2rem;
          color: white;
        }

        .service-card-list .service-icon-large {
          margin: 0;
          width: 60px;
          height: 60px;
          font-size: 1.5rem;
        }

        .service-info {
          padding: 0 1.5rem 1.5rem;
        }

        .service-info h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .service-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .stars {
          display: flex;
          gap: 0.25rem;
        }

        .service-description {
          color: #718096;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .service-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #718096;
        }

        .service-pricing {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .current-price {
          font-size: 1.5rem;
          font-weight: bold;
          color: #667eea;
        }

        .original-price {
          text-decoration: line-through;
          color: #a0aec0;
          margin-left: 0.5rem;
        }

        .service-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .book-now-btn, .details-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .book-now-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .details-btn {
          background: #f7fafc;
          border: 1px solid #e2e8f0;
          color: #4a5568;
        }

        .appointment-types {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .type-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
        }

        .type-badge.in-person {
          background: #e6f7e6;
          color: #48bb78;
        }

        .type-badge.video-call {
          background: #e6f3ff;
          color: #4299e1;
        }

        .service-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.8);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          padding: 2rem;
          text-align: center;
          color: white;
          position: relative;
        }

        .modal-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-body {
          padding: 2rem;
        }

        .modal-description {
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .modal-features h3 {
          margin-bottom: 1rem;
          color: #2d3748;
        }

        .modal-features ul {
          list-style: none;
          margin-bottom: 1.5rem;
        }

        .modal-features li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          color: #4a5568;
        }

        .check-icon {
          color: #48bb78;
        }

        .modal-details {
          background: #f7fafc;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }

        .detail {
          margin-bottom: 0.5rem;
          color: #4a5568;
        }

        .modal-book-btn {
          display: block;
          text-align: center;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .modal-book-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102,126,234,0.4);
        }

        .cta-section {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 4rem 2rem;
          text-align: center;
        }

        .cta-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .cta-content h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: white;
        }

        .cta-content p {
          color: rgba(255,255,255,0.9);
          margin-bottom: 2rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-primary, .cta-secondary {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .cta-primary {
          background: white;
          color: #667eea;
        }

        .cta-secondary {
          border: 2px solid white;
          color: white;
        }

        .cta-primary:hover, .cta-secondary:hover {
          transform: translateY(-2px);
        }

        .empty-state {
          text-align: center;
          padding: 4rem;
          background: white;
          border-radius: 20px;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .reset-btn {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .services-grid {
            grid-template-columns: 1fr;
          }
          
          .hero-content h1 {
            font-size: 2rem;
          }
          
          .hero-stats {
            gap: 1rem;
          }
          
          .controls-container {
            flex-direction: column;
          }
          
          .service-card-list {
            flex-direction: column;
          }
          
          .service-card-list .service-icon-large {
            margin: 0 auto;
          }
        }
      `}</style>
    </>
  );
};

export default Services;