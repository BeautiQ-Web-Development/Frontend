import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, Grid, Rating, CircularProgress,
  Card, CardContent, Divider, Chip, Avatar, Alert
} from '@mui/material';
import {
  Star as StarIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { fetchProviderFeedback } from '../../services/feedback';
import ServiceProviderSidebar from '../../components/ServiceProviderSidebar';
import EnhancedAppBar from '../../components/EnhancedAppBar';
import Footer from '../../components/footer';

const ServiceProviderFeedbackPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [feedbackData, setFeedbackData] = useState({ feedbacks: [], stats: {} });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFeedback = async () => {
      if (user?.userId) {
        try {
          setLoading(true);
          const data = await fetchProviderFeedback(user.userId);
          setFeedbackData(data);
        } catch (error) {
          console.error('Error loading feedback:', error);
          setError('Failed to load feedback data');
        } finally {
          setLoading(false);
        }
      }
    };
    loadFeedback();
  }, [user]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const { feedbacks, stats } = feedbackData;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <ServiceProviderSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />
      
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <EnhancedAppBar 
          user={user} 
          onMenuClick={toggleSidebar} 
          title="Feedback & Ratings" 
        />
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          {/* Stats Overview */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%', borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>Overall Rating</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#003047', mr: 1 }}>
                    {stats.avgRating || 0}
                  </Typography>
                  <StarIcon sx={{ fontSize: 40, color: '#faaf00' }} />
                </Box>
                <Rating value={stats.avgRating || 0} precision={0.1} readOnly size="large" />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Based on {stats.totalFeedbacks || 0} reviews
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>Rating Distribution</Typography>
                <Box sx={{ mt: 2 }}>
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = stats.ratingCounts?.[star] || 0;
                    const total = stats.totalFeedbacks || 1;
                    const percent = (count / total) * 100;
                    return (
                      <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="body2" sx={{ minWidth: 30, fontWeight: 'bold' }}>{star} ★</Typography>
                        <Box sx={{ flexGrow: 1, height: 10, bgcolor: '#eee', borderRadius: 5, mx: 2, overflow: 'hidden' }}>
                          <Box sx={{ width: `${percent}%`, height: '100%', bgcolor: star >= 4 ? '#4caf50' : star === 3 ? '#ff9800' : '#f44336' }} />
                        </Box>
                        <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right' }}>{count}</Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#003047' }}>
            Recent Feedback
          </Typography>

          {feedbacks.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
              <Typography color="text.secondary">No feedback received yet.</Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {feedbacks.map((feedback) => (
                <Grid item xs={12} key={feedback._id}>
                  <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: '#003047', mr: 2 }}>
                            {feedback.customerName?.charAt(0) || 'C'}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {feedback.customerName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Customer ID: {feedback.customerId}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(feedback.createdAt).toLocaleDateString()} • {new Date(feedback.createdAt).toLocaleTimeString()}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Rating value={feedback.rating} readOnly />
                          <Typography variant="caption" display="block" color="text.secondary">
                            Service: {feedback.serviceName}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: 1 }}>
                        {feedback.rating >= 3 ? (
                          <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#333' }}>
                            "{feedback.feedbackText}"
                          </Typography>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                            <ThumbDownIcon sx={{ mr: 1, fontSize: 20 }} />
                            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                              Not Recommended (Content hidden for negative review)
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
        <Footer />
      </Box>
    </Box>
  );
};

export default ServiceProviderFeedbackPage;
