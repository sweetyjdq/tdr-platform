import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import {
  FileSignature,
  LayoutDashboard,
  Bell,
  Search,
  ShieldCheck,
  Menu,
  ChevronRight,
  Home,
  X
} from 'lucide-react';

import smcLogo from '../assets/smc_logo.png';

// ─── SMC Logo ────────────────────────────────────────────────────────────────
const SMCLogo = ({ height = '45px' }) => (
  <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
      <img src={smcLogo} alt="SMC Logo" style={{ height, width: 'auto' }} />
    </div>
  </a>
);

// ─── Announcement Ticker ──────────────────────────────────────────────────────
const announcements = [
  'New TDR Policy circular effective 01-Apr-2026 — Refer Circular No. SMC/TDR/2026/04',
  'System maintenance scheduled on 20-Apr-2026 from 11:00 PM to 2:00 AM IST',
  'TDR transfer fee revised — please refer to the updated fee schedule on the portal',
  'Citizens are advised to verify documents before submission — forged documents attract legal action',
  'Helpdesk number updated: 0261-2423750 | Mon–Fri 10:30 AM to 5:00 PM',
];

const AnnouncementTicker = () => {
  const text = announcements.join('   ◆   ');

  return (
    <div style={{
      backgroundColor: '#FFF8E1',
      borderBottom: '1px solid #FDE68A',
      padding: '6px 0',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    }}>
      <div style={{
        flexShrink: 0,
        backgroundColor: '#B45309',
        color: 'white',
        fontSize: '0.7rem',
        fontWeight: 700,
        padding: '2px 10px',
        letterSpacing: '1px',
        whiteSpace: 'nowrap',
        marginLeft: '0.75rem',
      }}>
        NOTICE
      </div>
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div style={{
          display: 'inline-block',
          whiteSpace: 'nowrap',
          animation: 'tickerScroll 45s linear infinite',
          fontSize: '0.8rem',
          color: '#78350F',
        }}>
          {text}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{text}
        </div>
      </div>
      <style>{`
        @keyframes tickerScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
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
    <nav aria-label="breadcrumb" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
      padding: '0.5rem 1.5rem',
      backgroundColor: '#F8FAFC',
      borderBottom: '1px solid #E2E8F0',
      fontSize: '0.8rem',
      color: '#64748B',
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--primary)', textDecoration: 'none' }}>
        <Home size={13} />
        Home
      </Link>
      {segments.map((seg, idx) => {
        const path = '/' + segments.slice(0, idx + 1).join('/');
        const label = routeLabels[seg] || seg;
        const isLast = idx === segments.length - 1;
        return (
          <React.Fragment key={path}>
            <ChevronRight size={13} />
            {isLast ? (
              <span style={{ color: '#1E293B', fontWeight: 600 }}>{label}</span>
            ) : (
              <Link to={path} style={{ color: 'var(--primary)', textDecoration: 'none' }}>{label}</Link>
            )}
          </React.Fragment>
        );
      })}
      {segments.length === 0 && (
        <>
          <ChevronRight size={13} />
          <span style={{ color: '#1E293B', fontWeight: 600 }}>Dashboard</span>
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
  const navigate = useNavigate();
  const ref = useRef(null);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length > 1) {
      const filtered = pages.filter(p =>
        p.label.toLowerCase().includes(val.toLowerCase())
      );
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

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search pages, services..."
        style={{
          paddingLeft: '2.1rem',
          paddingRight: query ? '2rem' : '0.75rem',
          width: '220px',
          height: '36px',
          border: '1px solid #CBD5E1',
          borderRadius: '6px',
          fontSize: '0.85rem',
          backgroundColor: '#F8FAFC',
          outline: 'none',
        }}
      />
      {query && (
        <button onClick={() => { setQuery(''); setOpen(false); }} style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#94A3B8' }}>
          <X size={14} />
        </button>
      )}
      {open && results.length > 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          backgroundColor: 'white', border: '1px solid #E2E8F0',
          borderRadius: '6px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 9999, overflow: 'hidden',
        }}>
          {results.map((r, i) => (
            <div
              key={i}
              onClick={() => handleSelect(r.path)}
              style={{
                padding: '0.6rem 1rem', cursor: 'pointer', fontSize: '0.85rem',
                borderBottom: i < results.length - 1 ? '1px solid #F1F5F9' : 'none',
                color: '#1E293B',
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F1F5F9'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'white'}
            >
              {r.label}
            </div>
          ))}
        </div>
      )}
      {open && results.length === 0 && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
          backgroundColor: 'white', border: '1px solid #E2E8F0',
          borderRadius: '6px', padding: '0.75rem 1rem',
          fontSize: '0.82rem', color: '#94A3B8',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 9999,
        }}>
          No results found
        </div>
      )}
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { path: '/',             name: 'Government Dashboard',    icon: <LayoutDashboard size={20} /> },
    { path: '/services',     name: 'e-TDR Services',          icon: <FileSignature size={20} /> },
    { path: '/verification', name: 'Blockchain Verification', icon: <ShieldCheck size={20} /> },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header" style={{ padding: '1rem', backgroundColor: isOpen ? 'white' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'space-between' : 'center' }}>
        {isOpen && <SMCLogo height="35px" />}
        <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', padding: '0.5rem', color: isOpen ? 'black' : 'white', display: 'flex', alignItems: 'center' }}>
          <Menu size={24} />
        </button>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={!isOpen ? item.name : undefined}
          >
            {item.icon}
            {isOpen && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

// ─── Header ───────────────────────────────────────────────────────────────────
const Header = () => {
  const { admin } = useAdmin();
  const navigate = useNavigate();

  return (
    <header className="top-header">
      <div className="emblem-container" style={{ padding: '0.4rem', backgroundColor: 'white', borderRadius: '4px' }}>
        <SMCLogo />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <SearchBar />
        <button style={{ background: 'none', border: 'none', padding: '0.5rem', color: 'var(--text-muted)' }}>
          <Bell size={20} />
        </button>
        <button
          className="btn-primary"
          onClick={() => navigate('/register')}
          style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}
        >
          Register User
        </button>
        <div
          className="header-user"
          style={{ cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', transition: 'background 0.2s' }}
          onClick={() => navigate('/profile')}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--background)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <div className="avatar" style={{ overflow: 'hidden' }}>
            {admin.photo ? (
              <img src={admin.photo} alt="P" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : admin.initials}
          </div>
          <div>
            <div style={{ lineHeight: 1, fontWeight: 600 }}>{admin.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{admin.designation}</div>
          </div>
        </div>
      </div>
    </header>
  );
};

// ─── Gov Banner ───────────────────────────────────────────────────────────────
const GovBanner = () => (
  <div className="gov-banner">
    <ShieldCheck size={14} />
    <span>Official Portal of Surat Municipal Corporation</span>
    <a href="#" style={{ textDecoration: 'underline', color: 'var(--primary)', marginLeft: '0.25rem' }}>Verify Authenticity</a>
  </div>
);

// ─── Layout ───────────────────────────────────────────────────────────────────
const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="main-content">
        <GovBanner />
        <AnnouncementTicker />
        <Header />
        <Breadcrumb />
        <main className="content-area">
          <div className="page-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
