import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { requestPasswordReset } from '../../services/auth';
import Header from '../../components/Header';
import Footer from '../../components/footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await requestPasswordReset(email);
      setMessage(response.message || 'If an account exists with this email, you will receive a password reset link.');
      setOpenSnackbar(true);
    } catch (err) {
      setError(err.message || 'Failed to request password reset');
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
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
          To Reset your Password
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
          <Typography
            variant="h5"
            component="h2"
            align="center"
            color="primary"
            fontWeight="bold"
            sx={{ mb: 4 }}
          >
            Forgot Password
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              placeholder="Enter your Email address"
              value={email}
              onChange={handleChange}
              variant="outlined"
              sx={{ mb: 3 }}
              type="email"
            />
            
            <Typography variant="body2" align="center" sx={{ mb: 2 }}>
              After Click on the Continue Button, You will be received a reset password link on your email
              Click and you can change the password!!!
            </Typography>
              <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 1,
                mb: 2,
                py: 1.5,
                bgcolor: '#001F3F',           // new primary color
                '&:hover': { bgcolor: '#001F3F' }  // keep same on hover
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Continue'}
            </Button>
            
            <Snackbar
              open={openSnackbar}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              {error ? (
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                  {error}
                </Alert>
              ) : (
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                  {message}
                </Alert>
              )}
            </Snackbar>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default ForgotPassword;