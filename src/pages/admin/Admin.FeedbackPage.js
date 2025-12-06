import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Paper, Grid, Rating, CircularProgress,
  Card, CardContent, Divider, Chip, Avatar, TextField, MenuItem,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
  FormControl, InputLabel, Select, IconButton, Tooltip, useMediaQuery, useTheme,
  Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { fetchFeedbacks, fetchFeedbackStats } from '../../services/feedback';
import AdminSidebar from '../../components/AdminSidebar';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';

const AdminFeedbackPage = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Filters
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [ratingFilter, setRatingFilter] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  
  // View dialog state
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  const handleViewFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedFeedback(null);
  };

  useEffect(() => {
    loadData();
  }, [page, rowsPerPage, ratingFilter, sentimentFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats only once or when needed
      if (!stats) {
        const statsData = await fetchFeedbackStats();
        setStats(statsData);
      }

      // Fetch feedbacks with filters
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        rating: ratingFilter,
        sentiment: sentimentFilter
      };
      
      const response = await fetchFeedbacks(params);
      setFeedbacks(response.data);
      setTotalCount(response.pagination.total);
      
    } catch (error) {
      console.error('Error loading feedback data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header toggleSidebar={toggleSidebar} pageTitle="Feedback & Ratings" />
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          bgcolor: '#f5f7fa',
          transition: 'margin-left 0.3s',
          marginLeft: sidebarOpen && !isMobile ? '240px' : 0,
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: '#003047' }}>
            Feedback & Ratings Management
          </Typography>

          {/* Stats Cards */}
          {stats && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={3}>
                <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center', height: '100%' }}>
                  <Typography color="text.secondary" gutterBottom>Total Feedback</Typography>
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#003047' }}>
                    {stats.totalFeedback || 0}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={3}>
                <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center', height: '100%' }}>
                  <Typography color="text.secondary" gutterBottom>Average Rating</Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#faaf00', mr: 1 }}>
                      {stats.avgRating || 0}
                    </Typography>
                    <Rating value={stats.avgRating || 0} precision={0.1} readOnly />
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                  <Typography color="text.secondary" gutterBottom>Sentiment Distribution</Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    {stats.sentimentDistribution?.map((item) => (
                      <Box key={item._id} sx={{ flex: 1, textAlign: 'center' }}>
                        <Typography variant="h6">{item.count}</Typography>
                        <Chip 
                          label={item._id} 
                          color={item._id === 'POSITIVE' ? 'success' : item._id === 'NEGATIVE' ? 'error' : 'default'}
                          size="small"
                        />
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          )}

          {/* Filters */}
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Rating</InputLabel>
                  <Select
                    value={ratingFilter}
                    label="Rating"
                    onChange={(e) => setRatingFilter(e.target.value)}
                  >
                    <MenuItem value="">All Ratings</MenuItem>
                    <MenuItem value="5">5 Stars</MenuItem>
                    <MenuItem value="4">4 Stars</MenuItem>
                    <MenuItem value="3">3 Stars</MenuItem>
                    <MenuItem value="2">2 Stars</MenuItem>
                    <MenuItem value="1">1 Star</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sentiment</InputLabel>
                  <Select
                    value={sentimentFilter}
                    label="Sentiment"
                    onChange={(e) => setSentimentFilter(e.target.value)}
                  >
                    <MenuItem value="">All Sentiments</MenuItem>
                    <MenuItem value="POSITIVE">Positive</MenuItem>
                    <MenuItem value="NEGATIVE">Negative</MenuItem>
                    <MenuItem value="NEUTRAL">Neutral</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Feedback Table */}
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#003047' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>Date</TableCell>
                  <TableCell sx={{ color: 'white' }}>Customer</TableCell>
                  <TableCell sx={{ color: 'white' }}>Provider</TableCell>
                  <TableCell sx={{ color: 'white' }}>Service</TableCell>
                  <TableCell sx={{ color: 'white' }}>Rating</TableCell>
                  <TableCell sx={{ color: 'white' }}>Feedback</TableCell>
                  <TableCell sx={{ color: 'white' }}>Sentiment</TableCell>
                  <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : feedbacks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      No feedback found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  feedbacks.map((feedback) => (
                    <TableRow key={feedback._id} hover>
                      <TableCell>
                        {new Date(feedback.createdAt).toLocaleDateString()}
                        <Typography variant="caption" display="block" color="text.secondary">
                          {new Date(feedback.createdAt).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">{feedback.customerName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">{feedback.providerName}</Typography>
                          {feedback.serviceProviderId && (
                            <Typography variant="caption" color="text.secondary">ID: {feedback.serviceProviderId}</Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>{feedback.serviceName}</TableCell>
                      <TableCell>
                        <Rating value={feedback.rating} readOnly size="small" />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>
                        <Typography variant="body2" sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}>
                          {feedback.feedbackText}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={feedback.sentiment} 
                          size="small"
                          color={feedback.sentiment === 'POSITIVE' ? 'success' : feedback.sentiment === 'NEGATIVE' ? 'error' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewFeedback(feedback)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Container>
      </Box>

      {/* View Feedback Details Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={handleCloseViewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#003047', color: 'white' }}>
          Feedback Details
        </DialogTitle>
        <DialogContent dividers>
          {selectedFeedback && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Date & Time</Typography>
                <Typography variant="body1">
                  {new Date(selectedFeedback.createdAt).toLocaleDateString()} at {new Date(selectedFeedback.createdAt).toLocaleTimeString()}
                </Typography>
              </Box>
              
              <Divider />
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Customer</Typography>
                <Typography variant="body1" fontWeight="bold">{selectedFeedback.customerName}</Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Service Provider</Typography>
                <Typography variant="body1" fontWeight="bold">{selectedFeedback.providerName}</Typography>
                {selectedFeedback.serviceProviderId && (
                  <Typography variant="caption" color="text.secondary">ID: {selectedFeedback.serviceProviderId}</Typography>
                )}
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Service</Typography>
                <Typography variant="body1">{selectedFeedback.serviceName}</Typography>
              </Box>
              
              <Divider />
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Rating</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={selectedFeedback.rating} readOnly />
                  <Typography variant="body1">({selectedFeedback.rating}/5)</Typography>
                </Box>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Sentiment</Typography>
                <Chip 
                  label={selectedFeedback.sentiment} 
                  color={selectedFeedback.sentiment === 'POSITIVE' ? 'success' : selectedFeedback.sentiment === 'NEGATIVE' ? 'error' : 'default'}
                />
              </Box>
              
              <Divider />
              
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Feedback</Typography>
                <Paper sx={{ p: 2, bgcolor: '#f5f5f5', mt: 1 }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedFeedback.feedbackText}
                  </Typography>
                </Paper>
              </Box>
              
              {selectedFeedback.bookingId && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Booking ID</Typography>
                  <Typography variant="caption">{selectedFeedback.bookingId}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminFeedbackPage;
