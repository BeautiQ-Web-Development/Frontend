import React from 'react';
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
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Import sample images - you'll need to add these to your assets folder
import salon1 from '../assets/Salon1.jpg';
import salon2 from '../assets/Salon2.jpg';
import salon3 from '../assets/Salon3.jpg';
import salon4 from '../assets/Salon4.jpg';

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
  // Sample data for salons
  const salons = [
    {
      id: 1,
      name: 'Style Space',
      image: salon1,
      rating: 4.8,
      reviews: 758,
      available: '2 slots available',
    },
    {
      id: 2,
      name: 'Style Space',
      image: salon2,
      rating: 4.9,
      reviews: 632,
      available: '1 slot available',
    },
    {
      id: 3,
      name: 'Style Space',
      image: salon3,
      rating: 4.7,
      reviews: 495,
      available: 'Fully booked',
    },
    {
      id: 4,
      name: 'Style Space',
      image: salon4,
      rating: 4.9,
      reviews: 872,
      available: '3 slots available',
    },
  ];

  return (
    <Container>
      <SectionContainer>
        <SectionTitle variant="h5">Recommended</SectionTitle>
        
        <Grid container spacing={2}>
          {salons.map((salon) => (
            <Grid item xs={12} sm={6} md={3} key={salon.id}>
              <SalonCard>
                <CardMedia
                  component="img"
                  height="160"
                  image={salon.image}
                  alt={salon.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {salon.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating
                      value={salon.rating}
                      precision={0.1}
                      size="small"
                      readOnly
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      {salon.rating} ({salon.reviews})
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {salon.available}
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
      </SectionContainer>
    </Container>
  );
};

export default RecommendedSection;