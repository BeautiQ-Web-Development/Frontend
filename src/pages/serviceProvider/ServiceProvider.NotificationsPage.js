import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, List, ListItem, ListItemText, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, Paper } from '@mui/material';
import { useNotifications } from '../../context/NotificationContext';
import Footer from '../../components/footer';
import ServiceProviderSidebar from '../../components/ServiceProviderSidebar';
import EnhancedAppBar from '../../components/EnhancedAppBar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import CircleIcon from '@mui/icons-material/Circle';

const ServiceProviderNotificationsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, refreshNotifications } = useNotifications();
  const [selected, setSelected] = useState(null);

  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  useEffect(() => {
    refreshNotifications(true);
  }, [refreshNotifications]);

  const handleLogout = () => { logout(); navigate('/service-provider-login'); };
  const handleMenu = () => setSidebarOpen(v => !v);
  const handleView = (notif) => {
    console.log('Notification clicked:', notif);
    console.log('Notification payload data:', notif.data);
    setSelected(notif);
    if (!notif.read) markAsRead(notif._id || notif.id);
  };
  const handleClose = () => setSelected(null);
  const handleRefresh = () => refreshNotifications(true);
  const handleMarkAllRead = () => markAllAsRead();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <EnhancedAppBar
        role="serviceProvider"
        user={user}
        onMenuClick={handleMenu}
        onLogout={handleLogout}
        title="Notifications"
        notifications={unreadCount}
        notificationsList={safeNotifications}
      />
      <Box sx={{ display: 'flex', flexGrow: 1 }}>
        <ServiceProviderSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={user}
        />
        <Box component="main" sx={{ flexGrow: 1, p: 3, pt: '80px', bgcolor: '#f5f5f5' }}>
          <Container maxWidth="lg">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>Provider Notifications</Typography>
              <Box>
                <Button onClick={handleRefresh} disabled={loading} variant="outlined" size="small" sx={{ mr: 1 }}>
                  {loading ? 'Loading...' : 'Refresh'}
                </Button>
                {safeNotifications.length > 0 && unreadCount > 0 && (
                  <Button onClick={handleMarkAllRead} disabled={loading} variant="contained" size="small">
                    Mark all as read ({unreadCount})
                  </Button>
                )}
              </Box>
            </Box>
            <Paper sx={{ p: 2, bgcolor: '#fff', borderRadius: 2, minHeight: 400 }}>
              {loading ? (
                <Box sx={{ textAlign: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : safeNotifications.length === 0 ? (
                <Box sx={{ textAlign: 'center', p: 4 }}>
                  <Typography variant="h6" color="textSecondary">No notifications</Typography>
                </Box>
              ) : (
                <List disablePadding>
                  {safeNotifications.map((notif, idx) => (
                    <React.Fragment key={notif._id || notif.id || idx}>
                      <ListItem button onClick={() => handleView(notif)} sx={{ bgcolor: !notif.read ? 'rgba(0,123,255,0.1)' : 'transparent' }}>
                        <ListItemText
                          primary={notif.message || 'No message'}
                          secondary={new Date(notif.timestamp).toLocaleString()}
                        />
                        {!notif.read ? <CircleIcon color="primary" fontSize="small" /> : <DoneAllIcon color="action" fontSize="small" />}
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </Paper>
          </Container>
        </Box>
      </Box>
      <Footer />
      {/* Details dialog for selected notification */}
      {selected && (
        <Dialog open onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selected.type === 'serviceApproved' ? 'Service Approval Details' : 'Booking Details'}
          </DialogTitle>
          <DialogContent dividers>
            {selected.type === 'serviceApproved' ? (
              // Service Approved notification - show only Service Name and Approved Date/Time
              <>
                <Typography gutterBottom>
                  Service Name: {selected.data?.serviceName}
                </Typography>
                <Typography gutterBottom>
                  Approved Date & Time: {new Date(selected.timestamp).toLocaleString()}
                </Typography>
              </>
            ) : (
              // Booking notification - show Customer ID, Email, Service Name, Date and Time
              <>
                <Typography gutterBottom>
                  Customer ID: {selected.data?.customerIdNumber || selected.data?.customerId}
                </Typography>
                <Typography gutterBottom>
                  Customer Email: {selected.data?.customerEmail}
                </Typography>
                <Typography gutterBottom>
                  Service: {selected.data?.serviceName}
                </Typography>
                <Typography gutterBottom>
                  Date: {selected.data?.bookingDate ? new Date(selected.data.bookingDate).toLocaleDateString() : ''}
                </Typography>
                <Typography gutterBottom>
                  Time: {selected.data?.bookingTime || ''}
                </Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default ServiceProviderNotificationsPage;
