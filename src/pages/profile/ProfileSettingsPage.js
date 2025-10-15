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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  Divider,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  AppBar,
  Toolbar                         
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Lock as LockIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { getProfile, updateUserDetails, requestPasswordReset, requestAccountDeletion } from '../../services/auth';
import { useAuth } from '../../context/AuthContext';
// Remove Header import as we're replacing it with AppBar
// import Header from '../../components/Header';
import Footer from '../../components/footer';
import CustomerSidebar from '../../components/CustomerSidebar';
import ServiceProviderSidebar from '../../components/ServiceProviderSidebar';
import AdminSidebar from '../../components/AdminSidebar';

// Field validation helpers
import { validateEmail, validateMobileNumber, validateName, validateNIC } from '../../utils/validation';

const ProfileSettingsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [editedData, setEditedData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', action: null });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [reassignReason, setReassignReason] = useState('');
  const [reassignDialog, setReassignDialog] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      setProfileData(response.user);
      setEditedData(response.user);
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
    // Reset states when changing tabs
    setIsEditing(false);
    setError('');
    setSuccess('');
    setValidationErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Only validate fields that are present in the form
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
    
    if (editedData.nicNumber) {
      const nicErrors = validateNIC(editedData.nicNumber);
      if (nicErrors.length > 0) errors.nicNumber = nicErrors[0];
    }
    
    if (editedData.currentAddress && editedData.currentAddress.trim().length < 10) {
      errors.currentAddress = 'Address must be at least 10 characters long';
    }
    
    // Add business-specific validations for service providers
    if (user.role === 'serviceProvider') {
      if (!editedData.businessName || editedData.businessName.trim().length < 3) {
        errors.businessName = 'Business name is required and must be at least 3 characters';
      }
      
      if (!editedData.city) {
        errors.city = 'City is required';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStartEditing = () => {
    setIsEditing(true);
    setEditedData({...profileData});
    setValidationErrors({});
    setError('');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedData({...profileData});
    setValidationErrors({});
    setError('');
  };

  const handleUpdateProfile = async () => {
    if (!validateForm()) {
      setError('Please fix the validation errors before submitting.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Check what fields have changed
      const changedFields = {};
      Object.keys(editedData).forEach(key => {
        if (editedData[key] !== profileData[key]) {
          changedFields[key] = editedData[key];
        }
      });
      
      if (Object.keys(changedFields).length === 0) {
        setSuccess('No changes were made to your profile.');
        setIsEditing(false);
        return;
      }
      
      // For admin, update directly without approval
      if (user.role === 'admin') {
        // Direct update for admin
        try {
          const response = await updateUserDetails(changedFields);
          if (response.success) {
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            await fetchUserProfile(); // Refresh the profile data
          } else {
            setError(response.message || 'Failed to update profile. Please try again.');
          }
        } catch (err) {
          setError(err.message || 'An error occurred while updating your profile.');
          console.error('Admin update profile error:', err);
        }
      } else {
        // Submit changes for approval for non-admin users
        const response = await updateUserDetails(changedFields);
        
        if (response.success) {
          setSuccess('Your profile update request has been submitted to the admin for approval.');
          setIsEditing(false);
          // Show confirmation dialog
          setConfirmDialog({
            open: true,
            title: 'Request Submitted',
            message: 'Your request has been successfully submitted to the Admin for approval.',
            action: () => {
              setConfirmDialog({...confirmDialog, open: false});
              fetchUserProfile(); // Refresh the profile data
            }
          });
        } else {
          setError(response.message || 'Failed to update profile. Please try again.');
        }
      }
    } catch (err) {
      setError(err.message || 'An error occurred while updating your profile.');
      console.error('Update profile error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetRequest = async () => {
    if (!profileData.emailAddress) {
      setError('Email address is required to reset password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await requestPasswordReset(profileData.emailAddress);
      
      if (response.success) {
        setSuccess('Password reset link has been sent to your email address.');
        // Show confirmation dialog
        setConfirmDialog({
          open: true,
          title: 'Password Reset Email Sent',
          message: 'A password reset link has been sent to your email address. Please check your inbox and follow the instructions to reset your password.',
          action: () => setConfirmDialog({...confirmDialog, open: false})
        });
      } else {
        setError(response.message || 'Failed to send password reset email. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while requesting password reset.');
      console.error('Password reset request error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReassignDialog = () => {
    setReassignDialog(true);
    setReassignReason('');
  };

  const handleSubmitReassignment = async () => {
    if (!reassignReason.trim() || reassignReason.trim().length < 10) {
      setError('Please provide a detailed reason for reassignment (at least 10 characters).');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await requestAccountDeletion(reassignReason.trim());
      
      if (response.success) {
        setReassignDialog(false);
        // Show confirmation dialog
        setConfirmDialog({
          open: true,
          title: 'Reassignment Request Submitted',
          message: 'Your account reassignment request has been submitted to the admin for approval. Admin approval is required to leave this platform.',
          action: () => setConfirmDialog({...confirmDialog, open: false})
        });
      } else {
        setError(response.message || 'Failed to submit reassignment request. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while submitting reassignment request.');
      console.error('Reassignment request error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalDetailsForm = () => {
    if (!profileData) return <CircularProgress />;
    
    return (
      <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2" sx={{ color: '#003047', fontWeight: 'bold' }}>
              Personal Information
            </Typography>
            {!isEditing ? (
              <Button 
                startIcon={<EditIcon />} 
                onClick={handleStartEditing}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              >
                Edit Details
              </Button>
            ) : (
              <Box>
                <Button 
                  startIcon={<CancelIcon />} 
                  onClick={handleCancelEdit}
                  variant="outlined"
                  color="error"
                  sx={{ mr: 1, borderRadius: 2 }}
                >
                  Cancel
                </Button>
                <Button 
                  startIcon={<SaveIcon />} 
                  onClick={handleUpdateProfile}
                  variant="contained"
                  disabled={loading}
                  sx={{ bgcolor: '#003047', borderRadius: 2 }}
                >
                  {loading ? 'Updating...' : 'Update'}
                </Button>
              </Box>
            )}
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={isEditing ? editedData.fullName : profileData.fullName}
                onChange={handleInputChange}
                disabled={!isEditing}
                error={!!validationErrors.fullName}
                helperText={validationErrors.fullName}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="emailAddress"
                value={isEditing ? editedData.emailAddress : profileData.emailAddress}
                onChange={handleInputChange}
                disabled={!isEditing}
                error={!!validationErrors.emailAddress}
                helperText={validationErrors.emailAddress}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobileNumber"
                value={isEditing ? editedData.mobileNumber : profileData.mobileNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                error={!!validationErrors.mobileNumber}
                helperText={validationErrors.mobileNumber}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="NIC Number"
                name="nicNumber"
                value={isEditing ? editedData.nicNumber : profileData.nicNumber}
                onChange={handleInputChange}
                disabled={!isEditing}
                error={!!validationErrors.nicNumber}
                helperText={validationErrors.nicNumber}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Address"
                name="currentAddress"
                value={isEditing ? editedData.currentAddress : profileData.currentAddress}
                onChange={handleInputChange}
                disabled={!isEditing}
                multiline
                rows={3}
                error={!!validationErrors.currentAddress}
                helperText={validationErrors.currentAddress}
                sx={{ mb: 2 }}
              />
            </Grid>
            
            {/* Additional fields for service provider */}
            {user.role === 'serviceProvider' && (
              <>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="h6" sx={{ mt: 2, mb: 2, color: '#003047', fontWeight: 'bold' }}>
                    Business Information
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Business Name"
                    name="businessName"
                    value={isEditing ? editedData.businessName : profileData.businessName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    error={!!validationErrors.businessName}
                    helperText={validationErrors.businessName}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={isEditing ? editedData.city : profileData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    error={!!validationErrors.city}
                    helperText={validationErrors.city}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Business Type"
                    name="businessType"
                    value={isEditing ? editedData.businessType : profileData.businessType}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    error={!!validationErrors.businessType}
                    helperText={validationErrors.businessType}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Home Address"
                    name="homeAddress"
                    value={isEditing ? editedData.homeAddress : profileData.homeAddress}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    error={!!validationErrors.homeAddress}
                    helperText={validationErrors.homeAddress}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Business Description"
                    name="businessDescription"
                    value={isEditing ? editedData.businessDescription : profileData.businessDescription}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    multiline
                    rows={3}
                    error={!!validationErrors.businessDescription}
                    helperText={validationErrors.businessDescription}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  const renderPasswordReset = () => {
    return (
      <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ color: '#003047', fontWeight: 'bold', mb: 2 }}>
            Change Password
          </Typography>
          
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <LockIcon sx={{ fontSize: 60, color: '#003047', mb: 2 }} />
            
            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
              For security reasons, we'll send a password reset link to your registered email address:
              <Box component="span" sx={{ fontWeight: 'bold', display: 'block', mt: 1 }}>
                {profileData?.emailAddress}
              </Box>
            </Typography>
            
            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              onClick={handlePasswordResetRequest}
              disabled={loading}
              sx={{ 
                bgcolor: '#003047', 
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: 'bold'
              }}
            >
              {loading ? 'Sending...' : 'Send Password Reset Link'}
            </Button>
            
            <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
              After clicking the link in your email, you'll be able to create a new password.
              You will need to log in again with your new password.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const renderAccountDeletion = () => {
    return (
      <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ color: '#003047', fontWeight: 'bold', mb: 2 }}>
            Delete Account (Reassignment)
          </Typography>
          
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <DeleteIcon sx={{ fontSize: 60, color: '#f44336', mb: 2 }} />
            
            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
              If you wish to delete your account for reassignment purposes, click the button below.
              You will need to provide a reason, and your request will be sent to the admin for approval.
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary', textAlign: 'center' }}>
              Note: This action will require admin approval and cannot be undone.
              Your account will remain active until the admin approves your request.
            </Typography>
            
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleOpenReassignDialog}
              sx={{ 
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontWeight: 'bold'
              }}
            >
              Request Account Deletion
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Replace Header with AppBar */}
      <AppBar position="static" sx={{ bgcolor: '#003047' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#FFFFFF', fontWeight: 600 }}>
            Profile Settings
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#FFFFFF', ml: 2 }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user.businessName || user.fullName} ({user.role})
            </Typography>
            <Typography variant="body2">
              {new Date().toLocaleString()}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {user.role === 'customer' ? (
        <CustomerSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={user}
        />
      ) : user.role === 'admin' ? (
        <AdminSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={user}
        />
      ) : (
        <ServiceProviderSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={user}
          onResignation={() => {}}
        />
      )}
      
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {/* Remove the duplicate title since it's now in the AppBar */}
        {/* <Typography variant="h4" sx={{ mb: 4, color: '#003047', fontWeight: 'bold' }}>
          Profile Settings
        </Typography> */}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}
        
        <Paper sx={{ mb: 4, borderRadius: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                py: 2,
                fontWeight: 'medium'
              }
            }}
          >
            <Tab label="Manage Details" />
            <Tab label="Change Password" />
            {user.role !== 'admin' && <Tab label="Delete Account" />}
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            {activeTab === 0 && renderPersonalDetailsForm()}
            {activeTab === 1 && renderPasswordReset()}
            {activeTab === 2 && user.role !== 'admin' && renderAccountDeletion()}
          </Box>
        </Paper>
      </Container>
      
      <Footer />
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({...confirmDialog, open: false})}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={confirmDialog.action || (() => setConfirmDialog({...confirmDialog, open: false}))}
            variant="contained"
            sx={{ bgcolor: '#003047' }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Reassignment Dialog */}
      <Dialog
        open={reassignDialog}
        onClose={() => setReassignDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Request Account Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please provide a detailed reason for your account deletion request:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for leaving"
            fullWidth
            multiline
            rows={4}
            value={reassignReason}
            onChange={(e) => setReassignReason(e.target.value)}
            error={reassignReason.trim().length < 10}
            helperText={reassignReason.trim().length < 10 ? "Please provide at least 10 characters" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReassignDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitReassignment} 
            variant="contained" 
            color="error"
            disabled={loading || reassignReason.trim().length < 10}
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={error || success}
      />
    </Box>
  );
};

export default ProfileSettingsPage;
