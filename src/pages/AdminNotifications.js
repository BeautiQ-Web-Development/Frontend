import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Divider,
  Card,
  CardContent,
  Grid,
  IconButton,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  Logout as LogoutIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminServicesAPI, adminPackagesAPI } from '../services/services';
import axios from 'axios';

const AdminNotifications = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([]);
  const [pendingServices, setPendingServices] = useState([]);
  const [pendingPackages, setPendingPackages] = useState([]);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // Dialog states
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionType, setActionType] = useState('');
  const [actionReason, setActionReason] = useState('');

  useEffect(() => {
    fetchAllPendingItems();
  }, []);

  const fetchAllPendingItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch pending services
      try {
        const servicesResponse = await adminServicesAPI.getPendingServices();
        setPendingServices(servicesResponse.pendingServices || []);
      } catch (err) {
        console.error('Error fetching pending services:', err);
      }

      // Fetch pending packages
      try {
        const packagesResponse = await adminPackagesAPI.getPendingPackages();
        setPendingPackages(packagesResponse.data || []);
      } catch (err) {
        console.error('Error fetching pending packages:', err);
      }

      // Fetch pending service providers
      try {
        const providersResponse = await axios.get('http://localhost:5000/api/auth/pending-providers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPendingProviders(providersResponse.data.data || []);
      } catch (err) {
        console.error('Error fetching pending providers:', err);
      }

      // Fetch general notifications
      try {
        const notificationsResponse = await axios.get('http://localhost:5000/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(notificationsResponse.data.data || []);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }

    } catch (error) {
      console.error('Error fetching pending items:', error);
      setError('Failed to fetch notifications');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleViewItem = (item, type) => {
    setSelectedItem({ ...item, itemType: type });
    setViewDialogOpen(true);
  };

  const handleAction = (item, type, action) => {
    setSelectedItem({ ...item, itemType: type });
    setActionType(action);
    setActionDialogOpen(true);
    setActionReason('');
  };

  const confirmAction = async () => {
    try {
      const token = localStorage.getItem('token');
      let response;

      if (selectedItem.itemType === 'service') {
        if (actionType === 'approve') {
          response = await adminServicesAPI.approveService(selectedItem._id, actionReason || 'Approved by admin');
        } else {
          response = await adminServicesAPI.rejectService(selectedItem._id, actionReason || 'Does not meet quality standards');
        }
      } else if (selectedItem.itemType === 'package') {
        if (actionType === 'approve') {
          response = await adminPackagesAPI.approvePackage(selectedItem._id, actionReason || 'Approved by admin');
        } else {
          response = await adminPackagesAPI.rejectPackage(selectedItem._id, actionReason || 'Does not meet quality standards');
        }
      } else if (selectedItem.itemType === 'provider') {
        const url = `http://localhost:5000/api/auth/${actionType === 'approve' ? 'approve' : 'reject'}-provider/${selectedItem._id}`;
        response = await axios.put(url, 
          actionType === 'reject' ? { reason: actionReason || 'Application does not meet requirements' } : {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (selectedItem.itemType === 'customer_update' || selectedItem.itemType === 'customer_delete') {
        const endpoint = actionType === 'approve' ? 'approve-customer-update' : 'reject-customer-update';
        const url = `http://localhost:5000/api/auth/admin/${endpoint}/${selectedItem._id}`;
        response = await axios.put(url,
          actionType === 'reject' ? { rejectionReason: actionReason || 'Request did not meet requirements' } : {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setSuccess(`${selectedItem.itemType} ${actionType}d successfully`);
      setSnackbarOpen(true);
      setActionDialogOpen(false);
      
      // Refresh the data
      fetchAllPendingItems();
      
    } catch (error) {
      console.error(`Error ${actionType}ing ${selectedItem.itemType}:`, error);
      setError(`Failed to ${actionType} ${selectedItem.itemType}`);
      setSnackbarOpen(true);
    }
  };

  const getItemTitle = (item, type) => {
    switch (type) {
      case 'service':
        return item.name || 'Unnamed Service';
      case 'package':
        return item.packageName || 'Unnamed Package';
      case 'provider':
        return item.businessName || item.fullName || 'Unnamed Provider';
      default:
        return 'Unknown Item';
    }
  };

  const getItemDescription = (item, type) => {
    switch (type) {
      case 'service':
        const actionType = item.pendingChanges?.actionType || (item.status === 'pending_approval' ? 'create' : 'unknown');
        return `${actionType.charAt(0).toUpperCase() + actionType.slice(1)} request by ${item.serviceProvider?.fullName || item.serviceProvider?.businessName || 'Unknown Provider'}`;
      case 'package':
        const packageAction = item.pendingChanges?.requestType || (item.status === 'pending_approval' ? 'create' : 'unknown');
        return `${packageAction.charAt(0).toUpperCase() + packageAction.slice(1)} request by ${item.serviceProvider?.fullName || item.serviceProvider?.businessName || 'Unknown Provider'}`;
      case 'provider':
        return `New service provider registration from ${item.fullName}`;
      default:
        return 'No description available';
    }
  };

  const getStatusChip = (item, type) => {
    if (type === 'provider') {
      return <Chip label="Registration Pending" color="warning" size="small" />;
    }
    
    if (item.pendingChanges) {
      const action = item.pendingChanges.actionType || item.pendingChanges.requestType;
      return <Chip label={`${action} Pending`} color="warning" size="small" />;
    }
    
    return <Chip label="Approval Pending" color="info" size="small" />;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalPendingCount = pendingServices.length + pendingPackages.length + pendingProviders.length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BeautiQ Admin - Notifications Center
          </Typography>
          <IconButton color="inherit" onClick={fetchAllPendingItems} title="Refresh">
            <RefreshIcon />
          </IconButton>
          <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
          Notifications & Pending Approvals
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Typography variant="h6">Pending Services</Typography>
                <Typography variant="h3" color="primary">{pendingServices.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#e8f5e9' }}>
              <CardContent>
                <Typography variant="h6">Pending Packages</Typography>
                <Typography variant="h3" color="success.main">{pendingPackages.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#fff8e1' }}>
              <CardContent>
                <Typography variant="h6">Pending Providers</Typography>
                <Typography variant="h3" color="warning.main">{pendingProviders.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#f3e5f5' }}>
              <CardContent>
                <Typography variant="h6">Total Pending</Typography>
                <Typography variant="h3" color="secondary">{totalPendingCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Pending Items Sections */}
        {totalPendingCount === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No pending approvals at this time
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ p: 2 }}>
            {/* Pending Service Providers */}
            {pendingProviders.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mb: 2, color: 'warning.main' }}>
                  Pending Service Provider Registrations ({pendingProviders.length})
                </Typography>
                <List>
                  {pendingProviders.map((provider) => (
                    <ListItem key={provider._id} divider>
                      <ListItemText
                        primary={getItemTitle(provider, 'provider')}
                        secondary={getItemDescription(provider, 'provider')}
                      />
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {getStatusChip(provider, 'provider')}
                        <IconButton onClick={() => handleViewItem(provider, 'provider')} title="View Details">
                          <ViewIcon />
                        </IconButton>
                        <IconButton onClick={() => handleAction(provider, 'provider', 'approve')} color="success" title="Approve">
                          <ApproveIcon />
                        </IconButton>
                        <IconButton onClick={() => handleAction(provider, 'provider', 'reject')} color="error" title="Reject">
                          <RejectIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 2 }} />
              </>
            )}

            {/* Pending Services */}
            {pendingServices.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Pending Service Actions ({pendingServices.length})
                </Typography>
                <List>
                  {pendingServices.map((service) => (
                    <ListItem key={service._id} divider>
                      <ListItemText
                        primary={getItemTitle(service, 'service')}
                        secondary={getItemDescription(service, 'service')}
                      />
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {getStatusChip(service, 'service')}
                        <IconButton onClick={() => handleViewItem(service, 'service')} title="View Details">
                          <ViewIcon />
                        </IconButton>
                        <IconButton onClick={() => handleAction(service, 'service', 'approve')} color="success" title="Approve">
                          <ApproveIcon />
                        </IconButton>
                        <IconButton onClick={() => handleAction(service, 'service', 'reject')} color="error" title="Reject">
                          <RejectIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 2 }} />
              </>
            )}

            {/* Pending Packages */}
            {pendingPackages.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
                  Pending Package Actions ({pendingPackages.length})
                </Typography>
                <List>
                  {pendingPackages.map((pkg) => (
                    <ListItem key={pkg._id} divider>
                      <ListItemText
                        primary={getItemTitle(pkg, 'package')}
                        secondary={getItemDescription(pkg, 'package')}
                      />
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        {getStatusChip(pkg, 'package')}
                        <IconButton onClick={() => handleViewItem(pkg, 'package')} title="View Details">
                          <ViewIcon />
                        </IconButton>
                        <IconButton onClick={() => handleAction(pkg, 'package', 'approve')} color="success" title="Approve">
                          <ApproveIcon />
                        </IconButton>
                        <IconButton onClick={() => handleAction(pkg, 'package', 'reject')} color="error" title="Reject">
                          <RejectIcon />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </Paper>
        )}

        {/* View Details Dialog */}
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedItem && `${selectedItem.itemType.charAt(0).toUpperCase() + selectedItem.itemType.slice(1)} Details`}
          </DialogTitle>
          <DialogContent>
            {selectedItem && (
              <Box sx={{ mt: 2 }}>
                {selectedItem.itemType === 'service' && (
                  <>
                    <Typography><strong>Service Name:</strong> {selectedItem.name}</Typography>
                    <Typography><strong>Type:</strong> {selectedItem.type}</Typography>
                    <Typography><strong>Category:</strong> {selectedItem.category}</Typography>
                    <Typography><strong>Description:</strong> {selectedItem.description}</Typography>
                    <Typography><strong>Duration:</strong> {selectedItem.duration} minutes</Typography>
                    <Typography><strong>Base Price:</strong> LKR {selectedItem.pricing?.basePrice}</Typography>
                    <Typography><strong>Provider:</strong> {selectedItem.serviceProvider?.fullName || selectedItem.serviceProvider?.businessName}</Typography>
                    {selectedItem.pendingChanges && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                        <Typography variant="h6">Pending Changes:</Typography>
                        <Typography><strong>Action:</strong> {selectedItem.pendingChanges.actionType}</Typography>
                        <Typography><strong>Reason:</strong> {selectedItem.pendingChanges.reason}</Typography>
                      </Box>
                    )}
                  </>
                )}
                {selectedItem.itemType === 'package' && (
                  <>
                    <Typography><strong>Package Name:</strong> {selectedItem.packageName}</Typography>
                    <Typography><strong>Type:</strong> {selectedItem.packageType}</Typography>
                    <Typography><strong>Description:</strong> {selectedItem.packageDescription}</Typography>
                    <Typography><strong>Total Price:</strong> LKR {selectedItem.totalPrice}</Typography>
                    <Typography><strong>Duration:</strong> {selectedItem.totalDuration} minutes</Typography>
                    <Typography><strong>Provider:</strong> {selectedItem.serviceProvider?.fullName || selectedItem.serviceProvider?.businessName}</Typography>
                    {selectedItem.pendingChanges && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                        <Typography variant="h6">Pending Changes:</Typography>
                        <Typography><strong>Action:</strong> {selectedItem.pendingChanges.requestType}</Typography>
                        <Typography><strong>Reason:</strong> {selectedItem.pendingChanges.reason}</Typography>
                      </Box>
                    )}
                  </>
                )}
                {selectedItem.itemType === 'provider' && (
                  <>
                    <Typography><strong>Business Name:</strong> {selectedItem.businessName}</Typography>
                    <Typography><strong>Owner Name:</strong> {selectedItem.fullName}</Typography>
                    <Typography><strong>Email:</strong> {selectedItem.emailAddress}</Typography>
                    <Typography><strong>Mobile:</strong> {selectedItem.mobileNumber}</Typography>
                    <Typography><strong>Business Type:</strong> {selectedItem.businessType}</Typography>
                    <Typography><strong>City:</strong> {selectedItem.city}</Typography>
                  </>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Action Confirmation Dialog */}
        <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            Confirm {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Are you sure you want to {actionType} this {selectedItem?.itemType}?
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              label={actionType === 'approve' ? 'Approval Comments (Optional)' : 'Rejection Reason (Required)'}
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              required={actionType === 'reject'}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={confirmAction} 
              color={actionType === 'approve' ? 'success' : 'error'}
              disabled={actionType === 'reject' && !actionReason.trim()}
            >
              {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
          <Alert onClose={() => setSnackbarOpen(false)} severity={success ? "success" : "error"}>
            {success || error}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AdminNotifications;
