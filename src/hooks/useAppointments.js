// src/hooks/useAppointments.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { db } from '../firebase/config';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy, 
  limit,
  startAfter,
  Timestamp,
  getDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import toast from 'react-hot-toast';

export const useAppointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [cancelledAppointments, setCancelledAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0,
    totalSpent: 0
  });

  // Fetch all appointments for current user
  const fetchAppointments = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const appointmentsList = [];
      let totalSpent = 0;
      
      querySnapshot.forEach((doc) => {
        const appointment = { id: doc.id, ...doc.data() };
        appointmentsList.push(appointment);
        if (appointment.status === 'completed' && appointment.servicePrice) {
          totalSpent += appointment.servicePrice;
        }
      });
      
      setAppointments(appointmentsList);
      
      // Categorize appointments
      const today = new Date().toISOString().split('T')[0];
      const upcoming = appointmentsList.filter(apt => 
        apt.date >= today && apt.status !== 'cancelled'
      );
      const past = appointmentsList.filter(apt => 
        (apt.date < today || apt.status === 'completed') && apt.status !== 'cancelled'
      );
      const cancelled = appointmentsList.filter(apt => apt.status === 'cancelled');
      
      setUpcomingAppointments(upcoming);
      setPastAppointments(past);
      setCancelledAppointments(cancelled);
      
      // Update stats
      setStats({
        total: appointmentsList.length,
        upcoming: upcoming.length,
        completed: past.length,
        cancelled: cancelled.length,
        totalSpent: totalSpent
      });
      
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch appointments with pagination
  const fetchAppointmentsPaginated = useCallback(async (pageSize = 10) => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const appointmentsRef = collection(db, 'appointments');
      let q = query(
        appointmentsRef,
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      );
      
      if (lastDoc) {
        q = query(
          appointmentsRef,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          startAfter(lastDoc),
          limit(pageSize)
        );
      }
      
      const querySnapshot = await getDocs(q);
      const appointmentsList = [];
      
      querySnapshot.forEach((doc) => {
        appointmentsList.push({ id: doc.id, ...doc.data() });
      });
      
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1]);
      setHasMore(querySnapshot.docs.length === pageSize);
      setAppointments(prev => [...prev, ...appointmentsList]);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, lastDoc]);

  // Book a new appointment
  const bookAppointment = useCallback(async (appointmentData) => {
    if (!user) {
      toast.error('Please login to book an appointment');
      return { success: false, error: 'Not authenticated' };
    }
    
    try {
      // Check for double booking
      const isAvailable = await checkAvailability(
        appointmentData.doctorId,
        appointmentData.date,
        appointmentData.timeSlot
      );
      
      if (!isAvailable) {
        toast.error('This time slot is already booked. Please choose another time.');
        return { success: false, error: 'Slot not available' };
      }
      
      const appointmentsRef = collection(db, 'appointments');
      const newAppointment = {
        ...appointmentData,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || appointmentData.userName,
        status: 'pending',
        createdAt: new Date().toISOString(),
        appointmentNumber: `APPT${Date.now()}`,
        paymentStatus: 'pending',
        reminderSent: false
      };
      
      const docRef = await addDoc(appointmentsRef, newAppointment);
      
      // Update user's appointment count
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        appointmentsCount: arrayUnion(docRef.id)
      });
      
      toast.success(`Appointment booked successfully! ID: ${newAppointment.appointmentNumber}`);
      toast.success(`Confirmation sent to ${user.email}`);
      
      // Refresh appointments list
      await fetchAppointments();
      
      return { success: true, id: docRef.id, data: newAppointment };
      
    } catch (err) {
      console.error('Error booking appointment:', err);
      toast.error('Failed to book appointment. Please try again.');
      return { success: false, error: err.message };
    }
  }, [user, fetchAppointments]);

  // Check availability for a time slot
  const checkAvailability = useCallback(async (doctorId, date, timeSlot) => {
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('doctorId', '==', doctorId),
        where('date', '==', date),
        where('timeSlot', '==', timeSlot),
        where('status', 'in', ['pending', 'confirmed'])
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.empty;
      
    } catch (err) {
      console.error('Error checking availability:', err);
      return false;
    }
  }, []);

  // Get available time slots for a doctor on a specific date
  const getAvailableTimeSlots = useCallback(async (doctorId, date, allTimeSlots) => {
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('doctorId', '==', doctorId),
        where('date', '==', date),
        where('status', 'in', ['pending', 'confirmed'])
      );
      
      const querySnapshot = await getDocs(q);
      const bookedSlots = [];
      
      querySnapshot.forEach((doc) => {
        bookedSlots.push(doc.data().timeSlot);
      });
      
      const availableSlots = allTimeSlots.filter(slot => !bookedSlots.includes(slot));
      return availableSlots;
      
    } catch (err) {
      console.error('Error getting available slots:', err);
      return allTimeSlots;
    }
  }, []);

  // Cancel an appointment
  const cancelAppointment = useCallback(async (appointmentId, reason = '') => {
    if (!user) {
      toast.error('Please login to cancel appointment');
      return false;
    }
    
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      const appointmentDoc = await getDoc(appointmentRef);
      
      if (!appointmentDoc.exists()) {
        toast.error('Appointment not found');
        return false;
      }
      
      const appointmentData = appointmentDoc.data();
      
      // Check if appointment can be cancelled (more than 24 hours before)
      const appointmentDate = new Date(appointmentData.date);
      const now = new Date();
      const hoursDiff = (appointmentDate - now) / (1000 * 60 * 60);
      
      if (hoursDiff < 24 && appointmentData.status === 'confirmed') {
        toast.error('Appointments can only be cancelled 24 hours in advance');
        return false;
      }
      
      await updateDoc(appointmentRef, {
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
        cancellationReason: reason,
        cancelledBy: user.uid
      });
      
      toast.success('Appointment cancelled successfully');
      await fetchAppointments();
      return true;
      
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      toast.error('Failed to cancel appointment');
      return false;
    }
  }, [user, fetchAppointments]);

  // Reschedule an appointment
  const rescheduleAppointment = useCallback(async (appointmentId, newDate, newTimeSlot) => {
    if (!user) {
      toast.error('Please login to reschedule');
      return false;
    }
    
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      const appointmentDoc = await getDoc(appointmentRef);
      
      if (!appointmentDoc.exists()) {
        toast.error('Appointment not found');
        return false;
      }
      
      const appointmentData = appointmentDoc.data();
      
      // Check availability for new slot
      const isAvailable = await checkAvailability(
        appointmentData.doctorId,
        newDate,
        newTimeSlot
      );
      
      if (!isAvailable) {
        toast.error('Selected time slot is not available');
        return false;
      }
      
      await updateDoc(appointmentRef, {
        date: newDate,
        timeSlot: newTimeSlot,
        status: 'pending',
        rescheduledAt: new Date().toISOString(),
        previousDate: appointmentData.date,
        previousTimeSlot: appointmentData.timeSlot
      });
      
      toast.success('Appointment rescheduled successfully');
      await fetchAppointments();
      return true;
      
    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      toast.error('Failed to reschedule appointment');
      return false;
    }
  }, [user, checkAvailability, fetchAppointments]);

  // Update appointment status
  const updateAppointmentStatus = useCallback(async (appointmentId, status, notes = '') => {
    if (!user) return false;
    
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, {
        status: status,
        statusUpdatedAt: new Date().toISOString(),
        statusNotes: notes
      });
      
      toast.success(`Appointment ${status}`);
      await fetchAppointments();
      return true;
      
    } catch (err) {
      console.error('Error updating appointment status:', err);
      toast.error('Failed to update appointment status');
      return false;
    }
  }, [user, fetchAppointments]);

  // Get appointment by ID
  const getAppointmentById = useCallback(async (appointmentId) => {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      const appointmentDoc = await getDoc(appointmentRef);
      
      if (appointmentDoc.exists()) {
        return { id: appointmentDoc.id, ...appointmentDoc.data() };
      }
      return null;
      
    } catch (err) {
      console.error('Error getting appointment:', err);
      return null;
    }
  }, []);

  // Get appointments by date range
  const getAppointmentsByDateRange = useCallback(async (startDate, endDate) => {
    if (!user) return [];
    
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('userId', '==', user.uid),
        where('date', '>=', startDate),
        where('date', '<=', endDate),
        orderBy('date', 'asc')
      );
      
      const querySnapshot = await getDocs(q);
      const appointmentsList = [];
      
      querySnapshot.forEach((doc) => {
        appointmentsList.push({ id: doc.id, ...doc.data() });
      });
      
      return appointmentsList;
      
    } catch (err) {
      console.error('Error fetching appointments by date:', err);
      return [];
    }
  }, [user]);

  // Get appointments by doctor
  const getAppointmentsByDoctor = useCallback(async (doctorId) => {
    if (!user) return [];
    
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('userId', '==', user.uid),
        where('doctorId', '==', doctorId),
        orderBy('date', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const appointmentsList = [];
      
      querySnapshot.forEach((doc) => {
        appointmentsList.push({ id: doc.id, ...doc.data() });
      });
      
      return appointmentsList;
      
    } catch (err) {
      console.error('Error fetching appointments by doctor:', err);
      return [];
    }
  }, [user]);

  // Get upcoming appointments (next 7 days)
  const getUpcomingWeekAppointments = useCallback(async () => {
    if (!user) return [];
    
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    
    return await getAppointmentsByDateRange(today, nextWeekStr);
  }, [user, getAppointmentsByDateRange]);

  // Get appointment statistics by month
  const getMonthlyStats = useCallback(async (year, month) => {
    if (!user) return null;
    
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;
    
    const monthAppointments = await getAppointmentsByDateRange(startDate, endDate);
    
    const stats = {
      total: monthAppointments.length,
      completed: monthAppointments.filter(a => a.status === 'completed').length,
      cancelled: monthAppointments.filter(a => a.status === 'cancelled').length,
      totalRevenue: monthAppointments
        .filter(a => a.status === 'completed')
        .reduce((sum, a) => sum + (a.servicePrice || 0), 0),
      byService: {}
    };
    
    // Group by service
    monthAppointments.forEach(apt => {
      const service = apt.serviceName || apt.service;
      if (!stats.byService[service]) {
        stats.byService[service] = 0;
      }
      stats.byService[service]++;
    });
    
    return stats;
  }, [user, getAppointmentsByDateRange]);

  // Send appointment reminder
  const sendReminder = useCallback(async (appointmentId) => {
    try {
      const appointment = await getAppointmentById(appointmentId);
      if (!appointment) return false;
      
      // In production, integrate with email/SMS service
      console.log(`Sending reminder for appointment ${appointmentId} to ${appointment.userEmail}`);
      
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, {
        reminderSent: true,
        lastReminderSent: new Date().toISOString()
      });
      
      toast.success('Reminder sent successfully');
      return true;
      
    } catch (err) {
      console.error('Error sending reminder:', err);
      return false;
    }
  }, [getAppointmentById]);

  // Add appointment note
  const addAppointmentNote = useCallback(async (appointmentId, note) => {
    if (!user) return false;
    
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, {
        notes: arrayUnion({
          text: note,
          createdBy: user.uid,
          createdAt: new Date().toISOString()
        })
      });
      
      toast.success('Note added successfully');
      return true;
      
    } catch (err) {
      console.error('Error adding note:', err);
      toast.error('Failed to add note');
      return false;
    }
  }, [user]);

  // Export appointments to CSV
  const exportToCSV = useCallback(() => {
    if (appointments.length === 0) {
      toast.error('No appointments to export');
      return;
    }
    
    const headers = ['Date', 'Time', 'Service', 'Doctor', 'Status', 'Price'];
    const csvData = appointments.map(apt => [
      apt.date,
      apt.timeSlot,
      apt.serviceName || apt.service,
      apt.doctorName,
      apt.status,
      apt.servicePrice || 'N/A'
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appointments_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Appointments exported successfully');
  }, [appointments]);

  // Clear all appointments (for testing/demo)
  const clearAppointments = useCallback(async () => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to clear all appointments? This action cannot be undone.')) {
      try {
        const appointmentsRef = collection(db, 'appointments');
        const q = query(appointmentsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const deletePromises = [];
        querySnapshot.forEach((doc) => {
          deletePromises.push(deleteDoc(doc.ref));
        });
        
        await Promise.all(deletePromises);
        
        toast.success('All appointments cleared');
        await fetchAppointments();
        
      } catch (err) {
        console.error('Error clearing appointments:', err);
        toast.error('Failed to clear appointments');
      }
    }
  }, [user, fetchAppointments]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user, fetchAppointments]);

  return {
    // State
    appointments,
    upcomingAppointments,
    pastAppointments,
    cancelledAppointments,
    loading,
    error,
    stats,
    hasMore,
    
    // CRUD Operations
    bookAppointment,
    cancelAppointment,
    rescheduleAppointment,
    updateAppointmentStatus,
    
    // Query Operations
    getAppointmentById,
    getAppointmentsByDateRange,
    getAppointmentsByDoctor,
    getUpcomingWeekAppointments,
    getMonthlyStats,
    fetchAppointmentsPaginated,
    
    // Availability
    checkAvailability,
    getAvailableTimeSlots,
    
    // Utility
    sendReminder,
    addAppointmentNote,
    exportToCSV,
    clearAppointments
  };
};

export default useAppointments;