import React from 'react';
import { Box, Typography, Container, Button, Paper } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/footer';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/customer-login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, {user?.fullName}!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Email: {user?.emailAddress}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Phone: {user?.mobileNumber}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogout}
            sx={{ mt: 2 }}
          >
            Logout
          </Button>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default CustomerDashboard;
