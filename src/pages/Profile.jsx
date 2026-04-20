import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, MapPin, Camera, Save, Award, Key, Phone, Activity, ArrowLeft } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { admin, updateAdmin } = useAdmin();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: admin.name || 'Admin Officer',
    designation: admin.designation || 'Department of Planning',
    location: admin.location || 'SMC Head Quarter, Surat',
    email: admin.email || 'officer.tdr@suratmunicipal.gov.in',
    phone: admin.phone || '+91 261 2423750'
  });

  const handleSync = (e) => {
    e.preventDefault();
    updateAdmin({
      ...formData,
      initials: formData.name.charAt(0).toUpperCase()
    });
    alert('Identity synced to blockchain ledger successfully.');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: '1100px', margin: '0 auto' }}
    >
      <div className="page-header" style={{ marginBottom: '3rem' }}>
        <h1 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 800 }}>
          <button 
            onClick={() => navigate(-1)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, marginRight: '1rem' }}
          >
            <ArrowLeft size={32} color="#3b82f6" />
          </button>
          Executive <span style={{ color: '#3b82f6' }}>Identity</span>
        </h1>
        <p style={{ color: '#64748b', marginLeft: '3.5rem' }}>Manage your blockchain access credentials and regional administrative profile.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2.5rem' }}>
        {/* Left Column: Avatar & Quick Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center', border: 'none', background: 'white' }}>
            <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 2rem' }}>
              <div style={{ 
                width: '100%', 
                height: '100%', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: 'white', 
                fontSize: '4rem', 
                fontWeight: 800, 
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)',
                overflow: 'hidden'
              }}>
                {admin.photo ? <img src={admin.photo} alt="P" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : formData.name.charAt(0)}
              </div>
              <button style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'white', border: 'none', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', cursor: 'pointer' }}>
                <Camera size={20} color="#3b82f6" />
              </button>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.25rem' }}>{formData.name}</h2>
            <div style={{ color: '#3b82f6', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>{formData.designation}</div>
            
            <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
               <Shield size={24} color="#10b981" />
               <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>SECURITY STATUS</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669' }}>Fully Verified Node</div>
               </div>
            </div>
          </div>

          <div className="card" style={{ border: 'none', background: '#0f172a', padding: '2rem', color: 'white' }}>
             <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white' }}>
               <Award size={20} color="#3b82f6" />
               Access Level
             </h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { label: 'Blockchain Core', level: 'Full Access' },
                  { label: 'Asset Issuance', level: 'Authorized' },
                  { label: 'User Provisioning', level: 'Admin' },
                ].map((p, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.4rem' }}>{p.label}</div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                       <div style={{ width: '100%', height: '100%', background: '#3b82f6' }} />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column: Detailed Settings */}
        <div className="card" style={{ border: 'none', background: 'white' }}>
           <div className="card-header" style={{ padding: '2rem', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                 <Key size={22} color="#3b82f6" />
                 Account Infrastructure
              </h2>
           </div>
           <div className="card-body" style={{ padding: '3rem' }}>
              <form onSubmit={handleSync}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
                  <div className="form-group">
                      <label className="label" style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.1em' }}>FULL NAME</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f1f5f9', padding: '1rem', borderRadius: '12px' }}>
                        <User size={18} color="#94a3b8" />
                        <input 
                          type="text" 
                          value={formData.name} 
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          style={{ background: 'none', border: 'none', padding: 0, fontWeight: 700, width: '100%' }} 
                        />
                      </div>
                  </div>
                  <div className="form-group">
                      <label className="label" style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.1em' }}>OFFICIAL EMAIL</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f1f5f9', padding: '1rem', borderRadius: '12px' }}>
                        <Mail size={18} color="#94a3b8" />
                        <input 
                          type="email" 
                          value={formData.email} 
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          style={{ background: 'none', border: 'none', padding: 0, fontWeight: 700, width: '100%' }} 
                        />
                      </div>
                  </div>
                  <div className="form-group">
                      <label className="label" style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.1em' }}>PHONE REGISTRY</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f1f5f9', padding: '1rem', borderRadius: '12px' }}>
                        <Phone size={18} color="#94a3b8" />
                        <input 
                          type="text" 
                          value={formData.phone} 
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          style={{ background: 'none', border: 'none', padding: 0, fontWeight: 700, width: '100%' }} 
                        />
                      </div>
                  </div>
                  <div className="form-group">
                      <label className="label" style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.1em' }}>STATION / OFFICE</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f1f5f9', padding: '1rem', borderRadius: '12px' }}>
                        <MapPin size={18} color="#94a3b8" />
                        <input 
                          type="text" 
                          value={formData.location} 
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          style={{ background: 'none', border: 'none', padding: 0, fontWeight: 700, width: '100%' }} 
                        />
                      </div>
                  </div>
                </div>

                <div style={{ background: '#eff6ff', padding: '2rem', borderRadius: '20px', border: '1px dashed #3b82f6', marginBottom: '3rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Activity size={20} />
                        Public Key Metadata
                      </h3>
                      <code style={{ fontSize: '0.75rem', color: '#3b82f6', background: 'white', padding: '4px 10px', borderRadius: '20px' }}>ED25519</code>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#60a5fa', marginBottom: '1rem', fontFamily: 'monospace', wordBreak: 'break-all', background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '10px' }}>
                    df6a78c901e23f45b67890123d45e67f8a901234567890abcdef0123456789ab
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn-primary" style={{ padding: '1.2rem 3rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Save size={20} /> Sync Profile to Ledger
                  </button>
                </div>
              </form>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
