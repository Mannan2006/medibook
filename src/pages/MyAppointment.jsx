// src/pages/MyAppointments.jsx - Fixed Version (No Index Required)
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, updateDoc, doc, orderBy, limit } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUserMd, 
  FaMapMarkerAlt, 
  FaPhoneAlt,
  FaVideo,
  FaTimesCircle,
  FaCheckCircle,
  FaSpinner,
  FaSearch,
  FaStar,
  FaArrowLeft,
  FaArrowRight,
  FaSync
} from 'react-icons/fa';

const MyAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortAppointments();
  }, [appointments, filterStatus, searchTerm, sortBy]);

  const fetchAppointments = async () => {
    if (!user) {
      console.log('No user logged in');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching appointments for user:', user.uid);
      
      // SIMPLIFIED QUERY - NO INDEX NEEDED
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('userId', '==', user.uid)
        // Removed orderBy to avoid index requirement
      );
      
      const querySnapshot = await getDocs(q);
      const appointmentsList = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        appointmentsList.push({ id: doc.id, ...data });
      });
      
      console.log('Raw appointments fetched:', appointmentsList.length);
      
      // Sort manually in JavaScript (no index needed)
      appointmentsList.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAtISO || a.date || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAtISO || b.date || 0);
        return dateB - dateA;
      });
      
      console.log('Sorted appointments:', appointmentsList.length);
      setAppointments(appointmentsList);
      
      if (appointmentsList.length === 0) {
        console.log('No appointments found for this user');
      }
      
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError(error.message);
      toast.error('Failed to load appointments: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
    toast.success('Appointments refreshed');
  };

  const filterAndSortAppointments = () => {
    let filtered = [...appointments];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === filterStatus);
    }

    if (searchTerm) {
      filtered = filtered.filter(apt => {
        const serviceName = apt.serviceName || apt.service || '';
        const doctorName = apt.doctorName || apt.doctor || '';
        return serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               doctorName.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'service') {
      filtered.sort((a, b) => (a.serviceName || a.service || '').localeCompare(b.serviceName || b.service || ''));
    } else if (sortBy === 'status') {
      filtered.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
    }

    setFilteredAppointments(filtered);
    setCurrentPage(1);
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await updateDoc(doc(db, 'appointments', appointmentId), {
          status: 'cancelled',
          cancelledAt: new Date().toISOString()
        });
        toast.success('Appointment cancelled successfully');
        fetchAppointments();
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        toast.error('Failed to cancel appointment');
      }
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { icon: <FaSpinner />, color: '#ed8936', bg: '#fff5e6', text: 'Pending' },
      confirmed: { icon: <FaCheckCircle />, color: '#48bb78', bg: '#e6f7e6', text: 'Confirmed' },
      completed: { icon: <FaStar />, color: '#4299e1', bg: '#e6f3ff', text: 'Completed' },
      cancelled: { icon: <FaTimesCircle />, color: '#f56565', bg: '#ffe6e6', text: 'Cancelled' }
    };
    const statusConfig = config[status] || config.pending;
    return (
      <span style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        padding: '0.25rem 0.75rem', 
        borderRadius: '20px', 
        fontSize: '0.8rem', 
        fontWeight: 600,
        background: statusConfig.bg, 
        color: statusConfig.color 
      }}>
        {statusConfig.icon}
        {statusConfig.text}
      </span>
    );
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAppointments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f7fafc' }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Appointments - MediBook</title>
      </Helmet>

      <div className="appointments-container">
        <div className="appointments-header">
          <div>
            <h1>My Appointments</h1>
            <p>Manage all your medical appointments in one place</p>
          </div>
          <button className="refresh-btn" onClick={handleRefresh} disabled={refreshing}>
            <FaSync className={refreshing ? 'spinning' : ''} /> Refresh
          </button>
        </div>

        {error && (
          <div className="error-banner">
            <span>⚠️</span>
            <p>Having trouble loading appointments. <button onClick={fetchAppointments}>Click here to retry</button></p>
          </div>
        )}

        <div className="stats-row">
          <div className="stat-card"><div className="stat-value">{appointments.length}</div><div className="stat-label">Total</div></div>
          <div className="stat-card"><div className="stat-value">{appointments.filter(a => a.status === 'confirmed').length}</div><div className="stat-label">Confirmed</div></div>
          <div className="stat-card"><div className="stat-value">{appointments.filter(a => a.status === 'pending').length}</div><div className="stat-label">Pending</div></div>
          <div className="stat-card"><div className="stat-value">{appointments.filter(a => a.status === 'completed').length}</div><div className="stat-label">Completed</div></div>
        </div>

        <div className="filters-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search by service or doctor..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="filter-controls">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
              <option value="all">All Status</option><option value="confirmed">Confirmed</option><option value="pending">Pending</option>
              <option value="completed">Completed</option><option value="cancelled">Cancelled</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
              <option value="date">Sort by Date</option><option value="service">Sort by Service</option><option value="status">Sort by Status</option>
            </select>
            <div className="view-toggle">
              <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>Grid</button>
              <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>List</button>
            </div>
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No Appointments Found</h3>
            <p>{appointments.length === 0 ? "You haven't booked any appointments yet." : "No appointments match your filters."}</p>
            <button onClick={() => window.location.href = '/book'} className="book-btn">Book Your First Appointment</button>
          </div>
        ) : (
          <>
            <div className={`appointments-${viewMode}`}>
              {currentItems.map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <div className="card-header">
                    <div><h3>{appointment.serviceName || appointment.service || 'Medical Service'}</h3><p className="doctor-name">👨‍⚕️ {appointment.doctorName || 'Doctor'}</p></div>
                    {getStatusBadge(appointment.status)}
                  </div>
                  <div className="card-details">
                    <div className="detail-row"><FaCalendarAlt /><span><strong>Date:</strong> {appointment.date}</span></div>
                    <div className="detail-row"><FaClock /><span><strong>Time:</strong> {appointment.timeSlot}</span></div>
                    <div className="detail-row"><FaUserMd /><span><strong>Doctor:</strong> {appointment.doctorName}</span></div>
                    <div className="detail-row"><FaMapMarkerAlt /><span><strong>Location:</strong> MediBook Healthcare Center</span></div>
                    <div className="detail-row"><FaPhoneAlt /><span><strong>Contact:</strong> {appointment.userPhone || 'N/A'}</span></div>
                  </div>
                  {appointment.symptoms && (<div className="symptoms-section"><strong>Symptoms:</strong><p>{appointment.symptoms}</p></div>)}
                  {appointment.appointmentId && (<div className="appointment-id"><strong>Appointment ID:</strong> {appointment.appointmentId}</div>)}
                  {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                    <div className="card-actions">
                      <button className="cancel-btn" onClick={() => handleCancelAppointment(appointment.id)}>Cancel Appointment</button>
                      {appointment.status === 'confirmed' && <button className="video-btn"><FaVideo /> Join Video Call</button>}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {totalPages > 1 && (<div className="pagination"><button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}><FaArrowLeft /> Previous</button><span>Page {currentPage} of {totalPages}</span><button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next <FaArrowRight /></button></div>)}
          </>
        )}
      </div>

      <style>{`
        .appointments-container { max-width: 1200px; margin: 0 auto; padding: 2rem; min-height: 100vh; background: #f7fafc; }
        .loader { width: 50px; height: 50px; border: 3px solid #e2e8f0; border-top: 3px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .appointments-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
        .appointments-header h1 { font-size: 2rem; color: #2d3748; margin-bottom: 0.5rem; }
        .refresh-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: white; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; }
        .spinning { animation: spin 1s linear infinite; }
        .error-banner { background: #fee; border: 1px solid #f56565; border-radius: 12px; padding: 1rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 1rem; }
        .error-banner button { background: none; border: none; color: #667eea; cursor: pointer; text-decoration: underline; }
        .stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: white; padding: 1rem; border-radius: 12px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stat-value { font-size: 1.5rem; font-weight: bold; color: #667eea; }
        .filters-section { background: white; padding: 1rem; border-radius: 12px; margin-bottom: 2rem; }
        .search-box { position: relative; margin-bottom: 1rem; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #a0aec0; }
        .search-box input { width: 100%; padding: 0.6rem 1rem 0.6rem 2.5rem; border: 2px solid #e2e8f0; border-radius: 8px; }
        .filter-controls { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .filter-select { padding: 0.5rem; border: 2px solid #e2e8f0; border-radius: 6px; }
        .view-toggle { display: flex; gap: 0; }
        .view-toggle button { padding: 0.5rem 1rem; border: 2px solid #e2e8f0; background: white; cursor: pointer; }
        .view-toggle button:first-child { border-radius: 6px 0 0 6px; }
        .view-toggle button:last-child { border-radius: 0 6px 6px 0; }
        .view-toggle button.active { background: #667eea; color: white; }
        .appointments-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 1.5rem; }
        .appointment-card { background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s; }
        .appointment-card:hover { transform: translateY(-2px); }
        .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #e2e8f0; flex-wrap: wrap; gap: 0.5rem; }
        .card-header h3 { font-size: 1.1rem; margin-bottom: 0.25rem; }
        .doctor-name { font-size: 0.8rem; color: #667eea; }
        .card-details { margin-bottom: 1rem; }
        .detail-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-size: 0.85rem; }
        .symptoms-section, .appointment-id { background: #f7fafc; padding: 0.75rem; border-radius: 8px; margin-bottom: 0.5rem; font-size: 0.8rem; }
        .card-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
        .cancel-btn { padding: 0.5rem 1rem; background: #f56565; color: white; border: none; border-radius: 6px; cursor: pointer; }
        .video-btn { padding: 0.5rem 1rem; background: #48bb78; color: white; border: none; border-radius: 6px; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
        .empty-state { text-align: center; padding: 4rem; background: white; border-radius: 20px; }
        .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
        .book-btn { margin-top: 1rem; padding: 0.75rem 1.5rem; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; }
        .pagination { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-top: 2rem; }
        .pagination button { padding: 0.5rem 1rem; background: white; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; }
        @media (max-width: 768px) { .appointments-container { padding: 1rem; } .appointments-grid { grid-template-columns: 1fr; } .appointments-header { flex-direction: column; text-align: center; } }
      `}</style>
    </>
  );
};

export default MyAppointments;