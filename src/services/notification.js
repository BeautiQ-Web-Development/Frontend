


// services/notification.js
import api from './auth';
import { io } from 'socket.io-client';

// Socket.IO instance
let socket = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

// Connect to the Socket.IO server with better error handling and reconnect logic
export const connectToSocket = (userId, token) => {
  if (socket && socket.connected) {
    console.log('Socket already connected, reusing connection');
    return socket;
  }
  
  if (socket) {
    // Existing socket that's not connected - clean it up
    try {
      socket.disconnect();
      socket.removeAllListeners();
    } catch (e) {
      console.error('Error cleaning up existing socket:', e);
    }
  }
  
  console.log(`🔌 Connecting to Socket.IO server for user: ${userId}`);
  // Determine socket server URL: strip '/api' if present in API URL
  const rawApiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
  const baseUrl = rawApiUrl.replace(/\/api\/?$/, '');
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || baseUrl || 'http://localhost:5000';
  
  // Create the socket with reconnection options
  socket = io(SOCKET_URL, {
    auth: { token },
    query: { token },
    reconnection: true,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000
  });
  
  socket.on('connect', () => {
    console.log(`🟢 Socket connected with ID: ${socket.id}`);
    reconnectAttempts = 0; // Reset counter on successful connection
    
    // Register user with socket server
    socket.emit('register', userId);
    console.log(`👤 Registered socket for user: ${userId}`);
  });
  
  socket.on('disconnect', (reason) => {
    console.log(`🔴 Socket disconnected, reason: ${reason}`);
    
    // If server disconnected us, don't automatically reconnect
    if (reason === 'io server disconnect') {
      console.log('The server has forced the disconnection');
      socket.connect();
    }
  });
  
  socket.on('connect_error', (error) => {
    console.error(`❌ Socket connection error: ${error.message}`);
    reconnectAttempts++;
    
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error(`Maximum reconnect attempts (${MAX_RECONNECT_ATTEMPTS}) reached. Giving up.`);
      socket.disconnect();
    }
  });
  
  socket.on('reconnect', (attemptNumber) => {
    console.log(`Socket reconnected after ${attemptNumber} attempts`);
    socket.emit('register', userId);
  });
  
  socket.on('reconnect_error', (error) => {
    console.error('Error while attempting to reconnect:', error);
  });
  
  // Return the socket instance
  return socket;
};

// Disconnect from the Socket.IO server
export const disconnectFromSocket = () => {
  if (socket) {
    console.log('🔌 Disconnecting socket');
    socket.disconnect();
    socket = null;
  }
};

// Get the socket instance
export const getSocket = () => socket;

// Fetch all notifications for current user
export const fetchNotifications = async (maxRetries = 2) => {
  let retries = 0;
  
  const attemptFetch = async () => {
    try {
      console.log(`📥 Fetching notifications (attempt ${retries + 1}/${maxRetries + 1})`);
      
      // Ensure authentication token is set
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ No authentication token found, cannot fetch notifications');
        return [];
      }
      
      // Set the token in the headers for this request
      const headers = {
        Authorization: `Bearer ${token}`
      };
      
      // Use a timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
      
      const response = await api.get('/notifications', { 
        headers,
        signal: controller.signal
      });
      
      // Clear timeout
      clearTimeout(timeoutId);
      
      console.log(`✅ Fetched ${response.data.data?.length || 0} notifications`);
      console.log('Notification response data:', response.data);
      
      // Detailed logging of each notification
      if (response.data.data && response.data.data.length > 0) {
        console.log('Notifications details:');
        response.data.data.forEach((notif, index) => {
          console.log(`Notification ${index + 1}:`, {
            id: notif._id,
            type: notif.type,
            message: notif.message,
            read: notif.read,
            data: notif.data
          });
        });
      } else {
        console.log('No notifications found in response');
      }
      
      return response.data.data || [];
    } catch (error) {
      console.error(`❌ Error fetching notifications (attempt ${retries + 1}):`, error);
      console.error('Error details:', error.response?.data || error.message);
      
      if (retries < maxRetries) {
        retries++;
        console.log(`🔄 Retrying notification fetch in ${retries * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, retries * 1000));
        return attemptFetch(); // Recursive retry
      }
      
      return [];
    }
  };
  
  return attemptFetch();
};

// Mark a notification as read
export const markAsRead = async (notificationId) => {
  try {
    if (!notificationId) {
      console.error('❌ Cannot mark as read: No notification ID provided');
      return null;
    }
    
    console.log(`📝 Marking notification as read: ${notificationId}`);
    const response = await api.put(`/notifications/${notificationId}/read`);
    console.log('✅ Notification marked as read');
    return response.data.notification;
  } catch (error) {
    console.error('❌ Error marking notification as read:', error);
    console.error('Error details:', error.response?.data || error.message);
    
    // Return null instead of throwing to prevent UI crashes
    return null;
  }
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  try {
    console.log('📝 Marking all notifications as read');
    
    // Ensure authentication token is set
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No authentication token found, cannot mark all as read');
      return { success: false, count: 0 };
    }
    
    // Set the token in the headers for this request
    const headers = {
      Authorization: `Bearer ${token}`
    };
    
    const response = await api.put('/notifications/read/all', {}, { headers });
    console.log(`✅ Marked ${response.data.count} notifications as read`);
    return response.data;
  } catch (error) {
    console.error('❌ Error marking all notifications as read:', error);
    console.error('Error details:', error.response?.data || error.message);
    
    // Return default response instead of throwing to prevent UI crashes
    return { success: false, count: 0 };
  }
};

// Get unread notification count
export const getUnreadCount = async () => {
  try {
    const response = await api.get('/notifications/unread/count');
    return response.data.count || 0;
  } catch (error) {
    console.error('❌ Error getting unread count:', error);
    return 0;
  }
};

// Provider approval/rejection services
export const approveProviderRequest = async (requestId) => {
  try {
    console.log(`👍 Approving provider request: ${requestId}`);
    const { data } = await api.put(`/notifications/providers/${requestId}/approve`);
    console.log('✅ Provider request approved');
    return data;
  } catch (error) {
    console.error('❌ Error approving provider request:', error);
    throw error;
  }
};

export const rejectProviderRequest = async (requestId, reason) => {
  try {
    console.log(`👎 Rejecting provider request: ${requestId}, reason: ${reason}`);
    const { data } = await api.put(
      `/notifications/providers/${requestId}/reject`,
      { reason }
    );
    console.log('✅ Provider request rejected');
    return data;
  } catch (error) {
    console.error('❌ Error rejecting provider request:', error);
    throw error;
  }
};

// Expose aliases for backward compatibility
export const approveServiceProvider = approveProviderRequest;
export const rejectServiceProvider = rejectProviderRequest;