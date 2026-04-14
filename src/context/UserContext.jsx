import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('tdr_users');
    return saved ? JSON.parse(saved) : [
      { id: 'USR-001', name: 'John Doe', mobile: '9876543210', email: 'john@example.com', status: 'Active' },
      { id: 'USR-002', name: 'Ramesh Kumar', mobile: '8877665544', email: 'ramesh@example.com', status: 'Active' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('tdr_users', JSON.stringify(users));
  }, [users]);

  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Active'
    };
    setUsers(prev => [newUser, ...prev]);
  };

  const updateUser = (id, updatedData) => {
    setUsers(prev => 
      prev.map(user => user.id === id ? { ...user, ...updatedData } : user)
    );
  };
  
  const deleteUser = (id) => {
       setUsers(prev => prev.filter(user => user.id !== id));
  }

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => useContext(UserContext);
