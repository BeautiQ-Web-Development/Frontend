import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

export const login = async (credentials, role) => {
  try {
    const response = await api.post('/auth/login', { ...credentials, role });
    
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data;
  } catch (error) {
    if (error.response?.data?.pendingApproval) {
      throw { 
        ...error.response.data, 
        pendingApproval: true 
      };
    }
    throw error.response?.data || { message: error.message };
  }
};

export const register = async (userData, role) => {
  try {
    const response = await api.post('/auth/register', { ...userData, role });
    
    // Only set token for immediate login (customer and admin)
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data;
  } catch (error) {
    if (error.response?.data?.adminExists) {
      throw { 
        ...error.response.data, 
        adminExists: true 
      };
    }
    throw error.response?.data || { message: error.message };
  }
};

export const requestPasswordReset = async (emailAddress) => {
  try {
    console.log('Requesting password reset for:', emailAddress);
    const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
      emailAddress
    });
    console.log('Password reset response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error.response?.data || { message: 'Failed to request password reset' };
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

export const getProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const getPendingProviders = async () => {
  try {
    const response = await api.get('/auth/pending-providers');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const approveServiceProvider = async (providerId) => {
  try {
    const response = await api.put(`/auth/approve-provider/${providerId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  setAuthToken(null);
};

export const verifyToken = async () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    try {
      const response = await api.get('/auth/verify-token');
      return response.data.valid;
    } catch (error) {
      logout();
      return false;
    }
  }
  return false;
};
