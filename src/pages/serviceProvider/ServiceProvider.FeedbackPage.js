import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Container, Typography, Paper, Grid, Rating, CircularProgress,
  Card, CardContent, Divider, Chip, Avatar, Alert, Button, Link,
  Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemAvatar, ListItemText,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tab,
  LinearProgress, IconButton, Tooltip
} from '@mui/material';
import {
  Star as StarIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  TrendingUp as TrendingUpIcon,
  Feedback as FeedbackIcon,
  Close as CloseIcon,
  EmojiEvents as TrophyIcon,
  SentimentVeryDissatisfied as SadIcon,
  SentimentVerySatisfied as HappyIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon
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
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [dialogTab, setDialogTab] = useState(0);

  const loadFeedback = async () => {
    const providerId = user?.userId || user?._id || user?.id;
    console.log('🔍 Loading feedback for provider:', providerId);
    
    if (providerId) {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProviderFeedback(providerId);
        console.log('📊 Feedback data received:', data);
        setFeedbackData({
          feedbacks: data?.feedbacks || [],
          stats: data?.stats || {},
          recentFeedbacks: data?.recentFeedbacks || []
        });
      } catch (error) {
        console.error('Error loading feedback:', error);
        // Don't show error if it's just empty data
        if (error.message?.includes('404') || error.message?.includes('No feedback')) {
          setFeedbackData({ feedbacks: [], stats: {} });
        } else {
          setError('Unable to load feedback. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError('Please log in to view your feedback.');
    }
  };

  useEffect(() => {
    loadFeedback();
  }, [user]);

  // Group feedbacks by service
  const serviceStats = useMemo(() => {
    const feedbacks = feedbackData?.feedbacks || [];
    const grouped = {};
    
    feedbacks.forEach(fb => {
      const serviceName = fb.serviceName || 'Unknown Service';
      if (!grouped[serviceName]) {
        grouped[serviceName] = {
          serviceName,
          feedbacks: [],
          totalRating: 0,
          count: 0,
          positive: 0,
          negative: 0,
          neutral: 0
        };
      }
      grouped[serviceName].feedbacks.push(fb);
      grouped[serviceName].totalRating += fb.rating;
      grouped[serviceName].count += 1;
      
      if (fb.sentiment === 'POSITIVE' || fb.rating >= 4) {
        grouped[serviceName].positive += 1;
      } else if (fb.sentiment === 'NEGATIVE' || fb.rating <= 2) {
        grouped[serviceName].negative += 1;
      } else {
        grouped[serviceName].neutral += 1;
      }
    });

    // Calculate averages
    Object.keys(grouped).forEach(key => {
      grouped[key].avgRating = grouped[key].count > 0 
        ? (grouped[key].totalRating / grouped[key].count).toFixed(1) 
        : 0;
    });

    return Object.values(grouped);
  }, [feedbackData?.feedbacks]);

  const handleOpenFeedbackDialog = (service) => {
    setSelectedService(service);
    setDialogTab(0);
    setFeedbackDialogOpen(true);
  };

  const handleCloseFeedbackDialog = () => {
    setFeedbackDialogOpen(false);
    setSelectedService(null);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const { feedbacks = [], stats = {} } = feedbackData || {};
  const totalFeedbacks = stats.totalFeedbacks || feedbacks.length || 0;
  const avgRating = stats.avgRating || 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f5f7fa' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: '#003047' }} />
          <Typography sx={{ mt: 2, color: '#003047' }}>Loading your feedback...</Typography>
        </Box>
      </Box>
    );
  }

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
          {error && (
            <Alert 
              severity="warning" 
              sx={{ mb: 3, borderRadius: 2 }}
              action={
                <Button color="inherit" size="small" onClick={loadFeedback} startIcon={<RefreshIcon />}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          )}

          {/* Motivational Banner */}
          {totalFeedbacks === 0 && !error && (
            <Paper 
              sx={{ 
                p: 4, 
                mb: 4, 
                borderRadius: 3, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                textAlign: 'center'
              }}
            >
              <TrophyIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Start Collecting Feedback!
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
                Feedback from your customers will appear here once they complete their bookings. 
                Great service leads to great reviews - keep up the excellent work! 🌟
              </Typography>
            </Paper>
          )}

          {/* Overall Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper 
                sx={{ 
                  p: 3, 
                  height: '100%', 
                  borderRadius: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: totalFeedbacks > 0 ? 'linear-gradient(145deg, #ffffff 0%, #f0f7ff 100%)' : '#fff',
                  border: '1px solid #e0e0e0'
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>Overall Rating</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#003047', mr: 1 }}>
                    {avgRating.toFixed ? avgRating.toFixed(1) : avgRating}
                  </Typography>
                  <StarIcon sx={{ fontSize: 40, color: '#faaf00' }} />
                </Box>
                <Rating value={avgRating} precision={0.1} readOnly size="large" />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Based on {totalFeedbacks} review{totalFeedbacks !== 1 ? 's' : ''}
                </Typography>
                {avgRating >= 4 && totalFeedbacks > 0 && (
                  <Chip 
                    icon={<TrophyIcon />} 
                    label="Excellent Performance!" 
                    color="success" 
                    sx={{ mt: 2 }}
                  />
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, height: '100%', borderRadius: 3, border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" gutterBottom sx={{ color: '#003047', fontWeight: 'bold' }}>
                  Rating Distribution
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = stats.ratingCounts?.[star] || 0;
                    const total = totalFeedbacks || 1;
                    const percent = (count / total) * 100;
                    return (
                      <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="body2" sx={{ minWidth: 30, fontWeight: 'bold', color: '#003047' }}>
                          {star} ★
                        </Typography>
                        <Box sx={{ flexGrow: 1, height: 12, bgcolor: '#eee', borderRadius: 6, mx: 2, overflow: 'hidden' }}>
                          <Box 
                            sx={{ 
                              width: `${percent}%`, 
                              height: '100%', 
                              bgcolor: star >= 4 ? '#4caf50' : star === 3 ? '#ff9800' : '#f44336',
                              borderRadius: 6,
                              transition: 'width 0.5s ease'
                            }} 
                          />
                        </Box>
                        <Typography variant="body2" sx={{ minWidth: 40, textAlign: 'right', fontWeight: 'bold' }}>
                          {count}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Sentiment Summary Cards */}
          {totalFeedbacks > 0 && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <Card sx={{ borderRadius: 3, bgcolor: '#e8f5e9', border: '1px solid #c8e6c9' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <HappyIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold" color="#2e7d32">
                      {stats.sentimentCounts?.POSITIVE || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Positive Reviews</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ borderRadius: 3, bgcolor: '#fff3e0', border: '1px solid #ffe0b2' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <FeedbackIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold" color="#f57c00">
                      {stats.sentimentCounts?.NEUTRAL || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Neutral Reviews</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ borderRadius: 3, bgcolor: '#ffebee', border: '1px solid #ffcdd2' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <SadIcon sx={{ fontSize: 40, color: '#f44336', mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold" color="#c62828">
                      {stats.sentimentCounts?.NEGATIVE || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Need Improvement</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}

          {/* Service-wise Feedback Breakdown */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#003047' }}>
              📊 Feedback by Service
            </Typography>
            <Tooltip title="Click on feedback count to see detailed reviews">
              <IconButton size="small">
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {serviceStats.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, mb: 4, bgcolor: '#fafafa' }}>
              <FeedbackIcon sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No feedback received yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                When customers leave feedback on your services, you'll see a breakdown here.
              </Typography>
            </Paper>
          ) : (
            <TableContainer component={Paper} sx={{ borderRadius: 3, mb: 4, overflow: 'hidden' }}>
              <Table>
                <TableHead sx={{ bgcolor: '#003047' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }}>Service Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }} align="center">Average Rating</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }} align="center">
                      <ThumbUpIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} />
                      Positive
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }} align="center">
                      <ThumbDownIcon sx={{ fontSize: 18, mr: 0.5, verticalAlign: 'middle' }} />
                      Negative
                    </TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: '0.95rem' }} align="center">Total Feedback</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviceStats.map((service, idx) => (
                    <TableRow 
                      key={service.serviceName} 
                      hover
                      sx={{ 
                        bgcolor: idx % 2 === 0 ? '#fafafa' : '#fff',
                        '&:hover': { bgcolor: '#e3f2fd' }
                      }}
                    >
                      <TableCell>
                        <Typography variant="body1" fontWeight="bold" color="#003047">
                          {service.serviceName}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Rating value={parseFloat(service.avgRating)} precision={0.1} readOnly size="small" />
                          <Chip 
                            label={service.avgRating}
                            size="small"
                            sx={{ 
                              ml: 1, 
                              fontWeight: 'bold',
                              bgcolor: service.avgRating >= 4 ? '#e8f5e9' : service.avgRating >= 3 ? '#fff3e0' : '#ffebee',
                              color: service.avgRating >= 4 ? '#2e7d32' : service.avgRating >= 3 ? '#f57c00' : '#c62828'
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          icon={<ThumbUpIcon />} 
                          label={service.positive} 
                          color="success" 
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          icon={<ThumbDownIcon />} 
                          label={service.negative} 
                          color="error" 
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleOpenFeedbackDialog(service)}
                          sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 'bold',
                            bgcolor: '#003047',
                            '&:hover': { bgcolor: '#00496b' }
                          }}
                        >
                          View {service.count} Feedback{service.count !== 1 ? 's' : ''}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Recent Feedback */}
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#003047' }}>
            📝 Recent Feedback
          </Typography>

          {feedbacks.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3, bgcolor: '#fafafa' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Awaiting Your First Review
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete bookings to start receiving customer feedback and build your reputation!
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {feedbacks.slice(0, 10).map((feedback) => (
                <Grid item xs={12} key={feedback._id}>
                  <Card 
                    sx={{ 
                      borderRadius: 3, 
                      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                      border: feedback.sentiment === 'NEGATIVE' || feedback.rating <= 2 
                        ? '2px solid #ffcdd2' 
                        : feedback.sentiment === 'POSITIVE' || feedback.rating >= 4
                          ? '2px solid #c8e6c9'
                          : '1px solid #e0e0e0',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateY(-2px)' }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: feedback.sentiment === 'NEGATIVE' || feedback.rating <= 2 
                                ? '#f44336' 
                                : feedback.sentiment === 'POSITIVE' || feedback.rating >= 4
                                  ? '#4caf50'
                                  : '#003047', 
                              mr: 2,
                              width: 48,
                              height: 48
                            }}
                          >
                            {feedback.customerName?.charAt(0)?.toUpperCase() || 'C'}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#003047' }}>
                              {feedback.customerName || 'Anonymous Customer'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(feedback.createdAt || feedback.processedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Rating value={feedback.rating} readOnly size="medium" />
                          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                            {feedback.serviceName}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={feedback.sentiment || 'NEUTRAL'}
                            icon={feedback.sentiment === 'POSITIVE' ? <ThumbUpIcon /> : feedback.sentiment === 'NEGATIVE' ? <ThumbDownIcon /> : undefined}
                            color={feedback.sentiment === 'POSITIVE' ? 'success' : feedback.sentiment === 'NEGATIVE' ? 'error' : 'default'}
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      </Box>
                      
                      <Box 
                        sx={{ 
                          bgcolor: feedback.sentiment === 'NEGATIVE' || feedback.rating <= 2 
                            ? '#fff5f5' 
                            : feedback.sentiment === 'POSITIVE' || feedback.rating >= 4
                              ? '#f1f8e9'
                              : '#f5f5f5', 
                          p: 2.5, 
                          borderRadius: 2,
                          borderLeft: `4px solid ${
                            feedback.sentiment === 'NEGATIVE' || feedback.rating <= 2 
                              ? '#f44336' 
                              : feedback.sentiment === 'POSITIVE' || feedback.rating >= 4
                                ? '#4caf50'
                                : '#9e9e9e'
                          }`
                        }}
                      >
                        <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#333', lineHeight: 1.7 }}>
                          "{feedback.feedbackText}"
                        </Typography>
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

      {/* Feedback Dialog */}
      <Dialog 
        open={feedbackDialogOpen} 
        onClose={handleCloseFeedbackDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle 
          sx={{ 
            bgcolor: '#003047', 
            color: 'white', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold">
              💬 {selectedService?.serviceName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Rating value={parseFloat(selectedService?.avgRating || 0)} readOnly size="small" sx={{ color: '#faaf00' }} />
              <Typography variant="body2">
                {selectedService?.avgRating} ★ • {selectedService?.count} total review{selectedService?.count !== 1 ? 's' : ''}
              </Typography>
            </Box>
          </Box>
          <IconButton color="inherit" onClick={handleCloseFeedbackDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          <Tabs 
            value={dialogTab} 
            onChange={(e, newValue) => setDialogTab(newValue)}
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fafafa' }}
          >
            <Tab 
              label={`All (${selectedService?.count || 0})`} 
              icon={<FeedbackIcon />}
              iconPosition="start"
            />
            <Tab 
              label={`Positive (${selectedService?.positive || 0})`} 
              icon={<ThumbUpIcon />}
              iconPosition="start"
              sx={{ color: '#4caf50' }}
            />
            <Tab 
              label={`Negative (${selectedService?.negative || 0})`} 
              icon={<ThumbDownIcon />}
              iconPosition="start"
              sx={{ color: '#f44336' }}
            />
          </Tabs>

          <List sx={{ p: 2 }}>
            {selectedService?.feedbacks
              ?.filter(fb => {
                if (dialogTab === 0) return true;
                if (dialogTab === 1) return fb.sentiment === 'POSITIVE' || fb.rating >= 4;
                if (dialogTab === 2) return fb.sentiment === 'NEGATIVE' || fb.rating <= 2;
                return true;
              })
              .map((fb) => (
                <ListItem 
                  key={fb._id} 
                  alignItems="flex-start" 
                  sx={{ 
                    bgcolor: fb.sentiment === 'NEGATIVE' || fb.rating <= 2 ? '#fff5f5' : 
                             fb.sentiment === 'POSITIVE' || fb.rating >= 4 ? '#f1f8e9' : '#fafafa',
                    mb: 2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: fb.sentiment === 'NEGATIVE' || fb.rating <= 2 ? '#ffcdd2' : 
                                 fb.sentiment === 'POSITIVE' || fb.rating >= 4 ? '#c8e6c9' : '#e0e0e0'
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      sx={{ 
                        bgcolor: fb.sentiment === 'NEGATIVE' || fb.rating <= 2 ? '#f44336' : 
                                 fb.sentiment === 'POSITIVE' || fb.rating >= 4 ? '#4caf50' : '#9e9e9e'
                      }}
                    >
                      {fb.rating <= 2 ? <ThumbDownIcon /> : fb.rating >= 4 ? <ThumbUpIcon /> : fb.customerName?.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" color="#003047">
                          {fb.customerName || 'Anonymous'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating value={fb.rating} readOnly size="small" />
                          <Chip 
                            size="small" 
                            label={fb.sentiment}
                            color={fb.sentiment === 'POSITIVE' ? 'success' : fb.sentiment === 'NEGATIVE' ? 'error' : 'default'}
                          />
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontStyle: 'italic', 
                            color: '#333',
                            p: 1.5,
                            bgcolor: 'white',
                            borderRadius: 1,
                            mb: 1
                          }}
                        >
                          "{fb.feedbackText}"
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(fb.createdAt || fb.processedAt).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            {selectedService?.feedbacks?.filter(fb => {
              if (dialogTab === 0) return true;
              if (dialogTab === 1) return fb.sentiment === 'POSITIVE' || fb.rating >= 4;
              if (dialogTab === 2) return fb.sentiment === 'NEGATIVE' || fb.rating <= 2;
              return true;
            }).length === 0 && (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <FeedbackIcon sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
                <Typography color="text.secondary" variant="h6">
                  No feedback in this category
                </Typography>
              </Box>
            )}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#fafafa' }}>
          <Button 
            onClick={handleCloseFeedbackDialog} 
            variant="contained"
            sx={{ 
              borderRadius: 2,
              bgcolor: '#003047',
              '&:hover': { bgcolor: '#00496b' }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceProviderFeedbackPage;
