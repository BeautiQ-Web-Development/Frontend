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
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { register } from '../../services/auth';
import Header from '../../components/Header';
import Footer from '../../components/footer';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    currentAddress: '',
    emailAddress: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    role: 'admin',
    profilePhoto: null
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }
    
    try {
      const userData = new FormData();
      userData.append('fullName', formData.fullName);
      userData.append('currentAddress', formData.currentAddress);
      userData.append('emailAddress', formData.emailAddress);
      userData.append('mobileNumber', formData.mobileNumber);
      userData.append('password', formData.password);
      userData.append('role', 'admin');
      
      if (formData.profilePhoto) {
        userData.append('profilePhoto', formData.profilePhoto);
      }

      await register(userData, 'admin');
      setSuccess(true);
      
      // Redirect to login after successful registration
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      
      // Check if error is due to admin already existing
      if (err.adminExists) {
        setAdminExists(true);
        setDialogOpen(true);
      } else {
        setError(err.message || 'Registration failed. Please try again.');
        setSnackbarOpen(true);
      }
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    // Redirect to login page if admin already exists
    if (adminExists) {
      navigate('/login');
    }
  };  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" maxWidth="md" sx={{ flexGrow: 1, py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={() => navigate('/')}
            sx={{ mr: 2, color: '#003047' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            component="h1"
            sx={{ color: '#003047', fontWeight: 'bold' }}
          >
             Admin Registration
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
          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
              Registration successful! Redirecting to login...
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="Full Name"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            {/* Profile Photo Upload */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ mb: 1, color: '#003047', fontWeight: 500 }}>
                Profile Photo (Optional)
              </Typography>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{
                  py: 1.5,
                  borderColor: '#003047',
                  color: '#003047',
                  '&:hover': {
                    borderColor: '#003047',
                    bgcolor: 'rgba(0, 48, 71, 0.04)'
                  }
                }}
              >
                {formData.profilePhoto ? formData.profilePhoto.name : 'Choose Profile Photo'}
                <input
                  type="file"
                  name="profilePhoto"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>
              {formData.profilePhoto && (
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'success.main' }}>
                  ✓ Photo selected: {formData.profilePhoto.name}
                </Typography>
              )}
            </Box>
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="currentAddress"
              label="Current Address"
              name="currentAddress"
              placeholder="Enter your address"
              value={formData.currentAddress}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="emailAddress"
              label="Email Address"
              name="emailAddress"
              placeholder="Enter your email"
              type="email"
              value={formData.emailAddress}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="mobileNumber"
              label="Mobile Number"
              name="mobileNumber"
              placeholder="Enter your mobile number"
              value={formData.mobileNumber}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
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
              sx={{ mb: 0 }}
              type={showPassword ? 'text' : 'password'}
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
            />
            {/* Password Strength Indicator */}
            <PasswordStrengthIndicator password={formData.password} />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmPassword"
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 3 }}
              type={showConfirmPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
              <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                bgcolor: '#003047', // Deep teal
                color: 'white',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '1rem',
                '&:hover': {
                  bgcolor: '#003047', // Darker teal
                  transform: 'translateY(-1px)',
                  boxShadow: '0 8px 25px rgba(15, 15, 53, 0.3)',
                },
                '&:disabled': {
                  bgcolor: '#B0BEC5',
                  color: '#FFFFFF',
                },
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Already have an admin account?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{ color: '#001F3F', textDecoration: 'none' }}
                >
                  Login here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
        
        {/* Error Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity="error" 
            sx={{ width: '100%' }}
          >
            {error}
          </Alert>
        </Snackbar>
        
        {/* Admin Exists Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Admin Account Already Exists"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              There can only be one admin account in the system. Please log in with the existing admin credentials or contact support if you need to reset the admin password.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Footer />
    </Box>
  );
};

export default AdminRegister;