// Frontend/src/pages/admin/Admin.ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
  CircularProgress,
  Snackbar,
  IconButton,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
  AccountCircle as AccountCircleIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { getProfile, adminUpdateProfile, requestPasswordReset } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../../components/AdminSidebar';
import Header from '../../components/Header';
import Footer from '../../components/footer';
import { validateEmail, validateMobileNumber, validateName } from '../../utils/validation';
import useSidebar from '../../hooks/useSidebar';

// TabPanel Component
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarOpen, toggleSidebar } = useSidebar();
  
  // State management
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '' });
  const [passwordResetDialog, setPasswordResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      setProfileData(response.user);
      setEditedData(response.user);
      setResetEmail(response.user.emailAddress);
      setError('');
    } catch (err) {
      setError('Failed to load profile data. Please try again.');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
    setSuccess('');
    setValidationErrors({});
    if (newValue === 0) {
      setIsEditing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (editedData.fullName) {
      const nameErrors = validateName(editedData.fullName, 'Full name');
      if (nameErrors.length > 0) errors.fullName = nameErrors[0];
    }
    
    if (editedData.emailAddress) {
      const emailErrors = validateEmail(editedData.emailAddress);
      if (emailErrors.length > 0) errors.emailAddress = emailErrors[0];
    }
    
    if (editedData.mobileNumber) {
      const mobileErrors = validateMobileNumber(editedData.mobileNumber);
      if (mobileErrors.length > 0) errors.mobileNumber = mobileErrors[0];
    }
    
    if (editedData.currentAddress && editedData.currentAddress.trim().length < 10) {
      errors.currentAddress = 'Address must be at least 10 characters long';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedData({ ...profileData });
    setValidationErrors({});
    setError('');
    setSuccess('');
  };

  const handleUpdateProfile = async () => {
    if (!validateForm()) {
      setError('Please fix the validation errors before submitting.');
      return;
    }

    const changedFields = {};
    Object.keys(editedData).forEach(key => {
      if (editedData[key] !== profileData[key] && 
          ['fullName', 'emailAddress', 'mobileNumber', 'currentAddress'].includes(key)) {
        changedFields[key] = editedData[key];
      }
    });

    if (Object.keys(changedFields).length === 0) {
      setSuccess('No changes were made to your profile.');
      setIsEditing(false);
      return;
    }

    setConfirmDialog({
      open: true,
      message: 'Are you sure you want to update your profile? Changes will be applied immediately.'
    });
  };

  const handleConfirmUpdate = async () => {
    setConfirmDialog({ open: false, message: '' });
    
    try {
      setLoading(true);
      setError('');

      const changedFields = {};
      Object.keys(editedData).forEach(key => {
        if (editedData[key] !== profileData[key] && 
            ['fullName', 'emailAddress', 'mobileNumber', 'currentAddress'].includes(key)) {
          changedFields[key] = editedData[key];
        }
      });

      const response = await adminUpdateProfile(changedFields);
      
      if (response.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        await fetchUserProfile();
        setSnackbarOpen(true);
      } else {
        setError(response.message || 'Failed to update profile.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetRequest = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await requestPasswordReset(resetEmail);
      
      if (response.success) {
        setSuccess('Password reset email has been sent! Please check your email inbox.');
        setPasswordResetDialog(false);
        setSnackbarOpen(true);
      } else {
        setError(response.message || 'Failed to send password reset email.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send password reset email. Please try again.');
      console.error('Error sending password reset:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSuccess('');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && !profileData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} pageTitle="Profile Management" />

      {/* Sidebar */}
      <AdminSidebar open={sidebarOpen} onClose={toggleSidebar} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          backgroundColor: '#f5f5f5',
          transition: 'margin-left 0.3s',
          marginLeft: sidebarOpen && !isMobile ? '240px' : 0,
        }}
      >
        <Container maxWidth="lg">
          <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2 }}>
            {/* Tabs Header */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: '#fff' }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                aria-label="profile tabs"
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                  },
                }}
              >
                <Tab 
                  label="Profile Details" 
                  icon={<AccountCircleIcon />} 
                  iconPosition="start"
                />
                <Tab 
                  label="Change Password" 
                  icon={<LockIcon />} 
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            {/* Tab Panel 0: Profile Details */}
            <TabPanel value={activeTab} index={0}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                  {success}
                </Alert>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={editedData?.fullName || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    error={!!validationErrors.fullName}
                    helperText={validationErrors.fullName}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="emailAddress"
                    type="email"
                    value={editedData?.emailAddress || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    error={!!validationErrors.emailAddress}
                    helperText={validationErrors.emailAddress}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Mobile Number"
                    name="mobileNumber"
                    value={editedData?.mobileNumber || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    error={!!validationErrors.mobileNumber}
                    helperText={validationErrors.mobileNumber}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Current Address"
                    name="currentAddress"
                    value={editedData?.currentAddress || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing || loading}
                    error={!!validationErrors.currentAddress}
                    helperText={validationErrors.currentAddress}
                    variant="outlined"
                  />
                </Grid>

                {/* Account Information Section */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom color="text.secondary" sx={{ fontWeight: 500, mt: 3 }}>
                    Account Information
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ bgcolor: '#f9f9f9' }}>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Account Created
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formatDateTime(profileData?.createdAt)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ bgcolor: '#f9f9f9' }}>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Last Updated
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {formatDateTime(profileData?.updatedAt)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                    {!isEditing ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setIsEditing(true)}
                        disabled={loading}
                        sx={{ px: 4, py: 1.5 }}
                      >
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={handleCancelEdit}
                          disabled={loading}
                          startIcon={<CancelIcon />}
                          sx={{ px: 4, py: 1.5 }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleUpdateProfile}
                          disabled={loading}
                          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                          sx={{ px: 4, py: 1.5 }}
                        >
                          {loading ? 'Updating...' : 'Update'}
                        </Button>
                      </>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab Panel 1: Change Password */}
            <TabPanel value={activeTab} index={1}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
                  {success}
                </Alert>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h5" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
                    Password Management
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                </Grid>

                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    For security reasons, password changes require email verification. Click the button below to receive a password reset link via email.
                  </Alert>
                </Grid>

                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 3, bgcolor: '#f9f9f9' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EmailIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Reset Your Password
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          A password reset link will be sent to your registered email address.
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mt: 3 }}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        value={resetEmail}
                        disabled
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                      
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => setPasswordResetDialog(true)}
                        disabled={loading}
                        startIcon={<LockIcon />}
                        sx={{ py: 1.5, fontSize: '1rem' }}
                      >
                        Send Password Reset Email
                      </Button>
                    </Box>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Alert severity="warning">
                    <strong>Important:</strong> The password reset link will expire in 15 minutes. Make sure to check your email and complete the process promptly.
                  </Alert>
                </Grid>
              </Grid>
            </TabPanel>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, message: '' })}
      >
        <DialogTitle>Confirm Update</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, message: '' })} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmUpdate} color="primary" variant="contained" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Password Reset Dialog */}
      <Dialog
        open={passwordResetDialog}
        onClose={() => setPasswordResetDialog(false)}
      >
        <DialogTitle>Confirm Password Reset</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to request a password reset? An email with a reset link will be sent to <strong>{resetEmail}</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordResetDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button 
            onClick={handlePasswordResetRequest} 
            color="primary" 
            variant="contained" 
            disabled={loading}
            autoFocus
          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminProfilePage;
