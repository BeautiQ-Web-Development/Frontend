// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Paper,
//   Container,
//   InputAdornment,
//   IconButton,
// } from '@mui/material';
// import { useNavigate, useLocation } from 'react-router-dom';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import { resetPassword } from '../services/auth';
// import Header from '../components/Header';
// import Footer from '../components/footer';

// const ResetPassword = () => {
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // Get reset token from URL query parameters
//   const queryParams = new URLSearchParams(location.search);
//   const resetToken = queryParams.get('token');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!resetToken) {
//       setError('Invalid reset token');
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     if (newPassword.length < 6) {
//       setError('Password must be at least 6 characters long');
//       return;
//     }

//     try {
//       const response = await resetPassword(resetToken, newPassword);
//       if (response.success) {
//         alert('Password reset successful!');
//         navigate('/customer-login');
//       } else {
//         setError(response.message || 'Failed to reset password');
//       }
//     } catch (err) {
//       console.error('Reset password error:', err);
//       setError(err.message || 'Failed to reset password. Please try again.');
//     }
//   };

//   // Add validation for token presence
//   useEffect(() => {
//     if (!resetToken) {
//       setError('Invalid or missing reset token');
//     }
//   }, [resetToken]);

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//       <Header />
//       <Container component="main" maxWidth="md" sx={{ flexGrow: 1, py: 4 }}>
//         <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
//           <Typography variant="h5" component="h1" gutterBottom>
//             Reset Password
//           </Typography>
          
//           <Box component="form" onSubmit={handleSubmit}>
//             <TextField
//               fullWidth
//               margin="normal"
//               label="New Password"
//               type={showPassword ? 'text' : 'password'}
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       onClick={() => setShowPassword(!showPassword)}
//                       edge="end"
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
            
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Confirm Password"
//               type={showPassword ? 'text' : 'password'}
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//             />
            
//             {error && (
//               <Typography color="error" sx={{ mt: 2 }}>
//                 {error}
//               </Typography>
//             )}
            
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 3 }}
//             >
//               Reset Password
//             </Button>
//           </Box>
//         </Paper>
//       </Container>
//       <Footer />
//     </Box>
//   );
// };

// export default ResetPassword;

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
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/footer';

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
  const [userRole, setUserRole] = useState('');

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
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        resetToken,
        newPassword
      });
      
      console.log('Reset password response:', response.data);
      
      setSuccess(true);
      setSnackbarOpen(true);
      
      // Store user role for redirect
      if (response.data.userRole) {
        setUserRole(response.data.userRole);
      }
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        // Redirect based on role if available
        if (response.data.userRole === 'admin') {
          navigate('/login');
        } else if (response.data.userRole === 'serviceProvider') {
          navigate('/service-provider-login');
        } else if (response.data.userRole === 'customer') {
          navigate('/customer-login');
        } else {
          // Default redirect
          navigate('/login');
        }
      }, 2000);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
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
                  bgcolor: '#1976d2',
                  color: 'white',
                  borderRadius: '4px',
                  '&:hover': {
                    bgcolor: '#1565c0',
                  }
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