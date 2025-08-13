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
  overflow: 'auto',
  border: '1px solid rgba(7, 91, 94, 0.1)',
  '& .MuiTable-root': {
    minWidth: 1100,
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

const StyledTableRow = styled(TableRow)(({ theme, isActive }) => ({
  backgroundColor: isActive ? theme.palette.action.selected : theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  transition: 'transform .15s ease, box-shadow .15s ease',
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

  const handleViewCustomer = (customer) => {
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
                        {getStatusChip(customer.isActive !== false)}
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
                      </TableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </CardContent>
        </Card>

        {/* Enhanced Customer Details Dialog - Read Only */}
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
                Complete customer information
              </Typography>
            </Box>
          </DialogTitle>
          
          <DialogContent sx={{ p: 0 }}>
            {detailsDialog.customer && (
              <Box>
                {/* Customer Header Section */}
                <Box sx={{ p: 3, bgcolor: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: '#003047',
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
                        {getStatusChip(detailsDialog.customer.isActive !== false)}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Member since {formatDate(detailsDialog.customer.createdAt)}
                      </Typography>
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
                          <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <EmailIcon sx={{ color: '#003047', fontSize: 20 }} />
                              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                Email Address
                              </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-word' }}>
                              {detailsDialog.customer.emailAddress}
                            </Typography>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <PhoneIcon sx={{ color: '#003047', fontSize: 20 }} />
                              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                Mobile Number
                              </Typography>
                            </Box>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {detailsDialog.customer.mobileNumber || 'Not provided'}
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
                          <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                              National Identity Card (NIC)
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {detailsDialog.customer.nicNumber || 'Not provided'}
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
                      <Card sx={{ p: 3, borderRadius: 3, bgcolor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600, mb: 1 }}>
                          Current Address
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.6 }}>
                          {detailsDialog.customer.currentAddress || 'Not provided'}
                        </Typography>
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
      </Container>
      <Footer />
    </Box>
  );
};

export default UserManagementAdmin;