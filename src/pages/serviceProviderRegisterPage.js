import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FormControl,
  InputLabel,
  Select,
  Chip,
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
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  Box,
  OutlinedInput,
  FormHelperText
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { register } from '../services/auth';
import Header from '../components/Header';
import Footer from '../components/footer';

const ServiceProviderRegister = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({    // Step 1: Personal Information
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
    certificatesPhotos: [],
    profilePhoto: null,
    
    // Step 2: Business Information
    businessName: '',
    businessDescription: '',
    businessType: '',
    city: '',
    experienceYears: '',
    
    // Step 3: Services
    services: [
      {
        serviceName: '',
        serviceType: '',
        targetAudience: '',
        serviceSubType: '',
        detailedDescription: '',
        duration: 60,
        pricing: {
          basePrice: '',
          priceType: 'fixed'
        },
        serviceLocation: 'both',
        customNotes: '',
        preparationRequired: '',
        cancellationPolicy: '24 hours notice required',
        isActive: true
      }
    ],
    
    // Step 4: Terms
    paymentMethods: ['cash'],
    generalCancellationPolicy: '24 hours notice required for cancellation',
    advanceBookingDays: 30,
    agreeToTerms: false,
    role: 'serviceProvider'
  });

  const steps = ['Personal Info', 'Business Details', 'Services', 'Terms'];

  // Service types and categories
  const serviceTypes = [
    'Haircuts', 'Hair Styling', 'Hair Color', 'Hair Extensions', 'Keratin Treatment',
    'Nail Art', 'Manicure', 'Pedicure',
    'Makeup', 'Bridal Makeup', 'Party Makeup',
    'Threading', 'Eyebrow Shaping', 
    'Facial', 'Skincare', 'Massage',
    'Saree Draping', 'Mehendi/Henna', 'Other'
  ];

  const targetAudience = ['Women', 'Men', 'Kids (Boy)', 'Kids (Girl)', 'Unisex'];
  
  const businessTypes = [
    { value: 'individual', label: 'Individual Professional' },
    { value: 'salon', label: 'Beauty Salon' },
    { value: 'spa', label: 'Spa & Wellness Center' },
    { value: 'mobile_service', label: 'Mobile Service' },
    { value: 'studio', label: 'Beauty Studio' }
  ];

  const paymentOptions = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Credit/Debit Card' },
    { value: 'online', label: 'Online Payment' },
    { value: 'bank_transfer', label: 'Bank Transfer' }
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
    
    switch (stepIndex) {      case 0: // Personal Info
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
          // Required documents validation
        if (!formData.nicFrontPhoto) errors.nicFrontPhoto = 'NIC front photo is required';
        if (!formData.nicBackPhoto) errors.nicBackPhoto = 'NIC back photo is required';
        break;
        
      case 1: // Business Details
        if (!formData.businessName.trim()) errors.businessName = 'Business name is required';
        if (!formData.businessType) errors.businessType = 'Business type is required';
        if (!formData.city.trim()) errors.city = 'City is required';
        break;
        
      case 2: // Services
        if (formData.services.length === 0) {
          errors.services = 'At least one service must be added';
        } else {
          formData.services.forEach((service, index) => {
            const serviceErrors = {};
            if (!service.serviceName.trim()) serviceErrors.serviceName = 'Service name is required';
            if (!service.serviceType) serviceErrors.serviceType = 'Service category is required';
            if (!service.targetAudience) serviceErrors.targetAudience = 'Target audience is required';
            if (!service.detailedDescription.trim()) serviceErrors.detailedDescription = 'Description is required';
            if (!service.pricing.basePrice || service.pricing.basePrice <= 0) {
              serviceErrors.pricing = { basePrice: 'Base price must be greater than 0' };
            }
            
            if (Object.keys(serviceErrors).length > 0) {
              errors[`service_${index}`] = serviceErrors;
            }
          });
        }
        break;
        
      case 3: // Terms
        if (!formData.agreeToTerms) errors.agreeToTerms = 'You must agree to the terms and conditions';
        if (formData.paymentMethods.length === 0) errors.paymentMethods = 'Select at least one payment method';
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'paymentMethods') {
      setFormData(prev => ({
        ...prev,
        [name]: typeof value === 'string' ? value.split(',') : value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Real-time validation for specific fields
    if (name === 'emailAddress' && value) {
      const emailErrors = validateEmail(value);
      if (emailErrors.length > 0) {
        setValidationErrors(prev => ({ ...prev, [name]: emailErrors[0] }));
      }
    }

    if (name === 'mobileNumber' && value) {
      const mobileErrors = validateMobileNumber(value);
      if (mobileErrors.length > 0) {
        setValidationErrors(prev => ({ ...prev, [name]: mobileErrors[0] }));
      }
    }

    if (name === 'nicNumber' && value) {
      const nicErrors = validateNIC(value);
      if (nicErrors.length > 0) {
        setValidationErrors(prev => ({ ...prev, [name]: nicErrors[0] }));
      }
    }

    if (name === 'password' && value) {
      const passwordErrors = validatePassword(value);
      if (passwordErrors.length > 0) {
        setValidationErrors(prev => ({ ...prev, [name]: passwordErrors[0] }));
      }
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
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(activeStep)) {
      setError('Please fix all validation errors');
      setSnackbarOpen(true);
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const submitData = new FormData();
      
      // Basic user information - ensure all fields are strings
      submitData.append('fullName', formData.fullName || '');
      submitData.append('currentAddress', formData.currentAddress || '');
      submitData.append('homeAddress', formData.homeAddress || '');
      submitData.append('emailAddress', formData.emailAddress || '');
      submitData.append('mobileNumber', formData.mobileNumber || '');
      submitData.append('nicNumber', formData.nicNumber || '');
      submitData.append('password', formData.password || '');
      submitData.append('role', 'serviceProvider');
      
      // Business information
      submitData.append('businessName', formData.businessName || '');
      submitData.append('businessDescription', formData.businessDescription || '');
      submitData.append('businessType', formData.businessType || '');
      submitData.append('city', formData.city || '');
      
      // Transform services data to match backend expectations
      const transformedServices = formData.services.map(service => ({
        name: service.serviceName || '',
        type: service.serviceType || '',
        category: service.targetAudience || '',
        description: service.detailedDescription || '',
        price: parseFloat(service.pricing.basePrice) || 0,
        duration: parseInt(service.duration) || 60,
        location: service.serviceLocation || 'both'
      }));
      
      submitData.append('services', JSON.stringify(transformedServices));
      
      // Location data
      const locationData = {
        city: formData.city || '',
        serviceArea: formData.businessType === 'mobile_service' ? 'mobile' : 'fixed'
      };
      submitData.append('location', JSON.stringify(locationData));
      
      // Experience data
      const experienceData = {
        years: parseInt(formData.experienceYears) || 0,
        description: formData.businessDescription || ''
      };
      submitData.append('experience', JSON.stringify(experienceData));
      
      // Specialties and languages
      const specialties = formData.services.map(service => service.serviceType).filter((value, index, self) => self.indexOf(value) === index && value);
      submitData.append('specialties', JSON.stringify(specialties));
      submitData.append('languages', JSON.stringify(['English']));
      
      // Policies data
      const policiesData = {
        cancellation: formData.generalCancellationPolicy || '24 hours notice required',
        paymentMethods: formData.paymentMethods || ['cash'],
        advanceBooking: formData.advanceBookingDays || 30
      };
      submitData.append('policies', JSON.stringify(policiesData));
      
      // File uploads - ensure files exist before appending
      if (formData.profilePhoto && formData.profilePhoto instanceof File) {
        submitData.append('profilePhoto', formData.profilePhoto);
      }
      if (formData.nicFrontPhoto && formData.nicFrontPhoto instanceof File) {
        submitData.append('nicFrontPhoto', formData.nicFrontPhoto);
      }
      if (formData.nicBackPhoto && formData.nicBackPhoto instanceof File) {
        submitData.append('nicBackPhoto', formData.nicBackPhoto);
      }
        // Handle certificates - only append if files exist
      if (formData.certificatesPhotos && formData.certificatesPhotos.length > 0) {
        formData.certificatesPhotos.forEach((file, index) => {
          if (file instanceof File) {
            submitData.append('certificatesPhotos', file);
          }
        });
      }
      // Note: Certificates are optional - backend will handle empty case
      
      console.log('Submitting FormData with role: serviceProvider');
      console.log('Services count:', transformedServices.length);
      
      // Debug: Log all FormData entries
      console.log('FormData contents:');
      for (let [key, value] of submitData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      const response = await register(submitData, 'serviceProvider');
      
      if (response.success) {
        setRegistrationSuccess(true);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Service management functions
  const addService = () => {
    const newService = {
      serviceName: '',
      serviceType: '',
      targetAudience: '',
      serviceSubType: '',
      detailedDescription: '',
      duration: 60,
      pricing: {
        basePrice: '',
        priceType: 'fixed'
      },
      serviceLocation: 'both',
      customNotes: '',
      preparationRequired: '',
      cancellationPolicy: '24 hours notice required',
      isActive: true
    };
    
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
  };

  const removeService = (serviceIndex) => {
    if (formData.services.length > 1) {
      setFormData(prev => ({
        ...prev,
        services: prev.services.filter((_, index) => index !== serviceIndex)
      }));
    }
  };

  const handleServiceChange = (serviceIndex, field, value) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, index) => {
        if (index === serviceIndex) {
          if (field.includes('.')) {
            const [parentField, childField] = field.split('.');
            return {
              ...service,
              [parentField]: {
                ...service[parentField],
                [childField]: value
              }
            };
          }
          return { ...service, [field]: value };
        }
        return service;
      })
    }));
  };
  // File upload handlers
  const handleFileUpload = (fieldName, file) => {
    if (fieldName === 'certificatesPhotos') {
      setFormData(prev => ({
        ...prev,
        certificatesPhotos: [...prev.certificatesPhotos, file]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: file
      }));
    }

    // Clear validation error when file is uploaded
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const removeFile = (fieldName, index = null) => {
    if (fieldName === 'certificatesPhotos' && index !== null) {
      setFormData(prev => ({
        ...prev,
        certificatesPhotos: prev.certificatesPhotos.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [fieldName]: null
      }));
    }
  };

  // Form rendering functions
  const renderPersonalInfoForm = () => (
    <Card sx={{ maxWidth: 700, mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Personal Information & Verification
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
          
          <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
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

          <Grid item xs={12} sm={6}>
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
          
          <Grid item xs={12} sm={6}>
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
        </Grid>
      </CardContent>
    </Card>
  );

  const renderServicesForm = () => (
    <Card sx={{ maxWidth: 900, mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" color="primary" fontWeight="bold">
            Services & Pricing
          </Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={addService}
            variant="outlined"
            size="small"
          >
            Add Service
          </Button>
        </Box>
        
        {validationErrors.services && (
          <Alert severity="error" sx={{ mb: 2 }}>{validationErrors.services}</Alert>
        )}
        
        {formData.services.map((service, serviceIndex) => (
          <Accordion key={serviceIndex} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1" fontWeight="bold">
                {service.serviceName || `Service ${serviceIndex + 1}`}
                {formData.services.length > 1 && (
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeService(serviceIndex);
                    }} 
                    color="error" 
                    size="small"
                    sx={{ ml: 2 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Typography>
            </AccordionSummary>
            
            <AccordionDetails>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Service Name"
                    value={service.serviceName}
                    onChange={(e) => handleServiceChange(serviceIndex, 'serviceName', e.target.value)}
                    placeholder="e.g., Bridal Hair Styling"
                    error={!!validationErrors[`service_${serviceIndex}`]?.serviceName}
                    helperText={validationErrors[`service_${serviceIndex}`]?.serviceName || 'Enter the service name'}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    required
                    label="Service Category"
                    value={service.serviceType}
                    onChange={(e) => handleServiceChange(serviceIndex, 'serviceType', e.target.value)}
                    error={!!validationErrors[`service_${serviceIndex}`]?.serviceType}
                    helperText={validationErrors[`service_${serviceIndex}`]?.serviceType || 'Select the service category'}
                  >
                    {serviceTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    required
                    label="Target Audience"
                    value={service.targetAudience}
                    onChange={(e) => handleServiceChange(serviceIndex, 'targetAudience', e.target.value)}
                    error={!!validationErrors[`service_${serviceIndex}`]?.targetAudience}
                    helperText={validationErrors[`service_${serviceIndex}`]?.targetAudience || 'Select the target audience'}
                  >
                    {targetAudience.map((audience) => (
                      <MenuItem key={audience} value={audience}>{audience}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Duration (minutes)"
                    type="number"
                    value={service.duration || ''}
                    onChange={(e) => handleServiceChange(serviceIndex, 'duration', e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><TimeIcon /></InputAdornment>,
                      inputProps: { min: 1, max: 600 }
                    }}
                    placeholder="60"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Detailed Description"
                    multiline
                    rows={3}
                    value={service.detailedDescription}
                    onChange={(e) => handleServiceChange(serviceIndex, 'detailedDescription', e.target.value)}
                    placeholder="Provide a detailed description of the service"
                    error={!!validationErrors[`service_${serviceIndex}`]?.detailedDescription}
                    helperText={validationErrors[`service_${serviceIndex}`]?.detailedDescription || 'Enter a detailed description'}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Base Price (LKR)"
                    type="number"
                    value={service.pricing.basePrice}
                    onChange={(e) => handleServiceChange(serviceIndex, 'pricing.basePrice', e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">LKR</InputAdornment>,
                      inputProps: { min: 0, step: "0.01" }
                    }}
                    placeholder="0"
                    error={!!validationErrors[`service_${serviceIndex}`]?.pricing?.basePrice}
                    helperText={validationErrors[`service_${serviceIndex}`]?.pricing?.basePrice || 'Enter the base price'}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Service Location"
                    value={service.serviceLocation}
                    onChange={(e) => handleServiceChange(serviceIndex, 'serviceLocation', e.target.value)}
                  >
                    <MenuItem value="home_service">Home Service Only</MenuItem>
                    <MenuItem value="salon_only">Salon/Studio Only</MenuItem>
                    <MenuItem value="both">Both Home & Salon</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </CardContent>
    </Card>
  );

  const renderPoliciesForm = () => (
    <Card sx={{ maxWidth: 600, mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
          Business Policies & Terms
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Payment Methods Accepted:
            </Typography>
            <FormControl fullWidth error={!!validationErrors.paymentMethods}>
              <InputLabel>Payment Methods</InputLabel>
              <Select
                multiple
                name="paymentMethods"
                value={formData.paymentMethods}
                onChange={handleChange}
                input={<OutlinedInput label="Payment Methods" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={paymentOptions.find(p => p.value === value)?.label} />
                    ))}
                  </Box>
                )}
              >
                {paymentOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {validationErrors.paymentMethods && (
                <FormHelperText>{validationErrors.paymentMethods}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="General Cancellation Policy"
              multiline
              rows={3}
              name="generalCancellationPolicy"
              value={formData.generalCancellationPolicy}
              onChange={handleChange}
              placeholder="e.g., 24 hours notice required for cancellation"
            />
          </Grid>
          
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  required
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the BeautiQ Terms of Service and Privacy Policy, and confirm that all information provided is accurate. *
                </Typography>
              }
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
      case 2:
        return renderServicesForm();
      case 3:
        return renderPoliciesForm();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={() => navigate('/')}
            sx={{ mr: 2, color: '#075B5E' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            component="h1"
            color="primary"
            fontWeight="bold"
          >
            Service Provider Registration
          </Typography>
        </Box>

        <Dialog open={registrationSuccess} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ textAlign: 'center', color: '#075B5E' }}>
            Registration Successful!
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ textAlign: 'center', mb: 2 }}>
              Your registration has been submitted for admin approval.
              You will be notified via email once your account is approved.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
            <Button
              onClick={() => navigate('/service-provider-approval-success')}
              variant="contained"
              sx={{ bgcolor: '#075B5E', '&:hover': { bgcolor: '#054548' } }}
            >
              Continue
            </Button>
          </DialogActions>
        </Dialog>

        <Paper sx={{ p: 4, borderRadius: 3 }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit}>
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
                  sx={{ bgcolor: '#075B5E', '&:hover': { bgcolor: '#054548' } }}
                >
                  {loading ? 'Submitting...' : 'Submit Registration'}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  sx={{ bgcolor: '#075B5E', '&:hover': { bgcolor: '#054548' } }}
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