import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Rating,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Badge,
  Tab,
  Tabs
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  CheckCircle as OnlineIcon,
  Cancel as OfflineIcon,
  Schedule as ScheduleIcon,
  MonetizationOn as PriceIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import Footer from '../components/footer';

const ServiceBrowser = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [openProviderDialog, setOpenProviderDialog] = useState(false);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [openTimeSlotDialog, setOpenTimeSlotDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterServiceType, setFilterServiceType] = useState('');
  const [tabValue, setTabValue] = useState(0);

  // Booking form data
  const [bookingData, setBookingData] = useState({
    hairLength: '',
    numberOfSarees: '',
    materialType: '',
    specialRequests: ''
  });

  // Sample data - replace with API calls
  useEffect(() => {
    // Fetch services and providers
    fetchServices();
    fetchServiceProviders();
  }, []);

  const fetchServices = async () => {
    // API call to fetch approved services
    const sampleServices = [
      {
        id: 1,
        serviceName: 'Layer Hair Cut',
        serviceType: 'Haircuts',
        targetAudience: 'Women',
        basePrice: 6000,
        duration: 90,
        providerId: 1,
        providerName: 'SalonDmesh',
        rating: 4.9,
        image: '/api/placeholder/300/200',
        status: 'approved'
      }
    ];
    setServices(sampleServices);
  };

  const fetchServiceProviders = async () => {
    // API call to fetch service providers
    const sampleProviders = [
      {
        id: 1,
        businessName: 'SalonDmesh',
        fullName: 'Dmesh Silva',
        rating: 4.9,
        reviewCount: 357,
        location: 'No 89 old road, navinna, maharagama, Colombo',
        isOnline: true,
        lastSeen: new Date(),
        profileImage: '/api/placeholder/100/100',
        services: [
          {
            id: 1,
            serviceName: 'Layer Hair Cut',
            serviceType: 'Haircuts',
            basePrice: 6000,
            duration: 90,
            description: 'Upgrade your look with our layered haircut. Our skilled stylists add dimension and...'
          },
          {
            id: 2,
            serviceName: 'Hair Spa Treatment',
            serviceType: 'Hair Treatment',
            basePrice: 9000,
            duration: 120,
            description: 'Dry scalp or dry ends? We have a hair spa solution for both'
          }
        ],
        packages: [
          {
            id: 1,
            packageName: 'Bridal Beauty Package',
            packageType: 'bridal',
            totalPrice: 25000,
            totalDuration: 240,
            includedServices: ['Makeup', 'Hairstyle', 'Saree Draping']
          }
        ]
      }
    ];
    setServiceProviders(sampleProviders);
  };

  const handleProviderClick = (provider) => {
    setSelectedProvider(provider);
    setOpenProviderDialog(true);
  };

  const handleBookService = (service) => {
    setSelectedService(service);
    setOpenBookingDialog(true);
  };

  const handleBookingSubmit = () => {
    setOpenBookingDialog(false);
    setOpenTimeSlotDialog(true);
  };

  const getServiceSpecificFields = (serviceType) => {
    switch (serviceType) {
      case 'Haircuts':
      case 'Hairstyle':
      case 'Hair Color':
        return (
          <TextField
            fullWidth
            label="Hair Length"
            select
            value={bookingData.hairLength}
            onChange={(e) => setBookingData({...bookingData, hairLength: e.target.value})}
            sx={{ mb: 2 }}
          >
            <MenuItem value="short">Short (Above shoulders)</MenuItem>
            <MenuItem value="medium">Medium (Shoulder length)</MenuItem>
            <MenuItem value="long">Long (Below shoulders)</MenuItem>
            <MenuItem value="very-long">Very Long (Waist length)</MenuItem>
          </TextField>
        );
      
      case 'Saree Draping':
        return (
          <>
            <TextField
              fullWidth
              label="Number of Sarees"
              type="number"
              value={bookingData.numberOfSarees}
              onChange={(e) => setBookingData({...bookingData, numberOfSarees: e.target.value})}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Material Type"
              select
              value={bookingData.materialType}
              onChange={(e) => setBookingData({...bookingData, materialType: e.target.value})}
              sx={{ mb: 2 }}
            >
              <MenuItem value="silk">Silk</MenuItem>
              <MenuItem value="cotton">Cotton</MenuItem>
              <MenuItem value="chiffon">Chiffon</MenuItem>
              <MenuItem value="georgette">Georgette</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
          </>
        );
      
      default:
        return null;
    }
  };

  const TimeSlotBooking = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);

    const timeSlots = [
      '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    const isSlotAvailable = (time) => {
      // Logic to check if slot is available
      return Math.random() > 0.3; // Random for demo
    };

    return (
      <Dialog open={openTimeSlotDialog} onClose={() => setOpenTimeSlotDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Select Date & Time</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {selectedService?.serviceName} - LKR {selectedService?.basePrice}
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Select Date</Typography>
              <TextField
                type="date"
                fullWidth
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>Available Time Slots</Typography>
              <Grid container spacing={1}>
                {timeSlots.map((time) => (
                  <Grid item xs={6} sm={4} key={time}>
                    <Button
                      variant={selectedTime === time ? 'contained' : 'outlined'}
                      color={isSlotAvailable(time) ? 'primary' : 'error'}
                      disabled={!isSlotAvailable(time)}
                      onClick={() => setSelectedTime(time)}
                      fullWidth
                      size="small"
                    >
                      {time}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTimeSlotDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            disabled={!selectedTime}
            onClick={() => {
              // Proceed to payment
              console.log('Proceeding to payment...');
            }}
          >
            Proceed to Payment
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#075B5E', fontWeight: 'bold' }}>
          Browse Services
        </Typography>

        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Service Type</InputLabel>
                <Select
                  value={filterServiceType}
                  onChange={(e) => setFilterServiceType(e.target.value)}
                >
                  <MenuItem value="">All Services</MenuItem>
                  <MenuItem value="Haircuts">Haircuts</MenuItem>
                  <MenuItem value="Makeup">Makeup</MenuItem>
                  <MenuItem value="Nail Art">Nail Art</MenuItem>
                  <MenuItem value="Facial">Facial</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Location"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
              />
            </Grid>
          </Grid>
        </Paper>

        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
          <Tab label="All Services" />
          <Tab label="Service Providers" />
        </Tabs>

        {/* Services Tab */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            {services.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={service.image}
                    alt={service.serviceName}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {service.serviceName}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {service.providerName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={service.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({service.rating})
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary">
                      LKR {service.basePrice}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {service.duration} mins
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => handleProviderClick(serviceProviders.find(p => p.id === service.providerId))}
                    >
                      Details
                    </Button>
                    <Button 
                      size="small" 
                      variant="contained"
                      onClick={() => handleBookService(service)}
                      sx={{ bgcolor: '#075B5E' }}
                    >
                      Book
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Service Providers Tab */}
        {tabValue === 1 && (
          <Grid container spacing={3}>
            {serviceProviders.map((provider) => (
              <Grid item xs={12} sm={6} md={4} key={provider.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar src={provider.profileImage} sx={{ width: 60, height: 60, mr: 2 }} />
                      <Box>
                        <Typography variant="h6">{provider.businessName}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {provider.fullName}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Badge
                            color={provider.isOnline ? 'success' : 'error'}
                            variant="dot"
                            sx={{ mr: 1 }}
                          >
                            {provider.isOnline ? <OnlineIcon color="success" /> : <OfflineIcon color="error" />}
                          </Badge>
                          <Typography variant="caption">
                            {provider.isOnline ? 'Online' : 'Offline'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={provider.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({provider.reviewCount} reviews)
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                      <LocationIcon fontSize="small" sx={{ mr: 0.5 }} />
                      {provider.location}
                    </Typography>
                    
                    <Typography variant="body2">
                      {provider.services.length} Services • {provider.packages.length} Packages
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      fullWidth
                      variant="outlined"
                      onClick={() => handleProviderClick(provider)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Provider Details Dialog */}
        <Dialog open={openProviderDialog} onClose={() => setOpenProviderDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={selectedProvider?.profileImage} sx={{ width: 60, height: 60, mr: 2 }} />
              <Box>
                <Typography variant="h5">{selectedProvider?.businessName}</Typography>
                <Typography variant="body1" color="textSecondary">
                  {selectedProvider?.fullName}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Badge
                    color={selectedProvider?.isOnline ? 'success' : 'error'}
                    variant="dot"
                    sx={{ mr: 1 }}
                  >
                    {selectedProvider?.isOnline ? <OnlineIcon color="success" /> : <OfflineIcon color="error" />}
                  </Badge>
                  <Typography variant="body2">
                    {selectedProvider?.isOnline ? 'Online' : 'Offline'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom>Services</Typography>
            <List>
              {selectedProvider?.services.map((service) => (
                <ListItem key={service.id} divider>
                  <ListItemText
                    primary={service.serviceName}
                    secondary={
                      <Box>
                        <Typography variant="body2">{service.description}</Typography>
                        <Typography variant="body2" color="primary">
                          LKR {service.basePrice} • {service.duration} mins
                        </Typography>
                      </Box>
                    }
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleBookService(service)}
                    sx={{ bgcolor: '#075B5E' }}
                  >
                    Book
                  </Button>
                </ListItem>
              ))}
            </List>
            
            {selectedProvider?.packages && selectedProvider.packages.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Packages</Typography>
                <List>
                  {selectedProvider.packages.map((pkg) => (
                    <ListItem key={pkg.id} divider>
                      <ListItemText
                        primary={pkg.packageName}
                        secondary={
                          <Box>
                            <Typography variant="body2">
                              Includes: {pkg.includedServices.join(', ')}
                            </Typography>
                            <Typography variant="body2" color="primary">
                              LKR {pkg.totalPrice} • {pkg.totalDuration} mins
                            </Typography>
                          </Box>
                        }
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleBookService(pkg)}
                        sx={{ bgcolor: '#075B5E' }}
                      >
                        Book
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenProviderDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Booking Dialog */}
        <Dialog open={openBookingDialog} onClose={() => setOpenBookingDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Book Service</DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom>
              {selectedService?.serviceName}
            </Typography>
            <Typography variant="body1" color="primary" gutterBottom>
              LKR {selectedService?.basePrice}
            </Typography>
            
            {getServiceSpecificFields(selectedService?.serviceType)}
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Special Requests (Optional)"
              value={bookingData.specialRequests}
              onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBookingDialog(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleBookingSubmit}>
              Continue
            </Button>
          </DialogActions>
        </Dialog>

        <TimeSlotBooking />
      </Container>
      <Footer />
    </Box>
  );
};

export default ServiceBrowser;