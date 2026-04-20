import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Mail } from 'lucide-react';
import { useUsers } from '../../context/UserContext';
import api from '../../api/client';

const NotificationBell = () => {
  const { currentUser } = useUsers();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const response = await api.get('/api/certificates');
        if (response && Array.isArray(response)) {
          const mapped = response.slice(0, 5).map(c => ({
            id: c.id,
            type: 'activity',
            title: c.status === 'UPLOADED' ? 'New Document Upload' : 'TDR Status Change',
            message: `Document ${c.filename} is now ${c.status.replace('_', ' ')}.`,
            time: 'Live',
            read: false,
            icon: c.status === 'UPLOADED' ? '📄' : '✅',
            color: c.status === 'UPLOADED' ? '#3b82f6' : '#10b981',
            bg: c.status === 'UPLOADED' ? '#eff6ff' : '#ecfdf5',
          }));
          setNotifications(mapped);
        }
      } catch (err) {
        console.error("Notif fetch failed:", err);
      }
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 10000);
    return () => clearInterval(interval);
  }, []);
  const ref = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSendAlert = async (notif) => {
    try {
      await api.post('/api/send-alert', {
        title: notif.title,
        message: notif.message,
        to: currentUser?.email
      });
      alert("Notification sent to your email!");
    } catch(err) {
      alert("Error sending email alert.");
    }
  };

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="notification-bell-container">
      <button
        onClick={() => setOpen(o => !o)}
        className={`bell-button ${open ? 'active' : ''}`}
      >
        <Bell size={17} />
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            <div className="title">
              <Bell size={15} />
              <span>Notifications</span>
            </div>
            {unreadCount > 0 && (
              <button onClick={() => setNotifications(prev => prev.map(n => ({...n, read: true})))} className="mark-read">
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-state">No notifications</div>
            ) : (
              notifications.map((notif, i) => (
                <div key={notif.id} className={`notification-item ${notif.read ? 'read' : 'unread'}`}>
                  <div className="icon" style={{ backgroundColor: notif.bg }}>{notif.icon}</div>
                  <div className="content">
                    <div className="subject" style={{ color: notif.color }}>{notif.title}</div>
                    <div className="message">{notif.message}</div>
                    <div className="time">🕐 {notif.time}</div>
                  </div>
                  <div className="actions">
                    <button onClick={() => setNotifications(prev => prev.filter(n => n.id !== notif.id))} className="action-btn"><X size={13} /></button>
                    <button onClick={() => handleSendAlert(notif)} className="action-btn"><Mail size={12} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
