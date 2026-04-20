import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCertificates } from '../context/CertificateContext';
import { useUsers } from '../context/UserContext';
import { 
  Shield, LayoutDashboard, UserCheck, Lock, 
  ExternalLink, FileSearch, Trash2, Users, 
  FileText, CheckCircle, Clock, AlertTriangle, 
  LogOut, ArrowLeft, Zap, Database, Activity,
  Settings, Server, Cpu, Globe
} from 'lucide-react';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.post('/api/login', { username, password });
      localStorage.setItem("tdr_admin_token", data.token);
      setLoggedIn(true);
    } catch (err) {
      console.error("Login failed", err);
      alert(err.message || "Failed to connect to authentication server!");
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: 'radial-gradient(circle at 50% 50%, #0f172a 0%, #020617 100%)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Background Decorative Elements */}
      <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'rgba(59, 130, 246, 0.05)', filter: 'blur(100px)', borderRadius: '50%', top: '-100px', left: '-100px' }} />
      <div style={{ position: 'absolute', width: '400px', height: '400px', background: 'rgba(139, 92, 246, 0.05)', filter: 'blur(100px)', borderRadius: '50%', bottom: '-50px', right: '-50px' }} />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ width: '450px', zIndex: 10 }}
      >
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.03)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '32px',
          padding: '3.5rem',
          boxShadow: '0 50px 100px -20px rgba(0,0,0,0.5)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ 
              width: '90px', 
              height: '90px', 
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
              borderRadius: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 2rem',
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
            }}>
              <Shield size={48} color="white" />
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>Authority Gate</h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>Enter credentials for TDR Ledger access</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', display: 'block', marginBottom: '0.75rem' }}>ADMINISTRANT IDENTIFIER</label>
              <input 
                type="text" 
                placeholder="ID-8842-X" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required 
                style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '1rem' }} 
              />
            </div>
            <div className="form-group" style={{ marginBottom: '2.5rem' }}>
              <label style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', display: 'block', marginBottom: '0.75rem' }}>SECURE ACCESS KEY</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', color: 'white', fontSize: '1rem' }} 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '1.25rem', 
                borderRadius: '16px', 
                background: '#3b82f6', 
                color: 'white', 
                fontWeight: 800, 
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                boxShadow: '0 15px 30px -5px rgba(59, 130, 246, 0.4)'
              }}
            >
              {loading ? (
                <div style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : (
                <><Lock size={20} /> Authorize Session</>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

const AdminDashboard = ({ setLoggedIn }) => {
  const navigate = useNavigate();
  const { certificates, updateCertificateStatus, deleteCertificate } = useCertificates();
  const { users, updateUser, deleteUser } = useUsers();
  const [sysStats, setSysStats] = useState({ users: 0, certificates: 0, nodes: 14, status: 'Healthy' });
  
  const handleLogout = () => {
    localStorage.removeItem("tdr_admin_token");
    setLoggedIn(false);
  }
  
  useEffect(() => {
    const token = localStorage.getItem("tdr_admin_token");
    if (!token) return;

    api.get('/api/admin/data', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(data => {
      setSysStats({
        users: data.stats?.total_users || users.length,
        certificates: data.stats?.total_certs || certificates.length,
        nodes: 14,
        status: 'Operational'
      });
    })
    .catch(err => console.error("Dashboard link fail", err));
  }, [users.length, certificates.length]);

  const statCards = [
    { label: 'Blockchain TDR Assets', value: sysStats.certificates.toString(), icon: <FileText size={24} />, color: '#3b82f6' },
    { label: 'Registered Participants', value: sysStats.users.toString(), icon: <Users size={24} />, color: '#10b981' },
    { label: 'Network Consensus Nodes', value: sysStats.nodes.toString(), icon: <Server size={24} />, color: '#f59e0b' },
    { label: 'Ledger Growth (Blocks)', value: '#48,921', icon: <Database size={24} />, color: '#8b5cf6' },
  ];
  
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <header style={{ height: '80px', background: 'white', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, zIndex: 100, padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
           <button onClick={() => navigate('/')} style={{ background: '#f1f5f9', border: 'none', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
             <ArrowLeft size={18} color="#64748b" />
           </button>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
             <Shield size={28} color="#3b82f6" />
             <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Authority <span style={{ color: '#3b82f6' }}>Command</span></h1>
           </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ecfdf5', color: '#059669', padding: '0.5rem 1rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 800 }}>
             <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }} />
             SECURE NODE: 0x-A42
           </div>
           <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 800, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
             <LogOut size={18} /> Terminate
           </button>
        </div>
      </header>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '3rem' }}>
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Network Intelligence</h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Global administrative oversight of e-TDR Distributed Ledger Protocol.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
          {statCards.map((s, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="card"
              style={{ padding: '2rem', border: 'none', background: 'white' }}
            >
              <div style={{ color: s.color, marginBottom: '1.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, marginBottom: '0.5rem' }}>{s.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
            </motion.div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ border: 'none', background: 'white', overflow: 'hidden' }}>
              <div className="card-header" style={{ padding: '1.5rem 2rem', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <FileSearch size={20} color="#3b82f6" /> Asset Ledger
                </h3>
                <button className="btn-secondary" style={{ fontSize: '0.8rem' }}>Export Chain Manifest</button>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                      <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>UUID</th>
                      <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Owner Details</th>
                      <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Region</th>
                      <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '1rem 2rem', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase' }}>Command</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.map(c => (
                      <tr key={c.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '1.5rem 2rem', fontFamily: 'monospace', fontWeight: 700, color: '#3b82f6' }}>#{c.id.toString().slice(0,8)}</td>
                        <td style={{ padding: '1.5rem 2rem' }}>
                           <div style={{ fontWeight: 800, color: '#0f172a' }}>{c.owner}</div>
                           <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.aadhaar}</div>
                        </td>
                        <td style={{ padding: '1.5rem 2rem' }}>
                           <div style={{ fontWeight: 700 }}>{c.zone}</div>
                           <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.area} SQFT</div>
                        </td>
                        <td style={{ padding: '1.5rem 2rem' }}>
                           <span style={{ 
                             padding: '0.4rem 0.8rem', 
                             borderRadius: '50px', 
                             fontSize: '0.75rem', 
                             fontWeight: 800,
                             background: c.status === 'Verified' ? '#ecfdf5' : '#fff7ed',
                             color: c.status === 'Verified' ? '#059669' : '#c2410c'
                           }}>{c.status}</span>
                        </td>
                        <td style={{ padding: '1.5rem 2rem' }}>
                           <div style={{ display: 'flex', gap: '0.5rem' }}>
                             <button 
                               onClick={() => updateCertificateStatus(c.id, 'Verified')}
                               style={{ background: '#0f172a', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                             >Verify</button>
                             <button 
                               onClick={() => deleteCertificate(c.id)}
                               style={{ background: '#fee2e2', border: 'none', color: '#ef4444', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
                             ><Trash2 size={16} /></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card" style={{ border: 'none', background: 'white' }}>
               <div className="card-header" style={{ padding: '1.5rem 2rem', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                 <h3 style={{ fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Users size={20} color="#3b82f6" /> Participant Directory
                 </h3>
               </div>
               <div className="card-body" style={{ padding: 0 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '1.25rem 2rem' }}>
                             <div style={{ fontWeight: 800, color: '#0f172a' }}>{u.name}</div>
                             <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.email}</div>
                          </td>
                          <td style={{ padding: '1.25rem 2rem' }}>
                             <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>FABRIC ID</div>
                             <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{u.fabric_id || 'unassigned'}</div>
                          </td>
                          <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                             <button 
                               onClick={() => updateUser(u.id, { status: u.status === 'Active' ? 'Suspended' : 'Active' })}
                               style={{ background: u.status === 'Active' ? '#f1f5f9' : '#0f172a', color: u.status === 'Active' ? '#0f172a' : 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                             >
                               {u.status === 'Active' ? 'Suspend' : 'Reinstate'}
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             <div className="card" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', border: 'none', color: 'white' }}>
                <div style={{ padding: '2rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                      <Activity color="#3b82f6" />
                      <h3 style={{ margin: 0, color: 'white' }}>Service Health</h3>
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {[
                        { name: 'Gateway Node 1', status: 'Online', latency: '4ms' },
                        { name: 'Hyperledger Peer', status: 'Syncing', latency: '12ms' },
                        { name: 'Identity Service', status: 'Online', latency: '2ms' },
                        { name: 'Consensus Engine', status: 'Optimal', latency: '1ms' },
                      ].map(s => (
                        <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <div>
                              <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{s.name}</div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Latency: {s.latency}</div>
                           </div>
                           <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', padding: '2px 8px', borderRadius: '4px' }}>{s.status}</div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             <div className="card" style={{ border: 'none', background: 'white' }}>
                <div style={{ padding: '2rem' }}>
                   <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.5rem' }}>Audit Trail</h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {[
                        { time: '2m ago', text: 'Admin 0x-A42 signed block #48,920' },
                        { time: '14m ago', text: 'Identity SMC-UID-09 registered' },
                        { time: '1h ago', text: 'Channel configuration updated' },
                      ].map((t, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                           <div style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', marginTop: '6px' }} />
                           <div>
                              <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>{t.text}</div>
                              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{t.time}</div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const AdminPortal = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    
    useEffect(() => {
      if(localStorage.getItem('tdr_admin_token')) setLoggedIn(true);
    }, []);

    return (
      <AnimatePresence mode="wait">
        {!loggedIn ? (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <AdminLogin setLoggedIn={setLoggedIn} />
          </motion.div>
        ) : (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
             <AdminDashboard setLoggedIn={setLoggedIn} />
          </motion.div>
        )}
      </AnimatePresence>
    );
}

export default AdminPortal;
