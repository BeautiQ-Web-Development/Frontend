import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const login = async (credentials, role) => {
  try {
    const response = await api.post('/auth/login', { ...credentials, role });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const register = async (userData, role) => {
  try {
    const response = await api.post('/auth/register', { ...userData, role });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const requestPasswordReset = async (emailAddress) => {
  try {
    const response = await api.post('/auth/forgot-password', { emailAddress });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const resetPassword = async (resetToken, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', {
      resetToken,
      newPassword
    });
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to reset password');
    }
    
    return response.data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error.response?.data || {
      message: 'Failed to reset password. Please try again.'
    };
  }
};

const logout = () => {
  localStorage.removeItem('user');
  setAuthToken(null);
};

const verifyToken = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    try {
      const response = await api.get('/verify-token');
      return response.data.valid;
    } catch (error) {
      logout();
      return false;
    }
  }
  return false;
};

export {
  logout,
  verifyToken,
  setAuthToken
};
