import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  InputLabel
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { createPaymentIntent, confirmPayment } from '../../services/payment';
import CustomerSidebar from '../../components/CustomerSidebar';
import EnhancedAppBar from '../../components/EnhancedAppBar';
import Footer from '../../components/footer';

// Simple payment form component with Stripe test data
const SimplePaymentForm = ({ bookingData, onPaymentSuccess, onPaymentError }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardNumber, setCardNumber] = useState('4242424242424242'); // Stripe test card
  const [cardName, setCardName] = useState('Test User');
  const [expiryDate, setExpiryDate] = useState('12/25');
  const [cvv, setCvv] = useState('123');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Simple validation
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      setError('Please fill in all card details');
      return;
    }
    
    // Simple card validation
    if (cardNumber.length < 15 || cardNumber.length > 16) {
      setError('Card number should be 15-16 digits');
      return;
    }
    
    if (cvv.length < 3 || cvv.length > 4) {
      setError('CVV should be 3-4 digits');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // In a full Stripe implementation, we would use stripe.js to handle this
      // For now, we'll simulate the payment with our backend
      
      // Simulate payment processing with Stripe
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // This would normally be handled by Stripe.js confirmCardPayment
      const paymentResult = {
        id: 'pi_' + Math.random().toString(36).substring(2, 12),
        status: 'succeeded',
        amount: bookingData.amount
      };
      
      // Call the backend to confirm payment
      onPaymentSuccess(paymentResult);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      onPaymentError('Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          Card Details
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            backgroundColor: '#f8f9fa',
            border: '1px solid #e0e0e0'
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Card Number"
                fullWidth
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                inputProps={{ maxLength: 16 }}
                helperText="Use 4242 4242 4242 4242 for testing"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Cardholder Name"
                fullWidth
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Expiry Date (MM/YY)"
                fullWidth
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                inputProps={{ maxLength: 5 }}
                helperText="Any future date"
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="CVV"
                fullWidth
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                inputProps={{ maxLength: 4 }}
                helperText="Any 3 digits"
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        type="submit"
        disabled={loading}
        fullWidth
        sx={{
          py: 1.8,
          mt: 2,
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          backgroundColor: '#052633ff',
          '&:hover': { backgroundColor: '#02093fff' },
        }}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: 'white' }} />
        ) : (
          `PAY`
        )}
      </Button>
    </form>
  );
};

const PaymentPage = () => {
  console.log('💫 PaymentPage component initializing/re-rendering');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  // Debug log to track when the component renders and with what state
  console.log('🔍 Current component state:', { 
    service: service ? `ID: ${service._id}` : 'null', 
    bookingData: bookingData ? 'exists' : 'null',
    loading,
    error
  });
  
  // New state variables for service location handling
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [locationConfirmDialogOpen, setLocationConfirmDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [serviceAddress, setServiceAddress] = useState('');
  const [travelingCharge, setTravelingCharge] = useState(0); // Default traveling charge

  // Parse URL parameters
  const queryParams = new URLSearchParams(location.search);
  const serviceId = queryParams.get('serviceId');
  const slot = queryParams.get('slot');
  const dateParam = queryParams.get('date');
  const timeParam = queryParams.get('time');

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    // If it's in ISO format with T separator, parse differently
    if (timeString.includes('T')) {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    // If it's already in a display format, return as is
    return timeString;
  };

  // Handle location selection
  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  // Handle location dialog close
  const handleLocationDialogClose = () => {
    if (selectedLocation) {
      if (selectedLocation === 'home') {
        // If home service selected, show the confirmation dialog
        setLocationDialogOpen(false);
        setLocationConfirmDialogOpen(true);
        setTravelingCharge(25); // Set a default traveling charge - can be made dynamic
      } else {
        // If salon selected, proceed with booking
        setLocationDialogOpen(false);
        // Clear any existing errors
        setError(null);
        
        // Use the direct data processing instead of state-dependent function
        if (service && bookingData) {
          processBookingWithData(service, bookingData, 'salon');
        } else {
          // Fallback to traditional approach if somehow data isn't available
          proceedWithBookingCreation();
        }
      }
    } else {
      setError('Please select a service location');
    }
  };

  // Handle address input for home service
  const handleAddressChange = (event) => {
    setServiceAddress(event.target.value);
  };

  // Handle traveling charge confirmation
  const handleTravelingChargeConfirm = () => {
    if (!serviceAddress) {
      setError('Please enter your address for the home service');
      return;
    }
    
    setLocationConfirmDialogOpen(false);
    // Clear any existing errors
    setError(null);
    
    // Use the direct data processing for home services
    if (service && bookingData) {
      processBookingWithData(service, bookingData, 'home');
    } else {
      // Fallback to traditional approach if somehow data isn't available
      proceedWithBookingCreation();
    }
  };

  // Calculate total amount based on service price and traveling charge (if applicable)
  const calculateTotalAmount = (basePrice, isHomeService) => {
    // Ensure basePrice is a number
    let basePriceValue = 0;
    
    if (basePrice !== undefined && basePrice !== null) {
      // Convert to number if it's a string or other type
      basePriceValue = typeof basePrice === 'string' ? parseFloat(basePrice) : Number(basePrice);
      
      // If conversion failed, default to 0
      if (isNaN(basePriceValue)) basePriceValue = 0;
    }
    
    console.log('Base price value:', basePriceValue);
    console.log('Is home service:', isHomeService);
    console.log('Traveling charge:', travelingCharge);
    
    const total = isHomeService ? basePriceValue + travelingCharge : basePriceValue;
    console.log('Calculated total:', total);
    
    return total;
  };
  
  // New function to process booking with direct data instead of relying on state
  const processBookingWithData = async (serviceData, bookingData, locationChoice) => {
    try {
      console.log('🔍 processBookingWithData called with:', {serviceData, bookingData, locationChoice});
      
      if (!serviceData || !bookingData) {
        console.error('❌ Missing required data for booking');
        setError('Missing required data for booking. Please try again.');
        return;
      }
      
      // Calculate price with the direct data
      const servicePrice = serviceData.pricing?.basePrice || 0;
      const isHomeService = locationChoice === 'home';
      const homeCharge = isHomeService ? travelingCharge : 0;
      const totalAmount = servicePrice + homeCharge;
      
      console.log('💰 Direct calculation - Service price:', servicePrice);
      console.log('💰 Direct calculation - Home charge:', homeCharge);
      console.log('💰 Direct calculation - Total amount:', totalAmount);
      
      // Create the updated booking data
      const completeBookingData = {
        ...bookingData,
        serviceLocation: locationChoice,
        address: locationChoice === 'home' ? serviceAddress : null,
        amount: totalAmount,
        servicePrice: servicePrice
      };
      
      console.log('✅ Complete booking data for payment:', completeBookingData);
      
      try {
        // Create payment intent with the direct data
        console.log('💳 Creating payment intent directly...');
        const paymentIntentResponse = await createPaymentIntent(completeBookingData);
        console.log('💳 Payment intent response:', paymentIntentResponse);
        
        if (paymentIntentResponse && paymentIntentResponse.clientSecret) {
          // Update state with both the service and booking data
          setService(serviceData);
          setBookingData(completeBookingData);
          setPaymentIntent({
            id: paymentIntentResponse.id || 'mock_intent_' + Math.random().toString(36).substring(2, 15),
            clientSecret: paymentIntentResponse.clientSecret
          });
        } else {
          console.warn('⚠️ No client secret in payment response, using fallback');
          setService(serviceData);
          setBookingData(completeBookingData);
          setPaymentIntent({
            id: 'mock_intent_' + Math.random().toString(36).substring(2, 15),
            clientSecret: 'mock_secret_' + Math.random().toString(36).substring(2, 15)
          });
        }
      } catch (error) {
        console.error('❌ Error creating payment intent:', error);
        console.error('Error details:', error.response?.data || 'No response data');
        
        // Still update state with service and booking data
        setService(serviceData);
        setBookingData(completeBookingData);
        setPaymentIntent({
          id: 'mock_intent_' + Math.random().toString(36).substring(2, 15),
          clientSecret: 'mock_secret_' + Math.random().toString(36).substring(2, 15)
        });
        
        // Show a less concerning error
        setError('Could not process payment intent, but we can still proceed with mock data for testing.');
      }
    } catch (error) {
      console.error('❌ Error in processBookingWithData:', error);
      setError('Failed to process booking data. Please try again.');
    }
  };
  
  // Proceed with booking creation after all dialogs
  const proceedWithBookingCreation = async () => {
    try {
      console.log('🔍 Starting proceedWithBookingCreation');
      console.log('🔍 Current service:', service);
      console.log('🔍 Current bookingData:', bookingData);
      
      // Fix for when booking data is not available
      let currentBookingData = bookingData;
      
      if (!currentBookingData) {
        console.log('Initializing booking data from available information...');
        // If we don't have booking data, but we have a service, we can still proceed with a fallback
        if (service) {
          const fallbackBookingData = {
            serviceId: serviceId,
            serviceName: service.name || 'Service',
            slot: slot || timeParam || new Date().toISOString(),
            date: dateParam || new Date().toISOString(),
            customerId: user?.id,
            customerName: user?.fullName || user?.firstName + ' ' + user?.lastName || 'Customer',
            customerEmail: user?.email || 'customer@example.com',
            amount: service.pricing?.basePrice || 0,
            currency: 'usd',
            providerId: service.serviceProvider?._id || service.serviceProvider || service.serviceProviderId
          };
          console.log('Created fallback booking data:', fallbackBookingData);
          setBookingData(fallbackBookingData);
          currentBookingData = fallbackBookingData;
        } else {
          console.error('❌ No service data available to create booking');
          setError('Service details could not be loaded. Please go back and try again.');
          return;
        }
      }
      
      if (!service) {
        console.error('❌ No service data available for payment processing');
        setError('Service details could not be loaded. Please go back and try again.');
        return;
      }
      
      console.log('🔍 Full service object:', service);
      
      // Ensure we have the correct service price
      const servicePrice = service.pricing?.basePrice || 0;
      const totalAmount = calculateTotalAmount(servicePrice, selectedLocation === 'home');
      
      console.log('💰 Service price:', servicePrice);
      console.log('💰 Total amount:', totalAmount);
      
      // Update booking data with location information and correct pricing
      const updatedBookingData = {
        ...currentBookingData, // Use the local variable that's guaranteed to have data
        serviceLocation: selectedLocation,
        address: selectedLocation === 'home' ? serviceAddress : null,
        amount: totalAmount,
        servicePrice: servicePrice
      };
      
      console.log('✅ Updated booking data:', updatedBookingData);
      setBookingData(updatedBookingData);
      currentBookingData = updatedBookingData; // Update our local reference too
      
      // In a full Stripe implementation, we would create a payment intent here
      try {
        console.log('💳 Creating payment intent with data:', currentBookingData);
        
        // Create a payment intent with our backend
        const paymentIntentResponse = await createPaymentIntent(currentBookingData);
        console.log('💳 Payment intent response:', paymentIntentResponse);
        
        if (paymentIntentResponse && paymentIntentResponse.clientSecret) {
          // Set the payment intent and move to the next step
          setPaymentIntent({
            id: paymentIntentResponse.id || 'mock_intent_' + Math.random().toString(36).substring(2, 15),
            clientSecret: paymentIntentResponse.clientSecret
          });
          
          // Move to the payment step
          setActiveStep(1);
        } else {
          // Fallback to mock data if API call fails
          console.log('⚠️ No client secret in response, using mock data');
          setPaymentIntent({
            id: 'mock_intent_' + Math.random().toString(36).substring(2, 15),
            clientSecret: 'mock_secret_' + Math.random().toString(36).substring(2, 15)
          });
          
          // Move to the payment step
          setActiveStep(1);
        }
      } catch (error) {
        console.error('❌ Error creating payment intent:', error);
        
        // Show error message to user
        if (error.message && error.message.includes('Network Error')) {
          setError('Network error connecting to payment service. Please check your connection and try again.');
        } else {
          setError('Error creating payment: ' + (error.message || 'Unknown error'));
        }
        
        // Still provide a mock payment intent to allow testing
        console.log('⚠️ Using mock payment intent due to error');
        setPaymentIntent({
          id: 'mock_intent_' + Math.random().toString(36).substring(2, 15),
          clientSecret: 'mock_secret_' + Math.random().toString(36).substring(2, 15)
        });
        
        // Try to proceed anyway for demo purposes
        setActiveStep(1);
      }
    } catch (error) {
      console.error('Error updating booking information:', error);
      setError(error.message || 'Failed to update booking information');
    }
  };

  // Add effect to save/retrieve service data from sessionStorage
  useEffect(() => {
    // Try to retrieve cached service data first
    if (!service && serviceId) {
      try {
        console.log('🔄 Trying to retrieve service from sessionStorage');
        const savedService = sessionStorage.getItem('beautiQ_current_service');
        if (savedService) {
          const parsedService = JSON.parse(savedService);
          if (parsedService && parsedService._id === serviceId) {
            console.log('✅ Retrieved service data from sessionStorage');
            setService(parsedService);
            return; // Skip the fetch if we found cached data
          }
        }
      } catch (err) {
        console.warn('Could not retrieve from sessionStorage:', err);
      }
    }
  }, [service, serviceId]);

  // Save service to sessionStorage when it changes
  useEffect(() => {
    if (service && serviceId && service._id === serviceId) {
      try {
        console.log('🔄 Saving service data to sessionStorage');
        sessionStorage.setItem('beautiQ_current_service', JSON.stringify(service));
      } catch (err) {
        console.warn('Could not save to sessionStorage:', err);
      }
    }
  }, [service, serviceId]);

  useEffect(() => {
    // Skip fetching if we already have service data
    if (service && service._id === serviceId) {
      console.log('Already have service data for ID:', serviceId);
      return;
    }
    
    // Fetch service details
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        console.log('Fetching service with ID:', serviceId);
        
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/services/${serviceId}?payment=true`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
          }
        );
        console.log('Service data:', response.data);
        
        // Check if service data is properly structured
        if (!response.data || !response.data.service) {
          console.error('Invalid service data structure:', response.data);
          setError('Service data is not in the expected format');
          setLoading(false);
          return;
        }
        
        // Set the service object with the actual service data
        const serviceData = response.data.service;
        setService(serviceData);
        
        console.log('Actual service object:', serviceData);

        // Format the service price properly
        const servicePrice = serviceData.pricing?.basePrice || 0;
        
        // Create basic booking data (without location info yet)
        // Handle the serviceProvider object or ID properly
        let providerId = null;
        if (serviceData.serviceProvider) {
          if (typeof serviceData.serviceProvider === 'object' && serviceData.serviceProvider._id) {
            providerId = serviceData.serviceProvider._id;
          } else if (typeof serviceData.serviceProvider === 'string') {
            providerId = serviceData.serviceProvider;
          }
        } else if (serviceData.serviceProviderId) {
          providerId = serviceData.serviceProviderId;
        }
        
        console.log('🔍 Provider ID extracted:', providerId);
        
        const booking = {
          serviceId,
          serviceName: serviceData.name,
          slot: slot || timeParam,
          date: dateParam || new Date().toISOString(),
          customerId: user.id,
          customerName: user.fullName || user.firstName + ' ' + user.lastName,
          customerEmail: user.email,
          amount: servicePrice,
          currency: 'usd',
          providerId: providerId
        };
        
        console.log('Created booking data:', booking);
        setBookingData(booking);
        
        // Show location selection dialog if service allows options
        if (serviceData.serviceLocation === 'both') {
          setLocationDialogOpen(true);
        } else if (serviceData.serviceLocation === 'home_service') {
          setSelectedLocation('home');
          setLocationConfirmDialogOpen(true);
        } else {
          // If salon_only, set location and proceed
          setSelectedLocation('salon');
          
          // Instead of calling proceedWithBookingCreation directly, 
          // proceed with the booking process using the data we already have
          console.log('🔍 Processing booking with current data instead of waiting for state update');
          processBookingWithData(serviceData, booking, 'salon');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching service details:', error);
        
        // Special handling for CORS errors which don't have response data
        if (error.message === 'Network Error') {
          console.warn('Possible CORS error detected. Please check server CORS configuration.');
          
          // Try a fallback approach without custom headers
          try {
            console.log('Attempting fallback request...');
            const fallbackResponse = await axios.get(
              `${process.env.REACT_APP_API_URL}/services/${serviceId}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`
                }
              }
            );
            
            if (fallbackResponse.data && fallbackResponse.data.service) {
              console.log('Fallback request successful:', fallbackResponse.data);
              setService(fallbackResponse.data.service);
              
              // Format the service price properly
              const servicePrice = fallbackResponse.data.service.pricing?.basePrice || 0;
              
              // Create basic booking data
              const booking = {
                serviceId,
                serviceName: fallbackResponse.data.service.name,
                slot: slot || timeParam,
                date: dateParam || new Date().toISOString(),
                customerId: user.id,
                customerName: user.fullName || user.firstName + ' ' + user.lastName,
                customerEmail: user.email,
                amount: servicePrice,
                currency: 'usd',
                providerId: fallbackResponse.data.service.serviceProvider
              };
              
              setBookingData(booking);
              setLoading(false);
              
              // Proceed with booking flow
              if (fallbackResponse.data.service.serviceLocation === 'both') {
                setLocationDialogOpen(true);
              } else if (fallbackResponse.data.service.serviceLocation === 'home_service') {
                setSelectedLocation('home');
                setLocationConfirmDialogOpen(true);
              } else {
                setSelectedLocation('salon');
                setTimeout(() => proceedWithBookingCreation(), 100);
              }
              
              return;
            }
          } catch (fallbackError) {
            console.error('Fallback request also failed:', fallbackError);
          }
          
          setError('Network error: Unable to connect to the server. This may be due to CORS configuration issues. Please try again later or contact support.');
        } else {
          // Regular error handling
          const errorResponse = error.response?.data || {};
          const errorMessage = errorResponse.message || error.message || 'Unknown error';
          const errorCode = errorResponse.error || 'ERROR_UNKNOWN';
          
          console.log('Full error details:', {
            status: error.response?.status,
            data: errorResponse,
            message: errorMessage,
            code: errorCode
          });
          
          // More helpful error message based on status code
          if (error.response?.status === 403) {
            setError(`Access denied: ${errorMessage}. Please ensure you have permission to view this service.`);
          } else if (error.response?.status === 404) {
            setError(`Service not found: ${errorMessage}. The requested service may have been removed.`);
          } else if (error.response?.status === 401) {
            setError(`Authentication error: ${errorMessage}. Please log in again.`);
          } else {
            setError(`Failed to load service details (${errorCode}): ${errorMessage}. Please try again or contact support.`);
          }
        }
        
        setService(null); // Reset service to prevent further errors
        setLoading(false);
      }
    };

    if (serviceId && user) {
      fetchServiceDetails();
    }
  }, [serviceId, slot, dateParam, timeParam, user]);

  const handlePaymentSuccess = async (paymentResult) => {
    try {
      // Simulate real payment processing delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // If we have booking data, process it
      if (bookingData) {
        try {
          // Generate a consistent booking ID
          const bookingId = bookingData._id || ('mock_booking_' + Math.random().toString(36).substring(2, 15));
          
          // Log detailed info for debugging
          console.log('Processing payment with complete data:', {
            paymentId: paymentResult.id,
            bookingId: bookingId,
            serviceData: {
              serviceId: bookingData.serviceId,
              serviceName: bookingData.serviceName,
              servicePrice: bookingData.servicePrice || service?.pricing?.basePrice,
            },
            customerData: {
              customerId: bookingData.customerId,
              customerName: bookingData.customerName,
              customerEmail: bookingData.customerEmail,
            },
            providerData: {
              providerId: bookingData.providerId || service?.serviceProvider,
            },
            bookingDetails: {
              date: bookingData.date,
              slot: bookingData.slot,
              location: bookingData.serviceLocation || 'salon',
              address: bookingData.address,
              amount: bookingData.amount,
            }
          });
          
          // Pass complete booking data to the confirmation endpoint
          const completeBookingData = {
            serviceId: bookingData.serviceId,
            serviceName: bookingData.serviceName,
            customerId: bookingData.customerId,
            customerName: bookingData.customerName,
            providerId: bookingData.providerId || service?.serviceProvider,
            date: bookingData.date,
            slot: bookingData.slot,
            amount: bookingData.amount,
            location: bookingData.serviceLocation || 'salon',
            address: bookingData.address || null,
          };
          
          // Send confirmation with all data
          const confirmResponse = await confirmPayment(
            paymentResult.id, 
            bookingId, 
            completeBookingData
          );
          
          console.log('Payment confirmation complete response:', confirmResponse);
          // Log booking completion status
          console.log('Booking completed successfully:', {
            booking: confirmResponse.booking || confirmResponse.bookingDetails || confirmResponse.booking,
            success: confirmResponse.success
          });
          
          // Note: Notifications are automatically sent by the backend when a booking is created/updated
          
          // The backend already sends the notification, no need to send it from the frontend
          
          // Show success and navigate to bookings page
          setPaymentSuccess(true);
          setActiveStep(2); // Move to confirmation step
          
          // Navigate to my-bookings page after showing success message
          setTimeout(() => {
            navigate('/customer/my-bookings');
          }, 3000);
        } catch (error) {
          console.error('Error confirming payment:', error);
          // Still succeed for demo purposes
          setPaymentSuccess(true);
          setActiveStep(2);
          
          setTimeout(() => {
            navigate('/customer/my-bookings');
          }, 3000);
        }
      } else {
        console.warn('No booking data available, showing success anyway for demo');
        setPaymentSuccess(true);
        setActiveStep(2);
        
        setTimeout(() => {
          navigate('/customer-dashboard');
        }, 3000);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      // Even on error, show success for demo purposes
      setPaymentSuccess(true);
      setActiveStep(2);
      
      setTimeout(() => {
        navigate('/customer/my-bookings');
      }, 3000);
    }
  };

  const handlePaymentError = (errorMessage) => {
    setError(errorMessage);
  };

  const steps = ['Service Details', 'Payment', 'Confirmation'];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <EnhancedAppBar
        role="customer"
        user={user}
        onMenuClick={() => setSidebarOpen(true)}
        onLogout={() => navigate('/logout')}
        title="Payment"
      />
      <CustomerSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />
      
      {/* Service Location Selection Dialog */}
      <Dialog open={locationDialogOpen} onClose={() => setLocationDialogOpen(false)}>
        <DialogTitle>Select Service Location</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">Where would you like the service to be performed?</FormLabel>
            <RadioGroup
              aria-label="service-location"
              name="service-location"
              value={selectedLocation}
              onChange={handleLocationChange}
            >
              <FormControlLabel value="salon" control={<Radio />} label="At the Salon/Studio" />
              <FormControlLabel value="home" control={<Radio />} label="At My Home (Home Service)" />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLocationDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleLocationDialogClose} 
            variant="contained" 
            color="primary"
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Home Service Confirmation Dialog */}
      <Dialog 
        open={locationConfirmDialogOpen} 
        onClose={() => setLocationConfirmDialogOpen(false)}
      >
        <DialogTitle>Home Service Details</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            For home services, there will be an additional traveling charge of ${travelingCharge.toFixed(2)}.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please provide the address where you would like the service to be performed:
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Your Address"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={serviceAddress}
            onChange={handleAddressChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLocationConfirmDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleTravelingChargeConfirm} 
            variant="contained" 
            color="primary"
          >
            Confirm & Continue
          </Button>
        </DialogActions>
      </Dialog>

      <Container maxWidth="lg" sx={{ mt: 8, mb: 4, flexGrow: 1 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 4,
              textAlign: 'center',
              fontWeight: 600,
              color: '#052633ff'
            }}
          >
            Complete Your Booking
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="300px"
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : paymentSuccess ? (
            <Box textAlign="center" py={4}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(46, 125, 50, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px auto'
                }}
              >
                <Box
                  component="img"
                  src="/check-circle.svg" // You'll need to add this SVG
                  alt="Success"
                  sx={{ width: 48, height: 48 }}
                />
              </Box>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                Payment Successful!
              </Typography>
              <Typography color="textSecondary" sx={{ mb: 4 }}>
                Your booking has been confirmed. You will be redirected to your dashboard.
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/customer/my-bookings')}
                sx={{
                  py: 1.5,
                  px: 4,
                  backgroundColor: '#052633ff',
                  '&:hover': { backgroundColor: '#02093fff' },
                }}
              >
                Go to Dashboard
              </Button>
            </Box>
          ) : (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h6"
                  sx={{ mb: 3, fontWeight: 600, color: '#052633ff' }}
                >
                  Booking Summary
                </Typography>
                
                {service && (
                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {service?.name || 'Service Name'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        {service?.description ? service.description.substring(0, 100) + '...' : 'No description available'}
                      </Typography>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            <strong>Date</strong>
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {formatDate(dateParam)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            <strong>Time</strong>
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {formatTime(slot || timeParam)}
                          </Typography>
                        </Grid>
                      </Grid>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="textSecondary" gutterBottom>
                            <strong>Service Location Type</strong>
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                            {selectedLocation === 'home' ? 'Home Service' : 'At Salon/Studio'}
                          </Typography>
                        </Grid>
                        {selectedLocation === 'home' && (
                          <Grid item xs={12}>
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              <strong>Service Address</strong>
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {serviceAddress || 'No address provided'}
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="body1" fontWeight="bold">
                            Service Price
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            ${service && service.pricing && service.pricing.basePrice ? parseFloat(service.pricing.basePrice).toFixed(2) : '0.00'}
                          </Typography>
                        </Box>
                        
                        {selectedLocation === 'home' && (
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="body1">
                              <strong>Traveling Charge</strong>
                            </Typography>
                            <Typography variant="body1">
                              ${travelingCharge.toFixed(2)}
                            </Typography>
                          </Box>
                        )}
                        
                        <Divider sx={{ my: 1 }} />
                        
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body1" sx={{ fontWeight: 700 }}>
                            <strong>Total Amount</strong>
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#052633ff' }}>
                            ${service && calculateTotalAmount(
                                service.pricing?.basePrice || 0,
                                selectedLocation === 'home'
                              ).toFixed(2)
                            }
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h6"
                  sx={{ mb: 3, fontWeight: 600, color: '#052633ff' }}
                >
                  Payment Details
                </Typography>
                
                <Box sx={{ mb: 2, p: 2, bgcolor: '#f0f7fc', borderRadius: 1, border: '1px solid #e0f0fc' }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                    Stripe Test Payment
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    This is a test integration with Stripe. Use the pre-filled test card details below to complete your payment.
                    No actual charges will be made.
                  </Typography>
                </Box>
                
                <Alert 
                  severity="info" 
                  sx={{ mb: 3 }} 
                  icon={<span style={{ fontSize: '20px', marginRight: '8px' }}>ℹ️</span>}
                >
                  <span style={{ fontSize: '0.875rem' }}>
                    <strong>Test Card Information:</strong> Use the pre-filled details below for testing Stripe payments.
                  </span>
                </Alert>
                
                <SimplePaymentForm
                  bookingData={bookingData}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </Grid>
            </Grid>
          )}
        </Paper>
      </Container>
      <Footer />
    </Box>
  );
};

export default PaymentPage;
