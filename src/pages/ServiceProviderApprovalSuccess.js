import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/footer';

const ServiceProviderApprovalSuccess = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" maxWidth="sm" sx={{ flexGrow: 1, py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: '16px',
            border: '1px solid rgba(0, 0, 0, 0.12)',
          }}
        >
          <CheckCircleOutlineIcon 
            color="success" 
            sx={{ fontSize: 64, mb: 2 }} 
          />
          
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Congratulations!
          </Typography>
          
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Your service provider account has been approved
          </Typography>
          
          <Typography variant="body1" align="center" sx={{ mb: 4 }}>
            You can now log in to your dashboard and start offering your services to customers.
          </Typography>
          
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/service-provider-login')}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: '8px',
              fontSize: '1.1rem'
            }}
          >
            Login Now
          </Button>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default ServiceProviderApprovalSuccess;
