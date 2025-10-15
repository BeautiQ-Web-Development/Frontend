//pages/dashboards/serviceProviderDashboardPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import placeholderImg from '../../assets/placeholder.jpg';
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
  AlertTitle,
  CircularProgress,
  Divider,
  Fab,
  Tabs,
  Tab,
  Avatar,
  CardActions,
  Badge,
  Tooltip as MuiTooltip,
  LinearProgress
} from '@mui/material';
import {
  Store as StoreIcon,
  Person as PersonIcon,
  EventAvailable as EventIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Business as BusinessIcon,
  Build as ServiceIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  AddCircle,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Pending as PendingIcon,
  Info as InfoIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/footer';
import ServiceProviderSidebar from '../../components/ServiceProviderSidebar';
import api from '../../services/auth';
import { useNotifications } from '../../context/NotificationContext';
import { createPlaceholderImage, handleImageError } from '../../utils/imageUtils';
import { styled } from '@mui/system';
import EnhancedAppBar from '../../components/EnhancedAppBar';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

// Modify the styled components to use the imported Box and Card
// Styled components for enhanced UI
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

// Enhanced service card with interactive elements
const ServiceCard = styled(Card)(({ status }) => ({
  position: 'relative',
  borderRadius: 12,
  transition: 'all 0.3s ease',
  overflow: 'visible',
  border: status === 'approved' ? '1px solid rgba(76, 175, 80, 0.3)' : 
         status === 'deleted' ? '1px solid rgba(244, 67, 54, 0.3)' :
         status === 'pending_approval' ? '1px solid rgba(255, 152, 0, 0.3)' :
         '1px solid rgba(0, 0, 0, 0.12)',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: status === 'approved' ? '0 8px 16px rgba(76, 175, 80, 0.2)' : 
              status === 'deleted' ? '0 8px 16px rgba(244, 67, 54, 0.2)' :
              status === 'pending_approval' ? '0 8px 16px rgba(255, 152, 0, 0.2)' :
              '0 8px 16px rgba(0, 0, 0, 0.15)'
  }
}));

// Status badge component
const StatusBadge = styled(Box)(({ status }) => ({
  position: 'absolute',
  top: -10,
  right: 10,
  padding: '4px 12px',
  borderRadius: 12,
  fontSize: '0.7rem',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  color: 'white',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  backgroundColor: 
    status === 'approved' ? '#4CAF50' : 
    status === 'deleted' ? '#F44336' :
    status === 'pending_approval' ? '#FF9800' :
    '#9E9E9',
  zIndex: 1
}));

// Enhanced tab panel for services tabs
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`service-tabpanel-${index}`}
      aria-labelledby={`service-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

// Utility function to format price
const formatPrice = (price) => {
  if (!price) return "Price not set";
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2
  }).format(price);
};

const ServiceProviderDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const { notifications: notificationsList, unreadCount, markAsRead, markAllAsRead, refreshNotifications } = useNotifications();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [serviceCount, setServiceCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Enhanced state variables for service management
  const [activeServices, setActiveServices] = useState([]);
  const [deletedServices, setDeletedServices] = useState([]);
  const [pendingServices, setPendingServices] = useState([]);
  
  // Tab state for dashboard views
  const [dashboardTab, setDashboardTab] = useState(0);
  const [serviceTab, setServiceTab] = useState(0);
  
  // State for service detail modal
  const [serviceDetailDialog, setServiceDetailDialog] = useState({
    open: false,
    service: null
  });
  
  // State for services loading status
  const [servicesLoading, setServicesLoading] = useState(false);
  const [error, setError] = useState('');
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
  
  // Dashboard state declarations
  const [dashboardMetrics, setDashboardMetrics] = useState({ weeklyBookings: 0, monthlyRevenue: 0, avgRating: 0, completionRate: 0 });
  // Notification context for real-time updates
  useEffect(() => {
    fetchServices();
    fetchDashboardData();
    // Fetch provider metrics after services are loaded
    setTimeout(() => fetchProviderMetrics(), 500);
    // Load notifications on mount
    refreshNotifications(true);
  }, [refreshNotifications]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Use the services endpoint to get service count and status
      const servicesResponse = await api.get('/services/my-services');
      
      if (servicesResponse.data.success) {
        const services = servicesResponse.data.services || [];
        
        // Calculate metrics from services data
        setServiceCount(services.length);
        
        // Count services with pending changes
        const pendingCount = services.filter(svc => 
          svc.status === 'pending_approval' || 
          (svc.pendingChanges && svc.pendingChanges.actionType)
        ).length;
        
        setPendingApprovals(pendingCount);
        
        // Set placeholder values for other metrics
        setBookingCount(0);
        setMonthlyRevenue(0);
        setDashboardMetrics({
          weeklyBookings: 0,
          monthlyRevenue: 0,
          avgRating: 4.5, // Default placeholder rating
          completionRate: 100
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
      
      // Use services data to calculate metrics
      const servicesResponse = await api.get('/services/my-services');
      if (servicesResponse.data.success) {
        const services = servicesResponse.data.services || [];
        
        // Calculate service metrics from available data
        const activeServices = services.filter(svc => svc.status === 'approved' && svc.isActive !== false);
        const deletedServices = services.filter(svc => svc.status === 'deleted' || svc.isActive === false);
        const updateRequests = services.filter(svc => 
          svc.pendingChanges && svc.pendingChanges.actionType === 'update'
        );
        const deleteRequests = services.filter(svc => 
          svc.pendingChanges && svc.pendingChanges.actionType === 'delete'
        );
        
        setActiveServicesCount(activeServices.length);
        setDeletedServicesCount(deletedServices.length);
        setServiceUpdateRequestsCount(updateRequests.length);
        setDeleteRequestsCount(deleteRequests.length);
        
        // Create sample data for appointments per day chart
        const sampleDays = 7;
        const today = new Date();
        const appointmentsData = [];
        
        for (let i = 0; i < sampleDays; i++) {
          const date = new Date();
          date.setDate(today.getDate() - (sampleDays - i - 1));
          const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          // Random count between 0-5 for sample data
          const count = Math.floor(Math.random() * 6);
          
          appointmentsData.push({
            date: formattedDate,
            count: count
          });
        }
        
        setAppointmentsPerDayData(appointmentsData);
      }
      
    } catch (err) {
      setError('Failed to load provider metrics');
      console.error('Provider metrics fetch error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      const response = await api.get('/services/my-services');
      if (response.data.success) {
        const allServices = response.data.services || [];
        setServices(allServices);
        
        // Categorize services
        const active = allServices.filter(service => 
          service.status === 'approved' && service.isActive !== false);
        
        const deleted = allServices.filter(service => 
          service.status === 'deleted' || service.isActive === false);
        
        const pending = allServices.filter(service => 
          service.status === 'pending_approval' || 
          (service.pendingChanges && service.pendingChanges.actionType));
        
        setActiveServices(active);
        setDeletedServices(deleted);
        setPendingServices(pending);
        setServiceCount(allServices.length);
        setPendingApprovals(pending.length);
        setActiveServicesCount(active.length);
        setDeletedServicesCount(deleted.length);
        
        console.log("Services fetched and categorized:", {
          all: allServices.length,
          active: active.length,
          deleted: deleted.length,
          pending: pending.length
        });
      }
    } catch (err) {
      console.error('Service fetch error:', err);
      setError('Failed to load services. Please try again.');
    } finally {
      setServicesLoading(false);
    }
  };
  
  // Handle tab changes
  const handleDashboardTabChange = (event, newValue) => {
    setDashboardTab(newValue);
  };
  
  const handleServiceTabChange = (event, newValue) => {
    setServiceTab(newValue);
  };
  
  // View service details
  const handleViewServiceDetails = (service) => {
    setServiceDetailDialog({
      open: true,
      service
    });
  };
  
  // Close service details modal
  const handleCloseServiceDetail = () => {
    setServiceDetailDialog({
      open: false,
      service: null
    });
  };
  
  // Get status text and color
  const getStatusInfo = (service) => {
    if (service.status === 'approved' && service.isActive !== false) {
      return { text: 'Active', color: '#4CAF50' };
    } else if (service.status === 'deleted' || service.isActive === false) {
      return { text: 'Deleted', color: '#F44336' };
    } else if (service.status === 'pending_approval') {
      return { text: 'Pending Approval', color: '#FF9800' };
    } else if (service.pendingChanges && service.pendingChanges.actionType === 'update') {
      return { text: 'Update Pending', color: '#2196F3' };
    } else if (service.pendingChanges && service.pendingChanges.actionType === 'delete') {
      return { text: 'Deletion Pending', color: '#9C27B0' };
    } else {
      return { text: 'Unknown', color: '#9E9E9E' };
    }
  };
  
  const handleShowDescription = (title, description) => {
    setDescriptionPanel({
      open: true,
      title,
      description
    });
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
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={markAllAsRead}
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
        
        {/* Service creation prompt for empty state */}
        {serviceCount === 0 && !loading && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              background: 'rgba(33, 150, 243, 0.1)',
              border: '1px solid rgba(33, 150, 243, 0.2)'
            }}
          >
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                Welcome to your service provider dashboard!
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                To get started, add your first service that you want to offer to customers.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                size="small"
                onClick={() => navigate('/service-provider/services/new')}
                startIcon={<AddIcon />}
              >
                Create Your First Service
              </Button>
            </Box>
          </Alert>
        )}

        {/* Clean Analytics Section */}
        {!location.pathname.includes('/services') && (
          <>
            {/* Clean Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StudioCard sx={{ height: 120 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      <ServiceIcon sx={{ color: '#003047', mr: 1 }} />
                      <Typography variant="h5" sx={{ color: '#001F3F', fontWeight: 600 }}>
                        {serviceCount}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(0, 31, 63, 0.7)', fontSize: '0.8rem', textAlign: 'center' }}>
                      Total Services
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5 }}>
                      <MuiTooltip title="Active Services">
                        <Chip 
                          size="small" 
                          label={`${activeServicesCount} active`}
                          sx={{ 
                            fontSize: '0.7rem', 
                            bgcolor: 'rgba(76, 175, 80, 0.1)', 
                            color: '#4CAF50',
                            mr: 0.5,
                            border: '1px solid rgba(76, 175, 80, 0.2)'
                          }} 
                        />
                      </MuiTooltip>
                      <MuiTooltip title="Deleted Services">
                        <Chip 
                          size="small" 
                          label={`${deletedServicesCount} deleted`}
                          sx={{ 
                            fontSize: '0.7rem', 
                            bgcolor: 'rgba(244, 67, 54, 0.1)', 
                            color: '#F44336',
                            border: '1px solid rgba(244, 67, 54, 0.2)'
                          }} 
                        />
                      </MuiTooltip>
                    </Box>
                  </CardContent>
                </StudioCard>
              </Grid>



              <Grid item xs={12} sm={6} md={3}>
                <StudioCard sx={{ height: 120 }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      <PendingIcon sx={{ color: '#FF9800', mr: 1 }} />
                      <Typography variant="h5" sx={{ color: '#001F3F', fontWeight: 600 }}>
                        {pendingApprovals}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'rgba(0, 31, 63, 0.7)', fontSize: '0.8rem', textAlign: 'center' }}>
                      Pending Approvals
                    </Typography>
                    {pendingApprovals > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mt: 0.5, gap: 0.5 }}>
                        {pendingServices.filter(s => s.status === 'pending_approval' && !s.pendingChanges).length > 0 && (
                          <MuiTooltip title="New Services Pending Approval">
                            <Chip 
                              size="small" 
                              label={`${pendingServices.filter(s => s.status === 'pending_approval' && !s.pendingChanges).length} new`}
                              sx={{ 
                                fontSize: '0.7rem', 
                                bgcolor: 'rgba(33, 150, 243, 0.1)', 
                                color: '#2196F3',
                                border: '1px solid rgba(33, 150, 243, 0.2)'
                              }} 
                            />
                          </MuiTooltip>
                        )}
                        {pendingServices.filter(s => s.pendingChanges?.actionType === 'update').length > 0 && (
                          <MuiTooltip title="Service Updates Pending Approval">
                            <Chip 
                              size="small" 
                              label={`${pendingServices.filter(s => s.pendingChanges?.actionType === 'update').length} updates`}
                              sx={{ 
                                fontSize: '0.7rem', 
                                bgcolor: 'rgba(255, 152, 0, 0.1)', 
                                color: '#FF9800',
                                border: '1px solid rgba(255, 152, 0, 0.2)'
                              }} 
                            />
                          </MuiTooltip>
                        )}
                        {pendingServices.filter(s => s.pendingChanges?.actionType === 'delete').length > 0 && (
                          <MuiTooltip title="Service Deletions Pending Approval">
                            <Chip 
                              size="small" 
                              label={`${pendingServices.filter(s => s.pendingChanges?.actionType === 'delete').length} deletions`}
                              sx={{ 
                                fontSize: '0.7rem', 
                                bgcolor: 'rgba(156, 39, 176, 0.1)', 
                                color: '#9C27B0',
                                border: '1px solid rgba(156, 39, 176, 0.2)'
                              }} 
                            />
                          </MuiTooltip>
                        )}
                      </Box>
                    )}
                    {pendingApprovals === 0 && (
                      <Typography variant="caption" sx={{ color: 'rgba(0, 31, 63, 0.5)', fontSize: '0.7rem', display: 'block', textAlign: 'center' }}>
                        No pending items
                      </Typography>
                    )}
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
                        {serviceCount > 0 ? 'Ready for bookings' : 'Add services first'}
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
                        LKR {dashboardMetrics.monthlyRevenue > 0 ? 
                          (dashboardMetrics.monthlyRevenue / 1000).toFixed(0) + 'K' : 
                          '0'}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(0, 31, 63, 0.7)', fontSize: '0.8rem' }}>
                        Revenue
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(0, 31, 63, 0.5)', fontSize: '0.7rem' }}>
                        {serviceCount > 0 ? 'Ready to earn' : 'Add services to start earning'}
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
                        {appointmentsPerDayData.length > 0 ? (
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
                              <RechartsTooltip />
                              <Legend />
                              <Line type="monotone" dataKey="count" name="Appointments" stroke="#4CAF50" activeDot={{ r: 8 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        ) : (
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            height: '100%',
                            color: 'text.secondary'
                          }}>
                            <Typography variant="body1">No appointment data available</Typography>
                            <Typography variant="caption">Create services to start tracking appointments</Typography>
                          </Box>
                        )}
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
                        {activeServicesCount > 0 || deletedServicesCount > 0 || serviceUpdateRequestsCount > 0 || deleteRequestsCount > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: 'Active', value: activeServicesCount, color: '#4CAF50' },
                                  { name: 'Deleted', value: deletedServicesCount, color: '#F44336' },
                                  { name: 'Pending Updates', value: serviceUpdateRequestsCount, color: '#FF9800' },
                                  { name: 'Pending Deletion', value: deleteRequestsCount, color: '#9C27B0' }
                                ].filter(item => item.value > 0)}
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
                              <RechartsTooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        ) : (
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            height: '100%',
                            color: 'text.secondary'
                          }}>
                            <Typography variant="body1">No service data available</Typography>
                            <Typography variant="caption">Add services to see statistics</Typography>
                          </Box>
                        )}
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
                    <TableCell>Status</TableCell>
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
                      <TableCell>LKR {svc.price}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={svc.status}
                          color={svc.status === 'approved' ? 'success' : svc.status === 'rejected' ? 'error' : 'warning'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          onClick={() => navigate(`/service-provider/services/${svc._id}/edit`)}
                          disabled={svc.status === 'pending_approval' || svc.pendingChanges}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => {
                            if (window.confirm('Are you sure you want to request deletion of this service?')) {
                              // Implement service deletion
                              api.delete(`/services/${svc._id}`)
                                .then(response => {
                                  if (response.data.success) {
                                    fetchServices();
                                    alert('Service deletion request submitted');
                                  }
                                })
                                .catch(err => {
                                  console.error('Error deleting service:', err);
                                  setError(err.response?.data?.message || 'Failed to delete service');
                                });
                            }
                          }}
                          disabled={svc.status === 'pending_approval' || svc.pendingChanges}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ '& > *': { mr: 1 } }}>
              <Button variant="contained" onClick={() => navigate('/service-provider/services/new')}>
                Add New Service
              </Button>
              <Button 
                variant="outlined" 
                disabled={!selectedServiceId || services.find(s => s._id === selectedServiceId)?.status === 'pending_approval'}
                onClick={() => navigate(`/service-provider/services/${selectedServiceId}/edit`)}
              >
                Edit Selected
              </Button>
              <Button 
                variant="outlined" 
                color="error" 
                disabled={!selectedServiceId || services.find(s => s._id === selectedServiceId)?.status === 'pending_approval'} 
                onClick={() => {
                  const selectedService = services.find(s => s._id === selectedServiceId);
                  if (!selectedService) return;
                  
                  if (window.confirm(`Are you sure you want to request deletion of "${selectedService.name}"?`)) {
                    api.delete(`/services/${selectedServiceId}`)
                      .then(response => {
                        if (response.data.success) {
                          fetchServices();
                          alert('Service deletion request submitted');
                        }
                      })
                      .catch(err => {
                        console.error('Error deleting service:', err);
                        setError(err.response?.data?.message || 'Failed to delete service');
                      });
                  }
                }}
              >
                Delete Selected
              </Button>
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

        {/* Enhanced Services Management Section with Tabs */}
        <StudioCard sx={{ mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
              <Typography variant="h6" component="div" sx={{ color: '#003047', my: 1 }}>
                My Services
              </Typography>
              
              <Button 
                variant="contained" 
                color="primary" 
                size="small" 
                startIcon={<RefreshIcon />}
                onClick={() => fetchServices()}
                disabled={servicesLoading}
              >
                Refresh
              </Button>
            </Box>
            
            <Tabs 
              value={serviceTab} 
              onChange={handleServiceTabChange}
              variant="fullWidth"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500
                }
              }}
            >
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon sx={{ mr: 1, color: '#4CAF50' }} />
                    <span>Active Services ({activeServices.length})</span>
                  </Box>
                } 
                id="services-tab-0"
                aria-controls="services-tabpanel-0"
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ErrorIcon sx={{ mr: 1, color: '#F44336' }} />
                    <span>Deleted Services ({deletedServices.length})</span>
                  </Box>
                } 
                id="services-tab-1"
                aria-controls="services-tabpanel-1"
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PendingIcon sx={{ mr: 1, color: '#FF9800' }} />
                    <span>Pending Approval ({pendingServices.length})</span>
                  </Box>
                } 
                id="services-tab-2"
                aria-controls="services-tabpanel-2"
              />
            </Tabs>
          </Box>

          {servicesLoading ? (
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">Loading services...</Typography>
            </Box>
          ) : (
            <>
              {/* Active Services Tab */}
              <TabPanel value={serviceTab} index={0}>
                {activeServices.length > 0 ? (
                  <Grid container spacing={3} sx={{ p: 2 }}>
                    {activeServices.map((service) => (
                      <Grid item xs={12} sm={6} md={4} key={service._id}>
                        <ServiceCard status="approved">
                          <StatusBadge status="approved">Active</StatusBadge>
                          {/* Image removed as per requirements */}
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="h6" component="div" noWrap sx={{ fontWeight: 500 }}>
                                {service.name}
                              </Typography>
                              <Chip 
                                label={service.serviceId || "ID Pending"} 
                                size="small"
                                sx={{ 
                                  backgroundColor: '#e3f2fd',
                                  color: '#1976d2',
                                  height: 20,
                                  fontSize: '0.7rem'
                                }}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {service.serviceType} • {service.targetAudience}
                            </Typography>
                            <Typography variant="body2" noWrap>
                              {service.description ? 
                                <>
                                  {service.description.substring(0, 60)}
                                  {service.description.length > 60 ? '...' : ''}
                                </> : 
                                'No description available'
                              }
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="h6" component="div" color="primary" fontWeight="bold">
                                {formatPrice(service.pricing?.basePrice || service.basePrice)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {service.duration} min
                              </Typography>
                            </Box>
                          </CardContent>
                          <CardActions sx={{ justifyContent: 'center', px: 2, pb: 2 }}>
                            <Button 
                              size="small" 
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleViewServiceDetails(service)}
                            >
                              Details
                            </Button>
                            {/* Edit and Delete icons removed as per requirements */}
                          </CardActions>
                        </ServiceCard>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      You don't have any active services yet.
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/service-provider/services/new')}
                    >
                      Create New Service
                    </Button>
                  </Box>
                )}
              </TabPanel>

              {/* Deleted Services Tab */}
              <TabPanel value={serviceTab} index={1}>
                {deletedServices.length > 0 ? (
                  <Grid container spacing={3} sx={{ p: 2 }}>
                    {deletedServices.map((service) => (
                      <Grid item xs={12} sm={6} md={4} key={service._id}>
                        <ServiceCard status="deleted">
                          <StatusBadge status="deleted">Deleted</StatusBadge>
                          {/* Image removed as per requirements */}
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="h6" component="div" noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
                                {service.name}
                              </Typography>
                              <Chip 
                                label={service.serviceId || "ID Pending"} 
                                size="small"
                                sx={{ 
                                  backgroundColor: '#f5f5f5',
                                  color: '#9e9e9e',
                                  height: 20,
                                  fontSize: '0.7rem'
                                }}
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {service.serviceType} • {service.targetAudience}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {service.detailedDescription ? 
                                <>
                                  {service.detailedDescription.substring(0, 60)}
                                  {service.detailedDescription.length > 60 ? '...' : ''}
                                </> : 
                                'No description available'
                              }
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="h6" component="div" color="text.secondary">
                                {formatPrice(service.basePrice)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {service.duration} min
                              </Typography>
                            </Box>
                          </CardContent>
                          <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                            <Button 
                              size="small" 
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleViewServiceDetails(service)}
                            >
                              Details
                            </Button>
                          </CardActions>
                        </ServiceCard>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1">
                      You don't have any deleted services.
                    </Typography>
                  </Box>
                )}
              </TabPanel>

              {/* Pending Approval Tab */}
              <TabPanel value={serviceTab} index={2}>
                {pendingServices.length > 0 ? (
                  <Grid container spacing={3} sx={{ p: 2 }}>
                    {pendingServices.map((service) => (
                      <Grid item xs={12} sm={6} md={4} key={service._id}>
                        <ServiceCard status="pending_approval">
                          <StatusBadge status="pending_approval">
                            {service.status === 'pending_approval' ? 'New Service' : 
                             service.pendingChanges?.actionType === 'update' ? 'Update Pending' : 
                             service.pendingChanges?.actionType === 'delete' ? 'Delete Pending' : 'Pending'}
                          </StatusBadge>
                          {/* Image removed as per requirements */}
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="h6" component="div" noWrap sx={{ fontWeight: 500 }}>
                                {service.name}
                              </Typography>
                              <MuiTooltip title="Awaiting admin approval">
                                <PendingIcon color="warning" fontSize="small" />
                              </MuiTooltip>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {service.serviceType} • {service.targetAudience}
                            </Typography>
                            <Typography variant="body2" noWrap>
                              {service.detailedDescription ? 
                                <>
                                  {service.detailedDescription.substring(0, 60)}
                                  {service.detailedDescription.length > 60 ? '...' : ''}
                                </> : 
                                'No description available'
                              }
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="h6" component="div" color="primary">
                                {formatPrice(service.basePrice)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {service.duration} min
                              </Typography>
                            </Box>
                            <Box sx={{ mt: 1.5 }}>
                              <LinearProgress color="warning" />
                              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                Submitted on {new Date(service.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </CardContent>
                          <CardActions sx={{ justifyContent: 'center', px: 2, pb: 2 }}>
                            <Button 
                              size="small" 
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleViewServiceDetails(service)}
                            >
                              View Details
                            </Button>
                          </CardActions>
                        </ServiceCard>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="body1">
                      You don't have any services pending approval.
                    </Typography>
                  </Box>
                )}
              </TabPanel>
            </>
          )}
        </StudioCard>
      </Container>



      {/* Service Detail Dialog */}
      <Dialog 
        open={serviceDetailDialog.open} 
        onClose={handleCloseServiceDetail}
        maxWidth="md"
        fullWidth
      >
        {serviceDetailDialog.service && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{serviceDetailDialog.service.name}</Typography>
                <Chip 
                  label={getStatusInfo(serviceDetailDialog.service).text}
                  sx={{ 
                    backgroundColor: getStatusInfo(serviceDetailDialog.service).color,
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Service Image removed as per requirements */}
                
                {/* Service Details */}
                <Grid item xs={12}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold">Service Information</Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Service ID</Typography>
                        <Typography variant="body1">{serviceDetailDialog.service.serviceId || 'Not assigned yet'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Price</Typography>
                        <Typography variant="body1" fontWeight="bold">
                          {formatPrice(serviceDetailDialog.service.pricing?.basePrice || serviceDetailDialog.service.basePrice)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Service Type</Typography>
                        <Typography variant="body1">{serviceDetailDialog.service.serviceType}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Target Audience</Typography>
                        <Typography variant="body1">{serviceDetailDialog.service.targetAudience}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Duration</Typography>
                        <Typography variant="body1">{serviceDetailDialog.service.duration} minutes</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Experience Level</Typography>
                        <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{serviceDetailDialog.service.experienceLevel}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">Description</Typography>
                        <Typography variant="body1">
                          {serviceDetailDialog.service.detailedDescription || "No description available"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">Status Information</Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Created</Typography>
                        <Typography variant="body1">
                          {new Date(serviceDetailDialog.service.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                        <Typography variant="body1">
                          {serviceDetailDialog.service.updatedAt ? 
                            new Date(serviceDetailDialog.service.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'short', day: 'numeric'
                            }) : 'Never'}
                        </Typography>
                      </Grid>
                      {serviceDetailDialog.service.pendingChanges && (
                        <Grid item xs={12}>
                          <Alert severity="warning" sx={{ mt: 2 }}>
                            <AlertTitle>Pending Changes</AlertTitle>
                            This service has pending {serviceDetailDialog.service.pendingChanges.actionType} changes awaiting admin approval.
                          </Alert>
                        </Grid>
                      )}
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseServiceDetail}>Close</Button>
              {/* Edit button removed as per requirements */}
            </DialogActions>
          </>
        )}
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

      {/* Floating action button for adding a new service */}
      <Fab 
        color="primary" 
        sx={{ 
          position: 'fixed', 
          bottom: 30, 
          right: 30,
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
        }}
        onClick={() => navigate('/service-provider/services/new')}
        aria-label="add new service"
      >
        <AddIcon />
      </Fab>

      <Footer />
    </ProviderDashboardContainer>
  );
};

export default ServiceProviderDashboard;
