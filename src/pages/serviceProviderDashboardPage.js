import React, { useState, useEffect } from 'react';
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
  Toolbar
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
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';
import ServiceProviderSidebar from '../components/ServiceProviderSidebar';
import axios from 'axios';

const ServiceProviderDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [serviceCount, setServiceCount] = useState(0);

  useEffect(() => {
    fetchServiceCount();
  }, []);

  const fetchServiceCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/services/my-services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setServiceCount(response.data.services?.length || 0);
      }
    } catch (err) {
      console.error('Error fetching service count:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/service-provider-login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>      {/* Custom AppBar with Logout */}
      <AppBar position="static" sx={{ bgcolor: '#075B5E' }}> {/* Deep teal */}
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#FFFFFF', fontWeight: 600 }}>
            BeautiQ Service Provider Dashboard
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ color: '#FFFFFF', fontWeight: 600 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {/* Welcome Section */}
        <Paper sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3, 
          background: 'linear-gradient(135deg, #F8F8FF 0%, #E6F7F8 100%)', 
          border: '1px solid #075B5E',
          boxShadow: '0 8px 25px rgba(7, 91, 94, 0.2)'
        }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#075B5E', fontWeight: 'bold' }}>
            Welcome, {user?.businessName || user?.fullName}!
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#2E2E2E', fontWeight: 500 }}>
            Manage your beauty services and appointments
          </Typography>
        </Paper>

        {/* Dashboard Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #075B5E 0%, #2A7B7E 100%)', 
              height: '100%', 
              color: 'white',
              boxShadow: '0 8px 20px rgba(7, 91, 94, 0.3)',
              borderRadius: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ServiceIcon sx={{ mr: 1, color: '#E6F7F8', fontSize: 35 }} />
                  <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>My Services</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                  {user?.services?.length || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #2A7B7E 0%, #E6F7F8 100%)', 
              height: '100%', 
              color: 'white',
              boxShadow: '0 8px 20px rgba(42, 123, 126, 0.3)',
              borderRadius: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PackageIcon sx={{ mr: 1, color: '#075B5E', fontSize: 35 }} />
                  <Typography variant="h6" sx={{ color: '#075B5E', fontWeight: 600 }}>My Packages</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: '#075B5E', fontWeight: 700 }}>2</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #E6F7F8 0%, #075B5E 100%)', 
              height: '100%', 
              color: 'white',
              boxShadow: '0 8px 20px rgba(230, 247, 248, 0.3)',
              borderRadius: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EventIcon sx={{ mr: 1, color: '#E6F7F8', fontSize: 35 }} />
                  <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>Bookings</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: '#FFFFFF', fontWeight: 700 }}>12</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(45deg, #075B5E 30%, #2A7B7E 90%)', 
              height: '100%', 
              color: 'white',
              boxShadow: '0 8px 20px rgba(7, 91, 94, 0.3)',
              borderRadius: 3
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BusinessIcon sx={{ mr: 1, color: '#E6F7F8', fontSize: 35 }} />
                  <Typography variant="h6" sx={{ color: '#FFFFFF', fontWeight: 600 }}>Revenue</Typography>
                </Box>
                <Typography variant="h3" sx={{ color: '#FFFFFF', fontWeight: 700 }}>45K</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Paper sx={{ 
          p: 3, 
          borderRadius: 3, 
          bgcolor: '#F8F8FF', 
          border: '2px solid #075B5E',
          boxShadow: '0 8px 25px rgba(7, 91, 94, 0.15)'
        }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#075B5E', fontWeight: 'bold' }}>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<ServiceIcon />}
                sx={{ 
                  py: 2, 
                  bgcolor: '#075B5E', 
                  '&:hover': { 
                    bgcolor: '#054548',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(7, 91, 94, 0.4)'
                  },
                  color: 'white',
                  borderRadius: 3,
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => navigate('/service-management')}
              >
                Manage Services
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<EventIcon />}
                sx={{ 
                  py: 2, 
                  bgcolor: '#2A7B7E', 
                  '&:hover': { 
                    bgcolor: '#1E5F62',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(42, 123, 126, 0.4)'
                  },
                  color: 'white',
                  borderRadius: 3,
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => {/* Add functionality */}}
              >
                View Bookings
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ScheduleIcon />}
                sx={{ 
                  py: 2, 
                  borderColor: '#075B5E',
                  color: '#075B5E',
                  '&:hover': { 
                    bgcolor: '#E6F7F8',
                    borderColor: '#054548',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(7, 91, 94, 0.2)'
                  },
                  borderRadius: 3,
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => {/* Add functionality */}}
              >
                Availability
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PersonIcon />}
                sx={{ 
                  py: 2, 
                  borderColor: '#2A7B7E',
                  color: '#2A7B7E',
                  '&:hover': { 
                    bgcolor: '#E6F7F8',
                    borderColor: '#1E5F62',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(42, 123, 126, 0.2)'
                  },
                  borderRadius: 3,
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => {/* Add functionality */}}
              >
                My Profile
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default ServiceProviderDashboard;
