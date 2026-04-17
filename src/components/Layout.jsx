import React, { useState, useRef, useEffect, useCallback } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useUsers } from '../context/UserContext';
import {
  FileSignature,
  LayoutDashboard,
  Bell,
  Search,
  ShieldCheck,
  Menu,
  ChevronRight,
  Home,
  X,
  ChevronDown,
  Settings,
  LogOut,
  Mail,
  CheckCircle2,
  ArrowRightLeft,
} from 'lucide-react';

import smcLogo from '../assets/smc_logo.png';

// ─── SMC Logo ────────────────────────────────────────────────────────────────
const SMCLogo = ({ height = '42px' }) => (
  <a href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>
    <img src={smcLogo} alt="SMC Logo" style={{ height, width: 'auto', objectFit: 'contain' }} />
  </a>
);

// ─── Announcement Ticker ──────────────────────────────────────────────────────
const announcements = [
  '🔔 New TDR Policy circular effective 01-Apr-2026 — Refer Circular No. SMC/TDR/2026/04',
  '🔧 System maintenance scheduled on 20-Apr-2026 from 11:00 PM to 2:00 AM IST',
  '📋 TDR transfer fee revised — please refer to the updated fee schedule on the portal',
  '⚠️ Citizens are advised to verify documents before submission — forged documents attract legal action',
  '📞 Helpdesk: 0261-2423750 | Mon–Fri 10:30 AM to 5:00 PM',
];

const AnnouncementTicker = () => {
  const text = announcements.join('       ◆       ');
  return (
    <div className="ticker-bar">
      <div className="ticker-label">NOTICE</div>
      <div className="ticker-content">
        <div className="ticker-text">{text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}</div>
      </div>
    </div>
  );
};

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
const routeLabels = {
  '':             'Dashboard',
  'services':     'e-TDR Services',
  'verification': 'Blockchain Verification',
  'profile':      'Profile',
  'register':     'Register User',
};

const Breadcrumb = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  return (
    <nav aria-label="breadcrumb" className="breadcrumb-bar">
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--primary-mid)', textDecoration: 'none', fontWeight: 600 }}>
        <Home size={12} />
        Home
      </Link>
      {segments.map((seg, idx) => {
        const path = '/' + segments.slice(0, idx + 1).join('/');
        const label = routeLabels[seg] || seg;
        const isLast = idx === segments.length - 1;
        return (
          <React.Fragment key={path}>
            <ChevronRight size={12} color="var(--text-light)" />
            {isLast ? (
              <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{label}</span>
            ) : (
              <Link to={path} style={{ color: 'var(--primary-mid)', fontWeight: 600 }}>{label}</Link>
            )}
          </React.Fragment>
        );
      })}
      {segments.length === 0 && (
        <>
          <ChevronRight size={12} color="var(--text-light)" />
          <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>Dashboard</span>
        </>
      )}
    </nav>
  );
};

// ─── Search Bar ───────────────────────────────────────────────────────────────
const pages = [
  { label: 'Government Dashboard', path: '/' },
  { label: 'e-TDR Services',       path: '/services' },
  { label: 'Upload Certificate',   path: '/services' },
  { label: 'Issue TDR',            path: '/services' },
  { label: 'Transfer TDR',         path: '/services' },
  { label: 'Blockchain Verification', path: '/verification' },
  { label: 'Profile',              path: '/profile' },
  { label: 'Register User',        path: '/register' },
];

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length > 1) {
      const filtered = pages.filter(p => p.label.toLowerCase().includes(val.toLowerCase()));
      setResults(filtered);
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const handleSelect = (path) => {
    navigate(path);
    setQuery('');
    setOpen(false);
  };

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <Search size={15} color={focused ? 'var(--primary-mid)' : '#94A3B8'} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', transition: 'color 0.2s' }} />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search pages, services..."
        style={{
          paddingLeft: '2.1rem',
          paddingRight: query ? '2rem' : '0.875rem',
          width: '230px',
          height: '36px',
          border: `1.5px solid ${focused ? 'var(--primary-mid)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          fontSize: '0.82rem',
          backgroundColor: focused ? '#fff' : 'var(--background)',
          outline: 'none',
          transition: 'all 0.2s',
          boxShadow: focused ? '0 0 0 3px var(--focus-ring)' : 'none',
        }}
      />
      {query && (
        <button onClick={() => { setQuery(''); setOpen(false); }} style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#94A3B8' }}>
          <X size={14} />
        </button>
      )}
      {open && results.length > 0 && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, backgroundColor: 'white', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 9999, overflow: 'hidden' }}>
          {results.map((r, i) => (
            <div key={i} onClick={() => handleSelect(r.path)} style={{ padding: '0.6rem 1rem', cursor: 'pointer', fontSize: '0.83rem', borderBottom: i < results.length - 1 ? '1px solid var(--border)' : 'none', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--primary-light)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
            >
              <Search size={13} color="var(--text-light)" />
              {r.label}
            </div>
          ))}
        </div>
      )}
      {open && results.length === 0 && (
        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, backgroundColor: 'white', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '0.75rem 1rem', fontSize: '0.82rem', color: 'var(--text-light)', boxShadow: 'var(--shadow-lg)', zIndex: 9999, textAlign: 'center' }}>
          No results found
        </div>
      )}
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { path: '/',             name: 'Dashboard',              icon: <LayoutDashboard size={19} />, section: 'MAIN' },
    { path: '/services',     name: 'e-TDR Services',         icon: <FileSignature size={19} />,   section: 'MAIN' },
    { path: '/verification', name: 'Blockchain Verify',      icon: <ShieldCheck size={19} />,     section: 'MAIN' },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'expanded' : 'collapsed'}`}>
      {/* Header */}
      <div className="sidebar-header">
        {isOpen && <SMCLogo height="36px" />}
        <button
          onClick={toggleSidebar}
          style={{ background: 'rgba(255,255,255,0.08)', border: 'none', padding: '0.45rem', color: 'rgba(255,255,255,0.85)', display: 'flex', alignItems: 'center', borderRadius: 'var(--radius-sm)', transition: 'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {isOpen && <div className="nav-section-label" style={{ marginTop: '0.5rem' }}>NAVIGATION</div>}
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={!isOpen ? item.name : undefined}
          >
            <span style={{ flexShrink: 0 }}>{item.icon}</span>
            {isOpen && <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {isOpen && (
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ade80', animation: 'pulse-dot 2s ease-in-out infinite', flexShrink: 0 }} />
          <span style={{ fontSize: '0.72rem', color: 'rgba(203,213,225,0.7)', fontWeight: 500 }}>Blockchain Active · 14 Nodes</span>
        </div>
      )}
    </div>
  );
};

// ─── Mail Popup Notification Toast ───────────────────────────────────────────
const mailQueue = [
  {
    id: 'm1',
    type: 'issued',
    from: 'TDR System',
    fromInitials: 'TS',
    fromColor: '#1D4ED8',
    fromBg: '#EFF6FF',
    subject: 'TDR Certificate Issued — TDR-SMC-2310',
    preview: 'Certificate successfully issued to Rajesh Kumar (Plot No. 42, Zone B). Blockchain record has been updated.',
    time: 'Just now',
    icon: <CheckCircle2 size={14} />,
  },
  {
    id: 'm2',
    type: 'transfer',
    from: 'Transfer Module',
    fromInitials: 'TM',
    fromColor: '#7C3AED',
    fromBg: '#F5F3FF',
    subject: 'TDR Transfer Completed — TDR-SMC-1842',
    preview: 'Transfer from Priya Sharma to Mithun Patel confirmed. Smart contract executed on blockchain.',
    time: '1 min ago',
    icon: <ArrowRightLeft size={14} />,
  },
];

const MailPopupToast = ({ mail, onClose }) => {
  const [progress, setProgress] = useState(100);
  const [exiting, setExiting] = useState(false);
  const DURATION = 6000;

  const handleClose = useCallback(() => {
    setExiting(true);
    setTimeout(() => onClose(mail.id), 350);
  }, [mail.id, onClose]);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / DURATION) * 100);
      setProgress(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 50);
    const timer = setTimeout(handleClose, DURATION);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [handleClose]);

  return (
    <div
      className={`mail-popup-toast ${exiting ? 'mail-popup-exit' : 'mail-popup-enter'}`}
      style={{ '--from-color': mail.fromColor, '--from-bg': mail.fromBg }}
    >
      {/* Top bar */}
      <div className="mail-popup-topbar">
        <div className="mail-popup-topbar-left">
          <Mail size={12} />
          <span>New Notification</span>
        </div>
        <button className="mail-popup-close" onClick={handleClose} title="Close">
          <X size={13} />
        </button>
      </div>

      {/* Body */}
      <div className="mail-popup-body">
        {/* Avatar */}
        <div
          className="mail-popup-avatar"
          style={{ background: mail.fromBg, color: mail.fromColor }}
        >
          {mail.fromInitials}
        </div>

        {/* Content */}
        <div className="mail-popup-content">
          <div className="mail-popup-from">
            <span className="mail-popup-sender">{mail.from}</span>
            <span className="mail-popup-time">{mail.time}</span>
          </div>
          <div className="mail-popup-subject">{mail.subject}</div>
          <div className="mail-popup-preview">{mail.preview}</div>
        </div>
      </div>

      {/* Type badge */}
      <div className="mail-popup-footer">
        <div className="mail-popup-badge" style={{ color: mail.fromColor, background: mail.fromBg }}>
          {mail.icon}
          <span>{mail.type === 'issued' ? 'Certificate Issued' : 'Transfer Completed'}</span>
        </div>
        <button
          className="mail-popup-action"
          style={{ color: mail.fromColor }}
          onClick={handleClose}
        >
          View Details
        </button>
      </div>

      {/* Progress bar */}
      <div className="mail-popup-progress">
        <div
          className="mail-popup-progress-bar"
          style={{ width: `${progress}%`, background: mail.fromColor }}
        />
      </div>
    </div>
  );
};

const MailPopupContainer = ({ popups, onClose }) => (
  <div className="mail-popup-container">
    {popups.map((mail) => (
      <MailPopupToast key={mail.id} mail={mail} onClose={onClose} />
    ))}
  </div>
);

// ─── Notification Bell ────────────────────────────────────────────────────────
const NotificationBell = ({ popups, addPopup, closePopup }) => {
  const { currentUser } = useUsers();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'issued',
      title: 'TDR Certificate Issued',
      message: 'TDR-SMC-2310 has been successfully issued to applicant Rajesh Kumar (Plot No. 42, Zone B).',
      time: '2 mins ago',
      read: false,
      icon: '📄',
      color: '#1D4ED8',
      bg: '#EFF6FF',
    },
    {
      id: 2,
      type: 'transfer',
      title: 'TDR Transfer Completed',
      message: 'TDR-SMC-1842 has been transferred from Priya Sharma to Mithun Patel. Blockchain record updated.',
      time: '18 mins ago',
      read: false,
      icon: '🔁',
      color: '#7C3AED',
      bg: '#F5F3FF',
    },
    {
      id: 3,
      type: 'issued',
      title: 'TDR Certificate Issued',
      message: 'TDR-SMC-2309 issued successfully. Document uploaded and verified on blockchain.',
      time: '1 hr ago',
      read: true,
      icon: '📄',
      color: '#1D4ED8',
      bg: '#EFF6FF',
    },
  ]);
  const ref = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const dismiss = (id) => setNotifications(prev => prev.filter(n => n.id !== id));
  const closePopupLocal = closePopup;

  // automatic dispatch instead of manual button
  const handleSendSingleNotification = async (notif) => {
    try {
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const defaultApiUrl = isLocalhost ? 'http://localhost:5000/api' : `${window.location.origin}/api`;
      const apiUrl = import.meta.env.VITE_API_URL && isLocalhost ? import.meta.env.VITE_API_URL : defaultApiUrl;
      const requestBody = {
        title: notif.title,
        message: `${notif.message}<br/><i>${notif.time}</i>`
      };
      if (currentUser?.email) requestBody.to = currentUser.email;

      const response = await fetch(`${apiUrl}/send-alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      if (response.ok) {
        alert("This specific notification was dispatched to your mail!");
      }
    } catch(err) {
      console.error(err);
      alert("Error sending email.");
    }
  };

  // Auto-dispatch entire digest natively once per session as soon as they load the portal
  useEffect(() => {
    const sentKey = `tdr_digest_sent_${currentUser?.email || 'default'}`;
    const hasSent = sessionStorage.getItem(sentKey);

    if (!hasSent && notifications.length > 0) {
      sessionStorage.setItem(sentKey, 'true');
      const digestMessage = notifications.map(n => `<b>${n.title}</b><br/>${n.message}<br/><i>${n.time}</i>`).join('<br/><hr/><br/>');
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const defaultApiUrl = isLocalhost ? 'http://localhost:5000/api' : `${window.location.origin}/api`;
      const apiUrl = import.meta.env.VITE_API_URL && isLocalhost ? import.meta.env.VITE_API_URL : defaultApiUrl;
      
      const requestBody = {
        title: "Your SMC Notification Digest",
        message: digestMessage
      };
      // Send to registered user if logged in, otherwise default admin
      if (currentUser?.email) requestBody.to = currentUser.email;

      fetch(`${apiUrl}/send-alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      }).catch(err => console.error('Failed to send digest email alert:', err));
    }
  }, [currentUser, notifications]);



  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: open ? 'var(--primary-light)' : 'var(--background)',
          border: `1.5px solid ${open ? 'var(--primary-mid)' : 'var(--border)'}`,
          color: open ? 'var(--primary)' : 'var(--text-muted)',
          borderRadius: 'var(--radius-md)',
          position: 'relative',
          width: '36px',
          height: '36px',
          padding: 0,
          transition: 'all 0.2s',
        }}
        title="Notifications"
        onMouseEnter={e => { if (!open) { e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary-mid)'; }}}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.background = 'var(--background)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}}
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: 'var(--danger)', color: 'white', fontSize: '0.55rem', fontWeight: 800, minWidth: '14px', height: '14px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid white', padding: '0 2px' }}>
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          width: '360px',
          backgroundColor: 'white',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 9999,
          overflow: 'hidden',
          animation: 'fadeInUp 0.2s ease both',
        }}>
          {/* Header */}
          <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(180deg, #f8fafc, white)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Bell size={15} color="var(--primary)" />
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>Notifications</span>
              {unreadCount > 0 && (
                <span style={{ background: 'var(--danger)', color: 'white', fontSize: '0.6rem', fontWeight: 800, padding: '1px 6px', borderRadius: '20px' }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ background: 'none', border: 'none', fontSize: '0.72rem', color: 'var(--primary-mid)', fontWeight: 600, padding: '0', cursor: 'pointer' }}>
                Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.85rem' }}>
                <Bell size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                <div>No notifications</div>
              </div>
            ) : (
              notifications.map((notif, i) => (
                <div key={notif.id} style={{
                  padding: '0.875rem 1.25rem',
                  borderBottom: i < notifications.length - 1 ? '1px solid var(--border)' : 'none',
                  background: notif.read ? 'white' : '#F8FBFF',
                  display: 'flex',
                  gap: '0.875rem',
                  alignItems: 'flex-start',
                  transition: 'background 0.15s',
                  position: 'relative',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0f7ff'}
                  onMouseLeave={e => e.currentTarget.style.background = notif.read ? 'white' : '#F8FBFF'}
                >
                  {/* Unread dot */}
                  {!notif.read && (
                    <div style={{ position: 'absolute', top: '1rem', right: '1.25rem', width: '7px', height: '7px', borderRadius: '50%', background: 'var(--primary-mid)' }} />
                  )}

                  {/* Icon */}
                  <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', backgroundColor: notif.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
                    {notif.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.82rem', color: notif.color, marginBottom: '2px' }}>{notif.title}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.35rem' }}>{notif.message}</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', fontWeight: 500 }}>🕐 {notif.time}</div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'center', marginTop: '2px' }}>
                    <button
                      onClick={() => dismiss(notif.id)}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-light)'}
                      title="Dismiss"
                      style={{ background: 'none', border: 'none', padding: '2px', color: 'var(--text-light)', cursor: 'pointer', flexShrink: 0, borderRadius: '4px' }}
                    >
                      <X size={13} />
                    </button>
                    <button
                      onClick={() => handleSendSingleNotification(notif)}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-light)'}
                      title="Email this Notification"
                      style={{ background: 'none', border: 'none', padding: '2px', color: 'var(--text-light)', cursor: 'pointer', flexShrink: 0, borderRadius: '4px' }}
                    >
                      <Mail size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div style={{ padding: '0.7rem 1.25rem', borderTop: '1px solid var(--border)', background: '#f8fafc', textAlign: 'center' }}>
            <a href="#" style={{ fontSize: '0.78rem', color: 'var(--primary-mid)', fontWeight: 600 }}>View All Activity</a>
          </div>
        </div>
      )}
    </div>
  );
};


// ─── Header ───────────────────────────────────────────────────────────────────
const Header = ({ popups, addPopup, closePopup }) => {
  const { admin } = useAdmin();
  const { currentUser, logoutUser } = useUsers();
  const navigate = useNavigate();

  return (
    <header className="top-header">
      <div className="emblem-container">
        <SMCLogo height="40px" />
        <div style={{ width: '1px', height: '28px', background: 'var(--border)' }} />
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', lineHeight: 1.2 }}>Surat Municipal Corporation</div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500 }}>e-TDR Blockchain Portal</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <SearchBar />
        <NotificationBell popups={popups} addPopup={addPopup} closePopup={closePopup} />

        <button
          className="btn-primary"
          onClick={() => navigate('/register')}
          style={{ padding: '0.45rem 1rem', fontSize: '0.8rem', height: '36px', borderRadius: 'var(--radius-md)' }}
        >
          + Register User
        </button>

        <div style={{ width: '1px', height: '28px', background: 'var(--border)' }} />

        <div
          className="header-user"
          onClick={() => {
            if (currentUser) {
                if (window.confirm("Do you want to logout?")) {
                  logoutUser();
                  navigate("/");
                }
            } else {
              navigate('/profile');
            }
          }}
        >
          <div className="avatar">
            {currentUser 
              ? currentUser.name.charAt(0).toUpperCase()
              : (admin.photo ? <img src={admin.photo} alt="P" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : admin.initials)}
          </div>
          <div style={{ lineHeight: 1.3 }}>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-main)' }}>{currentUser ? currentUser.name : admin.name}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>{currentUser ? "Registered User" : admin.designation}</div>
          </div>
          <ChevronDown size={14} color="var(--text-light)" />
        </div>
      </div>
    </header>
  );
};

// ─── Gov Banner ───────────────────────────────────────────────────────────────
const GovBanner = () => (
  <div className="gov-banner">
    <ShieldCheck size={13} color="var(--success)" />
    <span style={{ fontWeight: 600, color: '#166534' }}>Official Portal</span>
    <span style={{ color: '#4B5563' }}>of Surat Municipal Corporation — Government of Gujarat</span>
    <span style={{ width: '1px', height: '12px', background: '#CBD5E1', mx: '0.5rem' }} />
    <a href="#" style={{ color: 'var(--primary-mid)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '2px' }}>Verify Authenticity</a>
  </div>
);

// ─── Layout ───────────────────────────────────────────────────────────────────
const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [popups, setPopups] = useState([]);

  const addPopup = useCallback((mail) => setPopups(prev => {
    if (prev.find(p => p.id === mail.id)) return prev;
    return [...prev, mail];
  }), []);
  const closePopup = useCallback((id) => setPopups(prev => prev.filter(p => p.id !== id)), []);

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="main-content">
        <GovBanner />
        <AnnouncementTicker />
        <Header popups={popups} addPopup={addPopup} closePopup={closePopup} />
        <Breadcrumb />
        <main className="content-area">
          <div className="page-container">
            <Outlet />
          </div>
        </main>
      </div>
      {/* Global mail popup toasts — rendered at root to avoid stacking context */}
      <MailPopupContainer popups={popups} onClose={closePopup} />
    </div>
  );
};

export default Layout;
