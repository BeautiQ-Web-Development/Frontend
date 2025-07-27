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
  TextField
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Person as PersonIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from '../../components/footer';
import AdminSidebar from '../../components/AdminSidebar';
import EnhancedAppBar from '../../components/EnhancedAppBar';
import { fetchNotifications, approveServiceProvider, rejectServiceProvider } from '../../services/notification';
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
    
    // Check if navigated from AppBar with selected notification
    if (location.state?.selectedNotification) {
      setSelectedRequest(location.state.selectedNotification);
      setDetailsDialog(true);
    }
  }, [location.state]);

  const fetchNotificationData = async () => {
    try {
      setLoading(true);
      const response = await fetchNotifications();
      setNotifications(response || []);
    } catch (error) {
      setError('Failed to load notifications');
      console.error('Fetch notifications error:', error);
    } finally {
      setLoading(false);
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
        notifications={notifications.length}
        notificationsList={notifications}
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
                      <BusinessIcon sx={{ color: '#001F3F', mr: 1 }} />
                      <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 600 }}>
                        New Provider Registration
                      </Typography>
                    </Box>

                    <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                      {notification.data?.businessName || 'Unknown Business'}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'rgba(0, 31, 63, 0.7)', mb: 1 }}>
                      <PersonIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      {notification.data?.fullName || 'Unknown Name'}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'rgba(0, 31, 63, 0.7)', mb: 2 }}>
                      📧 {notification.data?.emailAddress || 'No email'}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'rgba(0, 31, 63, 0.7)', mb: 2 }}>
                      📅 {new Date(notification.timestamp).toLocaleDateString()}
                    </Typography>

                    <Chip 
                      label="Pending Approval" 
                      color="warning" 
                      size="small" 
                      sx={{ mb: 2 }}
                    />

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
          Service Provider Registration Details
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedRequest && (
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
                    {selectedRequest.data?.fullName || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedRequest.data?.emailAddress || 'N/A'}
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
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button 
            onClick={() => setDetailsDialog(false)} 
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleRejectRequest(selectedRequest)}
            variant="contained"
            color="error"
            startIcon={<RejectIcon />}
            disabled={actionLoading || !rejectReason.trim()}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Reject & Email'}
          </Button>
          <Button
            onClick={() => handleApproveRequest(selectedRequest)}
            variant="contained"
            color="success"
            startIcon={<ApproveIcon />}
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Approve & Email'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
};

export default AdminNotifications;
