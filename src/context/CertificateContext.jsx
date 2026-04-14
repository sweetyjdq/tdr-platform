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

  useEffect(() => {
    localStorage.setItem('tdr_certificates', JSON.stringify(certificates));
  }, [certificates]);

  const addCertificate = (cert) => {
    setCertificates(prev => [cert, ...prev]);
  };

  const updateCertificateStatus = (id, newStatus) => {
    setCertificates(prev => 
      prev.map(cert => cert.id === id ? { ...cert, status: newStatus } : cert)
    );
  };

  return (
    <CertificateContext.Provider value={{ certificates, addCertificate, updateCertificateStatus }}>
      {children}
    </CertificateContext.Provider>
  );
};

export const useCertificates = () => useContext(CertificateContext);
