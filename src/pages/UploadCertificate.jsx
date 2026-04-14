import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, X, Shield, Lock } from 'lucide-react';
import { useCertificates } from '../context/CertificateContext';

const UploadCertificate = () => {
  const { addCertificate } = useCertificates();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, success
  const [formData, setFormData] = useState({
    owner: '',
    aadhaar: '',
    surveyNo: '',
    area: '',
    zone: 'North Zone'
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-active');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-active');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-active');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const [uploadId, setUploadId] = useState('');

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');

    try {
      const formPayload = new FormData();
      formPayload.append('document', file);
      // Append form metadata
      Object.entries(formData).forEach(([key, val]) => formPayload.append(key, val));

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/upload-certificate`, {
        method: 'POST',
        body: formPayload
      });

      const data = await response.json();

      if (response.ok) {
        setUploadId(data.uploadId);
        setStatus('success');
        addCertificate({
          id: data.uploadId,
          owner: formData.owner || 'Unknown Owner',
          aadhaar: formData.aadhaar || 'N/A',
          zone: formData.zone,
          area: formData.area || 'Unknown Area',
          status: 'Pending',
          date: new Date().toISOString().split('T')[0]
        });
      } else {
        alert(`Upload failed: ${data.error || 'Unknown error'}`);
        setStatus('idle');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Backend connection error: Is server.js running on localhost:5000?');
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
    <div>
      <div className="page-header">
        <h1 className="page-title">
          <Upload size={28} />
          Upload Land Certificate
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Securely upload property documents to the SMC Blockchain network for verification.</p>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)' }}>
        <div className="card">
          <div className="card-header">
            <h2>Document Upload (API: /upload-certificate)</h2>
          </div>
          <div className="card-body">
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <CheckCircle size={64} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--success)', marginBottom: '0.5rem' }}>Certificate Uploaded Successfully</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                  Document saved to server. Use the Reference ID below in your TDR Request.
                </p>
                <div style={{ padding: '1rem', backgroundColor: '#F0FFF4', border: '1px solid #68D391', borderRadius: '0.25rem', fontFamily: 'monospace', fontSize: '1rem', marginBottom: '1rem', fontWeight: 600 }}>
                  Upload Reference ID: {uploadId}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                  Copy this ID and paste it in Step 2 → Request TDR form.
                </p>
                <button className="btn-primary" onClick={resetForm}>Upload Another Document</button>
              </div>
            ) : (
              <>
                <div className="form-group">
                  <label className="label">Owner Name</label>
                  <input type="text" placeholder="Enter Owner Name..." value={formData.owner} onChange={(e) => setFormData({...formData, owner: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="label">Owner Aadhaar / ID</label>
                  <input type="text" placeholder="Enter 12-digit Aadhaar number..." value={formData.aadhaar} onChange={(e) => setFormData({...formData, aadhaar: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="label">Property Survey Number</label>
                  <input type="text" placeholder="Enter Survey Number..." value={formData.surveyNo} onChange={(e) => setFormData({...formData, surveyNo: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="label">Area (sqft)</label>
                  <input type="text" placeholder="Enter Area (e.g. 1500 sqft)..." value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="label">Zone</label>
                  <select style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--background)', color: 'var(--text)' }} value={formData.zone} onChange={(e) => setFormData({...formData, zone: e.target.value})}>
                    <option value="North Zone">North Zone</option>
                    <option value="South Zone">South Zone</option>
                    <option value="East Zone">East Zone</option>
                    <option value="West Zone">West Zone</option>
                    <option value="Central Zone">Central Zone</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Document File (PDF, JPEG, max 5MB)</label>
                  
                  {!file ? (
                    <div 
                      className="file-drop-area"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <Upload size={48} className="file-icon" />
                      <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Drag & Drop your file here</h3>
                      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>or click to browse from your computer</p>
                      <input 
                        type="file" 
                        id="fileUpload" 
                        style={{ display: 'none' }} 
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <button className="btn-secondary" onClick={() => document.getElementById('fileUpload').click()}>
                        Browse Files
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--background)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <FileText size={24} color="var(--primary)" />
                        <div>
                          <div style={{ fontWeight: 500 }}>{file.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                      </div>
                      <button style={{ background: 'none', border: 'none', color: 'var(--danger)', padding: '0.5rem' }} onClick={() => setFile(null)}>
                        <X size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          {status !== 'success' && (
            <div className="card-footer">
              <button className="btn-secondary" onClick={resetForm} disabled={status === 'uploading'}>Cancel</button>
              <button className="btn-primary" onClick={handleUpload} disabled={!file || status === 'uploading'}>
                {status === 'uploading' ? 'Encrypting & Uploading...' : 'Upload & Hash'}
              </button>
            </div>
          )}
        </div>

        <div>
          <div className="card">
            <div className="card-header">
              <h2>Security Details</h2>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <Shield size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>Immutable Record</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Once uploaded, the document hash is permanently stored on the SMC Blockchain network.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Lock size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>Encryption</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Files are encrypted using AES-256 before upload. Only authorized verifiers can decrypt the original.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCertificate;
