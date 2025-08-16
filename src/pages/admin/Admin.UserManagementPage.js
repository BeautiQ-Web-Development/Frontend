// UserManagementAdmin.js - FIXED WITH DELETION REASON DISPLAY
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Alert,
  AlertTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  AppBar,
  Toolbar,
  Chip,
  Card,
  CardContent,
  Avatar,
  TextField,
  InputAdornment,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Badge,
  ButtonGroup
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as DateIcon,
  Check as CheckIcon,
  Close as RejectIcon,
  Delete as DeleteIcon,
  Update as UpdateIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  History as HistoryIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/footer';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../services/auth';
import { styled } from '@mui/material/styles';

// Styled components for Timeline
const Timeline = styled('div')(({ theme }) => ({
  margin: theme.spacing(2, 0),
  padding: 0
}));

const TimelineItem = styled('div')(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1, 0, 1, 3),
  '&:before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: theme.palette.divider,
  }
}));

const TimelineSeparator = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
});

const TimelineDot = styled('div')(({ theme, color = 'primary' }) => {
  const bgColor = theme.palette[color]?.main || theme.palette.primary.main;
  return {
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor: bgColor,
    margin: theme.spacing(1, 0)
  };
});

const TimelineConnector = styled('div')(({ theme }) => ({
  width: 2,
  backgroundColor: theme.palette.divider,
  flexGrow: 1
}));

const TimelineContent = styled('div')(({ theme }) => ({
  padding: theme.spacing(1, 2),
  marginLeft: theme.spacing(2)
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
  overflow: 'auto',
  border: '1px solid rgba(7, 91, 94, 0.1)',
  '& .MuiTable-root': {
    minWidth: 1200, // Increased width for deletion reason column
  },
  '&::-webkit-scrollbar': {
    height: 8,
    width: 8,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 4,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,48,71,0.3)',
    borderRadius: 4,
    '&:hover': {
      backgroundColor: '#00003f',
    },
  },
  scrollBehavior: 'smooth',
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: '#003047',
  color: theme.palette.common.white,
  fontWeight: 700,
  fontSize: '0.95rem',
  padding: theme.spacing(2),
  borderBottom: 'none'
}));

const StyledTableRow = styled(({ isActive, ...props }) => <TableRow {...props} />)(({ theme, isActive }) => ({
  backgroundColor: isActive ? 'transparent' : 'rgba(255, 0, 0, 0.05)', // Highlight deactivated accounts
  transition: 'transform .15s ease, box-shadow .15s ease, background-color .15s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  }
}));

const UserManagementAdmin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState({ open: false, customer: null });
  const [updateActionLoading, setUpdateActionLoading] = useState(false);
  const [updateActionResult, setUpdateActionResult] = useState(null);
  const [requestFilter, setRequestFilter] = useState('all');
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionReason, setActionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch all customers
  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching all customers');
      const response = await api.get('/auth/customers');
      if (response.data.success) {
        setCustomers(response.data.customers);
        setError('');
      }
    } catch (error) {
      console.error('Fetch data error:', error);
      setError(`Failed to fetch customers: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Keep details dialog in sync with customer data changes
  useEffect(() => {
    if (detailsDialog.open && detailsDialog.customer) {
      const updatedCustomer = customers.find(c => c._id === detailsDialog.customer._id);
      if (updatedCustomer) {
        if (JSON.stringify(updatedCustomer) !== JSON.stringify(detailsDialog.customer)) {
          setDetailsDialog(prev => ({ ...prev, customer: updatedCustomer }));
        }
      } else {
        setDetailsDialog({ open: false, customer: null });
      }
    }
  }, [customers, detailsDialog.open]);

  // Enhanced debugging for customer data
  useEffect(() => {
    console.log('🔍 Detailed customer analysis:', {
      totalCustomers: customers.length,
      customersData: customers.map(c => ({
        id: c._id,
        name: c.fullName,
        email: c.emailAddress,
        isActive: c.isActive,
        deletedAt: c.deletedAt,
        deletionReason: c.deletionReason,
        hasPendingUpdates: !!(c.pendingUpdates),
        pendingStatus: c.pendingUpdates?.status,
        pendingFields: c.pendingUpdates?.fields ? Object.keys(c.pendingUpdates.fields) : [],
        deleteRequested: c.pendingUpdates?.deleteRequested,
        requestedAt: c.pendingUpdates?.requestedAt,
        updatedAt: c.updatedAt
      }))
    });
    
    // Count customers with pending updates
    const withPendingUpdates = customers.filter(c => 
      c.pendingUpdates && c.pendingUpdates.status === 'pending'
    );
    
    console.log('📊 Summary:', {
      totalCustomers: customers.length,
      activeCustomers: customers.filter(c => c.isActive !== false).length,
      deactivatedCustomers: customers.filter(c => c.isActive === false).length,
      withPendingUpdates: withPendingUpdates.length,
      pendingUpdateRequests: withPendingUpdates.filter(c => !c.pendingUpdates.deleteRequested).length,
      pendingDeleteRequests: withPendingUpdates.filter(c => c.pendingUpdates.deleteRequested).length
    });
  }, [customers]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching customers from API...');
      
      const response = await api.get('/auth/customers');
      console.log('📡 API Response:', response.data);
      
      if (response.data.success) {
        const customerData = response.data.customers || [];
        console.log('📊 Raw customer data received:', customerData.length, 'customers');
        
        // Enhanced debugging for each customer
        customerData.forEach((customer, index) => {
          console.log(`👤 Customer ${index + 1}:`, {
            name: customer.fullName,
            email: customer.emailAddress,
            isActive: customer.isActive,
            deletedAt: customer.deletedAt,
            deletionReason: customer.deletionReason,
            hasPendingUpdates: !!(customer.pendingUpdates),
            pendingStatus: customer.pendingUpdates?.status,
            pendingFields: customer.pendingUpdates?.fields ? Object.keys(customer.pendingUpdates.fields) : [],
            deleteRequested: customer.pendingUpdates?.deleteRequested,
            requestType: customer.pendingUpdates?.requestType,
            isActive: customer.isActive
          });
        });
        
        setCustomers(customerData);
        setError(''); // Clear any previous errors
      } else {
        throw new Error(response.data.message || 'Failed to fetch customers');
      }
    } catch (error) {
      console.error('❌ Fetch customers error:', error);
      setError(`Failed to fetch customers: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  // Update action handler with better error handling
  const handleUpdateAction = async (customerId, approve) => {
    try {
      setActionLoading(true);
      console.log(`🔄 ${approve ? 'Approving' : 'Rejecting'} update for customer:`, customerId);
      
      const endpoint = approve ? 
        `/auth/admin/approve-customer-update/${customerId}` : 
        `/auth/admin/reject-customer-update/${customerId}`;
      
      const requestData = approve ? {} : { rejectionReason: actionReason };
      console.log('📤 Sending request:', { endpoint, data: requestData });
      
      const response = await api.put(endpoint, requestData);
      console.log('📥 Response:', response.data);
      
      if (response.data.success) {
        const message = approve ? 
          'Update request approved successfully!' : 
          'Update request rejected successfully!';
        setSuccessMessage(message);
        setActionDialogOpen(false);
        setActionReason('');
        
        // Refresh customer data
        await fetchData();
        
        console.log(`✅ ${approve ? 'Approval' : 'Rejection'} completed successfully`);
      } else {
        throw new Error(response.data.message || 'Failed to process update request');
      }
    } catch (error) {
      console.error('❌ Update action error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred while processing the update request';
      setError(errorMessage);
    } finally {
      setActionLoading(false);
      // Clear messages after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
        setError('');
      }, 5000);
    }
  };

  // Request label with detailed debugging
  const getRequestLabel = (customer) => {
    console.log('🏷️ Getting request label for:', {
      name: customer.fullName,
      hasPendingUpdates: !!(customer.pendingUpdates),
      pendingUpdates: customer.pendingUpdates
    });
    
    if (!customer.pendingUpdates) {
      console.log('❌ No pendingUpdates found for:', customer.fullName);
      return null;
    }
    
    const status = customer.pendingUpdates.status;
    if (status !== 'pending') {
      console.log('❌ Status is not pending for:', customer.fullName, 'Status:', status);
      return null;
    }
    
    const requestType = customer.pendingUpdates.deleteRequested ? 
      'Delete Account Request' : 
      'Update Request';
    
    const color = customer.pendingUpdates.deleteRequested ? "error" : "warning";
    
    console.log('✅ Creating request label:', { requestType, color });
    
    return (
      <Chip 
        label={requestType}
        size="small"
        color={color}
        sx={{ 
          fontWeight: 600,
          '& .MuiChip-label': { px: 1 }
        }}
      />
    );
  };

  // Filter function for updates and deletion requests
  const getFilteredCustomers = () => {
    let filtered = [...customers];
    
    console.log('🔍 Starting filter process:', {
      totalCustomers: filtered.length,
      requestFilter,
      searchTerm
    });
    
    // Apply search filter first
    if (searchTerm) {
      const beforeSearch = filtered.length;
      filtered = filtered.filter(customer =>
        customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.mobileNumber?.includes(searchTerm)
      );
      console.log(`🔍 After search filter: ${beforeSearch} → ${filtered.length}`);
    }
    
    // Apply filter for pending requests
    if (requestFilter === 'pending-updates') {
      // Only update requests
      filtered = filtered.filter(c =>
        c.pendingUpdates?.status === 'pending' && !c.pendingUpdates.deleteRequested
      );
    } else if (requestFilter === 'pending-deletions') {
      // Only deletion requests
      filtered = filtered.filter(c =>
        c.pendingUpdates?.status === 'pending' && c.pendingUpdates.deleteRequested
      );
    } else if (requestFilter === 'all-pending') {
      // All pending requests
      filtered = filtered.filter(c => c.pendingUpdates?.status === 'pending');
    } else if (requestFilter === 'deactivated') {
      // Show only deactivated accounts
      filtered = filtered.filter(c => c.isActive === false);
    }
    
    console.log('🔍 Final filtered results:', {
      count: filtered.length,
      customers: filtered.map(c => c.fullName)
    });
    
    return filtered;
  };

  const handleViewCustomer = (customer) => {
    console.log('👁️ Opening customer details for:', customer.fullName);
    setDetailsDialog({ open: true, customer });
  };

  const getStatusChip = (customer) => {
    if (customer.isActive === false) {
      return (
        <Chip
          label="Deactivated"
          color="error"
          size="small"
          sx={{ fontWeight: 600 }}
          icon={<WarningIcon />}
        />
      );
    }
    return (
      <Chip
        label="Active"
        color="success"
        size="small"
        sx={{ fontWeight: 600 }}
      />
    );
  };

  // Better badge counts with null safety
  const getPendingUpdateCount = () => {
    return customers.filter(c => 
      c.pendingUpdates?.status === 'pending' && !c.pendingUpdates?.deleteRequested
    ).length;
  };

  const getPendingDeleteCount = () => {
    return customers.filter(c => 
      c.pendingUpdates?.status === 'pending' && c.pendingUpdates?.deleteRequested
    ).length;
  };

  const getAllPendingCount = () => {
    return customers.filter(c => c.pendingUpdates?.status === 'pending').length;
  };

  const getDeactivatedCount = () => {
    return customers.filter(c => c.isActive === false).length;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fafafa' }}>
      <AppBar position="static" sx={{ bgcolor: '#003047', boxShadow: '0 4px 12px rgba(14, 22, 53, 0.3)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: '#fafafa' }}>
             BeautiQ Admin 
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ fontWeight: 600, borderRadius: 2 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#003047', fontWeight: 800, mb: 1 }}>
            Customer Details Management
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#666', mb: 3 }}>
            Manage all registered customers and their details
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}

        {/* Enhanced filter buttons with deactivated accounts */}
        <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant={requestFilter === 'all' ? "contained" : "outlined"}
            onClick={() => setRequestFilter('all')}
            size="small"
            sx={{ borderRadius: 2 }}
          >
            All Customers ({customers.length})
          </Button>
          <Button 
            variant={requestFilter === 'all-pending' ? "contained" : "outlined"}
            onClick={() => setRequestFilter('all-pending')}
            size="small"
            color="warning"
            sx={{ borderRadius: 2 }}
            startIcon={
              <Badge badgeContent={getAllPendingCount()} color="error">
                <span></span>
              </Badge>
            }
          >
            All Pending Requests
          </Button>
          <Button 
            variant={requestFilter === 'pending-updates' ? "contained" : "outlined"}
            onClick={() => setRequestFilter('pending-updates')}
            size="small"
            color="info"
            sx={{ borderRadius: 2 }}
            startIcon={
              <Badge badgeContent={getPendingUpdateCount()} color="info">
                <span></span>
              </Badge>
            }
          >
            Update Requests
          </Button>
          <Button 
            variant={requestFilter === 'pending-deletions' ? "contained" : "outlined"}
            onClick={() => setRequestFilter('pending-deletions')}
            size="small"
            color="error"
            sx={{ borderRadius: 2 }}
            startIcon={
              <Badge badgeContent={getPendingDeleteCount()} color="error">
                <span></span>
              </Badge>
            }
          >
            Delete Requests
          </Button>
          <Button 
            variant={requestFilter === 'deactivated' ? "contained" : "outlined"}
            onClick={() => setRequestFilter('deactivated')}
            size="small"
            color="error"
            sx={{ borderRadius: 2 }}
            startIcon={
              <Badge badgeContent={getDeactivatedCount()} color="error">
                <WarningIcon />
              </Badge>
            }
          >
            Deactivated Accounts
          </Button>
        </Box>

        {/* Search and Controls */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#003047' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: 'white'
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={fetchCustomers}
              disabled={loading}
              sx={{
                bgcolor: '#003047',
                '&:hover': { bgcolor: '#003047' },
                borderRadius: 2,
                height: '56px',
                width: '100%',
                fontWeight: 600
              }}
            >
              {loading ? 'Loading...' : 'Refresh Data'}
            </Button>
          </Grid>
        </Grid>

        {/* Statistics Cards with accurate counts including deactivated */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: '#003047', fontWeight: 700 }}>
                  {customers.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Customers
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: '#4CAF50', fontWeight: 700 }}>
                  {customers.filter(c => c.isActive !== false).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Users
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: '#f44336', fontWeight: 700 }}>
                  {getDeactivatedCount()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Deactivated
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: '#2196F3', fontWeight: 700 }}>
                  {getFilteredCustomers().length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {requestFilter === 'all' ? 'All Customers' : 'Filtered Results'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Customers Table with deletion reason column */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 0 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : getFilteredCustomers().length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  {requestFilter === 'all' ? 'No customers found' : 'No customers match the current filter'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {customers.length > 0 && requestFilter !== 'all' 
                    ? 'Try selecting "All Customers" or changing your search term'
                    : 'Customers will appear here once they register'
                  }
                </Typography>
              </Box>
            ) : (
              <StyledTableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <HeaderCell>Customer Details</HeaderCell>
                      <HeaderCell>Contact Information</HeaderCell>
                      <HeaderCell>Location</HeaderCell>
                      <HeaderCell>Registration Date</HeaderCell>
                      <HeaderCell>Status</HeaderCell>
                      <HeaderCell>Request Status</HeaderCell>
                      <HeaderCell>Last Updated</HeaderCell>
                      <HeaderCell>Deleted At</HeaderCell>
                      <HeaderCell>Deletion Reason</HeaderCell> {/* NEW COLUMN */}
                      <HeaderCell align="center">Actions</HeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {getFilteredCustomers().map(customer => (
                      <StyledTableRow 
                        key={customer._id}
                        isActive={customer.isActive !== false}
                        selected={selectedCustomerId === customer._id}
                        onClick={() => setSelectedCustomerId(customer._id)}
                        sx={{ 
                          cursor: 'pointer',
                          // Highlight rows with pending requests or deactivated accounts
                          ...(customer.pendingUpdates?.status === 'pending' && {
                            bgcolor: customer.pendingUpdates.deleteRequested ? 
                              'rgba(244, 67, 54, 0.08)' : 
                              'rgba(255, 152, 0, 0.08)',
                            '&:hover': {
                              bgcolor: customer.pendingUpdates.deleteRequested ? 
                                'rgba(244, 67, 54, 0.12)' : 
                                'rgba(255, 152, 0, 0.12)'
                            }
                          }),
                          ...(customer.isActive === false && {
                            bgcolor: 'rgba(244, 67, 54, 0.05)',
                            '&:hover': {
                              bgcolor: 'rgba(244, 67, 54, 0.10)'
                            }
                          })
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: customer.isActive !== false ? '#003047' : '#666',
                                mr: 2,
                                width: 48,
                                height: 48
                              }}
                            >
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003047' }}>
                                {customer.fullName || 'N/A'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Customer ID: {customer.customerId || customer._id.slice(-6)}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <EmailIcon sx={{ fontSize: 16, mr: 1, color: '#003047' }} />
                              <Typography variant="body2">{customer.emailAddress}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PhoneIcon sx={{ fontSize: 16, mr: 1, color: '#003047' }} />
                              <Typography variant="body2">{customer.mobileNumber || 'N/A'}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationIcon sx={{ fontSize: 16, mr: 1, color: '#003047' }} />
                            <Box>
                              <Typography variant="body2">
                                {customer.currentAddress ? customer.currentAddress.split(',')[0] : 'N/A'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                {customer.currentAddress?.substring(0, 30)}{customer.currentAddress?.length > 30 ? '...' : ''}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <DateIcon sx={{ fontSize: 16, mr: 1, color: '#003047' }} />
                            <Typography variant="body2">{formatDate(customer.createdAt)}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {getStatusChip(customer)}
                        </TableCell>
                        <TableCell>
                          {getRequestLabel(customer)}
                        </TableCell>
                        <TableCell>
                          {customer.updatedAt ? formatDate(customer.updatedAt) : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {customer.deletedAt ? formatDate(customer.deletedAt) : 'N/A'}
                        </TableCell>
                        <TableCell> {/* NEW DELETION REASON COLUMN */}
                          {customer.deletionReason ? (
                            <Box sx={{ maxWidth: 200 }}>
                              <Typography variant="body2" sx={{ 
                                fontSize: '0.875rem',
                                color: 'error.main',
                                fontStyle: 'italic'
                              }}>
                                {customer.deletionReason.length > 50 
                                  ? `${customer.deletionReason.substring(0, 50)}...` 
                                  : customer.deletionReason}
                              </Typography>
                            </Box>
                          ) : 'N/A'}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewCustomer(customer);
                            }}
                            sx={{ color: '#003047' }}
                          >
                            <ViewIcon />
                          </IconButton>
                          {/* Action buttons with better conditional rendering */}
                          {customer.pendingUpdates?.status === 'pending' && (
                            <>
                              <IconButton 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('🟢 Approve button clicked for:', customer.fullName);
                                  setSelectedCustomer(customer);
                                  setActionType('approve');
                                  setActionDialogOpen(true);
                                }}
                                sx={{ color: 'green' }}
                                title={`Approve ${customer.pendingUpdates.deleteRequested ? 'deletion' : 'update'} request`}
                              >
                                <CheckCircleIcon />
                              </IconButton>
                              <IconButton 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('🔴 Reject button clicked for:', customer.fullName);
                                  setSelectedCustomer(customer);
                                  setActionType('reject');
                                  setActionReason('');
                                  setActionDialogOpen(true);
                                }}
                                sx={{ color: 'red' }}
                                title={`Reject ${customer.pendingUpdates.deleteRequested ? 'deletion' : 'update'} request`}
                              >
                                <CancelIcon />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            )}
          </CardContent>
        </Card>

        {/* Customer Details Dialog with enhanced deletion reason display */}
        <Dialog 
          open={detailsDialog.open} 
          onClose={() => setDetailsDialog({ open: false, customer: null })}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              boxShadow: '0 20px 60px rgba(0,48,71,0.2)',
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              background: 'linear-gradient(135deg, #003047 0%, #219ebc 100%)',
              color: 'white', 
              fontWeight: 700,
              p: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}
          >
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
              <PersonIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                Customer Details
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {detailsDialog.customer?.isActive === false ? 
                  '🚫 Account Deactivated' :
                  detailsDialog.customer?.pendingUpdates?.status === 'pending' ? 
                    (detailsDialog.customer?.pendingUpdates?.deleteRequested ? 
                      '⚠️ Account Deletion Request Pending' : 
                      '⚠️ Profile Update Request Pending') : 
                    'Complete customer information'}
              </Typography>
            </Box>
          </DialogTitle>
          
          <DialogContent sx={{ p: 0 }}>
            {detailsDialog.customer && (
              <Box>
                {/* Enhanced alert banner for deactivated accounts */}
                {detailsDialog.customer.isActive === false && (
                  <Box sx={{ p: 3, bgcolor: '#ffebee' }}>
                    <Alert 
                      severity="error"
                      sx={{ mb: 2 }}
                      icon={<WarningIcon />}
                    >
                      <AlertTitle sx={{ fontWeight: 700 }}>
                        Account Deactivated
                      </AlertTitle>
                      <Typography variant="body2">
                        This customer account has been deactivated and the user cannot log in.
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                        Deactivation date: {formatDate(detailsDialog.customer.deletedAt)}
                      </Typography>
                      
                      {detailsDialog.customer.deletionReason && (
                        <Box sx={{ mt: 1, p: 2, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Deletion Reason:</Typography>
                          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                            "{detailsDialog.customer.deletionReason}"
                          </Typography>
                        </Box>
                      )}
                    </Alert>
                  </Box>
                )}

                {/* Alert banner for pending requests */}
                {detailsDialog.customer.pendingUpdates?.status === 'pending' && (
                  <Box sx={{ p: 3, bgcolor: detailsDialog.customer.pendingUpdates.deleteRequested ? '#ffebee' : '#fff8e1' }}>
                    <Alert 
                      severity={detailsDialog.customer.pendingUpdates.deleteRequested ? "error" : "warning"}
                      sx={{ mb: 2 }}
                      icon={detailsDialog.customer.pendingUpdates.deleteRequested ? <DeleteIcon /> : <UpdateIcon />}
                    >
                      <AlertTitle sx={{ fontWeight: 700 }}>
                        {detailsDialog.customer.pendingUpdates.deleteRequested ? 
                          "Account Deletion Request" : 
                          "Profile Update Request"}
                      </AlertTitle>
                      <Typography variant="body2">
                        {detailsDialog.customer.pendingUpdates.deleteRequested ?
                          "This customer has requested to delete their account." :
                          "This customer has requested changes to their profile information."}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
                        Request date: {formatDate(detailsDialog.customer.pendingUpdates.requestedAt)}
                      </Typography>
                      
                      {/* Show fields being updated */}
                      {!detailsDialog.customer.pendingUpdates.deleteRequested && 
                       detailsDialog.customer.pendingUpdates.fields &&
                       Object.keys(detailsDialog.customer.pendingUpdates.fields).length > 0 && (
                        <Box sx={{ mt: 1, p: 2, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Fields being updated:</Typography>
                          <Typography variant="body2">
                            {Object.keys(detailsDialog.customer.pendingUpdates.fields).join(', ')}
                          </Typography>
                        </Box>
                      )}
                      
                      {detailsDialog.customer.pendingUpdates.reason && (
                        <Box sx={{ mt: 1, p: 2, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Reason provided:</Typography>
                          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                            "{detailsDialog.customer.pendingUpdates.reason}"
                          </Typography>
                        </Box>
                      )}
                      
                      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button 
                          variant="contained" 
                          color="success"
                          onClick={() => {
                            console.log('🟢 Approve clicked from dialog for:', detailsDialog.customer.fullName);
                            setSelectedCustomer(detailsDialog.customer);
                            setActionType('approve');
                            setActionDialogOpen(true);
                          }}
                          startIcon={<CheckCircleIcon />}
                        >
                          Approve Request
                        </Button>
                        <Button 
                          variant="contained" 
                          color="error"
                          onClick={() => {
                            console.log('🔴 Reject clicked from dialog for:', detailsDialog.customer.fullName);
                            setSelectedCustomer(detailsDialog.customer);
                            setActionType('reject');
                            setActionReason('');
                            setActionDialogOpen(true);
                          }}
                          startIcon={<CancelIcon />}
                        >
                          Reject Request
                        </Button>
                      </Box>
                    </Alert>
                  </Box>
                )}

                {/* Customer Header Section */}
                <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: detailsDialog.customer.isActive === false ? '#666' : '#003047',
                        width: 80,
                        height: 80,
                        fontSize: '2rem',
                        boxShadow: '0 8px 24px rgba(0,48,71,0.3)'
                      }}
                    >
                      {detailsDialog.customer.fullName?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#003047', mb: 1 }}>
                        {detailsDialog.customer.fullName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Chip 
                          label={`ID: ${detailsDialog.customer.customerId || detailsDialog.customer._id.slice(-6)}`}
                          variant="outlined"
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                        {getStatusChip(detailsDialog.customer)}
                        {detailsDialog.customer.pendingUpdates?.status === 'pending' && (
                          <Chip 
                            label="Pending Request"
                            color={detailsDialog.customer.pendingUpdates.deleteRequested ? "error" : "warning"}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Member since {formatDate(detailsDialog.customer.createdAt)}
                      </Typography>
                      {detailsDialog.customer.isActive === false && detailsDialog.customer.deletedAt && (
                        <Typography variant="body2" color="error.main" sx={{ fontWeight: 500 }}>
                          Account deactivated on {formatDate(detailsDialog.customer.deletedAt)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Details Section */}
                <Box sx={{ p: 4 }}>
                  <Grid container spacing={4}>
                    {/* Contact Information */}
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#003047', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon sx={{ color: '#219ebc' }} />
                        Contact Information
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Card sx={{ 
                            p: 3, 
                            borderRadius: 3, 
                            bgcolor: '#f8f9fa', 
                            border: '1px solid #e9ecef',
                            // Highlight if this field has pending updates
                            ...(detailsDialog.customer.pendingUpdates?.fields?.emailAddress && {
                              boxShadow: '0 0 0 2px #ffb74d'
                            })
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <EmailIcon sx={{ color: '#003047', fontSize: 20 }} />
                              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                Email Address
                                {detailsDialog.customer.pendingUpdates?.fields?.emailAddress && (
                                  <Chip 
                                    label="Change Requested" 
                                    size="small" 
                                    color="warning" 
                                    sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                                  />
                                )}
                              </Typography>
                            </Box>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                fontWeight: 500, 
                                wordBreak: 'break-word'
                              }}
                            >
                              {detailsDialog.customer.emailAddress}
                              
                              {/* Show the pending value if it exists */}
                              {detailsDialog.customer.pendingUpdates?.fields?.emailAddress && (
                                <Box sx={{ 
                                  mt: 1, 
                                  p: 1, 
                                  borderRadius: 1, 
                                  bgcolor: '#fff3e0', 
                                  borderLeft: '3px solid #ff9800',
                                  fontSize: '0.875rem'
                                }}>
                                  <Typography variant="caption" sx={{ color: '#e65100', fontWeight: 600, display: 'block' }}>
                                    Pending Change:
                                  </Typography>
                                  {detailsDialog.customer.pendingUpdates.fields.emailAddress}
                                </Box>
                              )}
                            </Typography>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Card sx={{ 
                            p: 3, 
                            borderRadius: 3, 
                            bgcolor: '#f8f9fa', 
                            border: '1px solid #e9ecef',
                            // Highlight if this field has pending updates
                            ...(detailsDialog.customer.pendingUpdates?.fields?.mobileNumber && {
                              boxShadow: '0 0 0 2px #ffb74d'
                            })
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <PhoneIcon sx={{ color: '#003047', fontSize: 20 }} />
                              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                Mobile Number
                                {detailsDialog.customer.pendingUpdates?.fields?.mobileNumber && (
                                  <Chip 
                                    label="Change Requested" 
                                    size="small" 
                                    color="warning" 
                                    sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                                  />
                                )}
                              </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {detailsDialog.customer.mobileNumber || 'Not provided'}
                              
                              {/* Show the pending value if it exists */}
                              {detailsDialog.customer.pendingUpdates?.fields?.mobileNumber && (
                                <Box sx={{ 
                                  mt: 1, 
                                  p: 1, 
                                  borderRadius: 1, 
                                  bgcolor: '#fff3e0', 
                                  borderLeft: '3px solid #ff9800',
                                  fontSize: '0.875rem'
                                }}>
                                  <Typography variant="caption" sx={{ color: '#e65100', fontWeight: 600, display: 'block' }}>
                                    Pending Change:
                                  </Typography>
                                  {detailsDialog.customer.pendingUpdates.fields.mobileNumber}
                                </Box>
                              )}
                            </Typography>
                          </Card>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Personal Information */}
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#003047', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon sx={{ color: '#219ebc' }} />
                        Personal Information
                      </Typography>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Card sx={{ 
                            p: 3, 
                            borderRadius: 3, 
                            bgcolor: '#f8f9fa', 
                            border: '1px solid #e9ecef',
                            ...(detailsDialog.customer.pendingUpdates?.fields?.nicNumber && {
                              boxShadow: '0 0 0 2px #ffb74d'
                            })
                          }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                              National Identity Card (NIC)
                              {detailsDialog.customer.pendingUpdates?.fields?.nicNumber && (
                                <Chip 
                                  label="Change Requested" 
                                  size="small" 
                                  color="warning" 
                                  sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                                />
                              )}
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {detailsDialog.customer.nicNumber || 'Not provided'}
                              
                              {detailsDialog.customer.pendingUpdates?.fields?.nicNumber && (
                                <Box sx={{ 
                                  mt: 1, 
                                  p: 1, 
                                  borderRadius: 1, 
                                  bgcolor: '#fff3e0', 
                                  borderLeft: '3px solid #ff9800',
                                  fontSize: '0.875rem'
                                }}>
                                  <Typography variant="caption" sx={{ color: '#e65100', fontWeight: 600, display: 'block' }}>
                                    Pending Change:
                                  </Typography>
                                  {detailsDialog.customer.pendingUpdates.fields.nicNumber}
                                </Box>
                              )}
                            </Typography>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <DateIcon sx={{ color: '#003047', fontSize: 20 }} />
                              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                Registration Date
                              </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {formatDate(detailsDialog.customer.createdAt)}
                            </Typography>
                          </Card>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Address Information */}
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#003047', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationIcon sx={{ color: '#219ebc' }} />
                        Address Information
                      </Typography>
                      <Card sx={{ 
                        p: 3, 
                        borderRadius: 3, 
                        bgcolor: '#f8f9fa', 
                        border: '1px solid #e9ecef',
                        // Highlight if this field has pending updates
                        ...(detailsDialog.customer.pendingUpdates?.fields?.currentAddress && {
                          boxShadow: '0 0 0 2px #ffb74d'
                        })
                      }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
                          Current Address
                          {detailsDialog.customer.pendingUpdates?.fields?.currentAddress && (
                            <Chip 
                              label="Change Requested" 
                              size="small" 
                              color="warning" 
                              sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                            />
                          )}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.6 }}>
                          {detailsDialog.customer.currentAddress || 'Not provided'}
                          
                          {/* Show the pending value if it exists */}
                          {detailsDialog.customer.pendingUpdates?.fields?.currentAddress && (
                            <Box sx={{ 
                              mt: 1, 
                              p: 1, 
                              borderRadius: 1, 
                              bgcolor: '#fff3e0', 
                              borderLeft: '3px solid #ff9800',
                              fontSize: '0.875rem'
                            }}>
                              <Typography variant="caption" sx={{ color: '#e65100', fontWeight: 600, display: 'block' }}>
                                Pending Change:
                              </Typography>
                              {detailsDialog.customer.pendingUpdates.fields.currentAddress}
                            </Box>
                          )}
                        </Typography>
                      </Card>
                    </Grid>

                    {/* Account Deletion Information */}
                    {detailsDialog.customer.isActive === false && (
                      <Grid item xs={12}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#d32f2f', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <WarningIcon sx={{ color: '#d32f2f' }} />
                          Account Deletion Information
                        </Typography>
                        <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#ffebee', border: '1px solid #ffcdd2' }}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                                Deletion Date
                              </Typography>
                              <Typography variant="body1" sx={{ fontWeight: 500, color: '#d32f2f' }}>
                                {formatDate(detailsDialog.customer.deletedAt)}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                                Deletion Reason
                              </Typography>
                              <Typography variant="body1" sx={{ 
                                fontWeight: 500, 
                                color: '#d32f2f',
                                fontStyle: 'italic',
                                backgroundColor: 'rgba(255,255,255,0.7)',
                                padding: 2,
                                borderRadius: 1,
                                border: '1px solid #ffcdd2'
                              }}>
                                {detailsDialog.customer.deletionReason || 'No reason provided'}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Card>
                      </Grid>
                    )}
                    
                    {/* Account Timeline with more events */}
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#003047', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <HistoryIcon sx={{ color: '#219ebc' }} />
                        Account Timeline
                      </Typography>
                      <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                        <Timeline position="alternate" sx={{ p: 0 }}>
                          <TimelineItem>
                            <TimelineSeparator>
                              <TimelineDot color="primary" />
                              <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                              <Typography variant="subtitle2" component="span" sx={{ fontWeight: 600 }}>
                                Account Created
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {formatDate(detailsDialog.customer.createdAt)}
                              </Typography>
                            </TimelineContent>
                          </TimelineItem>
                          
                          {detailsDialog.customer.updatedAt && detailsDialog.customer.updatedAt !== detailsDialog.customer.createdAt && (
                            <TimelineItem>
                              <TimelineSeparator>
                                <TimelineDot color="info" />
                                <TimelineConnector />
                              </TimelineSeparator>
                              <TimelineContent>
                                <Typography variant="subtitle2" component="span" sx={{ fontWeight: 600 }}>
                                  Last Updated
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {formatDate(detailsDialog.customer.updatedAt)}
                                </Typography>
                              </TimelineContent>
                            </TimelineItem>
                          )}
                          
                          {detailsDialog.customer.pendingUpdates?.requestedAt && (
                            <TimelineItem>
                              <TimelineSeparator>
                                <TimelineDot color="warning" />
                                <TimelineConnector />
                              </TimelineSeparator>
                              <TimelineContent>
                                <Typography variant="subtitle2" component="span" sx={{ fontWeight: 600 }}>
                                  {detailsDialog.customer.pendingUpdates.deleteRequested ? 
                                    'Deletion Requested' : 
                                    'Update Requested'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {formatDate(detailsDialog.customer.pendingUpdates.requestedAt)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                  Status: {detailsDialog.customer.pendingUpdates.status}
                                </Typography>
                              </TimelineContent>
                            </TimelineItem>
                          )}
                          
                          {detailsDialog.customer.deletedAt && (
                            <TimelineItem>
                              <TimelineSeparator>
                                <TimelineDot color="error" />
                              </TimelineSeparator>
                              <TimelineContent>
                                <Typography variant="subtitle2" component="span" sx={{ fontWeight: 600 }}>
                                  Account Deactivated
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {formatDate(detailsDialog.customer.deletedAt)}
                                </Typography>
                                {detailsDialog.customer.deletionReason && (
                                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    Reason: {detailsDialog.customer.deletionReason}
                                  </Typography>
                                )}
                              </TimelineContent>
                            </TimelineItem>
                          )}
                        </Timeline>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}
          </DialogContent>
          
          <DialogActions sx={{ p: 3, bgcolor: '#f8f9fa', borderTop: '1px solid #e9ecef' }}>
            <Button 
              onClick={() => setDetailsDialog({ open: false, customer: null })}
              variant="contained"
              size="large"
              sx={{ 
                bgcolor: '#003047', 
                '&:hover': { bgcolor: '#002639' },
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(0,48,71,0.3)'
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Action Confirmation Dialog with better validation */}
        <Dialog
          open={actionDialogOpen}
          onClose={() => !actionLoading && setActionDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ 
            bgcolor: actionType === 'approve' ? '#4caf50' : '#f44336', 
            color: 'white', 
            fontWeight: 700 
          }}>
            {actionType === 'approve' ? 'Approve Request' : 'Reject Request'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3, mt: 1 }}>
            {selectedCustomer && (
              <>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Are you sure you want to {actionType === 'approve' ? 'approve' : 'reject'} the 
                  {selectedCustomer.pendingUpdates?.deleteRequested ? ' account deletion' : ' profile update'} 
                  request for <strong>{selectedCustomer.fullName}</strong>?
                </Typography>
                
                {/* Show what fields will be updated for approval */}
                {actionType === 'approve' && !selectedCustomer.pendingUpdates?.deleteRequested && 
                 selectedCustomer.pendingUpdates?.fields && (
                  <Box sx={{ mb: 2, p: 2, bgcolor: '#e8f5e9', borderRadius: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Fields that will be updated:
                    </Typography>
                    <Typography variant="body2">
                      {Object.keys(selectedCustomer.pendingUpdates.fields).join(', ')}
                    </Typography>
                  </Box>
                )}
                
                {actionType === 'reject' && (
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Rejection Reason"
                    fullWidth
                    multiline
                    rows={3}
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    required
                    error={actionReason.trim() === ''}
                    helperText={actionReason.trim() === '' ? 'Please provide a reason for rejection' : ''}
                    disabled={actionLoading}
                  />
                )}
                
                {actionType === 'approve' && selectedCustomer.pendingUpdates?.deleteRequested && (
                  <Alert severity="warning" sx={{ mt: 2 }}>
                    <AlertTitle>Warning</AlertTitle>
                    Approving this request will deactivate the customer account. The customer will not be able to log in after this action.
                  </Alert>
                )}
                
                {actionType === 'approve' && !selectedCustomer.pendingUpdates?.deleteRequested && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    <AlertTitle>Information</AlertTitle>
                    Approving this request will update the customer's profile with their requested changes.
                  </Alert>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setActionDialogOpen(false)}
              disabled={actionLoading}
              sx={{ minWidth: 80 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => selectedCustomer && handleUpdateAction(selectedCustomer._id, actionType === 'approve')}
              variant="contained"
              color={actionType === 'approve' ? 'success' : 'error'}
              disabled={actionLoading || (actionType === 'reject' && actionReason.trim() === '')}
              startIcon={actionLoading ? <CircularProgress size={20} /> : null}
              sx={{ minWidth: 120 }}
            >
              {actionLoading ? 'Processing...' : (actionType === 'approve' ? 'Approve' : 'Reject')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Footer />
    </Box>
  );
};

export default UserManagementAdmin;