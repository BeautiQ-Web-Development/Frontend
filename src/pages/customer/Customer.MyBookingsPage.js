import React, { useState, useEffect } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import TimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StoreIcon from '@mui/icons-material/Store';
import MoneyIcon from '@mui/icons-material/AttachMoney';
import EmailIcon from '@mui/icons-material/Email';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import CustomerSidebar from '../../components/CustomerSidebar';
import EnhancedAppBar from '../../components/EnhancedAppBar';
import NotificationBell from '../../components/NotificationBell';
import Footer from '../../components/footer';

const CustomerMyBookingsPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { user, logout } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch bookings on component mount
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/bookings/customer`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setBookings(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load your bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  const handleReschedule = () => {
    // Navigate to booking page for rescheduling without additional payment
    setDetailsOpen(false);
    navigate(
      `/customer/book-service/${selectedBooking.serviceId}?bookingId=${selectedBooking._id}`
    );
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'pending':
        return <Chip 
          icon={<HourglassEmptyIcon />} 
          label="Pending" 
          color="warning" 
          size="small" 
        />;
      case 'confirmed':
        return <Chip 
          icon={<CheckCircleIcon />} 
          label="Confirmed" 
          color="primary" 
          size="small" 
        />;
      case 'completed':
        return <Chip 
          icon={<CheckCircleIcon />} 
          label="Completed" 
          color="success" 
          size="small" 
        />;
      case 'cancelled':
        return <Chip 
          icon={<CancelIcon />} 
          label="Cancelled" 
          color="error" 
          size="small" 
        />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <EnhancedAppBar
        title="My Bookings"
        role="customer"
        user={user}
        onMenuClick={() => setSidebarOpen(true)}
        onLogout={handleLogout}
        notifications={unreadCount}
        notificationsList={notifications}
      />
      
      <CustomerSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: '#f5f5f5',
          p: { xs: 2, md: 3 },
          minHeight: '100vh',
          pt: '80px', // Account for AppBar height
          width: '100%'
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4" fontWeight={600}>
              My Bookings
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => {
                console.log('Navigating to browse services');
                navigate('/customer/browse-services');
              }}
              sx={{
                backgroundColor: '#001F3F',
                '&:hover': { backgroundColor: '#003366' },
                fontWeight: 'bold'
              }}
            >
              Book New Service
            </Button>
          </Box>
          
          {/* Error message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {/* Loading state */}
          {loading && (
            <Box display="flex" justifyContent="center" my={5}>
              <CircularProgress />
            </Box>
          )}
          
          {/* No bookings message */}
          {!loading && bookings.length === 0 && (
            <Paper
              elevation={2}
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 2,
                backgroundColor: 'white',
              }}
            >
              <Box mb={2}>
                <EventIcon sx={{ fontSize: 60, color: 'primary.main', opacity: 0.7 }} />
              </Box>
              <Typography variant="h5" gutterBottom>
                No Bookings Yet
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                You don't have any bookings at the moment.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/customer/browse-services')}
                sx={{ mt: 2 }}
              >
                Browse Services
              </Button>
            </Paper>
          )}
          
          {/* Bookings grid */}
          {!loading && bookings.length > 0 && (
            <Grid container spacing={3}>
              {bookings.map((booking) => (
                <Grid item xs={12} sm={6} md={4} key={booking._id}>
                  <Card 
                    elevation={3}
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 2,
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight={600} noWrap>
                          {booking.serviceName}
                        </Typography>
                        {getStatusChip(booking.status)}
                      </Box>
                      
                      <Divider sx={{ my: 1.5 }} />
                      
                      <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EventIcon fontSize="small" color="primary" />
                        <Typography variant="body2">
                          {formatDate(booking.bookingDate)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TimeIcon fontSize="small" color="primary" />
                        <Typography variant="body2">
                          {booking.bookingTime}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        {booking.location === 'home' ? (
                          <LocationOnIcon fontSize="small" color="primary" />
                        ) : (
                          <StoreIcon fontSize="small" color="primary" />
                        )}
                        <Typography variant="body2">
                          {booking.location === 'home' 
                            ? 'Home Service' 
                            : booking.location === 'salon' 
                              ? 'At Salon' 
                              : booking.location === 'studio' 
                                ? 'At Studio' 
                                : 'At Salon/Studio'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MoneyIcon fontSize="small" color="primary" />
                        <Typography variant="body2">
                          ${booking.totalPrice.toFixed(2)}
                        </Typography>
                      </Box>
                    </CardContent>
                    
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button 
                        fullWidth 
                        variant="outlined"
                        onClick={() => handleViewDetails(booking)}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
      
      <Footer />
      
      {/* Booking details dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedBooking && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
              <Box>
                Booking Details
                {getStatusChip(selectedBooking.status)}
              </Box>
              <IconButton onClick={() => setDetailsOpen(false)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Service Information
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {selectedBooking.serviceName}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Type: {selectedBooking.serviceType}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventIcon color="primary" fontSize="small" />
                    <Typography>
                      {formatDate(selectedBooking.bookingDate)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimeIcon color="primary" fontSize="small" />
                    <Typography>
                      {selectedBooking.bookingTime}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MoneyIcon color="primary" fontSize="small" />
                    <Typography>
                      ${selectedBooking.totalPrice.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Provider Information
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {selectedBooking.providerName || 'Service Provider'}
                    </Typography>
                    {selectedBooking.providerEmail && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon color="primary" fontSize="small" />
                        <Typography variant="body2">
                          {selectedBooking.providerEmail}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Location
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {selectedBooking.location === 'home' ? (
                        <LocationOnIcon color="primary" fontSize="small" />
                      ) : (
                        <StoreIcon color="primary" fontSize="small" />
                      )}
                      <Typography>
                        {selectedBooking.location === 'home' ? 'Home Service' : 'At Salon/Studio'}
                      </Typography>
                    </Box>
                    
                    {selectedBooking.location === 'home' && selectedBooking.address && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        Address: {selectedBooking.address}
                      </Typography>
                    )}
                  </Box>
                  
                  {selectedBooking.notes && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Notes
                      </Typography>
                      <Typography variant="body2">
                        {selectedBooking.notes}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
              {selectedBooking.status === 'pending' || selectedBooking.status === 'confirmed' ? (
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={handleReschedule}
                >
                  Reschedule
                </Button>
              ) : null}
            </DialogActions>
          </>
        )}
      </Dialog>
      
    </Box>
  );
};

export default CustomerMyBookingsPage;
