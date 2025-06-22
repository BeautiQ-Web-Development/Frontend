import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Rating,
  IconButton
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Star as StarIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { getApprovedProviders } from '../services/auth';
import Header from '../components/Header';
import Footer from '../components/footer';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import sideBar from '../components/CustomerSidebar'


const ServiceProviderDetailsDialog = ({ open, onClose, provider }) => {
  if (!provider || !open) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight="bold">
            {provider.businessName || provider.fullName}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Avatar
                src={provider.profilePhoto}
                alt={provider.fullName}
                sx={{ width: 120, height: 120, margin: '0 auto', mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                {provider.fullName}
              </Typography>
              <Chip 
                label={provider.businessType || 'Service Provider'} 
                color="primary" 
                variant="outlined"
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
              Contact Information
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <PhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography>{provider.mobileNumber || 'Not provided'}</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography>{provider.emailAddress}</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography>{provider.city || 'Location not specified'}</Typography>
            </Box>

            {provider.experience && (
              <Box mb={2}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  Experience
                </Typography>
                <Typography>
                  {provider.experience.years} years of experience
                </Typography>
                {provider.experience.description && (
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    {provider.experience.description}
                  </Typography>
                )}
              </Box>
            )}

            {provider.specialties && provider.specialties.length > 0 && (
              <Box mb={2}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  Specialties
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {provider.specialties.map((specialty, index) => (
                    <Chip key={index} label={specialty} color="secondary" size="small" />
                  ))}
                </Box>
              </Box>
            )}

            {provider.languages && provider.languages.length > 0 && (
              <Box mb={2}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  Languages
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {provider.languages.map((language, index) => (
                    <Chip key={index} label={language} variant="outlined" size="small" />
                  ))}
                </Box>
              </Box>
            )}

            {provider.services && provider.services.length > 0 && (
              <Box mb={2}>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  Services & Pricing
                </Typography>
                {provider.services.map((service, index) => (
                  <Box key={index} mb={1} p={1} bgcolor="grey.50" borderRadius={1}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {service.name || service.type}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      LKR {service.price}
                    </Typography>
                    {service.duration && (
                      <Typography variant="body2" color="text.secondary">
                        Duration: {service.duration}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Box>
            )}

            {provider.policies && (
              <Box>
                <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                  Policies
                </Typography>
                {provider.policies.cancellation && (
                  <Typography variant="body2" mb={1}>
                    <strong>Cancellation:</strong> {provider.policies.cancellation}
                  </Typography>
                )}
                {provider.policies.paymentMethods && provider.policies.paymentMethods.length > 0 && (
                  <Typography variant="body2" mb={1}>
                    <strong>Payment Methods:</strong> {provider.policies.paymentMethods.join(', ')}
                  </Typography>
                )}
                {provider.policies.advanceBooking && (
                  <Typography variant="body2">
                    <strong>Advance Booking:</strong> {provider.policies.advanceBooking} days
                  </Typography>
                )}
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        <Button variant="contained" color="primary">
          Book Service
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [serviceProviders, setServiceProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServiceProviders();
  }, []);

  const fetchServiceProviders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getApprovedProviders();
      
      if (response.success && response.data) {
        setServiceProviders(response.data);
      } else {
        setError('Failed to load service providers');
      }
    } catch (error) {
      console.error('Error fetching service providers:', error);
      setError('Failed to load service providers');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/customer-login');
  };

  const handleViewProvider = (provider) => {
    setSelectedProvider(provider);
    setDialogOpen(true);
  };

  const ServiceProviderCard = ({ provider }) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3
        }
      }}
    >
      <CardMedia
        component="div"
        sx={{
          height: 200,
          backgroundImage: `url(${provider.profilePhoto || '/default-salon.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.7))',
            display: 'flex',
            alignItems: 'flex-end',
            p: 2
          }}
        >
          <Typography variant="h6" color="white" fontWeight="bold">
            {provider.businessName || provider.fullName}
          </Typography>
        </Box>
      </CardMedia>
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" mb={1}>
          <StarIcon sx={{ color: '#FFD700', mr: 0.5 }} />
          <Rating value={4.8} precision={0.1} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" ml={1}>
            (758)
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {provider.businessType || 'Beauty & Wellness'}
        </Typography>
        
        <Box display="flex" alignItems="center" mb={1}>
          <LocationIcon sx={{ color: 'primary.main', fontSize: 16, mr: 0.5 }} />
          <Typography variant="body2">
            {provider.city || 'Location not specified'}
          </Typography>
        </Box>
        
        {provider.specialties && provider.specialties.length > 0 && (
          <Box mb={2}>
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {provider.specialties.slice(0, 3).map((specialty, index) => (
                <Chip 
                  key={index} 
                  label={specialty} 
                  size="small" 
                  variant="outlined"
                  color="primary"
                />
              ))}
              {provider.specialties.length > 3 && (
                <Chip 
                  label={`+${provider.specialties.length - 3} more`} 
                  size="small" 
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        )}
        
        {provider.services && provider.services.length > 0 && (
          <Typography variant="body2" color="primary" fontWeight="bold" mb={1}>
            Starting from LKR {Math.min(...provider.services.map(s => s.price))}
          </Typography>
        )}
        
        <Typography variant="body2" color="success.main" mb={2}>
          2 slots available
        </Typography>
      </CardContent>
      
      <Box p={2} pt={0}>
        <Button 
          variant="contained" 
          fullWidth 
          onClick={() => handleViewProvider(provider)}
          sx={{ mb: 1 }}
        >
          View Details
        </Button>
        <Button 
          variant="outlined" 
          fullWidth 
          color="primary"
        >
          Book Now
        </Button>
      </Box>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Custom AppBar with Logout */}
      <Header />
      
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary" fontWeight="bold">
          Available Service Providers
        </Typography>
        
        <Typography variant="body1" color="text.secondary" mb={4}>
          Discover and book services from our verified beauty and wellness professionals
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {serviceProviders.length === 0 ? (
          <Alert severity="info">
            No service providers available at this time.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            {serviceProviders.map((provider) => (
              <Grid item xs={12} sm={6} md={4} key={provider._id}>
                <ServiceProviderCard provider={provider} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <ServiceProviderDetailsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        provider={selectedProvider}
      />

      <Footer />
    </Box>
  );
};

export default CustomerDashboard;
