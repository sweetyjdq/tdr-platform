import React, { useState } from 'react';
import { FileSignature, ArrowRightLeft, Upload } from 'lucide-react';
import UploadCertificate from './UploadCertificate';

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

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className={activeService === 'upload' ? 'btn-primary' : 'btn-secondary'} 
          onClick={() => setActiveService('upload')}
          style={{ flex: 1, padding: '1rem', fontSize: '1rem' }}
        >
          <Upload size={20} />
          1. Upload Certificate
        </button>
        <button 
          className={activeService === 'request' ? 'btn-primary' : 'btn-secondary'} 
          onClick={() => setActiveService('request')}
          style={{ flex: 1, padding: '1rem', fontSize: '1rem' }}
        >
          <FileSignature size={20} />
          2. Request TDR
        </button>
        <button 
          className={activeService === 'issue' ? 'btn-primary' : 'btn-secondary'} 
          onClick={() => setActiveService('issue')}
          style={{ flex: 1, padding: '1rem', fontSize: '1rem' }}
        >
          <FileSignature size={20} />
          3. Issue TDR
        </button>
        <button 
          className={activeService === 'transfer' ? 'btn-primary' : 'btn-secondary'} 
          onClick={() => setActiveService('transfer')}
          style={{ flex: 1, padding: '1rem', fontSize: '1rem' }}
        >
          <ArrowRightLeft size={20} />
          4. Transfer TDR
        </button>
      </div>

      {activeService === 'upload' && (
        <div style={{ marginTop: '-1.5rem' }}>
          <UploadCertificate />
        </div>
      )}

      {activeService === 'request' && (
        <div className="card">
          <div className="card-header">
            <h2>Request TDR Certificate (API: /request-tdr)</h2>
          </div>
          <div className="card-body">
            {requestStatus === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h3 style={{ color: 'var(--success)', marginBottom: '1rem' }}>TDR Request Submitted!</h3>
                <p>Your request ID is: <strong>REQ-SMC-9942</strong></p>
                <p style={{ color: 'var(--text-muted)' }}>An SMS and Email notification have been sent. Please await SMC processing.</p>
                <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => setRequestStatus('idle')}>Submit Another Request</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setRequestStatus('success'); }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="label">Citizen/Entity Name</label>
                    <input type="text" placeholder="Enter full name..." required />
                  </div>
                  <div className="form-group">
                    <label className="label">Aadhaar / Entity ID</label>
                    <input type="text" placeholder="Enter identification number..." required />
                  </div>
                  <div className="form-group">
                    <label className="label">Surrendered Land Area (Sq. Meters)</label>
                    <input type="number" placeholder="Enter land area..." required />
                  </div>
                  <div className="form-group">
                    <label className="label">Locality / Zone</label>
                    <input type="text" placeholder="e.g. Adajan, R1 Zone" required />
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="label">Reference Upload ID (from Step 1)</label>
                    <input type="text" placeholder="Enter the document upload reference ID..." required />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button type="submit" className="btn-primary">
                    Submit TDR Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {activeService === 'issue' && (
        <div className="card">
          <div className="card-header">
            <h2>Issue New TDR (API: /issue-tdr)</h2>
          </div>
          <div className="card-body">
            {issueStatus === 'success' ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h3 style={{ color: 'var(--success)', marginBottom: '1rem' }}>TDR Issued Successfully on Blockchain!</h3>
                <p>TDR ID: <strong>TDR-SMC-29584</strong></p>
                <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => setIssueStatus('idle')}>Issue Another</button>
              </div>
            ) : (
              <form onSubmit={handleIssueSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="label">Verification Hash ID</label>
                    <input type="text" placeholder="Enter document hash..." required />
                  </div>
                  <div className="form-group">
                    <label className="label">Zone Category</label>
                    <select required>
                      <option value="">Select Zone...</option>
                      <option value="R1">R1 (Residential Core)</option>
                      <option value="R2">R2 (Residential Periphery)</option>
                      <option value="C1">C1 (Commercial)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label">Total TDR Area (Sq. Meters)</label>
                    <input type="number" placeholder="Enter area..." required />
                  </div>
                  <div className="form-group">
                    <label className="label">Owner Digital Signature</label>
                    <input type="text" placeholder="Paste signature hash..." required />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button type="submit" className="btn-primary" disabled={issueStatus === 'processing'}>
                    {issueStatus === 'processing' ? 'Writing to Ledger...' : 'Generate & Issue TDR'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {activeService === 'transfer' && (
        <div className="card">
          <div className="card-header">
            <h2>Transfer TDR Ownership (API: /transfer-tdr)</h2>
          </div>
          <div className="card-body">
            <form onSubmit={(e) => { e.preventDefault(); alert('Transfer initiated on blockchain.') }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="label">TDR Certificate ID</label>
                  <input type="text" placeholder="e.g. TDR-SMC-1234" required />
                </div>
                <div className="form-group">
                  <label className="label">Area to Transfer (Sq. Meters)</label>
                  <input type="number" placeholder="Can be partial or full..." required />
                </div>
              </div>
              
              <div style={{ padding: '1rem', backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Transfer Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group mb-0">
                    <label className="label">Current Owner Public Key</label>
                    <input type="text" placeholder="0x..." required />
                  </div>
                  <div className="form-group mb-0">
                    <label className="label">New Owner Public Key</label>
                    <input type="text" placeholder="0x..." required />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn-primary">Execute Smart Contract Transfer</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TDRServices;
