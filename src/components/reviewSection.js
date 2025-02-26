import React from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Rating,
  Typography,
  styled,
} from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Styled components
const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  color: theme.palette.common.black,
}));

const ReviewCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.spacing(1),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
}));

const ReviewContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

const UserInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: 'auto',
  paddingTop: theme.spacing(2),
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

const ReviewsSection = () => {
  // Sample data for reviews
  const reviews = [
    {
      id: 1,
      rating: 5,
      title: 'The best booking system',
      content: 'Super intuitive, stylish design and so easy to use. Perfect for finding beauty services!',
      userName: 'Maria',
      userDate: '2 days ago',
    },
    {
      id: 2,
      rating: 5,
      title: 'Easy to use & explore',
      content: 'Beautiful interface with simple navigation. Quick to find the services I need when I need them.',
      userName: 'Susan',
      userDate: '1 week ago',
    },
    {
      id: 3,
      rating: 5,
      title: 'Great for finding barbers',
      content: 'As a guy who needed a good barber, this app showed me the best options with great reviews.',
      userName: 'Tim',
      userDate: '3 days ago',
    },
    {
      id: 4,
      rating: 5,
      title: 'My go-to for self-care',
      content: 'Whether it\'s a spa day or a quick manicure, BeautiQ helps me treat myself with ease.',
      userName: 'Maria',
      userDate: '5 days ago',
    },
  ];

  return (
    <Container>
      <SectionContainer>
        <SectionTitle variant="h5">Recent Reviews</SectionTitle>
        
        <Grid container spacing={2}>
          {reviews.map((review) => (
            <Grid item xs={12} sm={6} md={3} key={review.id}>
              <ReviewCard>
                <ReviewContent>
                  <Rating value={review.rating} readOnly />
                  <Typography gutterBottom variant="h6" component="div" sx={{ mt: 1 }}>
                    {review.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {review.content}
                  </Typography>
                  <UserInfo>
                    <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                      {review.userName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{review.userName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {review.userDate}
                      </Typography>
                    </Box>
                  </UserInfo>
                </ReviewContent>
              </ReviewCard>
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

export default ReviewsSection;