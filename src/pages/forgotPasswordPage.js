import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/footer';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would send a request to your backend
    console.log('Password reset requested for:', email);
    // Simulate successful submission
    setIsSubmitted(true);
    // In a real app, you would handle API call here
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
              sx={{
                mt: 1,
                mb: 2,
                py: 1.5,
                bgcolor: '#1976d2', // Changed to Material-UI default blue
                color: 'white',     // Changed text color to white
                borderRadius: '20px',
                '&:hover': {
                  bgcolor: '#1565c0', // Darker blue on hover
                }
              }}
            >
              Continue
            </Button>
            
            {isSubmitted && (
              <Typography 
                variant="body2" 
                align="center" 
                color="success.main" 
                sx={{ mt: 2 }}
              >
                Password reset link has been sent to your email!
              </Typography>
            )}
          </Box>
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default ForgotPassword;