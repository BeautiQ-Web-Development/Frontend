import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress,
  TextField, Grid, IconButton, TablePagination, Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Event as EventIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import ServiceProviderSidebar from '../../components/ServiceProviderSidebar';
import EnhancedAppBar from '../../components/EnhancedAppBar';
import Footer from '../../components/footer';

const ServiceProviderBookingsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/bookings/provider`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings. Please try again later.');
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setDetailsOpen(true);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/bookings/${bookingId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Update the booking status in the local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: newStatus } 
            : booking
        )
      );
      
      // If we're showing details of this booking, update that too
      if (selectedBooking && selectedBooking._id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError('Failed to update booking status. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Filter bookings based on status
  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === statusFilter);

  // Apply pagination
  const paginatedBookings = filteredBookings.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Status chip component with appropriate color
  const StatusChip = ({ status }) => {
    let color, icon;
    
    switch (status) {
      case 'confirmed':
        color = 'primary';
        icon = <CheckCircleIcon fontSize="small" />;
        break;
      case 'completed':
        color = 'success';
        icon = <CheckCircleIcon fontSize="small" />;
        break;
      case 'cancelled':
        color = 'error';
        icon = <CancelIcon fontSize="small" />;
        break;
      default:
        color = 'warning';
        icon = null;
    }
    
    return (
      <Chip
        icon={icon}
        label={status.charAt(0).toUpperCase() + status.slice(1)}
        color={color}
        size="small"
        variant="outlined"
      />
    );
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <EnhancedAppBar
        title="My Bookings"
        role="serviceProvider"
        user={user}
        onMenuClick={() => setSidebarOpen(true)}
        onLogout={handleLogout}
        notifications={unreadCount}
        notificationsList={notifications}
      />

      <ServiceProviderSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      <Box component="main" sx={{ flexGrow: 1, p: 2, pt: '80px', bgcolor: '#f5f5f5' }}>
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, color: '#052633ff' }}>
              My Bookings
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Filter buttons */}
            <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button 
                variant={statusFilter === 'all' ? 'contained' : 'outlined'} 
                onClick={() => setStatusFilter('all')}
                size="small"
              >
                All
              </Button>
              <Button 
                variant={statusFilter === 'confirmed' ? 'contained' : 'outlined'} 
                onClick={() => setStatusFilter('confirmed')}
                size="small"
              >
                Confirmed
              </Button>
              <Button 
                variant={statusFilter === 'completed' ? 'contained' : 'outlined'} 
                onClick={() => setStatusFilter('completed')}
                size="small"
              >
                Completed
              </Button>
              <Button 
                variant={statusFilter === 'cancelled' ? 'contained' : 'outlined'} 
                onClick={() => setStatusFilter('cancelled')}
                size="small"
                color="error"
              >
                Cancelled
              </Button>
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : bookings.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="textSecondary">
                  No bookings found
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  When customers book your services, they'll appear here
                </Typography>
              </Box>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Service</TableCell>
                        <TableCell>Customer</TableCell>
                        <TableCell>Date & Time</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedBookings.map((booking) => (
                        <TableRow key={booking._id}>
                          <TableCell>{booking.serviceName}</TableCell>
                          <TableCell>{booking.customerName || 'Customer'}</TableCell>
                          <TableCell>
                            {formatDate(booking.bookingDate)}
                            <br />
                            <Typography variant="caption" color="textSecondary">
                              {booking.bookingTime}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {booking.location === 'home' ? 'Home Service' : 'At Salon'}
                          </TableCell>
                          <TableCell>${booking.totalPrice.toFixed(2)}</TableCell>
                          <TableCell>
                            <StatusChip status={booking.status} />
                          </TableCell>
                          <TableCell align="center">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleViewDetails(booking)}
                            >
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredBookings.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            )}
          </Paper>
        </Container>

        {/* Booking Details Dialog */}
        <Dialog
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          maxWidth="md"
          fullWidth
        >
          {selectedBooking && (
            <>
              <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  Booking Details
                  <Chip
                    label={selectedBooking.status.toUpperCase()}
                    color={
                      selectedBooking.status === 'confirmed' ? 'primary' :
                      selectedBooking.status === 'completed' ? 'success' :
                      selectedBooking.status === 'cancelled' ? 'error' :
                      'default'
                    }
                    size="small"
                    sx={{ ml: 1 }}
                  />
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
                        Customer Information
                      </Typography>
                      <Typography variant="h6" gutterBottom>
                        {selectedBooking.customerName || 'Customer'}
                      </Typography>
                      {selectedBooking.customerEmail && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon color="primary" fontSize="small" />
                          <Typography variant="body2">
                            {selectedBooking.customerEmail}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon color="primary" fontSize="small" />
                      <Typography>
                        {selectedBooking.location === 'home' ? 'Home Service' : 'At Salon/Studio'}
                      </Typography>
                    </Box>

                    {selectedBooking.location === 'home' && selectedBooking.address && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Service Address
                        </Typography>
                        <Typography variant="body2">
                          {selectedBooking.address}
                        </Typography>
                      </Box>
                    )}

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
              <DialogActions>
                {selectedBooking.status === 'confirmed' && (
                  <>
                    <Button 
                      onClick={() => handleStatusChange(selectedBooking._id, 'completed')}
                      color="success"
                      variant="contained"
                    >
                      Mark as Completed
                    </Button>
                    <Button 
                      onClick={() => handleStatusChange(selectedBooking._id, 'cancelled')}
                      color="error"
                    >
                      Cancel Booking
                    </Button>
                  </>
                )}
                <Button onClick={() => setDetailsOpen(false)}>
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Box>

      <Footer />
    </Box>
  );
};

export default ServiceProviderBookingsPage;
