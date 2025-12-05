// frontend/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAuthToken } from '../services/auth';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setAuthToken(token);
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Verify token and fetch fresh user data on mount
  useEffect(() => {
    const verifyAndFetch = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await api.get('/auth/profile');
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.error('Token verification failed:', err);
        // Don't logout immediately, user might be using old token
        // Just set loading to false
      } finally {
        setLoading(false);
      }
    };
    
    verifyAndFetch();
  }, []); // Empty dependency array - only run once on mount

  useEffect(() => {
    const id = api.interceptors.response.use(
      res => res,
      err => {
        if (err.response?.status === 401) {
          logout();
        }
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(id);
  }, []);

  const login = async (credentials, role) => {
    const data = await api.login(credentials, role);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  // Update user function - for profile photo updates and other profile changes
  const updateUser = (userData) => {
    console.log('🔄 AuthContext: Updating user data', userData);
    console.log('🔄 Current user before update:', user);
    
    setUser(prevUser => {
      if (!prevUser) {
        console.warn('⚠️ No user to update');
        return prevUser;
      }
      
      // Create completely new object to ensure React detects change
      const updated = { 
        ...prevUser, 
        ...userData,
        _timestamp: Date.now() // Force new reference
      };
      
      console.log('✅ AuthContext: User updated', {
        old: prevUser?.profilePhoto,
        new: updated?.profilePhoto,
        changed: prevUser?.profilePhoto !== updated?.profilePhoto,
        timestamp: updated._timestamp
      });
      
      // Also update localStorage immediately
      localStorage.setItem('user', JSON.stringify(updated));
      
      return updated;
    });
    
    // Force a small delay to ensure React processes the update
    setTimeout(() => {
      console.log('✅ User update complete - checking current state');
      const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
      console.log('Current user in localStorage:', currentUser?.profilePhoto);
    }, 50);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};