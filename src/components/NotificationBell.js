import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Badge, IconButton, Popover, Box, Typography, List, ListItem, ListItemText, Divider, Button, CircularProgress } from '@mui/material';
import { Notifications as NotificationsIcon, NotificationsNone as NotificationsNoneIcon, Check as CheckIcon } from '@mui/icons-material';
import { fetchNotifications, markAsRead, markAllAsRead, connectToSocket, getSocket } from '../services/notification';
import { useFeedback } from '../context/FeedbackContext';
import { useAuth } from '../context/AuthContext';

const NotificationBell = () => {
  const { user } = useAuth();
  const { openFeedbackModal } = useFeedback();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);
  
  // Get unread count
  const getUnreadCount = useCallback(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Fetch notifications on mount
  const fetchUserNotifications = useCallback(async () => {
    if (!user || !user.userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNotifications();
      
      console.log('NotificationBell - Fetched raw notifications:', data);
      
      // Hide service provider registration notifications for service providers
      let filteredData = data;
      if (user.role === 'serviceProvider') {
        filteredData = filteredData.filter(n => n.type !== 'newServiceProvider');
      }
      
      console.log('NotificationBell - After filtering:', filteredData);
      
      if (isMounted.current) {
        setNotifications(filteredData);
        setUnreadCount(filteredData.filter(n => !n.read).length);
        console.log('NotificationBell - Updated state with notifications:', filteredData.length);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      if (isMounted.current) {
        setError('Failed to load notifications');
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [user]);

  // Connect to socket and listen for notifications
  useEffect(() => {
    if (!user || !user.userId) return;
    
    console.log('🔄 Setting up notification socket listener');
    
    // Initial fetch
    fetchUserNotifications();
    
    // Connect to socket
    const token = localStorage.getItem('token');
    const socket = connectToSocket(user.userId, token);
    
    // Listen for new notifications
    socket.on('newNotification', (notification) => {
      // Ignore provider registration notifications for service providers
      if (user.role === 'serviceProvider' && notification.type === 'newServiceProvider') return;
      console.log('📨 Received new notification:', notification);
      
      // Add new notification to state
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Play notification sound (optional)
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.play().catch(e => console.log('Audio play prevented:', e));
      } catch (err) {
        console.log('Audio not supported');
      }
    });
    
    return () => {
      isMounted.current = false;
      const socket = getSocket();
      if (socket) {
        socket.off('newNotification');
      }
    };
  }, [user, fetchUserNotifications]);

  // Calculate unread count whenever notifications change
  useEffect(() => {
    const count = getUnreadCount();
    setUnreadCount(count);
  }, [notifications, getUnreadCount]);

  const handleBellClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isFeedbackRequest = (notification) => {
    if (!notification?.type) return false;
    const normalized = notification.type.toLowerCase();
    return normalized === 'feedback_request' || normalized === 'feedback' || normalized === 'feedbackrequest';
  };

  // Mark a notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      
      // Update unread count
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  return (
    <>
      <IconButton
        aria-describedby={id}
        onClick={handleBellClick}
        color="inherit"
        sx={{ position: 'relative' }}
      >
        {unreadCount > 0 ? (
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        ) : (
          <NotificationsNoneIcon /> // Don't show zero badge
        )}
      </IconButton>
      
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 350,
            maxHeight: 500,
            boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)',
            borderRadius: '8px',
            overflow: 'hidden'
          }
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: '#ffffffff',
            color: 'white'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button
              startIcon={<CheckIcon />}
              onClick={handleMarkAllAsRead}
              sx={{ 
                color: 'white',
                '&:hover': { 
                  bgcolor: 'rgba(255,255,255,0.1)' 
                }
              }}
              size="small"
            >
              Mark all as read
            </Button>
          )}
        </Box>
        
        <Divider />
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={30} />
          </Box>
        )}
        
        {error && (
          <Box sx={{ p: 2, color: 'error.main' }}>
            <Typography>{error}</Typography>
          </Box>
        )}
        
        {!loading && !error && notifications.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">No notifications yet</Typography>
          </Box>
        )}
        
        {!loading && !error && notifications.length > 0 && (
          <List sx={{ maxHeight: 350, overflowY: 'auto', p: 0 }}>
            {notifications.map((notification) => (
              <React.Fragment key={notification._id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    px: 2,
                    py: 1.5,
                    bgcolor: notification.read ? 'transparent' : 'rgba(0, 48, 71, 0.05)',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(0, 48, 71, 0.1)'
                    }
                  }}
                  onClick={() => {
                    console.log('NotificationBell - Notification clicked:', notification);
                    
                    // Mark as read
                    if (!notification.read) {
                      handleMarkAsRead(notification._id);
                    }
                    
                    // Close the popover
                    handleClose();
                    
                    // Navigate based on notification type
                    if (isFeedbackRequest(notification)) {
                      const requestPayload = {
                        notificationId: notification._id,
                        bookingId: notification.data?.bookingId,
                        serviceId: notification.data?.serviceId,
                        serviceName: notification.data?.serviceName || notification.data?.service,
                        providerId: notification.data?.providerId, // MongoDB ObjectId for submission
                        providerSerialNumber: notification.data?.providerSerialNumber, // Serial number for display (SP-XXX)
                        providerName: notification.data?.providerName,
                        scheduledAt: notification.data?.scheduledAt || notification.data?.slotTime,
                        message: notification.message,
                      };
                      openFeedbackModal(requestPayload);
                    } else if (notification.type === 'providerUnavailable' && user?.role === 'customer') {
                      console.log('NotificationBell - Navigating to notifications page');
                      // Use window.location to ensure we actually navigate even if already on the page
                      window.location.href = '/customer/notifications';
                    } else if (notification.type === 'booking_confirmation') {
                      console.log('NotificationBell - Navigating to appointments page');
                      // Navigate to appointments page based on user role
                      if (user?.role === 'serviceProvider') {
                        window.location.href = '/serviceProvider/appointments';
                      } else if (user?.role === 'customer') {
                        window.location.href = '/customer/appointments';
                      } else if (user?.role === 'admin') {
                        window.location.href = '/admin/appointments';
                      }
                    } else {
                      console.log('NotificationBell - Not navigating because:',
                        notification.type !== 'providerUnavailable' && notification.type !== 'booking_confirmation' ? 
                          `notification type is ${notification.type}, not a navigable type` :
                          `user role is ${user?.role}`
                      );
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography 
                        variant="subtitle2" 
                        sx={{ 
                          fontWeight: notification.read ? 400 : 600,
                          color: notification.read ? 'text.primary' : '#003047'
                        }}
                      >
                        {/* Add notification icon based on type */}
                        {notification.type === 'serviceUnavailable' && 
                          <span role="img" aria-label="unavailable" style={{ marginRight: '4px' }}>⚠️</span>
                        }
                        {notification.type === 'providerUnavailable' && 
                          <span role="img" aria-label="provider-unavailable" style={{ marginRight: '4px' }}>🚫</span>
                        }
                        {notification.type === 'booking_confirmation' && 
                          <span role="img" aria-label="booking-confirmation" style={{ marginRight: '4px' }}>✅</span>
                        }
                        {notification.type === 'providerUnavailable' 
                          ? 'Service Provider Unavailable'
                          : notification.message}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography component="div" variant="body2">
                          <Box component="span" sx={{ mt: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography component="span" variant="caption" color="text.secondary">
                              {notification.type === 'serviceUnavailable' && 'Service Unavailable'}
                              {notification.type === 'providerUnavailable' && 'Service Provider Unavailable'}
                              {notification.type === 'booking_confirmation' && 'Booking Confirmation'}
                              {!['serviceUnavailable', 'providerUnavailable', 'booking_confirmation'].includes(notification.type) && `From: ${notification.sender}`}
                            </Typography>
                            <Typography component="span" variant="caption" color="text.secondary">
                              {formatNotificationTime(notification.timestamp)}
                            </Typography>
                          </Box>
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Popover>
    </>
  );
};

export default NotificationBell;
