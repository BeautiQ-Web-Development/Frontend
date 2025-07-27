//frontend/utils/apiUtils.js

import axios from 'axios';

export const apiCall = async (config, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios(config);
      return response;
    } catch (error) {
      console.error(`API call attempt ${i + 1} failed:`, error);
      
      if (i === retries - 1) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};

export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || 'Server error occurred';
  } else if (error.request) {
    // Request made but no response received
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred';
  }
};
