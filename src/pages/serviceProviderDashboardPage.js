import React from 'react';
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
  IconButton
} from '@mui/material';
import {
  Store as StoreIcon,
  Person as PersonIcon,
  EventAvailable as EventIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';

const ServiceProviderDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/service-provider-login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Custom AppBar with Logout */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BeautiQ Service Provider Dashboard
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {/* Welcome Section */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            Welcome, {user?.businessName || user?.fullName}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your beauty services and appointments
          </Typography>
        </Paper>

        {/* Dashboard Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: '#e3f2fd', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Customers</Typography>
                </Box>
                <Typography variant="h3">0</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: '#e8f5e9', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EventIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Appointments</Typography>
                </Box>
                <Typography variant="h3">0</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card sx={{ bgcolor: '#fff3e0', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StoreIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Services Offered</Typography>
                </Box>
                <Typography variant="h3">{user?.services?.length || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                sx={{ py: 2 }}
                onClick={() => {/* Add functionality */}}
              >
                Manage Services
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                sx={{ py: 2 }}
                onClick={() => {/* Add functionality */}}
              >
                View Appointments
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                sx={{ py: 2 }}
                onClick={() => {/* Add functionality */}}
              >
                Update Profile
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                sx={{ py: 2 }}
                onClick={() => {/* Add functionality */}}
              >
                View Analytics
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
