//pages/dashboards/adminDashboardPage.js - ENHANCED VERSION WITH REAL DATA
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Button,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import {
  People as PeopleIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
  Update as UpdateIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import Footer from '../../components/footer';
import EnhancedAppBar from '../../components/EnhancedAppBar';
import { styled } from '@mui/material/styles';
import api from '../../services/auth';

const DashboardContainer = styled(Box)(({ theme }) => ({
  background: '#FFFFFF',
  minHeight: '100vh',
}));

const GlassCard = styled(Card)(({ theme, borderColor = '#003047' }) => ({
  background: '#FFFFFF',
  border: `2px solid ${borderColor}`,
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0, 31, 63, 0.1)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${borderColor}, ${borderColor}aa)`,
    zIndex: 1
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 32px rgba(0, 31, 63, 0.15)`,
    borderColor: `${borderColor}dd`,
    '&:before': {
      background: `linear-gradient(90deg, ${borderColor}, ${borderColor})`
    }
  }
}));

const MetricCard = styled(Card)(({ theme, alertLevel = 'normal' }) => {
  const colorSchemes = {
    normal: {
      primary: '#003047',
      secondary: '#075B5E',
      border: '#219ebc',
      accent: '#8ecae6'
    },
    warning: {
      primary: '#FF9800',
      secondary: '#F57C00',
      border: '#FFB74D',
      accent: '#FFCC02'
    },
    critical: {
      primary: '#F44336',
      secondary: '#D32F2F',
      border: '#EF5350',
      accent: '#FF6B6B'
    },
    success: {
      primary: '#4CAF50',
      secondary: '#388E3C',
      border: '#66BB6A',
      accent: '#81C784'
    }
  };
  
  const colors = colorSchemes[alertLevel];
  
  return {
    borderRadius: 16,
    border: `3px solid ${colors.border}`,
    boxShadow: `0 6px 20px ${colors.primary}33`,
    background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
    color: 'white',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: `linear-gradient(90deg, ${colors.accent}, ${colors.border})`,
      zIndex: 1
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: '60px',
      height: '60px',
      background: `radial-gradient(circle, ${colors.accent}40, transparent)`,
      borderRadius: '50%',
      transform: 'translate(20px, 20px)'
    },
    '&:hover': {
      transform: 'translateY(-6px) scale(1.02)',
      boxShadow: `0 12px 40px ${colors.primary}44`,
      borderColor: colors.accent,
      '&:before': {
        background: `linear-gradient(90deg, ${colors.accent}, ${colors.primary})`
      }
    }
  };
})

const ChartCard = styled(Card)(({ theme, chartType = 'default' }) => {
  const chartColors = {
    default: { border: '#003047', accent: '#219ebc' },
    trend: { border: '#4CAF50', accent: '#81C784' },
    requests: { border: '#8B4B9C', accent: '#BA68C8' },
    appointments: { border: '#FF9800', accent: '#FFB74D' }
  };
  
  const colors = chartColors[chartType];
  
  return {
    background: '#FFFFFF',
    border: `2px solid ${colors.border}`,
    borderRadius: 20,
    boxShadow: `0 6px 24px ${colors.border}22`,
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    '&:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '6px',
      background: `linear-gradient(90deg, ${colors.border}, ${colors.accent})`,
      zIndex: 1
    },
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: `0 12px 36px ${colors.border}33`,
      borderColor: colors.accent,
      '&:before': {
        height: '8px',
        background: `linear-gradient(90deg, ${colors.accent}, ${colors.border})`
      }
    }
  };
})

const SummaryCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
  border: '2px solid #e9ecef',
  borderRadius: 16,
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&:before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #003047, #219ebc, #8ecae6)',
    zIndex: 1
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    borderColor: '#219ebc'
  }
}));

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dashboard state
  const [dashboardData, setDashboardData] = useState({
    customerCount: 0,
    serviceProviderCount: 0,
    pendingApprovalCount: 0,
    totalUsers: 0,
    pendingServiceApprovals: 0,
    deletedServicesCount: 0,
    deleteRequestsData: { customers: 0, serviceProviders: 0 },
    newProvidersData: [],
    serviceUpdateRequestsData: [],
    serviceUpdateRequests: 0,
    appointmentsPerDayData: [],
    additionalMetrics: {},
    summary: {}
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  // Description panel state
  const [descriptionPanel, setDescriptionPanel] = useState({
    open: false,
    title: '',
    description: ''
  });

  // Fetch dashboard data
  const fetchDashboardData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      console.log('📊 Fetching dashboard data from API...');
      const response = await api.get('/auth/admin/dashboard-data');
      
      if (response.data.success) {
        console.log('📊 Dashboard data received:', response.data);
        setDashboardData({
          customerCount: response.data.customerCount || 0,
          serviceProviderCount: response.data.serviceProviderCount || 0,
          pendingApprovalCount: response.data.pendingApprovalCount || 0,
          totalUsers: response.data.totalUsers || 0,
          pendingServiceApprovals: response.data.pendingServiceApprovals || 0,
          deletedServicesCount: response.data.deletedServicesCount || 0,
          deleteRequestsData: response.data.deleteRequestsData || { customers: 0, serviceProviders: 0 },
          newProvidersData: response.data.newProvidersData || [],
          serviceUpdateRequestsData: response.data.serviceUpdateRequestsData || [],
          serviceUpdateRequests: response.data.serviceUpdateRequests || 0,
          appointmentsPerDayData: response.data.appointmentsPerDayData || [],
          additionalMetrics: response.data.additionalMetrics || {},
          summary: response.data.summary || {}
        });
        setError('');
      } else {
        throw new Error(response.data.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error('❌ Dashboard data fetch error:', err);
      setError(`Failed to load dashboard data: ${err.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
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
  
  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };
  
  // These functions aren't needed anymore since we're using EnhancedAppBar
  // But we'll keep them as reference in case we need to implement custom notification behavior later

  const toggleSidebar = () => setSidebarOpen(o => !o);

  // Determine alert levels for metrics
  const getAlertLevel = (value, thresholds = { warning: 5, critical: 10 }) => {
    if (value === 0) return 'normal';
    if (value >= thresholds.critical) return 'critical';
    if (value >= thresholds.warning) return 'warning';
    return 'success';
  };

  if (loading && !refreshing) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading Dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <EnhancedAppBar
        role="admin"
        user={user}
        onMenuClick={toggleSidebar}
        onLogout={handleLogout}
        title="Admin Dashboard"
        notifications={notifications?.length || 0}
        notificationsList={notifications || []}
      />

      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />
      
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {/* Header with refresh button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#003047' }}>
              Admin Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Real-time platform overview and metrics
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            sx={{ borderRadius: 2 }}
          >
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {refreshing && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Refreshing dashboard data...
          </Alert>
        )}
        
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <MetricCard alertLevel="normal">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" component="div">
                      Total Users
                    </Typography>
                    <Typography variant="h3" component="div" sx={{ mt: 2, fontWeight: 'bold' }}>
                      {dashboardData.totalUsers}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Typography variant="body2">
                        Customers: {dashboardData.customerCount}
                      </Typography>
                      <Typography variant="body2">
                        Providers: {dashboardData.serviceProviderCount}
                      </Typography>
                    </Box>
                  </Box>
                  <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                    <PeopleIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </MetricCard>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <MetricCard alertLevel={getAlertLevel(dashboardData.pendingServiceApprovals)}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  Pending New Service Approvals
                  <IconButton size="small" onClick={() => handleShowDescription(
                    "Pending Service Approvals",
                    "Number of new services submitted by service providers that are waiting for admin approval to go live on the platform."
                  )} sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Typography>
                <Typography variant="h3" component="div" sx={{ mt: 2, fontWeight: 'bold' }}>
                  {dashboardData.pendingServiceApprovals}
                </Typography>
                <Chip 
                  label="New Services" 
                  size="small" 
                  sx={{ 
                    mt: 1, 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 'bold'
                  }} 
                />
              </CardContent>
            </MetricCard>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <MetricCard alertLevel={getAlertLevel(dashboardData.deletedServicesCount, { warning: 10, critical: 25 })}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  Deleted Services
                  <IconButton size="small" onClick={() => handleShowDescription(
                    "Deleted Services",
                    "Total number of services that have been deleted from the platform. This includes both admin-deleted and provider-deleted services."
                  )} sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Typography>
                <Typography variant="h3" component="div" sx={{ mt: 2, fontWeight: 'bold' }}>
                  {dashboardData.deletedServicesCount}
                </Typography>
                <Chip 
                  label="Removed Services" 
                  size="small" 
                  sx={{ 
                    mt: 1, 
                    bgcolor: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    fontWeight: 'bold'
                  }} 
                />
              </CardContent>
            </MetricCard>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <MetricCard alertLevel={getAlertLevel(dashboardData.deleteRequestsData.customers + dashboardData.deleteRequestsData.serviceProviders)}>
              <CardContent>
                <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  Account Deletion Requests
                  <IconButton size="small" onClick={() => handleShowDescription(
                    "Account Deletion Requests",
                    "Number of account deletion requests from both customers and service providers that require admin approval."
                  )} sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Typography>
                <Typography variant="h3" component="div" sx={{ mt: 2, fontWeight: 'bold' }}>
                  {dashboardData.deleteRequestsData.customers + dashboardData.deleteRequestsData.serviceProviders}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="body2">
                    Customers: {dashboardData.deleteRequestsData.customers}
                  </Typography>
                  <Typography variant="body2">
                    Providers: {dashboardData.deleteRequestsData.serviceProviders}
                  </Typography>
                </Box>
              </CardContent>
            </MetricCard>
          </Grid>
        </Grid>
        
        {/* Charts Section with Enhanced Borders */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ChartCard chartType="trend" sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="div" sx={{ color: '#003047', display: 'flex', alignItems: 'center', fontWeight: 700 }}>
                    <TrendingUpIcon sx={{ mr: 1, color: '#4CAF50' }} />
                    New Service Providers (Monthly Trend)
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => handleShowDescription(
                      "New Service Providers Trend",
                      "This chart shows the number of new service provider registrations per day. Y-axis shows whole numbers (1, 2, 3, 4, 5...)."
                    )}
                    sx={{ 
                      bgcolor: '#4CAF5015',
                      border: '1px solid #4CAF50',
                      '&:hover': { bgcolor: '#4CAF5025' }
                    }}
                  >
                    <InfoIcon fontSize="small" sx={{ color: '#4CAF50' }} />
                  </IconButton>
                </Box>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboardData.newProvidersData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#4CAF5033" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis 
                        domain={[0, 'dataMax']}
                        allowDecimals={false}
                        tickCount={6}
                        stroke="#666"
                        label={{ value: 'New Providers', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          border: '2px solid #4CAF50',
                          borderRadius: '8px',
                          backgroundColor: '#f8fff8'
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="count" name="New Providers" stroke="#4CAF50" strokeWidth={3} activeDot={{ r: 8, stroke: '#4CAF50', strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </ChartCard>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <ChartCard chartType="requests" sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="div" sx={{ color: '#003047', display: 'flex', alignItems: 'center', fontWeight: 700 }}>
                    <UpdateIcon sx={{ mr: 1, color: '#8B4B9C' }} />
                    Service Update Requests
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => handleShowDescription(
                      "Service Update Requests",
                      "This chart displays service update requests in increments of 3 (3, 6, 9, 12...)."
                    )}
                    sx={{ 
                      bgcolor: '#8B4B9C15',
                      border: '1px solid #8B4B9C',
                      '&:hover': { bgcolor: '#8B4B9C25' }
                    }}
                  >
                    <InfoIcon fontSize="small" sx={{ color: '#8B4B9C' }} />
                  </IconButton>
                </Box>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboardData.serviceUpdateRequestsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#8B4B9C33" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis 
                        domain={[0, 'dataMax']}
                        ticks={[0, 3, 6, 9, 12, 15, 18, 21, 24]}
                        interval={0}
                        allowDecimals={false}
                        stroke="#666"
                        label={{ value: 'Update Requests', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          border: '2px solid #8B4B9C',
                          borderRadius: '8px',
                          backgroundColor: '#faf8ff'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="count" name="Update Requests" fill="#8B4B9C" stroke="#6A1B9A" strokeWidth={1} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </ChartCard>
          </Grid>
          
          <Grid item xs={12}>
            <ChartCard chartType="appointments">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="div" sx={{ color: '#003047', display: 'flex', alignItems: 'center', fontWeight: 700 }}>
                    <CalendarIcon sx={{ mr: 1, color: '#FF9800' }} />
                    Appointments Per Day
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => handleShowDescription(
                      "Appointments Per Day",
                      "Daily appointment bookings. Y-axis shows increments of 5 (5, 10, 15, 20...)."
                    )}
                    sx={{ 
                      bgcolor: '#FF980015',
                      border: '1px solid #FF9800',
                      '&:hover': { bgcolor: '#FF980025' }
                    }}
                  >
                    <InfoIcon fontSize="small" sx={{ color: '#FF9800' }} />
                  </IconButton>
                </Box>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboardData.appointmentsPerDayData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#FF980033" />
                      <XAxis dataKey="date" stroke="#666" />
                      <YAxis 
                        domain={[0, 'dataMax']}
                        ticks={[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]}
                        interval={0}
                        allowDecimals={false}
                        stroke="#666"
                        label={{ value: 'Appointments', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          border: '2px solid #FF9800',
                          borderRadius: '8px',
                          backgroundColor: '#fffaf0'
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="count" name="Appointments" stroke="#FF9800" strokeWidth={3} activeDot={{ r: 8, stroke: '#FF9800', strokeWidth: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </ChartCard>
          </Grid>
        </Grid>

        {/* Additional Metrics Summary */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12}>
            <GlassCard>
              <CardContent>
                <Typography variant="h6" sx={{ color: '#003047', mb: 3 }}>
                  Platform Summary
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                        {dashboardData.additionalMetrics.totalActiveServices || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Services
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#2196F3', fontWeight: 'bold' }}>
                        {dashboardData.additionalMetrics.totalBookings || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Bookings
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#FF9800', fontWeight: 'bold' }}>
                        {dashboardData.additionalMetrics.pendingBookings || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending Bookings
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" sx={{ color: '#9C27B0', fontWeight: 'bold' }}>
                        {dashboardData.summary.totalPendingActions || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending Actions
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </GlassCard>
          </Grid>
        </Grid>
        
        {/* Description Panel Dialog */}
        <Dialog
          open={descriptionPanel.open}
          onClose={handleCloseDescription}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: '#003047', color: 'white' }}>
            {descriptionPanel.title}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Typography variant="body1">
              {descriptionPanel.description}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDescription} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminDashboard;