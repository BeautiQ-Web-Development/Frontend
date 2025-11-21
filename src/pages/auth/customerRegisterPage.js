import React, { useState, useEffect } from 'react';
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
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Header from '../../components/Header';
import Footer from '../../components/footer';
import { register, checkAdminExists } from '../../services/auth';
import SuccessDialog from '../../components/SuccessDialog';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
import { 
  validateEmail, 
  validatePassword, 
  validateMobileNumber,
  validateNIC,
  validateName, 
  validateAddress,
  validateBusinessName,
  validateServiceData
} from '../../utils/validation';

const CustomerRegister = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    currentAddress: '',
    emailAddress: '',
    mobileNumber: '',
    nicNumber: '',                // added NIC state
    newPassword: '',
    confirmPassword: '',
    agreeToTerms: false,
    profilePhoto: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [error, setError] = useState('');
  const [adminExists, setAdminExists] = useState(null); // null = checking, true/false = result
  const [systemCheckLoading, setSystemCheckLoading] = useState(true);

  const navigate = useNavigate();

  // Check if admin exists on component mount
  useEffect(() => {
    const checkSystem = async () => {
      try {
        const response = await checkAdminExists();
        setAdminExists(response.adminExists);
      } catch (err) {
        console.error('Failed to check system status:', err);
        setError('Unable to verify system status. Please try again later.');
      } finally {
        setSystemCheckLoading(false);
      }
    };
    checkSystem();
  }, []);
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
    
    // Clear password error when user types
    if (passwordError && (name === 'newPassword' || name === 'confirmPassword')) {
      setPasswordError('');
    }
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    const errors = {};
    
    // Name validation
    const nameErrors = validateName(formData.fullName, 'Full name');
    if (nameErrors.length > 0) errors.fullName = nameErrors[0];
    
    // Email validation
    const emailErrors = validateEmail(formData.emailAddress);
    if (emailErrors.length > 0) errors.emailAddress = emailErrors[0];
      // Mobile number validation
    const mobileErrors = validateMobileNumber(formData.mobileNumber);
    if (mobileErrors.length > 0) {
      errors.mobileNumber = mobileErrors[0];
    }
    
    // NIC validation
    const nicErrors = validateNIC(formData.nicNumber);
    if (nicErrors.length > 0) errors.nicNumber = nicErrors[0];

    // Password validation
    const passwordErrors = validatePassword(formData.newPassword);
    if (passwordErrors.length > 0) errors.newPassword = passwordErrors[0];
    
    // Address validation
    if (!formData.currentAddress || formData.currentAddress.trim().length < 10) {
      errors.currentAddress = 'Address must be at least 10 characters long';
    }
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setError('Please fix validation errors');
      setSnackbarOpen(true);
      return;
    }
    
    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      setSnackbarOpen(true);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setLoading(true); // Start loading

    try {
      const userData = new FormData();
      userData.append('fullName', formData.fullName);
      userData.append('currentAddress', formData.currentAddress);
      userData.append('emailAddress', formData.emailAddress);
      userData.append('mobileNumber', formData.mobileNumber);
      userData.append('nicNumber', formData.nicNumber);
      userData.append('password', formData.newPassword);
      
      if (formData.profilePhoto) {
        userData.append('profilePhoto', formData.profilePhoto);
      }

      const response = await register(userData, 'customer');
      console.log('Registration successful:', response);
      setOpenDialog(true);
      // Dialog will automatically redirect after closing
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    navigate('/customer-login');
  };
  // Show loading while checking system status
  if (systemCheckLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container component="main" maxWidth="md" sx={{ flexGrow: 1, py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Container>
        <Footer />
      </Box>
    );
  }

  return (    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
            Welcome to Our Customer Register Page
          </Typography>
        </Box>

        {/* Warning if admin doesn't exist */}
        {adminExists === false && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>System Not Initialized</Typography>
            <Typography>
              An administrator account must be created first before customers can register. 
              Please contact the system administrator or{' '}
              <Link component={RouterLink} to="/admin-register" sx={{ fontWeight: 'bold' }}>
                create an admin account
              </Link>{' '}
              to initialize the system.
            </Typography>
          </Alert>
        )}
        
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
            position: 'relative',
            opacity: adminExists === false ? 0.6 : 1,
            pointerEvents: adminExists === false ? 'none' : 'auto',
          }}
        >
          {/* Profile icon */}
          {/* <Box 
            sx={{ 
              position: 'absolute', 
              top: -30,
              right: 40,
              width: 60, 
              height: 60, 
              bgcolor: '#1976d2', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PersonIcon sx={{ color: 'white', fontSize: 32 }} />
          </Box> */}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>            <TextField
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
              error={!!validationErrors.fullName}
              helperText={validationErrors.fullName}
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
              placeholder="Enter your current address"
              value={formData.currentAddress}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
              error={!!validationErrors.currentAddress}
              helperText={validationErrors.currentAddress || 'Must be at least 10 characters long'}
            />
              <TextField
              margin="normal"
              required
              fullWidth
              id="emailAddress"
              label="Email Address"
              name="emailAddress"
              placeholder="Enter your Email address"
              value={formData.emailAddress}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
              type="email"
              error={!!validationErrors.emailAddress}
              helperText={validationErrors.emailAddress}
            />
              <TextField
              margin="normal"
              required
              fullWidth
              id="mobileNumber"
              label="Tele Phone Number"
              name="mobileNumber"
              placeholder="Enter your Mobile Number"
              value={formData.mobileNumber}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
              error={!!validationErrors.mobileNumber}
              helperText={validationErrors.mobileNumber || 'e.g., 0771234567 or +94771234567'}
            />
              <TextField
              margin="normal"
              required
              fullWidth
              id="nicNumber"
              label="NIC Number"
              name="nicNumber"
              placeholder="Enter your NIC number"
              value={formData.nicNumber}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 2 }}
              error={!!validationErrors.nicNumber}
              helperText={validationErrors.nicNumber || 'e.g., 123456789V or 199812345678'}
            />
              <TextField
              margin="normal"
              required
              fullWidth
              id="newPassword"
              label="New Password"
              name="newPassword"
              placeholder="Enter your New Password"
              value={formData.newPassword}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 0 }}
              type={showPassword ? 'text' : 'password'}
              error={!!validationErrors.newPassword}
              helperText={validationErrors.newPassword}
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
            <PasswordStrengthIndicator password={formData.newPassword} />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="confirmPassword"
              label="Confirm New Password"
              name="confirmPassword"
              placeholder="Enter your New Password again"
              value={formData.confirmPassword}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 3 }}
              type={showConfirmPassword ? 'text' : 'password'}
              error={Boolean(passwordError)}
              helperText={passwordError}
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
               <FormControlLabel
        control={
          <Checkbox
            checked={formData.agreeToTerms}
            onChange={handleChange}
            name="agreeToTerms"
            color="primary"
          />
        }
        label={
          <Typography variant="body2">
            I agree to the Privacy Policy, Terms of Services & Teams of Business
          </Typography>
        }
        sx={{ mb: 3 }}
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
                  boxShadow: '0 8px 25px rgba(14, 19, 50, 0.3)',
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
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Have another account?{' '}
                <Link
                  component={RouterLink}
                  to="/customer-login"
                  sx={{ color: '#001F3F', textDecoration: 'none' }}
                >
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>      </Container>
      <Footer />
      <SuccessDialog
        open={openDialog}
        message="Account created successfully! You will be redirected to login."
        onClose={handleDialogClose}
      />
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerRegister;