// services/chat.js - Chat API service
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const chatAPI = axios.create({
  baseURL: `${API_URL}/chat`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to all requests
chatAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get all chat accounts/contacts
export const getChatAccounts = async () => {
  try {
    const response = await chatAPI.get('/accounts');
    return response.data;
  } catch (error) {
    console.error('Error fetching chat accounts:', error);
    throw error.response?.data || error;
  }
};

// Get chat history with a specific contact
export const getChatHistory = async (contactId, limit = 100, skip = 0) => {
  try {
    const response = await chatAPI.get(`/history/${contactId}`, {
      params: { limit, skip }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error.response?.data || error;
  }
};

// Send a message
export const sendMessage = async (receiverId, message) => {
  try {
    const response = await chatAPI.post('/send', {
      receiverId,
      message
    });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error.response?.data || error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (senderId) => {
  try {
    const response = await chatAPI.put('/mark-read', {
      senderId
    });
    return response.data;
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error.response?.data || error;
  }
};

// Get unread message count
export const getUnreadCount = async () => {
  try {
    const response = await chatAPI.get('/unread-count');
    return response.data;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error.response?.data || error;
  }
};

// Delete a contact from user's chat list
export const deleteContact = async (contactId) => {
  try {
    const response = await chatAPI.delete(`/contact/${contactId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error.response?.data || error;
  }
};

// Search for users to chat with
export const searchUsers = async (query) => {
  try {
    const response = await chatAPI.get('/search', {
      params: { query }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error.response?.data || error;
  }
};

export default {
  getChatAccounts,
  getChatHistory,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount,
  deleteContact,
  searchUsers
};
