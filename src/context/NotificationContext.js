import React, { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { 
  fetchNotifications, 
  markAsRead, 
  markAllAsRead,
  connectToSocket,
  getSocket,
  disconnectFromSocket
} from '../services/notification';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [persistedUser, setPersistedUser] = useState(null);
  const fetchTimeoutRef = useRef(null);
  const lastFetchTimeRef = useRef(0);
  const socketRef = useRef(null);
  
  // Clear persisted user and notifications when logged out
  const clearPersistedData = useCallback(() => {
    setPersistedUser(null);
    setNotifications([]);
    setUnreadCount(0);
    try {
      localStorage.removeItem('notificationContextUser');
    } catch (e) {
      console.error('NotificationContext - Error clearing persisted user:', e);
    }
    console.log('NotificationContext - Cleared persisted data');
  }, []);
  
  // Calculate unread count
  const updateUnreadCount = useCallback(() => {
    const count = notifications.filter(n => !n.read).length;
    setUnreadCount(count);
  }, [notifications]);
  
  // // Fetch notifications with debouncing and persisted user
  // const getNotifications = useCallback(async (forceRefresh = false) => {
  //   // Clear any pending fetch timeout
  //   if (fetchTimeoutRef.current) {
  //     clearTimeout(fetchTimeoutRef.current);
  //     fetchTimeoutRef.current = null;
  //   }
    
  //   // Throttle fetches to prevent multiple rapid calls (unless force refresh)
  //   const now = Date.now();
  //   const timeSinceLastFetch = now - lastFetchTimeRef.current;
  //   if (!forceRefresh && timeSinceLastFetch < 3000 && notifications.length > 0) {
  //     console.log('NotificationContext - Throttling fetch, last fetch was', Math.round(timeSinceLastFetch/1000), 'seconds ago');
  //     return;
  //   }
    
  //   // Use persisted user if available, otherwise try context user or token
  //   let currentUser = persistedUser || user;
    
  //   // If no user from context or persisted state, try to get from token in localStorage as fallback
  //   if (!currentUser || !currentUser.userId) {
  //     const token = localStorage.getItem('token');
  //     if (token) {
  //       try {
  //         // Parse the JWT token to get user info
  //         const payload = JSON.parse(atob(token.split('.')[1]));
  //         console.log('NotificationContext - Found user in token:', payload);
  //         currentUser = {
  //           userId: payload.userId,
  //           role: payload.role
  //         };
          
  //         // Persist this user to avoid redundant token parsing
  //         setPersistedUser(currentUser);
  //       } catch (e) {
  //         console.error('NotificationContext - Invalid token format:', e);
  //       }
  //     }
  //   }
    
  //   // If still no user info available, skip fetch
  //   if (!currentUser || !currentUser.userId) {
  //     console.log('NotificationContext - No user or userId available, skipping fetch');
  //     return;
  //   }
    
  //   try {
  //     // Only show loading indicator if we don't already have notifications
  //     if (notifications.length === 0) {
  //       setLoading(true);
  //     }
      
  //     setError(null);
  //     console.log('NotificationContext - Fetching notifications for user:', currentUser.userId);
      
  //     lastFetchTimeRef.current = Date.now();
  //     let data = await fetchNotifications();
      
  //     // Hide service provider registration notifications from service providers
  //     if (currentUser.role === 'serviceProvider') {
  //       data = data.filter(n => n.type !== 'newServiceProvider');
  //     }
      
  //     if (data.length > 0 || notifications.length === 0) {
  //       console.log(`NotificationContext - Setting ${data.length} notifications`);
  //       setNotifications(data);
  //     } else {
  //       console.log('NotificationContext - No notifications received from API');
  //     }
      
  //     // Count will be updated by the effect
  //   } catch (err) {
  //     console.error('NotificationContext - Error fetching notifications:', err);
  //     setError('Failed to load notifications');
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [user, notifications.length, persistedUser]);

  

  // Key changes to fix the NotificationContext.js issue

// REPLACE the getNotifications function in your NotificationContext.js with this improved version:

const getNotifications = useCallback(async (forceRefresh = false) => {
  // Clear any pending fetch timeout
  if (fetchTimeoutRef.current) {
    clearTimeout(fetchTimeoutRef.current);
    fetchTimeoutRef.current = null;
  }
  
  // Throttle fetches to prevent multiple rapid calls (unless force refresh)
  const now = Date.now();
  const timeSinceLastFetch = now - lastFetchTimeRef.current;
  if (!forceRefresh && timeSinceLastFetch < 3000) {
    console.log('NotificationContext - Throttling fetch, last fetch was', Math.round(timeSinceLastFetch/1000), 'seconds ago');
    return;
  }
  
  // Use persisted user if available, otherwise try context user or token
  let currentUser = persistedUser || user;
  
  // If no user from context or persisted state, try to get from token in localStorage as fallback
  if (!currentUser || !currentUser.userId) {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Parse the JWT token to get user info
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('NotificationContext - Found user in token:', payload);
        currentUser = {
          userId: payload.userId,
          role: payload.role
        };
        
        // Persist this user to avoid redundant token parsing
        setPersistedUser(currentUser);
      } catch (e) {
        console.error('NotificationContext - Invalid token format:', e);
      }
    }
  }
  
  // If still no user info available, skip fetch
  if (!currentUser || !currentUser.userId) {
    console.log('NotificationContext - No user or userId available, skipping fetch');
    return;
  }
  
  try {
    setLoading(true); // FIXED: Always show loading when fetching
    setError(null);
    console.log('NotificationContext - Fetching notifications for user:', currentUser.userId);
    
    lastFetchTimeRef.current = Date.now();
    let data = await fetchNotifications();
    
    // Hide service provider registration notifications from service providers
    if (currentUser.role === 'serviceProvider') {
      data = data.filter(n => n.type !== 'newServiceProvider');
    }
    
    // FIXED: Always update notifications, even if empty
    console.log(`NotificationContext - Setting ${data.length} notifications`);
    setNotifications(data);
    
  } catch (err) {
    console.error('NotificationContext - Error fetching notifications:', err);
    setError('Failed to load notifications');
    // FIXED: Don't clear notifications on error, keep existing ones
  } finally {
    setLoading(false);
  }
}, [user, persistedUser]); // FIXED: Removed notifications.length dependency to prevent loops



  // Mark a notification as read
  const handleMarkAsRead = useCallback(async (notificationId) => {
    if (!notificationId) {
      console.error('NotificationContext - Cannot mark as read: Invalid notification ID');
      return;
    }
    
    try {
      const result = await markAsRead(notificationId);
      
      // Even if API call fails, update UI state for better user experience
      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId ? { ...n, read: true, readAt: new Date().toISOString() } : n
        )
      );
      
      // Count will be updated by the effect
      console.log('NotificationContext - Notification marked as read:', result || notificationId);
    } catch (err) {
      console.error('NotificationContext - Error marking notification as read:', err);
      // Don't throw, swallow the error and just log it
    }
  }, []);
  
  // Mark all notifications as read
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      const result = await markAllAsRead();
      
      // Even if API call fails, update UI state for better user experience
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true, readAt: new Date().toISOString() }))
      );
      
      // Count will be updated by the effect
      console.log('NotificationContext - All notifications marked as read:', result?.count || 'unknown count');
    } catch (err) {
      console.error('NotificationContext - Error marking all notifications as read:', err);
      // Don't throw, swallow the error and just log it
    }
  }, []);
  
  // Set up persisted user from context or token, with localStorage caching
  useEffect(() => {
    // Load saved user from localStorage first if available
    if (!persistedUser) {
      try {
        const savedUser = localStorage.getItem('notificationContextUser');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser && parsedUser.userId) {
            console.log('NotificationContext - Loaded persisted user from localStorage:', parsedUser.userId);
            setPersistedUser(parsedUser);
          }
        }
      } catch (e) {
        console.error('NotificationContext - Error loading saved user from localStorage:', e);
      }
    }
    
    // If user from context is available and different from current persisted user, update
    if (user && user.userId) {
      if (!persistedUser || user.userId !== persistedUser.userId) {
        console.log('NotificationContext - User context updated, persisting new user:', user.userId);
        setPersistedUser(user);
        
        // Save to localStorage for quicker loading next time
        try {
          localStorage.setItem('notificationContextUser', JSON.stringify(user));
        } catch (e) {
          console.error('NotificationContext - Error saving user to localStorage:', e);
        }
      }
      return;
    }
    
    // If we already have a persisted user, keep using it
    if (persistedUser && persistedUser.userId) {
      return;
    }
    
    // Try to get user from token as last resort
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const tokenUser = {
          userId: payload.userId,
          role: payload.role
        };
        
        console.log('NotificationContext - Persisting user from token:', tokenUser.userId);
        setPersistedUser(tokenUser);
        
        // Save to localStorage for quicker loading next time
        try {
          localStorage.setItem('notificationContextUser', JSON.stringify(tokenUser));
        } catch (e) {
          console.error('NotificationContext - Error saving token user to localStorage:', e);
        }
      } catch (e) {
        console.error('NotificationContext - Cannot parse token:', e);
      }
    }
  }, [user, persistedUser]);

  // Setup socket connection and listeners - FIXED TOKEN HANDLING
  useEffect(() => {
    // Use persisted user if available, otherwise try context user
    const currentUser = persistedUser || user;
    
    if (!currentUser || !currentUser.userId) {
      console.log('NotificationContext - Socket: No user available, skipping socket setup');
      return;
    }
    
    // FIXED: Ensure we have a valid token before proceeding
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('NotificationContext - No token available for socket connection, skipping socket setup');
      return;
    }
    
    console.log('🔌 Setting up notification socket in context for user:', currentUser.userId);
    console.log('🔑 Using token for socket:', token ? 'Present' : 'Missing');
    
    // Initial fetch after a small delay to let UI render
    fetchTimeoutRef.current = setTimeout(() => {
      getNotifications();
    }, 300);
    
    // FIXED: Only create a new socket if we don't already have one OR if the existing one is disconnected
    if (!socketRef.current || !socketRef.current.connected) {
      // Clean up existing socket if it exists but is disconnected
      if (socketRef.current && !socketRef.current.connected) {
        try {
          socketRef.current.disconnect();
          socketRef.current.removeAllListeners();
        } catch (e) {
          console.error('NotificationContext - Error cleaning up existing socket:', e);
        }
      }
      
      socketRef.current = connectToSocket(currentUser.userId, token);
      console.log('🔌 Created new socket connection for user:', currentUser.userId);
    }
    
    const socket = socketRef.current;
    
    // Verify socket has token
    if (socket && socket.auth && socket.auth.token) {
      console.log('✅ Socket has valid auth token');
    } else {
      console.warn('⚠️ Socket may not have valid auth token');
    }
    
    // Listen for new notifications
    socket.on('newNotification', (notification) => {
      // Ignore provider registration notifications for service providers
      if (currentUser.role === 'serviceProvider' && notification.type === 'newServiceProvider') return;
      console.log('📨 Received new notification in context:', notification);
      
      // For providerUnavailable notifications, make sure the message is properly set
      if (notification.type === 'providerUnavailable') {
        console.log('Processing provider unavailable notification:', notification);
        
        // Make sure data is properly structured
        if (!notification.data) notification.data = {};
        
        // Copy properties from root to data if they exist
        if (notification.providerId) notification.data.providerId = notification.providerId;
        if (notification.providerName) notification.data.providerName = notification.providerName;
        if (notification.servicesUnavailable) notification.data.servicesUnavailable = notification.servicesUnavailable;
        if (notification.providerEmail) notification.data.providerEmail = notification.providerEmail;
        
        // Ensure we have a proper message
        if (!notification.message || notification.message.includes('New Service Provider Registration')) {
          notification.message = `Service provider ${notification.data.providerName || 'Unknown'} is no longer available.`;
        }
      }
      
      // Add new notification to state
      setNotifications(prev => {
        // Prevent duplicates by checking if this notification already exists
        const exists = prev.some(n => n._id === notification._id);
        if (exists) {
          return prev;
        }
        return [notification, ...prev];
      });
    });
    
    // FIXED: Add error handling for socket connection issues
    socket.on('connect_error', (error) => {
      console.error('🔴 NotificationContext - Socket connection error:', error);
    });
    
    socket.on('disconnect', (reason) => {
      console.log('🔴 NotificationContext - Socket disconnected:', reason);
    });
    
    socket.on('connect', () => {
      console.log('🟢 NotificationContext - Socket connected successfully');
    });
    
    // Cleanup socket listeners for this specific effect
    return () => {
      if (socketRef.current) {
        socketRef.current.off('newNotification');
        socketRef.current.off('connect_error');
        socketRef.current.off('disconnect');
        socketRef.current.off('connect');
        console.log('NotificationContext - Cleaned up socket event listeners in effect');
      }
      // Note: We don't disconnect on context unmount to preserve the socket connection
    };
  }, [persistedUser, user, getNotifications]); // Added getNotifications to dependencies
  
  // Update unread count whenever notifications change
  useEffect(() => {
    updateUnreadCount();
  }, [notifications, updateUnreadCount]);
  
  // Force refresh notifications if user changes
  useEffect(() => {
    if (user?.userId && (!persistedUser || user.userId !== persistedUser.userId)) {
      console.log('NotificationContext - User changed, refreshing notifications');
      getNotifications(true); // Force refresh
    }
  }, [user, persistedUser, getNotifications]);

  // Clear data on logout
  useEffect(() => {
    if (isLoggedIn === false) {
      console.log('NotificationContext - User logged out, clearing data');
      clearPersistedData();
      
      // Cleanup socket connection on logout
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        console.log('NotificationContext - Disconnected socket on logout');
      }
    }
  }, [isLoggedIn, clearPersistedData]);
  
  // Cleanup timeouts and socket on unmount
  useEffect(() => {
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
      
      // We don't disconnect on component unmount to preserve realtime notifications
      // But we do remove listeners to prevent memory leaks
      if (socketRef.current) {
        socketRef.current.off('newNotification');
        socketRef.current.off('connect_error');
        socketRef.current.off('disconnect');
        socketRef.current.off('connect');
        console.log('NotificationContext - Removed socket listeners on unmount');
      }
    };
  }, []);

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    currentUser: persistedUser || user,
    hasUser: !!(persistedUser || user),
    refreshNotifications: getNotifications,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    clearNotifications: clearPersistedData
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

export default NotificationContext;