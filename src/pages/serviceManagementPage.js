import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ApprovedIcon,
  Pending as PendingIcon,
  Cancel as RejectedIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/footer';

const ServiceManagement = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [openPackageDialog, setOpenPackageDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [serviceFormData, setServiceFormData] = useState({
    serviceName: '',
    serviceType: '',
    targetAudience: '',
    serviceSubType: '',
    detailedDescription: '',
    duration: 60,
    experienceLevel: 'beginner',
    basePrice: '',
    priceType: 'fixed',
    serviceLocation: 'both',
    customNotes: '',
    preparationRequired: '',
    cancellationPolicy: '24 hours notice required',
    minLeadTime: 2,
    maxLeadTime: 30
  });

  const [packageFormData, setPackageFormData] = useState({
    packageName: '',
    packageType: 'bridal',
    targetAudience: 'Women',
    includedServices: [],
    packageDescription: '',
    totalDuration: 180,
    totalPrice: '',
    packageLocation: 'both',
    customNotes: '',
    preparationRequired: ''
  });

  const serviceTypes = [
    'Hairstyle', 'Haircuts', 'Hair Color', 'Nail Art', 'Manicure', 'Pedicure',
    'Makeup', 'Threading', 'Eyebrow Shaping', 'Facial', 'Skincare', 'Massage', 
    'Saree Draping', 'Hair Extensions', 'Keratin Treatment', 'Hair Wash', 
    'Head Massage', 'Mehendi/Henna', 'Other'
  ];

  const targetAudiences = ['Women', 'Men', 'Kids (Boy)', 'Kids (Girl)', 'Unisex'];

  const serviceSubTypes = {
    'Hairstyle': ['Bridal', 'Party', 'Casual', 'Traditional'],
    'Makeup': ['Bridal', 'Party', 'Casual', 'Traditional'],
    'Nail Art': ['Basic', 'Advanced', 'Bridal', 'Party'],
    'Facial': ['Basic Cleanup', 'Deep Cleansing', 'Anti-Aging', 'Brightening'],
    'Massage': ['Head Massage', 'Face Massage', 'Relaxation', 'Therapeutic'],
    'Mehendi/Henna': ['Simple', 'Intricate', 'Bridal', 'Arabic Style'],
    'Saree Draping': ['Traditional', 'Modern', 'Regional', 'Designer'],
    'Other': ['Custom']
  };

  useEffect(() => {
    fetchServices();
    fetchPackages();
  }, []);

  const fetchServices = async () => {
    try {
      // API call to fetch services
      // setServices(response.data);
    } catch (error) {
      setError('Failed to fetch services');
    }
  };

  const fetchPackages = async () => {
    try {
      // API call to fetch packages
      // setPackages(response.data);
    } catch (error) {
      setError('Failed to fetch packages');
    }
  };

  const handleServiceSubmit = async () => {
    setLoading(true);
    try {
      // API call to add/update service
      if (editingService) {
        // Update service
      } else {
        // Add new service
      }
      setOpenServiceDialog(false);
      resetServiceForm();
      fetchServices();
    } catch (error) {
      setError('Failed to save service');
    } finally {
      setLoading(false);
    }
  };

  const handlePackageSubmit = async () => {
    setLoading(true);
    try {
      // API call to add/update package
      if (editingPackage) {
        // Update package
      } else {
        // Add new package
      }
      setOpenPackageDialog(false);
      resetPackageForm();
      fetchPackages();
    } catch (error) {
      setError('Failed to save package');
    } finally {
      setLoading(false);
    }
  };

  const resetServiceForm = () => {
    setServiceFormData({
      serviceName: '',
      serviceType: '',
      targetAudience: '',
      serviceSubType: '',
      detailedDescription: '',
      duration: 60,
      experienceLevel: 'beginner',
      basePrice: '',
      priceType: 'fixed',
      serviceLocation: 'both',
      customNotes: '',
      preparationRequired: '',
      cancellationPolicy: '24 hours notice required',
      minLeadTime: 2,
      maxLeadTime: 30
    });
    setEditingService(null);
  };

  const resetPackageForm = () => {
    setPackageFormData({
      packageName: '',
      packageType: 'bridal',
      targetAudience: 'Women',
      includedServices: [],
      packageDescription: '',
      totalDuration: 180,
      totalPrice: '',
      packageLocation: 'both',
      customNotes: '',
      preparationRequired: ''
    });
    setEditingPackage(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <ApprovedIcon color="success" />;
      case 'pending':
        return <PendingIcon color="warning" />;
      case 'rejected':
        return <RejectedIcon color="error" />;
      default:
        return <PendingIcon color="warning" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#075B5E', fontWeight: 'bold' }}>
          Service Management
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ width: '100%', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="My Services" />
            <Tab label="My Packages" />
          </Tabs>
        </Paper>

        {/* Services Tab */}
        {tabValue === 0 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Your Services</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenServiceDialog(true)}
                sx={{ bgcolor: '#075B5E' }}
              >
                Add New Service
              </Button>
            </Box>

            <Grid container spacing={3}>
              {services.map((service) => (
                <Grid item xs={12} md={6} lg={4} key={service.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">{service.serviceName}</Typography>
                        {getStatusIcon(service.status)}
                      </Box>
                      <Typography color="textSecondary" gutterBottom>
                        {service.serviceType} • {service.targetAudience}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {service.detailedDescription}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        LKR {service.basePrice}
                      </Typography>
                      <Chip
                        label={service.status}
                        color={getStatusColor(service.status)}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                    <CardActions>
                      <IconButton onClick={() => {
                        setEditingService(service);
                        setServiceFormData(service);
                        setOpenServiceDialog(true);
                      }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => {
                        // Handle delete
                      }}>
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Packages Tab */}
        {tabValue === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Your Packages</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenPackageDialog(true)}
                sx={{ bgcolor: '#075B5E' }}
              >
                Add New Package
              </Button>
            </Box>

            <Grid container spacing={3}>
              {packages.map((pkg) => (
                <Grid item xs={12} md={6} lg={4} key={pkg.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">{pkg.packageName}</Typography>
                        {getStatusIcon(pkg.status)}
                      </Box>
                      <Typography color="textSecondary" gutterBottom>
                        {pkg.packageType} • {pkg.targetAudience}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {pkg.packageDescription}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        LKR {pkg.totalPrice}
                      </Typography>
                      <Chip
                        label={pkg.status}
                        color={getStatusColor(pkg.status)}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                    <CardActions>
                      <IconButton onClick={() => {
                        setEditingPackage(pkg);
                        setPackageFormData(pkg);
                        setOpenPackageDialog(true);
                      }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => {
                        // Handle delete
                      }}>
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Service Dialog */}
        <Dialog open={openServiceDialog} onClose={() => setOpenServiceDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingService ? 'Edit Service' : 'Add New Service'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Service Name"
                  value={serviceFormData.serviceName}
                  onChange={(e) => setServiceFormData({...serviceFormData, serviceName: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Service Type</InputLabel>
                  <Select
                    value={serviceFormData.serviceType}
                    onChange={(e) => setServiceFormData({...serviceFormData, serviceType: e.target.value})}
                  >
                    {serviceTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Target Audience</InputLabel>
                  <Select
                    value={serviceFormData.targetAudience}
                    onChange={(e) => setServiceFormData({...serviceFormData, targetAudience: e.target.value})}
                  >
                    {targetAudiences.map((audience) => (
                      <MenuItem key={audience} value={audience}>{audience}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Sub Type</InputLabel>
                  <Select
                    value={serviceFormData.serviceSubType}
                    onChange={(e) => setServiceFormData({...serviceFormData, serviceSubType: e.target.value})}
                  >
                    {(serviceSubTypes[serviceFormData.serviceType] || []).map((subType) => (
                      <MenuItem key={subType} value={subType}>{subType}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Detailed Description"
                  value={serviceFormData.detailedDescription}
                  onChange={(e) => setServiceFormData({...serviceFormData, detailedDescription: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Duration (minutes)"
                  value={serviceFormData.duration}
                  onChange={(e) => setServiceFormData({...serviceFormData, duration: parseInt(e.target.value)})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Base Price (LKR)"
                  value={serviceFormData.basePrice}
                  onChange={(e) => setServiceFormData({...serviceFormData, basePrice: e.target.value})}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenServiceDialog(false)}>Cancel</Button>
            <Button onClick={handleServiceSubmit} variant="contained" disabled={loading}>
              {loading ? 'Saving...' : 'Save Service'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Package Dialog */}
        <Dialog open={openPackageDialog} onClose={() => setOpenPackageDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingPackage ? 'Edit Package' : 'Add New Package'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Package Name"
                  value={packageFormData.packageName}
                  onChange={(e) => setPackageFormData({...packageFormData, packageName: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Package Type</InputLabel>
                  <Select
                    value={packageFormData.packageType}
                    onChange={(e) => setPackageFormData({...packageFormData, packageType: e.target.value})}
                  >
                    <MenuItem value="bridal">Bridal</MenuItem>
                    <MenuItem value="party">Party</MenuItem>
                    <MenuItem value="wellness">Wellness</MenuItem>
                    <MenuItem value="beauty">Beauty</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Package Description"
                  value={packageFormData.packageDescription}
                  onChange={(e) => setPackageFormData({...packageFormData, packageDescription: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Duration (minutes)"
                  value={packageFormData.totalDuration}
                  onChange={(e) => setPackageFormData({...packageFormData, totalDuration: parseInt(e.target.value)})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Price (LKR)"
                  value={packageFormData.totalPrice}
                  onChange={(e) => setPackageFormData({...packageFormData, totalPrice: e.target.value})}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPackageDialog(false)}>Cancel</Button>
            <Button onClick={handlePackageSubmit} variant="contained" disabled={loading}>
              {loading ? 'Saving...' : 'Save Package'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Footer />
    </Box>
  );
};

export default ServiceManagement;