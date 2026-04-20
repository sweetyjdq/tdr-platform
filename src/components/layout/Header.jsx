import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, Lock, ChevronDown, ShieldCheck, Globe, User } from 'lucide-react';
import SMCLogo from './SMCLogo';
import SearchBar from './SearchBar';
import NotificationBell from './NotificationBell';
import { useUsers } from '../../context/UserContext';
import { useAdmin } from '../../context/AdminContext';

const Header = ({ popups, addPopup, closePopup }) => {
  const { admin } = useAdmin();
  const { currentUser, logoutUser } = useUsers();
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem("tdr_admin_token"));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem("tdr_admin_token"));
  }, [location.pathname, currentUser]);

  const handleUserClick = () => {
    if (currentUser) {
      if (window.confirm("Do you want to logout?")) {
        logoutUser();
        navigate("/");
      }
    } else if (isAdmin) {
      navigate('/profile');
    } else {
      navigate('/');
    }
  };

  return (
    <header className="top-header" style={{ height: '85px', borderBottom: '1px solid rgba(0,0,0,0.05)', backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="emblem-container" style={{ gap: '1.5rem', marginLeft: '1rem' }}>
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <SMCLogo height="52px" />
          <div style={{ width: '1.5px', height: '40px', background: 'linear-gradient(to bottom, transparent, #e2e8f0, transparent)' }} />
          <div className="brand-text">
            <div className="brand-title" style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Surat Municipal Corporation</div>
            <div className="brand-subtitle" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#3b82f6', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={14} /> e-TDR BLOCKCHAIN NETWORK
            </div>
          </div>
        </div>
      </div>

      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1.8rem', marginRight: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid #f1f5f9' }}>
           <Globe size={16} color="#3b82f6" />
           <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>MAINNET: ACTIVE</span>
        </div>

        <NotificationBell popups={popups} addPopup={addPopup} closePopup={closePopup} />

        {!isAdmin && (
          <button
            style={{ 
              padding: '0.65rem 1.4rem', 
              borderRadius: '50px', 
              fontSize: '0.85rem',
              background: '#0f172a',
              color: 'white',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.3)'
            }}
            onClick={() => navigate('/register')}
          >
            Register Participant
          </button>
        )}

        <div className="header-user" onClick={handleUserClick} style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', padding: '0.5rem', borderRadius: '12px', transition: 'background 0.2s' }}>
          <div className="avatar" style={{ 
            width: '42px', 
            height: '42px', 
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: 'white',
            boxShadow: '0 8px 16px -4px rgba(59, 130, 246, 0.4)',
            border: '2px solid white'
          }}>
            {currentUser 
              ? currentUser.name.charAt(0).toUpperCase()
              : (isAdmin 
                  ? (admin.photo ? <img src={admin.photo} alt="P" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : admin.initials)
                  : <User size={20} />
                )}
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
              {currentUser ? currentUser.name : (isAdmin ? admin.name : "Sign In")}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase' }}>
              {currentUser ? "Citizen" : (isAdmin ? admin.designation : "Access Restricted")}
            </div>
          </div>
          <ChevronDown size={14} color="#64748b" />
        </div>
      </div>
    </header>
  );
};

export default Header;
