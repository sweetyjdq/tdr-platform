import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('tdr_users');
    return saved ? JSON.parse(saved) : [
      { id: 'USR-001', name: 'John Doe', mobile: '9876543210', email: 'john@example.com', status: 'Active', password: 'password123' },
      { id: 'USR-002', name: 'Ramesh Kumar', mobile: '8877665544', email: 'ramesh@example.com', status: 'Active', password: 'password123' }
    ];
  });
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const defaultApiUrl = isLocalhost ? 'http://localhost:5000/api' : `${window.location.origin}/api`;
  const apiUrl = import.meta.env.VITE_API_URL && isLocalhost ? import.meta.env.VITE_API_URL : defaultApiUrl;

  useEffect(() => {
    localStorage.setItem('tdr_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    fetch(`${apiUrl}/users`)
      .then(res => {
         if (res.ok) return res.json();
         throw new Error('Backend failed');
      })
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
      .catch((err) => console.log('Backend sync failed, falling back to local storage:', err));
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
    let userToReturn = {
      ...userData,
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Active'
    };
    try {
      const res = await fetch(`${apiUrl}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        userToReturn = await res.json();
      } else {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }
    } catch (err) {
      console.log('Backend registration failed:', err.message);
      // Re-throw so component can handle it
      throw err;
    }
    setUsers(prev => [userToReturn, ...prev]);
    return userToReturn;
  };

  const updateUser = async (id, updatedData) => {
    setUsers(prev => prev.map(user => user.id === id ? { ...user, ...updatedData } : user));
    try {
      await fetch(`${apiUrl}/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
    } catch(e) { console.log('Backend sync failed, storing locally only.'); }
  };
  
  const deleteUser = async (id) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    try {
      await fetch(`${apiUrl}/users/${id}`, { method: 'DELETE' });
    } catch(e) { console.log('Backend sync failed, deleting locally only.'); }
  }

  const verifyUser = async (email) => {
    // 1. Check local state first
    const localUser = users.find(u => u.email?.toLowerCase().trim() === email.toLowerCase().trim());
    if (localUser) return localUser;

    // 2. Fallback: Fetch latest from backend
    try {
      const res = await fetch(`${apiUrl}/users`);
      if (res.ok) {
        const latestUsers = await res.json();
        const found = latestUsers.find(u => u.email?.toLowerCase().trim() === email.toLowerCase().trim());
        if (found) {
          setUsers(prev => [found, ...prev]); // Cache it
          return found;
        }
      }
    } catch (e) {
      console.error("Backend verify failed:", e);
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
