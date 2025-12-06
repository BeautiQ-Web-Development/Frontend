import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Rating,
  TextField,
  Typography,
} from '@mui/material';

const formatDateTime = (value, bookingDate, bookingTime) => {
  // If we have separate bookingDate and bookingTime, combine them
  if (bookingDate) {
    try {
      const dateStr = new Date(bookingDate).toLocaleDateString();
      const timeStr = bookingTime || '';
      return timeStr ? `${dateStr} • ${timeStr}` : dateStr;
    } catch (error) {
      // Fall through to handle value
    }
  }
  
  if (!value) return 'Not available';
  
  // If value is already a formatted string like "12/6/2025 09:00", just return it
  if (typeof value === 'string' && value.includes('/')) {
    return value.replace(' ', ' • ');
  }
  
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } catch (error) {
    return value;
  }
};

const FeedbackRequestModal = ({
  open,
  request,
  submitting = false,
  submitError,
  submitSuccess,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [touched, setTouched] = useState(false);

  // Check if feedback was already submitted (error contains duplicate message)
  const alreadySubmitted = submitError?.includes('already submitted');

  useEffect(() => {
    if (!open) {
      setRating(0);
      setFeedbackText('');
      setTouched(false);
    }
  }, [open]);

  const isSubmitDisabled = useMemo(() => {
    if (submitting) return true;
    if (alreadySubmitted) return true;
    if (rating < 1) return true;
    if (!feedbackText.trim()) return true;
    return false;
  }, [rating, feedbackText, submitting, alreadySubmitted]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched(true);
    if (isSubmitDisabled) return;
    onSubmit?.({
      rating,
      feedback: feedbackText.trim(),
    });
  };

  // Helper to format provider ID - use providerSerialNumber if available
  const getDisplayProviderId = () => {
    // First try providerSerialNumber (the SP-XXX format)
    const serialNumber = request?.providerSerialNumber;
    if (serialNumber && typeof serialNumber === 'string' && serialNumber.match(/^SP\d{3}$/i)) {
      return serialNumber;
    }
    // Don't display MongoDB ObjectIds
    return null;
  };

  const displayProviderId = getDisplayProviderId();

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        {alreadySubmitted ? 'Feedback Already Submitted' : 'Share Your Experience'}
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Service
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {request?.serviceName || 'Service details unavailable'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Provider
            </Typography>
            <Typography variant="body1">
              {request?.providerName || 'Unknown provider'}
            </Typography>
            {displayProviderId && (
              <Typography variant="caption" color="text.secondary">
                ID: {displayProviderId}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Appointment Time
            </Typography>
            <Typography variant="body1">
              {formatDateTime(request?.scheduledAt, request?.bookingDate, request?.bookingTime)}
            </Typography>
          </Grid>
        </Grid>

        {alreadySubmitted ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            You have already submitted feedback for this booking. Thank you for sharing your experience!
          </Alert>
        ) : (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                How would you rate this service?
              </Typography>
              <Rating
                name="service-rating"
                value={rating}
                precision={1}
                size="large"
                onChange={(_, newValue) => setRating(newValue || 0)}
              />
              {touched && rating < 1 && (
                <Typography variant="caption" color="error">Please select a rating.</Typography>
              )}
            </Box>

            <TextField
              multiline
              minRows={4}
              fullWidth
              label="Tell us about your experience"
              placeholder="What went well? What could have been better?"
              value={feedbackText}
              onChange={(event) => setFeedbackText(event.target.value.slice(0, 1000))}
              onBlur={() => setTouched(true)}
              helperText={`${feedbackText.length}/1000 characters`}
            />

            {submitError && !alreadySubmitted && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {submitError}
              </Alert>
            )}
            {submitSuccess && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {submitSuccess}
              </Alert>
            )}
          </>
        )}
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={submitting}>
          {alreadySubmitted ? 'Close' : 'Cancel'}
        </Button>
        {!alreadySubmitted && (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            {submitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackRequestModal;
