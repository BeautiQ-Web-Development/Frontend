import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, setAuthToken } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setAuthToken(token); // Set the token in axios headers
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthToken(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials, userType) => {
    try {
      // Validate userType is provided
      if (!userType) {
        throw new Error('User type is required for login');
      }

      console.log('AuthContext login attempt:', { email: credentials.emailAddress, userType });

      const response = await loginService(credentials, userType);
      
      console.log('AuthContext received response:', response);
      
      // Handle successful login - the response structure shows {user: {...}, token: 'jwt_token'}
      if (response.token && response.user) {
        const userData = response.user;
        const token = response.token;
        
        // Additional validation: ensure user role matches requested userType
        if (userData.role !== userType) {
          throw new Error(`Role mismatch: Expected ${userType}, got ${userData.role}`);
        }

        setUser(userData);
        setIsAuthenticated(true);
        
        // Store in localStorage with role information
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userRole', userData.role);
        
        return response;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('AuthContext login error:', error);
      
      // Handle different error formats
      if (error.pendingApproval) {
        throw error; // Re-throw as is for pending approval handling
      }
      
      if (error.message) {
        throw new Error(error.message);
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (typeof error === 'string') {
        throw new Error(error);
      } else {
        throw new Error('Login failed. Please try again.');
      }
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    setAuthToken(null); // Clear axios headers
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};