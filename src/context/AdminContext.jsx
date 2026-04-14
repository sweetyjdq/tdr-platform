import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  // Load initial state from localStorage if available
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem('tdr_admin_data');
    return savedAdmin ? JSON.parse(savedAdmin) : {
      name: 'Admin Officer',
      designation: 'Department of Planning',
      photo: null, // URL or base64
      initials: 'A'
    };
  });

  // Save to localStorage whenever admin state changes
  useEffect(() => {
    try {
      localStorage.setItem('tdr_admin_data', JSON.stringify(admin));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [admin]);

  const updateAdmin = (newData) => {
    setAdmin(prev => ({ ...prev, ...newData }));
  };

  return (
    <AdminContext.Provider value={{ admin, updateAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
