import axios from 'axios';

// Define API base URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const API_URL = `${API_BASE_URL}/api`;

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
    // Store in memory only, not localStorage
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const login = async (credentials, role) => {
  try {
    // Ensure role is always provided
    if (!role) {
      throw new Error('User role is required for login');
    }

    const loginData = { 
      emailAddress: credentials.emailAddress,
      password: credentials.password,
      role: role // Explicitly include role in request
    };

    console.log('Auth service login attempt:', { email: loginData.emailAddress, role: loginData.role });

    const response = await api.post('/auth/login', loginData);
    
    console.log('Login response:', response.data);

    // Verify that the returned user has the correct role
    if (response.data.user && response.data.user.role !== role) {
      throw new Error('Role mismatch in authentication response');
    }
    
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    
    if (error.response?.data?.pendingApproval) {
      throw { 
        ...error.response.data, 
        pendingApproval: true 
      };
    }
    
    // Handle role-specific error messages
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw error.response?.data || { message: error.message || 'Login failed' };
  }
};

export const register = async (userData, role = 'customer') => {
  try {
    console.log('Auth service registration attempt with role:', role);
    
    // Set the role if not already set
    if (userData instanceof FormData) {
      if (!userData.has('role')) {
        userData.append('role', role);
      }
      // Debug FormData contents - but filter out file objects for cleaner logs
      console.log('FormData entries:');
      for (let [key, value] of userData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
    } else {
      userData.role = role;
      console.log('Regular object data:', userData);
    }

    const response = await api.post('/auth/register', userData, {
      headers: {
        'Content-Type': userData instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    });
    
    console.log('Registration successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error response:', error.response?.data);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error(error.message || 'Registration failed. Please try again.');
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
    const response = await api.get('/auth/pending-service-providers');
    return response.data;
  } catch (error) {
    console.error('Get pending providers error:', error);
    throw error.response?.data || { message: error.message };
  }
};

export const getApprovedProviders = async () => {
  try {
    const response = await api.get('/auth/approved-providers');
    return response.data;
  } catch (error) {
    console.error('Get approved providers error:', error);
    throw error.response?.data || { message: error.message };
  }
};

export const getUserCounts = async () => {
  try {
    const response = await api.get('/auth/user-counts');
    return response.data;
  } catch (error) {
    console.error('Get user counts error:', error);
    throw error.response?.data || { message: error.message };
  }
};

export const approveServiceProvider = async (providerId) => {
  try {
    const response = await api.put(`/auth/approve-provider/${providerId}`);
    return response.data;
  } catch (error) {
    console.error('Approve provider error:', error);
    throw error.response?.data || { message: error.message };
  }
};

export const getPublicServiceProviders = async () => {
  try {
    const response = await api.get('/auth/public/service-providers');
    return response.data;
  } catch (error) {
    console.error('Get public service providers error:', error);
    throw error.response?.data || { message: error.message };
  }
};

export const getApprovedServiceProviders = async () => {
  try {
    const response = await api.get('/auth/approved-service-providers');
    return response.data;
  } catch (error) {
    console.error('Get approved service providers error:', error);
    throw error.response?.data || { message: error.message };
  }
};

export const logout = () => {
  setAuthToken(null);
};

export const verifyToken = async () => {
  try {
    // Check if token is already set in headers
    const token = api.defaults.headers.common['Authorization'];
    if (!token) {
      throw new Error('No token found');
    }
    
    const response = await api.get('/auth/verify');
    return response.data;
  } catch (error) {
    setAuthToken(null);
    throw error.response?.data || { message: error.message };
  }
};
