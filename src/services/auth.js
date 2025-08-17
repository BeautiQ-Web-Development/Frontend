//frontendCodes : services/auth.js - FIXED FOR BOTH CUSTOMER AND SERVICE PROVIDER
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

// CRITICAL FIX: Role-based profile update function
export const updateUserDetails = async (userData) => {
  try {
    console.log('🔄 Starting profile update request...');
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Decode the token to get user role
    let userRole;
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      userRole = tokenPayload.role;
      console.log('👤 User role from token:', userRole);
    } catch (decodeError) {
      console.error('❌ Failed to decode token:', decodeError);
      throw new Error('Invalid authentication token');
    }

    let endpoint;
    let requestData = userData;

    // CRITICAL FIX: Use different endpoints based on user role
    if (userRole === 'serviceProvider') {
      endpoint = '/auth/service-provider/update-profile';
      console.log('🏢 Using service provider update endpoint');
    } else if (userRole === 'customer') {
      endpoint = '/auth/update-profile';
      console.log('👤 Using customer update endpoint');
    } else {
      throw new Error(`Unsupported user role for profile updates: ${userRole}`);
    }

    console.log('📤 Sending request to:', endpoint);
    console.log('📋 Request data:', Object.keys(requestData));

    const response = await api.post(endpoint, requestData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Profile update response:', response.data);
    return response.data;

  } catch (error) {
    console.error('❌ Update profile error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Handle specific errors
    if (error.response?.status === 403) {
      const errorData = error.response.data;
      if (errorData.accountDeactivated) {
        throw new Error('Your account has been deactivated. Please contact support.');
      } else if (errorData.error === 'INSUFFICIENT_PERMISSIONS') {
        throw new Error(`Access denied. ${errorData.message}`);
      }
    }
    
    throw error.response?.data || { message: error.message || 'Failed to update profile details' };
  }
};

// CRITICAL FIX: Role-based account deletion function
export const requestAccountDeletion = async (reason) => {
  try {
    console.log('🗑️ Starting account deletion request...');
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Decode the token to get user role
    let userRole;
    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      userRole = tokenPayload.role;
      console.log('👤 User role from token:', userRole);
    } catch (decodeError) {
      console.error('❌ Failed to decode token:', decodeError);
      throw new Error('Invalid authentication token');
    }

    let endpoint;

    // CRITICAL FIX: Use different endpoints based on user role
    if (userRole === 'serviceProvider') {
      endpoint = '/auth/service-provider/request-account-deletion';
      console.log('🏢 Using service provider deletion endpoint');
    } else if (userRole === 'customer') {
      endpoint = '/auth/request-account-deletion';
      console.log('👤 Using customer deletion endpoint');
    } else {
      throw new Error(`Unsupported user role for account deletion: ${userRole}`);
    }

    console.log('📤 Sending deletion request to:', endpoint);

    const response = await api.post(endpoint, { reason }, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Account deletion response:', response.data);
    return response.data;

  } catch (error) {
    console.error('❌ Account deletion request error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Handle specific errors
    if (error.response?.status === 403) {
      const errorData = error.response.data;
      if (errorData.accountDeactivated) {
        throw new Error('Your account has been deactivated. Please contact support.');
      }
    }
    
    throw error.response?.data || { message: error.message || 'Failed to submit account deletion request' };
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
}

// Fetch all service providers with pending profile updates or deletion requests
export const getPendingProviderUpdates = async () => {
  try {
    const response = await api.get('/auth/service-providers/pending-updates');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending provider updates:', error);
    throw error.response?.data || { message: error.message };
  }
};

// Approve a service provider's update or deletion request
export const approveProviderUpdate = async (providerId) => {
  try {
    const response = await api.put(`/auth/admin/approve-service-provider-update/${providerId}`);
    return response.data;
  } catch (error) {
    console.error('Error approving provider update:', error);
    throw error.response?.data || { message: error.message };
  }
};

// Reject a service provider's update or deletion request
export const rejectProviderUpdate = async (providerId, rejectionReason) => {
  try {
    const response = await api.put(
      `/auth/admin/reject-service-provider-update/${providerId}`,
      { rejectionReason }
    );
    return response.data;
  } catch (error) {
    console.error('Error rejecting provider update:', error);
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
// Reject a service provider registration request
export const rejectServiceProvider = async (providerId, reason) => {
  try {
    const response = await api.put(
      `/auth/reject-provider/${providerId}`,
      { reason }
    );
    return response.data;
  } catch (error) {
    console.error('Error rejecting service provider:', error);
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

// Helper function to get user role from token
export const getUserRoleFromToken = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

// expose service helpers on the axios instance
api.login = login;

// export the axios instance so dashboard can import it as default
export default api;