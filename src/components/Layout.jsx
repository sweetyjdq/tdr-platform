import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';

// Breadcrumb logic can stay here or be moved to its own file
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

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
      <Link to="/" className="breadcrumb-home">
        <Home size={12} />
        Home
      </Link>
      {segments.map((seg, idx) => {
        const path = '/' + segments.slice(0, idx + 1).join('/');
        const label = routeLabels[seg] || seg;
        const isLast = idx === segments.length - 1;
        return (
          <React.Fragment key={path}>
            <ChevronRight size={12} />
            {isLast ? (
              <span className="breadcrumb-current">{label}</span>
            ) : (
              <Link to={path} className="breadcrumb-link">{label}</Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

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
        <Header popups={popups} addPopup={addPopup} closePopup={closePopup} />
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
