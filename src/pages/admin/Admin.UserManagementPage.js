//frontendcode -  pages/admin/Admin.UserManagementPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Alert,
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
  Divider
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
  CalendarToday as DateIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/footer';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../services/auth';
import { styled } from '@mui/material/styles';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
  overflow: 'auto', // Changed from 'hidden' to 'auto'
  border: '1px solid rgba(7, 91, 94, 0.1)',
  // Set minimum width for horizontal scrolling
  '& .MuiTable-root': {
    minWidth: 1100,
  },
  // Enhanced scrollbar styling
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
      backgroundColor: 'rgba(0,48,71,0.5)',
    },
  },
  // Add smooth scrolling
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

const StyledTableRow = styled(TableRow)(({ theme, isActive }) => ({
  backgroundColor: isActive ? 'rgba(7, 91, 94, 0.05)' : 'white',
  '&:nth-of-type(odd)': {
    backgroundColor: isActive ? 'rgba(7, 91, 94, 0.08)' : 'rgba(7, 91, 94, 0.02)',
  },
  '&:hover': {
    backgroundColor: 'rgba(16, 16, 51, 0.12)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 8px rgba(21, 18, 59, 0.1)',
    transition: 'all 0.2s ease-in-out'
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

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/auth/customers');
      if (response.data.success) {
        setCustomers(response.data.customers || []);
      }
    } catch (error) {
      setError('Failed to fetch customers');
      console.error('Fetch customers error:', error);
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

  const filteredCustomers = customers.filter(customer =>
    customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.emailAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.mobileNumber?.includes(searchTerm)
  );

  const handleViewDetails = (customer) => {
    setDetailsDialog({ open: true, customer });
  };

  const getStatusChip = (isActive) => {
    return (
      <Chip
        label={isActive ? 'Active' : 'Inactive'}
        color={isActive ? 'success' : 'default'}
        size="small"
        sx={{ fontWeight: 600 }}
      />
    );
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
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

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

        {/* Statistics Cards */}
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
                <Typography variant="h4" sx={{ color: '#FF9800', fontWeight: 700 }}>
                  {customers.filter(c => {
                    const registrationDate = new Date(c.createdAt);
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    return registrationDate >= sevenDaysAgo;
                  }).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  New This Week
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <CardContent>
                <Typography variant="h4" sx={{ color: '#2196F3', fontWeight: 700 }}>
                  {filteredCustomers.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Search Results
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Customers Table */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 0 }}>
            <StyledTableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <HeaderCell>Customer Details</HeaderCell>
                    <HeaderCell>Contact Information</HeaderCell>
                    <HeaderCell>Location</HeaderCell>
                    <HeaderCell>Registration Date</HeaderCell>
                    <HeaderCell>Status</HeaderCell>
                    <HeaderCell align="center">Actions</HeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCustomers.map(customer => (
                    <StyledTableRow 
                      key={customer._id}
                      isActive={customer.isActive !== false}
                      selected={selectedCustomerId === customer._id}
                      onClick={() => setSelectedCustomerId(customer._id)}
                      sx={{ cursor: 'pointer' }}
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
                              Customer ID: {customer._id.slice(-6)}
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
                            <Typography variant="body2">{customer.city || 'N/A'}</Typography>
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
                        {getStatusChip(customer.isActive !== false)}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(customer);
                          }}
                          sx={{ color: '#003047' }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </CardContent>
        </Card>

        {/* Customer Details Dialog */}
        <Dialog 
          open={detailsDialog.open} 
          onClose={() => setDetailsDialog({ open: false, customer: null })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: '#003047', color: 'white', fontWeight: 700 }}>
            Customer Details
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {detailsDialog.customer && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {detailsDialog.customer.fullName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Email Address</Typography>
                  <Typography variant="body1">{detailsDialog.customer.emailAddress}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Mobile Number</Typography>
                  <Typography variant="body1">{detailsDialog.customer.mobileNumber || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">City</Typography>
                  <Typography variant="body1">{detailsDialog.customer.city || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Current Address</Typography>
                  <Typography variant="body1">{detailsDialog.customer.currentAddress || 'Not provided'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Registration Date</Typography>
                  <Typography variant="body1">{formatDate(detailsDialog.customer.createdAt)}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Account Status</Typography>
                  {getStatusChip(detailsDialog.customer.isActive !== false)}
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5' }}>
            <Button 
              onClick={() => setDetailsDialog({ open: false, customer: null })}
              variant="contained"
              sx={{ bgcolor: '#003047', '&:hover': { bgcolor: '#003047' } }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      <Footer />
    </Box>
  );
};

export default UserManagementAdmin;
