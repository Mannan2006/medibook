// src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    bloodGroup: '',
    allergies: '',
    emergencyContact: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchAppointments();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setFormData({
          name: data.fullName || user.displayName || '',
          phone: data.phone || '',
          dateOfBirth: data.dateOfBirth || '',
          address: data.address || '',
          bloodGroup: data.bloodGroup || '',
          allergies: data.allergies || '',
          emergencyContact: data.emergencyContact || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(appointmentsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const appointmentsList = [];
      querySnapshot.forEach((doc) => {
        appointmentsList.push({ id: doc.id, ...doc.data() });
      });
      setAppointments(appointmentsList);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      // Update Firebase Auth profile
      if (formData.name !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName: formData.name });
      }

      // Update Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        fullName: formData.name,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        bloodGroup: formData.bloodGroup,
        allergies: formData.allergies,
        emergencyContact: formData.emergencyContact,
        updatedAt: new Date().toISOString()
      });

      setUserData({ ...userData, ...formData });
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwordData.newPassword);
      
      toast.success('Password updated successfully!');
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        toast.error('Current password is incorrect');
      } else {
        toast.error('Failed to update password');
      }
    }
  };

  const getUpcomingAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.date >= today && apt.status !== 'cancelled');
  };

  const getPastAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter(apt => apt.date < today || apt.status === 'completed');
  };

  const stats = [
    { label: 'Total Appointments', value: appointments.length, icon: '📅', color: '#667eea' },
    { label: 'Upcoming', value: getUpcomingAppointments().length, icon: '⏰', color: '#48bb78' },
    { label: 'Completed', value: getPastAppointments().length, icon: '✅', color: '#4299e1' },
    { label: 'Health Score', value: '92%', icon: '💪', color: '#ed8936' }
  ];

  const medicalRecords = [
    { id: 1, name: 'Blood Test Report', date: '2024-01-15', type: 'PDF', size: '2.4 MB' },
    { id: 2, name: 'X-Ray Results', date: '2024-01-10', type: 'Image', size: '5.1 MB' },
    { id: 3, name: 'Prescription - March', date: '2024-03-01', type: 'PDF', size: '1.2 MB' },
    { id: 4, name: 'Vaccination Record', date: '2024-02-20', type: 'PDF', size: '0.8 MB' }
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Profile - MediBook | Patient Dashboard</title>
        <meta name="description" content="View and manage your profile, appointments, medical records, and account settings." />
      </Helmet>

      <div className="profile-page">
        <div className="profile-container">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="profile-avatar">
              <div className="avatar-image">
                <span className="avatar-emoji">👤</span>
              </div>
              <h3>{userData?.fullName || user?.displayName || 'Patient'}</h3>
              <p>{user?.email}</p>
              <div className="member-since">
                Member since {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : '2024'}
              </div>
            </div>

            <nav className="profile-nav">
              <button 
                className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <span className="nav-icon">📊</span>
                Overview
              </button>
              <button 
                className={`nav-item ${activeTab === 'appointments' ? 'active' : ''}`}
                onClick={() => setActiveTab('appointments')}
              >
                <span className="nav-icon">📅</span>
                Appointments
              </button>
              <button 
                className={`nav-item ${activeTab === 'medical' ? 'active' : ''}`}
                onClick={() => setActiveTab('medical')}
              >
                <span className="nav-icon">🏥</span>
                Medical Records
              </button>
              <button 
                className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <span className="nav-icon">⚙️</span>
                Settings
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="profile-content">
            <AnimatePresence mode="wait">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="tab-content"
                >
                  <div className="welcome-header">
                    <h1>Welcome back, {userData?.fullName?.split(' ')[0] || 'Patient'}! 👋</h1>
                    <p>Here's what's happening with your health today</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="stats-grid">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        className="stat-card"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="stat-icon" style={{ background: stat.color }}>
                          {stat.icon}
                        </div>
                        <div className="stat-info">
                          <h3>{stat.value}</h3>
                          <p>{stat.label}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="actions-grid">
                      <button className="action-card" onClick={() => navigate('/book')}>
                        <span>📅</span>
                        Book Appointment
                      </button>
                      <button className="action-card" onClick={() => setActiveTab('appointments')}>
                        <span>👨‍⚕️</span>
                        View Upcoming
                      </button>
                      <button className="action-card" onClick={() => setActiveTab('medical')}>
                        <span>📄</span>
                        Medical Records
                      </button>
                      <button className="action-card" onClick={() => setActiveTab('settings')}>
                        <span>⚙️</span>
                        Update Profile
                      </button>
                    </div>
                  </div>

                  {/* Recent Appointments */}
                  <div className="recent-appointments">
                    <h2>Recent Appointments</h2>
                    {getUpcomingAppointments().slice(0, 3).length > 0 ? (
                      getUpcomingAppointments().slice(0, 3).map((apt, index) => (
                        <div key={index} className="recent-card">
                          <div className="recent-info">
                            <strong>{apt.serviceName || apt.service}</strong>
                            <span>{apt.date} at {apt.timeSlot}</span>
                            <span className="doctor-name">Dr. {apt.doctorName || 'Sarah Johnson'}</span>
                          </div>
                          <div className="recent-status status-{apt.status}">
                            {apt.status || 'Confirmed'}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-data">No upcoming appointments</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Appointments Tab */}
              {activeTab === 'appointments' && (
                <motion.div
                  key="appointments"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="tab-content"
                >
                  <h1>My Appointments</h1>
                  <div className="appointments-tabs">
                    <button className="appointment-tab active">Upcoming</button>
                    <button className="appointment-tab">Past</button>
                    <button className="appointment-tab">Cancelled</button>
                  </div>

                  <div className="appointments-list">
                    {getUpcomingAppointments().length > 0 ? (
                      getUpcomingAppointments().map((apt, index) => (
                        <div key={index} className="appointment-item">
                          <div className="appointment-date">
                            <span className="date-day">{new Date(apt.date).getDate()}</span>
                            <span className="date-month">{new Date(apt.date).toLocaleString('default', { month: 'short' })}</span>
                          </div>
                          <div className="appointment-details">
                            <h3>{apt.serviceName || apt.service}</h3>
                            <p>Dr. {apt.doctorName || 'Sarah Johnson'}</p>
                            <p className="appointment-time">{apt.timeSlot}</p>
                          </div>
                          <div className="appointment-actions">
                            <button className="reschedule-btn">Reschedule</button>
                            <button className="cancel-btn">Cancel</button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-data">No upcoming appointments</p>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Medical Records Tab */}
              {activeTab === 'medical' && (
                <motion.div
                  key="medical"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="tab-content"
                >
                  <h1>Medical Records</h1>
                  <div className="health-summary">
                    <div className="health-card">
                      <h3>Blood Group</h3>
                      <p>{userData?.bloodGroup || 'Not specified'}</p>
                    </div>
                    <div className="health-card">
                      <h3>Allergies</h3>
                      <p>{userData?.allergies || 'None reported'}</p>
                    </div>
                    <div className="health-card">
                      <h3>Emergency Contact</h3>
                      <p>{userData?.emergencyContact || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="records-list">
                    <h2>Documents & Reports</h2>
                    {medicalRecords.map(record => (
                      <div key={record.id} className="record-item">
                        <div className="record-icon">📄</div>
                        <div className="record-info">
                          <h4>{record.name}</h4>
                          <p>Uploaded on {record.date} • {record.size}</p>
                        </div>
                        <button className="download-btn">Download</button>
                      </div>
                    ))}
                  </div>

                  <button className="upload-btn">+ Upload New Record</button>
                </motion.div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="tab-content"
                >
                  <h1>Account Settings</h1>
                  
                  <div className="settings-section">
                    <div className="section-header">
                      <h2>Personal Information</h2>
                      {!editing && (
                        <button className="edit-btn" onClick={() => setEditing(true)}>
                          Edit Profile
                        </button>
                      )}
                    </div>

                    {editing ? (
                      <form onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }} className="profile-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label>Full Name</label>
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                          </div>
                          <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={user?.email} disabled />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Phone Number</label>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
                        </div>

                        <div className="form-group">
                          <label>Address</label>
                          <textarea
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            rows="2"
                          />
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Blood Group</label>
                            <select
                              value={formData.bloodGroup}
                              onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                            >
                              <option value="">Select</option>
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Emergency Contact</label>
                            <input
                              type="tel"
                              value={formData.emergencyContact}
                              onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                              placeholder="Emergency contact number"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Allergies / Medical Conditions</label>
                          <textarea
                            value={formData.allergies}
                            onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                            rows="2"
                            placeholder="List any allergies or medical conditions"
                          />
                        </div>

                        <div className="form-actions">
                          <button type="submit" className="save-btn">Save Changes</button>
                          <button type="button" className="cancel-btn" onClick={() => setEditing(false)}>Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <div className="profile-info-display">
                        <div className="info-row">
                          <label>Full Name:</label>
                          <span>{formData.name || 'Not set'}</span>
                        </div>
                        <div className="info-row">
                          <label>Email:</label>
                          <span>{user?.email}</span>
                        </div>
                        <div className="info-row">
                          <label>Phone:</label>
                          <span>{formData.phone || 'Not set'}</span>
                        </div>
                        <div className="info-row">
                          <label>Date of Birth:</label>
                          <span>{formData.dateOfBirth || 'Not set'}</span>
                        </div>
                        <div className="info-row">
                          <label>Address:</label>
                          <span>{formData.address || 'Not set'}</span>
                        </div>
                        <div className="info-row">
                          <label>Blood Group:</label>
                          <span>{formData.bloodGroup || 'Not set'}</span>
                        </div>
                        <div className="info-row">
                          <label>Emergency Contact:</label>
                          <span>{formData.emergencyContact || 'Not set'}</span>
                        </div>
                        <div className="info-row">
                          <label>Allergies:</label>
                          <span>{formData.allergies || 'None reported'}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="settings-section">
                    <h2>Security</h2>
                    <button className="password-btn" onClick={() => setShowPasswordModal(true)}>
                      Change Password
                    </button>
                  </div>

                  <div className="settings-section danger">
                    <h2>Danger Zone</h2>
                    <button className="delete-btn">Delete Account</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Change Password Modal */}
        <AnimatePresence>
          {showPasswordModal && (
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordModal(false)}
            >
              <motion.div
                className="modal-content"
                initial={{ scale: 0.9, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 50 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2>Change Password</h2>
                <form onSubmit={handleChangePassword}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div className="modal-actions">
                    <button type="submit" className="save-btn">Update Password</button>
                    <button type="button" className="cancel-btn" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .profile-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
        }

        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          display: grid;
          grid-template-columns: 300px 1fr;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }

        /* Sidebar */
        .profile-sidebar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
        }

        .profile-avatar {
          text-align: center;
          margin-bottom: 2rem;
        }

        .avatar-image {
          width: 100px;
          height: 100px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .avatar-emoji {
          font-size: 3rem;
        }

        .profile-avatar h3 {
          margin-bottom: 0.5rem;
        }

        .profile-avatar p {
          opacity: 0.9;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .member-since {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        .profile-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.1);
          border: none;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.3s;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.2);
        }

        .nav-item.active {
          background: white;
          color: #667eea;
        }

        .nav-icon {
          font-size: 1.2rem;
        }

        /* Main Content */
        .profile-content {
          padding: 2rem;
          background: #f7fafc;
        }

        .tab-content h1 {
          margin-bottom: 1.5rem;
          color: #2d3748;
        }

        .welcome-header {
          margin-bottom: 2rem;
        }

        .welcome-header h1 {
          margin-bottom: 0.5rem;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-info h3 {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
        }

        .stat-info p {
          color: #718096;
          font-size: 0.875rem;
        }

        /* Quick Actions */
        .quick-actions h2, .recent-appointments h2 {
          margin-bottom: 1rem;
          color: #2d3748;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .action-card {
          padding: 1rem;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .action-card:hover {
          border-color: #667eea;
          transform: translateY(-2px);
        }

        .action-card span {
          display: block;
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        /* Recent Appointments */
        .recent-card {
          background: white;
          padding: 1rem;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .recent-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .recent-info strong {
          color: #2d3748;
        }

        .recent-info span {
          font-size: 0.875rem;
          color: #718096;
        }

        .doctor-name {
          font-weight: 600;
          color: #667eea;
        }

        .recent-status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-confirmed {
          background: #e6f7e6;
          color: #48bb78;
        }

        /* Appointments List */
        .appointments-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .appointment-tab {
          padding: 0.5rem 1rem;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
        }

        .appointment-item {
          background: white;
          padding: 1rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .appointment-date {
          text-align: center;
          min-width: 60px;
        }

        .date-day {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
          color: #667eea;
        }

        .date-month {
          font-size: 0.75rem;
          color: #718096;
        }

        .appointment-details {
          flex: 1;
        }

        .appointment-details h3 {
          margin-bottom: 0.25rem;
        }

        .appointment-time {
          font-size: 0.875rem;
          color: #718096;
        }

        .appointment-actions {
          display: flex;
          gap: 0.5rem;
        }

        .reschedule-btn, .cancel-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .reschedule-btn {
          background: #667eea;
          color: white;
        }

        .cancel-btn {
          background: #f56565;
          color: white;
        }

        /* Medical Records */
        .health-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .health-card {
          background: white;
          padding: 1rem;
          border-radius: 12px;
        }

        .health-card h3 {
          font-size: 0.875rem;
          color: #718096;
          margin-bottom: 0.5rem;
        }

        .health-card p {
          font-weight: 600;
          color: #2d3748;
        }

        .records-list {
          background: white;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .records-list h2 {
          margin-bottom: 1rem;
        }

        .record-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .record-icon {
          font-size: 1.5rem;
        }

        .record-info {
          flex: 1;
        }

        .record-info h4 {
          margin-bottom: 0.25rem;
        }

        .record-info p {
          font-size: 0.75rem;
          color: #718096;
        }

        .download-btn {
          padding: 0.25rem 0.75rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .upload-btn {
          width: 100%;
          padding: 0.75rem;
          background: white;
          border: 2px dashed #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
        }

        /* Settings */
        .settings-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .edit-btn {
          padding: 0.5rem 1rem;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .profile-form {
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
        }

        .profile-info-display {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .info-row {
          display: flex;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .info-row label {
          width: 150px;
          font-weight: 600;
          color: #2d3748;
        }

        .info-row span {
          color: #718096;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .save-btn, .password-btn {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .danger {
          border: 2px solid #f56565;
        }

        .delete-btn {
          padding: 0.75rem 1.5rem;
          background: white;
          color: #f56565;
          border: 2px solid #f56565;
          border-radius: 8px;
          cursor: pointer;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          width: 400px;
          max-width: 90%;
        }

        .modal-content h2 {
          margin-bottom: 1rem;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .no-data {
          text-align: center;
          padding: 2rem;
          color: #718096;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }

        .loader {
          width: 50px;
          height: 50px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .profile-container {
            grid-template-columns: 1fr;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .info-row {
            flex-direction: column;
          }
          
          .info-row label {
            width: 100%;
            margin-bottom: 0.25rem;
          }
        }
      `}</style>
    </>
  );
};

export default Profile;