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
    
    // Extra debug for notifications endpoints
    if (config.url?.includes('/notifications')) {
      console.log('Notifications API request details:', {
        headers: config.headers,
        hasAuthHeader: !!config.headers?.Authorization,
        data: config.data
      });
    }
    
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
    console.log('🔄 Rejecting provider update with data:', { providerId, rejectionReason });
    
    // Validate input parameters
    if (!providerId) {
      throw new Error('Provider ID is required');
    }
    
    if (!rejectionReason || rejectionReason.trim() === '') {
      throw new Error('Rejection reason is required and cannot be empty');
    }
    
    // Clean the rejection reason
    const trimmedReason = rejectionReason.trim();
    
    // First, check if this provider has pending updates
    try {
      const checkResponse = await api.get('/auth/service-providers/pending-updates');
      const pendingUpdates = checkResponse.data?.pendingUpdates || [];
      
      // Find if this provider has pending updates
      const providerWithPendingUpdates = pendingUpdates.find(p => p._id === providerId);
      
      if (!providerWithPendingUpdates) {
        console.log('❌ No pending updates found for provider:', providerId);
        throw new Error('This provider has no pending updates to reject');
      }
      
      console.log('✅ Found pending updates for provider:', {
        providerId,
        updateType: providerWithPendingUpdates.pendingUpdates?.deleteRequested ? 'deletion' : 'update'
      });
      
      // Proceed with rejection now that we've confirmed there are pending updates
      const response = await api.put(
        `/auth/admin/reject-service-provider-update/${providerId}`,
        { rejectionReason: trimmedReason }
      );
      
      console.log('✅ Provider update rejection response:', response.data);
      return response.data;
    } catch (apiError) {
      // Provide more specific error messages based on API response
      if (apiError.response?.status === 400) {
        if (apiError.response.data?.message?.includes('pending updates')) {
          throw new Error('This provider has no pending updates to reject');
        } else {
          throw new Error(`Validation error: ${apiError.response.data?.message || 'Invalid request'}`);
        }
      } else if (apiError.response?.status === 404) {
        throw new Error('Provider not found. They may have been deleted or deactivated.');
      } else if (apiError.response?.status === 403) {
        throw new Error('You do not have permission to reject this provider update.');
      } else if (apiError.message && !apiError.response) {
        // This is from our own validation
        throw apiError;
      }
      
      // Rethrow with original response
      throw apiError;
    }
  } catch (error) {
    console.error('❌ Error rejecting provider update:', error);
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
    console.log('🔄 Rejecting service provider registration:', { providerId, reason });
    
    if (!providerId) {
      throw new Error('Provider ID is required');
    }
    
    if (!reason || reason.trim() === '') {
      throw new Error('Rejection reason is required');
    }
    
    const response = await api.put(
      `/auth/reject-provider/${providerId}`,
      { reason: reason.trim() }
    );
    
    console.log('✅ Provider registration rejection response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error rejecting service provider registration:', error);
    throw error.response?.data || { message: error.message };
  }
};

// Utility function to determine what kind of rejection to use
export const rejectProvider = async (providerId, reason, isNewRegistration = false) => {
  try {
    console.log('🔄 Smart provider rejection:', { 
      providerId, 
      reason, 
      isNewRegistration 
    });
    
    if (!providerId) {
      throw new Error('Provider ID is required');
    }
    
    if (!reason || reason.trim() === '') {
      throw new Error('Rejection reason is required and cannot be empty');
    }
    
    let response;
    if (isNewRegistration) {
      // This is a new provider registration rejection
      console.log('👉 Using rejectServiceProvider for new registration rejection');
      response = await rejectServiceProvider(providerId, reason);
    } else {
      // This is an existing provider update/deletion request rejection
      console.log('👉 Using rejectProviderUpdate for update/deletion rejection');
      response = await rejectProviderUpdate(providerId, reason);
    }
    
    console.log('✅ Provider rejection successful:', response);
    return response;
  } catch (error) {
    console.error('❌ Smart provider rejection error:', error);
    
    // Format error for frontend display
    if (error.response) {
      console.log('Server response error:', {
        status: error.response.status,
        data: error.response.data
      });
      
      // Return a more specific error message based on status code
      if (error.response.status === 400) {
        throw new Error(`Validation error: ${error.response.data?.message || 'Bad request'}`);
      } else if (error.response.status === 404) {
        throw new Error('Provider not found. They may have been deleted already.');
      } else if (error.response.status === 403) {
        throw new Error('You do not have permission to perform this action.');
      } else {
        throw new Error(error.response.data?.message || 'Server error occurred');
      }
    }
    
    // For client-side validation errors or network errors
    throw error;
  }
};

// export const getUserCounts = async () => {
//   const response = await api.get('/admin/dashboard-data');
//   if (response.data.success) {
//     // return the full payload so adminDashboardPage can read
//     return response.data;
//   }
//   throw new Error(response.data.message || 'Failed to fetch dashboard data');
// };

// services/auth.js - FIXED VERSION
export const getUserCounts = async () => {
  // ✅ FIXED: Use the correct route path that matches the backend
  const response = await api.get('/auth/admin/dashboard-data');
  if (response.data.success) {
    return response.data;
  }
  throw new Error(response.data.message || 'Failed to fetch dashboard data');
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

//services/auth.js - ADD THESE ENHANCED FUNCTIONS

// Enhanced dashboard data fetching with detailed metrics
export const getEnhancedDashboardData = async () => {
  try {
    console.log('📊 Fetching enhanced dashboard data...');
    const response = await api.get('/auth/admin/dashboard-data');
    
    if (response.data.success) {
      console.log('✅ Enhanced dashboard data received:', {
        pendingServices: response.data.pendingServiceApprovals,
        deletedServices: response.data.deletedServicesCount,
        deleteRequests: response.data.deleteRequestsData,
        newProviders: response.data.newProvidersData?.length || 0,
        updateRequests: response.data.serviceUpdateRequests,
        appointments: response.data.appointmentsPerDayData?.length || 0
      });
      
      return response.data;
    }
    throw new Error(response.data.message || 'Failed to fetch enhanced dashboard data');
  } catch (error) {
    console.error('❌ Enhanced dashboard data fetch error:', error);
    throw error.response?.data || { message: error.message };
  }
};

// Get pending service approvals with filtering
export const getPendingServiceApprovals = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    const response = await api.get(`/services/admin/pending?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching pending service approvals:', error);
    throw error.response?.data || { message: error.message };
  }
};

// Get service update requests
export const getServiceUpdateRequests = async () => {
  try {
    const response = await api.get('/services/admin/pending');
    if (response.data.success) {
      // Filter only update requests
      const updateRequests = response.data.pendingServices?.filter(
        service => service.pendingChanges?.actionType === 'update'
      ) || [];
      
      return {
        success: true,
        updateRequests,
        count: updateRequests.length
      };
    }
    throw new Error(response.data.message || 'Failed to fetch service update requests');
  } catch (error) {
    console.error('❌ Error fetching service update requests:', error);
    throw error.response?.data || { message: error.message };
  }
};

// Get deleted services count and details
export const getDeletedServices = async () => {
  try {
    const response = await api.get('/services/admin/all');
    if (response.data.success) {
      const deletedServices = response.data.services?.filter(
        service => service.status === 'deleted'
      ) || [];
      
      return {
        success: true,
        deletedServices,
        count: deletedServices.length,
        recentDeletes: deletedServices
          .sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt))
          .slice(0, 10)
      };
    }
    throw new Error(response.data.message || 'Failed to fetch deleted services');
  } catch (error) {
    console.error('❌ Error fetching deleted services:', error);
    throw error.response?.data || { message: error.message };
  }
};

// Get account deletion requests (reassign users)
export const getAccountDeletionRequests = async () => {
  try {
    const [customerRequests, providerRequests] = await Promise.all([
      api.get('/auth/customers/pending-updates'),
      api.get('/auth/service-providers/pending-updates')
    ]);
    
    const customerDeleteRequests = customerRequests.data.pendingUpdates?.filter(
      update => update.requestType === 'delete'
    ) || [];
    
    const providerDeleteRequests = providerRequests.data.pendingUpdates?.filter(
      update => update.requestType === 'delete'
    ) || [];
    
    return {
      success: true,
      customerDeleteRequests,
      providerDeleteRequests,
      totalRequests: customerDeleteRequests.length + providerDeleteRequests.length,
      breakdown: {
        customers: customerDeleteRequests.length,
        serviceProviders: providerDeleteRequests.length
      }
    };
  } catch (error) {
    console.error('❌ Error fetching account deletion requests:', error);
    throw error.response?.data || { message: error.message };
  }
};

// Get new service provider registrations with trend data
export const getNewServiceProviderTrend = async (days = 30) => {
  try {
    const response = await api.get('/auth/service-providers');
    if (response.data.success) {
      const providers = response.data.providers || [];
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      // Filter providers from last N days
      const recentProviders = providers.filter(
        provider => new Date(provider.createdAt) >= cutoffDate
      );
      
      // Group by date
      const trendData = {};
      recentProviders.forEach(provider => {
        const date = new Date(provider.createdAt).toISOString().split('T')[0];
        trendData[date] = (trendData[date] || 0) + 1;
      });
      
      // Convert to array format for charts
      const chartData = Object.keys(trendData)
        .sort()
        .map(date => ({
          date,
          count: trendData[date]
        }));
      
      return {
        success: true,
        trendData: chartData,
        totalNewProviders: recentProviders.length,
        recentProviders: recentProviders.slice(0, 10)
      };
    }
    throw new Error(response.data.message || 'Failed to fetch service provider trend');
  } catch (error) {
    console.error('❌ Error fetching service provider trend:', error);
    throw error.response?.data || { message: error.message };
  }
};

// Get appointments data for dashboard
export const getAppointmentsDashboardData = async (days = 30) => {
  try {
    // This would require a booking endpoint - placeholder for now
    const response = await api.get(`/bookings/admin/dashboard?days=${days}`);
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching appointments data:', error);
    // Return mock data if booking endpoint doesn't exist yet
    return {
      success: true,
      appointmentsPerDay: [],
      totalAppointments: 0,
      pendingAppointments: 0,
      completedAppointments: 0
    };
  }
};

// Dashboard real-time updates
export const subscribeToRealTimeUpdates = (callback) => {
  // This would implement WebSocket or Server-Sent Events for real-time updates
  console.log('📡 Setting up real-time dashboard updates...');
  
  // For now, return a cleanup function
  return () => {
    console.log('🔌 Cleaning up real-time dashboard subscription');
  };
};

// Dashboard data validation and error recovery
export const validateDashboardData = (data) => {
  const validatedData = {
    customerCount: Number(data.customerCount) || 0,
    serviceProviderCount: Number(data.serviceProviderCount) || 0,
    pendingApprovalCount: Number(data.pendingApprovalCount) || 0,
    totalUsers: Number(data.totalUsers) || 0,
    pendingServiceApprovals: Number(data.pendingServiceApprovals) || 0,
    deletedServicesCount: Number(data.deletedServicesCount) || 0,
    deleteRequestsData: {
      customers: Number(data.deleteRequestsData?.customers) || 0,
      serviceProviders: Number(data.deleteRequestsData?.serviceProviders) || 0
    },
    newProvidersData: Array.isArray(data.newProvidersData) ? data.newProvidersData : [],
    serviceUpdateRequestsData: Array.isArray(data.serviceUpdateRequestsData) ? data.serviceUpdateRequestsData : [],
    serviceUpdateRequests: Number(data.serviceUpdateRequests) || 0,
    appointmentsPerDayData: Array.isArray(data.appointmentsPerDayData) ? data.appointmentsPerDayData : [],
    additionalMetrics: data.additionalMetrics || {},
    summary: data.summary || {}
  };
  
  console.log('✅ Dashboard data validated:', {
    hasValidCounts: validatedData.totalUsers > 0,
    hasChartData: validatedData.newProvidersData.length > 0,
    hasMetrics: Object.keys(validatedData.additionalMetrics).length > 0
  });
  
  return validatedData;
};

// Export enhanced dashboard utilities
export const dashboardUtils = {
  getEnhancedDashboardData,
  getPendingServiceApprovals,
  getServiceUpdateRequests,
  getDeletedServices,
  getAccountDeletionRequests,
  getNewServiceProviderTrend,
  getAppointmentsDashboardData,
  subscribeToRealTimeUpdates,
  validateDashboardData
};

// expose service helpers on the axios instance
api.login = login;

// export the axios instance so dashboard can import it as default
export default api;