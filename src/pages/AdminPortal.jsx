import React, { useState, useEffect } from 'react';
import { useCertificates } from '../context/CertificateContext';
import { useUsers } from '../context/UserContext';
import { Shield, LayoutDashboard, UserCheck, Lock, ExternalLink, FileSearch, Trash2 } from 'lucide-react';

const AdminLogin = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Save token
        localStorage.setItem("tdr_admin_token", data.token);
        setLoggedIn(true);
      } else {
        alert(data.message || 'Invalid credentials!');
      }
    } catch (err) {
      console.error("Login failed", err);
      alert("Failed to connect to authentication server!");
    }
  }
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="card" style={{ width: '400px', padding: '2rem', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Shield size={48} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
          <h2>Admin Login</h2>
          <p style={{ color: 'var(--text-muted)' }}>System Administrator Access</p>
        </div>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="label">Admin ID</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border)' }} />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--border)' }} />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={18} style={{ marginRight: '0.5rem' }} />
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

const AdminDashboard = ({ setLoggedIn }) => {
  const { certificates, updateCertificateStatus, deleteCertificate, updateCertificate } = useCertificates();
  const { users, updateUser, deleteUser } = useUsers();
  
  const handleEditCert = (cert) => {
    const newOwner = prompt("Edit Owner Name:", cert.owner);
    const newZone = prompt("Edit Zone:", cert.zone);
    const newArea = prompt("Edit Area:", cert.area);
    if (newOwner || newZone || newArea) {
      updateCertificate(cert.id, {
        owner: newOwner || cert.owner,
        zone: newZone || cert.zone,
        area: newArea || cert.area
      });
    }
  }
  
  useEffect(() => {
    const token = localStorage.getItem("tdr_admin_token");
    
    // Automatically log out if no token exists in local storage
    if (!token) {
        setLoggedIn(false);
        return;
    }

    // Ping the backend using the exact provided snippet to verify authorization
    fetch(`${import.meta.env.VITE_API_URL}/admin/data`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
        if (!res.ok) {
            alert("Session expired or Unauthorized API access!");
            localStorage.removeItem("tdr_admin_token");
            setLoggedIn(false);
        }
    })
    .catch(err => {
        console.error("Dashboard secure ping failed", err);
    });
  }, [setLoggedIn]);
  
  return (
    <div style={{ minHeight: '100vh', padding: '2rem', backgroundColor: '#f8f9fa' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', maxWidth: '1200px', margin: '0 auto 2rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}><LayoutDashboard /> System Admin Base</h1>
        <div style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--success-bg)', color: 'var(--success)', borderRadius: '1rem', display: 'flex', alignItems: 'center' }}>
           <UserCheck size={18} style={{ marginRight: '0.5rem' }}/> 
           Admin Session Active
        </div>
      </div>
      
      
      <div className="card" style={{ marginBottom: '2rem', maxWidth: '1200px', margin: '0 auto 2rem' }}>
        <div className="card-header">
          <h2 style={{ margin: 0 }}>Global Certificate Control</h2>
        </div>
        <div className="card-body" style={{ padding: 0, overflowX: 'auto' }}>
           <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                    <td style={{ fontWeight: 500 }}>
                      {tdr.owner}
                      {tdr.filepath && (
                         <a 
                           href={`${import.meta.env.VITE_API_URL.replace('/api', '')}${tdr.filepath}`} 
                           target="_blank" 
                           rel="noreferrer"
                           style={{ marginLeft: '10px', color: '#666', textDecoration: 'none' }}
                           title="View uploaded document"
                         >
                           <ExternalLink size={14} />
                         </a>
                      )}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{tdr.aadhaar || 'N/A'}</td>
                    <td>{tdr.zone} <br/> <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)'}}>{tdr.area}</span></td>
                    <td>
                      <span className={`status-badge status-${tdr.status.toLowerCase()}`}>
                        {tdr.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: '#e2e8f0' }}
                          onClick={() => handleEditCert(tdr)}
                        >
                          Edit
                        </button>
                        {tdr.filepath && (
                          <button 
                             className="btn-secondary" 
                             style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: '#edf2f7' }}
                             onClick={() => window.open(`${import.meta.env.VITE_API_URL.replace('/api', '')}${tdr.filepath}`, '_blank')}
                          >
                             View Doc
                          </button>
                        )}
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)' }}
                          onClick={() => { if(window.confirm('Delete this certificate permanently?')) deleteCertificate(tdr.id); }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
      <div className="card" style={{ marginBottom: '2rem', maxWidth: '1200px', margin: '0 auto 2rem' }}>
        <div className="card-header">
          <h2 style={{ margin: 0 }}>Registered User Profiles</h2>
        </div>
        <div className="card-body" style={{ padding: 0, overflowX: 'auto' }}>
           <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Mobile Contact</th>
                  <th>Email Address</th>
                  <th>Account Status</th>
                  <th>Administrative Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id || i}>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{u.id}</td>
                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                    <td>{u.mobile}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`status-badge status-${u.status === 'Active' ? 'verified' : 'rejected'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: u.status === 'Suspended' ? 'var(--success-bg)' : undefined, color: u.status === 'Suspended' ? 'var(--success)' : undefined }}
                          onClick={() => updateUser(u.id, { status: u.status === 'Active' ? 'Suspended' : 'Active' })}
                        >
                          {u.status === 'Active' ? 'Suspend Access' : 'Restore Access'}
                        </button>
                        <button 
                          className="btn-secondary" 
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)' }}
                          onClick={() => { if(window.confirm('Delete user profile completely?')) deleteUser(u.id); }}
                        >
                          Delete User
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem', maxWidth: '1200px', margin: '0 auto 2rem' }}>
        <div className="card-header">
          <h2 style={{ margin: 0 }}>Electronic Document Vault</h2>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
           <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>TDR Reference</th>
                  <th>Filename</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {certificates.filter(c => c.filepath).map((c, i) => (
                  <tr key={c.id || i}>
                    <td style={{ fontWeight: 600 }}>{c.id}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{c.filename || 'uploaded_document.pdf'}</td>
                    <td>
                       <div style={{ display: 'flex', gap: '1rem' }}>
                          <button 
                            className="btn-secondary" 
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#ebf8ff', color: '#2b6cb0' }}
                            onClick={() => window.open(`${import.meta.env.VITE_API_URL.replace('/api', '')}${c.filepath}`, '_blank')}
                          >
                             <FileSearch size={16} /> Open Proof
                          </button>
                          <button 
                            className="btn-secondary" 
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#fff5f5', color: '#c53030' }}
                            onClick={() => { if(window.confirm('Purge this document from server?')) deleteCertificate(c.id); }}
                          >
                             <Trash2 size={16} /> Purge
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

const AdminPortal = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    
    if (!loggedIn) {
        return <AdminLogin setLoggedIn={setLoggedIn} />;
    }
    
    return <AdminDashboard setLoggedIn={setLoggedIn} />;
}

export default AdminPortal;
