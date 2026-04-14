import React, { useState } from 'react';
import { Search, ShieldCheck, List, CheckCircle } from 'lucide-react';

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

      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
        <button 
          style={{ 
            padding: '1rem 2rem', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'verify' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'verify' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'verify' ? '600' : '400',
            fontSize: '1.125rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onClick={() => setActiveTab('verify')}
        >
          <Search size={20} />
          Verify Document
        </button>
        <button 
          style={{ 
            padding: '1rem 2rem', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'list' ? '3px solid var(--primary)' : '3px solid transparent',
            color: activeTab === 'list' ? 'var(--primary)' : 'var(--text-muted)',
            fontWeight: activeTab === 'list' ? '600' : '400',
            fontSize: '1.125rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onClick={() => setActiveTab('list')}
        >
          <List size={20} />
          TDR Public Registry
        </button>
      </div>

      {activeTab === 'verify' && (
        <div className="grid gap-6" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)' }}>
          <div className="card">
            <div className="card-header">
              <h2>Verify Document Integrity (API: /verify-document)</h2>
            </div>
            <div className="card-body">
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                Enter the TxHash or upload the document to verify its authenticity against the SMC Blockchain Ledger.
              </p>
              
              <form onSubmit={handleVerify}>
                <div className="form-group">
                  <label className="label">Transaction Hash / Document ID</label>
                  <input type="text" placeholder="0x..." required />
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', gap: '1rem' }}>
                  <div style={{ height: '1px', flex: 1, backgroundColor: 'var(--border)' }}></div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>OR</span>
                  <div style={{ height: '1px', flex: 1, backgroundColor: 'var(--border)' }}></div>
                </div>

                <div className="form-group">
                  <label className="label">Re-upload Document for Verification</label>
                  <input type="file" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                  <button type="submit" className="btn-primary" disabled={verifyStatus === 'loading'}>
                    {verifyStatus === 'loading' ? 'Verifying Nodes...' : 'Verify on Blockchain'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {verifyStatus === 'success' && (
            <div className="card" style={{ border: '2px solid var(--success)' }}>
              <div className="card-header" style={{ backgroundColor: 'var(--success-bg)', borderBottom: '1px solid var(--success)' }}>
                <h2 style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={20} />
                  Document Verified Authentic
                </h2>
              </div>
              <div className="card-body">
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Block Hash</div>
                  <div style={{ fontFamily: 'monospace', fontWeight: 600 }}>0x8f2a9c3d4b6e7f8a1c2d3e4f5a6b7c8d</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Timestamp</div>
                    <div style={{ fontWeight: 500 }}>Oct 24, 2023 14:32 IST</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mined By Node</div>
                    <div style={{ fontWeight: 500 }}>SMC-Validator-04</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Original Owner</div>
                    <div style={{ fontWeight: 500 }}>Ramesh Kumar</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TDR Link</div>
                    <div style={{ fontWeight: 500, color: 'var(--primary)' }}>TDR-SMC-8492</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'list' && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Public TDR Ledger (API: /list-tdr)</h2>
            <button className="btn-secondary">Export CSV</button>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>TDR Certificate ID</th>
                  <th>Current Owner (Public Key)</th>
                  <th>Area (Sq.M)</th>
                  <th>Zone Issued</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((item) => (
                  <tr key={item}>
                    <td style={{ fontWeight: 500, color: 'var(--primary)' }}>TDR-SMC-{8000 + item * 14}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>0x{Math.random().toString(16).substr(2, 8)}...{Math.random().toString(16).substr(2, 4)}</td>
                    <td>{Math.floor(Math.random() * 5000) + 500}</td>
                    <td>{['R1', 'R2', 'C1'][Math.floor(Math.random() * 3)]}</td>
                    <td><span className="status-badge status-verified">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default BlockchainVerification;
