// ServiceProviderServiceFormPage.js - FIXED VERSION
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Breadcrumbs,
  Link,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Send as SendIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ServiceProviderSidebar from '../../components/ServiceProviderSidebar';
import Footer from '../../components/footer';
import axios from 'axios';

const ServiceProviderServiceFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { serviceId } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Extract category from URL params
  const queryParams = new URLSearchParams(location.search);
  const selectedCategory = queryParams.get('category');

  console.log('🔍 Service Form - Selected category from URL:', selectedCategory);

  const [formData, setFormData] = useState({
    name: '',
    type: selectedCategory || '', // This will be read-only
    category: '',
    description: '',
    duration: 60,
    experienceLevel: 'beginner',
    pricing: {
      basePrice: '',
      priceType: 'fixed'
    },
    serviceLocation: 'both',
    customNotes: '',
    preparationRequired: '',
    cancellationPolicy: '24 hours notice required',
    minLeadTime: 2,
    maxLeadTime: 30
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Fixed service types to match exactly what's expected by backend
  const serviceTypes = [
    'Hair Cut', 'Hair Style', 'Face Makeup', 'Nail Art', 'Saree Draping', 'Eye Makeup'
  ];

  const targetAudiences = ['Women', 'Men', 'Kids', 'Unisex'];
  const experienceLevels = ['beginner', 'intermediate', 'experienced', 'expert'];
  const priceTypes = ['fixed', 'hourly', 'variable'];
  const serviceLocations = ['home_service', 'salon_only', 'both'];

  // Set the service type from URL parameter on component mount
  useEffect(() => {
    if (selectedCategory) {
      console.log('🔍 Setting service type from category:', selectedCategory);
      setFormData(prevData => ({ 
        ...prevData, 
        type: selectedCategory 
      }));
    }
  }, [selectedCategory]);
  
  // If editing, fetch existing service details and populate form
  useEffect(() => {
    if (!serviceId) return;
    const fetchService = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:5000/api/services/${serviceId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          const svc = response.data.service;
          setFormData({
            name: svc.name || '',
            type: svc.type || '',
            category: svc.category || '',
            description: svc.description || '',
            duration: svc.duration || 60,
            experienceLevel: svc.experienceLevel || 'beginner',
            pricing: {
              basePrice: svc.pricing.basePrice?.toString() || '',
              priceType: svc.pricing.priceType || 'fixed'
            },
            serviceLocation: svc.serviceLocation || 'both',
            customNotes: svc.customNotes || '',
            preparationRequired: svc.preparationRequired || '',
            cancellationPolicy: svc.cancellationPolicy || '24 hours notice required',
            minLeadTime: svc.minLeadTime || 2,
            maxLeadTime: svc.maxLeadTime || 30
          });
        } else {
          setError('Failed to load service details');
        }
      } catch (err) {
        console.error('Error loading service for edit:', err);
        setError('Error loading service for editing');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('🔍 Form field changed:', name, '=', value);
    
    // Handle nested pricing object
    if (name.startsWith('pricing.')) {
      const pricingField = name.split('.')[1];
      setFormData(prevData => ({
        ...prevData,
        pricing: {
          ...prevData.pricing,
          [pricingField]: value
        }
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    console.log('🔍 Form submission started');
    console.log('🔍 Form data to submit:', formData);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Get auth token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      console.log('🔍 Auth token found:', token ? 'Yes' : 'No');

      // FIXED: Create the submission data with proper structure
      const submissionData = {
        name: formData.name.trim(),
        type: formData.type,
        category: formData.category,
        description: formData.description.trim(),
        pricing: {
          basePrice: parseFloat(formData.pricing.basePrice),
          priceType: formData.pricing.priceType || 'fixed'
        },
        duration: parseInt(formData.duration),
        experienceLevel: formData.experienceLevel || 'beginner',
        serviceLocation: formData.serviceLocation || 'both',
        preparationRequired: formData.preparationRequired?.trim() || '',
        customNotes: formData.customNotes?.trim() || '',
        cancellationPolicy: formData.cancellationPolicy?.trim() || '24 hours notice required',
        minLeadTime: Math.max(1, parseInt(formData.minLeadTime) || 2),
        maxLeadTime: Math.min(365, parseInt(formData.maxLeadTime) || 30)
      };

      console.log('🔍 Submitting service data to backend:', submissionData);

      // Choose endpoint and method based on edit or create
      const url = serviceId
        ? `http://localhost:5000/api/services/${serviceId}`
        : 'http://localhost:5000/api/services/add';
      const method = serviceId ? 'put' : 'post';
      const response = await axios[method](
        url,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );
      
      console.log('🔍 Backend response:', response.data);

      if (response.data.success) {
        setSuccess(
          serviceId
            ? 'Service updated successfully.'
            : `${formData.name} service has been submitted successfully! It is now pending admin approval.`
        );
        // After update or submission, navigate back
        setTimeout(() => {
          navigate(serviceId ? '/service-provider/services' : '/service-provider/my-services');
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to save service');
      }
    } catch (err) {
      console.error('🔍 Service submission error:', err);
      console.error('🔍 Error response:', err.response?.data);
      
      let errorMessage = 'An error occurred while submitting the service';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.details && Array.isArray(err.response.data.details)) {
        errorMessage = err.response.data.details.join(', ');
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Handle specific error cases
      if (err.response?.status === 403) {
        if (err.response.data.error === 'PROVIDER_NOT_APPROVED') {
          errorMessage = 'Your service provider account must be approved before you can create services. Please wait for admin approval.';
        } else {
          errorMessage = 'You do not have permission to create services. Please ensure you are logged in as an approved service provider.';
        }
      } else if (err.response?.status === 401) {
        errorMessage = 'Your session has expired. Please log in again.';
        setTimeout(() => {
          navigate('/service-provider-login');
        }, 2000);
      } else if (err.response?.status === 400) {
        errorMessage = 'Please check your input data and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Service name is required');
      return false;
    }
    
    if (formData.name.trim().length < 2) {
      setError('Service name must be at least 2 characters long');
      return false;
    }
    
    if (!formData.type) {
      setError('Service type is required - this should be automatically set from your selection');
      return false;
    }
    
    if (!formData.category) {
      setError('Target audience is required');
      return false;
    }
    
    if (!formData.description.trim()) {
      setError('Service description is required');
      return false;
    }
    
    if (formData.description.trim().length < 10) {
      setError('Service description must be at least 10 characters long');
      return false;
    }
    
    if (!formData.pricing.basePrice || isNaN(parseFloat(formData.pricing.basePrice)) || parseFloat(formData.pricing.basePrice) <= 0) {
      setError('Valid base price is required (must be greater than 0)');
      return false;
    }
    
    if (parseFloat(formData.pricing.basePrice) > 1000000) {
      setError('Base price cannot exceed 1,000,000 LKR');
      return false;
    }
    
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      setError('Valid duration is required');
      return false;
    }
    
    if (parseInt(formData.duration) < 15 || parseInt(formData.duration) > 600) {
      setError('Service duration must be between 15 and 600 minutes');
      return false;
    }
    
    return true;
  };

  const handleLogout = () => {
    logout();
    navigate('/service-provider-login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: '#003047' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#FFFFFF', fontWeight: 600 }}>
            Service Registration Page
          </Typography>
          <Button 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              bgcolor: 'white',
              color: '#003047',
              fontWeight: 600,
              border: '1px solid #003047',
              borderRadius: 2,
              px: 2,
              py: 0.5,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                bgcolor: '#003047',
                color: 'white',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <ServiceProviderSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onResignation={() => {}}
      />

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            underline="hover"
            color="inherit"
            onClick={() => navigate('/service-provider/my-services')}
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <ArrowBackIcon fontSize="small" />
            My Services
          </Link>
          <Typography color="text.primary">{serviceId ? 'Edit Service' : 'Create New Service'}</Typography>
        </Breadcrumbs>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" gutterBottom sx={{ 
              color: '#003047', 
              fontWeight: 'bold'
            }}>
              {serviceId ? 'Edit Service' : 'Create New Service'}
            </Typography>
            {selectedCategory && (
              <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ 
                  color: '#075B5E',
                  fontWeight: 600,
                  mb: 1
                }}>
                  Creating service for: <strong>{selectedCategory}</strong>
                </Typography>
                <Typography variant="body2">
                  The service type field below is automatically set and cannot be changed.
                </Typography>
              </Alert>
            )}
            <Typography variant="body1" sx={{ color: '#666', mb: 3 }}>
              Fill in the details below to create your new service. All fields marked with * are required.
            </Typography>
            <Divider sx={{ my: 2 }} />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#003047', fontWeight: 600 }}>
                  Basic Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Service Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  placeholder="e.g., Bridal Hair Styling, Men's Haircut, etc."
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Service Type *"
                  name="type"
                  value={formData.type || selectedCategory || ''}
                  InputProps={{
                    readOnly: true,
                    startAdornment: <LockIcon sx={{ mr: 1, color: '#666', fontSize: 20 }} />
                  }}
                  variant="outlined"
                  helperText="Automatically set from your selection - cannot be changed"
                  sx={{
                    '& .MuiInputBase-input': {
                      backgroundColor: '#f8f9fa',
                      color: '#003047',
                      fontWeight: 600,
                      cursor: 'not-allowed'
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#e0e0e0',
                        borderWidth: 2,
                        borderStyle: 'dashed'
                      },
                      '&:hover fieldset': {
                        borderColor: '#bdbdbd',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#9e9e9e',
                      }
                    }
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Target Audience *</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    {targetAudiences.map((audience) => (
                      <MenuItem key={audience} value={audience}>{audience}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Detailed Description *"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Provide a detailed description of your service, what it includes, techniques used, expected results, etc."
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#003047', fontWeight: 600, mt: 2 }}>
                  Pricing & Duration
                </Typography>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Base Price (LKR) *"
                  name="pricing.basePrice"
                  value={formData.pricing.basePrice}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                  placeholder="0.00"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Duration (minutes) *"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 15, max: 600 }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Experience Level</InputLabel>
                  <Select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                  >
                    {experienceLevels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, color: '#003047', fontWeight: 600, mt: 2 }}>
                  Additional Details
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Service Location</InputLabel>
                  <Select
                    name="serviceLocation"
                    value={formData.serviceLocation}
                    onChange={handleChange}
                  >
                    <MenuItem value="home_service">Home Service Only</MenuItem>
                    <MenuItem value="salon_only">Salon Only</MenuItem>
                    <MenuItem value="both">Both Home & Salon</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Price Type</InputLabel>
                  <Select
                    name="pricing.priceType"
                    value={formData.pricing.priceType}
                    onChange={handleChange}
                  >
                    {priceTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Preparation Required"
                  name="preparationRequired"
                  value={formData.preparationRequired}
                  onChange={handleChange}
                  placeholder="What should customers do to prepare for this service?"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Custom Notes"
                  name="customNotes"
                  value={formData.customNotes}
                  onChange={handleChange}
                  placeholder="Any additional notes or special instructions"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Cancellation Policy"
                  name="cancellationPolicy"
                  value={formData.cancellationPolicy}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    type="button"
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/service-provider/my-services')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : (serviceId ? <SaveIcon /> : <SendIcon />)}
                    sx={{
                      bgcolor: '#003047',
                      '&:hover': { bgcolor: '#075B5E' }
                    }}
                  >
                    {loading ? (serviceId ? 'Updating...' : 'Submitting...') : (serviceId ? 'Update Service' : 'Submit for Approval')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};

export default ServiceProviderServiceFormPage;