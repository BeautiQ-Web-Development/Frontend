import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await axios.get('http://localhost:5000/api/auth/verify-token');
          if (response.data.valid) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } else {
            logout(); // Use the logout function to clean up
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout(); // Use the logout function to clean up
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        credentials
      );

      if (response.data.user) {
        if (credentials.role === 'serviceProvider' && !response.data.user.approved) {
          throw new Error('Your account is pending approval');
        }

        const token = response.data.token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        return response.data;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || error;
    }
  };

  const register = async (userData, role) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        ...userData,
        role
      });

      if (role === 'serviceProvider') {
        return response.data;
      }

      if (response.data.token) {
        const token = response.data.token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
        setIsAuthenticated(true);
      }

      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data || new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      loading,
      isAuthenticated
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);