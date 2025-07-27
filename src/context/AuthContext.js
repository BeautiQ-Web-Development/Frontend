//frontend/context/AuthContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAuthToken } from '../services/auth';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // once token is set, apply header in-memory via setAuthToken
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  // auto-logout on 401 from our api client
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
    // uses services/auth.js → api.post('/auth/login')
    const data = await api.login(credentials, role);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};