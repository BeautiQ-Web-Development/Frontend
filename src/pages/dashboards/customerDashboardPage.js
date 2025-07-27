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
  IconButton,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { getApprovedProviders } from '../../services/auth';
import { fetchNotifications } from '../../services/notification';
import Footer from '../../components/footer';
import CustomerSidebar from '../../components/CustomerSidebar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import EnhancedAppBar from '../../components/EnhancedAppBar';

const CustomerDashboardContainer = styled(Box)(({ theme }) => ({
  background: '#FFFFFF',
  minHeight: '100vh',
}));

const DiscoveryCard = styled(Card)(({ theme }) => ({
  background: '#FFFFFF',
  border: '1px solid rgba(0, 31, 63, 0.08)',
  borderRadius: 12,
  boxShadow: '0 2px 8px rgba(0, 31, 63, 0.06)',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 6px 20px rgba(0, 31, 63, 0.15)',
  }
}));

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);

  useEffect(() => {
    fetchServiceProviders();
    loadNotifications();
  }, []);

  const fetchServiceProviders = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching approved providers...');
      const response = await getApprovedProviders();
      
      console.log('Fetch response:', response);
      
      if (response.success && response.data) {
        console.log('Setting service providers:', response.data);
        setServiceProviders(response.data);
      } else {
        console.log('No providers found or request failed');
        setServiceProviders([]);
        setError('No approved service providers found');
      }
    } catch (error) {
      console.error('Error fetching service providers:', error);
      setError('Failed to load service providers');
      setServiceProviders([]);
    } finally {
      setLoading(false);
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

  const handleViewProvider = (provider) => {
    setSelectedProvider(provider);
    setDialogOpen(true);
  };

  const ServiceProviderCard = ({ provider }) => (
    <DiscoveryCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="div"
        sx={{
          height: 220,
          background: `linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)`,
          backgroundImage: provider.profilePhoto ? `url(${provider.profilePhoto})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {!provider.profilePhoto && (
          <Typography variant="h2">🏪</Typography>
        )}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            p: 2
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
            {provider.businessName || provider.fullName}
          </Typography>
        </Box>
      </CardMedia>
      
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ mr: 1 }}>⭐</Typography>
          <Rating value={4.8} precision={0.1} readOnly size="small" />
          <Typography variant="body2" sx={{ ml: 1, color: '#075B5E', fontWeight: 600 }}>
            (758)
          </Typography>
        </Box>
        
        <Typography variant="body2" sx={{ color: '#075B5E', mb: 2, fontWeight: 500 }}>
          📍 {provider.city || 'Location not specified'}
        </Typography>
        
        {provider.specialties && provider.specialties.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {provider.specialties.slice(0, 3).map((specialty, index) => (
                <Chip 
                  key={index} 
                  label={specialty} 
                  size="small" 
                  sx={{
                    background: 'rgba(7, 91, 94, 0.1)',
                    color: '#075B5E',
                    fontWeight: 600,
                    '&:hover': { background: 'rgba(7, 91, 94, 0.2)' }
                  }}
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
          <Typography variant="body1" sx={{ color: '#4facfe', fontWeight: 700, mb: 2 }}>
            💰 Starting from LKR {Math.min(...provider.services.map(s => s.price))}
          </Typography>
        )}
        
        <Typography variant="body2" sx={{ color: '#28a745', fontWeight: 600, mb: 2 }}>
          ✅ 2 slots available today
        </Typography>
      </CardContent>
      
      <Box sx={{ p: 3, pt: 0 }}>
        <Button 
          variant="contained" 
          fullWidth 
          onClick={() => handleViewProvider(provider)}
          sx={{ 
            mb: 1,
            background: 'linear-gradient(45deg, #075B5E 0%, #4facfe 100%)',
            borderRadius: 3,
            fontWeight: 700,
            py: 1.5,
            '&:hover': {
              background: 'linear-gradient(45deg, #054548 0%, #3d8bfe 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 20px rgba(7, 91, 94, 0.3)'
            }
          }}
        >
          🔍 View Details
        </Button>
        <Button 
          variant="outlined" 
          fullWidth
          sx={{
            borderColor: '#075B5E',
            color: '#075B5E',
            borderRadius: 3,
            fontWeight: 600,
            py: 1.5,
            '&:hover': {
              borderColor: '#4facfe',
              color: '#4facfe',
              background: 'rgba(79, 172, 254, 0.1)'
            }
          }}
        >
          📅 Book Now
        </Button>
      </Box>
    </DiscoveryCard>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
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
      
      <Container component="main" maxWidth="lg" sx={{ py: 3, bgcolor: '#FFFFFF' }}>
        {/* Clean Header */}
        <DiscoveryCard sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" sx={{ 
            color: '#001F3F',
            fontWeight: 600,
            mb: 1,
            fontSize: '1.4rem'
          }}>
            Discover Beauty Services
          </Typography>
          <Typography variant="body1" sx={{ 
            color: 'rgba(0, 31, 63, 0.7)', 
            fontWeight: 400,
            fontSize: '0.9rem'
          }}>
            Find and book premium beauty and wellness experiences
          </Typography>
        </DiscoveryCard>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Service Provider Cards with Clean Design */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress sx={{ color: '#001F3F' }} />
          </Box>
        ) : serviceProviders.length === 0 ? (
          <DiscoveryCard sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#001F3F', fontWeight: 600, mb: 1 }}>
              No providers available
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(0, 31, 63, 0.7)' }}>
              Check back soon for amazing beauty services!
            </Typography>
          </DiscoveryCard>
        ) : (
          <Grid container spacing={3}>
            {serviceProviders.map((provider) => (
              <Grid item xs={12} sm={6} md={4} key={provider._id}>
                <DiscoveryCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="div"
                    sx={{
                      height: 180,
                      background: 'rgba(0, 31, 63, 0.05)',
                      backgroundImage: provider.profilePhoto ? `url(${provider.profilePhoto})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {!provider.profilePhoto && (
                      <Typography variant="h4" sx={{ color: '#001F3F' }}>🏪</Typography>
                    )}
                  </CardMedia>
                  
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Typography variant="h6" sx={{ 
                      color: '#001F3F', 
                      fontWeight: 600, 
                      mb: 1,
                      fontSize: '1.1rem'
                    }}>
                      {provider.businessName || provider.fullName}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Rating value={4.8} precision={0.1} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1, color: 'rgba(0, 31, 63, 0.7)', fontSize: '0.8rem' }}>
                        (758)
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" sx={{ color: 'rgba(0, 31, 63, 0.7)', mb: 1.5, fontSize: '0.85rem' }}>
                      📍 {provider.city || 'Location not specified'}
                    </Typography>
                    
                    {provider.specialties && provider.specialties.length > 0 && (
                      <Box sx={{ mb: 1.5 }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {provider.specialties.slice(0, 3).map((specialty, index) => (
                            <Chip 
                              key={index} 
                              label={specialty} 
                              size="small" 
                              sx={{
                                background: 'rgba(0, 31, 63, 0.05)',
                                color: '#001F3F',
                                fontWeight: 500,
                                fontSize: '0.7rem',
                                height: 24
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                    
                    {provider.services && provider.services.length > 0 && (
                      <Typography variant="body1" sx={{ 
                        color: '#001F3F', 
                        fontWeight: 600, 
                        mb: 1.5,
                        fontSize: '0.9rem'
                      }}>
                        Starting from LKR {Math.min(...provider.services.map(s => s.price))}
                      </Typography>
                    )}
                  </CardContent>
                  
                  <Box sx={{ p: 2.5, pt: 0 }}>
                    <Button 
                      variant="contained" 
                      fullWidth 
                      onClick={() => handleViewProvider(provider)}
                      sx={{ 
                        mb: 1,
                        background: '#001F3F',
                        color: 'white',
                        borderRadius: 2,
                        fontWeight: 500,
                        fontSize: '0.85rem',
                        py: 1,
                        '&:hover': {
                          background: 'rgba(0, 31, 63, 0.9)',
                          transform: 'translateY(-1px)',
                        }
                      }}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      sx={{
                        borderColor: '#001F3F',
                        color: '#001F3F',
                        borderRadius: 2,
                        fontWeight: 500,
                        fontSize: '0.85rem',
                        py: 1,
                        '&:hover': {
                          borderColor: '#001F3F',
                          background: 'rgba(0, 31, 63, 0.05)'
                        }
                      }}
                    >
                      Book Now
                    </Button>
                  </Box>
                </DiscoveryCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {user && (
        <ServiceProviderDetailsDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          provider={selectedProvider}
        />
      )}

      <Footer />
    </CustomerDashboardContainer>
  );
};

export default CustomerDashboard;
