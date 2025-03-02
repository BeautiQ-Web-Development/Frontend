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
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Header from '../components/Header';
import Footer from '../components/footer';
import PersonIcon from '@mui/icons-material/Person';
import { register } from '../services/auth';
import SuccessDialog from '../components/SuccessDialog';

const CustomerRegister = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    currentAddress: '',
    emailAddress: '',
    mobileNumber: '',
    newPassword: '',
    confirmPassword: '',
    agreeToTerms: false 
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (passwordError && (name === 'newPassword' || name === 'confirmPassword')) {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      alert('You must agree to the terms and conditions');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    try {
      const userData = {
        fullName: formData.fullName,
        currentAddress: formData.currentAddress,
        emailAddress: formData.emailAddress,
        mobileNumber: formData.mobileNumber,
        password: formData.newPassword
      };

      const response = await register(userData, 'customer');
      console.log('Registration successful:', response);
      setOpenDialog(true);
      // Dialog will automatically redirect after closing
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message || 'Registration failed. Please try again.');
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
          Welcome to Our Customer Register Page
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
            position: 'relative',
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
              sx={{ mb: 2 }}
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
        disabled={!formData.agreeToTerms} // Add this line to disable button if terms not accepted
        sx={{
          mt: 1,
          mb: 2,
          py: 1.5,
          bgcolor: 'black',
          color: 'white',
          borderRadius: '4px',
          '&:hover': {
            bgcolor: '#333',
          }
        }}
      >
        Register
      </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Have another account?{' '}
                <Link component={RouterLink} to="/customer-login" sx={{ textDecoration: 'none' }}>
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
      <Footer />
      <SuccessDialog
        open={openDialog}
        message="Account created successfully! You will be redirected to login."
        onClose={handleDialogClose}
      />
    </Box>
  );
};

export default CustomerRegister;