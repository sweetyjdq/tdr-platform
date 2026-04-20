import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileSignature, ShieldCheck, Menu } from 'lucide-react';
import SMCLogo from './SMCLogo';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { path: '/',             name: 'Dashboard',              icon: <LayoutDashboard size={19} />, section: 'MAIN' },
    { path: '/services',     name: 'e-TDR Services',         icon: <FileSignature size={19} />,   section: 'MAIN' },
    { path: '/verification', name: 'Blockchain Verify',      icon: <ShieldCheck size={19} />,     section: 'MAIN' },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'expanded' : 'collapsed'}`} style={{ 
      background: '#0f172a', 
      borderRight: '1px solid rgba(255,255,255,0.05)',
      boxShadow: '10px 0 30px rgba(0,0,0,0.1)'
    }}>
      <div className="sidebar-header" style={{ height: '72px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        {isOpen && <SMCLogo height="32px" />}
        <button
          onClick={toggleSidebar}
          className="sidebar-toggle"
          style={{ color: '#94a3b8', background: 'transparent' }}
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className="sidebar-nav" style={{ padding: '1.5rem 0.75rem' }}>
        {isOpen && <div className="nav-section-label" style={{ color: '#475569', marginBottom: '0.8rem' }}>PORTAL</div>}
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={!isOpen ? item.name : undefined}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.9rem 1.25rem',
              borderRadius: '12px',
              color: isActive ? 'white' : '#94a3b8',
              background: isActive ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'transparent',
              marginBottom: '0.5rem',
              transition: 'all 0.2s',
              textDecoration: 'none'
            })}
          >
            <span style={{ flexShrink: 0 }}>{item.icon}</span>
            {isOpen && <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {isOpen && (
        <div className="sidebar-footer" style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="status-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }} />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Mainnet Online</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
