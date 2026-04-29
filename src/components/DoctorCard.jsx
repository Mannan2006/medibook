// src/components/DoctorCard.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const DoctorCard = ({ doctor, variant = 'grid', onBookAppointment, showDetails = true }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showFullBio, setShowFullBio] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM'
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
    if (!selectedDate || !selectedTimeSlot) {
      toast.error('Please select date and time slot');
      return;
    }

    setBookingLoading(true);
    
    try {
      // Simulate booking API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const bookingData = {
        doctorId: doctor.id,
        doctorName: doctor.name,
        doctorSpecialty: doctor.specialty,
        doctorFee: doctor.fee,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        patientName: user.displayName,
        patientEmail: user.email,
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
      };
      
      // Call the parent component's booking handler if provided
      if (onBookAppointment) {
        onBookAppointment(bookingData);
      }
      
      toast.success(`Appointment booked with ${doctor.name} on ${selectedDate} at ${selectedTimeSlot}`);
      toast.success(`Confirmation sent to ${user.email}`);
      
      setShowBookingModal(false);
      setSelectedDate('');
      setSelectedTimeSlot('');
      
    } catch (error) {
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - Math.ceil(rating);
    
    return (
      <div className="doctor-rating-stars">
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
      className="doctor-card-grid premium"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="doctor-card-image-wrapper">
        <div className="doctor-card-image">
          <img src={doctor.image} alt={doctor.name} />
          {doctor.online && <div className="online-indicator">● Online</div>}
          {doctor.featured && <div className="featured-badge">⭐ Featured</div>}
        </div>
        
        <motion.div 
          className="doctor-card-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <button 
            className="overlay-book-btn"
            onClick={handleBookNow}
          >
            Book Appointment
          </button>
          <button 
            className="overlay-profile-btn"
            onClick={() => setShowFullBio(true)}
          >
            View Profile
          </button>
        </motion.div>
      </div>

      <div className="doctor-card-content">
        <h3 className="doctor-name">{doctor.name}</h3>
        <p className="doctor-specialty">{doctor.specialty}</p>
        
        <div className="doctor-rating">
          {renderStars(doctor.rating)}
          <span className="rating-value">{doctor.rating}</span>
          <span className="reviews-count">({doctor.reviews} reviews)</span>
        </div>

        <div className="doctor-meta">
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <span>{doctor.experience}+ years</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">💰</span>
            <span>${doctor.fee}/visit</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">👥</span>
            <span>{doctor.patients}+ patients</span>
          </div>
        </div>

        <div className="doctor-availability">
          <span className="availability-label">Available:</span>
          <div className="availability-days">
            {doctor.availability.slice(0, 3).map((day, i) => (
              <span key={i} className="day-badge">{day.substring(0, 3)}</span>
            ))}
            {doctor.availability.length > 3 && (
              <span className="day-badge more">+{doctor.availability.length - 3}</span>
            )}
          </div>
        </div>

        <div className="doctor-languages">
          <span className="languages-label">🌐 Speaks:</span>
          <span className="languages-list">{doctor.languages.join(', ')}</span>
        </div>

        <div className="doctor-card-actions">
          <button 
            className="btn-view-profile"
            onClick={() => setShowFullBio(true)}
          >
            View Profile
          </button>
          <button 
            className="btn-book-now"
            onClick={handleBookNow}
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showFullBio && (
          <motion.div
            className="doctor-profile-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFullBio(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowFullBio(false)}>✕</button>
              
              <div className="modal-header">
                <img src={doctor.image} alt={doctor.name} className="modal-doctor-image" />
                <div className="modal-header-info">
                  <h2>{doctor.name}</h2>
                  <p className="modal-specialty">{doctor.specialty}</p>
                  <div className="modal-rating">
                    {renderStars(doctor.rating)}
                    <span>{doctor.rating} ({doctor.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="modal-body">
                <div className="info-section">
                  <h3>About Doctor</h3>
                  <p>{doctor.about}</p>
                </div>

                <div className="info-section">
                  <h3>Education</h3>
                  <p>{doctor.education}</p>
                </div>

                <div className="info-section">
                  <h3>Achievements</h3>
                  <ul className="achievements-list">
                    {doctor.achievements.map((achievement, i) => (
                      <li key={i}>🏆 {achievement}</li>
                    ))}
                  </ul>
                </div>

                <div className="info-grid">
                  <div className="info-item">
                    <strong>Experience</strong>
                    <p>{doctor.experience}+ years</p>
                  </div>
                  <div className="info-item">
                    <strong>Consultation Fee</strong>
                    <p>${doctor.fee}</p>
                  </div>
                  <div className="info-item">
                    <strong>Languages</strong>
                    <p>{doctor.languages.join(', ')}</p>
                  </div>
                  <div className="info-item">
                    <strong>Patients Treated</strong>
                    <p>{doctor.patients}+</p>
                  </div>
                </div>

                <div className="info-section">
                  <h3>Available Time Slots</h3>
                  <div className="time-slots-list">
                    {doctor.timeSlots.map((slot, i) => (
                      <span key={i} className="slot-badge">{slot}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="book-appointment-btn" onClick={handleBookNow}>
                  Book Appointment
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
      className="doctor-card-list premium"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 5 }}
    >
      <div className="doctor-list-image">
        <img src={doctor.image} alt={doctor.name} />
        {doctor.online && <div className="online-indicator-small">● Online</div>}
      </div>

      <div className="doctor-list-content">
        <div className="doctor-list-header">
          <div>
            <h3 className="doctor-name">{doctor.name}</h3>
            <p className="doctor-specialty">{doctor.specialty}</p>
          </div>
          <div className="doctor-rating">
            {renderStars(doctor.rating)}
            <span className="rating-value">{doctor.rating}</span>
            <span className="reviews-count">({doctor.reviews})</span>
          </div>
        </div>

        <p className="doctor-bio-short">{doctor.about.substring(0, 150)}...</p>

        <div className="doctor-meta-list">
          <div className="meta-item">
            <span>📅 {doctor.experience}+ years</span>
          </div>
          <div className="meta-item">
            <span>💰 ${doctor.fee}/visit</span>
          </div>
          <div className="meta-item">
            <span>👥 {doctor.patients}+ patients</span>
          </div>
          <div className="meta-item">
            <span>🌐 {doctor.languages.join(', ')}</span>
          </div>
        </div>

        <div className="doctor-list-actions">
          <button 
            className="btn-view-profile"
            onClick={() => setShowFullBio(true)}
          >
            View Full Profile
          </button>
          <button 
            className="btn-book-now"
            onClick={handleBookNow}
          >
            Book Appointment
          </button>
        </div>
      </div>

      {/* Same Profile Modal as Grid View */}
      <AnimatePresence>
        {showFullBio && (
          <motion.div
            className="doctor-profile-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFullBio(false)}
          >
            {/* Same modal content as above */}
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowFullBio(false)}>✕</button>
              
              <div className="modal-header">
                <img src={doctor.image} alt={doctor.name} className="modal-doctor-image" />
                <div className="modal-header-info">
                  <h2>{doctor.name}</h2>
                  <p className="modal-specialty">{doctor.specialty}</p>
                  <div className="modal-rating">
                    {renderStars(doctor.rating)}
                    <span>{doctor.rating} ({doctor.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="modal-body">
                <div className="info-section">
                  <h3>About Doctor</h3>
                  <p>{doctor.about}</p>
                </div>

                <div className="info-section">
                  <h3>Education</h3>
                  <p>{doctor.education}</p>
                </div>

                <div className="info-section">
                  <h3>Achievements</h3>
                  <ul className="achievements-list">
                    {doctor.achievements.map((achievement, i) => (
                      <li key={i}>🏆 {achievement}</li>
                    ))}
                  </ul>
                </div>

                <div className="info-grid">
                  <div className="info-item">
                    <strong>Experience</strong>
                    <p>{doctor.experience}+ years</p>
                  </div>
                  <div className="info-item">
                    <strong>Consultation Fee</strong>
                    <p>${doctor.fee}</p>
                  </div>
                  <div className="info-item">
                    <strong>Languages</strong>
                    <p>{doctor.languages.join(', ')}</p>
                  </div>
                  <div className="info-item">
                    <strong>Patients Treated</strong>
                    <p>{doctor.patients}+</p>
                  </div>
                </div>

                <div className="info-section">
                  <h3>Available Time Slots</h3>
                  <div className="time-slots-list">
                    {doctor.timeSlots.map((slot, i) => (
                      <span key={i} className="slot-badge">{slot}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="book-appointment-btn" onClick={handleBookNow}>
                  Book Appointment
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
              <h2>Book Appointment with {doctor.name}</h2>
              <button className="modal-close" onClick={() => setShowBookingModal(false)}>✕</button>
            </div>

            <div className="booking-modal-body">
              <div className="doctor-summary">
                <img src={doctor.image} alt={doctor.name} className="summary-image" />
                <div className="summary-info">
                  <h3>{doctor.name}</h3>
                  <p>{doctor.specialty}</p>
                  <p className="fee">Consultation Fee: ${doctor.fee}</p>
                </div>
              </div>

              <div className="booking-form">
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

                {selectedDate && selectedTimeSlot && (
                  <div className="booking-summary">
                    <h4>Booking Summary</h4>
                    <p><strong>Doctor:</strong> {doctor.name}</p>
                    <p><strong>Date:</strong> {selectedDate}</p>
                    <p><strong>Time:</strong> {selectedTimeSlot}</p>
                    <p><strong>Total:</strong> ${doctor.fee}</p>
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
                disabled={bookingLoading || !selectedDate || !selectedTimeSlot}
              >
                {bookingLoading ? 'Booking...' : 'Confirm Appointment'}
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

export default DoctorCard;