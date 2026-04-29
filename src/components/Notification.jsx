// src/components/Notification.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, orderBy, limit } from 'firebase/firestore';
import toast from 'react-hot-toast';

const Notification = ({ 
  position = 'top-right', 
  autoHideDuration = 5000,
  maxNotifications = 5,
  showSound = true,
  showBadge = true
}) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(showSound);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [typeFilter, setTypeFilter] = useState('all'); // all, appointment, reminder, alert, promo

  // Sample notification types
  const notificationTypes = {
    appointment: { icon: '📅', color: '#667eea', bg: '#eef2ff' },
    reminder: { icon: '⏰', color: '#ed8936', bg: '#fff5e6' },
    alert: { icon: '⚠️', color: '#f56565', bg: '#ffe6e6' },
    promo: { icon: '🎉', color: '#48bb78', bg: '#e6f7e6' },
    system: { icon: '🔧', color: '#718096', bg: '#f7fafc' }
  };

  // Sample notifications data (in production, fetch from Firebase)
  const [allNotifications, setAllNotifications] = useState([
    {
      id: 1,
      type: 'appointment',
      title: 'Appointment Confirmed',
      message: 'Your appointment with Dr. Sarah Johnson has been confirmed for tomorrow at 10:00 AM.',
      time: '5 minutes ago',
      read: false,
      createdAt: new Date(),
      actionLink: '/my-appointments',
      actionText: 'View Details'
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Upcoming Appointment',
      message: 'Reminder: You have an appointment with Dr. Michael Chen in 2 hours.',
      time: '1 hour ago',
      read: false,
      createdAt: new Date(),
      actionLink: '/my-appointments',
      actionText: 'Join Call'
    },
    {
      id: 3,
      type: 'alert',
      title: 'Lab Results Ready',
      message: 'Your blood test results are now available. Click to view report.',
      time: '2 hours ago',
      read: true,
      createdAt: new Date(),
      actionLink: '/profile',
      actionText: 'View Report'
    },
    {
      id: 4,
      type: 'promo',
      title: 'Special Offer',
      message: 'Get 20% off on your next health checkup. Use code HEALTH20.',
      time: '1 day ago',
      read: false,
      createdAt: new Date(),
      actionLink: '/book',
      actionText: 'Book Now'
    },
    {
      id: 5,
      type: 'system',
      title: 'Profile Update',
      message: 'Your profile has been successfully updated.',
      time: '2 days ago',
      read: true,
      createdAt: new Date(),
      actionLink: '/profile',
      actionText: 'View Profile'
    },
    {
      id: 6,
      type: 'appointment',
      title: 'Appointment Rescheduled',
      message: 'Your appointment has been rescheduled to Friday, 2:00 PM.',
      time: '3 days ago',
      read: false,
      createdAt: new Date(),
      actionLink: '/my-appointments',
      actionText: 'Confirm'
    },
    {
      id: 7,
      type: 'reminder',
      title: 'Medication Reminder',
      message: 'Time to take your prescribed medication.',
      time: '4 days ago',
      read: true,
      createdAt: new Date(),
      actionLink: null,
      actionText: null
    }
  ]);

  useEffect(() => {
    // In production, fetch real notifications from Firebase
    fetchNotifications();
  }, [user]);

  useEffect(() => {
    // Update unread count
    const unread = allNotifications.filter(n => !n.read).length;
    setUnreadCount(unread);
    setNotifications(allNotifications);
  }, [allNotifications]);

  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      // In production, fetch from Firebase
      // const notificationsRef = collection(db, 'notifications');
      // const q = query(
      //   notificationsRef,
      //   where('userId', '==', user.uid),
      //   orderBy('createdAt', 'desc'),
      //   limit(20)
      // );
      // const querySnapshot = await getDocs(q);
      // const notificationList = [];
      // querySnapshot.forEach((doc) => {
      //   notificationList.push({ id: doc.id, ...doc.data() });
      // });
      // setAllNotifications(notificationList);
      
      // Using sample data for demo
      setAllNotifications([...allNotifications]);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    const updatedNotifications = allNotifications.map(notif => 
      notif.id === notificationId ? { ...notif, read: true } : notif
    );
    setAllNotifications(updatedNotifications);
    
    // In production, update in Firebase
    // await updateDoc(doc(db, 'notifications', notificationId), { read: true });
    
    // Play sound
    if (soundEnabled) {
      playSound('read');
    }
  };

  const markAllAsRead = async () => {
    const updatedNotifications = allNotifications.map(notif => ({ ...notif, read: true }));
    setAllNotifications(updatedNotifications);
    
    toast.success('All notifications marked as read');
    
    if (soundEnabled) {
      playSound('read');
    }
  };

  const deleteNotification = async (notificationId) => {
    const updatedNotifications = allNotifications.filter(notif => notif.id !== notificationId);
    setAllNotifications(updatedNotifications);
    
    toast.success('Notification deleted');
    
    if (soundEnabled) {
      playSound('delete');
    }
  };

  const clearAll = async () => {
    setAllNotifications([]);
    toast.success('All notifications cleared');
  };

  const playSound = (type) => {
    // In production, implement actual sound
    console.log(`Playing ${type} sound`);
  };

  const getFilteredNotifications = () => {
    let filtered = [...allNotifications];
    
    // Filter by read status
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.read);
    } else if (filter === 'read') {
      filtered = filtered.filter(n => n.read);
    }
    
    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(n => n.type === typeFilter);
    }
    
    // Limit results
    return filtered.slice(0, maxNotifications);
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }
    return 'Just now';
  };

  const formatDate = (date) => {
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <>
      {/* Notification Bell Icon */}
      <div className="notification-wrapper">
        <motion.button
          className="notification-bell"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="bell-icon">🔔</span>
          {showBadge && unreadCount > 0 && (
            <motion.span 
              className="notification-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </motion.button>

        {/* Notification Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={`notification-panel ${position}`}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <div className="notification-header">
                <div className="header-title">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="unread-badge">{unreadCount} unread</span>
                  )}
                </div>
                <div className="header-actions">
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="mark-read-btn">
                      Mark all read
                    </button>
                  )}
                  {allNotifications.length > 0 && (
                    <button onClick={clearAll} className="clear-btn">
                      Clear all
                    </button>
                  )}
                  <button onClick={() => setIsOpen(false)} className="close-btn">
                    ✕
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="notification-filters">
                <div className="filter-group">
                  <button 
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                  >
                    All
                  </button>
                  <button 
                    className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                    onClick={() => setFilter('unread')}
                  >
                    Unread
                  </button>
                  <button 
                    className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
                    onClick={() => setFilter('read')}
                  >
                    Read
                  </button>
                </div>
                
                <div className="type-filters">
                  <select 
                    value={typeFilter} 
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="type-select"
                  >
                    <option value="all">All Types</option>
                    <option value="appointment">Appointments</option>
                    <option value="reminder">Reminders</option>
                    <option value="alert">Alerts</option>
                    <option value="promo">Promotions</option>
                    <option value="system">System</option>
                  </select>
                </div>
              </div>

              {/* Notifications List */}
              <div className="notification-list">
                {filteredNotifications.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🔕</div>
                    <p>No notifications</p>
                    <span>You're all caught up!</span>
                  </div>
                ) : (
                  <AnimatePresence>
                    {filteredNotifications.map((notification, index) => {
                      const typeConfig = notificationTypes[notification.type] || notificationTypes.system;
                      return (
                        <motion.div
                          key={notification.id}
                          className={`notification-item ${!notification.read ? 'unread' : ''}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="notification-icon" style={{ background: typeConfig.bg }}>
                            <span style={{ color: typeConfig.color }}>{typeConfig.icon}</span>
                          </div>
                          
                          <div className="notification-content">
                            <div className="notification-title">
                              <h4>{notification.title}</h4>
                              <span className="notification-time">
                                {getTimeAgo(notification.createdAt)}
                              </span>
                            </div>
                            <p className="notification-message">{notification.message}</p>
                            
                            <div className="notification-actions">
                              {notification.actionLink && (
                                <a 
                                  href={notification.actionLink} 
                                  className="action-link"
                                  onClick={() => {
                                    markAsRead(notification.id);
                                    setIsOpen(false);
                                  }}
                                >
                                  {notification.actionText || 'View Details'} →
                                </a>
                              )}
                              {!notification.read && (
                                <button 
                                  className="mark-read-link"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Mark as read
                                </button>
                              )}
                              <button 
                                className="delete-link"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {allNotifications.length > maxNotifications && (
                <div className="notification-footer">
                  <button className="view-all-btn">
                    View All Notifications
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .notification-wrapper {
          position: relative;
          display: inline-block;
        }

        /* Notification Bell */
        .notification-bell {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all var(--transition-fast);
          font-size: 1.2rem;
        }

        .notification-bell:hover {
          background: var(--gray-100);
        }

        .bell-icon {
          font-size: 1.2rem;
        }

        .notification-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: var(--error);
          color: white;
          font-size: 0.6rem;
          font-weight: 600;
          padding: 2px 5px;
          border-radius: var(--radius-full);
          min-width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Notification Panel */
        .notification-panel {
          position: absolute;
          top: 100%;
          right: 0;
          width: 420px;
          max-width: 90vw;
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          z-index: var(--z-dropdown);
          overflow: hidden;
          margin-top: 8px;
        }

        .notification-panel.top-right {
          right: 0;
          left: auto;
        }

        .notification-panel.top-left {
          left: 0;
          right: auto;
        }

        /* Header */
        .notification-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--gray-200);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--gray-50);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .header-title h3 {
          font-size: 1rem;
          font-weight: 700;
          color: var(--gray-800);
          margin: 0;
        }

        .unread-badge {
          background: var(--primary-500);
          color: white;
          font-size: 0.7rem;
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .header-actions {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .mark-read-btn,
        .clear-btn,
        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.75rem;
          color: var(--gray-500);
          transition: color var(--transition-fast);
        }

        .mark-read-btn:hover {
          color: var(--primary-500);
        }

        .clear-btn:hover {
          color: var(--error);
        }

        .close-btn {
          font-size: 1rem;
          font-weight: bold;
        }

        /* Filters */
        .notification-filters {
          padding: 12px 16px;
          border-bottom: 1px solid var(--gray-200);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          gap: 8px;
        }

        .filter-btn {
          padding: 4px 12px;
          background: none;
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-full);
          cursor: pointer;
          font-size: 0.75rem;
          transition: all var(--transition-fast);
        }

        .filter-btn:hover {
          border-color: var(--primary-500);
        }

        .filter-btn.active {
          background: var(--primary-500);
          color: white;
          border-color: var(--primary-500);
        }

        .type-select {
          padding: 4px 8px;
          border: 1px solid var(--gray-200);
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          background: white;
          cursor: pointer;
        }

        /* Notifications List */
        .notification-list {
          max-height: 500px;
          overflow-y: auto;
        }

        .notification-item {
          display: flex;
          gap: 12px;
          padding: 16px;
          border-bottom: 1px solid var(--gray-100);
          transition: all var(--transition-fast);
          cursor: pointer;
        }

        .notification-item.unread {
          background: var(--primary-50);
        }

        .notification-item:hover {
          background: var(--gray-50);
        }

        .notification-icon {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .notification-content {
          flex: 1;
        }

        .notification-title {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 4px;
        }

        .notification-title h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--gray-800);
          margin: 0;
        }

        .notification-time {
          font-size: 0.7rem;
          color: var(--gray-500);
        }

        .notification-message {
          font-size: 0.75rem;
          color: var(--gray-600);
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .notification-actions {
          display: flex;
          gap: 12px;
          font-size: 0.7rem;
        }

        .action-link {
          color: var(--primary-500);
          text-decoration: none;
          font-weight: 500;
        }

        .mark-read-link {
          color: var(--gray-500);
          background: none;
          border: none;
          cursor: pointer;
        }

        .delete-link {
          color: var(--error);
          background: none;
          border: none;
          cursor: pointer;
        }

        /* Empty State */
        .empty-state {
          padding: 48px 24px;
          text-align: center;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 12px;
        }

        .empty-state p {
          font-weight: 600;
          color: var(--gray-600);
          margin-bottom: 4px;
        }

        .empty-state span {
          font-size: 0.75rem;
          color: var(--gray-400);
        }

        /* Footer */
        .notification-footer {
          padding: 12px 16px;
          border-top: 1px solid var(--gray-200);
          text-align: center;
        }

        .view-all-btn {
          background: none;
          border: none;
          color: var(--primary-500);
          font-size: 0.75rem;
          cursor: pointer;
          font-weight: 500;
        }

        /* Scrollbar */
        .notification-list::-webkit-scrollbar {
          width: 6px;
        }

        .notification-list::-webkit-scrollbar-track {
          background: var(--gray-100);
        }

        .notification-list::-webkit-scrollbar-thumb {
          background: var(--gray-300);
          border-radius: var(--radius-full);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .notification-panel {
            width: 100vw;
            max-width: 100vw;
            position: fixed;
            top: 60px;
            left: 0;
            right: 0;
            bottom: 0;
            border-radius: 0;
            margin: 0;
          }

          .notification-list {
            max-height: calc(100vh - 180px);
          }

          .notification-filters {
            flex-direction: column;
            align-items: stretch;
          }

          .filter-group {
            justify-content: center;
          }
        }

        /* Animation */
        @keyframes bellRing {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(15deg);
          }
          75% {
            transform: rotate(-15deg);
          }
        }

        .notification-bell:active .bell-icon {
          animation: bellRing 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Notification;