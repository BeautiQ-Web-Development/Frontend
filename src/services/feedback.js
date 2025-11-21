import api from './auth';
import { handleApiError } from '../utils/apiUtils';

const sanitizeParams = (params = {}) => {
  const cleaned = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === 'string' && value.trim() === '') return;
    cleaned[key] = value;
  });
  return cleaned;
};

const buildQuery = (params = {}) => {
  const cleaned = sanitizeParams(params);
  const searchParams = new URLSearchParams(cleaned);
  return searchParams.toString();
};

export const submitFeedback = async (payload) => {
  try {
    const response = await api.post('/feedback', payload);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const fetchFeedbacks = async (params = {}) => {
  try {
    const query = buildQuery(params);
    const url = query ? `/feedback?${query}` : '/feedback';
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const fetchCustomerFeedback = async (customerId, params = {}) => {
  if (!customerId) {
    throw new Error('Customer ID is required to fetch feedback');
  }

  try {
    const query = buildQuery(params);
    const url = query ? `/feedback/customer/${customerId}?${query}` : `/feedback/customer/${customerId}`;
    const response = await api.get(url);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const fetchProviderFeedback = async (providerId, params = {}) => {
  if (!providerId) {
    throw new Error('Provider ID is required to fetch feedback');
  }

  try {
    const query = buildQuery(params);
    const url = query ? `/feedback/provider/${providerId}?${query}` : `/feedback/provider/${providerId}`;
    const response = await api.get(url);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const fetchServiceFeedback = async (serviceName, params = {}) => {
  if (!serviceName) {
    throw new Error('Service name is required to fetch feedback');
  }

  try {
    const query = buildQuery(params);
    const encoded = encodeURIComponent(serviceName);
    const url = query ? `/feedback/service/${encoded}?${query}` : `/feedback/service/${encoded}`;
    const response = await api.get(url);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const fetchFeedbackStats = async () => {
  try {
    const response = await api.get('/feedback/stats');
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const fetchFeedbackTrends = async (period = 'month') => {
  try {
    const response = await api.get(`/feedback/trends?period=${period}`);
    return response.data?.data || response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export default {
  submitFeedback,
  fetchFeedbacks,
  fetchCustomerFeedback,
  fetchProviderFeedback,
  fetchServiceFeedback,
  fetchFeedbackStats,
  fetchFeedbackTrends,
};
