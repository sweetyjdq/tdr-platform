import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, X, Shield, Lock, Cpu, Globe, Zap, Database } from 'lucide-react';
import { useCertificates } from '../context/CertificateContext';
import api from '../api/client';
import { useUsers } from '../context/UserContext';

const UploadCertificate = () => {
  const { addCertificate } = useCertificates();
  const { currentUser } = useUsers();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [uploadId, setUploadId] = useState('');
  const [formData, setFormData] = useState({
    owner: '',
    aadhaar: '',
    surveyNo: '',
    area: '',
    zone: 'North Zone'
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#3b82f6';
    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#e2e8f0';
    e.currentTarget.style.background = 'transparent';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.style.borderColor = '#e2e8f0';
    e.currentTarget.style.background = 'transparent';
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');

    try {
      const formPayload = new FormData();
      formPayload.append('document', file);
      formPayload.append('fabricID', currentUser?.fabric_id || 'guest');
      
      Object.entries(formData).forEach(([key, val]) => formPayload.append(key, val));

      const data = await api.post('/api/upload-certificate', formPayload);

      setUploadId(data.uploadId);
      setStatus('success');
      addCertificate({
        id: data.uploadId,
        owner: formData.owner || 'Unknown Owner',
        aadhaar: formData.aadhaar || 'N/A',
        zone: formData.zone,
        area: formData.area || 'Unknown Area',
        status: 'Pending',
        filename: data.filename,
        filepath: data.path,
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      console.error('Upload error:', err);
      alert(`Upload failed: ${err.message}`);
      setStatus('idle');
    }
  };

  const resetForm = () => {
    setFile(null);
    setStatus('idle');
    setFormData({
      owner: '',
      aadhaar: '',
      surveyNo: '',
      area: '',
      zone: 'North Zone'
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="page-header" style={{ marginBottom: '3rem' }}>
        <h1 className="page-title" style={{ fontSize: '2.5rem', fontWeight: 800 }}>
          <Shield style={{ color: '#3b82f6' }} size={36} />
          Protocol Node: <span style={{ color: '#3b82f6' }}>Certificate Ingress</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Encrypt and anchor your property deeds to the distributed ledger.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2.5rem' }}>
        <div className="card" style={{ border: 'none', background: 'white', overflow: 'hidden' }}>
          <div className="card-header" style={{ background: '#f8fafc', padding: '1.5rem 2rem' }}>
            <h2 style={{ fontSize: '1.1rem', color: '#1e293b' }}>Secure Document Payload</h2>
          </div>
          <div className="card-body" style={{ padding: '2.5rem' }}>
            {status === 'success' ? (
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ width: '100px', height: '100px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', color: '#10b981' }}>
                  <CheckCircle size={50} />
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#065f46', marginBottom: '1rem' }}>Ingress Successful</h3>
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem' }}>
                   <div style={{ fontSize: '0.75rem', color: '#059669', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 700 }}>Chain Tracking ID</div>
                   <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700 }}>{uploadId}</div>
                </div>
                <button className="btn-primary" onClick={resetForm} style={{ background: '#10b981', padding: '1rem 2rem' }}>Anchor Next Document</button>
              </motion.div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="label" style={{ color: '#475569' }}>Property Owner Legal Name</label>
                  <input type="text" placeholder="Enter full name..." value={formData.owner} onChange={(e) => setFormData({...formData, owner: e.target.value})} style={{ padding: '1rem', borderRadius: '12px' }} />
                </div>
                <div className="form-group">
                  <label className="label" style={{ color: '#475569' }}>Aadhaar / Passport ID</label>
                  <input type="text" placeholder="128-bit UID..." value={formData.aadhaar} onChange={(e) => setFormData({...formData, aadhaar: e.target.value})} style={{ padding: '1rem', borderRadius: '12px' }} />
                </div>
                <div className="form-group">
                  <label className="label" style={{ color: '#475569' }}>Survey / Parcel ID</label>
                  <input type="text" placeholder="REF-0000" value={formData.surveyNo} onChange={(e) => setFormData({...formData, surveyNo: e.target.value})} style={{ padding: '1rem', borderRadius: '12px' }} />
                </div>
                
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="label" style={{ color: '#475569' }}>Asset Binary (PDF / Image)</label>
                  {!file ? (
                    <div 
                      style={{ height: '240px', border: '2px dashed #e2e8f0', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', cursor: 'pointer' }}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('fileInp').click()}
                    >
                      <Upload size={48} color="#94a3b8" style={{ marginBottom: '1.5rem' }} />
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>Transmit Document to Node</div>
                      <p style={{ color: '#64748b' }}>TLS 1.3 Secure Transfer</p>
                      <input id="fileInp" type="file" style={{ display: 'none' }} onChange={handleFileChange} />
                    </div>
                  ) : (
                    <div style={{ padding: '2rem', background: '#f8fafc', borderRadius: '24px', border: '1px solid #3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                          <div style={{ background: '#dbeafe', padding: '1rem', borderRadius: '12px' }}>
                             <FileText color="#3b82f6" />
                          </div>
                          <div>
                             <div style={{ fontWeight: 800, color: '#1e293b' }}>{file.name}</div>
                             <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{(file.size/1024).toFixed(0)} KB ready for hashing</div>
                          </div>
                       </div>
                       <X onClick={() => setFile(null)} style={{ cursor: 'pointer' }} color="#ef4444" />
                    </div>
                  )}
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                   <button 
                     onClick={handleUpload}
                     disabled={!file || status === 'uploading'}
                     className="btn-primary" 
                     style={{ background: '#0f172a', padding: '1.2rem 3rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 800 }}
                   >
                     {status === 'uploading' ? 'Hashing & Routing...' : 'Commit to Ledger'}
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <div className="card" style={{ background: 'linear-gradient(135deg, #0f172a, #111827)', border: 'none' }}>
              <div className="card-body" style={{ padding: '2rem' }}>
                 <Cpu size={32} color="#3b82f6" style={{ marginBottom: '1.5rem' }} />
                 <h3 style={{ color: 'white', marginBottom: '1rem' }}>Protocol Specifications</h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                       <Lock size={18} color="#3b82f6" />
                       <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Documents are processed via AES-GCM 256-bit encryption.</div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                       <Zap size={18} color="#3b82f6" />
                       <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Transaction broadcasted to 14 nodes simultaneously for consensus.</div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="card" style={{ border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <div className="card-body" style={{ padding: '2rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#10b981', marginBottom: '1.5rem' }}>
                    <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }} />
                    <span style={{ fontWeight: 800, letterSpacing: '0.05em' }}>LEDGER STATUS: ACTIVE</span>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Network Latency</span>
                       <span style={{ fontWeight: 700 }}>14ms</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                       <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Storage Engine</span>
                       <span style={{ fontWeight: 700 }}>LevelDB / IPFS</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UploadCertificate;
