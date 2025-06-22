import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Create axios instance with auth header
const createAuthConfig = () => ({
  headers: {
    'Authorization': `Bearer ${getAuthToken()}`,
    'Content-Type': 'application/json'
  }
});

// Service Provider Services API
export const serviceProviderAPI = {
  // Get all services for current provider
  getMyServices: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/services/my-services`, {
        ...createAuthConfig(),
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
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

  // Create new service
  createService: async (serviceData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/services`, serviceData, createAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  },

  // Update existing service
  updateService: async (serviceId, serviceData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/services/${serviceId}`, serviceData, createAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error updating service:', error);
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
      const response = await axios.get(`${API_BASE_URL}/services/admin/pending`, createAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error fetching pending services:', error);
      throw error;
    }
  },

  // Get complete service history (including deleted)
  getServiceHistory: async (providerId = null) => {
    try {
      const params = providerId ? { providerId } : {};
      const response = await axios.get(`${API_BASE_URL}/services/admin/history`, {
        ...createAuthConfig(),
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching service history:', error);
      throw error;
    }
  },

  // Approve service changes
  approveService: async (serviceId, reason = 'Approved by admin') => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/services/admin/${serviceId}/approve`,
        { reason },
        createAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error approving service:', error);
      throw error;
    }
  },

  // Reject service changes
  rejectService: async (serviceId, reason) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/services/admin/${serviceId}/reject`,
        { reason },
        createAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error('Error rejecting service:', error);
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
    errors.push('Service category is required');
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
    'active': { label: 'Active', color: '#4CAF50', description: 'Service is live and available to customers' },
    'inactive': { label: 'Inactive', color: '#9E9E9E', description: 'Service is temporarily disabled' },
    'rejected': { label: 'Rejected', color: '#F44336', description: 'Service was rejected by admin' }
  };

  return {
    status: service.status,
    ...statusMap[service.status],
    isVisible: service.isVisibleToProvider
  };
};

export default {
  serviceProviderAPI,
  adminServicesAPI,
  validateServiceData,
  getServiceStatusInfo
};
