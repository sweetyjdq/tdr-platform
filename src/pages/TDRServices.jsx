import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSignature, ArrowRightLeft, Upload, CheckCircle, Database } from 'lucide-react';
import UploadCertificate from './UploadCertificate';
import api from '../api/client';

const TDRServices = () => {
  const [activeService, setActiveService] = useState('upload'); // upload, request, issue, transfer
  const [issueStatus, setIssueStatus] = useState('idle');
  const [requestStatus, setRequestStatus] = useState('idle');

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    setIssueStatus('processing');
    setTimeout(() => {
      setIssueStatus('success');
    }, 2000);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <FileSignature size={28} />
          e-TDR Services
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {[
          { id: 'upload',   label: 'Upload Doc', icon: <Upload size={20} />,   color: '#3b82f6' },
          { id: 'request',  label: 'Request',    icon: <FileSignature size={20} />, color: '#10b981' },
          { id: 'issue',    label: 'Issue',      icon: <FileSignature size={20} />, color: '#f59e0b' },
          { id: 'transfer', label: 'Transfer',   icon: <ArrowRightLeft size={20} />, color: '#8b5cf6' },
        ].map((s) => (
          <button 
            key={s.id}
            onClick={() => setActiveService(s.id)}
            style={{ 
              padding: '1.5rem 1rem', 
              borderRadius: 'var(--radius-xl)', 
              background: activeService === s.id ? 'white' : 'transparent',
              border: '1px solid',
              borderColor: activeService === s.id ? s.color : 'rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: activeService === s.id ? `0 10px 25px -5px ${s.color}20` : 'none',
              transform: activeService === s.id ? 'translateY(-4px)' : 'none'
            }}
          >
            <div style={{ 
              padding: '0.8rem', 
              borderRadius: '14px', 
              background: activeService === s.id ? s.color : '#f1f5f9',
              color: activeService === s.id ? 'white' : '#64748b'
            }}>
              {s.icon}
            </div>
            <span style={{ 
              fontWeight: 700, 
              fontSize: '0.9rem', 
              color: activeService === s.id ? s.color : '#64748b' 
            }}>{s.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeService === 'upload' && (
          <motion.div 
            key="upload"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            style={{ marginTop: '-1.5rem' }}
          >
            <UploadCertificate />
          </motion.div>
        )}

        {activeService === 'request' && (
          <motion.div 
            key="request"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card"
            style={{ maxWidth: '900px', margin: '0 auto', overflow: 'hidden' }}
          >
            <div className="card-header" style={{ background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)', border: 'none' }}>
              <h2 style={{ color: 'white' }}>Property Surrender & TDR Request</h2>
            </div>
            <div className="card-body" style={{ padding: '2.5rem' }}>
              {requestStatus === 'success' ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ width: '80px', height: '80px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#10b981' }}>
                    <CheckCircle size={40} />
                  </div>
                  <h3 style={{ color: '#065f46', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Transaction Broadcasted</h3>
                  <p style={{ color: '#64748b', marginBottom: '2rem' }}>Property surrender deed has been anchored to blockchain. Tracking ID: SMC-TDR-REQ-94281</p>
                  <button className="btn-primary" onClick={() => setRequestStatus('idle')} style={{ background: '#10b981' }}>Submit New Entry</button>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setRequestStatus('success'); }}>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="label">Owner / Entity Name</label>
                      <input type="text" placeholder="Full legal name..." style={{ borderRadius: '12px', padding: '0.8rem' }} required />
                    </div>
                    <div className="form-group">
                      <label className="label">Aadhaar / GSTIN</label>
                      <input type="text" placeholder="Identification..." style={{ borderRadius: '12px', padding: '0.8rem' }} required />
                    </div>
                    <div className="form-group">
                      <label className="label">Land Area (Sq. Meters)</label>
                      <input type="number" placeholder="0.00" style={{ borderRadius: '12px', padding: '0.8rem' }} required />
                    </div>
                    <div className="form-group">
                      <label className="label">Zone / Ward</label>
                      <select style={{ borderRadius: '12px', padding: '0.8rem' }} required>
                        <option value="">Select Region...</option>
                        <option value="Central">Central Ward</option>
                        <option value="West">West Zone (Adajan)</option>
                        <option value="South">South Zone</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label className="label">Document Reference ID</label>
                      <input type="text" placeholder="REF-XXXX..." style={{ borderRadius: '12px', padding: '0.8rem' }} required />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
                    <button type="submit" className="btn-primary" style={{ background: '#10b981', padding: '1rem 2.5rem', borderRadius: '12px', fontWeight: 700 }}>
                      Execute Smart Contract Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}

        {activeService === 'issue' && (
          <motion.div 
            key="issue"
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card"
            style={{ maxWidth: '900px', margin: '0 auto' }}
          >
            <div className="card-header" style={{ background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)', border: 'none' }}>
              <h2 style={{ color: 'white' }}>Official TDR Issuance (Officer Node)</h2>
            </div>
            <div className="card-body" style={{ padding: '2.5rem' }}>
              {issueStatus === 'success' ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                   <div style={{ width: '80px', height: '80px', background: '#fffbe6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#f59e0b' }}>
                    <Database size={40} />
                  </div>
                  <h3 style={{ color: '#92400e', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>TDR Issued on Mainnet</h3>
                  <p>Digital certificate generated and anchored with block hash.</p>
                  <button className="btn-primary" style={{ background: '#f59e0b', marginTop: '1.5rem' }} onClick={() => setIssueStatus('idle')}>Register Another</button>
                </div>
              ) : (
                <form onSubmit={handleIssueSubmit}>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="label">Verification Hash ID</label>
                      <input type="text" placeholder="Enter doc hash..." style={{ borderRadius: '12px', padding: '0.8rem' }} required />
                    </div>
                    <div className="form-group">
                      <label className="label">Zone Category</label>
                      <select style={{ borderRadius: '12px', padding: '0.8rem' }} required>
                        <option value="">Select...</option>
                        <option value="R1">Residential (R1)</option>
                        <option value="C1">Commercial (C1)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="label">Final Approved Area</label>
                      <input type="number" style={{ borderRadius: '12px', padding: '0.8rem' }} placeholder="Sq.M" required />
                    </div>
                    <div className="form-group">
                      <label className="label">Officer Ledger Signature</label>
                      <input type="text" placeholder="Sign with private key..." style={{ borderRadius: '12px', padding: '0.8rem' }} required />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2.5rem' }}>
                    <button type="submit" className="btn-primary" style={{ background: '#f59e0b', padding: '1rem 2.5rem', borderRadius: '12px', fontWeight: 700 }}>
                      {issueStatus === 'processing' ? 'Anchoring...' : 'Commit to Blockchain'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}

        {activeService === 'transfer' && (
          <motion.div 
            key="transfer"
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card"
            style={{ maxWidth: '900px', margin: '0 auto' }}
          >
            <div className="card-header" style={{ background: 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)', border: 'none' }}>
              <h2 style={{ color: 'white' }}>Asset Ownership Transfer</h2>
            </div>
            <div className="card-body" style={{ padding: '2.5rem' }}>
              <form onSubmit={async (e) => { 
                e.preventDefault(); 
                const form = e.target;
                const tdrID = form.tdrID.value;
                const newOwner = form.newOwner.value;
                
                try {
                  const res = await api.post('/api/transfer-tdr', { 
                    docID: tdrID, 
                    newOwner: newOwner,
                    fabricID: 'SMC-ADMIN-01' 
                  });
                  if (res.status === 'success') {
                    alert('Transfer Successful! Redirecting to new Blockchain Certificate.');
                    window.open(import.meta.env.VITE_API_URL + res.pdfPath, '_blank');
                  }
                } catch (err) {
                  alert("Transfer failed: " + err.message);
                }
              }}>
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="form-group">
                    <label className="label">TDR Certificate ID / Doc ID</label>
                    <input name="tdrID" type="text" placeholder="TDR-SMC-XXXX" style={{ borderRadius: '12px', padding: '0.8rem' }} required />
                  </div>
                  <div className="form-group">
                    <label className="label">Transferable Area (Check Ledger)</label>
                    <input type="number" style={{ borderRadius: '12px', padding: '0.8rem' }} placeholder="Sq.M" required />
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '20px', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowRightLeft size={18} color="#8b5cf6" />
                    Asset Participant Resolution
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="form-group mb-0">
                      <label className="label">Current Legal Holder</label>
                      <input type="text" placeholder="Search SMC Ledger..." style={{ borderRadius: '12px', padding: '0.8rem' }} required />
                    </div>
                    <div className="form-group mb-0">
                      <label className="label">Target Recipient Name (For OCR/PDF)</label>
                      <input name="newOwner" type="text" placeholder="Full Legal Name" style={{ borderRadius: '12px', padding: '0.8rem' }} required />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: 'auto' }}>
                      <Database size={16} color="#8b5cf6" />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Network State: COMMITTING</span>
                   </div>
                  <button type="submit" className="btn-primary" style={{ background: '#8b5cf6', padding: '1rem 2.5rem', borderRadius: '12px', fontWeight: 700, boxShadow: '0 10px 20px rgba(139, 92, 246, 0.3)' }}>
                    Execute Transfer & Generate Certificate
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default TDRServices;
