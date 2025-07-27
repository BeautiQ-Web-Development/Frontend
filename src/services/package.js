//frontend code - services/packages.js
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

// Service Provider Packages API
export const serviceProviderPackagesAPI = {
  // Get all packages for current provider
  getMyPackages: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/packages/provider`, {
        ...createAuthConfig(),
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching packages:', error);
      throw error;
    }
  },

  // Get single package by ID
  getPackageById: async (packageId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/packages/${packageId}`, createAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error fetching package:', error);
      throw error;
    }
  },

  // Create new package
  createPackage: async (packageData) => {
    try {
      console.log('Creating package with data:', packageData);
      
      // Validate required fields before sending
      if (!packageData.packageName?.trim()) {
        throw new Error('Package name is required');
      }
      if (!packageData.packageType) {
        throw new Error('Package type is required');
      }
      if (!packageData.targetAudience) {
        throw new Error('Target audience is required');
      }
      
      const config = {
        ...createAuthConfig(),
        timeout: 30000
      };

      const response = await axios.post(
        `${API_BASE_URL}/packages`,
        packageData,
        config
      );
      
      console.log('Package creation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating package:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Update existing package (will create update request if package is approved)
  updatePackage: async (packageId, packageData) => {
    try {
      console.log(`Updating package ${packageId} with data:`, packageData);
      
      const response = await axios.put(
        `${API_BASE_URL}/packages/${packageId}`, 
        packageData, 
        {
          ...createAuthConfig(),
          timeout: 30000
        }
      );
      
      console.log('Package update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating package:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Delete package (will create delete request if package is approved)
  deletePackage: async (packageId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/packages/${packageId}`, {
        ...createAuthConfig(),
        data: {} // Include data object for proper request body
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  },

  // Get package requests for current provider
  getMyPackageRequests: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/packages/my-requests`, createAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error fetching package requests:', error);
      throw error;
    }
  }
};

// Admin Packages API
export const adminPackagesAPI = {
  // Get all packages for admin
  getAllPackages: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/packages/admin/all`, createAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error fetching all packages:', error);
      throw error;
    }
  },

  // Get pending package approvals
  getPendingPackages: async () => {
    try {
      console.log('Fetching pending packages from admin API...');
      const response = await axios.get(`${API_BASE_URL}/packages/admin/pending`, createAuthConfig());
      console.log('Pending packages response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching pending packages:', error);
      console.error('Error response:', error.response?.data);
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

  // Get package update/delete requests
  getPackageRequests: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/packages/admin/requests`, createAuthConfig());
      return response.data;
    } catch (error) {
      console.error('Error fetching package requests:', error);
      throw error;
    }
  },

  // Approve package
  approvePackage: async (packageId, reason = 'Package approved by admin') => {
    try {
      console.log(`Approving package ${packageId} with reason:`, reason);
      const response = await axios.post(
        `${API_BASE_URL}/packages/admin/${packageId}/approve`,
        { reason },
        createAuthConfig()
      );
      console.log('Approve package response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error approving package:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Reject package
  rejectPackage: async (packageId, reason = 'Package does not meet our standards') => {
    try {
      console.log(`Rejecting package ${packageId} with reason:`, reason);
      const response = await axios.post(
        `${API_BASE_URL}/packages/admin/${packageId}/reject`,
        { reason },
        createAuthConfig()
      );
      console.log('Reject package response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error rejecting package:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Approve package request (update/delete)
  approvePackageRequest: async (requestId, reason = 'Request approved by admin') => {
    try {
      console.log(`Approving package request ${requestId} with reason:`, reason);
      const response = await axios.post(
        `${API_BASE_URL}/packages/admin/requests/${requestId}/approve`,
        { reason },
        createAuthConfig()
      );
      console.log('Approve package request response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error approving package request:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  // Reject package request (update/delete)
  rejectPackageRequest: async (requestId, reason = 'Request does not meet our standards') => {
    try {
      console.log(`Rejecting package request ${requestId} with reason:`, reason);
      const response = await axios.post(
        `${API_BASE_URL}/packages/admin/requests/${requestId}/reject`,
        { reason },
        createAuthConfig()
      );
      console.log('Reject package request response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error rejecting package request:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  }
};

// Package data validation
export const validatePackageData = (packageData) => {
  const errors = [];

  if (!packageData.packageName || packageData.packageName.trim().length < 2) {
    errors.push('Package name must be at least 2 characters long');
  }

  if (!packageData.packageType) {
    errors.push('Package type is required');
  }

  if (!packageData.targetAudience) {
    errors.push('Target audience is required');
  }

  if (!packageData.packageDescription || packageData.packageDescription.trim().length < 10) {
    errors.push('Package description must be at least 10 characters long');
  }

  if (!packageData.totalPrice || packageData.totalPrice <= 0) {
    errors.push('Valid total price is required');
  }

  if (!packageData.totalDuration || packageData.totalDuration < 30 || packageData.totalDuration > 1200) {
    errors.push('Package duration must be between 30 and 1200 minutes');
  }

  if (!packageData.includedServices || packageData.includedServices.length === 0) {
    errors.push('At least one service must be included in the package');
  }

  return errors;
};

// Package status helpers
export const getPackageStatusInfo = (pkg) => {
  if (pkg.pendingChanges) {
    return {
      status: `${pkg.pendingChanges.requestType}_pending`,
      label: `${pkg.pendingChanges.requestType} Pending`,
      color: '#FF9800',
      description: `This package has pending ${pkg.pendingChanges.requestType} changes awaiting admin approval.`
    };
  }

  const statusMap = {
    'draft': { label: 'Draft', color: '#9E9E9E', description: 'Package is being prepared' },
    'pending_approval': { label: 'Pending Approval', color: '#FF9800', description: 'Package is awaiting admin approval' },
    'approved': { label: 'Active', color: '#4CAF50', description: 'Package is live and available to customers' },
    'inactive': { label: 'Inactive', color: '#9E9E9E', description: 'Package is temporarily disabled' },
    'rejected': { label: 'Rejected', color: '#F44336', description: 'Package was rejected by admin' },
    'deleted': { label: 'Deleted', color: '#F44336', description: 'Package has been deleted' }
  };

  return {
    status: pkg.status,
    ...statusMap[pkg.status],
    isVisible: pkg.isVisibleToProvider
  };
};

export default {
  serviceProviderPackagesAPI,
  adminPackagesAPI,
  validatePackageData,
  getPackageStatusInfo
};