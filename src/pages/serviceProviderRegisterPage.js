// import React, { useState } from 'react';
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   Container,
//   Link,
//   FormControlLabel,
//   Checkbox,
//   Stepper,
//   Step,
//   StepLabel,
// } from '@mui/material';
// import { Link as RouterLink } from 'react-router-dom';
// import Header from '../components/Header';
// import Footer from '../components/footer';

// const ServiceProviderRegister = () => {
//   const [activeStep, setActiveStep] = useState(0);
//   const [formData, setFormData] = useState({
//     // Personal info (first page)
//     fullName: '',
//     currentAddress: '',
//     emailAddress: '',
//     mobileNumber: '',
//     dateOfBirth: '',
//     newPassword: '',
//     nicPassport: '',
//     serviceName: '',
    
//     // Service info (second page)
//     serviceType: '',
//     certificates: null,
//     registeredDate: '',
//     yearsOfExperience: '',
//     numberOfEmployees: '',
//     districts: '',
//     agreeToTerms: false,
//   });

//   const handleChange = (e) => {
//     const { name, value, checked, type } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value
//     });
//   };

//   const handleFileChange = (e) => {
//     setFormData({
//       ...formData,
//       certificates: e.target.files
//     });
//   };

//   const handleNext = () => {
//     setActiveStep((prevStep) => prevStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep((prevStep) => prevStep - 1);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!formData.agreeToTerms) {
//       alert('You must agree to the terms and conditions');
//       return;
//     }
    
//     // Handle form submission logic here
//     console.log('Service Provider registration form submitted:', formData);
//     // Add API call to register the service provider
//   };

//   const renderPersonalInfoForm = () => (
//     <Box
//       sx={{ 
//         p: 4, 
//         display: 'flex', 
//         flexDirection: 'column',
//         alignItems: 'center',
//         borderRadius: '30px', 
//         border: '1px solid rgba(0, 0, 0, 0.12)',
//         mx: 'auto',
//         width: '100%', 
//         maxWidth: '600px',
//         bgcolor: 'white',
//         position: 'relative'
//       }}
//     >
//       {/* Avatar image */}
//       <Box 
//         sx={{ 
//           width: 80, 
//           height: 80, 
//           borderRadius: '50%', 
//           overflow: 'hidden',
//           mb: 3
//         }}
//       >
//         <img 
//           src="/avatar-woman.png" 
//           alt="Profile" 
//           style={{ width: '100%', height: '100%', objectFit: 'cover' }}
//         />
//       </Box>
      
//       <Box component="form" sx={{ width: '100%' }}>
//         <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
//           Full Name
//         </Typography>
//         <TextField
//           fullWidth
//           id="fullName"
//           name="fullName"
//           placeholder="Enter your full name"
//           value={formData.fullName}
//           onChange={handleChange}
//           variant="outlined"
//           size="small"
//           sx={{ mb: 2 }}
//         />
        
//         <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
//           Current Address
//         </Typography>
//         <TextField
//           fullWidth
//           id="currentAddress"
//           name="currentAddress"
//           placeholder="Enter your current address"
//           value={formData.currentAddress}
//           onChange={handleChange}
//           variant="outlined"
//           size="small"
//           sx={{ mb: 2 }}
//         />
        
//         <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
//           Email Address
//         </Typography>
//         <TextField
//           fullWidth
//           id="emailAddress"
//           name="emailAddress"
//           placeholder="Enter your Email address"
//           type="email"
//           value={formData.emailAddress}
//           onChange={handleChange}
//           variant="outlined"
//           size="small"
//           sx={{ mb: 2 }}
//         />
        
//         <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
//           Tele Phone Number
//         </Typography>
//         <TextField
//           fullWidth
//           id="mobileNumber"
//           name="mobileNumber"
//           placeholder="Enter your Mobile Number"
//           value={formData.mobileNumber}
//           onChange={handleChange}
//           variant="outlined"
//           size="small"
//           sx={{ mb: 2 }}
//         />
        
//         <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
//           Date of Birth
//         </Typography>
//         <TextField
//           fullWidth
//           id="dateOfBirth"
//           name="dateOfBirth"
//           placeholder="Enter your date of birth"
//           type="date"
//           value={formData.dateOfBirth}
//           onChange={handleChange}
//           variant="outlined"
//           size="small"
//           InputLabelProps={{ shrink: true }}
//           sx={{ mb: 2 }}
//         />
        
//         <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
//           New Password
//         </Typography>
//         <TextField
//           fullWidth
//           id="newPassword"
//           name="newPassword"
//           placeholder="Enter your New Password"
//           type="password"
//           value={formData.newPassword}
//           onChange={handleChange}
//           variant="outlined"
//           size="small"
//           sx={{ mb: 2 }}
//         />
        
//         <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
//           NIC No / Passport No
//         </Typography>
//         <TextField
//           fullWidth
//           id="nicPassport"
//           name="nicPassport"
//           placeholder="Enter your NIC or Passport number"
//           value={formData.nicPassport}
//           onChange={handleChange}
//           variant="outlined"
//           size="small"
//           sx={{ mb: 3 }}
//         />
        
//         <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
//           Enter your service name
//         </Typography>
//         <TextField
//           fullWidth
//           id="serviceName"
//           name="serviceName"
//           placeholder="Enter your service name"
//           value={formData.serviceName}
//           onChange={handleChange}
//           variant="outlined"
//           size="small"
//           sx={{ mb: 3 }}
//         />
        
//         <Button
//           onClick={handleNext}
//           fullWidth
//           variant="contained"
//           sx={{
//             mt: 1,
//             mb: 2,
//             py: 1.5,
//             bgcolor: 'black',
//             color: 'white',
//             borderRadius: '4px',
//             '&:hover': {
//               bgcolor: '#333',
//             }
//           }}
//         >
//           Continue
//         </Button>
        
//         <Box sx={{ textAlign: 'center' }}>
//           <Typography variant="body2">
//             Have another account?{' '}
//             <Link component={RouterLink} to="/service-provider-login" sx={{ textDecoration: 'none' }}>
//               Login
//             </Link>
//           </Typography>
//         </Box>
//       </Box>
//     </Box>
//   );

//   const renderServiceInfoForm = () => (
//     <Box
//       sx={{ 
//         p: 4, 
//         display: 'flex', 
//         flexDirection: 'column',
//         alignItems: 'center',
//         borderRadius: '30px', 
//         border: '1px solid rgba(0, 0, 0, 0.12)',
//         mx: 'auto',
//         width: '100%', 
//         maxWidth: '600px',
//         bgcolor: 'white',
//       }}
//     >
//       <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
//         <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
//           Service Type
//         </Typography>
//         <TextField
//           fullWidth
//           id="serviceType"
//           name="serviceType"
//           placeholder="Enter your full name"
//           value={formData.serviceType}
//           onChange={handleChange}
//           variant="outlined"
//           size="small"
//           sx={{ mb: 3 }}
//         />
        
//         <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
//           Images of Certificates and Work Images / Identity of Shop Image
//         </Typography>
//         <TextField
//           fullWidth
//           id="certificates"
//           name="certificates"
//           placeholder="Attach your Shop or Work Image and Certificates"
//           onChange={handleFileChange}
//           variant="outlined"
//           size="small"
//           type="file"
//           inputProps={{ multiple: true }}
//           sx={{ mb: 3 }}
//         />
        
//         <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
//           Registered Date
//         </Typography>
//         <TextField
//           fullWidth
//           id="registeredDate"
//           name="registeredDate"
//           placeholder="Enter your full name"
//           value={formData.registeredDate}
//           onChange={handleChange}
//           variant="outlined"
//           size="small"
//           type="date"
//           InputLabelProps={{ shrink: true }}
//           sx={{ mb: 3 }}
//         />
        
//         <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
//           Years of Experience
//         </Typography>
//         <TextField
//           fullWidth
//           id="yearsOfExperience"
//           name="yearsOfExperience"
//           placeholder="Enter your full name"
//           value={formData.yearsOfExperience}
//           onChange={handleChange}
//           variant="outlined"
//           size="small"
//           sx={{ mb: 3 }}
//         />
        
//         <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
//           Numbers of Employees
//         </Typography>
//         <TextField
//           fullWidth
//           id="numberOfEmployees"
//           name="numberOfEmployees"
//           placeholder="Enter your full name"
//           value={formData.numberOfEmployees}
//           onChange={handleChange}
//           variant="outlined"
//           size="small"
//           sx={{ mb: 3 }}
//         />
        
//         <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
//           Districts
//         </Typography>
//         <TextField
//           fullWidth
//           id="districts"
//           name="districts"
//           placeholder="Enter your full name"
//           value={formData.districts}
//           onChange={handleChange}
//           variant="outlined"
//           size="small"
//           sx={{ mb: 4 }}
//         />
        
//         <FormControlLabel
//           control={
//             <Checkbox
//               checked={formData.agreeToTerms}
//               onChange={handleChange}
//               name="agreeToTerms"
//               color="primary"
//             />
//           }
//           label={
//             <Typography variant="body2">
//               I agree to the Privacy Policy, Terms of Services & Teams of Business
//             </Typography>
//           }
//           sx={{ mb: 3 }}
//         />
        
//         <Button
//           type="submit"
//           fullWidth
//           variant="contained"
//           sx={{
//             py: 1.5,
//             bgcolor: 'black',
//             color: 'white',
//             borderRadius: '4px',
//             '&:hover': {
//               bgcolor: '#333',
//             }
//           }}
//           disabled={!formData.agreeToTerms}
//         >
//           Join to BeautiQ
//         </Button>
//       </Box>
//     </Box>
//   );

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
//           Welcome to Our Service Provider Register Page
//         </Typography>
        
//         {activeStep === 0 ? renderPersonalInfoForm() : renderServiceInfoForm()}
//       </Container>
//       <Footer />
//     </Box>
//   );
// };

// export default ServiceProviderRegister;


import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Link,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/footer';

const ServiceProviderRegister = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Personal info (first page)
    fullName: '',
    currentAddress: '',
    emailAddress: '',
    mobileNumber: '',
    dateOfBirth: '',
    password: '',
    nicPassport: '',
    serviceName: '',
    
    // Service info (second page)
    serviceType: '',
    certificates: null,
    registeredDate: '',
    yearsOfExperience: '',
    numberOfEmployees: '',
    districts: '',
    agreeToTerms: false,

    // Role is always service provider
    role: 'serviceProvider'
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      certificates: e.target.files
    });
  };

  const handleNext = () => {
    // Validate first page
    if (!formData.fullName || !formData.currentAddress || !formData.emailAddress || 
        !formData.mobileNumber || !formData.password || !formData.serviceName) {
      setError('Please fill in all required fields');
      setSnackbarOpen(true);
      return;
    }
    
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate second page
    if (!formData.serviceType || !formData.districts || !formData.yearsOfExperience) {
      setError('Please fill in all required fields');
      setSnackbarOpen(true);
      return;
    }
    
    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      setSnackbarOpen(true);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Prepare data for API call
      const serviceProviderData = {
        fullName: formData.fullName,
        currentAddress: formData.currentAddress,
        emailAddress: formData.emailAddress,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        role: 'serviceProvider',
        businessName: formData.serviceName,
        services: [
          {
            name: formData.serviceType,
            description: `Service with ${formData.yearsOfExperience} years of experience`,
            price: 0
          }
        ],
        location: {
          address: formData.currentAddress,
          districts: formData.districts
        }
      };
      
      console.log('Sending registration data:', serviceProviderData);
      
      // Direct axios call for debugging
      const response = await axios.post(
        'http://localhost:5000/api/auth/register', 
        serviceProviderData
      );
      
      console.log('Registration response:', response.data);
      
      setRegistrationSuccess(true);
      setDialogOpen(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error('Registration error:', err);
      
      // Detailed error logging
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(err.response.data?.message || 'Registration failed. Please check your information and try again.');
      } else if (err.request) {
        console.error('Error request:', err.request);
        setError('Network error. Please check your connection and try again.');
      } else {
        setError('Registration failed. Please try again.');
      }
      
      setSnackbarOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    if (registrationSuccess) {
      navigate('/service-provider-login');
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const renderPersonalInfoForm = () => (
    <Box
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
        bgcolor: 'white',
        position: 'relative'
      }}
    >
      {/* Avatar image */}
      <Box 
        sx={{ 
          width: 80, 
          height: 80, 
          borderRadius: '50%', 
          overflow: 'hidden',
          mb: 3
        }}
      >
        <img 
          src="/avatar-woman.png" 
          alt="Profile" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
      
      <Box component="form" sx={{ width: '100%' }}>
        <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
          Full Name*
        </Typography>
        <TextField
          fullWidth
          id="fullName"
          name="fullName"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          required
        />
        
        <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
          Current Address*
        </Typography>
        <TextField
          fullWidth
          id="currentAddress"
          name="currentAddress"
          placeholder="Enter your current address"
          value={formData.currentAddress}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          required
        />
        
        <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
          Email Address*
        </Typography>
        <TextField
          fullWidth
          id="emailAddress"
          name="emailAddress"
          placeholder="Enter your Email address"
          type="email"
          value={formData.emailAddress}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          required
        />
        
        <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
          Telephone Number*
        </Typography>
        <TextField
          fullWidth
          id="mobileNumber"
          name="mobileNumber"
          placeholder="Enter your Mobile Number"
          value={formData.mobileNumber}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          required
        />
        
        <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
          Date of Birth
        </Typography>
        <TextField
          fullWidth
          id="dateOfBirth"
          name="dateOfBirth"
          placeholder="Enter your date of birth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          variant="outlined"
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />
        
        <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
          Password*
        </Typography>
        <TextField
          fullWidth
          id="password"
          name="password"
          placeholder="Enter your Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ mb: 2 }}
          required
        />
        
        <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
          NIC No / Passport No
        </Typography>
        <TextField
          fullWidth
          id="nicPassport"
          name="nicPassport"
          placeholder="Enter your NIC or Passport number"
          value={formData.nicPassport}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ mb: 3 }}
        />
        
        <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
          Enter your service/business name*
        </Typography>
        <TextField
          fullWidth
          id="serviceName"
          name="serviceName"
          placeholder="Enter your service or business name"
          value={formData.serviceName}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ mb: 3 }}
          required
        />
        
        <Button
          onClick={handleNext}
          fullWidth
          variant="contained"
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
          Continue
        </Button>
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2">
            Have another account?{' '}
            <Link component={RouterLink} to="/service-provider-login" sx={{ textDecoration: 'none' }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  const renderServiceInfoForm = () => (
    <Box
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
        bgcolor: 'white',
      }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
          Service Type*
        </Typography>
        <TextField
          fullWidth
          id="serviceType"
          name="serviceType"
          placeholder="Enter your service type (e.g., Hair Styling, Makeup)"
          value={formData.serviceType}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ mb: 3 }}
          required
        />
        
        <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
          Images of Certificates and Work Images / Identity of Shop Image
        </Typography>
        <TextField
          fullWidth
          id="certificates"
          name="certificates"
          placeholder="Attach your Shop or Work Image and Certificates"
          onChange={handleFileChange}
          variant="outlined"
          size="small"
          type="file"
          inputProps={{ multiple: true }}
          sx={{ mb: 3 }}
        />
        
        <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
          Registered Date
        </Typography>
        <TextField
          fullWidth
          id="registeredDate"
          name="registeredDate"
          placeholder="Business registration date"
          value={formData.registeredDate}
          onChange={handleChange}
          variant="outlined"
          size="small"
          type="date"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />
        
        <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
          Years of Experience*
        </Typography>
        <TextField
          fullWidth
          id="yearsOfExperience"
          name="yearsOfExperience"
          placeholder="Enter your years of experience"
          value={formData.yearsOfExperience}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ mb: 3 }}
          required
        />
        
        <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
          Numbers of Employees
        </Typography>
        <TextField
          fullWidth
          id="numberOfEmployees"
          name="numberOfEmployees"
          placeholder="Enter number of employees"
          value={formData.numberOfEmployees}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ mb: 3 }}
        />
        
        <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
          Districts*
        </Typography>
        <TextField
          fullWidth
          id="districts"
          name="districts"
          placeholder="Enter districts you serve"
          value={formData.districts}
          onChange={handleChange}
          variant="outlined"
          size="small"
          sx={{ mb: 4 }}
          required
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
              I agree to the Privacy Policy, Terms of Services & Terms of Business
            </Typography>
          }
          sx={{ mb: 3 }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Button
            onClick={handleBack}
            variant="outlined"
            sx={{
              py: 1.5,
              width: '48%',
              borderRadius: '4px',
            }}
            disabled={loading}
          >
            Back
          </Button>
          
          <Button
            type="button"
            variant="contained"
            sx={{
              py: 1.5,
              width: '48%',
              bgcolor: 'black',
              color: 'white',
              borderRadius: '4px',
              '&:hover': {
                bgcolor: '#333',
              }
            }}
            disabled={!formData.agreeToTerms || loading}
            onClick={handleSubmit}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Join to BeautiQ'}
          </Button>
        </Box>
      </Box>
    </Box>
  );

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
          Welcome to Our Service Provider Register Page
        </Typography>
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          <Step>
            <StepLabel>Personal Information</StepLabel>
          </Step>
          <Step>
            <StepLabel>Service Information</StepLabel>
          </Step>
        </Stepper>
        
        {activeStep === 0 ? renderPersonalInfoForm() : renderServiceInfoForm()}
        
        {/* Success/Error Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Registration Successful"}
          </DialogTitle>
          <DialogContent>
          <DialogContentText id="alert-dialog-description">
              Your service provider account has been registered successfully. It is pending admin approval. 
              You will receive a notification once your account is approved, and then you can log in.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
        
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
      </Container>
      <Footer />
    </Box>
  );
};

export default ServiceProviderRegister;