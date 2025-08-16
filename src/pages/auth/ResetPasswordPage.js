// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams, useLocation } from 'react-router-dom';
// import {
//   Box,
//   Container,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   Alert,
//   InputAdornment,
//   IconButton,
//   CircularProgress,
//   Link
// } from '@mui/material';
// import {
//   Visibility as VisibilityIcon,
//   VisibilityOff as VisibilityOffIcon,
//   Lock as LockIcon
// } from '@mui/icons-material';
// import { resetPassword } from '../../services/auth';
// import { validatePassword } from '../../utils/validation';
// import Header from '../../components/Header';
// import Footer from '../../components/footer';

// const ResetPasswordPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { token } = useParams();
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(false);
//   const [validationError, setValidationError] = useState('');
//   const [passwordMismatch, setPasswordMismatch] = useState(false);
//   const [countdown, setCountdown] = useState(5);

//   // Extract token from URL query params if not in params
//   useEffect(() => {
//     if (!token) {
//       const queryParams = new URLSearchParams(location.search);
//       const tokenFromQuery = queryParams.get('token');
//       if (tokenFromQuery) {
//         // We have a token in query params, continue
//       } else {
//         setError('Invalid or missing password reset token. Please request a new password reset link.');
//       }
//     }
//   }, [token, location.search]);

//   // Countdown timer after successful reset
//   useEffect(() => {
//     if (success && countdown > 0) {
//       const timer = setTimeout(() => {
//         setCountdown(countdown - 1);
//       }, 1000);
//       return () => clearTimeout(timer);
//     } else if (success && countdown === 0) {
//       navigate('/login');
//     }
//   }, [success, countdown, navigate]);

//   const handlePasswordChange = (e) => {
//     setNewPassword(e.target.value);
//     setValidationError('');
//     setPasswordMismatch(false);
//   };

//   const handleConfirmPasswordChange = (e) => {
//     setConfirmPassword(e.target.value);
//     setPasswordMismatch(e.target.value !== newPassword);
//   };

//   const validateForm = () => {
//     // Validate password strength
//     const passwordErrors = validatePassword(newPassword);
//     if (passwordErrors.length > 0) {
//       setValidationError(passwordErrors[0]);
//       return false;
//     }

//     // Check if passwords match
//     if (newPassword !== confirmPassword) {
//       setPasswordMismatch(true);
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     try {
//       setLoading(true);
//       setError('');
      
//       // Use token from params or query string
//       const resetToken = token || new URLSearchParams(location.search).get('token');
      
//       if (!resetToken) {
//         setError('Invalid or missing password reset token. Please request a new password reset link.');
//         return;
//       }
      
//       const response = await resetPassword(resetToken, newPassword);
      
//       if (response.success) {
//         setSuccess(true);
//         // Clear form
//         setNewPassword('');
//         setConfirmPassword('');
//       } else {
//         setError(response.message || 'Failed to reset password. The link may have expired.');
//       }
//     } catch (err) {
//       setError(err.message || 'An error occurred while resetting your password.');
//       console.error('Password reset error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//       <Header />
//       <Container component="main" maxWidth="sm" sx={{ flexGrow: 1, py: 8 }}>
//         <Paper
//           elevation={3}
//           sx={{
//             p: 4,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             borderRadius: 3
//           }}
//         >
//           <Box
//             sx={{
//               mb: 3,
//               p: 2,
//               bgcolor: '#003047',
//               borderRadius: '50%',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center'
//             }}
//           >
//             <LockIcon sx={{ fontSize: 40, color: 'white' }} />
//           </Box>

//           <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
//             Reset Your Password
//           </Typography>

//           {error && (
//             <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
//               {error}
//             </Alert>
//           )}

//           {success ? (
//             <Box sx={{ textAlign: 'center' }}>
//               <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
//                 Your password has been successfully reset!
//               </Alert>
//               <Typography variant="body1" sx={{ mb: 3 }}>
//                 You will be redirected to the login page in {countdown} seconds.
//               </Typography>
//               <Button 
//                 variant="contained" 
//                 onClick={() => navigate('/login')}
//                 sx={{ bgcolor: '#003047' }}
//               >
//                 Go to Login Now
//               </Button>
//             </Box>
//           ) : (
//             <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
//               <Typography variant="body2" sx={{ mb: 3 }}>
//                 Please enter your new password below. Password must be at least 8 characters
//                 and include uppercase, lowercase, number, and special character.
//               </Typography>

//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="password"
//                 label="New Password"
//                 type={showPassword ? 'text' : 'password'}
//                 id="password"
//                 autoComplete="new-password"
//                 value={newPassword}
//                 onChange={handlePasswordChange}
//                 error={!!validationError}
//                 helperText={validationError}
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton
//                         onClick={() => setShowPassword(!showPassword)}
//                         edge="end"
//                       >
//                         {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{ mb: 2 }}
//               />

//               <TextField
//                 margin="normal"
//                 required
//                 fullWidth
//                 name="confirmPassword"
//                 label="Confirm New Password"
//                 type={showConfirmPassword ? 'text' : 'password'}
//                 id="confirmPassword"
//                 autoComplete="new-password"
//                 value={confirmPassword}
//                 onChange={handleConfirmPasswordChange}
//                 error={passwordMismatch}
//                 helperText={passwordMismatch ? "Passwords don't match" : ""}
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                         edge="end"
//                       >
//                         {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//                 sx={{ mb: 3 }}
//               />

//               <Button
//                 type="submit"
//                 fullWidth
//                 variant="contained"
//                 disabled={loading}
//                 sx={{
//                   mt: 2,
//                   mb: 2,
//                   py: 1.5,
//                   bgcolor: '#003047',
//                   color: 'white',
//                   borderRadius: 2,
//                   fontWeight: 'bold',
//                   fontSize: '1rem',
//                   '&:hover': {
//                     bgcolor: '#003047',
//                     transform: 'translateY(-1px)',
//                     boxShadow: '0 8px 25px rgba(14, 19, 50, 0.3)',
//                   },
//                 }}
//               >
//                 {loading ? <CircularProgress size={24} /> : 'Reset Password'}
//               </Button>
//             </Box>
//           )}
//         </Paper>
//       </Container>
//       <Footer />
//     </Box>
//   );
// };

// export default ResetPasswordPage;

// ✅ FIX 2: Update ResetPasswordPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Link
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { resetPassword } from '../../services/auth';
import { validatePassword } from '../../utils/validation';
import Header from '../../components/Header';
import Footer from '../../components/footer';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [resetToken, setResetToken] = useState(null);

  // ✅ ENHANCED: Extract token from URL params OR query string
  useEffect(() => {
    let tokenToUse = null;
    
    // Try to get token from URL parameters first
    if (token) {
      tokenToUse = token;
      console.log('✅ Token found in URL params:', token.substring(0, 10) + '...');
    } else {
      // Try to get token from query string
      const queryParams = new URLSearchParams(location.search);
      const tokenFromQuery = queryParams.get('token');
      if (tokenFromQuery) {
        tokenToUse = tokenFromQuery;
        console.log('✅ Token found in query string:', tokenFromQuery.substring(0, 10) + '...');
      }
    }
    
    if (tokenToUse) {
      setResetToken(tokenToUse);
    } else {
      console.error('❌ No reset token found');
      setError('Invalid or missing password reset token. Please request a new password reset link.');
    }
  }, [token, location.search]);

  // Countdown timer after successful reset
  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      navigate('/customer-login'); // ✅ Navigate to appropriate login page
    }
  }, [success, countdown, navigate]);

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setValidationError('');
    setPasswordMismatch(false);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMismatch(e.target.value !== newPassword);
  };

  const validateForm = () => {
    // Validate password strength
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setValidationError(passwordErrors[0]);
      return false;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setPasswordMismatch(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!resetToken) {
      setError('Invalid or missing password reset token. Please request a new password reset link.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      console.log('🔐 Submitting password reset...');
      
      // ✅ FIXED: Call resetPassword with correct parameters
      const response = await resetPassword(resetToken, newPassword);
      
      console.log('✅ Password reset successful:', response);
      
      if (response.success) {
        setSuccess(true);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(response.message || 'Failed to reset password. The link may have expired.');
      }
    } catch (err) {
      console.error('❌ Password reset submission error:', err);
      setError(err.message || 'An error occurred while resetting your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" maxWidth="sm" sx={{ flexGrow: 1, py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 3
          }}
        >
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: '#003047',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <LockIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>

          <Typography component="h1" variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
            Reset Your Password
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {error}
            </Alert>
          )}

          {success ? (
            <Box sx={{ textAlign: 'center' }}>
              <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
                Your password has been successfully reset!
              </Alert>
              <Typography variant="body1" sx={{ mb: 3 }}>
                You will be redirected to the login page in {countdown} seconds.
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/customer-login')}
                sx={{ bgcolor: '#003047' }}
              >
                Go to Login Now
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <Typography variant="body2" sx={{ mb: 3 }}>
                Please enter your new password below. Password must be at least 8 characters
                and include uppercase, lowercase, number, and special character.
              </Typography>

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={handlePasswordChange}
                error={!!validationError}
                helperText={validationError}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={passwordMismatch}
                helperText={passwordMismatch ? "Passwords don't match" : ""}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || !resetToken}
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.5,
                  bgcolor: '#003047',
                  color: 'white',
                  borderRadius: 2,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  '&:hover': {
                    bgcolor: '#003047',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 8px 25px rgba(14, 19, 50, 0.3)',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Reset Password'}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default ResetPasswordPage;
