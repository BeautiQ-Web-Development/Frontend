import React, { useEffect, useState } from 'react';
import { Box, Typography, Container } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/footer';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/dashboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    if (user?.token) {
      fetchDashboardData();
    }
  }, [user]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        {dashboardData && (
          // Display dashboard data here
          <Box>
            {/* Add your dashboard content */}
          </Box>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default AdminDashboard;
