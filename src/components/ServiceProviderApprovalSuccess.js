import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Card,
  CardContent
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './footer';

const ServiceProviderApprovalSuccess = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header showBackButton onBackClick={() => navigate('/')} />
      
      <Container component="main" maxWidth="md" sx={{ flexGrow: 1, py: 6 }}>
        <Paper 
          elevation={4} 
          sx={{ 
            p: 6, 
            textAlign: 'center',
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }}
        >
          <CheckCircleIcon 
            sx={{ 
              fontSize: 80, 
              color: '#4caf50', 
              mb: 3 
            }} 
          />
          
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight="bold" 
            color="primary"
            gutterBottom
          >
            Registration Submitted!
          </Typography>
          
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
          >
            Thank you for applying to become a service provider on BeautiQ. 
            Your registration has been successfully submitted and is now under review.
          </Typography>

          <Box sx={{ mb: 4 }}>
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ScheduleIcon color="primary" />
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="h6" fontWeight="bold">
                    Review Process
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Our team will review your application within 2-3 business days
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <EmailIcon color="primary" />
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="h6" fontWeight="bold">
                    Email Notification
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You'll receive an email notification once your application is approved
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            <strong>What happens next?</strong><br/>
            1. Our team reviews your documents and information<br/>
            2. We verify your credentials and certifications<br/>
            3. Once approved, you'll receive login credentials<br/>
            4. You can start offering your services on BeautiQ!
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/')}
              sx={{
                bgcolor: '#003047',
                '&:hover': { bgcolor: '#003047' },
                px: 4
              }}
            >
              Return to Home
            </Button>
              <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/service-provider-login')}
              sx={{ px: 4 }}
            >
              Go to Login
            </Button>
          </Box>

          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ mt: 4, fontStyle: 'italic' }}
          >
            Questions? Contact our support team at support@beautiq.lk
          </Typography>
        </Paper>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default ServiceProviderApprovalSuccess;
