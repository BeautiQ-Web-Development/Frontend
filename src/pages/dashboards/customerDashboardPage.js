import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  Rating,
  IconButton,
  CardActions,
  Divider,
  Paper,
  Tooltip,
  Badge,
  Fade,
  Slide,
  Zoom,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Schedule as ScheduleIcon,
  Payment as PaymentIcon,
  Star as StarIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  CalendarToday as CalendarIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Insights as InsightsIcon,
  FormatQuote as FormatQuoteIcon
} from '@mui/icons-material';
import { getApprovedProviders } from '../../services/auth';
import {
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  connectToSocket,
  getSocket
} from '../../services/notification';
import Footer from '../../components/footer';
import CustomerSidebar from '../../components/CustomerSidebar';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import EnhancedAppBar from '../../components/EnhancedAppBar';
import api from '../../services/auth';
import { fetchCustomerFeedback } from '../../services/feedback';
import { formatDistanceToNow } from 'date-fns';

const CustomerDashboardContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  minHeight: '100vh',
}));

const DiscoveryCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
  border: 'none',
  borderRadius: 20,
  boxShadow: '0 10px 40px rgba(0, 31, 63, 0.1)',
  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 60px rgba(0, 31, 63, 0.2)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #00003f 0%, #764ba2 100%)',
    borderRadius: '20px 20px 0 0',
  },
}));

const ServiceCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #ffffff 0%, #f0f4ff 100%)',
  border: 'none',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 31, 63, 0.08)',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 16px 48px rgba(0, 31, 63, 0.15)',
    '& .service-actions': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #764ba2 0%, #4facfe 100%)',
  },
}));

const GradientButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'gradientVariant',
})(({ theme, gradientVariant = 'primary' }) => {
  const isSecondary = gradientVariant === 'secondary';
  return {
    borderRadius: 12,
    textTransform: 'none',
    fontWeight: 600,
    padding: theme.spacing(1.25, 2.5),
    boxShadow: isSecondary ? 'none' : '0 12px 24px rgba(0, 0, 63, 0.18)',
    background: isSecondary
      ? 'rgba(0, 0, 63, 0.08)'
      : 'linear-gradient(135deg, #4facfe 0%, #00003f 100%)',
    color: isSecondary ? '#00003f' : '#ffffff',
    '&:hover': {
      background: isSecondary
        ? 'rgba(0, 0, 63, 0.12)'
        : 'linear-gradient(135deg, #5f9bff 0%, #171760 100%)',
      boxShadow: isSecondary ? 'none' : '0 16px 32px rgba(0, 0, 63, 0.24)',
    },
  };
});

const ServiceDetailsDialog = ({ open, onClose, service, navigate }) => {
  if (!service) {
    return null;
  }

  const handleBookService = () => {
    if (navigate && service?._id) {
      navigate(`/customer/book-service/${service._id}`);
    }
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const getPriceType = (svc) => {
    const priceType = svc?.pricing?.priceType || svc?.priceType || 'fixed';
    return priceType.charAt(0).toUpperCase() + priceType.slice(1);
  };

  const getExperienceLevel = (level) => {
    if (!level) return 'Not specified';
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  const getServiceLocation = (svc) => {
    if (!svc) return 'Location to be confirmed with provider';
    if (svc.serviceLocation === 'home' && svc.address) {
      return svc.address;
    }
    return (
      svc.serviceProvider?.businessAddress ||
      svc.serviceProvider?.currentAddress ||
      svc.serviceProvider?.city ||
      svc.location ||
      'Location to be confirmed with provider'
    );
  };

  const getServiceLocationType = (svc) => {
    const type = svc?.serviceLocation || svc?.serviceLocationType || svc?.locationType;
    if (!type) return 'Salon';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getCancellationPolicy = (policy) => {
    if (!policy) return 'Standard cancellation policy applies';
    if (typeof policy === 'object') {
      return `${policy.hours || 24} hours notice required`;
    }
    return policy;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' }}
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
          boxShadow: '0 24px 80px rgba(0, 31, 63, 0.2)',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: 'linear-gradient(135deg, #00003f 0%, #764ba2 100%)',
          color: 'white',
          p: 3,
          position: 'relative',
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              {service.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label={service.type || service.category}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
              {service.category && service.type !== service.category && (
                <Chip
                  label={service.category}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              )}
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              backgroundColor: 'rgba(102, 126, 234, 0.05)',
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: '#00003f',
                fontWeight: 700,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <InfoIcon sx={{ mr: 1 }} />
              Service Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TimeIcon sx={{ mr: 1, color: '#00003f', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
                    Duration:
                  </Typography>
                  <Typography variant="body2">{formatDuration(service.duration)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PaymentIcon sx={{ mr: 1, color: '#00003f', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
                    Price:
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#00003f', fontWeight: 700 }}>
                    LKR {service.basePrice?.toFixed(2) || service.pricing?.basePrice?.toFixed(2) || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PaymentIcon sx={{ mr: 1, color: '#00003f', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
                    Price Type:
                  </Typography>
                  <Chip
                    label={getPriceType(service)}
                    size="small"
                    sx={{ backgroundColor: 'rgba(0, 0, 63, 0.1)', color: '#00003f' }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <LocationIcon sx={{ mr: 1, color: '#00003f', fontSize: 20, mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Service Location:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {getServiceLocation(service)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationIcon sx={{ mr: 1, color: '#00003f', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
                    Service Location Type:
                  </Typography>
                  <Chip
                    label={getServiceLocationType(service)}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(79, 172, 254, 0.1)',
                      color: '#4facfe',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Grid>
              {service.experienceLevel && (
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <StarIcon sx={{ mr: 1, color: '#00003f', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>
                      Experience Level:
                    </Typography>
                    <Chip
                      label={getExperienceLevel(service.experienceLevel)}
                      size="small"
                      sx={{ backgroundColor: 'rgba(0, 0, 63, 0.1)', color: '#00003f' }}
                    />
                  </Box>
                </Grid>
              )}
              {service.preparationRequired && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                    <ScheduleIcon sx={{ mr: 1, color: '#00003f', fontSize: 20, mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Preparation Required:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                        {service.preparationRequired}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <InfoIcon sx={{ mr: 1, color: '#00003f', fontSize: 20, mt: 0.5 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Cancellation Policy:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                      {getCancellationPolicy(service.cancellationPolicy)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              {service.description && (
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                    Description:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                    {service.description}
                  </Typography>
                </Grid>
              )}
              {service.customNotes && (
                <Grid item xs={12}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      backgroundColor: 'rgba(118, 75, 162, 0.08)',
                      borderLeft: '4px solid #764ba2',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#764ba2' }}>
                      Special Notes:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                      {service.customNotes}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Paper>

          {service.serviceProvider && (
            <Paper
              elevation={0}
              sx={{ p: 3, backgroundColor: 'rgba(118, 75, 162, 0.05)', borderRadius: 3 }}
            >
              <Typography
                variant="h6"
                sx={{ color: '#764ba2', fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center' }}
              >
                <BusinessIcon sx={{ mr: 1 }} />
                Service Provider
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Avatar
                      src={service.serviceProvider.profilePhoto}
                      alt={service.serviceProvider.fullName}
                      sx={{
                        width: 100,
                        height: 100,
                        margin: '0 auto',
                        mb: 2,
                        border: '4px solid #764ba2',
                        boxShadow: '0 8px 24px rgba(118, 75, 162, 0.3)',
                      }}
                    >
                      <PersonIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#764ba2' }}>
                      {service.serviceProvider.businessName || service.serviceProvider.fullName}
                    </Typography>
                    {service.serviceProvider.businessType && (
                      <Chip
                        label={service.serviceProvider.businessType}
                        size="small"
                        sx={{ mt: 1, backgroundColor: 'rgba(118, 75, 162, 0.1)', color: '#764ba2' }}
                      />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Grid container spacing={2}>
                    {service.serviceProvider.mobileNumber && (
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <PhoneIcon sx={{ mr: 1, color: '#764ba2', fontSize: 20 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              Phone:
                            </Typography>
                            <Typography variant="body2">{service.serviceProvider.mobileNumber}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                    {service.serviceProvider.emailAddress && (
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <EmailIcon sx={{ mr: 1, color: '#764ba2', fontSize: 20 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              Email:
                            </Typography>
                            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                              {service.serviceProvider.emailAddress}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                    {service.serviceProvider.businessAddress && (
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <LocationIcon sx={{ mr: 1, color: '#764ba2', fontSize: 20, mt: 0.5 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              Business Address:
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {service.serviceProvider.businessAddress}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    )}
                    {service.serviceProvider.experience && (
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          Experience:
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {typeof service.serviceProvider.experience === 'object'
                            ? `${service.serviceProvider.experience.years} years in the industry`
                            : service.serviceProvider.experience}
                        </Typography>
                      </Grid>
                    )}
                    {service.serviceProvider.specialties &&
                      service.serviceProvider.specialties.length > 0 && (
                        <Grid item xs={12}>
                          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                            Specialties:
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {service.serviceProvider.specialties.map((specialty, index) => (
                              <Chip
                                key={index}
                                label={specialty}
                                size="small"
                                sx={{ backgroundColor: 'rgba(118, 75, 162, 0.1)', color: '#764ba2' }}
                              />
                            ))}
                          </Box>
                        </Grid>
                      )}
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Provider ID: {service.serviceProviderId || service.serviceProvider._id || 'N/A'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: 'rgba(0, 0, 0, 0.02)' }}>
        <GradientButton variant="secondary" onClick={onClose} startIcon={<CloseIcon />}>
          Close
        </GradientButton>
        <GradientButton variant="primary" onClick={handleBookService} startIcon={<CalendarIcon />}>
          Book This Service
        </GradientButton>
      </DialogActions>
    </Dialog>
  );
};

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [serviceProviders, setServiceProviders] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [providersLoading, setProvidersLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState('');
  const [customerBookings, setCustomerBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState('');
  const [feedbackByService, setFeedbackByService] = useState({});
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  // filter option arrays
  const serviceTypes      = ['Hair Cut','Hair Style','Face Makeup','Nail Art','Saree Draping','Eye Makeup'];
  const experienceLevels  = ['beginner','intermediate','experienced','expert'];
  const categories        = ['Kids','Women','Men','Unisex'];

  // filter state
  const [priceRange,    setPriceRange]    = useState([0, 10000]);
  const [maxPrice,      setMaxPrice]      = useState(10000);
  const [typeSelection, setTypeSelection] = useState([]);
  const [expSelection,  setExpSelection]  = useState([]);
  const [catSelection,  setCatSelection]  = useState([]);

  useEffect(() => {
    fetchServiceProviders();
    fetchApprovedServices();
    loadNotifications();
  }, []);

  useEffect(() => {
    if (!user || !user.userId) return;

    fetchCustomerBookings();
    fetchCustomerFeedbackData();
  }, [user]);

  const fetchApprovedServices = async () => {
    try {
      setServicesLoading(true);
      setServicesError('');
      
      const res = await api.get('/services/approved');
      
      if (res.data.success && res.data.data) {
        // Debug: Log the first service to see its structure
        if (res.data.data.length > 0) {
          console.log('First service structure:', res.data.data[0]);
        }
        setServices(res.data.data);
        // Update price filter range based on received services
        const data = res.data.data;
        const prices = data.map(s => s.pricing?.basePrice ?? 0);
        const newMax = prices.length ? Math.max(...prices) : 10000;
        setMaxPrice(newMax);
        setPriceRange([0, newMax]);
      } else {
        setServices([]);
        setServicesError('No approved services available');
      }
    } catch (err) {
      console.error('❌ Error fetching approved services:', err);
      setServicesError('Failed to load approved services.');
      setServices([]);
    } finally {
      setServicesLoading(false);
    }
  };

  const fetchServiceProviders = async () => {
    try {
      setProvidersLoading(true);
      setError('');
      
      const response = await getApprovedProviders();
      
      if (response.success && response.data) {
        setServiceProviders(response.data);
      } else {
        setServiceProviders([]);
        setError('No approved service providers found');
      }
    } catch (error) {
      console.error('Error fetching service providers:', error);
      setError('Failed to load service providers');
      setServiceProviders([]);
    } finally {
      setProvidersLoading(false);
    }
  };

  const fetchCustomerBookings = async () => {
    if (!user || !user.userId) {
      setCustomerBookings([]);
      return;
    }

    try {
      setBookingsLoading(true);
      setBookingsError('');

      const response = await api.get('/bookings/customer');
      const bookings = Array.isArray(response.data) ? response.data : response.data?.data;

      if (Array.isArray(bookings)) {
        setCustomerBookings(bookings);
      } else {
        setCustomerBookings([]);
      }
    } catch (error) {
      console.error('Error fetching customer bookings:', error);
      setBookingsError('Failed to load your recent bookings.');
      setCustomerBookings([]);
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchCustomerFeedbackData = async () => {
    if (!user || !user.userId) return;

    try {
      setFeedbackLoading(true);
      setFeedbackError('');

      const rawFeedback = await fetchCustomerFeedback(user.userId, { includeSentiment: true });

      const feedbackArray = Array.isArray(rawFeedback)
        ? rawFeedback
        : Array.isArray(rawFeedback?.feedbacks)
          ? rawFeedback.feedbacks
          : Array.isArray(rawFeedback?.data)
            ? rawFeedback.data
            : [];

      const grouped = feedbackArray.reduce((acc, feedback) => {
        const serviceLabel = feedback?.serviceName || feedback?.service?.name || feedback?.serviceId;
        if (!serviceLabel) {
          return acc;
        }

        if (!acc[serviceLabel]) {
          acc[serviceLabel] = {
            count: 0,
            ratingSum: 0,
            ratingCount: 0,
            positiveHighlights: [],
            allEntries: [],
            positiveCount: 0,
            negative: 0,
            neutral: 0,
            lastUpdated: null,
          };
        }

        const entry = acc[serviceLabel];
        entry.count += 1;

        const ratingValue = typeof feedback?.rating === 'number' ? feedback.rating : null;
        if (ratingValue !== null) {
          entry.ratingSum += ratingValue;
          entry.ratingCount += 1;
        }

        const sentimentRaw = (() => {
          if (typeof feedback?.sentiment === 'string') return feedback.sentiment;
          if (typeof feedback?.sentimentLabel === 'string') return feedback.sentimentLabel;
          if (typeof feedback?.sentiment?.label === 'string') return feedback.sentiment.label;
          if (typeof feedback?.sentimentScore?.label === 'string') return feedback.sentimentScore.label;
          return '';
        })()
          .toString()
          .toLowerCase();

        if (sentimentRaw.includes('neg')) {
          entry.negative += 1;
        } else if (sentimentRaw.includes('pos')) {
          entry.positiveCount += 1;
        } else {
          entry.neutral += 1;
        }

        const rawText = feedback?.feedback || feedback?.feedbackText || feedback?.comment || feedback?.reviewText || '';
        const text = typeof rawText === 'string' ? rawText.trim() : '';
        const submittedAt = feedback?.processedAt || feedback?.updatedAt || feedback?.createdAt || feedback?.submittedAt || null;

        if (submittedAt) {
          const submittedDate = new Date(submittedAt);
          if (!Number.isNaN(submittedDate.getTime())) {
            if (!entry.lastUpdated || submittedDate > entry.lastUpdated) {
              entry.lastUpdated = submittedDate;
            }
          }
        }

        if (text) {
          const truncated = text.length > 180 ? `${text.slice(0, 177).trim()}...` : text;
          const highlightEntry = {
            text: truncated,
            rating: ratingValue,
            submittedAt,
          };

          entry.allEntries.push(highlightEntry);

          if (sentimentRaw.includes('pos') || (ratingValue !== null && ratingValue >= 4)) {
            entry.positiveHighlights.push(highlightEntry);
          }
        }

        return acc;
      }, {});

      const normalized = Object.entries(grouped).reduce((acc, [serviceLabel, stats]) => {
        const avgRating = stats.ratingCount > 0 ? stats.ratingSum / stats.ratingCount : 0;
        const highlights = stats.positiveHighlights.length > 0 ? stats.positiveHighlights : stats.allEntries;

        acc[serviceLabel] = {
          total: stats.count,
          avgRating,
          positive: stats.positiveHighlights,
          positiveCount: stats.positiveCount,
          negative: stats.negative,
          neutral: stats.neutral,
          lastUpdated: stats.lastUpdated ? stats.lastUpdated.toISOString() : null,
          highlight: highlights.length > 0 ? highlights[0] : null,
        };

        return acc;
      }, {});

      setFeedbackByService(normalized);
    } catch (error) {
      console.error('Error fetching customer feedback:', error);
      setFeedbackError('Failed to load feedback insights.');
      setFeedbackByService({});
    } finally {
      setFeedbackLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      console.log('🔄 Loading notifications for customer');
      const notifications = await fetchNotifications();
      setNotificationsList(notifications || []);
      
      // Calculate unread count
      const unread = notifications.filter(n => !n.read).length;
      setUnreadCount(unread);
      
      console.log(`✅ Loaded ${notifications.length} notifications (${unread} unread)`);
    } catch (error) {
      console.error('❌ Failed to load notifications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/customer-login');
  };
  
  const toggleSidebar = () => setSidebarOpen(o => !o);

  const handleViewServiceDetails = (service) => {
    // Debug: Log the service object to console
    console.log('Selected service details:', service);
    setSelectedService(service);
    setDialogOpen(true);
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  // apply filters before render
  const filteredServices = services.filter(s => {
    const price = s.pricing?.basePrice ?? 0;
    if (price < priceRange[0] || price > priceRange[1]) return false;
    if (typeSelection.length && !typeSelection.includes(s.type)) return false;
    if (expSelection.length  && !expSelection.includes(s.experienceLevel)) return false;
    if (catSelection.length  && !catSelection.includes(s.category)) return false;
    return true;
  });

  const serviceAnalytics = useMemo(() => {
    const analytics = {};

    services.forEach((svc) => {
      const key = svc?.name || svc?.serviceName || svc?._id;
      if (!key) return;
      if (!analytics[key]) {
        analytics[key] = {
          completions: 0,
          totalFeedback: 0,
          avgRating: 0,
          highlight: null,
          trend: 'steady',
          positiveCount: 0,
          negativeCount: 0,
        };
      }
    });

    customerBookings.forEach((booking) => {
      const key = booking?.serviceName || booking?.serviceId;
      if (!key) return;
      if (!analytics[key]) {
        analytics[key] = {
          completions: 0,
          totalFeedback: 0,
          avgRating: 0,
          highlight: null,
          trend: 'steady',
          positiveCount: 0,
          negativeCount: 0,
        };
      }

      const status = booking?.status ? booking.status.toLowerCase() : '';
      if (status === 'completed') {
        analytics[key].completions += 1;
      }
    });

    Object.entries(feedbackByService).forEach(([serviceLabel, entry]) => {
      if (!analytics[serviceLabel]) {
        analytics[serviceLabel] = {
          completions: 0,
          totalFeedback: 0,
          avgRating: 0,
          highlight: null,
          trend: 'steady',
          positiveCount: 0,
          negativeCount: 0,
        };
      }

      analytics[serviceLabel].avgRating = entry?.avgRating || 0;
      analytics[serviceLabel].totalFeedback = entry?.total || 0;
      analytics[serviceLabel].highlight = entry?.highlight || null;
      analytics[serviceLabel].positiveCount = entry?.positiveCount || 0;
      analytics[serviceLabel].negativeCount = entry?.negative || 0;

      if (analytics[serviceLabel].positiveCount > analytics[serviceLabel].negativeCount) {
        analytics[serviceLabel].trend = 'up';
      } else if (analytics[serviceLabel].negativeCount > analytics[serviceLabel].positiveCount) {
        analytics[serviceLabel].trend = 'down';
      } else {
        analytics[serviceLabel].trend = 'steady';
      }
    });

    return analytics;
  }, [services, customerBookings, feedbackByService]);

  const insightsLoading = bookingsLoading || feedbackLoading;

  useEffect(() => {
    if (!user || !user.userId) return;
    
    // Initial fetch of notifications
    loadNotifications();
    
    // Connect to socket.io for real-time updates
    const token = localStorage.getItem('token');
    const socket = connectToSocket(user.userId, token);
    
    // Listen for notification events
    socket.on('newNotification', (notification) => {
      console.log('📨 Received new notification:', notification);
      
      // Add new notification to state
      setNotificationsList(prev => [notification, ...prev]);
      
      // Update unread count
      setUnreadCount(prev => prev + 1);
      
      // Optional: Play notification sound
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.play().catch(e => console.log('Audio play prevented:', e));
      } catch (err) {
        console.log('Audio not supported');
      }
    });
    
    // Listen for newly approved services
    socket.on('newServiceApproved', (service) => {
      console.log('🆕 New service approved:', service);
      // Prepend to services list
      setServices(prev => [service, ...prev]);
      // Notify customer about the new service
      const notification = {
        _id: `serviceApproved_${service._id}`,
        message: `New service "${service.name}" is now available.`,
        type: 'serviceApproved',
        data: service,
        read: false,
        timestamp: new Date()
      };
      setNotificationsList(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    // Cleanup on unmount
    return () => {
      const socket = getSocket();
      if (socket) {
        socket.off('newNotification');
        socket.off('newServiceApproved');
      }
    };
  }, [user]);

  // Add function to mark notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      
      // Update local state
      setNotificationsList(prev => 
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
    }
  };
  
  // Add function to mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      
      // Update local state
      setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
      
      // Update unread count
      setUnreadCount(0);
    } catch (error) {
      console.error('❌ Error marking all notifications as read:', error);
    }
  };
  
  if (providersLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
      >
        <CircularProgress size={60} sx={{ color: '#00003f' }} />
      </Box>
    );
  }

  return (
    <CustomerDashboardContainer>
      <EnhancedAppBar
        role="customer"
        user={user}
        onMenuClick={toggleSidebar}
        onLogout={handleLogout}
        title="Customer Dashboard"
        notifications={unreadCount}
        notificationsList={notificationsList}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
      
      <CustomerSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />
      
      <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
        {/* Enhanced Header */}
        <Zoom in timeout={800}>
          <DiscoveryCard sx={{ p: 4, mb: 4, textAlign: 'center' }}>
            <Typography variant="h3" sx={{ 
              color: '#2d3748',
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(45deg, #00003f 30%, #764ba2 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}>
              ✨ Discover Beauty Services
            </Typography>
            <Typography variant="h6" sx={{ 
              color: 'rgba(45, 55, 72, 0.7)', 
              fontWeight: 400,
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6
            }}>
              Find and book premium beauty and wellness experiences from certified professionals
            </Typography>
          </DiscoveryCard>
        </Zoom>

        {error && (
          <Fade in>
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3, 
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(244, 67, 54, 0.15)'
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {/* Enhanced Services Section */}
        <Fade in timeout={1200}>
          <DiscoveryCard sx={{ p: 4, position: 'relative' }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ 
                color: '#2d3748',
                fontWeight: 700,
                mb: 2,
              }}>
                💫 Approved Services
              </Typography>
              <Typography variant="body1" sx={{ 
                color: 'rgba(45, 55, 72, 0.7)', 
                fontSize: '1.1rem',
                maxWidth: '500px',
                margin: '0 auto'
              }}>
                Explore our curated collection of premium beauty services
              </Typography>
            </Box>

            {servicesError && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 3,
                  boxShadow: '0 4px 12px rgba(244, 67, 54, 0.15)'
                }}
              >
                {servicesError}
              </Alert>
            )}

            {servicesLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress size={60} sx={{ color: '#00003f' }} />
              </Box>
            ) : (
              <>
                {/* Filters Panel */}
                <Accordion sx={{ mb: 3 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Filters
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {/* Price Range */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Price Range (LKR)</Typography>
                      <Slider
                        value={priceRange}
                        onChange={(e, val) => setPriceRange(val)}
                        min={0}
                        max={maxPrice}
                        step={Math.max(1, Math.round(maxPrice / 100))}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                    {/* Experience Level */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Experience Level</Typography>
                      <FormGroup row>
                        {experienceLevels.map(level=>(
                          <FormControlLabel
                            key={level}
                            control={
                              <Checkbox
                                checked={expSelection.includes(level)}
                                onChange={()=>setExpSelection(prev=>
                                  prev.includes(level)
                                    ? prev.filter(x=>x!==level)
                                    : [...prev, level]
                                )}
                              />
                            }
                            label={level.charAt(0).toUpperCase()+level.slice(1)}
                          />
                        ))}
                      </FormGroup>
                    </Box>
                    {/* Category */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2">Category</Typography>
                      <FormGroup row>
                        {categories.map(cat=>(
                          <FormControlLabel
                            key={cat}
                            control={
                              <Checkbox
                                checked={catSelection.includes(cat)}
                                onChange={()=>setCatSelection(prev=>
                                  prev.includes(cat)
                                    ? prev.filter(x=>x!==cat)
                                    : [...prev, cat]
                                )}
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
                        {serviceTypes.map(type=>(
                          <FormControlLabel
                            key={type}
                            control={
                              <Checkbox
                                checked={typeSelection.includes(type)}
                                onChange={()=>setTypeSelection(prev=>
                                  prev.includes(type)
                                    ? prev.filter(x=>x!==type)
                                    : [...prev, type]
                                )}
                              />
                            }
                            label={type}
                          />
                        ))}
                      </FormGroup>
                    </Box>
                  </AccordionDetails>
                </Accordion>

                  {insightsLoading && (
                    <Box display="flex" alignItems="center" gap={1.5} sx={{ mb: 3 }}>
                      <CircularProgress size={20} sx={{ color: '#00003f' }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Loading your personalized insights...
                      </Typography>
                    </Box>
                  )}

                  {[bookingsError, feedbackError].filter(Boolean).map((message, index) => (
                    <Alert
                      key={`insight-error-${index}`}
                      severity="warning"
                      sx={{
                        mb: 3,
                        borderRadius: 3,
                        boxShadow: '0 4px 12px rgba(237, 137, 54, 0.15)'
                      }}
                    >
                      {message}
                    </Alert>
                  ))}

                <Grid container spacing={3}>
                  {filteredServices.length === 0 ? (
                    <Grid item xs={12}>
                      <Paper 
                        sx={{ 
                          p: 6, 
                          textAlign: 'center',
                          backgroundColor: 'rgba(102, 126, 234, 0.05)',
                          borderRadius: 4
                        }}
                      >
                        <Typography variant="h5" sx={{ color: '#00003f', fontWeight: 600, mb: 2 }}>
                          🔍 No Services Available
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                          We're working hard to bring you amazing beauty services. Please check back later!
                        </Typography>
                      </Paper>
                    </Grid>
                  ) : (
                    filteredServices.map((svc, index) => {
                      const serviceKeyCandidates = [svc?.name, svc?.serviceName, svc?._id];
                      const serviceInsight = serviceKeyCandidates.reduce((acc, key) => {
                        if (acc) return acc;
                        return key && serviceAnalytics[key] ? serviceAnalytics[key] : null;
                      }, null);
                      const hasFeedback = (serviceInsight?.totalFeedback || 0) > 0;
                      const ratingValue = hasFeedback ? Number(serviceInsight?.avgRating || 0) : 0;
                      const ratingLabel = hasFeedback ? ratingValue.toFixed(1) : 'New';
                      const completionCount = serviceInsight?.completions || 0;
                      const highlight = serviceInsight?.highlight;
                      const trend = serviceInsight?.trend || 'steady';

                      return (
                        <Grid item xs={12} sm={6} md={4} key={svc._id}>
                          <Zoom in timeout={600 + index * 100}>
                            <ServiceCard>
                              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                  <Typography variant="h5" sx={{ 
                                    color: '#2d3748', 
                                    fontWeight: 700,
                                    lineHeight: 1.2
                                  }}>
                                    {svc.name}
                                  </Typography>
                                  <Tooltip title="Save to favorites">
                                    <IconButton size="small" sx={{ color: '#cbd5e0' }}>
                                      <BookmarkIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Box>

                                <Chip 
                                  label={svc.type}
                                  size="small"
                                  sx={{ 
                                    mb: 2,
                                    backgroundColor: 'rgba(79, 172, 254, 0.1)',
                                    color: '#4facfe',
                                    fontWeight: 600
                                  }}
                                />

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <TimeIcon sx={{ mr: 1, color: '#a0aec0', fontSize: 18 }} />
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {formatDuration(svc.duration)}
                                  </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <LocationIcon sx={{ mr: 1, color: '#a0aec0', fontSize: 18 }} />
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {svc.serviceProvider?.businessAddress?.substring(0, 30) || 
                                     svc.serviceProvider?.currentAddress?.substring(0, 30) || 
                                     svc.serviceProvider?.city || 'N/A'}
                                    {((svc.serviceProvider?.businessAddress?.length > 30) || 
                                      (svc.serviceProvider?.currentAddress?.length > 30)) && '...'}
                                  </Typography>
                                </Box>

                                <Box sx={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center',
                                  p: 2,
                                  backgroundColor: 'rgba(102, 126, 234, 0.05)',
                                  borderRadius: 2,
                                  mb: 2
                                }}>
                                  <Typography variant="h5" sx={{ 
                                    color: '#00003f', 
                                    fontWeight: 700
                                  }}>
                                    LKR {svc.basePrice?.toFixed(2) || svc.pricing?.basePrice?.toFixed(2) || 'N/A'}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Rating value={ratingValue} precision={0.1} size="small" readOnly />
                                    <Typography variant="body2" sx={{ color: '#2d3748', fontWeight: 600 }}>
                                      {ratingLabel}
                                    </Typography>
                                  </Box>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                                  <Chip
                                    label={`${completionCount} completed`}
                                    size="small"
                                    sx={{
                                      backgroundColor: 'rgba(72, 187, 120, 0.1)',
                                      color: '#276749',
                                      fontWeight: 600,
                                    }}
                                  />
                                  <Chip
                                    label={hasFeedback ? `${serviceInsight.totalFeedback} feedback` : 'No feedback yet'}
                                    size="small"
                                    sx={{
                                      backgroundColor: 'rgba(66, 153, 225, 0.1)',
                                      color: '#2b6cb0',
                                      fontWeight: 600,
                                    }}
                                  />
                                </Box>

                                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                  {trend === 'up' && (
                                    <Chip
                                      icon={<TrendingUpIcon fontSize="small" />}
                                      label="Feedback trending up"
                                      size="small"
                                      sx={{
                                        backgroundColor: 'rgba(72, 187, 120, 0.16)',
                                        color: '#22543d',
                                        fontWeight: 600,
                                      }}
                                    />
                                  )}
                                  {trend === 'down' && (
                                    <Chip
                                      icon={<TrendingDownIcon fontSize="small" />}
                                      label="Needs attention"
                                      size="small"
                                      sx={{
                                        backgroundColor: 'rgba(245, 101, 101, 0.16)',
                                        color: '#742a2a',
                                        fontWeight: 600,
                                      }}
                                    />
                                  )}
                                  {trend === 'steady' && (
                                    <Chip
                                      icon={<InsightsIcon fontSize="small" />}
                                      label="Sentiment steady"
                                      size="small"
                                      sx={{
                                        backgroundColor: 'rgba(160, 174, 192, 0.16)',
                                        color: '#2d3748',
                                        fontWeight: 600,
                                      }}
                                    />
                                  )}
                                </Box>

                                <Box
                                  sx={{
                                    p: 2,
                                    backgroundColor: 'rgba(118, 75, 162, 0.08)',
                                    borderRadius: 2,
                                    mb: 2,
                                    minHeight: 92,
                                  }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 1,
                                      mb: 1,
                                      color: '#553c9a',
                                      fontWeight: 700,
                                    }}
                                  >
                                    <FormatQuoteIcon fontSize="small" />
                                    Recent feedback
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'text.primary', mb: 0.5 }}>
                                    {highlight?.text || 'No feedback submitted yet. Be the first to share your experience!'}
                                  </Typography>
                                  {highlight?.submittedAt && (
                                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                      {`Received ${formatDistanceToNow(new Date(highlight.submittedAt), { addSuffix: true })}`}
                                    </Typography>
                                  )}
                                </Box>
                              </CardContent>

                              <CardActions 
                                sx={{ 
                                  p: 3, 
                                  pt: 0,
                                  '&.service-actions': {
                                    opacity: 0.8,
                                    transform: 'translateY(4px)',
                                    transition: 'all 0.3s ease'
                                  }
                                }}
                                className="service-actions"
                              >
                                <GradientButton
                                  variant="secondary"
                                  size="small"
                                  fullWidth
                                  onClick={() => handleViewServiceDetails(svc)}
                                  startIcon={<InfoIcon />}
                                  sx={{ mr: 1 }}
                                >
                                  More Details
                                </GradientButton>
                                <GradientButton
                                  variant="primary"
                                  size="small"
                                  fullWidth
                                  onClick={() => navigate(`/customer/book-service/${svc._id}`)}
                                  startIcon={<CalendarIcon />}
                                >
                                  Book Now
                                </GradientButton>
                              </CardActions>
                            </ServiceCard>
                          </Zoom>
                        </Grid>
                      );
                    })
                  )}
                </Grid>
              </>
            )}
          </DiscoveryCard>
        </Fade>
      </Container>

      <ServiceDetailsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        service={selectedService}
        navigate={navigate}
      />

      <Footer />
    </CustomerDashboardContainer>
  );
};

export default CustomerDashboard;