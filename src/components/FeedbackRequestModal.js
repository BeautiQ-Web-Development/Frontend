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

const formatDateTime = (value) => {
  if (!value) return 'Not available';
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

  useEffect(() => {
    if (!open) {
      setRating(0);
      setFeedbackText('');
      setTouched(false);
    }
  }, [open]);

  const isSubmitDisabled = useMemo(() => {
    if (submitting) return true;
    if (rating < 1) return true;
    if (!feedbackText.trim()) return true;
    return false;
  }, [rating, feedbackText, submitting]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setTouched(true);
    if (isSubmitDisabled) return;
    onSubmit?.({
      rating,
      feedback: feedbackText.trim(),
    });
  };

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        Share Your Experience
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
            {request?.providerId && (
              <Typography variant="caption" color="text.secondary">
                ID: {request.providerId}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Appointment Time
            </Typography>
            <Typography variant="body1">
              {formatDateTime(request?.scheduledAt)}
            </Typography>
          </Grid>
        </Grid>

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

        {submitError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {submitError}
          </Alert>
        )}
        {submitSuccess && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {submitSuccess}
          </Alert>
        )}
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
        >
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackRequestModal;
