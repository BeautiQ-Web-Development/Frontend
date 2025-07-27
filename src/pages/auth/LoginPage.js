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
//   MenuItem,
// } from '@mui/material';
// import { Link as RouterLink, useNavigate } from 'react-router-dom';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import Header from '../../components/Header';
// import Footer from '../../components/footer';
// import { useAuth } from '../../context/AuthContext';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     emailAddress: '',
//     password: '',
//     role: 'customer' // Default role
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await login(formData);
//       // Redirect based on role
//       const dashboardRoutes = {
//         customer: '/customer-dashboard',
//         serviceProvider: '/service-provider-dashboard',
//         admin: '/admin-dashboard'
//       };
//       navigate(dashboardRoutes[formData.role]);
//     } catch (err) {
//       setError(err.message || 'Login failed. Please try again.');
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//       <Header />
//       <Container component="main" maxWidth="md" sx={{ flexGrow: 1, py: 4 }}>
//         <Typography
//           variant="h4"
//           component="h1"
//           align="center"
//           sx={{ mb: 4, color: '#003047', fontWeight: 'bold' }}
//         >
//           Welcome to BeautiQ
//         </Typography>
        
//         <Paper elevation={0} sx={{ p: 4, maxWidth: '600px', mx: 'auto', borderRadius: '30px', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
//           <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
//             {error && (
//               <Typography color="error" sx={{ mb: 2 }}>
//                 {error}
//               </Typography>
//             )}

//             <TextField
//               select
//               fullWidth
//               label="Login As"
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               margin="normal"
//               sx={{ mb: 2 }}
//             >
//               <MenuItem value="customer">Customer</MenuItem>
//               <MenuItem value="serviceProvider">Service Provider</MenuItem>
//               <MenuItem value="admin">Admin</MenuItem>
//             </TextField>

//             <TextField
//               fullWidth
//               required
//               label="Email Address"
//               name="emailAddress"
//               type="email"
//               value={formData.emailAddress}
//               onChange={handleChange}
//               sx={{ mb: 2 }}
//             />

//             <TextField
//               fullWidth
//               required
//               label="Password"
//               name="password"
//               type={showPassword ? 'text' : 'password'}
//               value={formData.password}
//               onChange={handleChange}
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

//             <Box sx={{ mt: 2, mb: 2, textAlign: 'right' }}>
//               <Link
//                 component={RouterLink}
//                 to="/forgot-password"
//                 sx={{ color: '#001F3F', textDecoration: 'none' }}
//               >
//                 Forgot Password?
//               </Link>
//             </Box>

//             <Button
//               type="submit"
//               fullWidth
//               variant="contained"
//               sx={{ mt: 2, mb: 2 }}
//             >
//               Login
//             </Button>

//             <Typography align="center">
//               Don't have an account?{' '}
//               <Link
//                 component={RouterLink}
//                 to={`/${formData.role === 'customer' ? 'customer' : formData.role === 'serviceProvider' ? 'service-provider' : 'admin'}-register`}
//                 sx={{ color: '#001F3F', textDecoration: 'none' }}
//               >
//                 Register here
//               </Link>
//             </Typography>
//           </Box>
//         </Paper>
//       </Container>
//       <Footer />
//     </Box>
//   );
// };

// export default Login;
