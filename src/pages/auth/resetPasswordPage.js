import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  Snackbar,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword as resetPasswordService } from '../../services/auth'; // Import the service
import Header from '../../components/Header';
import Footer from '../../components/footer';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Extract token from URL query params
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      setResetToken(token);
    }
  }, [location]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setSnackbarOpen(true);
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setSnackbarOpen(true);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Use the service function instead of direct axios call
      const response = await resetPasswordService(resetToken, newPassword);
      
      console.log('Reset password response:', response);
      
      setSuccess(true);
      setSnackbarOpen(true);
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        // Redirect based on role if available
        if (response.userRole === 'admin') {
          navigate('/login');
        } else if (response.userRole === 'serviceProvider') {
          navigate('/service-provider-login');
        } else if (response.userRole === 'customer') {
          navigate('/customer-login');
        } else {
          // Default redirect
          navigate('/login');
        }
      }, 2000);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.message || 'Failed to reset password. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" maxWidth="md" sx={{ flexGrow: 1, py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          align="center"
          color="primary"
          fontWeight="bold"
          sx={{ mb: 4 }}
        >
          Reset Your Password
        </Typography>
        
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
          {success ? (
            <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
              Password reset successful! Redirecting to login page...
            </Alert>
          ) : (
            <Box component="form" onSubmit={handleResetPassword} sx={{ width: '100%' }}>
              {!resetToken && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="resetToken"
                  label="Reset Token"
                  name="resetToken"
                  placeholder="Enter the reset token from your email"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  variant="outlined"
                  sx={{ mb: 3 }}
                />
              )}
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="newPassword"
                label="New Password"
                name="newPassword"
                placeholder="Enter your new password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                variant="outlined"
                sx={{ mb: 3 }}
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
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="confirmPassword"
                label="Confirm Password"
                name="confirmPassword"
                placeholder="Confirm your new password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                variant="outlined"
                sx={{ mb: 4 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
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
                  py: 1.5,
                  bgcolor: '#003047',
                  color: 'white',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  '&:hover': {
                    bgcolor: '#003047',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 8px 25px rgba(21, 20, 44, 0.3)',
                  },
                  '&:disabled': {
                    bgcolor: '#B0BEC5',
                    color: '#FFFFFF',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Reset Password'
                )}
              </Button>
            </Box>
          )}
        </Paper>
        
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={success ? "success" : "error"} 
            sx={{ width: '100%' }}
          >
            {success ? 'Password reset successful!' : error}
          </Alert>
        </Snackbar>
      </Container>
      <Footer />
    </Box>
  );
};

export default ResetPassword;