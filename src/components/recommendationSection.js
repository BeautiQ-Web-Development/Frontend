import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  IconButton,
  Rating,
  Typography,
  Button,
  styled,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { getApprovedProviders } from '../services/auth';
import axios from 'axios';

// Styled components
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  color: theme.palette.common.black,
}));

const SalonCard = styled(Card)(({ theme }) => ({
  maxWidth: 280,
  borderRadius: theme.spacing(1),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  height: '100%',
}));

const BookNowButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 3,
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '0.75rem',
}));

const ArrowButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: theme.palette.common.white,
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
  zIndex: 2,
}));

const SectionContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
}));

const RecommendedSection = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
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
      console.log('Recommendation section - response:', response);
      
      if (response.success && response.providers) {
        // Take only first 4 providers for the recommendation section
        setServiceProviders(response.providers.slice(0, 4));
      } else {
        console.log('No providers in response or request failed');
        setServiceProviders([]);
        // Don't set error for empty results in public view
        if (response.message && !response.message.includes('Unable to fetch')) {
          setError(response.message);
        }
      }
    } catch (error) {
      console.error('Error fetching service providers:', error);
      setError('Unable to load recommendations at this time');
      setServiceProviders([]);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Container>
        <SectionContainer>
          <SectionTitle variant="h5">Recommended Service Providers</SectionTitle>
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        </SectionContainer>
      </Container>
    );
  }

  // Show error state (only for critical errors)
  if (error && error.includes('critical')) {
    return (
      <Container>
        <SectionContainer>
          <SectionTitle variant="h5">Recommended Service Providers</SectionTitle>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        </SectionContainer>
      </Container>
    );
  }

  // Show empty state or providers
  return (
    <Container>
      <SectionContainer>
        <SectionTitle variant="h5">Recommended Service Providers</SectionTitle>
        
        {serviceProviders.length === 0 ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            Service providers will be displayed here once they join our platform.
          </Alert>
        ) : (
          <>
            <Grid container spacing={2}>
              {serviceProviders.map((provider) => (
                <Grid item xs={12} sm={6} md={3} key={provider._id}>
                  <SalonCard>
                    <CardMedia
                      component="img"
                      height="160"
                      image={provider.profilePhoto || '/placeholder-salon.jpg'}
                      alt={provider.businessName || provider.fullName}
                      onError={(e) => {
                        e.target.src = '/placeholder-salon.jpg'; // Fallback image
                      }}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {provider.businessName || provider.fullName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating
                          value={4.8} // You can add rating field to provider model later
                          precision={0.1}
                          size="small"
                          readOnly
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          4.8 (758)
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                        {provider.city || provider.address || 'Location not specified'}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="success.main">
                          Available
                        </Typography>
                        <BookNowButton variant="contained" size="small">
                          Book Now
                        </BookNowButton>
                      </Box>
                    </CardContent>
                  </SalonCard>
                </Grid>
              ))}
            </Grid>
            
            <ArrowButton aria-label="next">
              <ArrowForwardIosIcon fontSize="small" />
            </ArrowButton>
          </>
        )}
      </SectionContainer>
    </Container>
  );
};

export default RecommendedSection;