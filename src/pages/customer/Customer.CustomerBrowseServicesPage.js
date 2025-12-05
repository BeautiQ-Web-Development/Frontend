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
  Alert,
  Accordion, AccordionSummary, AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  StarHalf as StarHalfIcon
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { getApprovedServiceProviders } from '../../services/auth';
import { fetchAllProviderStats, fetchProviderFeedback } from '../../services/feedback';
import { useNavigate } from 'react-router-dom';

const CustomerBrowseServicesPage = () => {
  // filter options
  const serviceTypes = ['Hair Cut','Hair Style','Face Makeup','Nail Art','Saree Draping','Eye Makeup'];
  const experienceLevels = ['beginner','intermediate','experienced','expert'];
  const categories = ['Women','Men','Kids','Unisex'];
  // filter state
  const [typeFilter, setTypeFilter] = useState('');
  const [expFilter, setExpFilter] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [expSelection, setExpSelection] = useState([]);
  const [catSelection, setCatSelection] = useState([]);
  const [typeSelection, setTypeSelection] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Feedback Dialog State
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedProviderFeedback, setSelectedProviderFeedback] = useState({ feedbacks: [], stats: {} });
  const [selectedProviderName, setSelectedProviderName] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchServiceProviders();
  }, []);

  useEffect(() => {
    filterProviders();
  }, [searchTerm, serviceProviders, typeFilter, expFilter, catFilter, priceRange, expSelection, catSelection, typeSelection]);

  const fetchServiceProviders = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching approved service providers and stats...');
      const [providersResponse, statsResponse] = await Promise.all([
        getApprovedServiceProviders(),
        fetchAllProviderStats().catch(err => {
          console.error('Error fetching stats:', err);
          return {};
        })
      ]);
      
      console.log('Service providers response:', providersResponse);
      console.log('Stats response:', statsResponse);
      
      if (providersResponse.success && providersResponse.providers) {
        let providers = providersResponse.providers;
        const stats = statsResponse || {};
        
        // Merge stats and sort
        providers = providers.map(p => ({
          ...p,
          rating: stats[p._id]?.avgRating || 0,
          feedbackCount: stats[p._id]?.totalFeedbacks || 0
        }));
        
        // Sort by rating descending
        providers.sort((a, b) => b.rating - a.rating);

        setServiceProviders(providers);
        setError('');
      } else {
        setServiceProviders([]);
        setError('No approved service providers found');
      }
    } catch (error) {
      console.error('Error fetching service providers:', error);
      setError('Failed to load service providers. Please try again later.');
      setServiceProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackClick = async (e, providerId, providerName) => {
    e.stopPropagation();
    try {
      setFeedbackLoading(true);
      setSelectedProviderName(providerName);
      setFeedbackDialogOpen(true);
      
      const data = await fetchProviderFeedback(providerId);
      setSelectedProviderFeedback(data);
    } catch (error) {
      console.error('Error fetching provider feedback:', error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleCloseFeedbackDialog = () => {
    setFeedbackDialogOpen(false);
    setSelectedProviderFeedback({ feedbacks: [], stats: {} });
  };

  const filterProviders = () => {
    let list = serviceProviders;
    // search term
    if (searchTerm) {
      list = list.filter(provider =>
        provider.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.specialties?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (typeFilter) {
      list = list.filter(p => p.specialties?.includes(typeFilter));
    }
    if (expFilter) {
      list = list.filter(p => p.experience?.level === expFilter);
    }
    if (catFilter) {
      list = list.filter(p => p.category === catFilter);
    }
    // price
    list = list.filter(p => {
      const price = p.pricing?.basePrice ?? 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    // experience
    if (expSelection.length) {
      list = list.filter(p => expSelection.includes(p.experience?.level));
    }
    // category
    if (catSelection.length) {
      list = list.filter(p => catSelection.includes(p.category));
    }
    // type
    if (typeSelection.length) {
      list = list.filter(p => typeSelection.includes(p.type));
    }
    setFilteredProviders(list);
  };

  // NEW helper to open calendar view
  const openBooking = (serviceId) => {
    navigate(`/customer/book-service/${serviceId}`);
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
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#003047', fontWeight: 'bold' }}>
        Browse Services
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by business name, provider name, or service type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon sx={{color:'#003047'}}/></InputAdornment>) }}
          sx={{ mb: 2 }}
        />

        {/* Filters Panel */}
        <Accordion defaultExpanded sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Filters</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {/* Price Range */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Price Range (LKR)</Typography>
              <Slider
                value={priceRange}
                onChange={(e, val) => setPriceRange(val)}
                valueLabelDisplay="auto"
                min={0}
                max={10000}
                step={100}
              />
            </Box>
            {/* Experience Level */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Experience Level</Typography>
              <FormGroup row>
                {experienceLevels.map(level => (
                  <FormControlLabel
                    key={level}
                    control={
                      <Checkbox
                        checked={expSelection.includes(level)}
                        onChange={() => {
                          setExpSelection(prev =>
                            prev.includes(level)
                              ? prev.filter(l => l !== level)
                              : [...prev, level]
                          );
                        }}
                      />
                    }
                    label={level.charAt(0).toUpperCase() + level.slice(1)}
                  />
                ))}
              </FormGroup>
            </Box>
            {/* Category */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Category</Typography>
              <FormGroup row>
                {categories.map(cat => (
                  <FormControlLabel
                    key={cat}
                    control={
                      <Checkbox
                        checked={catSelection.includes(cat)}
                        onChange={() => {
                          setCatSelection(prev =>
                            prev.includes(cat)
                              ? prev.filter(c => c !== cat)
                              : [...prev, cat]
                          );
                        }}
                      />
                    }
                    label={cat}
                  />
                ))}
              </FormGroup>
            </Box>
            {/* Type of Service */}
            <Box>
              <Typography variant="subtitle2">Type of Service</Typography>
              <FormGroup row>
                {serviceTypes.map(type => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        checked={typeSelection.includes(type)}
                        onChange={() => {
                          setTypeSelection(prev =>
                            prev.includes(type)
                              ? prev.filter(t => t !== type)
                              : [...prev, type]
                          );
                        }}
                      />
                    }
                    label={type}
                  />
                ))}
              </FormGroup>
            </Box>
          </AccordionDetails>
        </Accordion>
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
                  <Typography gutterBottom variant="h6" component="h2" sx={{ color: '#003047', fontWeight: 'bold' }}>
                    {provider.businessName}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={provider.rating || 0} precision={0.1} readOnly size="small" />
                    <Typography 
                      variant="body2" 
                      color="primary" 
                      sx={{ 
                        ml: 1, 
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontWeight: 'bold'
                      }}
                      onClick={(e) => handleFeedbackClick(e, provider._id, provider.businessName)}
                    >
                      {provider.rating ? provider.rating.toFixed(1) : '0.0'} ({provider.feedbackCount || 0} Feedback)
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ fontSize: 16, color: '#003047', mr: 0.5 }} />
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
                          color: '#003047',
                          fontSize: '0.75rem'
                        }}
                      />
                    ))}
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    {provider.experience?.description?.substring(0, 100)}
                    {provider.experience?.description?.length > 100 ? '...' : ''}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#003047', fontWeight: 'bold', mb: 2 }}>
                    2 slots available
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetails(provider._id)}
                      sx={{
                        borderColor: '#003047',
                        color: '#003047',
                        '&:hover': {
                          borderColor: '#003047',
                          backgroundColor: '#F0FAFB'
                        }
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => openBooking(provider._id)}
                      sx={{
                        backgroundColor: '#003047',
                        '&:hover': {
                          backgroundColor: '#003047'
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

      {/* Feedback Dialog */}
      <Dialog 
        open={feedbackDialogOpen} 
        onClose={handleCloseFeedbackDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ borderBottom: '1px solid #eee' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Feedback for {selectedProviderName}</Typography>
            <IconButton onClick={handleCloseFeedbackDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {feedbackLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, bgcolor: '#f8f9fa', p: 2, borderRadius: 2 }}>
                <Box sx={{ textAlign: 'center', mr: 4 }}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                    {selectedProviderFeedback.stats?.avgRating || 0}
                  </Typography>
                  <Rating value={selectedProviderFeedback.stats?.avgRating || 0} precision={0.1} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {selectedProviderFeedback.stats?.totalFeedbacks || 0} ratings
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ mr: 4 }} />
                <Box sx={{ flexGrow: 1 }}>
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = selectedProviderFeedback.stats?.ratingCounts?.[star] || 0;
                    const total = selectedProviderFeedback.stats?.totalFeedbacks || 1;
                    const percent = (count / total) * 100;
                    return (
                      <Box key={star} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ minWidth: 20, mr: 1 }}>{star}</Typography>
                        <StarIcon sx={{ fontSize: 16, color: '#faaf00', mr: 1 }} />
                        <Box sx={{ flexGrow: 1, height: 8, bgcolor: '#eee', borderRadius: 4, overflow: 'hidden' }}>
                          <Box sx={{ width: `${percent}%`, height: '100%', bgcolor: '#faaf00' }} />
                        </Box>
                        <Typography variant="body2" sx={{ minWidth: 30, ml: 1, textAlign: 'right' }}>{count}</Typography>
                      </Box>
                    );
                  })}
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom>Customer Reviews</Typography>
              {selectedProviderFeedback.feedbacks?.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 2 }}>No reviews yet.</Typography>
              ) : (
                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  {selectedProviderFeedback.feedbacks?.map((feedback) => (
                    <Box key={feedback._id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
                            {feedback.customerName?.charAt(0) || 'C'}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">{feedback.customerName || 'Customer'}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(feedback.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                        <Rating value={feedback.rating} readOnly size="small" />
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {feedback.feedbackText}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        Service: {feedback.serviceName}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFeedbackDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CustomerBrowseServicesPage;