import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
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
  IconButton,
  CardActions,
  Divider,
  Paper,
  Tooltip,
  Badge,
  Fade,
  Slide,
  Zoom
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
  Star as StarIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  CalendarToday as CalendarIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { getApprovedProviders } from '../../services/auth';
import { fetchNotifications } from '../../services/notification';
import Footer from '../../components/footer';
import CustomerSidebar from '../../components/CustomerSidebar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import EnhancedAppBar from '../../components/EnhancedAppBar';
import api from '../../services/auth';

const CustomerDashboardContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  minHeight: '100vh',
}));

const DiscoveryCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
  border: 'none',
  borderRadius: 20,
  boxShadow: '0 10px 40px rgba(0, 31, 63, 0.1)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 60px rgba(0, 31, 63, 0.2)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #00003f 0%, #764ba2 100%)',
    borderRadius: '20px 20px 0 0',
  }
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #ffffff 0%, #f0f4ff 100%)',
  border: 'none',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 31, 63, 0.08)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 16px 48px rgba(0, 31, 63, 0.15)',
    '& .service-actions': {
      opacity: 1,
      transform: 'translateY(0)',
    }
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
  }
}));

const GradientButton = styled(Button)(({ theme, variant: buttonVariant = 'primary' }) => ({
  borderRadius: 12,
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '0.95rem',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  ...(buttonVariant === 'primary' && {
    background: 'linear-gradient(45deg, #00003f 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    '&:hover': {
      background: 'linear-gradient(45deg, #5a67d8 0%, #00003f 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
    }
  }),
  ...(buttonVariant === 'secondary' && {
    background: 'transparent',
    color: '#00003f',
    border: '2px solid #00003f',
    '&:hover': {
      background: 'linear-gradient(45deg, #00003f 0%, #764ba2 100%)',
      color: 'white',
      transform: 'translateY(-2px)',
    }
  })
}));

const ServiceDetailsDialog = ({ open, onClose, service, navigate }) => {
  if (!service || !open) return null;

  const handleBookService = () => {
    navigate(`/customer/book-service/${service._id}`);
    onClose();
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const getServiceLocation = (service) => {
    // Use business address as primary location, then current address
    return service.serviceProvider?.businessAddress || 
           service.serviceProvider?.currentAddress || 
           service.serviceProvider?.city || 
           'Location not specified';
  };

  const getServiceLocationType = (service) => {
    // Check multiple possible fields for service location type
    return service.serviceLocation || 
           service.locationType || 
           service.serviceLocationType ||
           'At business location'; // default value
  };

  const getPriceType = (service) => {
    // Check different possible locations for priceType
    const priceType = service.priceType || 
                     service.pricing?.type || 
                     service.pricing?.priceType;
    
    if (!priceType) return 'Not specified';
    return priceType.charAt(0).toUpperCase() + priceType.slice(1);
  };

  const getExperienceLevel = (level) => {
    if (!level) return 'Not specified';
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  const getCancellationPolicy = (policy) => {
    if (!policy) return 'Standard cancellation policy applies';
    if (typeof policy === 'object') {
      return `${policy.hours || 24} hours notice required`;
    }
    return policy;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' }}
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
          boxShadow: '0 24px 80px rgba(0, 31, 63, 0.2)',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          background: 'linear-gradient(135deg, #00003f 0%, #764ba2 100%)',
          color: 'white',
          p: 3,
          position: 'relative'
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              {service.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={service.type || service.category}
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                  color: 'white',
                  fontWeight: 600
                }}
              />
              {service.category && service.type !== service.category && (
                <Chip 
                  label={service.category}
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                    color: 'white',
                    fontWeight: 600
                  }}
                />
              )}
            </Box>
          </Box>
          <IconButton 
            onClick={onClose}
            sx={{ 
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Enhanced Service Information */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, backgroundColor: 'rgba(102, 126, 234, 0.05)', borderRadius: 3 }}>
            <Typography variant="h6" sx={{ color: '#00003f', fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1 }} />
              Service Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TimeIcon sx={{ mr: 1, color: '#00003f', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>Duration:</Typography>
                  <Typography variant="body2">{formatDuration(service.duration)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PaymentIcon sx={{ mr: 1, color: '#00003f', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>Price:</Typography>
                  <Typography variant="h6" sx={{ color: '#00003f', fontWeight: 700 }}>
                    LKR {service.basePrice?.toFixed(2) || service.pricing?.basePrice?.toFixed(2) || 'N/A'}
                  </Typography>
                </Box>
              </Grid>

              {/* Price Type - FIXED */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PaymentIcon sx={{ mr: 1, color: '#00003f', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>Price Type:</Typography>
                  <Chip 
                    label={getPriceType(service)} 
                    size="small"
                    sx={{ backgroundColor: 'rgba(0, 0, 63, 0.1)', color: '#00003f' }}
                  />
                </Box>
              </Grid>
              
              {/* Service Location Address - FIXED */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <LocationIcon sx={{ mr: 1, color: '#00003f', fontSize: 20, mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Service Location:</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {getServiceLocation(service)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Service Location Type - FIXED */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationIcon sx={{ mr: 1, color: '#00003f', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>Service Location Type:</Typography>
                  <Chip 
                    label={getServiceLocationType(service)} 
                    size="small"
                    sx={{ 
                      backgroundColor: 'rgba(79, 172, 254, 0.1)', 
                      color: '#4facfe',
                      fontWeight: 600 
                    }}
                  />
                </Box>
              </Grid>

              {/* Experience Level */}
              {service.experienceLevel && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <StarIcon sx={{ mr: 1, color: '#00003f', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>Experience Level:</Typography>
                    <Chip 
                      label={getExperienceLevel(service.experienceLevel)} 
                      size="small"
                      sx={{ backgroundColor: 'rgba(0, 0, 63, 0.1)', color: '#00003f' }}
                    />
                  </Box>
                </Grid>
              )}

              {/* Preparation Required */}
              {service.preparationRequired && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <ScheduleIcon sx={{ mr: 1, color: '#00003f', fontSize: 20, mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Preparation Required:</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                        {service.preparationRequired}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}

              {/* Cancellation Policy */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <InfoIcon sx={{ mr: 1, color: '#00003f', fontSize: 20, mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Cancellation Policy:</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                      {getCancellationPolicy(service.cancellationPolicy)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Service Description */}
              {service.description && (
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Description:</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {service.description}
                  </Typography>
                </Grid>
              )}

              {/* Custom Notes */}
              {service.customNotes && (
                <Grid item xs={12}>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      backgroundColor: 'rgba(118, 75, 162, 0.08)', 
                      borderLeft: '4px solid #764ba2',
                      borderRadius: 2 
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#764ba2' }}>
                      Special Notes:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                      {service.customNotes}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Paper>

          {/* Enhanced Service Provider Information */}
          {service.serviceProvider && (
            <Paper elevation={0} sx={{ p: 3, backgroundColor: 'rgba(118, 75, 162, 0.05)', borderRadius: 3 }}>
              <Typography variant="h6" sx={{ color: '#764ba2', fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center' }}>
                <BusinessIcon sx={{ mr: 1 }} />
                Service Provider
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar
                      src={service.serviceProvider.profilePhoto}
                      alt={service.serviceProvider.fullName}
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        margin: '0 auto',
                        mb: 2,
                        border: '4px solid #764ba2',
                        boxShadow: '0 8px 24px rgba(118, 75, 162, 0.3)'
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#764ba2' }}>
                      {service.serviceProvider.businessName || service.serviceProvider.fullName}
                    </Typography>
                    {service.serviceProvider.businessType && (
                      <Chip 
                        label={service.serviceProvider.businessType}
                        size="small"
                        sx={{ mt: 1, backgroundColor: 'rgba(118, 75, 162, 0.1)', color: '#764ba2' }}
                      />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    {service.serviceProvider.mobileNumber && (
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PhoneIcon sx={{ mr: 1, color: '#764ba2', fontSize: 20 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Phone:</Typography>
                            <Typography variant="body2">{service.serviceProvider.mobileNumber}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                    {service.serviceProvider.emailAddress && (
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <EmailIcon sx={{ mr: 1, color: '#764ba2', fontSize: 20 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Email:</Typography>
                            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                              {service.serviceProvider.emailAddress}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}

                    {/* Business Address */}
                    {service.serviceProvider.businessAddress && (
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <LocationIcon sx={{ mr: 1, color: '#764ba2', fontSize: 20, mt: 0.5 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>Business Address:</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {service.serviceProvider.businessAddress}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}

                    {service.serviceProvider.experience && (
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Experience:</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {typeof service.serviceProvider.experience === 'object' 
                            ? `${service.serviceProvider.experience.years} years in the industry`
                            : service.serviceProvider.experience
                          }
                        </Typography>
                      </Grid>
                    )}
                    {service.serviceProvider.specialties && service.serviceProvider.specialties.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Specialties:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {service.serviceProvider.specialties.map((specialty, index) => (
                            <Chip 
                              key={index} 
                              label={specialty} 
                              size="small"
                              sx={{ backgroundColor: 'rgba(118, 75, 162, 0.1)', color: '#764ba2' }}
                            />
                          ))}
                        </Box>
                      </Grid>
                    )}

                    {/* Service Provider ID for reference */}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Provider ID: {service.serviceProviderId || service.serviceProvider._id || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
        <GradientButton
          variant="secondary"
          onClick={onClose}
          startIcon={<CloseIcon />}
        >
          Close
        </GradientButton>
        <GradientButton
          variant="primary"
          onClick={handleBookService}
          startIcon={<CalendarIcon />}
        >
          Book This Service
        </GradientButton>
      </DialogActions>
    </Dialog>
  );
};

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [serviceProviders, setServiceProviders] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [providersLoading, setProvidersLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState('');

  useEffect(() => {
    fetchServiceProviders();
    loadNotifications();
    fetchApprovedServices();
  }, []);

  const fetchApprovedServices = async () => {
    try {
      setServicesLoading(true);
      setServicesError('');
      
      const res = await api.get('/services/approved');
      
      if (res.data.success && res.data.data) {
        // Debug: Log the first service to see its structure
        if (res.data.data.length > 0) {
          console.log('First service structure:', res.data.data[0]);
        }
        setServices(res.data.data);
      } else {
        setServices([]);
        setServicesError('No approved services available');
      }
    } catch (err) {
      console.error('❌ Error fetching approved services:', err);
      setServicesError('Failed to load approved services.');
      setServices([]);
    } finally {
      setServicesLoading(false);
    }
  };

  const fetchServiceProviders = async () => {
    try {
      setProvidersLoading(true);
      setError('');
      
      const response = await getApprovedProviders();
      
      if (response.success && response.data) {
        setServiceProviders(response.data);
      } else {
        setServiceProviders([]);
        setError('No approved service providers found');
      }
    } catch (error) {
      console.error('Error fetching service providers:', error);
      setError('Failed to load service providers');
      setServiceProviders([]);
    } finally {
      setProvidersLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const notifications = await fetchNotifications();
      setNotificationsList(notifications || []);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/customer-login');
  };
  
  const toggleSidebar = () => setSidebarOpen(o => !o);

  const handleViewServiceDetails = (service) => {
    // Debug: Log the service object to console
    console.log('Selected service details:', service);
    setSelectedService(service);
    setDialogOpen(true);
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  if (providersLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
      >
        <CircularProgress size={60} sx={{ color: '#00003f' }} />
      </Box>
    );
  }

  return (
    <CustomerDashboardContainer>
      <EnhancedAppBar
        role="customer"
        user={user}
        onMenuClick={toggleSidebar}
        onLogout={handleLogout}
        title="Customer Dashboard"
        notifications={notificationsList.length}
        notificationsList={notificationsList}
      />
      
      <CustomerSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />
      
      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        {/* Enhanced Header */}
        <Zoom in timeout={800}>
          <DiscoveryCard sx={{ p: 4, mb: 4, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ 
              color: '#2d3748',
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(45deg, #00003f 30%, #764ba2 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}>
              ✨ Discover Beauty Services
            </Typography>
            <Typography variant="h6" sx={{ 
              color: 'rgba(45, 55, 72, 0.7)', 
              fontWeight: 400,
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Find and book premium beauty and wellness experiences from certified professionals
            </Typography>
          </DiscoveryCard>
        </Zoom>

        {error && (
          <Fade in>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(244, 67, 54, 0.15)'
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {/* Enhanced Services Section */}
        <Fade in timeout={1200}>
          <DiscoveryCard sx={{ p: 4, position: 'relative' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ 
                color: '#2d3748',
                fontWeight: 700,
                mb: 2,
              }}>
                💫 Approved Services
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'rgba(45, 55, 72, 0.7)', 
                fontSize: '1.1rem',
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                Explore our curated collection of premium beauty services
              </Typography>
            </Box>

            {servicesError && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(244, 67, 54, 0.15)'
                }}
              >
                {servicesError}
              </Alert>
            )}

            {servicesLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress size={60} sx={{ color: '#00003f' }} />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {services.length === 0 ? (
                  <Grid item xs={12}>
                    <Paper 
                      sx={{ 
                        p: 6, 
                        textAlign: 'center',
                        backgroundColor: 'rgba(102, 126, 234, 0.05)',
                        borderRadius: 4
                      }}
                    >
                      <Typography variant="h5" sx={{ color: '#00003f', fontWeight: 600, mb: 2 }}>
                        🔍 No Services Available
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        We're working hard to bring you amazing beauty services. Please check back later!
                      </Typography>
                    </Paper>
                  </Grid>
                ) : (
                  services.map((svc, index) => (
                    <Grid item xs={12} sm={6} md={4} key={svc._id}>
                      <Zoom in timeout={600 + index * 100}>
                        <ServiceCard>
                          <CardContent sx={{ flexGrow: 1, p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Typography variant="h5" sx={{ 
                                color: '#2d3748', 
                                fontWeight: 700,
                                lineHeight: 1.2
                              }}>
                                {svc.name}
                              </Typography>
                              <Tooltip title="Save to favorites">
                                <IconButton size="small" sx={{ color: '#cbd5e0' }}>
                                  <BookmarkIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>

                            <Chip 
                              label={svc.type}
                              size="small"
                              sx={{ 
                                mb: 2,
                                backgroundColor: 'rgba(79, 172, 254, 0.1)',
                                color: '#4facfe',
                                fontWeight: 600
                              }}
                            />

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <TimeIcon sx={{ mr: 1, color: '#a0aec0', fontSize: 18 }} />
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {formatDuration(svc.duration)}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <LocationIcon sx={{ mr: 1, color: '#a0aec0', fontSize: 18 }} />
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {svc.serviceProvider?.businessAddress?.substring(0, 30) || 
                                 svc.serviceProvider?.currentAddress?.substring(0, 30) || 
                                 svc.serviceProvider?.city || 'N/A'}
                                {((svc.serviceProvider?.businessAddress?.length > 30) || 
                                  (svc.serviceProvider?.currentAddress?.length > 30)) && '...'}
                              </Typography>
                            </Box>

                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              p: 2,
                              backgroundColor: 'rgba(102, 126, 234, 0.05)',
                              borderRadius: 2,
                              mb: 2
                            }}>
                              <Typography variant="h5" sx={{ 
                                color: '#00003f', 
                                fontWeight: 700
                              }}>
                                LKR {svc.basePrice?.toFixed(2) || svc.pricing?.basePrice?.toFixed(2) || 'N/A'}
                              </Typography>
                              <Rating value={4.5} size="small" readOnly />
                            </Box>
                          </CardContent>

                          <CardActions 
                            sx={{ 
                              p: 3, 
                              pt: 0,
                              '&.service-actions': {
                                opacity: 0.8,
                                transform: 'translateY(4px)',
                                transition: 'all 0.3s ease'
                              }
                            }}
                            className="service-actions"
                          >
                            <GradientButton
                              variant="secondary"
                              size="small"
                              fullWidth
                              onClick={() => handleViewServiceDetails(svc)}
                              startIcon={<InfoIcon />}
                              sx={{ mr: 1 }}
                            >
                              More Details
                            </GradientButton>
                            <GradientButton
                              variant="primary"
                              size="small"
                              fullWidth
                              onClick={() => navigate(`/customer/book-service/${svc._id}`)}
                              startIcon={<CalendarIcon />}
                            >
                              Book Now
                            </GradientButton>
                          </CardActions>
                        </ServiceCard>
                      </Zoom>
                    </Grid>
                  ))
                )}
              </Grid>
            )}
          </DiscoveryCard>
        </Fade>
      </Container>

      <ServiceDetailsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        service={selectedService}
        navigate={navigate}
      />

      <Footer />
    </CustomerDashboardContainer>
  );
};

export default CustomerDashboard;