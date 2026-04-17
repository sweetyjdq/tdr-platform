import React, { createContext, useContext, useState, useEffect } from 'react';

const CertificateContext = createContext();

export const CertificateProvider = ({ children }) => {
  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem('tdr_certificates');
    return saved ? JSON.parse(saved) : [
      { id: 'TDR-2023-8941', owner: 'Ramesh Kumar', aadhaar: '3456-7890-1234', zone: 'North Zone', area: '1250 sqft', status: 'Verified', date: '2023-10-24' },
      { id: 'TDR-2023-8940', owner: 'Priya Builders Pvt Ltd', aadhaar: '8901-2345-6789', zone: 'East Zone', area: '4500 sqft', status: 'Pending', date: '2023-10-23' },
      { id: 'TDR-2023-8939', owner: 'Suresh Patil', aadhaar: '4567-8901-2345', zone: 'South Zone', area: '850 sqft', status: 'Verified', date: '2023-10-21' }
    ];
  });

  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const defaultApiUrl = isLocalhost ? 'http://localhost:5000/api' : `${window.location.origin}/api`;
  const apiUrl = import.meta.env.VITE_API_URL && isLocalhost ? import.meta.env.VITE_API_URL : defaultApiUrl;

  useEffect(() => {
    localStorage.setItem('tdr_certificates', JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    fetch(`${apiUrl}/certificates`)
      .then(res => res.json())
      .then(data => {
        if(data && data.length > 0) setCertificates(data);
      })
      .catch(err => console.error("Sync failed:", err));
  }, []);

  const addCertificate = async (cert) => {
    try {
      const res = await fetch(`${apiUrl}/certificates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cert)
      });
      if (res.ok) {
        const newCert = await res.json();
        setCertificates(prev => [newCert, ...prev]);
      }
    } catch (e) {
      setCertificates(prev => [cert, ...prev]);
    }
  };

  const updateCertificateStatus = async (id, newStatus) => {
    setCertificates(prev => 
      prev.map(cert => cert.id === id ? { ...cert, status: newStatus } : cert)
    );
    try {
      await fetch(`${apiUrl}/certificates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) { console.error("Update failed", e); }
  };

  const updateCertificate = async (id, updatedData) => {
    setCertificates(prev => 
      prev.map(cert => cert.id === id ? { ...cert, ...updatedData } : cert)
    );
    try {
      await fetch(`${apiUrl}/certificates/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
    } catch (e) { console.error("Update failed", e); }
  }

  const deleteCertificate = async (id) => {
    setCertificates(prev => prev.filter(cert => cert.id !== id));
    try {
      await fetch(`${apiUrl}/certificates/${id}`, { method: 'DELETE' });
    } catch (e) { console.error("Delete failed", e); }
  }

  return (
    <CertificateContext.Provider value={{ certificates, addCertificate, updateCertificateStatus, updateCertificate, deleteCertificate }}>
      {children}
    </CertificateContext.Provider>
  );
};

export const useCertificates = () => useContext(CertificateContext);
