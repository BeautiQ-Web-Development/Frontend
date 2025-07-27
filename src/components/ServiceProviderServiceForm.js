import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  IconButton,
  Divider,
  MenuItem,
  InputAdornment,
  Alert,
  Snackbar,
  AppBar,
  Toolbar,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
  AttachMoney as MoneyIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import ServiceProviderSidebar from './ServiceProviderSidebar';
import Footer from './footer';
import axios from 'axios';
import { validateServiceData } from '../utils/validation';

const ServiceProviderServiceForm = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const isEdit = Boolean(serviceId);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [serviceSubtypes, setServiceSubtypes] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    serviceSubType: '', // Add this field
    category: '',
    description: '',
    pricing: {
      basePrice: '',
      priceType: 'fixed',
      variations: [{ name: 'Standard Service', price: '', description: '' }],
      addOns: [{ name: '', price: '', description: '' }]
    },
    duration: 60,
    experienceLevel: 'beginner',
    serviceLocation: 'both',
    preparationRequired: '',
    customNotes: '',
    cancellationPolicy: '24 hours notice required',
    minLeadTime: 2,
    maxLeadTime: 30,
    availability: {
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      timeSlots: [{ start: '09:00', end: '18:00' }]
    }
  });

  const serviceTypes = [
    'Hairstyle', 'Haircuts', 'Hair Color', 'Nail Art', 'Manicure', 'Pedicure',
    'Makeup', 'Bridal Makeup', 'Party Makeup', 'Threading', 'Facial', 'Massage', 
    'Saree Draping', 'Hair Extensions', 'Mehendi/Henna', 'Other'
  ];

  const serviceCategories = [
    'Kids', 'Women', 'Men', 'Unisex'
  ];

  const serviceStyles = [
    'Bridal', 'Party', 'Traditional', 'Casual', 'Formal', 'Everyday', 'Special Occasion'
  ];

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner (0-2 years)' },
    { value: 'intermediate', label: 'Intermediate (2-5 years)' },
    { value: 'experienced', label: 'Experienced (5-10 years)' },
    { value: 'expert', label: 'Expert (10+ years)' }
  ];

  useEffect(() => {
    if (isEdit) {
      fetchService();
    }
  }, [serviceId]);

  // Fetch subtypes when service type changes
  useEffect(() => {
    if (formData.type) {
      fetchServiceSubtypes(formData.type);
    } else {
      setServiceSubtypes([]);
    }
  }, [formData.type]);

  const fetchService = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/services/${serviceId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const service = response.data.service;
        setFormData({
          name: service.name || '',
          type: service.type || '',
          serviceSubType: service.serviceSubType || '',
          category: service.category || '',
          description: service.description || '',
          pricing: {
            basePrice: service.pricing?.basePrice?.toString() || '',
            priceType: service.pricing?.priceType || 'fixed',
            variations: service.pricing?.variations?.length > 0 ? 
              service.pricing.variations : 
              [{ name: 'Standard Service', price: '', description: '' }],
            addOns: service.pricing?.addOns?.length > 0 ? 
              service.pricing.addOns : 
              [{ name: '', price: '', description: '' }]
          },
          duration: service.duration || 60,
          experienceLevel: service.experienceLevel || 'beginner',
          serviceLocation: service.serviceLocation || 'both',
          preparationRequired: service.preparationRequired || '',
          customNotes: service.customNotes || '',
          cancellationPolicy: service.cancellationPolicy || '24 hours notice required',
          minLeadTime: service.minLeadTime || 2,
          maxLeadTime: service.maxLeadTime || 30,
          availability: service.availability || {
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
            timeSlots: [{ start: '09:00', end: '18:00' }]
          }
        });
      }
    } catch (err) {
      console.error('Error fetching service:', err);
      setError('Failed to fetch service details');
      setSnackbarOpen(true);
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchServiceSubtypes = async (serviceType) => {
    try {
      // Don't include auth token for public endpoint
      const response = await axios.get(`http://localhost:5000/api/services/subtypes/${serviceType}`);
      if (response.data.success) {
        setServiceSubtypes(response.data.subtypes);
      } else {
        setServiceSubtypes([]);
      }
    } catch (error) {
      console.error('Error fetching subtypes:', error);
      setServiceSubtypes([]);
    }
  };

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handlePricingVariationChange = (index, field, value) => {
    const updatedVariations = [...formData.pricing.variations];
    updatedVariations[index][field] = value;
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        variations: updatedVariations
      }
    }));
  };

  const handleAddOnChange = (index, field, value) => {
    const updatedAddOns = [...formData.pricing.addOns];
    updatedAddOns[index][field] = value;
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        addOns: updatedAddOns
      }
    }));
  };

  const addPricingVariation = () => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        variations: [...prev.pricing.variations, { name: '', price: '', description: '' }]
      }
    }));
  };

  const removePricingVariation = (index) => {
    if (formData.pricing.variations.length > 1) {
      const updatedVariations = formData.pricing.variations.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        pricing: {
          ...prev.pricing,
          variations: updatedVariations
        }
      }));
    }
  };

  const addAddOn = () => {
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        addOns: [...prev.pricing.addOns, { name: '', price: '', description: '' }]
      }
    }));
  };

  const removeAddOn = (index) => {
    const updatedAddOns = formData.pricing.addOns.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        addOns: updatedAddOns
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form data before validation:', formData);
    
    // Enhanced validation using utility function
    const serviceValidationErrors = validateServiceData(formData);
    
    if (serviceValidationErrors.length > 0) {
      console.error('Validation errors:', serviceValidationErrors);
      setError(serviceValidationErrors.join(', '));
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      // Enhanced data preparation with better validation
      const serviceData = {
        name: formData.name.toString().trim(),
        type: formData.type.toString().trim(),
        serviceSubType: formData.serviceSubType?.toString().trim() || '',
        category: formData.category.toString().trim(),
        description: formData.description.toString().trim(),
        pricing: {
          basePrice: parseFloat(formData.pricing.basePrice),
          priceType: formData.pricing.priceType || 'fixed',
          variations: Array.isArray(formData.pricing.variations) ? 
            formData.pricing.variations
              .filter(v => v.name && v.name.trim() && v.price && !isNaN(parseFloat(v.price)))
              .map(v => ({
                name: v.name.toString().trim(),
                price: parseFloat(v.price),
                description: v.description ? v.description.toString().trim() : ''
              })) : [],
          addOns: Array.isArray(formData.pricing.addOns) ?
            formData.pricing.addOns
              .filter(a => a.name && a.name.trim() && a.price && !isNaN(parseFloat(a.price)))
              .map(a => ({
                name: a.name.toString().trim(),
                price: parseFloat(a.price),
                description: a.description ? a.description.toString().trim() : ''
              })) : []
        },
        duration: Math.max(15, Math.min(600, parseInt(formData.duration) || 60)),
        experienceLevel: formData.experienceLevel || 'beginner',
        serviceLocation: formData.serviceLocation || 'both',
        preparationRequired: formData.preparationRequired ? formData.preparationRequired.toString().trim() : '',
        customNotes: formData.customNotes ? formData.customNotes.toString().trim() : '',
        cancellationPolicy: formData.cancellationPolicy ? formData.cancellationPolicy.toString().trim() : '24 hours notice required',
        minLeadTime: Math.max(1, parseInt(formData.minLeadTime) || 2),
        maxLeadTime: Math.min(365, parseInt(formData.maxLeadTime) || 30),
        availability: formData.availability || {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          timeSlots: [{ start: '09:00', end: '18:00' }]
        }
      };

      console.log('Submitting service data:', serviceData);

      // Final validation before submission
      const finalValidation = validateServiceData(serviceData);
      if (finalValidation.length > 0) {
        throw new Error(finalValidation.join(', '));
      }

      let response;
      const config = {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      };

      if (isEdit) {
        console.log(`Updating service with ID: ${serviceId}`);
        response = await axios.put(`http://localhost:5000/api/services/${serviceId}`, serviceData, config);
        setSuccess('Service update submitted for approval');
      } else {
        console.log('Creating new service');
        response = await axios.post('http://localhost:5000/api/services', serviceData, config);
        setSuccess('Service created and submitted for approval');
      }

      console.log('Service submission response:', response.data);
      
      if (response.data.success) {
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate('/service-provider/services');
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to submit service');
      }
      
    } catch (err) {
      console.error('Error submitting service:', err);
      
      let errorMessage = `Failed to ${isEdit ? 'update' : 'create'} service`;
      
      if (err.response?.status === 400) {
        if (err.response.data?.details) {
          errorMessage = Array.isArray(err.response.data.details) ? 
            err.response.data.details.join(', ') : 
            err.response.data.details;
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
        setTimeout(() => navigate('/service-provider-login'), 2000);
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied. You can only update your own services.';
      } else if (err.response?.status === 404) {
        errorMessage = 'Service not found. It may have been deleted.';
      } else if (err.response?.status === 409) {
        errorMessage = 'Service has pending changes awaiting approval. Cannot submit new changes.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/service-provider-login');
  };

  if (fetchLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: '#003047' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setSidebarOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => navigate('/service-provider/services')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#FFFFFF', fontWeight: 600 }}>
            {isEdit ? 'Edit Service' : 'Add New Service'}
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
      />

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: '#2D1B3D', mb: 4 }}>
          {isEdit ? 'Edit Service' : 'Add New Service'}
        </Typography>

        <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, borderRadius: 3 }}>
          {/* Basic Information */}
          <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
            Basic Information
          </Typography
          >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="Service Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Bridal Hair Styling"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                required
                label="Service Type"
                value={formData.type}
                onChange={(e) => {
                  handleChange('type', e.target.value);
                  handleChange('serviceSubType', ''); // Reset subtype when type changes
                }}
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
                required={formData.type !== 'Other'}
                label="Sub Type"
                value={formData.serviceSubType}
                onChange={(e) => handleChange('serviceSubType', e.target.value)}
                disabled={!formData.type || formData.type === 'Other'}
                helperText={!formData.type ? 'Select service type first' : ''}
              >
                {serviceSubtypes.length > 0 ? (
                  serviceSubtypes.map((subtype) => (
                    <MenuItem key={subtype} value={subtype}>{subtype}</MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>No subtypes available</MenuItem>
                )}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                required
                label="Target Audience"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                {serviceCategories.map((category) => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Service Style"
                value={formData.serviceStyle || ''}
                onChange={(e) => handleChange('serviceStyle', e.target.value)}
                helperText="Optional: Select the service style/occasion"
              >
                <MenuItem value="">Select Style (Optional)</MenuItem>
                {serviceStyles.map((style) => (
                  <MenuItem key={style} value={style}>{style}</MenuItem>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Service Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Provide a detailed description of the service"
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Pricing */}
          <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
            Pricing Structure
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                required
                label="Base Price"
                type="number"
                value={formData.pricing.basePrice}
                onChange={(e) => handleChange('pricing.basePrice', e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><MoneyIcon /></InputAdornment>,
                  inputProps: { min: 0, step: "0.01" }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Price Type"
                value={formData.pricing.priceType}
                onChange={(e) => handleChange('pricing.priceType', e.target.value)}
              >
                <MenuItem value="fixed">Fixed Price</MenuItem>
                <MenuItem value="hourly">Hourly Rate</MenuItem>
                <MenuItem value="package">Package Deal</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={formData.duration}
                onChange={(e) => handleChange('duration', parseInt(e.target.value) || 0)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><TimeIcon /></InputAdornment>,
                  inputProps: { min: 1, max: 600 }
                }}
              />
            </Grid>
          </Grid>

          {/* Price Variations */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Price Variations (Optional)
          </Typography>
          
          {formData.pricing.variations.map((variation, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Variation Name"
                      value={variation.name}
                      onChange={(e) => handlePricingVariationChange(index, 'name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Price"
                      type="number"
                      value={variation.price}
                      onChange={(e) => handlePricingVariationChange(index, 'price', e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">LKR</InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={variation.description}
                      onChange={(e) => handlePricingVariationChange(index, 'description', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    {formData.pricing.variations.length > 1 && (
                      <IconButton 
                        onClick={() => removePricingVariation(index)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
          
          <Button
            startIcon={<AddIcon />}
            onClick={addPricingVariation}
            variant="outlined"
            size="small"
            sx={{ mb: 3 }}
          >
            Add Price Variation
          </Button>

          {/* Add-ons */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Add-on Services (Optional)
          </Typography>
          
          {formData.pricing.addOns.map((addOn, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Add-on Name"
                      value={addOn.name}
                      onChange={(e) => handleAddOnChange(index, 'name', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Additional Price"
                      type="number"
                      value={addOn.price}
                      onChange={(e) => handleAddOnChange(index, 'price', e.target.value)}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">LKR</InputAdornment>
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="Description"
                      value={addOn.description}
                      onChange={(e) => handleAddOnChange(index, 'description', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <IconButton 
                      onClick={() => removeAddOn(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
          
          <Button
            startIcon={<AddIcon />}
            onClick={addAddOn}
            variant="outlined"
            size="small"
            sx={{ mb: 3 }}
          >
            Add Add-on Service
          </Button>

          <Divider sx={{ my: 3 }} />

          {/* Service Details */}
          <Typography variant="h6" color="primary" fontWeight="bold" gutterBottom>
            Service Details & Policies
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Service Location"
                value={formData.serviceLocation}
                onChange={(e) => handleChange('serviceLocation', e.target.value)}
              >
                <MenuItem value="home_service">Home Service Only</MenuItem>
                <MenuItem value="salon_only">Salon/Studio Only</MenuItem>
                <MenuItem value="both">Both Home & Salon</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cancellation Policy"
                value={formData.cancellationPolicy}
                onChange={(e) => handleChange('cancellationPolicy', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Preparation Required"
                multiline
                rows={2}
                value={formData.preparationRequired}
                onChange={(e) => handleChange('preparationRequired', e.target.value)}
                placeholder="Any preparation clients need to do before the appointment"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Custom Notes/Instructions"
                multiline
                rows={2}
                value={formData.customNotes}
                onChange={(e) => handleChange('customNotes', e.target.value)}
                placeholder="Additional notes or special instructions for clients"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Lead Time (hours)"
                type="number"
                value={formData.minLeadTime}
                onChange={(e) => handleChange('minLeadTime', parseInt(e.target.value) || 0)}
                helperText="Minimum time needed before appointment"
                InputProps={{
                  inputProps: { min: 1, max: 168 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maximum Advance Booking (days)"
                type="number"
                value={formData.maxLeadTime}
                onChange={(e) => handleChange('maxLeadTime', parseInt(e.target.value) || 0)}
                helperText="How far in advance can clients book"
                InputProps={{
                  inputProps: { min: 1, max: 365 }
                }}
              />
            </Grid>
          </Grid>

          {/* Submit Buttons */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/service-provider/services')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ 
                bgcolor: '#003047',
                '&:hover': { bgcolor: '#003047' },
                minWidth: 120
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : (isEdit ? 'Update Service' : 'Create Service')}
            </Button>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={success ? "success" : "error"}
          sx={{ width: '100%' }}
        >
          {success || error}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default ServiceProviderServiceForm;
