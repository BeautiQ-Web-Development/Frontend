import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Link,
  CircularProgress,
  IconButton
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Email as EmailIcon } from '@mui/icons-material';
import { requestPasswordReset } from '../../services/auth';
import { validateEmail } from '../../utils/validation';
import Header from '../../components/Header';
import Footer from '../../components/footer';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [emailAddress, setEmailAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleEmailChange = (e) => {
    setEmailAddress(e.target.value);
    setEmailError('');
  };

  const validateForm = () => {
    const emailErrors = validateEmail(emailAddress);
    if (emailErrors.length > 0) {
      setEmailError(emailErrors[0]);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess(false);
      
      const response = await requestPasswordReset(emailAddress);
      
      if (response.success) {
        setSuccess(true);
      } else {
        setError(response.message || 'Failed to send password reset email. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while requesting password reset.');
      console.error('Password reset request error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" maxWidth="sm" sx={{ flexGrow: 1, py: 8 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ mb: 2, color: '#003047' }}
        >
          <ArrowBackIcon />
          <Typography variant="body2" sx={{ ml: 1 }}>
            Back
          </Typography>
        </IconButton>
        
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
            <EmailIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>

          <Typography component="h1" variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>
            Forgot Your Password?
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {error}
            </Alert>
          )}

          {success ? (
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Password reset link has been sent to your email address!
              </Alert>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Please check your inbox and follow the instructions in the email to reset your password.
              </Typography>
              <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
                If you don't receive an email within a few minutes, please check your spam folder.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{ bgcolor: '#003047', mb: 2 }}
              >
                Return to Login
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="emailAddress"
                label="Email Address"
                name="emailAddress"
                autoComplete="email"
                autoFocus
                value={emailAddress}
                onChange={handleEmailChange}
                error={!!emailError}
                helperText={emailError}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 1,
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
                {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
              </Button>
              
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link component={RouterLink} to="/login" variant="body2" color="primary">
                  Remember your password? Back to login
                </Link>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default ForgotPasswordPage;