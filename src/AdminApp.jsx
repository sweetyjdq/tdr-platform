import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CertificateProvider, useCertificates } from './context/CertificateContext';
import { Shield, LayoutDashboard, UserCheck, Lock } from 'lucide-react';

const AdminLogin = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = (e) => {
    e.preventDefault();
    const lowerUser = username.toLowerCase();
    if((lowerUser === 'admin@tdr.local' || lowerUser === 'admin@trd.local') && password === 'admin@123') {
      setLoggedIn(true);
    } else {
      alert('Invalid credentials! (hint: admin@tdr.local / admin@123)');
    }
  }
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--background)' }}>
      <div className="card" style={{ width: '400px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Shield size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <h2>TDR Admin Portal</h2>
          <p style={{ color: 'var(--text-muted)' }}>Secure System Access</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="label">Admin ID</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={18} style={{ marginRight: '0.5rem' }} />
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}

const AdminDashboard = () => {
  const { certificates, updateCertificateStatus } = useCertificates();
  
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-main)', margin: 0 }}><LayoutDashboard /> Admin Management Base</h1>
        <div style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--success-bg)', color: 'var(--success)', borderRadius: '1rem', display: 'flex', alignItems: 'center' }}>
           <UserCheck size={18} style={{ marginRight: '0.5rem' }}/> 
           Admin Session Active
        </div>
      </div>
      
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div className="card-header">
          <h2 style={{ margin: 0 }}>Certificate Control Center</h2>
        </div>
        <div className="card-body" style={{ padding: 0, overflowX: 'auto' }}>
           <table className="data-table">
              <thead>
                <tr>
                  <th>TDR Reference ID</th>
                  <th>Uploader (Client Name)</th>
                  <th>Client Proof ID (Aadhaar)</th>
                  <th>Zone & Area Details</th>
                  <th>Current Protocol Status</th>
                  <th>Override Controls</th>
                </tr>
              </thead>
              <tbody>
                {certificates.map((tdr, i) => (
                  <tr key={tdr.id || i}>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{tdr.id}</td>
                    <td style={{ fontWeight: 500 }}>{tdr.owner}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{tdr.aadhaar || 'N/A'}</td>
                    <td>{tdr.zone} <br/> <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)'}}>{tdr.area}</span></td>
                    <td>
                      <span className={`status-badge status-${tdr.status.toLowerCase()}`}>
                        {tdr.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: tdr.status === 'Verified' ? 'var(--success-bg)' : undefined, color: tdr.status === 'Verified' ? 'var(--success)' : undefined }}
                          onClick={() => updateCertificateStatus(tdr.id, 'Verified')}
                          disabled={tdr.status === 'Verified'}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: tdr.status === 'Rejected' ? 'var(--danger-bg)' : undefined, color: tdr.status === 'Rejected' ? 'var(--danger)' : undefined }}
                          onClick={() => updateCertificateStatus(tdr.id, 'Rejected')}
                          disabled={tdr.status === 'Rejected'}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

const AdminLayout = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    
    if (!loggedIn) {
        return <AdminLogin setLoggedIn={setLoggedIn} />;
    }
    
    return (
        <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh', width: '100%' }}>
            <AdminDashboard />
        </div>
    );
}

const AdminApp = () => {
  return (
    <CertificateProvider>
      <BrowserRouter basename="/admin.html">
        <Routes>
          <Route path="/*" element={<AdminLayout />} />
        </Routes>
      </BrowserRouter>
    </CertificateProvider>
  );
}

export default AdminApp;
