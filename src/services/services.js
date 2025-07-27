//services/services.js - Updated with better error handling and debugging
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No auth token found in localStorage');
  }
  return token;
};

// Create axios instance with auth header
const createAuthConfig = () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No authentication token found. Please log in again.');
  }
  
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Debug function to check token content
const debugToken = () => {
  const token = getAuthToken();
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('Current token payload:', payload);
      return payload;
    } catch (e) {
      console.error('Invalid token format:', e);
      return null;
    }
  }
  return null;
};

// Service Provider Services API
export const serviceProviderAPI = {
  // Get all services for current provider
  getMyServices: async (params = {}) => {
    try {
      console.log('Fetching my services...');
      debugToken(); // Debug token before request
      
      const response = await axios.get(`${API_BASE_URL}/services/my-services`, {
        ...createAuthConfig(),
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      if (error.response?.status === 403) {
        console.error('403 Error details:', error.response.data);
      }
      throw error;
    }
  },

  // Get single service by ID
  getServiceById: async (serviceId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/services/${serviceId}`, createAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error fetching service:', error);
      throw error;
    }
  },

  // Create new service - try both endpoints for compatibility
  createService: async (serviceData) => {
    try {
      console.log('Creating service with data:', serviceData);
      debugToken(); // Debug token before request
      
      // Validate required fields before sending
      if (!serviceData.name?.trim()) {
        throw new Error('Service name is required');
      }
      if (!serviceData.type) {
        throw new Error('Service type is required');
      }
      if (!serviceData.category) {
        throw new Error('Service category is required');
      }
      
      const config = {
        ...createAuthConfig(),
        timeout: 30000
      };

      let response;
      try {
        // Try the /add endpoint first since it's specifically configured
        console.log('Trying /add endpoint');
        response = await axios.post(
          `${API_BASE_URL}/services/add`,
          serviceData,
          config
        );
      } catch (addError) {
        console.log('Add endpoint failed, trying primary endpoint:', addError.message);
        // Fallback to primary endpoint if /add fails
        response = await axios.post(
          `${API_BASE_URL}/services`,
          serviceData,
          config
        );
      }
      
      console.log('Service creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating service:', error);
      console.error('Error response:', error.response?.data);
      if (error.response?.status === 403) {
        console.error('403 Error - Check if you are logged in as serviceProvider and approved');
        debugToken();
      }
      throw error;
    }
  },

  // Update existing service
  updateService: async (serviceId, serviceData) => {
    try {
      console.log(`Updating service ${serviceId} with data:`, serviceData);
      debugToken(); // Debug token before request
      
      const response = await axios.put(
        `${API_BASE_URL}/services/${serviceId}`, 
        serviceData, 
        {
          ...createAuthConfig(),
          timeout: 30000
        }
      );
      
      console.log('Service update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating service:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 403) {
        console.error('403 Error details:');
        console.error('- Message:', error.response.data.message);
        console.error('- Error code:', error.response.data.error);
        console.error('- Debug info:', error.response.data.debug);
        
        // Check token
        const tokenPayload = debugToken();
        if (tokenPayload) {
          console.error('Token info:');
          console.error('- User ID:', tokenPayload.userId);
          console.error('- Role:', tokenPayload.role);
          console.error('- Approved:', tokenPayload.approved);
        }
      }
      
      throw error;
    }
  },

  // Delete service (soft delete)
  deleteService: async (serviceId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/services/${serviceId}`, createAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error deleting service:', error);
      throw error;
    }
  },

  // Reactivate deleted service
  reactivateService: async (serviceId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/services/${serviceId}/reactivate`, {}, createAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error reactivating service:', error);
      throw error;
    }
  }
};

// Admin Services API
export const adminServicesAPI = {
  // Get pending service approvals
  getPendingServices: async () => {
    try {
      console.log('Fetching pending services from admin API...');
      const response = await axios.get(`${API_BASE_URL}/services/admin/pending`, createAuthConfig());
      console.log('Pending services response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending services:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Get all services for admin (including pending and approved)
  getAllServices: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/services/admin/all`, createAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error fetching all services:', error);
      throw error;
    }
  },

  // Approve service changes
  approveService: async (serviceId, reason = 'Service approved by admin') => {
    try {
      console.log(`Approving service ${serviceId} with reason:`, reason);
      const response = await axios.post(
        `${API_BASE_URL}/services/admin/${serviceId}/approve`,
        { reason },
        createAuthConfig()
      );
      console.log('Approve service response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error approving service:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Reject service changes
  rejectService: async (serviceId, reason = 'Service does not meet our quality standards') => {
    try {
      console.log(`Rejecting service ${serviceId} with reason:`, reason);
      const response = await axios.post(
        `${API_BASE_URL}/services/admin/${serviceId}/reject`,
        { reason },
        createAuthConfig()
      );
      console.log('Reject service response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error rejecting service:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  }
};

// Admin Packages API
export const adminPackagesAPI = {
  // Get pending package approvals
  getPendingPackages: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/packages/admin/pending`, createAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error fetching pending packages:', error);
      throw error;
    }
  },

  // Get package history
  getPackageHistory: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/packages/admin/history`, createAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error fetching package history:', error);
      throw error;
    }
  },

  // Approve package
  approvePackage: async (packageId, reason = 'Approved by admin') => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/packages/admin/${packageId}/approve`,
        { reason },
        createAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error approving package:', error);
      throw error;
    }
  },

  // Reject package
  rejectPackage: async (packageId, reason) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/packages/admin/${packageId}/reject`,
        { reason },
        createAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error rejecting package:', error);
      throw error;
    }
  }
};

// Service data validation
export const validateServiceData = (serviceData) => {
  const errors = [];

  if (!serviceData.name || serviceData.name.trim().length < 2) {
    errors.push('Service name must be at least 2 characters long');
  }

  if (!serviceData.type) {
    errors.push('Service type is required');
  }

  if (!serviceData.category) {
    errors.push('Target audience is required');
  }

  if (!serviceData.description || serviceData.description.trim().length < 10) {
    errors.push('Service description must be at least 10 characters long');
  }

  if (!serviceData.pricing?.basePrice || serviceData.pricing.basePrice <= 0) {
    errors.push('Valid base price is required');
  }

  if (!serviceData.duration || serviceData.duration < 15 || serviceData.duration > 600) {
    errors.push('Service duration must be between 15 and 600 minutes');
  }

  return errors;
};

// Service status helpers
export const getServiceStatusInfo = (service) => {
  if (service.pendingChanges) {
    return {
      status: `${service.pendingChanges.requestType}_pending`,
      label: `${service.pendingChanges.requestType} Pending`,
      color: '#FF9800',
      description: `This service has pending ${service.pendingChanges.requestType} changes awaiting admin approval.`
    };
  }

  const statusMap = {
    'draft': { label: 'Draft', color: '#9E9E9E', description: 'Service is being prepared' },
    'pending_approval': { label: 'Pending Approval', color: '#FF9800', description: 'Service is awaiting admin approval' },
    'approved': { label: 'Active', color: '#4CAF50', description: 'Service is live and available to customers' },
    'inactive': { label: 'Inactive', color: '#9E9E9E', description: 'Service is temporarily disabled' },
    'rejected': { label: 'Rejected', color: '#F44336', description: 'Service was rejected by admin' },
    'deleted': { label: 'Deleted', color: '#F44336', description: 'Service has been deleted' }
  };

  return {
    status: service.status,
    ...statusMap[service.status],
    isVisible: service.isVisibleToProvider
  };
};

// Export debug function for manual testing
export { debugToken };

export default {
  serviceProviderAPI,
  adminServicesAPI,
  adminPackagesAPI,
  validateServiceData,
  getServiceStatusInfo,
  debugToken
};