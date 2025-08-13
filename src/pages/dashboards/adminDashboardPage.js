//pages/dashboards/adminDashboardPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Alert,
  CircularProgress,
  Button,
  Paper,
  Card,
  CardContent,
  Avatar,
  TableContainer
} from '@mui/material';
import {
  Menu as MenuIcon,
  People as PeopleIcon,
  Store as StoreIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  fetchNotifications
} from '../../services/notification';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import BookingHeatmapChart from '../../components/BookingHeatmapChart';
import RevenueChart from '../../components/RevenueChart';
import ServicePerformanceChart from '../../components/ServicePerformanceChart';
import TopEarningsGraph from '../../components/TopEarningsGraph';
import MonthlyRevenueByCategoryChart from '../../components/MonthlyRevenueByCategoryChart';
import ProviderFunnelChart from '../../components/ProviderFunnelChart';
import Footer from '../../components/footer';
import EnhancedAppBar from '../../components/EnhancedAppBar';
import { styled } from '@mui/material/styles';
import { getUserCounts, getNotifications } from '../../services/auth';

const DashboardContainer = styled(Box)(({ theme }) => ({
  background: '#FFFFFF',
  minHeight: '100vh',
}));

const GlassCard = styled(Card)(({ theme }) => ({
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

const ResponsiveTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  overflow: 'auto',
  marginBottom: theme.spacing(3),
  // Set minimum width for horizontal scrolling
  '& .MuiTable-root': {
    minWidth: 750,
  },
  // Enhanced scrollbar styling
  '&::-webkit-scrollbar': {
    height: 8,
    width: 8,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,48,71,0.3)',
    borderRadius: 4,
    '&:hover': {
      backgroundColor: '#00003f',
    },
  },
  // Add smooth scrolling
  scrollBehavior: 'smooth',
}));

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [userCounts, setUserCounts] = useState({
    customers: 0,
    serviceProviders: 0,
    pendingApprovals: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [monthlyRevenueByCategory, setMonthlyRevenueByCategory] = useState([]);
  const [providerFunnelData, setProviderFunnelData] = useState([]);
  const [platformHeatmapData, setPlatformHeatmapData] = useState([]);
  const [platformRevenueData, setPlatformRevenueData] = useState([]);
  const [topServicesData, setTopServicesData] = useState([]);
  const [providerPerformanceData, setProviderPerformanceData] = useState([]);
  const [newProviderAlert, setNewProviderAlert] = useState(false);
  const [notifications, setNotifications] = useState(0);
  const [notificationsList, setNotificationsList] = useState([]);

  const year = new Date().getFullYear();

  // Mock data for charts
  const customerData = [
    { name: 'Jan', customers: 4 }, { name: 'Feb', customers: 3 }, { name: 'Mar', customers: 5 },
    { name: 'Apr', customers: 4 }, { name: 'May', customers: 6 }, { name: 'Jun', customers: 8 },
    { name: 'Jul', customers: 7 }, { name: 'Aug', customers: 9 }, { name: 'Sep', customers: 10 },
    { name: 'Oct', customers: 12 }, { name: 'Nov', customers: 11 }, { name: 'Dec', customers: 13 }
  ];

  const providerData = [
    { name: 'Jan', providers: 1 }, { name: 'Feb', providers: 2 }, { name: 'Mar', providers: 1 },
    { name: 'Apr', providers: 3 }, { name: 'May', providers: 2 }, { name: 'Jun', providers: 4 },
    { name: 'Jul', providers: 3 }, { name: 'Aug', providers: 5 }, { name: 'Sep', providers: 4 },
    { name: 'Oct', providers: 6 }, { name: 'Nov', providers: 5 }, { name: 'Dec', providers: 7 }
  ];

  useEffect(() => {
    fetchData();
    fetchPlatformAnalytics();
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const notes = await fetchNotifications();
      setNotificationsList(notes || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch user counts with better error handling
      try {
        const countsResponse = await getUserCounts();
        console.log('User counts response:', countsResponse);
        if (countsResponse.success && countsResponse.counts) {
          setUserCounts(countsResponse.counts);
        }
        // handle our flag
        if (localStorage.getItem('newServiceProviderRequest')) {
          setNewProviderAlert(true);
          localStorage.removeItem('newServiceProviderRequest');
        }
      } catch (countsError) {
        console.error('User counts endpoint failed:', countsError.message);
      }

      // fetch notifications
      try {
        const notifRes = await getNotifications();
        setNotificationsList(notifRes.notifications || []);
      } catch (e) {
        console.error('Failed to load notifications', e);
      }

      // Fetch revenue by category
      try {
        const revRes = await getUserCounts() /* replace with real endpoint */; 
        // example: const revRes = await api.get('/analytics/revenue-by-category');
        if (revRes.data) {
          setMonthlyRevenueByCategory(revRes.data.monthlyByCategory);
        }
      } catch {}

      // Fetch provider funnel data
      try {
        const funnelRes = await getUserCounts() /* replace with real endpoint */;
        // example: const funnelRes = await api.get('/analytics/provider-funnel');
        if (funnelRes.data) {
          setProviderFunnelData(funnelRes.data.funnel);
        }
      } catch {}

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlatformAnalytics = async () => {
    try {
      // Platform-wide booking heatmap
      const mockPlatformHeatmap = Array.from({ length: 7 }, (_, dayIndex) => ({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayIndex],
        values: Array.from({ length: 24 }, (_, hour) => {
          let bookings = 0;
          if (dayIndex >= 1 && dayIndex <= 5) { // Weekdays
            if (hour >= 8 && hour <= 20) {
              bookings = Math.floor(Math.random() * 25) + 5;
            }
          } else { // Weekends
            if (hour >= 9 && hour <= 22) {
              bookings = Math.floor(Math.random() * 35) + 8;
            }
          }
          return bookings;
        })
      }));
      setPlatformHeatmapData(mockPlatformHeatmap);

      // Platform revenue data
      const mockPlatformRevenue = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (11 - i));
        return {
          name: date.toLocaleDateString('en-US', { month: 'short' }),
          revenue: Math.floor(Math.random() * 200000) + 150000 + (i * 10000)
        };
      });
      setPlatformRevenueData(mockPlatformRevenue);

      // Top services across platform
      const mockTopServices = [
        { name: 'Hair Styling', bookings: 245, rating: 4.7, revenue: 980000 },
        { name: 'Bridal Makeup', bookings: 189, rating: 4.9, revenue: 1134000 },
        { name: 'Facial Treatment', bookings: 167, rating: 4.6, revenue: 668000 },
        { name: 'Manicure/Pedicure', bookings: 234, rating: 4.5, revenue: 702000 },
        { name: 'Hair Color', bookings: 98, rating: 4.8, revenue: 784000 },
        { name: 'Massage Therapy', bookings: 145, rating: 4.7, revenue: 580000 }
      ];
      setTopServicesData(mockTopServices);

      // Provider performance data
      const mockProviderPerformance = [
        { name: 'SalonDmesh', bookings: 89, rating: 4.9, revenue: 356000 },
        { name: 'Beauty House', bookings: 76, rating: 4.8, revenue: 304000 },
        { name: 'Glamour Studio', bookings: 67, rating: 4.7, revenue: 268000 },
        { name: 'Elite Salon', bookings: 58, rating: 4.6, revenue: 232000 },
        { name: 'Royal Beauty', bookings: 54, rating: 4.8, revenue: 216000 }
      ];
      setProviderPerformanceData(mockProviderPerformance);

    } catch (error) {
      console.error('Error fetching platform analytics:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };
  const toggleSidebar = () => setSidebarOpen(o => !o);

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card sx={{ minHeight: 120 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h3" component="div" color={`${color}.main`}>
              {loading ? <CircularProgress size={40} /> : value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: `${color}.main`, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <DashboardContainer>
      <EnhancedAppBar
        role="admin"
        user={user}
        onMenuClick={toggleSidebar}
        onLogout={handleLogout}
        title="Admin Dashboard"
        notifications={notificationsList.length}
        notificationsList={notificationsList}
      />
      {newProviderAlert && (
        <Alert
          severity="info"
          sx={{ mx: 3, mt: 2, borderRadius: 2 }}
          onClose={() => setNewProviderAlert(false)}
        >
          A new service provider registration request has been submitted.
        </Alert>
      )}
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />
      
      <Container component="main" maxWidth="xl" sx={{ py: 3, bgcolor: '#FFFFFF' }}>
        {/* Clean Welcome Header */}
        <GlassCard sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" sx={{ 
            color: '#001F3F', 
            fontWeight: 600,
            mb: 1,
            fontSize: '1.4rem'
          }}>
            Platform Analytics Dashboard
          </Typography>
          <Typography variant="body1" sx={{ 
            color: 'rgba(0, 31, 63, 0.7)', 
            fontWeight: 400,
            fontSize: '0.9rem'
          }}>
            Monitor platform performance and manage ecosystem
          </Typography>
        </GlassCard>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Clean Stats Cards */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <GlassCard sx={{ height: 120 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ color: '#001F3F', fontWeight: 600, mb: 0.5 }}>
                    {loading ? <CircularProgress size={24} /> : userCounts.customers}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(0, 31, 63, 0.7)', fontSize: '0.8rem' }}>
                    Customers
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(0, 31, 63, 0.5)', fontSize: '0.7rem' }}>
                    +12% this month
                  </Typography>
                </Box>
              </CardContent>
            </GlassCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <GlassCard sx={{ height: 120 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ color: '#001F3F', fontWeight: 600, mb: 0.5 }}>
                    {loading ? <CircularProgress size={24} /> : userCounts.serviceProviders}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(0, 31, 63, 0.7)', fontSize: '0.8rem' }}>
                    Providers
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(0, 31, 63, 0.5)', fontSize: '0.7rem' }}>
                    +8% this month
                  </Typography>
                </Box>
              </CardContent>
            </GlassCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <GlassCard sx={{ height: 120 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ color: '#001F3F', fontWeight: 600, mb: 0.5 }}>
                    {loading ? <CircularProgress size={24} /> : userCounts.pendingApprovals}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(0, 31, 63, 0.7)', fontSize: '0.8rem' }}>
                    Pending
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(0, 31, 63, 0.5)', fontSize: '0.7rem' }}>
                    Action needed
                  </Typography>
                </Box>
              </CardContent>
            </GlassCard>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <GlassCard sx={{ height: 120 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ color: '#001F3F', fontWeight: 600, mb: 0.5 }}>
                    {loading ? <CircularProgress size={24} /> : userCounts.totalUsers}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(0, 31, 63, 0.7)', fontSize: '0.8rem' }}>
                    Total Users
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(0, 31, 63, 0.5)', fontSize: '0.7rem' }}>
                    Platform total
                  </Typography>
                </Box>
              </CardContent>
            </GlassCard>
          </Grid>
        </Grid>

        {/* Platform Analytics Charts */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <BookingHeatmapChart 
              data={platformHeatmapData} 
              title="Platform Booking Utilization"
              loading={loading}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} lg={8}>
            <RevenueChart 
              data={platformRevenueData}
              title="Platform Revenue Analytics"
              type="area"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <ServicePerformanceChart 
              data={topServicesData}
              title="Top Services"
              type="pie"
              loading={loading}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} lg={6}>
            <ServicePerformanceChart 
              data={topServicesData}
              title="Service Categories"
              type="bar"
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} lg={6}>
            <ServicePerformanceChart 
              data={providerPerformanceData}
              title="Top Providers"
              type="bar"
              loading={loading}
            />
          </Grid>
        </Grid>

        {/* Original charts with updated styling */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 8px rgba(0, 31, 63, 0.08)', height: 300 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#001F3F', fontSize: '1rem', fontWeight: 600 }}>
                New Customers ({year})
              </Typography>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={customerData}>
                  <CartesianGrid strokeDasharray="2 2" stroke="rgba(0, 31, 63, 0.1)" />
                  <XAxis dataKey="name" stroke="#001F3F" fontSize={10} />
                  <YAxis stroke="#001F3F" fontSize={10} />
                  <Tooltip 
                    contentStyle={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(0, 31, 63, 0.2)',
                      borderRadius: '8px',
                      fontSize: '0.75rem'
                    }}
                  />
                  <Line type="monotone" dataKey="customers" stroke="#001F3F" strokeWidth={2} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 8px rgba(0, 31, 63, 0.08)', height: 300 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#001F3F', fontSize: '1rem', fontWeight: 600 }}>
                New Providers ({year})
              </Typography>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart data={providerData}>
                  <CartesianGrid strokeDasharray="2 2" stroke="rgba(0, 31, 63, 0.1)" />
                  <XAxis dataKey="name" stroke="#001F3F" fontSize={10} />
                  <YAxis stroke="#001F3F" fontSize={10} />
                  <Tooltip 
                    contentStyle={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(0, 31, 63, 0.2)',
                      borderRadius: '8px',
                      fontSize: '0.75rem'
                    }}
                  />
                  <Line type="monotone" dataKey="providers" stroke="rgba(0, 31, 63, 0.7)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Earnings Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            sx={{ color: '#003047', fontWeight: 700 }} 
            gutterBottom
          >
            Service Earnings & Appointments
          </Typography>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <TopEarningsGraph />
          </Paper>
        </Box>

        {/* Monthly Revenue & Funnel Section */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,31,63,0.1)' }}>
              <Typography 
                variant="h6" 
                sx={{ color: '#003047', fontWeight: 600 }} 
                gutterBottom
              >
                Monthly Revenue by Service Category
              </Typography>
              <MonthlyRevenueByCategoryChart data={monthlyRevenueByCategory} loading={loading} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,31,63,0.1)' }}>
              <Typography 
                variant="h6" 
                sx={{ color: '#003047', fontWeight: 600 }} 
                gutterBottom
              >
                Provider Onboarding & Approval Funnel
              </Typography>
              <ProviderFunnelChart data={providerFunnelData} loading={loading} />
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </DashboardContainer>
  );
};

export default AdminDashboard;