import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Rating,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  Language as LanguageIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { getApprovedServiceProviders } from '../../services/auth';

const CustomerProviderDetailsPage = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProviderDetails();
  }, [providerId]);

  const fetchProviderDetails = async () => {
    try {
      setLoading(true);
      const response = await getApprovedServiceProviders();
      const foundProvider = response.providers.find(p => p._id === providerId);
      
      if (foundProvider) {
        setProvider(foundProvider);
      } else {
        setError('Service provider not found');
      }
    } catch (error) {
      console.error('Error fetching provider details:', error);
      setError('Failed to load provider details');
    } finally {
      setLoading(false);
    }
  };

  const openBooking = (serviceId) => {
    navigate(`/customer/book-service/${serviceId}`);
  };

  const handleBookNow = () => openBooking(providerId);

  const handleGoBack = () => {
    navigate('/customer/browse-services');
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !provider) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Provider not found'}
        </Alert>
        <Button variant="outlined" onClick={handleGoBack}>
          Back to Browse Services
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button 
          variant="outlined" 
          onClick={handleGoBack}
          sx={{ mr: 2, borderColor: '#003047', color: '#003047' }}
        >
          ← Back
        </Button>
        <Typography variant="h4" component="h1" sx={{ color: '#003047', fontWeight: 'bold' }}>
          {provider.businessName}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Main Info Card */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={provider.profilePhoto}
                  sx={{ width: 80, height: 80, mr: 3 }}
                />
                <Box>
                  <Typography variant="h5" sx={{ color: '#003047', fontWeight: 'bold' }}>
                    {provider.businessName}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {provider.fullName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Rating value={4.8} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      4.8 (758 reviews)
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography variant="h6" sx={{ color: '#003047', mb: 2 }}>
                About
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {provider.experience?.description || 'No description available.'}
              </Typography>

              <Typography variant="h6" sx={{ color: '#003047', mb: 2 }}>
                Specialties
              </Typography>
              <Box sx={{ mb: 3 }}>
                {provider.specialties?.map((specialty, index) => (
                  <Chip
                    key={index}
                    label={specialty}
                    sx={{
                      mr: 1,
                      mb: 1,
                      backgroundColor: '#E6F7F8',
                      color: '#003047'
                    }}
                  />
                ))}
              </Box>

              <Typography variant="h6" sx={{ color: '#003047', mb: 2 }}>
                Languages
              </Typography>
              <Box sx={{ mb: 3 }}>
                {provider.languages?.map((language, index) => (
                  <Chip
                    key={index}
                    label={language}
                    variant="outlined"
                    sx={{
                      mr: 1,
                      mb: 1,
                      borderColor: '#003047',
                      color: '#003047'
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Services Card */}
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ color: '#003047', mb: 2 }}>
                Available Services
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Contact the service provider for detailed service information and pricing.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#003047', mb: 2 }}>
                Contact Information
              </Typography>
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <LocationIcon sx={{ color: '#003047' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Address"
                    secondary={provider.address || 'Address not provided'}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <PhoneIcon sx={{ color: '#003047' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Phone"
                    secondary={provider.phoneNumber || 'Phone not provided'}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <EmailIcon sx={{ color: '#003047' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email"
                    secondary={provider.emailAddress}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <WorkIcon sx={{ color: '#003047' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Experience"
                    secondary={`${provider.experience?.years || 0} years`}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ color: '#003047', mb: 2 }}>
                Book an Appointment
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Ready to experience premium beauty services?
              </Typography>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleBookNow}
                sx={{
                  backgroundColor: '#003047',
                  '&:hover': {
                    backgroundColor: '#003047'
                  }
                }}
              >
                Book Now
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CustomerProviderDetailsPage;