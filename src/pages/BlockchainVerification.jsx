import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, List, CheckCircle, Activity, Database } from 'lucide-react';

const BlockchainVerification = () => {
  const [activeTab, setActiveTab] = useState('verify'); // verify, list
  const [verifyStatus, setVerifyStatus] = useState('idle');

  const handleVerify = (e) => {
    e.preventDefault();
    setVerifyStatus('loading');
    setTimeout(() => {
      setVerifyStatus('success');
    }, 1500);
  };

  return (
    <div>
      <div className="page-header" style={{ borderBottom: 'none', marginBottom: '1rem' }}>
        <h1 className="page-title">
          <ShieldCheck size={28} />
          Blockchain Verification & Registry
        </h1>
      </div>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
        <button 
          style={{ 
            background: 'none', 
            border: 'none', 
            padding: '1rem 0',
            color: activeTab === 'verify' ? '#3b82f6' : '#94a3b8',
            fontWeight: 800,
            fontSize: '1.25rem',
            borderBottom: activeTab === 'verify' ? '4px solid #3b82f6' : '4px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            transition: 'all 0.3s'
          }}
          onClick={() => setActiveTab('verify')}
        >
          <Search size={22} />
          Protocol Verification
        </button>
        <button 
          style={{ 
            background: 'none', 
            border: 'none', 
            padding: '1rem 0',
            color: activeTab === 'list' ? '#3b82f6' : '#94a3b8',
            fontWeight: 800,
            fontSize: '1.25rem',
            borderBottom: activeTab === 'list' ? '4px solid #3b82f6' : '4px solid transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            transition: 'all 0.3s'
          }}
          onClick={() => setActiveTab('list')}
        >
          <List size={22} />
          Public TDR Ledger
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'verify' && (
          <motion.div 
            key="verify"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid gap-8" 
            style={{ gridTemplateColumns: '1fr 1fr' }}
          >
            <div className="card" style={{ border: 'none', background: 'white', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
              <div className="card-header" style={{ padding: '2rem 1.5rem', background: '#f8fafc' }}>
                <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ShieldCheck size={24} color="#3b82f6" />
                  Anchor Validator
                </h2>
              </div>
              <div className="card-body" style={{ padding: '2.5rem' }}>
                <form onSubmit={handleVerify}>
                  <div className="form-group" style={{ marginBottom: '2rem' }}>
                    <label className="label" style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.1em' }}>TRANSACTION HASH / DOC ID</label>
                    <input type="text" placeholder="0x..." style={{ background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }} required />
                  </div>
                  
                  <div style={{ position: 'relative', margin: '2.5rem 0', textAlign: 'center' }}>
                    <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
                    <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '0 1rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600 }}>CRYPTO HASH VERIFICATION</span>
                  </div>

                  <div className="form-group">
                    <label className="label" style={{ color: '#64748b', fontSize: '0.75rem', letterSpacing: '0.1em' }}>BINARY UPLOAD</label>
                    <div style={{ border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '2rem', textAlign: 'center', background: '#f8fafc' }}>
                       <input type="file" style={{ cursor: 'pointer' }} />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '2.5rem', padding: '1.2rem', borderRadius: '12px', fontSize: '1.1rem', background: '#3b82f6', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.2)' }}>
                    {verifyStatus === 'loading' ? 'Polling Nodes...' : 'Execute Consensus Check'}
                  </button>
                </form>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
               {verifyStatus === 'success' ? (
                 <motion.div 
                   initial={{ scale: 0.9, opacity: 0 }}
                   animate={{ scale: 1, opacity: 1 }}
                   className="card" 
                   style={{ height: '100%', border: 'none', background: 'linear-gradient(135deg, #0f172a, #1e293b)' }}
                 >
                   <div style={{ padding: '3rem', color: 'white' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#10b981', marginBottom: '2rem' }}>
                         <CheckCircle size={32} />
                         <h2 style={{ color: 'white', margin: 0 }}>Certificate Validated</h2>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                         <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Immutable Block Hash</div>
                            <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#e2e8f0', wordBreak: 'break-all' }}>0x821FA94...3BCC1</div>
                         </div>

                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                               <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Mined At</div>
                               <div style={{ fontWeight: 700 }}>24 APR 2026, 12:44</div>
                            </div>
                            <div>
                               <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Consensus Level</div>
                               <div style={{ fontWeight: 700, color: '#10b981' }}>100% (14/14 Nodes)</div>
                            </div>
                            <div>
                               <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Certified Owner</div>
                               <div style={{ fontWeight: 700 }}>Ramesh Kumar (SMC-294)</div>
                            </div>
                            <div>
                               <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>TDR ID</div>
                               <div style={{ fontWeight: 700, color: '#3b82f6' }}>SMC-TDR-8429</div>
                            </div>
                         </div>
                      </div>
                   </div>
                 </motion.div>
               ) : (
                 <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '24px' }}>
                    <div style={{ textAlign: 'center' }}>
                       <Activity size={48} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                       <p>Awaiting Protocol Execution</p>
                    </div>
                 </div>
               )}
            </div>
          </motion.div>
        )}

        {activeTab === 'list' && (
          <motion.div 
            key="list"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card"
            style={{ border: 'none', background: 'white', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.04)' }}
          >
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', padding: '2rem', background: '#f8fafc' }}>
               <h2 style={{ margin: 0 }}>Verified Asset Ledger</h2>
               <button onClick={() => navigate('/services')} className="btn-primary" style={{ background: '#0f172a', padding: '0.6rem 1.5rem', borderRadius: '10px' }}>Apply for e-TDR</button>
            </div>
            <div style={{ padding: '0' }}>
               <table className="data-table" style={{ borderSpacing: '0' }}>
                 <thead style={{ background: '#f1f5f9' }}>
                   <tr>
                     <th style={{ padding: '1.5rem' }}>Asset ID (TDR)</th>
                     <th>Public Key (Owner)</th>
                     <th>Allocation (Sq.M)</th>
                     <th>Channel / Node</th>
                     <th style={{ textAlign: 'center' }}>Blockchain Status</th>
                   </tr>
                 </thead>
                 <tbody>
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '5rem', color: '#94a3b8' }}>
                         <Database size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                         <p style={{ fontWeight: 600 }}>Synchronizing Ledger States... 0 items found</p>
                      </td>
                    </tr>
                 </tbody>
               </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default BlockchainVerification;
