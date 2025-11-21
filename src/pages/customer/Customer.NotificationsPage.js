import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, List, ListItem, ListItemText, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Badge, Paper } from '@mui/material';
import { useNotifications } from '../../context/NotificationContext';
import CustomerSidebar from '../../components/CustomerSidebar';
import EnhancedAppBar from '../../components/EnhancedAppBar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CircleIcon from '@mui/icons-material/Circle';
import { useFeedback } from '../../context/FeedbackContext';

const CustomerNotificationsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    refreshNotifications
  } = useNotifications();
  const { openFeedbackModal } = useFeedback();
  const [selected, setSelected] = useState(null);

  // FIXED: Ensure notifications is always an array and log the actual data
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  
  console.log('🔍 CustomerNotificationsPage RENDER:', {
    notifications,
    safeNotifications,
    length: safeNotifications.length,
    loading,
    unreadCount
  });

  // FIXED: Refresh notifications on mount
  useEffect(() => {
    console.log('CustomerNotificationsPage - Component mounted, refreshing notifications');
    refreshNotifications(true);
  }, [refreshNotifications]);

  const handleLogout = () => { 
    logout(); 
    navigate('/customer-login'); 
  };

  const handleMenu = () => setSidebarOpen(v => !v);

  const handleView = (notif) => { 
    setSelected(notif); 
    if (!notif.read) {
      const notificationId = notif._id || notif.id; 
      if (notificationId) {
        console.log('Marking notification as read:', notificationId);
        markAsRead(notificationId);
      }
    }
    const normalizedType = notif.type?.toLowerCase();
    if (normalizedType === 'feedback_request' || normalizedType === 'feedback' || normalizedType === 'feedbackrequest') {
      openFeedbackModal({
        notificationId: notif._id,
        bookingId: notif.data?.bookingId,
        serviceId: notif.data?.serviceId,
        serviceName: notif.data?.serviceName || notif.data?.service,
        providerId: notif.data?.providerId,
        providerName: notif.data?.providerName,
        scheduledAt: notif.data?.scheduledAt || notif.data?.slotTime,
        message: notif.message,
      });
    }
  };

  const handleClose = () => setSelected(null);

  const handleRefresh = () => {
    console.log('Manual refresh triggered');
    refreshNotifications(true);
  };

  const handleMarkAllRead = () => {
    console.log('Mark all as read triggered');
    markAllAsRead();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <EnhancedAppBar
        role="customer"
        user={user}
        onMenuClick={handleMenu}
        onLogout={handleLogout}
        title="Notifications"
        notifications={unreadCount}
        notificationsList={safeNotifications}
      />
      
      <Box sx={{ display: 'flex', flexGrow: 1, bgcolor: '#f5f5f5' }}>
        <CustomerSidebar 
          open={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          user={user}
        />
        
        {/* FIXED: Main content area with proper background and spacing */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: '#f5f5f5',
            ml: sidebarOpen ? { xs: 0, sm: '240px' } : 0,
            transition: 'margin-left 0.3s ease-in-out',
            p: 3,
            minHeight: '100vh',
            pt: '80px' // Account for AppBar height
          }}
        >
          <Container maxWidth="lg" sx={{ bgcolor: 'transparent' }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#1976d2' }}>
                Customer Notifications
                </Typography>
                <Button 
                  onClick={handleRefresh}
                  disabled={loading}
                  variant="outlined"
                  color="primary"
                  size="small"
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </Button>
              </Box>
              
              {safeNotifications.length > 0 && unreadCount > 0 && (
                <Button 
                  onClick={handleMarkAllRead} 
                  disabled={loading}
                  color="secondary"
                  variant="contained"
                  size="small"
                >
                  Mark all as read ({unreadCount})
                </Button>
              )}
            </Box>

            {/* Debug info for development */}
            {/* {process.env.NODE_ENV === 'development' && (
              <Paper sx={{ mb: 3, p: 2, bgcolor: '#e3f2fd', border: '1px solid #2196f3' }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>🔍 DEBUG INFO:</Typography>
                <Typography variant="caption" component="div">Notifications length: {safeNotifications.length}</Typography>
                <Typography variant="caption" component="div">Loading: {loading.toString()}</Typography>
                <Typography variant="caption" component="div">Unread count: {unreadCount}</Typography>
                <Typography variant="caption" component="div">First notification ID: {safeNotifications[0]?._id}</Typography>
                <Typography variant="caption" component="div">First notification message: {safeNotifications[0]?.message}</Typography>
                <Typography variant="caption" component="div">Raw notifications: {JSON.stringify(notifications)}</Typography>
              </Paper>
            )} */}

            {/* FIXED: Content Area with white background */}
            <Paper 
              elevation={1} 
              sx={{ 
                bgcolor: '#ffffff',
                borderRadius: 2,
                overflow: 'hidden',
                minHeight: '400px'
              }}
            >
              {loading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <CircularProgress size={40} />
                  <Typography variant="body1" sx={{ mt: 2 }}>Loading notifications...</Typography>
                </Box>
              ) : safeNotifications.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No notifications found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You're all caught up! New notifications will appear here.
                  </Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {safeNotifications.map((notification, index) => {
                    console.log(`🔥 RENDERING notification ${index}:`, notification);
                    return (
                      <React.Fragment key={notification._id || notification.id || index}>
                        <ListItem 
                          onClick={() => handleView(notification)}
                          sx={{
                            bgcolor: !notification.read ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                            borderLeft: !notification.read ? '4px solid #1976d2' : '4px solid transparent',
                            py: 2,
                            px: 3,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              bgcolor: !notification.read ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                              transform: 'translateY(-1px)',
                              boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                            }
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                  fontWeight: notification.read ? 400 : 600,
                                  color: notification.read ? '#333333' : '#1976d2',
                                  mb: 0.5
                                }}
                              >
                                {notification.message || 'No message available'}
                              </Typography>
                            }
                            secondary={
                              <Box component="div">
                                <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                  {notification.type === 'providerUnavailable' ? 'Service Provider Unavailable' : 
                                   notification.type === 'serviceUnavailable' ? 'Service Unavailable' : 
                                   notification.type === 'newServiceProvider' ? 'New Service Provider' :
                                   `Type: ${notification.type || 'Unknown'}`}
                                </Typography>
                                
                                <Typography component="span" variant="caption" color="text.secondary" display="block">
                                  {new Date(notification.timestamp || notification.createdAt || Date.now()).toLocaleString()}
                                </Typography>
                              </Box>
                            }
                          />
                          
                          {!notification.read && (
                            <Badge 
                              color="primary" 
                              variant="dot"
                              sx={{ 
                                ml: 2,
                                '& .MuiBadge-badge': {
                                  width: 12,
                                  height: 12,
                                  borderRadius: '50%'
                                }
                              }}
                            />
                          )}
                        </ListItem>
                        {index < safeNotifications.length - 1 && (
                          <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.08)' }} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </List>
              )}
            </Paper>

            {/* Notification Detail Dialog */}
            <Dialog 
              open={Boolean(selected)} 
              onClose={handleClose}
              maxWidth="sm"
              fullWidth
              PaperProps={{
                elevation: 24,
                sx: { 
                  borderRadius: 2,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                }
              }}
            >
              <DialogTitle sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
                {selected?.type === 'providerUnavailable' ? 'Service Provider Unavailable' : 
                 selected?.type === 'serviceUnavailable' ? 'Service Unavailable' :
                 'Notification Details'}
              </DialogTitle>
              <DialogContent sx={{ pt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  {selected?.message || 'No message available'}
                </Typography>
                
                {/* Provider Unavailable Details */}
                {selected?.type === 'providerUnavailable' && selected?.data && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(255, 152, 0, 0.08)', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="warning.main" gutterBottom>
                      Provider Details:
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Provider Name:</strong> {selected.data.providerName || selected.data.businessName || 'Not available'}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Provider ID:</strong> {selected.data.providerId || 'Not available'}
                    </Typography>
                    {selected.data.servicesUnavailable && selected.data.servicesUnavailable.length > 0 && (
                      <Typography variant="body2" gutterBottom>
                        <strong>Services Unavailable:</strong> {Array.isArray(selected.data.servicesUnavailable) 
                          ? selected.data.servicesUnavailable.join(', ') 
                          : selected.data.servicesUnavailable}
                      </Typography>
                    )}
                    <Typography variant="body2" gutterBottom>
                      <strong>Provider Email:</strong> {selected.data.email || selected.data.providerEmail || 'Not available'}
                    </Typography>
                    {selected.data.reason && (
                      <Typography variant="body2" gutterBottom>
                        <strong>Reason:</strong> {selected.data.reason}
                      </Typography>
                    )}
                  </Box>
                )}
                
                {/* Timestamp and Status */}
                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Received on {new Date(selected?.timestamp || selected?.createdAt || Date.now()).toLocaleString()}
                    </Typography>
                  </Box>
                  {selected?.read ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DoneAllIcon fontSize="small" sx={{ mr: 1, color: 'success.main' }} />
                      <Typography variant="caption" color="text.secondary">
                        Read on {selected?.readAt ? new Date(selected.readAt).toLocaleString() : 'just now'}
                      </Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CircleIcon fontSize="small" sx={{ mr: 1, color: 'error.main' }} />
                      <Typography variant="caption" color="text.secondary">
                        Unread
                      </Typography>
                    </Box>
                  )}
                </Box>
              </DialogContent>
              <DialogActions sx={{ borderTop: '1px solid rgba(0, 0, 0, 0.12)', p: 2 }}>
                {selected && !selected.read && (
                  <Button 
                    onClick={() => markAsRead(selected._id || selected.id)} 
                    color="primary"
                    variant="contained"
                    size="small"
                  >
                    Mark as Read
                  </Button>
                )}
                <Button onClick={handleClose} size="small">Close</Button>
              </DialogActions>
            </Dialog>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomerNotificationsPage;