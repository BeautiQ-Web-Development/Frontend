// import React, { useState } from 'react';
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Paper,
//   Container,
//   Link,
//   InputAdornment,
//   IconButton,
// } from '@mui/material';
// import { Link as RouterLink } from 'react-router-dom';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import Header from '../components/Header';
// import Footer from '../components/footer';

// const AdminRegister = () => {
//   const [formData, setFormData] = useState({
//     fullName: '',
//     currentAddress: '',
//     emailAddress: '',
//     mobileNumber: '',
//     newPassword: '',
//     confirmPassword: '',
//     nicOrPassport: ''
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle form submission logic here
//     console.log('Form submitted:', formData);
//     // Add API call to register the admin
//   };

//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleClickShowConfirmPassword = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//       <Header />
//       <Container component="main" maxWidth="md" sx={{ flexGrow: 1, py: 4 }}>
//         <Typography
//           variant="h4"
//           component="h1"
//           align="center"
//           color="primary"
//           fontWeight="bold"
//           sx={{ mb: 4 }}
//         >
//           Welcome to Admin Register Page
//         </Typography>
        
//         <Paper
//           elevation={0}
//           sx={{
//             p: 4,
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             borderRadius: '30px',
//             border: '1px solid rgba(0, 0, 0, 0.12)',
//             mx: 'auto',
//             width: '100%',
//             maxWidth: '600px',
//             bgcolor: 'background.paper',
//           }}
//         >
//           <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="fullName"
//               label="Full Name"
//               name="fullName"
//               placeholder="Enter your full name"
//               value={formData.fullName}
//               onChange={handleChange}
//               variant="outlined"
//               sx={{ mb: 2 }}
//             />
            
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="currentAddress"
//               label="Current Address"
//               name="currentAddress"
//               placeholder="Enter your current address"
//               value={formData.currentAddress}
//               onChange={handleChange}
//               variant="outlined"
//               sx={{ mb: 2 }}
//             />
            
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="emailAddress"
//               label="Email Address"
//               name="emailAddress"
//               placeholder="Enter your Email address"
//               value={formData.emailAddress}
//               onChange={handleChange}
//               variant="outlined"
//               sx={{ mb: 2 }}
//               type="email"
//             />
            
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="mobileNumber"
//               label="Mobile Number"
//               name="mobileNumber"
//               placeholder="Enter your Mobile Number"
//               value={formData.mobileNumber}
//               onChange={handleChange}
//               variant="outlined"
//               sx={{ mb: 2 }}
//             />
            
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="newPassword"
//               label="New Password"
//               name="newPassword"
//               placeholder="Enter your New Password"
//               value={formData.newPassword}
//               onChange={handleChange}
//               variant="outlined"
//               sx={{ mb: 2 }}
//               type={showPassword ? 'text' : 'password'}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label="toggle password visibility"
//                       onClick={handleClickShowPassword}
//                       edge="end"
//                     >
//                       {showPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 )
//               }}
//             />
            
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="confirmPassword"
//               label="Confirm Password"
//               name="confirmPassword"
//               placeholder="Enter your New Password"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               variant="outlined"
//               sx={{ mb: 2 }}
//               type={showConfirmPassword ? 'text' : 'password'}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       aria-label="toggle confirm password visibility"
//                       onClick={handleClickShowConfirmPassword}
//                       edge="end"
//                     >
//                       {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                     </IconButton>
//                   </InputAdornment>
//                 )
//               }}
//             />
            
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               id="nicOrPassport"
//               label="NIC No / Passport No"
//               name="nicOrPassport"
//               placeholder="Enter your New Password"
//               value={formData.nicOrPassport}
//               onChange={handleChange}
//               variant="outlined"
//               sx={{ mb: 3 }}
//             />
            
//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{
//                 mt: 1,
//                 mb: 2,
//                 py: 1.5,
//                 bgcolor: 'black',
//                 color: 'white',
//                 borderRadius: '4px',
//                 '&:hover': {
//                   bgcolor: '#333',
//                 }
//               }}
//             >
//               Register
//             </Button>
            
//             <Box sx={{ textAlign: 'center' }}>
//               <Typography variant="body2">
//                 Have another account?{' '}
//                 <Link component={RouterLink} to="/login" sx={{ textDecoration: 'none' }}>
//                   Login
//                 </Link>
//               </Typography>
//             </Box>
//           </Box>
//         </Paper>
//       </Container>
//       <Footer />
//     </Box>
//   );
// };

// export default AdminRegister;



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
import { register } from '../services/auth';
import Header from '../components/Header';
import Footer from '../components/footer';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    currentAddress: '',
    emailAddress: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    role: 'admin'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adminExists, setAdminExists] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
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
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setSnackbarOpen(true);
      return;
    }
    
    try {
      const response = await register(formData, 'admin');
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
          Admin Registration
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
              sx={{
                mt: 1,
                mb: 2,
                py: 1.5,
                bgcolor: '#1976d2',
                color: 'white',
                borderRadius: '4px',
                '&:hover': {
                  bgcolor: '#1565c0',
                }
              }}
            >
              Register as Admin
            </Button>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Already have an admin account?{' '}
                <Link component={RouterLink} to="/login" sx={{ textDecoration: 'none' }}>
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