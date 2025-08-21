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
  Divider,
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
  Pending as PendingIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/footer';
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
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

// Modify the styled components to use the imported Box and Card
const ProviderDashboardContainer = styled('div')(({ theme }) => ({
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
  
  // Updated metrics states
  const [appointmentsPerDayData, setAppointmentsPerDayData] = useState([]);
  const [serviceUpdateRequestsCount, setServiceUpdateRequestsCount] = useState(0);
  const [deleteRequestsCount, setDeleteRequestsCount] = useState(0);
  const [activeServicesCount, setActiveServicesCount] = useState(0);
  const [deletedServicesCount, setDeletedServicesCount] = useState(0);
  
  // Description panel state
  const [descriptionPanel, setDescriptionPanel] = useState({
    open: false,
    title: '',
    description: ''
  });
  
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
    fetchProviderMetrics();
    // Notifications disabled on this dashboard
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/service-provider/dashboard-data');
      
      if (response.data.success) {
        const data = response.data;
        setServiceCount(data.serviceCount || 0);
        setPackageCount(data.packageCount || 0);
        setBookingCount(data.bookingCount || 0);
        setPendingApprovals(data.pendingApprovals || 0);
        setMonthlyRevenue(data.monthlyRevenue || 0);
        setDashboardMetrics({
          weeklyBookings: data.weeklyBookings || 0,
          monthlyRevenue: data.monthlyRevenue || 0,
          avgRating: data.avgRating || 0,
          completionRate: data.completionRate || 0
        });
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchProviderMetrics = async () => {
    try {
      setLoading(true);
      
      // Fetch appointments per day
      const appointmentsResponse = await api.get('/service-provider/metrics/appointments-per-day');
      if (appointmentsResponse.data.success) {
        setAppointmentsPerDayData(appointmentsResponse.data.data || []);
      }
      
      // Fetch service metrics
      const serviceMetricsResponse = await api.get('/service-provider/metrics/service-status');
      if (serviceMetricsResponse.data.success) {
        const data = serviceMetricsResponse.data;
        setActiveServicesCount(data.activeCount || 0);
        setDeletedServicesCount(data.deletedCount || 0);
        setServiceUpdateRequestsCount(data.updateRequestsCount || 0);
        setDeleteRequestsCount(data.deleteRequestsCount || 0);
      }
      
    } catch (err) {
      setError('Failed to load provider metrics');
      console.error('Provider metrics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPackages = async () => {
    try {
      const response = await api.get('/packages/provider-packages');
      if (response.data.success) {
        setPackages(response.data.packages || []);
      }
    } catch (err) {
      console.error('Package fetch error:', err);
    }
  };
  
  const fetchServices = async () => {
    try {
      const response = await api.get('/services/my-services');
      if (response.data.success) {
        setServices(response.data.services || []);
      }
    } catch (err) {
      console.error('Service fetch error:', err);
    }
  };
  
  const handleShowDescription = (title, description) => {
    setDescriptionPanel({
      open: true,
      title,
      description
    });
  };

  const handleCloseDescription = () => {
    setDescriptionPanel({
      ...descriptionPanel,
      open: false
    });
  };

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
      console.error('Failed to load notifications:', error);
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

      <Container maxWidth="xl" sx={{ py: 4 }}>
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
            <Grid container spacing={3}>
              <Grid item xs={12} lg={7}>
                <StudioCard sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="div" sx={{ color: '#003047' }}>
                        Appointments Per Day
                      </Typography>
                      <IconButton size="small" onClick={() => handleShowDescription(
                        "Appointments Per Day",
                        "This chart shows the number of appointments booked for your services each day over the past month."
                      )}>
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={appointmentsPerDayData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" name="Appointments" stroke="#4CAF50" activeDot={{ r: 8 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    )}
                  </CardContent>
                </StudioCard>
              </Grid>
              
              <Grid item xs={12} lg={5}>
                <StudioCard sx={{ height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="div" sx={{ color: '#003047' }}>
                        Services Overview
                      </Typography>
                      <IconButton size="small" onClick={() => handleShowDescription(
                        "Services Overview",
                        "This chart shows the distribution of your services by status. It helps you visualize the proportion of active vs. deleted services."
                      )}>
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    {loading ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                        <CircularProgress />
                      </Box>
                    ) : (
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Active', value: activeServicesCount, color: '#4CAF50' },
                                { name: 'Deleted', value: deletedServicesCount, color: '#F44336' },
                                { name: 'Pending Updates', value: serviceUpdateRequestsCount, color: '#FF9800' },
                                { name: 'Pending Deletion', value: deleteRequestsCount, color: '#9C27B0' }
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {[
                                { name: 'Active', color: '#4CAF50' },
                                { name: 'Deleted', color: '#F44336' },
                                { name: 'Pending Updates', color: '#FF9800' },
                                { name: 'Pending Deletion', color: '#9C27B0' }
                              ].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    )}
                  </CardContent>
                </StudioCard>
              </Grid>
            </Grid>
            
            <Grid container spacing={3} sx={{ mb: 3 }}></Grid>

            <Grid container spacing={3} sx={{ mb: 3 }}></Grid>
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
   