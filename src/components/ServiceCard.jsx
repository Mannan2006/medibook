// src/components/ServiceCard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ServiceCard = ({ service, variant = 'grid', onBookService, featured = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  // Sample doctors for this service
  const availableDoctors = [
    { id: 1, name: 'Dr. Sarah Johnson', experience: '15 years', rating: 4.9, fee: service.price },
    { id: 2, name: 'Dr. Michael Chen', experience: '12 years', rating: 4.8, fee: service.price },
    { id: 3, name: 'Dr. Emily Rodriguez', experience: '10 years', rating: 4.9, fee: service.price }
  ];

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const handleBookNow = () => {
    if (!user) {
      toast.error('Please login to book an appointment');
      navigate('/login');
      return;
    }
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTimeSlot) {
      toast.error('Please select doctor, date, and time slot');
      return;
    }

    setBookingLoading(true);
    
    try {
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const bookingData = {
        serviceId: service.id,
        serviceName: service.name,
        servicePrice: service.discountPrice || service.price,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        patientName: user.displayName,
        patientEmail: user.email,
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
      };
      
      if (onBookService) {
        onBookService(bookingData);
      }
      
      toast.success(`${service.name} booked successfully with ${selectedDoctor.name}`);
      toast.success(`Confirmation sent to ${user.email}`);
      
      setShowBookingModal(false);
      setSelectedDoctor(null);
      setSelectedDate('');
      setSelectedTimeSlot('');
      
    } catch (error) {
      toast.error('Failed to book service. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);
    
    return (
      <div className="service-rating-stars">
        {[...Array(fullStars)].map((_, i) => (
          <span key={`full-${i}`} className="star full">★</span>
        ))}
        {hasHalfStar && <span className="star half">½</span>}
        {[...Array(emptyStars)].map((_, i) => (
          <span key={`empty-${i}`} className="star empty">☆</span>
        ))}
      </div>
    );
  };

  // Grid View Component
  const GridView = () => (
    <motion.div
      className={`service-card-grid premium ${featured ? 'featured' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {featured && <div className="featured-ribbon">⭐ Featured</div>}
      {service.popular && <div className="popular-badge">🔥 Popular</div>}
      
      <div className="service-card-icon" style={{ background: service.color || 'var(--gradient-primary)' }}>
        <span className="service-icon">{service.icon || '🏥'}</span>
      </div>

      <div className="service-card-content">
        <h3 className="service-name">{service.name}</h3>
        <p className="service-description">{service.description}</p>
        
        <div className="service-rating">
          {renderStars(service.rating || 4.8)}
          <span className="rating-value">{service.rating || 4.8}</span>
          <span className="reviews-count">({service.reviews || 120}+ reviews)</span>
        </div>

        <div className="service-meta">
          <div className="meta-item">
            <span className="meta-icon">⏱️</span>
            <span>{service.duration || '30-45 mins'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">👨‍⚕️</span>
            <span>{service.doctors || '5+'} doctors</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <span>{service.availability || 'Mon-Sat'}</span>
          </div>
        </div>

        <div className="service-pricing">
          <div className="price-info">
            <span className="current-price">${service.discountPrice || service.price}</span>
            {service.price && service.discountPrice && (
              <span className="original-price">${service.price}</span>
            )}
          </div>
          <div className="savings-badge">
            Save ${service.price - service.discountPrice}
          </div>
        </div>

        <div className="service-features">
          {service.features && service.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="feature-item">
              <span className="feature-check">✓</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="service-card-actions">
          <button 
            className="btn-view-details"
            onClick={() => setShowDetails(true)}
          >
            View Details
          </button>
          <button 
            className="btn-book-now"
            onClick={handleBookNow}
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Service Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="service-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              className="service-modal-content"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowDetails(false)}>✕</button>
              
              <div className="modal-header" style={{ background: service.color || 'var(--gradient-primary)' }}>
                <div className="modal-icon">{service.icon || '🏥'}</div>
                <h2>{service.name}</h2>
              </div>

              <div className="modal-body">
                <div className="info-section">
                  <h3>About this Service</h3>
                  <p>{service.longDescription || service.description}</p>
                </div>

                <div className="info-section">
                  <h3>What's Included</h3>
                  <ul className="features-list">
                    {service.features && service.features.map((feature, idx) => (
                      <li key={idx}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="info-grid">
                  <div className="info-item">
                    <strong>Duration</strong>
                    <p>{service.duration || '30-45 minutes'}</p>
                  </div>
                  <div className="info-item">
                    <strong>Price</strong>
                    <p>${service.discountPrice || service.price}</p>
                  </div>
                  <div className="info-item">
                    <strong>Doctors Available</strong>
                    <p>{service.doctors || '5+'} specialists</p>
                  </div>
                  <div className="info-item">
                    <strong>Availability</strong>
                    <p>{service.availability || 'Monday - Saturday'}</p>
                  </div>
                </div>

                <div className="info-section">
                  <h3>Available Doctors</h3>
                  <div className="doctors-list">
                    {availableDoctors.map(doctor => (
                      <div key={doctor.id} className="doctor-item">
                        <span className="doctor-name">{doctor.name}</span>
                        <span className="doctor-details">{doctor.experience} • ⭐ {doctor.rating}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="book-service-btn" onClick={handleBookNow}>
                  Book This Service
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  // List View Component
  const ListView = () => (
    <motion.div
      className="service-card-list premium"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 5 }}
    >
      <div className="service-list-icon" style={{ background: service.color || 'var(--gradient-primary)' }}>
        <span>{service.icon || '🏥'}</span>
      </div>

      <div className="service-list-content">
        <div className="service-list-header">
          <div>
            <h3 className="service-name">{service.name}</h3>
            <p className="service-description">{service.description}</p>
          </div>
          <div className="service-rating">
            {renderStars(service.rating || 4.8)}
            <span className="rating-value">{service.rating || 4.8}</span>
          </div>
        </div>

        <div className="service-meta-list">
          <div className="meta-item">⏱️ {service.duration || '30-45 mins'}</div>
          <div className="meta-item">👨‍⚕️ {service.doctors || '5+'} doctors</div>
          <div className="meta-item">📅 {service.availability || 'Mon-Sat'}</div>
        </div>

        <div className="service-list-footer">
          <div className="price-section">
            <span className="current-price">${service.discountPrice || service.price}</span>
            {service.price && service.discountPrice && (
              <span className="original-price">${service.price}</span>
            )}
          </div>
          <div className="action-buttons">
            <button 
              className="btn-view-details"
              onClick={() => setShowDetails(true)}
            >
              Details
            </button>
            <button 
              className="btn-book-now"
              onClick={handleBookNow}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Same Details Modal as Grid View */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            className="service-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetails(false)}
          >
            {/* Same modal content as above */}
            <motion.div
              className="service-modal-content"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowDetails(false)}>✕</button>
              
              <div className="modal-header" style={{ background: service.color || 'var(--gradient-primary)' }}>
                <div className="modal-icon">{service.icon || '🏥'}</div>
                <h2>{service.name}</h2>
              </div>

              <div className="modal-body">
                <div className="info-section">
                  <h3>About this Service</h3>
                  <p>{service.longDescription || service.description}</p>
                </div>

                <div className="info-section">
                  <h3>What's Included</h3>
                  <ul className="features-list">
                    {service.features && service.features.map((feature, idx) => (
                      <li key={idx}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="info-grid">
                  <div className="info-item">
                    <strong>Duration</strong>
                    <p>{service.duration || '30-45 minutes'}</p>
                  </div>
                  <div className="info-item">
                    <strong>Price</strong>
                    <p>${service.discountPrice || service.price}</p>
                  </div>
                  <div className="info-item">
                    <strong>Doctors Available</strong>
                    <p>{service.doctors || '5+'} specialists</p>
                  </div>
                  <div className="info-item">
                    <strong>Availability</strong>
                    <p>{service.availability || 'Monday - Saturday'}</p>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="book-service-btn" onClick={handleBookNow}>
                  Book This Service
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  // Booking Modal
  const BookingModal = () => (
    <AnimatePresence>
      {showBookingModal && (
        <motion.div
          className="booking-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowBookingModal(false)}
        >
          <motion.div
            className="booking-modal-content"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="booking-modal-header">
              <h2>Book {service.name}</h2>
              <button className="modal-close" onClick={() => setShowBookingModal(false)}>✕</button>
            </div>

            <div className="booking-modal-body">
              <div className="service-summary">
                <div className="service-summary-icon" style={{ background: service.color || 'var(--gradient-primary)' }}>
                  {service.icon || '🏥'}
                </div>
                <div className="service-summary-info">
                  <h3>{service.name}</h3>
                  <p>${service.discountPrice || service.price} per consultation</p>
                </div>
              </div>

              <div className="booking-form">
                <div className="form-group">
                  <label>Select Doctor *</label>
                  <div className="doctors-select">
                    {availableDoctors.map(doctor => (
                      <button
                        key={doctor.id}
                        className={`doctor-option ${selectedDoctor?.id === doctor.id ? 'selected' : ''}`}
                        onClick={() => setSelectedDoctor(doctor)}
                      >
                        <div>
                          <strong>{doctor.name}</strong>
                          <span>{doctor.experience}</span>
                        </div>
                        <div className="doctor-rating-small">⭐ {doctor.rating}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Select Date *</label>
                  <input
                    type="date"
                    min={getTodayDate()}
                    max={getMaxDate()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="date-input"
                  />
                </div>

                <div className="form-group">
                  <label>Select Time Slot *</label>
                  <div className="time-slots-grid">
                    {timeSlots.map((slot, i) => (
                      <button
                        key={i}
                        className={`time-slot-btn ${selectedTimeSlot === slot ? 'selected' : ''}`}
                        onClick={() => setSelectedTimeSlot(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedDoctor && selectedDate && selectedTimeSlot && (
                  <div className="booking-summary">
                    <h4>Booking Summary</h4>
                    <p><strong>Service:</strong> {service.name}</p>
                    <p><strong>Doctor:</strong> {selectedDoctor.name}</p>
                    <p><strong>Date:</strong> {selectedDate}</p>
                    <p><strong>Time:</strong> {selectedTimeSlot}</p>
                    <p><strong>Total:</strong> ${service.discountPrice || service.price}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="booking-modal-footer">
              <button className="cancel-btn" onClick={() => setShowBookingModal(false)}>
                Cancel
              </button>
              <button 
                className="confirm-btn" 
                onClick={handleConfirmBooking}
                disabled={bookingLoading || !selectedDoctor || !selectedDate || !selectedTimeSlot}
              >
                {bookingLoading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {variant === 'grid' ? <GridView /> : <ListView />}
      <BookingModal />
    </>
  );
};

export default ServiceCard;