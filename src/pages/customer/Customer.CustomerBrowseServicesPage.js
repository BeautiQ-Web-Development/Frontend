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
  Checkbox
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { getApprovedServiceProviders } from '../../services/auth';
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
      
      console.log('Fetching approved service providers...');
      const response = await getApprovedServiceProviders();
      
      console.log('Service providers response:', response);
      
      if (response.success && response.providers) {
        setServiceProviders(response.providers);
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
                    <Rating value={4.8} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      4.8 (758)
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
    </Container>
  );
};

export default CustomerBrowseServicesPage;