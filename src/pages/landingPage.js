import React from 'react';
import { Box } from '@mui/material';
import Header from '../components/Header';
import SearchSection from '../components/searchSection';
import RecommendedSection from '../components/recommendationSection';
import ReviewsSection from '../components/reviewSection';
import Footer from '../components/footer';

const LandingPage = () => {
  return (
    <Box>
      <Header />
      <SearchSection />
      <RecommendedSection />
      <ReviewsSection />
      <Footer />
    </Box>
  );
};

export default LandingPage;