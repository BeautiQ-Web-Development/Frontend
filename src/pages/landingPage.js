import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/footer';
import { getStats } from '../services/services';

const LandingPage = () => {
  const [stats, setStats] = useState({ customers: 0, providers: 0, services: 0 });

  useEffect(() => {
    (async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    })();
  }, []);

  return (
    <Box>
      <Header />
      {/* Introduction Section */}
      <Box sx={{ py: 8, px: 4, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700 , color: '#001F3F' }}>
          Welcome to BeautiQ
        </Typography>
        <Typography variant="h6" color="textSecondary" sx={{ maxWidth: 600, margin: '0 auto' }}>
          Discover premium beauty services at your fingertips. From hair styling to manicure, we connect you with top professionals in your area, ensuring a flawless experience every time.
        </Typography>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, px: 4 }}>
        <Grid container spacing={4} justifyContent="center">
          {['customers', 'providers', 'services'].map((key, idx) => (
            <Grid item xs={12} sm={4} key={idx}>
              <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#001F3F'}}>
                  {stats[key].toLocaleString()}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Why Choose BeautiQ? Details Section */}
      <Box sx={{ py: 6, px: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, textAlign: 'center' , color: '#001F3F'}}>
          Why Choose BeautiQ?
        </Typography>
        <Grid container spacing={4} sx={{ maxWidth: 1000, margin: '0 auto' }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: 600 , color: '#001F3F'}}>
              Verified Professionals
            </Typography>
            <Typography variant="body1" color="textSecondary">
              All service providers are vetted and reviewed to ensure top-quality service every time.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: 600 , color: '#001F3F'}}>
              Secure Payments
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Safe and secure checkout with multiple payment options, powered by Stripe.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: 600 , color: '#001F3F'}}>
              Flexible Scheduling
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Book services at a time that suits you, with easy rescheduling options.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#001F3F' }}>
              Customer Support
            </Typography>
            <Typography variant="body1" color="textSecondary">
              24/7 support to help you with any questions or concerns.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
};

export default LandingPage;