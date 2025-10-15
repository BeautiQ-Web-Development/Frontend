import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Snackbar,
  IconButton,
  Box,
  CircularProgress,
  Link,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { registerServiceProviderNoServices, checkAdminExists } from '../../services/auth';
import Header from '../../components/Header';
import Footer from '../../components/footer';

const ServiceProviderRegister = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [adminExists, setAdminExists] = useState(null); // null = checking, true/false = result
  const [systemCheckLoading, setSystemCheckLoading] = useState(true);

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

  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    fullName: '',
    currentAddress: '',
    homeAddress: '',
    emailAddress: '',
    mobileNumber: '',
    nicNumber: '',
    password: '',
    
    // Document uploads
    nicFrontPhoto: null,
    nicBackPhoto: null,
    profilePhoto: null,
    certificatesPhotos: [], // Add certificates array
    
    // Step 2: Business Information
    businessName: '',
    businessDescription: '',
    businessType: '',
    city: '',
    experienceYears: '',
    
    // Terms
    agreeToTerms: false,
    role: 'serviceProvider'
  });

  // REMOVED SERVICES STEP - Only Personal Info and Business Details now
  const steps = ['Personal Info', 'Business Details'];

  const businessTypes = [
    { value: 'individual', label: 'Individual Professional' },
    { value: 'salon', label: 'Beauty Salon' },
    { value: 'spa', label: 'Spa & Wellness Center' },
    { value: 'mobile_service', label: 'Mobile Service' },
    { value: 'studio', label: 'Beauty Studio' }
  ];

  // Validation functions
  const validateEmail = (email) => {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !email.trim()) {
      errors.push('Email address is required');
    } else if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    }
    
    return errors;
  };

  const validateMobileNumber = (mobile) => {
    const errors = [];
    const mobileRegex = /^(\+94|0)?[0-9]{9}$/;
    
    if (!mobile || !mobile.trim()) {
      errors.push('Mobile number is required');
    } else if (!mobileRegex.test(mobile.replace(/\s/g, ''))) {
      errors.push('Please enter a valid Sri Lankan mobile number (e.g., 0771234567)');
    }
    
    return errors;
  };

  const validateNIC = (nic) => {
    const errors = [];
    const oldNicRegex = /^[0-9]{9}[vVxX]$/;
    const newNicRegex = /^[0-9]{12}$/;
    
    if (!nic || !nic.trim()) {
      errors.push('NIC number is required');
    } else if (!oldNicRegex.test(nic) && !newNicRegex.test(nic)) {
      errors.push('Please enter a valid NIC number (e.g., 123456789V or 199812345678)');
    }
    
    return errors;
  };

  const validatePassword = (password) => {
    const errors = [];
    
    if (!password || password.length < 8) {
      errors.push('Password must be at least 8 characters');
    } else {
      if (!/[A-Z]/.test(password)) {
        errors.push('Must contain uppercase letter');
      } else if (!/[a-z]/.test(password)) {
        errors.push('Must contain lowercase letter');
      } else if (!/[0-9]/.test(password)) {
        errors.push('Must contain number');
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Must contain special character');
      }
    }
    
    return errors;
  };

  const validateStep = (stepIndex) => {
    const errors = {};
    
    switch (stepIndex) {
      case 0: // Personal Info
        if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
        
        const emailErrors = validateEmail(formData.emailAddress);
        if (emailErrors.length > 0) errors.emailAddress = emailErrors[0];
        
        const mobileErrors = validateMobileNumber(formData.mobileNumber);
        if (mobileErrors.length > 0) errors.mobileNumber = mobileErrors[0];
        
        const nicErrors = validateNIC(formData.nicNumber);
        if (nicErrors.length > 0) errors.nicNumber = nicErrors[0];
        
        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) errors.password = passwordErrors[0];
        
        if (!formData.currentAddress.trim()) errors.currentAddress = 'Current address is required';
        if (!formData.homeAddress.trim()) errors.homeAddress = 'Home address is required';
        if (!formData.nicFrontPhoto) errors.nicFrontPhoto = 'NIC front photo is required';
        if (!formData.nicBackPhoto) errors.nicBackPhoto = 'NIC back photo is required';
        break;
        
      case 1: // Business Details + Terms
        if (!formData.businessName.trim()) errors.businessName = 'Business name is required';
        if (!formData.businessType) errors.businessType = 'Business type is required';
        if (!formData.city.trim()) errors.city = 'City is required';
        if (!formData.agreeToTerms) {
          errors.agreeToTerms = 'You must agree to the terms and conditions';
        }
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setError('Please fix the validation errors before proceeding');
      setSnackbarOpen(true);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateStep(1)) { // Changed from 2 to 1 since we removed services step
      setError('Please fix all validation errors before submitting');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    try {
      const response = await registerServiceProviderNoServices(formData);
      if (response.success) {
        setRegistrationSuccess(true);
        localStorage.setItem('newServiceProviderRequest', 'true');
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error details:', err.response?.data || err);
      const server = err.response?.data;
      const msg = server?.errors
        ? server.errors.join(', ')
        : server?.message || err.message || 'Registration failed';
      setError(msg);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // File upload handlers
  const handleFileUpload = (fieldName, file) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: file
    }));

    // Clear validation error when file is uploaded
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  // Handle multiple certificate uploads
  const handleCertificateUpload = (files) => {
    const fileArray = Array.from(files);
    setFormData(prev => ({
      ...prev,
      certificatesPhotos: [...prev.certificatesPhotos, ...fileArray]
    }));
  };

  const removeCertificate = (index) => {
    setFormData(prev => ({
      ...prev,
      certificatesPhotos: prev.certificatesPhotos.filter((_, i) => i !== index)
    }));
  };

  const removeFile = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: null
    }));
  };

  // Form rendering functions
  const renderPersonalInfoForm = () => (
    <Card sx={{ maxWidth: 700, mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Personal Information
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={!!validationErrors.fullName}
              helperText={validationErrors.fullName || 'Enter your full name as per NIC'}
            />
            <Grid item xs={12}>
            <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" gutterBottom>
                Experience Certificates (Optional)
              </Typography>
              <Typography variant="caption" display="block" sx={{ mb: 1, color: 'text.secondary' }}>
                Upload certificates, awards, or documents that prove your experience
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="certificates-upload"
                type="file"
                multiple
                onChange={(e) => handleCertificateUpload(e.target.files)}
              />
              <label htmlFor="certificates-upload">
                <Button variant="outlined" component="span" size="small">
                  Upload Certificates
                </Button>
              </label>
              
              {formData.certificatesPhotos.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="success.main" display="block">
                    ✓ {formData.certificatesPhotos.length} certificate(s) uploaded
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {formData.certificatesPhotos.map((file, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {file.name}
                        </Typography>
                        <IconButton size="small" onClick={() => removeCertificate(index)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Email Address"
              name="emailAddress"
              type="email"
              value={formData.emailAddress}
              onChange={handleChange}
              error={!!validationErrors.emailAddress}
              helperText={validationErrors.emailAddress || 'Enter a valid email address'}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Mobile Number"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              error={!!validationErrors.mobileNumber}
              helperText={validationErrors.mobileNumber || 'Enter mobile number (e.g., 0771234567)'}
              placeholder="0771234567"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="NIC Number"
              name="nicNumber"
              value={formData.nicNumber}
              onChange={handleChange}
              error={!!validationErrors.nicNumber}
              helperText={validationErrors.nicNumber || 'Enter NIC (e.g., 123456789V or 199812345678)'}
              placeholder="123456789V or 199812345678"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!validationErrors.password}
              helperText={validationErrors.password || 'Min 8 chars: uppercase, lowercase, number, special char'}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Business Address"
              name="currentAddress"
              multiline
              rows={2}
              value={formData.currentAddress}
              onChange={handleChange}
              error={!!validationErrors.currentAddress}
              helperText={validationErrors.currentAddress || 'Your business operating address'}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Home Address"
              name="homeAddress"
              multiline
              rows={2}
              value={formData.homeAddress}
              onChange={handleChange}
              error={!!validationErrors.homeAddress}
              helperText={validationErrors.homeAddress || 'Your personal/home address'}
            />
          </Grid>

          {/* Document Upload Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
              Required Documents
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" gutterBottom>
                Profile Photo
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="profile-photo-upload"
                type="file"
                onChange={(e) => handleFileUpload('profilePhoto', e.target.files[0])}
              />
              <label htmlFor="profile-photo-upload">
                <Button variant="outlined" component="span" size="small">
                  Upload Photo
                </Button>
              </label>
              {formData.profilePhoto && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="success.main">
                    ✓ {formData.profilePhoto.name}
                  </Typography>
                  <IconButton size="small" onClick={() => removeFile('profilePhoto')}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" gutterBottom color="error">
                NIC Front Photo *
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="nic-front-upload"
                type="file"
                onChange={(e) => handleFileUpload('nicFrontPhoto', e.target.files[0])}
              />
              <label htmlFor="nic-front-upload">
                <Button variant="outlined" component="span" size="small">
                  Upload Front
                </Button>
              </label>
              {formData.nicFrontPhoto && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="success.main">
                    ✓ {formData.nicFrontPhoto.name}
                  </Typography>
                  <IconButton size="small" onClick={() => removeFile('nicFrontPhoto')}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
              {validationErrors.nicFrontPhoto && (
                <Typography color="error" variant="caption" display="block" sx={{ mt: 1 }}>
                  {validationErrors.nicFrontPhoto}
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" gutterBottom color="error">
                NIC Back Photo *
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="nic-back-upload"
                type="file"
                onChange={(e) => handleFileUpload('nicBackPhoto', e.target.files[0])}
              />
              <label htmlFor="nic-back-upload">
                <Button variant="outlined" component="span" size="small">
                  Upload Back
                </Button>
              </label>
              {formData.nicBackPhoto && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="success.main">
                    ✓ {formData.nicBackPhoto.name}
                  </Typography>
                  <IconButton size="small" onClick={() => removeFile('nicBackPhoto')}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
              {validationErrors.nicBackPhoto && (
                <Typography color="error" variant="caption" display="block" sx={{ mt: 1 }}>
                  {validationErrors.nicBackPhoto}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const renderBusinessInfoForm = () => (
    <Card sx={{ maxWidth: 600, mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Business Information
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Business Name"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              error={!!validationErrors.businessName}
              helperText={validationErrors.businessName || 'Enter your business name'}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              required
              label="Business Type"
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              error={!!validationErrors.businessType}
              helperText={validationErrors.businessType || 'Select your business type'}
            >
              {businessTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={!!validationErrors.city}
              helperText={validationErrors.city || 'Enter your city'}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Years of Experience"
              name="experienceYears"
              type="number"
              value={formData.experienceYears || ''}
              onChange={handleChange}
              InputProps={{
                inputProps: { min: 0, max: 50 }
              }}
              placeholder="0"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Business Description"
              name="businessDescription"
              multiline
              rows={3}
              value={formData.businessDescription}
              onChange={handleChange}
              placeholder="Describe your business and services..."
            />
          </Grid>

          {/* MOVED: Certificate Upload to Business Details */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
              Experience Certificates (Optional)
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" gutterBottom>
                Upload Certificates & Awards
              </Typography>
              <Typography variant="caption" display="block" sx={{ mb: 1, color: 'text.secondary' }}>
                Upload certificates, awards, or documents that prove your experience and qualifications
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="certificates-upload"
                type="file"
                multiple
                onChange={(e) => handleCertificateUpload(e.target.files)}
              />
              <label htmlFor="certificates-upload">
                <Button variant="outlined" component="span" size="small">
                  Upload Certificates
                </Button>
              </label>
              
              {formData.certificatesPhotos.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="success.main" display="block">
                    ✓ {formData.certificatesPhotos.length} certificate(s) uploaded
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {formData.certificatesPhotos.map((file, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', bgcolor: 'grey.100', p: 1, borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {file.name}
                        </Typography>
                        <IconButton size="small" onClick={() => removeCertificate(index)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>

          {/* MOVED TERMS TO BUSINESS DETAILS STEP */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <FormControlLabel
              control={
                <Checkbox
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                />
              }
              label="I agree to the BeautiQ Terms of Service and Privacy Policy *"
            />
            {validationErrors.agreeToTerms && (
              <Typography color="error" variant="caption" display="block">
                {validationErrors.agreeToTerms}
              </Typography>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderPersonalInfoForm();
      case 1:
        return renderBusinessInfoForm();
      default:
        return 'Unknown step';
    }
  };

  // Show loading while checking system status
  if (systemCheckLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
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
            sx={{ color: '#001F3F' }}
            fontWeight="bold"
          >
            Service Provider Registration
          </Typography>
        </Box>

        {/* Warning if admin doesn't exist */}
        {adminExists === false && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>System Not Initialized</Typography>
            <Typography>
              An administrator account must be created first before service providers can register. 
              Please contact the system administrator or{' '}
              <Link component={RouterLink} to="/admin-register" sx={{ fontWeight: 'bold' }}>
                create an admin account
              </Link>{' '}
              to initialize the system.
            </Typography>
          </Alert>
        )}

        <Dialog open={registrationSuccess} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ textAlign: 'center', color: '#003047' }}>
            Registration Successful!
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ textAlign: 'center', mb: 2 }}>
              Your registration has been submitted for admin approval.
              You will be notified via email once your account is approved.
              You can add your services after approval. Any certificates you uploaded will be reviewed by the admin.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button
              onClick={() => navigate('/service-provider-approval-success')}
              variant="contained"
              sx={{ bgcolor: '#003047', '&:hover': { bgcolor: '#003047' } }}
            >
              Continue
            </Button>
          </DialogActions>
        </Dialog>

        <Paper sx={{ 
          p: 4, 
          borderRadius: 3,
          opacity: adminExists === false ? 0.6 : 1,
          pointerEvents: adminExists === false ? 'none' : 'auto',
        }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form noValidate onSubmit={handleSubmit}>
            {getStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              
              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ bgcolor: '#003047', '&:hover': { bgcolor: '#003047' } }}
                >
                  {loading ? 'Submitting...' : 'Submit Registration'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  sx={{ bgcolor: '#003047', '&:hover': { bgcolor: '#003047' } }}
                >
                  Next
                </Button>
              )}
            </Box>
          </form>
        </Paper>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      </Container>
      
      <Footer />
    </Box>
  );
};

export default ServiceProviderRegister;