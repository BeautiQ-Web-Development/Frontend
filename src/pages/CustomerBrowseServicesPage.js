import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
  Chip,
  Rating,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { getApprovedServiceProviders } from '../services/auth';
import { useNavigate } from 'react-router-dom';

const CustomerBrowseServicesPage = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchServiceProviders();
  }, []);

  useEffect(() => {
    filterProviders();
  }, [searchTerm, serviceProviders]);

  const fetchServiceProviders = async () => {
    try {
      setLoading(true);
      const response = await getApprovedServiceProviders();
      setServiceProviders(response.providers || []);
      setError('');
    } catch (error) {
      console.error('Error fetching service providers:', error);
      setError('Failed to load service providers');
    } finally {
      setLoading(false);
    }
  };

  const filterProviders = () => {
    if (!searchTerm) {
      setFilteredProviders(serviceProviders);
    } else {
      const filtered = serviceProviders.filter(provider =>
        provider.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.specialties?.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredProviders(filtered);
    }
  };

  const handleBookNow = (providerId) => {
    navigate(`/customer/book-service/${providerId}`);
  };

  const handleViewDetails = (providerId) => {
    navigate(`/customer/provider-details/${providerId}`);
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#075B5E', fontWeight: 'bold' }}>
        Browse Services
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search by business name, provider name, or service type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#075B5E' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#075B5E',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#075B5E',
              },
            },
          }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {filteredProviders.length === 0 && !loading ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            {searchTerm ? 'No service providers found matching your search.' : 'No approved service providers available at the moment.'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredProviders.map((provider) => (
            <Grid item xs={12} sm={6} md={4} key={provider._id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(7, 91, 94, 0.15)'
                }
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={provider.profilePhoto || '/placeholder-salon.jpg'}
                  alt={provider.businessName}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography gutterBottom variant="h6" component="h2" sx={{ color: '#075B5E', fontWeight: 'bold' }}>
                    {provider.businessName}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={4.8} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      4.8 (758)
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ fontSize: 16, color: '#075B5E', mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {provider.address || 'Location not specified'}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    {provider.specialties?.slice(0, 3).map((specialty, index) => (
                      <Chip
                        key={index}
                        label={specialty}
                        size="small"
                        sx={{
                          mr: 0.5,
                          mb: 0.5,
                          backgroundColor: '#E6F7F8',
                          color: '#075B5E',
                          fontSize: '0.75rem'
                        }}
                      />
                    ))}
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {provider.experience?.description?.substring(0, 100)}
                    {provider.experience?.description?.length > 100 ? '...' : ''}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#075B5E', fontWeight: 'bold', mb: 2 }}>
                    2 slots available
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetails(provider._id)}
                      sx={{
                        borderColor: '#075B5E',
                        color: '#075B5E',
                        '&:hover': {
                          borderColor: '#054548',
                          backgroundColor: '#F0FAFB'
                        }
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleBookNow(provider._id)}
                      sx={{
                        backgroundColor: '#075B5E',
                        '&:hover': {
                          backgroundColor: '#054548'
                        }
                      }}
                    >
                      Book Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default CustomerBrowseServicesPage;