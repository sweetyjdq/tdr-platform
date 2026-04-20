import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const CertificateContext = createContext();

export const CertificateProvider = ({ children }) => {
  const [certificates, setCertificates] = useState([]);


  useEffect(() => {
    api.get('/api/certificates')
      .then(data => {
        if(data && data.length > 0) setCertificates(data);
      })
      .catch(err => console.error("Sync failed:", err));
  }, []);

  const addCertificate = async (cert) => {
    try {
      const newCert = await api.post('/api/certificates', cert);
      setCertificates(prev => [newCert, ...prev]);
    } catch (e) {
      console.error("Add failed", e);
      setCertificates(prev => [cert, ...prev]);
    }
  };

  const updateCertificateStatus = async (id, newStatus) => {
    setCertificates(prev => 
      prev.map(cert => cert.id === id ? { ...cert, status: newStatus } : cert)
    );
    try {
      await api.put(`/api/certificates/${id}`, { status: newStatus });
    } catch (e) { console.error("Update failed", e); }
  };

  const updateCertificate = async (id, updatedData) => {
    setCertificates(prev => 
      prev.map(cert => cert.id === id ? { ...cert, ...updatedData } : cert)
    );
    try {
      await api.put(`/api/certificates/${id}`, updatedData);
    } catch (e) { console.error("Update failed", e); }
  }

  const deleteCertificate = async (id) => {
    setCertificates(prev => prev.filter(cert => cert.id !== id));
    try {
      await api.delete(`/api/certificates/${id}`);
    } catch (e) { console.error("Delete failed", e); }
  }

  return (
    <CertificateContext.Provider value={{ certificates, addCertificate, updateCertificateStatus, updateCertificate, deleteCertificate }}>
      {children}
    </CertificateContext.Provider>
  );
};

export const useCertificates = () => useContext(CertificateContext);
