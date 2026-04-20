import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);


  useEffect(() => {
    api.get('/api/users')
      .then(data => {
        if(data && data.length > 0) {
          setUsers(prev => {
            const merged = [...prev];
            data.forEach(remoteUser => {
              if (!merged.find(u => u.email?.toLowerCase() === remoteUser.email?.toLowerCase())) {
                merged.push(remoteUser);
              }
            });
            return merged;
          });
        }
      })
      .catch((err) => console.log('Backend sync failed:', err));
  }, []);

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('tdr_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('tdr_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('tdr_current_user');
    }
  }, [currentUser]);

  const addUser = async (userData) => {
    try {
      const createdUser = await api.post('/api/users/register', userData);
      setUsers(prev => [createdUser, ...prev]);
      return createdUser;
    } catch (err) {
      console.log('Backend registration failed:', err.message);
      throw err;
    }
  };

  const updateUser = async (id, updatedData) => {
    setUsers(prev => prev.map(user => user.id === id ? { ...user, ...updatedData } : user));
    try {
      await api.put(`/api/users/${id}`, updatedData);
    } catch(e) { console.log('Backend update failed'); }
  };
  
  const deleteUser = async (id) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    try {
      await api.delete(`/api/users/${id}`);
    } catch(e) { console.log('Backend delete failed'); }
  }

  const verifyUser = async (email) => {
    const localUser = users.find(u => u.email?.toLowerCase().trim() === email.toLowerCase().trim());
    if (localUser) return localUser;

    try {
      const latestUsers = await api.get('/api/users');
      const found = latestUsers.find(u => u.email?.toLowerCase().trim() === email.toLowerCase().trim());
      if (found) {
        setUsers(prev => [found, ...prev]);
        return found;
      }
    } catch (e) {
      console.error("Verification failed:", e);
    }
    return null;
  };

  const loginUser = (user) => {
    setCurrentUser(user);
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ users, currentUser, loginUser, logoutUser, addUser, updateUser, deleteUser, verifyUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => useContext(UserContext);
