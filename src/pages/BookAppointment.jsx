// src/pages/BookAppointment.jsx (FIXED - Time Slots Working)
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase/config';
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    symptoms: '',
    previousHistory: '',
    emergencyContact: '',
    insuranceInfo: ''
  });

  // ALL AVAILABLE TIME SLOTS
  const allTimeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM'
  ];

  const services = [
    { 
      id: 1, 
      name: 'General Physician Consultation', 
      price: 50, 
      duration: '30 mins',
      description: 'Primary healthcare and routine checkups',
      icon: '👨‍⚕️',
      color: '#667eea'
    },
    { 
      id: 2, 
      name: 'Cardiology Consultation', 
      price: 80, 
      duration: '45 mins',
      description: 'Expert heart care and diagnosis',
      icon: '❤️',
      color: '#f56565'
    },
    { 
      id: 3, 
      name: 'Neurology Consultation', 
      price: 90, 
      duration: '60 mins',
      description: 'Brain and nervous system specialists',
      icon: '🧠',
      color: '#48bb78'
    },
    { 
      id: 4, 
      name: 'Dental Care', 
      price: 60, 
      duration: '45 mins',
      description: 'Complete dental checkup and treatment',
      icon: '🦷',
      color: '#ed8936'
    },
    { 
      id: 5, 
      name: 'Pediatric Care', 
      price: 55, 
      duration: '30 mins',
      description: 'Specialized care for children',
      icon: '👶',
      color: '#9f7aea'
    },
    { 
      id: 6, 
      name: 'Orthopedic Consultation', 
      price: 75, 
      duration: '45 mins',
      description: 'Bone and joint specialists',
      icon: '🦴',
      color: '#4299e1'
    }
  ];

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'General Medicine',
      experience: '15 years',
      rating: 4.9,
      reviews: 1250,
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      fee: 80,
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      experience: '12 years',
      rating: 4.8,
      reviews: 980,
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      fee: 90,
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pediatrics',
      experience: '10 years',
      rating: 4.9,
      reviews: 1560,
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
      fee: 55,
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Neurology',
      experience: '20 years',
      rating: 4.7,
      reviews: 2100,
      image: 'https://randomuser.me/api/portraits/men/4.jpg',
      fee: 50,
    }
  ];

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.displayName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Check availability when date changes
  useEffect(() => {
    if (selectedDate && selectedDoctor) {
      fetchAvailableTimeSlots();
    } else if (selectedDate) {
      // If no doctor selected yet, show all slots temporarily
      setAvailableTimeSlots(allTimeSlots);
    }
  }, [selectedDate, selectedDoctor]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    // Auto-select matching doctor based on service
    let matchingDoctor = null;
    if (service.name.includes('General')) {
      matchingDoctor = doctors.find(d => d.specialty === 'General Medicine');
    } else if (service.name.includes('Cardiology')) {
      matchingDoctor = doctors.find(d => d.specialty === 'Cardiology');
    } else if (service.name.includes('Pediatric')) {
      matchingDoctor = doctors.find(d => d.specialty === 'Pediatrics');
    } else if (service.name.includes('Neurology')) {
      matchingDoctor = doctors.find(d => d.specialty === 'Neurology');
    } else {
      matchingDoctor = doctors[0];
    }
    
    setSelectedDoctor(matchingDoctor);
    setCurrentStep(2);
  };

  const fetchAvailableTimeSlots = async () => {
    setCheckingAvailability(true);
    
    try {
      // Query Firestore for booked slots on this date
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('doctorId', '==', selectedDoctor?.id || 1),
        where('date', '==', selectedDate),
        where('status', 'in', ['pending', 'confirmed'])
      );
      
      const querySnapshot = await getDocs(q);
      const bookedSlots = [];
      
      querySnapshot.forEach((doc) => {
        bookedSlots.push(doc.data().timeSlot);
      });
      
      // Filter out booked slots
      const available = allTimeSlots.filter(slot => !bookedSlots.includes(slot));
      setAvailableTimeSlots(available);
      
      if (available.length === 0) {
        toast.error('No slots available on this date. Please select another date.');
      } else {
        toast.success(`${available.length} time slots available`);
      }
      
    } catch (error) {
      console.error('Error checking availability:', error);
      // If error (like no collection yet), show all slots
      setAvailableTimeSlots(allTimeSlots);
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleDateTimeSelect = () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }
    if (!selectedTimeSlot) {
      toast.error('Please select a time slot');
      return;
    }
    setCurrentStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const appointmentData = {
        appointmentId: `APT${Date.now()}${Math.floor(Math.random() * 1000)}`,
        userId: user.uid,
        userEmail: user.email,
        userName: formData.fullName,
        userPhone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        symptoms: formData.symptoms,
        previousHistory: formData.previousHistory,
        emergencyContact: formData.emergencyContact,
        insuranceInfo: formData.insuranceInfo,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
        serviceDuration: selectedService.duration,
        doctorId: selectedDoctor?.id || 1,
        doctorName: selectedDoctor?.name || 'Dr. Sarah Johnson',
        doctorSpecialty: selectedDoctor?.specialty || 'General Medicine',
        doctorFee: selectedDoctor?.fee || 50,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        status: 'confirmed',
        paymentStatus: 'pending',
        createdAt: Timestamp.now(),
        createdAtISO: new Date().toISOString()
      };

      await addDoc(collection(db, 'appointments'), appointmentData);
      
      toast.success(`Appointment booked successfully!`);
      toast.success(`Confirmation sent to ${formData.email}`);
      
      // Reset and redirect
      setCurrentStep(1);
      setSelectedService(null);
      setSelectedDoctor(null);
      setSelectedDate('');
      setSelectedTimeSlot('');
      setAvailableTimeSlots([]);
      
      navigate('/my-appointments');
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <>
      <Helmet>
        <title>Book Appointment - MediBook</title>
      </Helmet>

      <div className="booking-page">
        <div className="booking-header">
          <h1>Book an Appointment</h1>
          <p>Schedule your consultation in 3 easy steps</p>
        </div>

        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Select Service & Doctor</div>
          </div>
          <div className={`step-line ${currentStep >= 2 ? 'active' : ''}`}></div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Choose Date & Time</div>
          </div>
          <div className={`step-line ${currentStep >= 3 ? 'active' : ''}`}></div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Patient Information</div>
          </div>
        </div>

        <div className="booking-content">
          {/* Step 1: Select Service */}
          {currentStep === 1 && (
            <div className="step-content">
              <h2>Select Medical Service</h2>
              <div className="services-grid">
                {services.map(service => (
                  <div
                    key={service.id}
                    className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
                    onClick={() => handleServiceSelect(service)}
                  >
                    <div className="service-icon" style={{ background: service.color }}>
                      {service.icon}
                    </div>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    <div className="service-details">
                      <span>💰 ${service.price}</span>
                      <span>⏱️ {service.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {currentStep === 2 && (
            <div className="step-content">
              <h2>Select Date & Time</h2>
              
              <div className="datetime-container">
                <div className="date-section">
                  <label>Select Date</label>
                  <input
                    type="date"
                    min={getTodayDate()}
                    max={getMaxDate()}
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTimeSlot('');
                    }}
                    className="date-picker"
                  />
                </div>

                {selectedDate && (
                  <div className="time-section">
                    <label>Available Time Slots</label>
                    {checkingAvailability ? (
                      <div className="loading-slots">Checking availability...</div>
                    ) : (
                      <div className="time-slots">
                        {availableTimeSlots.length > 0 ? (
                          availableTimeSlots.map(slot => (
                            <button
                              key={slot}
                              className={`time-slot ${selectedTimeSlot === slot ? 'selected' : ''}`}
                              onClick={() => setSelectedTimeSlot(slot)}
                            >
                              {slot}
                            </button>
                          ))
                        ) : (
                          <div className="no-slots">
                            <p>No time slots available for this date.</p>
                            <p>Please select another date.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedDate && selectedTimeSlot && (
                <div className="booking-summary">
                  <h3>Booking Summary</h3>
                  <div className="summary-item">
                    <strong>Service:</strong> {selectedService?.name}
                  </div>
                  <div className="summary-item">
                    <strong>Doctor:</strong> {selectedDoctor?.name}
                  </div>
                  <div className="summary-item">
                    <strong>Date:</strong> {selectedDate}
                  </div>
                  <div className="summary-item">
                    <strong>Time:</strong> {selectedTimeSlot}
                  </div>
                  <div className="summary-item">
                    <strong>Total:</strong> ${selectedService?.price}
                  </div>
                </div>
              )}

              <div className="step-buttons">
                <button className="back-btn" onClick={() => setCurrentStep(1)}>
                  ← Back
                </button>
                <button 
                  className="next-btn"
                  onClick={handleDateTimeSelect}
                  disabled={!selectedDate || !selectedTimeSlot}
                >
                  Continue to Patient Info →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Patient Info */}
          {currentStep === 3 && (
            <div className="step-content">
              <h2>Patient Information</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Symptoms *</label>
                    <textarea
                      value={formData.symptoms}
                      onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                      rows="3"
                      required
                      placeholder="Describe your symptoms"
                    />
                  </div>
                </div>

                <div className="step-buttons">
                  <button type="button" className="back-btn" onClick={() => setCurrentStep(2)}>
                    ← Back
                  </button>
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'Booking...' : 'Confirm Appointment'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

               <style>{`
        .booking-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1rem;
          padding-top: 85px;  /* ← ADD THIS - pushes content below navbar */
        }

        .booking-header {
          text-align: center;
          color: white;
          margin-bottom: 1rem;
          padding: 0.5rem 0;
        }

        .booking-header h1 {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }

        .booking-header p {
          font-size: 0.875rem;
          opacity: 0.9;
        }

        .progress-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          max-width: 500px;
          margin: 0 auto 1.5rem;
          background: white;
          padding: 0.75rem;
          border-radius: 50px;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .step-number {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #718096;
          font-size: 0.875rem;
        }

        .step.active .step-number {
          background: #667eea;
          color: white;
        }

        .step-label {
          font-size: 0.7rem;
          color: #718096;
        }

        .step.active .step-label {
          color: #667eea;
          font-weight: 600;
        }

        .step-line {
          width: 40px;
          height: 2px;
          background: #e2e8f0;
          margin: 0 0.5rem;
        }

        .step-line.active {
          background: #667eea;
        }

        .booking-content {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          padding: 1.5rem;
        }

        .step-content h2 {
          color: #2d3748;
          margin-bottom: 1rem;
          font-size: 1.3rem;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1rem;
        }

        .service-card {
          background: #f7fafc;
          border-radius: 12px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          border: 2px solid transparent;
        }

        .service-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .service-card.selected {
          border-color: #667eea;
          background: white;
        }

        .service-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .service-card h3 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }

        .service-card p {
          font-size: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .service-details {
          display: flex;
          gap: 1rem;
          font-size: 0.75rem;
        }

        .datetime-container {
          display: grid;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        label {
          font-weight: 600;
          color: #2d3748;
          display: block;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .date-picker {
          width: 100%;
          padding: 0.6rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
        }

        .time-slots {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
          gap: 0.5rem;
        }

        .time-slot {
          padding: 0.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.8rem;
        }

        .time-slot:hover {
          border-color: #667eea;
          transform: translateY(-2px);
        }

        .time-slot.selected {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .booking-summary {
          background: #f7fafc;
          border-radius: 12px;
          padding: 1rem;
          margin: 1.5rem 0;
        }

        .booking-summary h3 {
          margin-bottom: 0.75rem;
          font-size: 1rem;
        }

        .summary-item {
          margin-bottom: 0.35rem;
          font-size: 0.85rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .form-group.full-width {
          grid-column: span 2;
        }

        .form-group label {
          font-size: 0.8rem;
          font-weight: 600;
        }

        .form-group input,
        .form-group textarea {
          padding: 0.6rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.85rem;
        }

        .step-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          justify-content: space-between;
        }

        .back-btn, .next-btn, .submit-btn {
          padding: 0.6rem 1.2rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .back-btn {
          background: #f7fafc;
          border: 2px solid #e2e8f0;
        }

        .next-btn, .submit-btn {
          background: #667eea;
          color: white;
        }

        .next-btn:disabled, .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .no-slots, .loading-slots {
          text-align: center;
          padding: 1.5rem;
          background: #fff5e6;
          border-radius: 8px;
          color: #ed8936;
          font-size: 0.85rem;
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .booking-page {
            padding: 0.5rem;
            padding-top: 75px;  /* Smaller padding for mobile */
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
          .form-group.full-width {
            grid-column: span 1;
          }
          .progress-steps {
            max-width: 100%;
            padding: 0.5rem;
          }
          .step-line {
            width: 20px;
          }
          .booking-header h1 {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </>
  );
};

export default BookAppointment;