//pages/dashboards/serviceProviderDashboardPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Fab
} from '@mui/material';
import {
  Store as StoreIcon,
  Person as PersonIcon,
  EventAvailable as EventIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Business as BusinessIcon,
  Build as ServiceIcon,
  Assignment as PackageIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Pending as PendingIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/footer';
import BookingHeatmapChart from '../../components/BookingHeatmapChart';
import RevenueChart from '../../components/RevenueChart';
import ServicePerformanceChart from '../../components/ServicePerformanceChart';
import ServiceProviderSidebar from '../../components/ServiceProviderSidebar';
import api from '../../services/auth';
import { 
  fetchNotifications, 
  markAsRead, 
  markAllAsRead, 
  connectToSocket, 
  getSocket 
} from '../../services/notification';
import { styled } from '@mui/system';
import EnhancedAppBar from '../../components/EnhancedAppBar';

const ProviderDashboardContainer = styled(Box)(({ theme }) => ({
  background: '#FFFFFF',
  minHeight: '100vh',
}));

const StudioCard = styled(Card)(({ theme }) => ({
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

const ServiceProviderDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [serviceCount, setServiceCount] = useState(0);
  const [packageCount, setPackageCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [packages, setPackages] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [packageDialogOpen, setPackageDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [resignationDialogOpen, setResignationDialogOpen] = useState(false);
  const [heatmapData, setHeatmapData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [servicePerformanceData, setServicePerformanceData] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState({
    weeklyBookings: 0,
    monthlyRevenue: 0,
    avgRating: 0,
    completionRate: 0
  });
  const [notificationsList, setNotificationsList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [packageForm, setPackageForm] = useState({
    packageName: '',
    packageDescription: '',
    totalPrice: '',
    totalDuration: '',
    packageType: '',
    includedServices: [],
    packageLocation: 'both',
    customNotes: '',
    preparationRequired: ''
  });

  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchPackages();
    fetchServices();
    fetchEnhancedAnalytics();
    // Notifications disabled on this dashboard
  }, []);


  const loadNotifications = async () => {
    try {
      console.log('🔄 Loading notifications for service provider');
      const all = await fetchNotifications();
      // Filter out registration notifications for service providers
      const notifications = (user.role === 'serviceProvider')
        ? all.filter(n => n.type !== 'newServiceProvider')
        : all;
      setNotificationsList(notifications);
      
      // Calculate unread count
      const unread = notifications.filter(n => !n.read).length;
      setUnreadCount(unread);
      
      console.log(`✅ Loaded ${notifications.length} notifications (${unread} unread)`);
    } catch (error) {
      console.error('❌ Failed to load notifications:', error);
    }
  };
  
  // Handler to mark a single notification as read from AppBar
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotificationsList(prev =>
        prev.map(n =>
          (n._id === notificationId || n.id === notificationId)
            ? { ...n, read: true }
            : n
        )
      );
      setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Handler to mark all notifications as read from AppBar
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const fetchEnhancedAnalytics = async () => {
    try {
      // Mock enhanced analytics data - replace with real API calls
      
      // Booking heatmap data (7 days x 24 hours)
      const mockHeatmapData = Array.from({ length: 7 }, (_, dayIndex) => ({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex],
        values: Array.from({ length: 24 }, (_, hour) => {
          // Simulate realistic booking patterns
          let bookings = 0;
          if (dayIndex >= 1 && dayIndex <= 5) { // Weekdays
            if (hour >= 9 && hour <= 18) {
              bookings = Math.floor(Math.random() * 8) + 1;
            } else if (hour >= 19 && hour <= 21) {
              bookings = Math.floor(Math.random() * 5) + 1;
            }
          } else { // Weekends
            if (hour >= 10 && hour <= 20) {
              bookings = Math.floor(Math.random() * 12) + 2;
            }
          }
          return bookings;
        })
      }));
      setHeatmapData(mockHeatmapData);

      // Revenue data for the last 12 months
      const mockRevenueData = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        return {
          name: date.toLocaleDateString('en-US', { month: 'short' }),
          revenue: Math.floor(Math.random() * 50000) + 20000 + (i * 2000) // Growing trend
        };
      });
      setRevenueData(mockRevenueData);

      // Service performance data
      const mockServicePerformance = [
        { name: 'Hair Styling', bookings: 45, rating: 4.8, revenue: 180000 },
        { name: 'Makeup', bookings: 32, rating: 4.6, revenue: 128000 },
        { name: 'Manicure', bookings: 28, rating: 4.7, revenue: 84000 },
        { name: 'Facial', bookings: 22, rating: 4.9, revenue: 110000 },
        { name: 'Hair Color', bookings: 18, rating: 4.5, revenue: 144000 }
      ];
      setServicePerformanceData(mockServicePerformance);

      // Dashboard metrics
      setDashboardMetrics({
        weeklyBookings: 23,
        monthlyRevenue: 146000,
        avgRating: 4.7,
        completionRate: 94
      });

    } catch (error) {
      console.error('Error fetching enhanced analytics:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fetch services count (provider endpoint)
      const servicesResponse = await api.get(
        '/services/my-services'
      );
      if (servicesResponse.data.success) {
        setServiceCount(servicesResponse.data.pagination?.totalServices || 0);
      }

      // Fetch bookings count (provider endpoint)
      const bookingsResponse = await api.get(
        '/bookings'  // adjust if you have a dedicated bookings endpoint
      );
      if (bookingsResponse.data.success) {
        setBookingCount(bookingsResponse.data.bookings?.length || 0);
      }

      // Fetch pending approvals (provider-side count; you may need to add a custom provider route)
      const approvalsResponse = await api.get(
        '/services/my-services?status=pending_approval' // Filter by pending status
      );
      if (approvalsResponse.data.success) {
        setPendingApprovals(approvalsResponse.data.pagination?.totalServices || 0);
      }

      // Fetch revenue data via relative URL
      const revenueResponse = await api.get(
        '/api/analytics/monthly-revenue',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (revenueResponse.data.success) {
        setMonthlyRevenue(revenueResponse.data.revenue || 0);
      }
    } catch {
      // swallow all errors (403 etc)
    }
  };

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await api.get(
        '/packages/provider'
      );
      
      if (response.data.success) {
        setPackages(response.data.data || []);
        setPackageCount(response.data.data?.length || 0);
      }
    } catch {
      // swallow
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await api.get('/services/my-services');
      if (res.data.success) {
        // only approved by admin
        setServices(res.data.data.filter(s => s.status === 'approved') || []);
      }
    } catch {}
  };

  const handlePackageSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = editingPackage
        ? `/api/serviceprovider/packages/${editingPackage._id}`
        : '/api/serviceprovider/packages';
      
      const method = editingPackage ? 'put' : 'post';
      
      const response = await api[method](url, packageForm, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setPackageDialogOpen(false);
        setEditingPackage(null);
        setPackageForm({
          packageName: '',
          packageDescription: '',
          totalPrice: '',
          totalDuration: '',
          packageType: '',
          includedServices: [],
          packageLocation: 'both',
          customNotes: '',
          preparationRequired: ''
        });
        fetchPackages();
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Error saving package:', err);
      setError('Failed to save package');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePackage = async (packageId) => {
    if (!window.confirm('Are you sure you want to request deletion of this package?')) {
      return;
    }
    
    try {
      console.log('Requesting package deletion from dashboard for ID:', packageId);
      
      // Use the packages API endpoint instead of serviceprovider endpoint
      const response = await api.delete(`/packages/${packageId}`, {
        data: {} // Include data object for proper request body
      });
      
      console.log('Dashboard package deletion response:', response.data);
      
      if (response.data.success) {
        setError(''); // Clear any existing errors
        alert('Package deletion request submitted for admin approval');
        fetchPackages();
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Dashboard package deletion error:', err);
      if (err.response?.status === 409) {
        setError('Package has pending changes. Cannot submit deletion request.');
      } else {
        setError(err.response?.data?.message || 'Failed to submit deletion request');
      }
    }
  };

  const handleResignation = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.post('/api/serviceprovider/auth/request-resignation', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResignationDialogOpen(false);
      alert('Resignation request submitted. Admin approval required.');
    } catch (err) {
      console.error('Error submitting resignation:', err);
      setError('Failed to submit resignation request');
    }
  };

  const openAddPackageDialog = () => {
    setEditingPackage(null);
    setPackageForm({
      packageName: '',
      packageDescription: '',
      totalPrice: '',
      totalDuration: '',
      packageType: '',
      includedServices: [],
      packageLocation: 'both',
      customNotes: '',
      preparationRequired: ''
    });
    setPackageDialogOpen(true);
  };

  const openEditPackageDialog = (pkg) => {
    setEditingPackage(pkg);
    setPackageForm({
      packageName: pkg.packageName || '',
      packageDescription: pkg.packageDescription || '',
      totalPrice: pkg.totalPrice || '',
      totalDuration: pkg.totalDuration || '',
      packageType: pkg.packageType || '',
      includedServices: pkg.includedServices || [],
      packageLocation: pkg.packageLocation || 'both',
      customNotes: pkg.customNotes || '',
      preparationRequired: pkg.preparationRequired || ''
    });
    setPackageDialogOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/service-provider-login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <ProviderDashboardContainer>
      <EnhancedAppBar
        role="serviceProvider"
        user={user}
        onMenuClick={toggleSidebar}
        onLogout={handleLogout}
        title="Provider Dashboard"
        notifications={unreadCount}
        notificationsList={notificationsList}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      <ServiceProviderSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onResignation={() => setResignationDialogOpen(true)}
      />

      <Container component="main" sx={{ py: 3, bgcolor: '#FFFFFF' }}>
        {/* Clean Welcome Section */}
        <StudioCard sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h5" sx={{ 
                color: '#001F3F',
                fontWeight: 600,
                mb: 1,
                fontSize: '1.4rem'
              }}>
                Welcome, {user?.businessName || user?.fullName}
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'rgba(0, 31, 63, 0.7)', 
                fontWeight: 400,
                fontSize: '0.9rem'
              }}>
                Manage your beauty services and track performance
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 1.5, 
                    background: 'rgba(0, 31, 63, 0.03)',
                    borderRadius: 2,
                    border: '1px solid rgba(0, 31, 63, 0.05)'
                  }}>
                    <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 600, fontSize: '1.2rem' }}>
                      {dashboardMetrics.weeklyBookings}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(0, 31, 63, 0.7)', fontSize: '0.7rem' }}>
                      This Week
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 1.5, 
                    background: 'rgba(0, 31, 63, 0.03)',
                    borderRadius: 2,
                    border: '1px solid rgba(0, 31, 63, 0.05)'
                  }}>
                    <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 600, fontSize: '1.2rem' }}>
                      {dashboardMetrics.avgRating}★
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(0, 31, 63, 0.7)', fontSize: '0.7rem' }}>
                      Rating
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </StudioCard>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Clean Analytics Section */}
        {!location.pathname.includes('/packages') && !location.pathname.includes('/services') && (
          <>
            {/* Clean Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StudioCard sx={{ height: 120 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ color: '#001F3F', fontWeight: 600, mb: 0.5 }}>
                        {serviceCount}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(0, 31, 63, 0.7)', fontSize: '0.8rem' }}>
                        My Services
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(0, 31, 63, 0.5)', fontSize: '0.7rem' }}>
                        +2 this month
                      </Typography>
                    </Box>
                  </CardContent>
                </StudioCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <StudioCard sx={{ height: 120 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ color: '#001F3F', fontWeight: 600, mb: 0.5 }}>
                        {packageCount}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(0, 31, 63, 0.7)', fontSize: '0.8rem' }}>
                        Packages
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(0, 31, 63, 0.5)', fontSize: '0.7rem' }}>
                        {packageCount > 0 ? 'Active' : 'Create first'}
                      </Typography>
                    </Box>
                  </CardContent>
                </StudioCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <StudioCard sx={{ height: 120 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ color: '#001F3F', fontWeight: 600, mb: 0.5 }}>
                        {bookingCount}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(0, 31, 63, 0.7)', fontSize: '0.8rem' }}>
                        Bookings
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(0, 31, 63, 0.5)', fontSize: '0.7rem' }}>
                        {dashboardMetrics.completionRate}% completion
                      </Typography>
                    </Box>
                  </CardContent>
                </StudioCard>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <StudioCard sx={{ height: 120 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h5" sx={{ color: '#001F3F', fontWeight: 600, mb: 0.5 }}>
                        LKR {(dashboardMetrics.monthlyRevenue / 1000).toFixed(0)}K
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(0, 31, 63, 0.7)', fontSize: '0.8rem' }}>
                        Revenue
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(0, 31, 63, 0.5)', fontSize: '0.7rem' }}>
                        This month
                      </Typography>
                    </Box>
                  </CardContent>
                </StudioCard>
              </Grid>
            </Grid>

            {/* Clean Charts */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <BookingHeatmapChart 
                  data={heatmapData} 
                  title="Booking Utilization Heatmap"
                  loading={loading}
                />
              </Grid>

              <Grid item xs={12} lg={8}>
                <RevenueChart 
                  data={revenueData}
                  title="Monthly Revenue Trend"
                  type="area"
                  loading={loading}
                />
              </Grid>

              <Grid item xs={12} lg={4}>
                <ServicePerformanceChart 
                  data={servicePerformanceData}
                  title="Service Performance"
                  type="pie"
                  loading={loading}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <ServicePerformanceChart 
                  data={servicePerformanceData}
                  title="Detailed Service Analysis"
                  type="bar"
                  loading={loading}
                />
              </Grid>
            </Grid>
          </>
        )}

        {/* PACKAGES MANAGEMENT */}
        {location.pathname.endsWith('/packages') && (
          <>
            <Typography variant="h5" sx={{ mb:2 }}>My Packages</Typography>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Target Audience</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {packages
                    .filter(p => p.status === 'approved')
                    .map(pkg => (
                      <TableRow
                        key={pkg._id}
                        hover
                        selected={selectedPackageId === pkg._id}
                        onClick={() => setSelectedPackageId(pkg._id)}
                      >
                        <TableCell>{pkg.packageName}</TableCell>
                        <TableCell>${pkg.totalPrice}</TableCell>
                        <TableCell>{pkg.totalDuration} min</TableCell>
                        <TableCell>{pkg.packageType}</TableCell>
                        <TableCell>{pkg.targetAudience}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => openEditPackageDialog(pkg)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => handleDeletePackage(pkg._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ '& > *': { mr: 1 } }}>
              <Button variant="contained" onClick={openAddPackageDialog}>Add New Package</Button>
              <Button
                variant="outlined"
                disabled={!selectedPackageId}
                onClick={() => openEditPackageDialog(packages.find(p => p._id === selectedPackageId))}
              >
                Edit Selected
              </Button>
              <Button
                variant="outlined"
                color="error"
                disabled={!selectedPackageId}
                onClick={() => handleDeletePackage(selectedPackageId)}
              >
                Delete Selected
              </Button>
            </Box>
          </>
        )}

        {/* SERVICES MANAGEMENT */}
        {location.pathname.endsWith('/services') && (
          <>
            <Typography variant="h5" sx={{ mb:2 }}>My Services</Typography>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Service</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.map(svc => (
                    <TableRow
                      key={svc._id}
                      hover
                      selected={selectedServiceId === svc._id}
                      onClick={() => setSelectedServiceId(svc._id)}
                    >
                      <TableCell>{svc.name}</TableCell>
                      <TableCell>{svc.category}</TableCell>
                      <TableCell>${svc.price}</TableCell>
                      <TableCell align="right">
                        <IconButton /* implement openEditServiceDialog */>
                          <EditIcon />
                        </IconButton>
                        <IconButton /* implement handleDeleteService */>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ '& > *': { mr: 1 } }}>
              <Button variant="contained">{/* openAddServiceDialog */}Add New Service</Button>
              <Button variant="outlined" disabled={!selectedServiceId}>{/* openEditServiceDialog */}Edit Selected</Button>
              <Button variant="outlined" color="error" disabled={!selectedServiceId}>{/* handleDeleteService */}Delete Selected</Button>
            </Box>
          </>
        )}

        {/* Clean Pending Approvals Alert */}
        {pendingApprovals > 0 && (
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              background: 'rgba(255, 193, 7, 0.1)',
              border: '1px solid rgba(255, 193, 7, 0.2)',
              color: '#001F3F'
            }}
            icon={<PendingIcon />}
          >
            <Typography variant="body2" sx={{ color: '#001F3F', fontWeight: 500, fontSize: '0.85rem' }}>
              You have {pendingApprovals} item(s) pending admin approval
            </Typography>
          </Alert>
        )}
      </Container>

      {/* Package Dialog */}
      <Dialog open={packageDialogOpen} onClose={() => setPackageDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingPackage ? 'Edit Package' : 'Add New Package'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Package Name"
                value={packageForm.packageName}
                onChange={(e) => setPackageForm(prev => ({ ...prev, packageName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={packageForm.totalPrice}
                onChange={(e) => setPackageForm(prev => ({ ...prev, totalPrice: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={packageForm.totalDuration}
                onChange={(e) => setPackageForm(prev => ({ ...prev, totalDuration: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Service Type</InputLabel>
                <Select
                  value={packageForm.packageType}
                  onChange={(e) => setPackageForm(prev => ({ ...prev, packageType: e.target.value }))}
                >
                  <MenuItem value="hair">Hair</MenuItem>
                  <MenuItem value="makeup">Makeup</MenuItem>
                  <MenuItem value="skincare">Skincare</MenuItem>
                  <MenuItem value="nails">Nails</MenuItem>
                  <MenuItem value="massage">Massage</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={packageForm.packageDescription}
                onChange={(e) => setPackageForm(prev => ({ ...prev, packageDescription: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Included Services (comma separated)"
                value={Array.isArray(packageForm.includedServices) ? packageForm.includedServices.map(s => s.service).join(', ') : ''}
                onChange={(e) => setPackageForm(prev => ({ ...prev, includedServices: e.target.value.split(',').map(s => ({ service: s.trim() })) }))}
                placeholder="e.g., Hair wash, Cut, Blow dry"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPackageDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handlePackageSubmit} 
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : (editingPackage ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Resignation Dialog */}
      <Dialog open={resignationDialogOpen} onClose={() => setResignationDialogOpen(false)}>
        <DialogTitle>Request Account Resignation</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to resign from the platform? This action requires admin approval 
            and you must complete all pending appointments first.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResignationDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleResignation} color="error" variant="contained">
            Submit Resignation Request
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </ProviderDashboardContainer>
  );
};

export default ServiceProviderDashboard;
