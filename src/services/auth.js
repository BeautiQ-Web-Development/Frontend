//frontendCodes : services/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error - Backend server might not be running');
      error.message = 'Unable to connect to server. Please check if the backend server is running.';
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused - Backend server is not running');
      error.message = 'Backend server is not running. Please start the server and try again.';
    }
    return Promise.reject(error);
  }
);

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

export const register = async (data, role) => {
  const path = role === 'serviceProvider'
    ? 'register-service-provider'
    : role === 'admin'
      ? 'register-admin'
      : 'register-customer';
  const endpoint = `/auth/${path}`;

  if (role === 'serviceProvider') {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
        formData.append(key, JSON.stringify(value));
      } else if (value != null) {
        formData.append(key, value);
      }
    });
    const res = await api.post(endpoint, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }

  const res = await api.post(endpoint, data);
  return res.data;
};

// export const registerServiceProvider = async (userData) => {
//   try {
//     // Create FormData for file uploads
//     const formData = new FormData();
    
//     // Add basic fields
//     formData.append('fullName', userData.fullName || '');
//     formData.append('emailAddress', userData.emailAddress || '');
//     formData.append('mobileNumber', userData.mobileNumber || '');
//     formData.append('nicNumber', userData.nicNumber || '');
//     formData.append('password', userData.password || '');
//     formData.append('currentAddress', userData.currentAddress || '');
//     formData.append('homeAddress', userData.homeAddress || '');
    
//     // Business fields
//     formData.append('businessName', userData.businessName || '');
//     formData.append('businessDescription', userData.businessDescription || '');
//     formData.append('businessType', userData.businessType || '');
//     formData.append('city', userData.city || '');
//     formData.append('experienceYears', userData.experienceYears || '0');
    
//     // Transform services to match backend expectations
//     const transformedServices = userData.services.map(service => ({
//       name: service.name || '',
//       type: service.type || '',
//       category: service.category || '',
//       description: service.description || '',
//       price: parseFloat(service.price) || 0,
//       duration: parseInt(service.duration) || 60,
//       location: service.location || 'both'
//     }));
//     formData.append('services', JSON.stringify(transformedServices));
    
//     // Location data
//     const locationData = {
//       city: userData.city || '',
//       serviceArea: userData.businessType === 'mobile_service' ? 'mobile' : 'fixed'
//     };
//     formData.append('location', JSON.stringify(locationData));
    
//     // Additional data
//     const specialties = [...new Set(userData.services.map(service => service.type).filter(Boolean))];
//     formData.append('specialties', JSON.stringify(specialties));
//     formData.append('languages', JSON.stringify(['English']));
    
//     const policiesData = {
//       cancellation: '24 hours notice required for cancellation',
//       paymentMethods: ['cash'],
//       advanceBooking: 30
//     };
//     formData.append('policies', JSON.stringify(policiesData));
    
//     // File uploads
//     if (userData.profilePhoto instanceof File) {
//       formData.append('profilePhoto', userData.profilePhoto);
//     }
//     if (userData.nicFrontPhoto instanceof File) {
//       formData.append('nicFrontPhoto', userData.nicFrontPhoto);
//     }
//     if (userData.nicBackPhoto instanceof File) {
//       formData.append('nicBackPhoto', userData.nicBackPhoto);
//     }

//     // Add role
//     formData.append('role', 'serviceProvider');

//     console.log('Service Provider registration attempt:', { email: userData.emailAddress });

//     // use our api instance so CORS, baseURL, timeouts, etc. are applied
//     const response = await api.post('/auth/register-service-provider', formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
    
//     return response.data;
//   } catch (error) {
//     console.error('Service Provider registration error:', error);
    
//     if (error.code === 'ERR_NETWORK') {
//       throw new Error('Unable to connect to server. Please check if the backend server is running on http://localhost:5000');
//     }
    
//     throw error.response?.data || { message: error.message || 'Service provider registration failed' };
//   }
// };

// SAFE VERSION: Completely avoids services array processing
export const registerServiceProviderNoServices = async (formData) => {
  try {
    console.log('📝 Starting service provider registration (no services)...');
    
    // Validate required fields
    const requiredFields = ['fullName', 'emailAddress', 'mobileNumber', 'nicNumber', 'password', 'businessName', 'businessType', 'city'];
    const missingFields = requiredFields.filter(field => !formData[field] || !formData[field].trim());
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Create clean form data
    const form = new FormData();
    
    // Personal information
    form.append('fullName', formData.fullName.trim());
    form.append('emailAddress', formData.emailAddress.trim());
    form.append('mobileNumber', formData.mobileNumber.trim());
    form.append('nicNumber', formData.nicNumber.trim());
    form.append('password', formData.password);
    form.append('currentAddress', formData.currentAddress.trim());
    form.append('homeAddress', formData.homeAddress.trim());
    
    // Business information
    form.append('businessName', formData.businessName.trim());
    form.append('businessType', formData.businessType);
    form.append('city', formData.city.trim());
    form.append('role', 'serviceProvider');
    
    // Optional fields
    if (formData.businessDescription) {
      form.append('businessDescription', formData.businessDescription.trim());
    }
    if (formData.experienceYears) {
      form.append('experienceYears', formData.experienceYears);
    }

    // File uploads with validation
    if (formData.nicFrontPhoto && formData.nicFrontPhoto instanceof File) {
      form.append('nicFrontPhoto', formData.nicFrontPhoto);
    } else {
      throw new Error('NIC front photo is required');
    }
    
    if (formData.nicBackPhoto && formData.nicBackPhoto instanceof File) {
      form.append('nicBackPhoto', formData.nicBackPhoto);
    } else {
      throw new Error('NIC back photo is required');
    }
    
    if (formData.profilePhoto && formData.profilePhoto instanceof File) {
      form.append('profilePhoto', formData.profilePhoto);
    }

    // Handle certificates array
    if (formData.certificatesPhotos && Array.isArray(formData.certificatesPhotos)) {
      formData.certificatesPhotos.forEach((file, index) => {
        if (file instanceof File) {
          form.append('certificatesPhotos', file);
        }
      });
    }

    console.log('📝 Sending registration request to server...');

    // FIXED: Use axios api instance correctly
    const response = await api.post('/auth/register-service-provider', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    console.log('✅ Registration successful:', response.data);

    return {
      success: true,
      message: 'Registration submitted successfully! You will be notified once approved and can then add your services.',
      data: response.data
    };

  } catch (error) {
    console.error('❌ Registration error:', error);
    
    // Handle axios errors properly
    const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please check your information and try again.';
    
    return {
      success: false,
      message: errorMessage,
      error: error.name || 'RegistrationError'
    };
  }
};

export const requestPasswordReset = async (emailAddress) => {
  try {
    console.log('Requesting password reset for:', emailAddress);
    const response = await api.post('/auth/forgot-password', {
      emailAddress
    });
    console.log('Password reset response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Password reset request error:', error);
    throw error.response?.data || { message: 'Failed to request password reset' };
  }
};

// export const resetPassword = async (resetToken, newPassword) => {
//   try {
//     const response = await api.post('/auth/reset-password', {
//       resetToken,
//       newPassword
//     });
    
//     if (!response.data.success) {
//       throw new Error(response.data.message || 'Failed to reset password');
//     }
    
//     return response.data;
//   } catch (error) {
//     console.error('Reset password error:', error);
//     throw error.response?.data || {
//       message: 'Failed to reset password. Please try again.'
//     };
//   }
// };

// ✅ FIX 1: Update auth.js service (services/auth.js)
export const resetPassword = async (resetToken, newPassword) => {
  try {
    console.log('🔐 Attempting password reset with token:', resetToken?.substring(0, 10) + '...');
    
    // ✅ FIXED: Send token as URL parameter, password in body
    const response = await api.post(`/auth/reset-password/${resetToken}`, {
      password: newPassword  // ✅ Use 'password' field name to match backend
    });
    
    console.log('✅ Password reset response:', response.data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to reset password');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Reset password error:', error);
    
    // Enhanced error handling
    if (error.response?.status === 400) {
      throw new Error(error.response.data.message || 'Invalid or expired reset link');
    } else if (error.response?.status === 403) {
      throw new Error('Cannot reset password for deactivated account');
    }
    
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
    console.error('Get profile error:', error);
    throw error.response?.data || { message: 'Failed to fetch profile' };
  }
};

// New functions for profile settings
export const updateUserDetails = async (userData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post('/auth/update-profile', userData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error.response?.data || { message: 'Failed to update profile details' };
  }
};

export const requestAccountDeletion = async (reason) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post('/auth/request-account-deletion', { reason }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Account deletion request error:', error);
    throw error.response?.data || { message: 'Failed to submit account deletion request' };
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

export const getApprovedProviders = async (providerId) => {
  try {
    const qs = providerId ? `?providerId=${providerId}` : '';
    const response = await api.get(`/auth/approved-service-providers${qs}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching approved providers:', error);
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

export const getUserCounts = async () => {
  try {
    const response = await api.get('/auth/user-counts');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const getNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error.response?.data || { message: error.message };
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: error.message };
  }
};

export const logout = () => {
  setAuthToken(null);
};

export const verifyToken = async () => {
  try {
    const response = await api.get('/auth/verify-token');
    return response.data;
  } catch (error) {
    setAuthToken(null);
    throw error.response?.data || { message: error.message };
  }
};

// expose service helpers on the axios instance
api.login = login;

// export the axios instance so dashboard can import it as default
export default api;

