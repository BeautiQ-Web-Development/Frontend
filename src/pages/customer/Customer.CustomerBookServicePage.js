import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Container, Typography, TextField, Button, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Paper, Grid, Divider, IconButton,
  Snackbar, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker }         from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns }     from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { Slide } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// NEW: bring in your common header/footer (and auth if needed)
// import Header from '../../components/Header';
import CustomerSidebar from '../../components/CustomerSidebar';
import Footer from '../../components/footer';
import { useAuth } from '../../context/AuthContext';

const CustomerBookServicePage = () => {
  const { serviceId } = useParams();
  const navigate      = useNavigate();
  const location      = useLocation();
  const params        = new URLSearchParams(location.search);
  const bookingId     = params.get('bookingId');
  const { logout, user } = useAuth();  // get user for sidebar

  const [date, setDate]             = useState(null);
  const [dateError, setDateError]   = useState('');         // NEW: track Sunday error
  const [slots, setSlots]           = useState([]);
  const [loadingSlots, setLoading]  = useState(false);
  const [selected, setSelected]     = useState('');
  const [error, setError]           = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headsUpOpen, setHeadsUpOpen] = useState(true);
  const [toast, setToast]           = useState({ open: false, message: '', severity: 'info' });
  const [pastDateDialogOpen, setPastDateDialogOpen] = useState(false);

  const timeSlots = [
    '08:00 AM','09:00 AM','10:00 AM','11:00 AM',
    '12:00 PM','01:00 PM','02:00 PM','03:00 PM',
    '04:00 PM','05:00 PM'
  ];

  const handleDateChange = (newDate) => {
    // Even though the DatePicker will now prevent past date selection with disablePast,
    // we'll keep this validation for consistency and safety
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for proper comparison
    
    if (newDate && newDate < today) {
      // Show dialog for past date selection but DON'T update the date state
      setPastDateDialogOpen(true);
      return; // Don't update date - this prevents API call and time slot display
    }
    
    // Only update date state for today or future dates
    setDateError('');
    setDate(newDate);
    setSelected('');
  };

  // Handle closing toast
  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToast({ ...toast, open: false });
  };

  useEffect(() => {
    // If rescheduling, preload booking data
    if (bookingId) {
      console.log('Rescheduling booking:', bookingId);
      axios.get(`${process.env.REACT_APP_API_URL}/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => {
        const b = res.data.booking || res.data;
        console.log('Loaded booking for reschedule:', b);
        setDate(new Date(b.bookingDate));
        setSelected(b.bookingTime);
      })
      .catch(err => console.error('Error loading booking for reschedule:', err));
    }
    // Only fetch slots if we have a valid date (not past date)
    if (!date) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Double-check: don't fetch slots for past dates
    if (date < today) {
      setSlots([]);
      return;
    }
    
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/services/${serviceId}/available-slots`, {
        params: { date: date.toISOString().slice(0,10) }
      })
      .then(res => { setSlots(res.data.available); setError(''); })
      .catch(() => setError('Failed to load slots'))
      .finally(() => setLoading(false));
  }, [date, serviceId]);     // added dateError

  const openConfirm = () => setConfirmOpen(true);
  const closeConfirm = () => setConfirmOpen(false);
  const proceedToPayment = () => {
    closeConfirm();
    navigate(`/customer/payment?serviceId=${serviceId}&slot=${encodeURIComponent(selected)}&date=${encodeURIComponent(date.toISOString())}`);
  };

  const handleProceed = () => {
    if (!date || !selected) {
      setToast({ open: true, message: 'Select both date and time', severity: 'warning' });
      return;
    }
    // pass date/time to payment or next step
    navigate(`/customer/payment?serviceId=${serviceId}&date=${date.toISOString()}&slot=${encodeURIComponent(selected)}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CustomerSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />
     <Dialog 
  open={headsUpOpen} 
  onClose={() => setHeadsUpOpen(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 3,
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      overflow: 'visible'
    }
  }}
>
  <DialogTitle 
    sx={{ 
      m: 0, 
      p: 3, 
      background: 'linear-gradient(135deg, #02093fff 0%, #052633ff 100%)',
      color: 'white',
      position: 'relative',
      textAlign: 'center',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: -10,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 20,
        height: 20,
        backgroundColor: '#030f4eff',
        borderRadius: '50%',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
      <Box
        sx={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 'bold'
        }}
      >
        ⚠️
      </Box>
      <Typography variant="h6" component="div" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
        Important Notice
      </Typography>
    </Box>
    <IconButton
      aria-label="close"
      onClick={() => setHeadsUpOpen(false)}
      sx={{ 
        position: 'absolute', 
        right: 12, 
        top: 12, 
        color: 'rgba(255,255,255,0.9)',
        backgroundColor: 'rgba(255,255,255,0.1)',
        '&:hover': { 
          backgroundColor: 'rgba(255,255,255,0.2)',
          transform: 'scale(1.1)'
        },
        transition: 'all 0.2s ease'
      }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  
  <DialogContent 
    dividers={false}
    sx={{ 
      p: 0,
      backgroundColor: '#f8f9fa'
    }}
  >
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: '#fff3cd',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px auto',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          fontSize: '32px'
        }}
      >
        🔒
      </Box>
      
      <Typography 
        variant="h6" 
        sx={{ 
          color: '#1c79d6ff',
          fontWeight: 600,
          mb: 2,
          fontSize: '1.1rem'
        }}
      >
        Booking Policy
      </Typography>
      
      <Typography 
        variant="body1" 
        sx={{ 
          color: '#5a6c7d',
          lineHeight: 1.7,
          fontSize: '0.95rem',
          mb: 3
        }}
      >
        Once you reserve a slot, changes or refunds aren't possible. Be sure of your choice.
      </Typography>

      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          p: 2.5,
          border: '1px solid #e9ecef',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#6c757d',
            fontSize: '0.85rem',
            fontStyle: 'italic',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1
          }}
        >
          <span>💡</span>
          Please review your selection carefully before confirming
        </Typography>
      </Box>
    </Box>
  </DialogContent>
  
  <DialogActions 
    sx={{ 
      p: 3,
      backgroundColor: '#f8f9fa',
      borderTop: '1px solid #e9ecef',
      justifyContent: 'center'
    }}
  >
    <Button 
      onClick={() => setHeadsUpOpen(false)}
      variant="contained"
      size="large"
      sx={{
        minWidth: 140,
        borderRadius: 25,
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '1rem',
        background: 'linear-gradient(135deg, #3a58dfff 0%, #0c175eff 100%)',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
        '&:hover': {
          background: 'linear-gradient(135deg, #5860aaff 0%, #152aaeff 100%)',
          boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
          transform: 'translateY(-1px)'
        },
        transition: 'all 0.3s ease'
      }}
    >
      I Understand
    </Button>
  </DialogActions>
</Dialog>
      <Box sx={{ flexGrow: 1, pt: 0, pb: 4 }}>
        {/* Page Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, height: 75, backgroundColor: '#003047', color: '#fff', position: 'sticky', top: 0, zIndex: theme => theme.zIndex.appBar }}>
          <IconButton onClick={() => setSidebarOpen(true)} sx={{ color: 'common.white' }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight="bold" sx={{ color: 'common.white' }}>
            Choose Your Time Slot
          </Typography>
          <Button variant="outlined" onClick={logout} sx={{ borderColor: 'rgba(255,255,255,0.7)', color: '#fff' }}>
            Logout
          </Button>
        </Box>

<Container maxWidth="sm">
  <Paper 
    elevation={0} 
    sx={{ 
      p: 0, 
      mt: 2, 
      borderRadius: 4,
      background: 'linear-gradient(135deg, rgba(0, 31, 63, 0.02) 0%, rgba(0, 48, 71, 0.05) 100%)',
      border: '1px solid rgba(0, 31, 63, 0.12)',
      overflow: 'hidden',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: 'linear-gradient(90deg, #003047 0%, #001f3f 50%, #003047 100%)'
      }
    }}
  >
    {/* Header Section */}
    <Box sx={{ 
      p: 4, 
      pb: 2,
      background: 'linear-gradient(135deg, rgba(0, 31, 63, 0.08) 0%, rgba(0, 48, 71, 0.12) 100%)',
      borderBottom: '1px solid rgba(0, 31, 63, 0.15)',
      textAlign: 'center',
      position: 'relative'
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 2, 
        mb: 2 
      }}>
        <Box sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #003047 0%, #001f3f 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '20px'
        }}>
          📅
        </Box>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #003047 0%, #001f3f 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '1.8rem', sm: '2.125rem' }
          }}
        >
          Select Date & Time
        </Typography>
      </Box>
      <Typography 
        variant="body2" 
        sx={{ 
          color: 'rgba(0, 31, 63, 0.7)',
          fontSize: '0.9rem',
          fontWeight: 500
        }}
      >
        Choose your preferred appointment slot
      </Typography>
    </Box>

    {/* Date Section */}
    <Box sx={{ p: 4, pb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1.5, 
        mb: 3,
        color: 'rgba(0, 31, 63, 0.8)'
      }}>
        <CalendarTodayIcon sx={{ fontSize: 20 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
          Select Date
        </Typography>
      </Box>
      
      <Box sx={{
        backgroundColor: 'white',
        borderRadius: 3,
        p: 2.5,
        border: '1px solid rgba(0, 31, 63, 0.15)',
        boxShadow: '0 4px 12px rgba(0, 31, 63, 0.08)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'linear-gradient(90deg, transparent 0%, rgba(0, 31, 63, 0.3) 50%, transparent 100%)',
          borderRadius: '3px 3px 0 0'
        }
      }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Pick a date"
            value={date}
            onChange={handleDateChange}
            disablePast={true}  // This will disable all past dates
            slots={{ textField: TextField }}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: 'normal',
                error: Boolean(dateError),
                helperText: dateError,
                sx: {
                  mt: 0,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(0, 31, 63, 0.02)',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 31, 63, 0.4)'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#003047'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#003047'
                  }
                }
              }
            }}
          />
        </LocalizationProvider>
      </Box>
    </Box>

    <Divider sx={{ 
      borderColor: 'rgba(0, 31, 63, 0.15)', 
      borderWidth: 1,
      mx: 4
    }} />

    {/* Time Section */}
    <Box sx={{ p: 4, pt: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1.5, 
        mb: 3,
        color: 'rgba(0, 31, 63, 0.8)'
      }}>
        <AccessTimeIcon sx={{ fontSize: 20 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
          Available Time Slots
        </Typography>
      </Box>

      <Box sx={{
        backgroundColor: 'white',
        borderRadius: 3,
        p: 2.5,
        border: '1px solid rgba(0, 31, 63, 0.15)',
        boxShadow: '0 4px 12px rgba(0, 31, 63, 0.08)',
        minHeight: 120
      }}>
        {loadingSlots ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}>
            <CircularProgress 
              sx={{ color: '#003047' }}
              size={32}
            />
            <Typography variant="body2" sx={{ color: 'rgba(0, 31, 63, 0.6)' }}>
              Loading available slots...
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2} sx={{ maxHeight: 200, overflowY: 'auto' }}>
            {slots.map(s => (
              <Grid item xs={6} sm={4} key={s}>
                <Button
                  fullWidth
                  variant={s === selected ? 'contained' : 'outlined'}
                  onClick={() => setSelected(s)}
                  sx={{ 
                    py: 2.5,
                    borderRadius: 2.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    ...(s === selected ? {
                      background: 'linear-gradient(135deg, #003047 0%, #001f3f 100%)',
                      boxShadow: '0 4px 12px rgba(0, 31, 63, 0.3)',
                      transform: 'translateY(-2px)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #002a3d 0%, #001a36 100%)',
                        boxShadow: '0 6px 16px rgba(0, 31, 63, 0.4)'
                      }
                    } : {
                      borderColor: 'rgba(0, 31, 63, 0.3)',
                      color: 'rgba(0, 31, 63, 0.8)',
                      backgroundColor: 'rgba(0, 31, 63, 0.02)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 31, 63, 0.08)',
                        borderColor: 'rgba(0, 31, 63, 0.5)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 2px 8px rgba(0, 31, 63, 0.15)'
                      }
                    })
                  }}
                >
                  {new Date(s).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Button>
              </Grid>
            ))}
          </Grid>
        )}

        {/* No slots info */}
        {!loadingSlots && date && slots.length === 0 && (
          <Alert 
            severity="info" 
            sx={{ 
              backgroundColor: 'rgba(0, 31, 63, 0.05)',
              border: '1px solid rgba(0, 31, 63, 0.2)',
              borderRadius: 2,
              '& .MuiAlert-icon': {
                color: '#003047'
              },
              '& .MuiAlert-message': {
                color: 'rgba(0, 31, 63, 0.8)'
              }
            }}
          >
            No available slots for selected date. Please choose another date.
          </Alert>
        )}

        {/* Message when no date is selected */}
        {!date && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            color: 'rgba(0, 31, 63, 0.6)'
          }}>
            <CalendarTodayIcon sx={{ fontSize: 48, opacity: 0.5 }} />
            <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
              Please select a date to view available time slots
            </Typography>
          </Box>
        )}
      </Box>
    </Box>

    {/* Action Buttons */}
    <Box sx={{ 
      p: 4, 
      pt: 2,
      background: 'linear-gradient(135deg, rgba(0, 31, 63, 0.02) 0%, rgba(0, 48, 71, 0.05) 100%)',
      borderTop: '1px solid rgba(0, 31, 63, 0.1)'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/customer-dashboard')}
          sx={{
            borderRadius: 3,
            px: 3,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            borderColor: 'rgba(0, 31, 63, 0.3)',
            color: 'rgba(0, 31, 63, 0.7)',
            '&:hover': {
              borderColor: 'rgba(0, 31, 63, 0.5)',
              backgroundColor: 'rgba(0, 31, 63, 0.05)'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!selected}
          onClick={openConfirm}
          sx={{ 
            flexGrow: 1,
            borderRadius: 3,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            background: !selected 
              ? 'rgba(0, 31, 63, 0.3)' 
              : 'linear-gradient(135deg, #003047 0%, #001f3f 100%)',
            boxShadow: !selected 
              ? 'none' 
              : '0 4px 12px rgba(0, 31, 63, 0.3)',
            '&:hover': {
              background: !selected 
                ? 'rgba(0, 31, 63, 0.3)' 
                : 'linear-gradient(135deg, #002a3d 0%, #001a36 100%)',
              boxShadow: !selected 
                ? 'none' 
                : '0 6px 16px rgba(0, 31, 63, 0.4)',
              transform: !selected ? 'none' : 'translateY(-1px)'
            },
            '&.Mui-disabled': {
              color: 'rgba(255, 255, 255, 0.5)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          {!selected ? 'Select a time slot' : 'Proceed to Payment'}
        </Button>
      </Box>
    </Box>

   {/* Enhanced Confirm Dialog */}
<Dialog 
  open={confirmOpen} 
  onClose={closeConfirm}
  maxWidth="sm"
  fullWidth
  TransitionComponent={Slide}
  TransitionProps={{ direction: 'up' }}
  PaperProps={{
    sx: {
      borderRadius: 4,
      boxShadow: '0 24px 48px rgba(15, 37, 64, 0.25)',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    }
  }}
>
  <DialogTitle 
    sx={{ 
      m: 0, 
      p: 0,
      background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2544 100%)',
      color: 'white',
      position: 'relative',
      textAlign: 'center',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at top right, rgba(255,255,255,0.15) 0%, transparent 50%)',
        pointerEvents: 'none'
      }
    }}
  >
    <Box sx={{ p: 4, position: 'relative', zIndex: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, mb: 0 }}>
        <Box
          sx={{
            width: 48,
            height: 8,
            borderRadius: '10%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 28, color: 'white' }} />
        </Box>
        <Typography variant="h5" component="div" sx={{ fontWeight: 700, fontSize: '1.4rem' , color : '#f7f8f9ff'}}>
          Confirm Booking
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.9rem' }}>
        Please review your appointment details
      </Typography>
    </Box>
    
    <IconButton
      aria-label="close"
      onClick={closeConfirm}
      sx={{ 
        position: 'absolute', 
        right: 16, 
        top: 16, 
        color: 'rgba(255,255,255,0.9)',
        backgroundColor: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(10px)',
        '&:hover': { 
          backgroundColor: 'rgba(255,255,255,0.25)',
          transform: 'scale(1.05)'
        },
        transition: 'all 0.2s ease'
      }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>
  
  <DialogContent sx={{ p: 0, backgroundColor: '#f8fafc' }}>
    <Box sx={{ p: 5, textAlign: 'center' }}>
      {/* Main Content Card */}
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 4,
          p: 4,
          border: '1px solid rgba(30, 58, 95, 0.15)',
          boxShadow: '0 8px 20px rgba(15, 37, 64, 0.1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, #1e3a5f 0%, #0f2544 100%)'
          }
        }}
      >
        {/* Success Icon */}
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
            boxShadow: '0 8px 16px rgba(76, 175, 80, 0.2)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.2) 0%, transparent 100%)',
              animation: 'pulse 2s infinite'
            }
          }}
        >
          ✅
        </Box>
        
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#1e3a5f',
            fontWeight: 700,
            mb: 3,
            fontSize: '1.3rem'
          }}
        >
          Almost There!
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#64748b',
            fontSize: '1rem',
            mb: 4,
            lineHeight: 1.6
          }}
        >
          You're about to confirm your appointment. Please verify the details below:
        </Typography>

        {/* Appointment Details */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2.5,
          backgroundColor: 'rgba(30, 58, 95, 0.04)',
          borderRadius: 3,
          p: 3,
          border: '1px solid rgba(30, 58, 95, 0.1)'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: 'white',
            borderRadius: 2,
            border: '1px solid rgba(30, 58, 95, 0.08)',
            boxShadow: '0 2px 8px rgba(15, 37, 64, 0.05)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2544 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CalendarTodayIcon sx={{ color: 'white', fontSize: 18 }} />
              </Box>
              <Typography sx={{ fontWeight: 600, color: '#1e3a5f', fontSize: '0.95rem' }}>
                Date
              </Typography>
            </Box>
            <Typography sx={{ color: '#64748b', fontWeight: 600, fontSize: '1rem' }}>
              {date?.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '12px 16px',
            backgroundColor: 'white',
            borderRadius: 2,
            border: '1px solid rgba(30, 58, 95, 0.08)',
            boxShadow: '0 2px 8px rgba(15, 37, 64, 0.05)'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2544 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <AccessTimeIcon sx={{ color: 'white', fontSize: 18 }} />
              </Box>
              <Typography sx={{ fontWeight: 600, color: '#1e3a5f', fontSize: '0.95rem' }}>
                Time
              </Typography>
            </Box>
            <Typography sx={{ color: '#64748b', fontWeight: 600, fontSize: '1rem' }}>
              {new Date(selected).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Warning Notice */}
      <Box
        sx={{
          mt: 3,
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          borderRadius: 3,
          p: 2.5,
          border: '1px solid rgba(255, 193, 7, 0.3)',
          position: 'relative'
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: '#856404',
            fontSize: '0.85rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5
          }}
        >
          <Box sx={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: '#fff3cd',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px'
          }}>
            ⚠️
          </Box>
          Remember: No changes or refunds after confirmation
        </Typography>
      </Box>
    </Box>
  </DialogContent>
  
  <DialogActions 
    sx={{ 
      p: 4,
      backgroundColor: '#f8fafc',
      borderTop: '1px solid rgba(30, 58, 95, 0.1)',
      justifyContent: 'space-between',
      gap: 3
    }}
  >
    <Button 
      onClick={closeConfirm}
      variant="outlined"
      size="large"
      sx={{
        borderRadius: 25,
        px: 4,
        py: 1.5,
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '1rem',
        borderColor: 'rgba(30, 58, 95, 0.3)',
        color: 'rgba(30, 58, 95, 0.7)',
        minWidth: 120,
        '&:hover': {
          borderColor: 'rgba(30, 58, 95, 0.5)',
          backgroundColor: 'rgba(30, 58, 95, 0.05)',
          transform: 'translateY(-1px)'
        },
        transition: 'all 0.3s ease'
      }}
    >
      Cancel
    </Button>
    <Button 
      onClick={proceedToPayment} 
      variant="contained"
      size="large"
      sx={{
        borderRadius: 25,
        px: 5,
        py: 1.5,
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '1.1rem',
        minWidth: 200,
        background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2544 100%)',
        boxShadow: '0 6px 16px rgba(15, 37, 64, 0.4)',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          background: 'linear-gradient(135deg, #2d4a70 0%, #1a2f4f 100%)',
          boxShadow: '0 8px 20px rgba(15, 37, 64, 0.5)',
          transform: 'translateY(-2px)'
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transition: 'left 0.5s',
        },
        '&:hover::before': {
          left: '100%'
        },
        transition: 'all 0.3s ease'
      }}
    >
      Proceed to Payment
    </Button>
  </DialogActions>

  <style jsx>{`
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `}</style>
</Dialog>


  </Paper>
  {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
</Container>
      </Box>
      <Footer/>

      {/* Toast Notification - THIS WAS MISSING! */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseToast} 
          severity={toast.severity} 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '& .MuiAlert-message': {
              fontSize: '0.95rem',
              fontWeight: 500
            }
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

      {/* Past Date Warning Dialog */}
      <Dialog 
        open={pastDateDialogOpen} 
        onClose={() => setPastDateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: '0 20px 40px rgba(220, 53, 69, 0.25)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            m: 0, 
            p: 3, 
            background: 'linear-gradient(135deg, #dc3545 0%, #b02a37 100%)',
            color: 'white',
            position: 'relative',
            textAlign: 'center'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}
            >
              ⚠️
            </Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600, fontSize: '1.2rem' }}>
              Invalid Date Selection
            </Typography>
          </Box>
          <IconButton
            aria-label="close"
            onClick={() => setPastDateDialogOpen(false)}
            sx={{ 
              position: 'absolute', 
              right: 12, 
              top: 12, 
              color: 'rgba(255,255,255,0.9)',
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.2)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent 
          sx={{ 
            p: 0,
            backgroundColor: '#f8f9fa'
          }}
        >
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: '#ffe6e6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto',
                boxShadow: '0 8px 16px rgba(220, 53, 69, 0.2)',
                fontSize: '32px'
              }}
            >
              📅
            </Box>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#dc3545',
                fontWeight: 600,
                mb: 2,
                fontSize: '1.1rem'
              }}
            >
              Past Date Not Allowed
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#5a6c7d',
                lineHeight: 1.7,
                fontSize: '1rem',
                mb: 3,
                fontWeight: 500
              }}
            >
              <strong>You have selected a past date. Please choose a date from today or an upcoming date.</strong>
            </Typography>

            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: 3,
                p: 3,
                border: '1px solid rgba(220, 53, 69, 0.2)',
                boxShadow: '0 2px 8px rgba(220, 53, 69, 0.1)'
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#6c757d',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1.5
                }}
              >
                <span>💡</span>
                Please select today's date or any future date to proceed
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        
        <DialogActions 
          sx={{ 
            p: 3,
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #e9ecef',
            justifyContent: 'center'
          }}
        >
          <Button 
            onClick={() => setPastDateDialogOpen(false)}
            variant="contained"
            size="large"
            sx={{
              minWidth: 140,
              borderRadius: 25,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #dc3545 0%, #b02a37 100%)',
              boxShadow: '0 4px 12px rgba(220, 53, 69, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #c82333 0%, #a02631 100%)',
                boxShadow: '0 6px 16px rgba(220, 53, 69, 0.5)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            I Understand
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerBookServicePage;