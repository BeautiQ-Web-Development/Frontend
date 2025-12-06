
//Admin.NotificationsPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Alert,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  TextField,
  Rating
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Star as StarIcon,
  RateReview as FeedbackIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../../components/footer';
import AdminSidebar from '../../components/AdminSidebar';
import EnhancedAppBar from '../../components/EnhancedAppBar';
import { 
  fetchNotifications, 
  approveServiceProvider, 
  rejectServiceProvider,
  markAsRead,
  markAllAsRead,
  connectToSocket,
  getSocket 
} from '../../services/notification';
import api from '../../services/auth';
import { styled } from '@mui/material/styles';

const NotificationCard = styled(Card)(({ theme }) => ({
  background: '#FFFFFF',
  border: '1px solid rgba(0, 31, 63, 0.08)',
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0, 31, 63, 0.06)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(0, 31, 63, 0.12)',
  }
}));

const AdminNotifications = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchNotificationData();
    
    // Connect to socket.io for real-time notifications
    if (user && user.userId) {
      const token = localStorage.getItem('token');
      const socket = connectToSocket(user.userId, token);
      
      // Listen for new notifications
      socket.on('newNotification', (notification) => {
        console.log('📨 Admin received new notification:', notification);
        
        // Add new notification to state
        setNotifications(prev => [notification, ...prev]);
        
        // Optional: Play notification sound
        try {
          const audio = new Audio('/notification-sound.mp3');
          audio.play().catch(e => console.log('Audio play prevented:', e));
        } catch (err) {
          console.log('Audio not supported');
        }
      });
      
      // Cleanup on unmount
      return () => {
        const socket = getSocket();
        if (socket) {
          socket.off('newNotification');
        }
      };
    }
    
    // Check if navigated from AppBar with selected notification
    if (location.state?.selectedNotification) {
      setSelectedRequest(location.state.selectedNotification);
      setDetailsDialog(true);
    }
  }, [location.state, user]);

  // Enhanced function to fetch notifications
  const fetchNotificationData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching notifications for admin');
      const response = await fetchNotifications();
      setNotifications(response || []);
      console.log(`✅ Fetched ${response.length} notifications`);
    } catch (error) {
      setError('Failed to load notifications');
      console.error('❌ Fetch notifications error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add function to mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    }
  };

  const handleApproveRequest = async (notification) => {
    try {
      setActionLoading(true);
      await approveServiceProvider(notification.data.providerId);
      await fetchNotificationData(); // Refresh notifications
      setDetailsDialog(false);
      setSelectedRequest(null);
      setError('');
    } catch (error) {
      setError('Failed to approve request');
      console.error('Approve error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRequest = async (notification) => {
    if (!rejectReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    
    try {
      setActionLoading(true);
      await rejectServiceProvider(notification.data.providerId, rejectReason.trim());
      await fetchNotificationData(); // Refresh notifications
      setDetailsDialog(false);
      setSelectedRequest(null);
      setRejectReason('');
      setError('');
    } catch (error) {
      setError('Failed to reject request');
      console.error('Reject error:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetails = (notification) => {
    console.log('🔍 Viewing notification details:', notification);
    console.log('📦 Notification data:', notification.data);
    console.log('🏷️ Notification type:', notification.type);
    setSelectedRequest(notification);
    setDetailsDialog(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#FFFFFF' }}>
      <EnhancedAppBar
        role="admin"
        user={user}
        onMenuClick={toggleSidebar}
        onLogout={handleLogout}
        title="Notifications"
        notifications={notifications.filter(n => !n.read).length}
        notificationsList={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={markAllAsRead}
      />

      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#001F3F', fontWeight: 'bold' }}>
          Platform Notifications
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {notifications.length === 0 ? (
          <NotificationCard sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#001F3F', mb: 1 }}>
              No pending notifications
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(0, 31, 63, 0.7)' }}>
              All service provider registrations have been processed.
            </Typography>
          </NotificationCard>
        ) : (
          <Grid container spacing={3}>
            {notifications.map((notification, index) => (
              <Grid item xs={12} md={6} lg={4} key={notification.id || index}>
                <NotificationCard>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {notification.type === 'newCustomer' ? (
                        <PersonIcon sx={{ color: '#001F3F', mr: 1 }} />
                      ) : notification.type === 'feedback_received' ? (
                        <FeedbackIcon sx={{ color: '#faaf00', mr: 1 }} />
                      ) : (
                        <BusinessIcon sx={{ color: '#001F3F', mr: 1 }} />
                      )}
                      <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 600 }}>
                        {notification.type === 'newCustomer' 
                          ? 'New Customer Registration' 
                          : notification.type === 'serviceProviderDeleteRequest'
                          ? 'Account Deletion Request'
                          : notification.type === 'serviceProviderUpdateRequest'
                          ? 'Profile Update Request'
                          : notification.type === 'serviceProviderPasswordRequest'
                          ? 'Password Change Request'
                          : notification.type === 'feedback_received'
                          ? 'New Feedback Received'
                          : 'New Provider Registration'}
                      </Typography>
                    </Box>

                    {notification.type === 'newCustomer' ? (
                      <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                        {notification.data?.customerName || 'Unknown Name'}
                      </Typography>
                    ) : notification.type === 'feedback_received' ? (
                      <>
                        <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                          {notification.data?.serviceName || 'Unknown Service'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {[...Array(5)].map((_, i) => (
                            <StarIcon 
                              key={i} 
                              sx={{ 
                                color: i < (notification.data?.rating || 0) ? '#faaf00' : '#e0e0e0',
                                fontSize: 20 
                              }} 
                            />
                          ))}
                          <Chip 
                            label={notification.data?.sentiment || 'Neutral'} 
                            size="small"
                            sx={{ ml: 1 }}
                            color={
                              notification.data?.sentiment === 'Positive' ? 'success' : 
                              notification.data?.sentiment === 'Negative' ? 'error' : 'default'
                            }
                          />
                        </Box>
                      </>
                    ) : (
                      <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                        {notification.data?.businessName || notification.data?.providerName || 'N/A'}
                      </Typography>
                    )}

                    <Typography variant="body2" sx={{ color: 'rgba(0, 31, 63, 0.7)', mb: 1 }}>
                      <PersonIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      {notification.type === 'newCustomer' 
                        ? notification.data?.customerName || 'N/A'
                        : notification.type === 'feedback_received'
                        ? notification.data?.customerName || 'Anonymous'
                        : notification.data?.providerName || notification.data?.businessName || 'N/A'}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'rgba(0, 31, 63, 0.7)', mb: 2 }}>
                      {notification.type === 'feedback_received' ? '🏪' : '📧'} {notification.type === 'newCustomer'
                        ? notification.data?.customerEmail || 'N/A'
                        : notification.type === 'feedback_received'
                        ? notification.data?.providerName || 'N/A'
                        : notification.data?.providerEmail || 'N/A'}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'rgba(0, 31, 63, 0.7)', mb: 2 }}>
                      📅 {new Date(notification.timestamp).toLocaleDateString()}
                    </Typography>

                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => handleViewDetails(notification)}
                      sx={{
                        borderColor: '#001F3F',
                        color: '#001F3F',
                        '&:hover': {
                          borderColor: '#001F3F',
                          background: 'rgba(0, 31, 63, 0.05)'
                        }
                      }}
                    >
                      View Details & Take Action
                    </Button>
                  </CardContent>
                </NotificationCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Enhanced Details Dialog */}
      <Dialog 
        open={detailsDialog} 
        onClose={() => setDetailsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#001F3F', color: 'white' }}>
          {selectedRequest?.type === 'newCustomer' 
            ? 'Customer Registration Details' 
            : selectedRequest?.type === 'serviceProviderDeleteRequest'
            ? 'Account Deletion Request Details'
            : selectedRequest?.type === 'serviceProviderUpdateRequest'
            ? 'Profile Update Request Details'
            : selectedRequest?.type === 'serviceProviderPasswordRequest'
            ? 'Password Change Request Details'
            : selectedRequest?.type === 'feedback_received'
            ? 'Feedback & Rating Details'
            : 'Service Provider Registration Details'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedRequest && selectedRequest.type === 'newCustomer' ? (
            // Customer registration details
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRequest.data?.customerName || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRequest.data?.customerEmail || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Typography variant="subtitle2" color="text.secondary">Registration Date</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {new Date(selectedRequest.timestamp).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
            </>
          ) : selectedRequest && selectedRequest.type === 'feedback_received' ? (
            // Feedback received details
            <>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Service</Typography>
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    {selectedRequest.data?.serviceName || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Rating</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        sx={{ 
                          color: i < (selectedRequest.data?.rating || 0) ? '#faaf00' : '#e0e0e0',
                          fontSize: 28 
                        }} 
                      />
                    ))}
                    <Typography variant="h6" sx={{ ml: 1 }}>
                      ({selectedRequest.data?.rating}/5)
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Sentiment Analysis</Typography>
                  <Chip 
                    label={selectedRequest.data?.sentiment || 'Neutral'} 
                    size="medium"
                    sx={{ mt: 0.5 }}
                    color={
                      selectedRequest.data?.sentiment === 'Positive' ? 'success' : 
                      selectedRequest.data?.sentiment === 'Negative' ? 'error' : 'default'
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRequest.data?.customerName || 'Anonymous'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Service Provider</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRequest.data?.providerName || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Feedback Preview</Typography>
                  <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 1, mt: 0.5 }}>
                    <Typography variant="body1">
                      {selectedRequest.data?.feedbackPreview || 'No feedback text available'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Received At</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {new Date(selectedRequest.timestamp).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ textAlign: 'center' }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => {
                    setDetailsDialog(false);
                    navigate('/admin/feedback');
                  }}
                >
                  View Full Feedback Details
                </Button>
              </Box>
            </>
          ) : selectedRequest && selectedRequest.type === 'serviceProviderDeleteRequest' ? (
            // Service provider deletion request details
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Business Name</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRequest.data?.businessName || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRequest.data?.providerName || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Typography variant="subtitle2" color="text.secondary">Deletion Reason</Typography>
                  <Typography variant="body1" sx={{ mb: 2, p: 2, bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 1 }}>
                    {selectedRequest.data?.reason || 'No reason provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Typography variant="subtitle2" color="text.secondary">Request Date</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRequest.data?.requestedAt ? new Date(selectedRequest.data.requestedAt).toLocaleString() : new Date(selectedRequest.timestamp).toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Rejection Reason (if rejecting)
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Please provide a detailed reason for rejection..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  sx={{ mb: 2 }}
                />
              </Box>
            </>
          ) : selectedRequest && (
            // Service provider registration details
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Business Name</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRequest.data?.businessName || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRequest.data?.providerName || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRequest.data?.providerEmail || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Mobile</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRequest.data?.mobileNumber || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Business Type</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRequest.data?.businessType || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">City</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRequest.data?.city || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              {selectedRequest?.type !== 'newCustomer' && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Rejection Reason (if rejecting)
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Please provide a detailed reason for rejection..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={() => setDetailsDialog(false)} 
            variant="outlined"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default AdminNotifications;
