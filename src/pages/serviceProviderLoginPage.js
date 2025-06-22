import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/footer';
import { validateEmail } from '../utils/validation';

const ServiceProviderLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    emailAddress: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingApproval, setPendingApproval] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear validation errors when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPendingApproval(false);
    
    // Validation
    const errors = {};
    const emailErrors = validateEmail(formData.emailAddress);
    if (emailErrors.length > 0) errors.emailAddress = emailErrors[0];
    
    if (!formData.password) errors.password = 'Password is required';
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setError('Please fix validation errors');
      setSnackbarOpen(true);
      return;
    }
    
    setLoading(true);

    try {
      console.log('Service Provider login attempt:', formData.emailAddress);

      const response = await login({
        emailAddress: formData.emailAddress,
        password: formData.password
      }, 'serviceProvider'); // Explicitly specify serviceProvider role

      console.log('Service Provider login response:', response);

      // Additional validation - ensure we got a service provider back
      if (!response.user || response.user.role !== 'serviceProvider') {
        throw new Error('Invalid account type. Please use service provider credentials.');
      }

      // Check the response
      if (response.user.approved) {
        navigate('/service-provider-dashboard');
      } else {
        setPendingApproval(true);
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error('Service Provider login failed:', err);
      
      if (err.pendingApproval) {
        setPendingApproval(true);
        setError('Your account is pending approval.');
      } else {
        setError(err.message || 'Invalid service provider credentials. Please try again.');
      }
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  return (    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" maxWidth="md" sx={{ flexGrow: 1, py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={() => navigate('/')}
            sx={{ mr: 2, color: '#075B5E' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            component="h1"
            color="primary"
            fontWeight="bold"
          >
            Welcome to Service Provider Login
          </Typography>
        </Box>
        
        <Paper
          elevation={0}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: '30px',
            border: '1px solid rgba(0, 0, 0, 0.12)',
            mx: 'auto',
            width: '100%',
            maxWidth: '600px',
            bgcolor: 'background.paper',
          }}
        >
          {pendingApproval && (
            <Alert 
              severity="info" 
              sx={{ width: '100%', mb: 3 }}
            >
              Your account is pending admin approval. You will be notified once approved.
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="emailAddress"
              label="Email Address"
              name="emailAddress"
              placeholder="example@gmail.com"
              value={formData.emailAddress}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 3 }}
              type="email"
              error={!!validationErrors.emailAddress}
              helperText={validationErrors.emailAddress}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
              type={showPassword ? 'text' : 'password'}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Link component={RouterLink} to="/forgot-password" variant="body2">
                Forgot Password?
              </Link>
            </Box>
              <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 1,
                mb: 2,
                py: 1.5,
                bgcolor: '#075B5E', // Deep teal
                color: 'white',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: '#054548', // Darker teal
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 25px rgba(7, 91, 94, 0.3)',
                },
                '&:disabled': {
                  bgcolor: '#B0BEC5',
                  color: '#FFFFFF',
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/service-provider-register" sx={{ textDecoration: 'none' }}>
                  Register here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
        
        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={pendingApproval ? "info" : "error"} 
            sx={{ width: '100%' }}
          >
            {pendingApproval 
              ? "Your account is pending admin approval. You will be notified once approved." 
              : error}
          </Alert>
        </Snackbar>
      </Container>
      <Footer />
    </Box>
  );
};

export default ServiceProviderLogin;