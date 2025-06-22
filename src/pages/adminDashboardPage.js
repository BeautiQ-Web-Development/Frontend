import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  People as PeopleIcon,
  Store as StoreIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { 
  getPendingProviders, 
  getApprovedProviders, 
  getUserCounts,
  approveServiceProvider 
} from '../services/auth';
import Header from '../components/Header';
import Footer from '../components/footer';

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const ProviderDetailsDialog = ({ open, onClose, provider, onApprove }) => {
  if (!provider) {
    return null; // Don't render if provider is undefined
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ color: '#075B5E', fontWeight: 'bold' }}>
          Service Provider Details
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Business Information
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Business Name:</strong> {provider.businessName || 'N/A'}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Owner Name:</strong> {provider.fullName || 'N/A'}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Email:</strong> {provider.emailAddress || 'N/A'}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Phone:</strong> {provider.phoneNumber || 'N/A'}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Address:</strong> {provider.address || 'N/A'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Professional Details
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Experience:</strong> {provider.experience?.years || 'N/A'} years
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Specialties:</strong> {provider.specialties?.join(', ') || 'N/A'}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Languages:</strong> {provider.languages?.join(', ') || 'N/A'}
            </Typography>
          </Grid>

          {/* Documents Section */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Uploaded Documents
            </Typography>
            <Grid container spacing={2}>
              {provider.profilePhoto && (
                <Grid item xs={6} md={3}>
                  <Box>
                    <Typography variant="caption" display="block">Profile Photo</Typography>
                    <img 
                      src={provider.profilePhoto} 
                      alt="Profile" 
                      style={{ width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 8 }}
                    />
                  </Box>
                </Grid>
              )}
              {provider.nicFrontPhoto && (
                <Grid item xs={6} md={3}>
                  <Box>
                    <Typography variant="caption" display="block">NIC Front</Typography>
                    <img 
                      src={provider.nicFrontPhoto} 
                      alt="NIC Front" 
                      style={{ width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 8 }}
                    />
                  </Box>
                </Grid>
              )}
              {provider.nicBackPhoto && (
                <Grid item xs={6} md={3}>
                  <Box>
                    <Typography variant="caption" display="block">NIC Back</Typography>
                    <img 
                      src={provider.nicBackPhoto} 
                      alt="NIC Back" 
                      style={{ width: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 8 }}
                    />
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
        <Button 
          onClick={() => onApprove(provider._id)} 
          variant="contained"
          sx={{ 
            backgroundColor: '#075B5E',
            '&:hover': { backgroundColor: '#054548' }
          }}
        >
          Approve Provider
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const AdminDashboard = () => {
  const [customerCount, setCustomerCount] = useState(0);
  const [serviceProviderCount, setServiceProviderCount] = useState(0);
  const [pendingApprovalCount, setPendingApprovalCount] = useState(0);
  const [totalUserCount, setTotalUserCount] = useState(0);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [approvedProviders, setApprovedProviders] = useState([]);
  const [userCounts, setUserCounts] = useState({
    customers: 0,
    serviceProviders: 0,
    pendingApprovals: 0,
    totalUsers: 0
  });
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch user counts
      try {
        const countsResponse = await getUserCounts();
        console.log('User counts response:', countsResponse);
        if (countsResponse.success && countsResponse.data) {
          setUserCounts(countsResponse.data);
          setCustomerCount(countsResponse.data.customers || 0);
          setServiceProviderCount(countsResponse.data.serviceProviders || 0);
          setPendingApprovalCount(countsResponse.data.pendingProviders || 0);
          setTotalUserCount(countsResponse.data.totalUsers || 0);
        }
      } catch (countsError) {
        console.error('User counts endpoint not available:', countsError.message);
        // Keep default values if endpoint fails
      }

      // Fetch pending providers
      try {
        const pendingResponse = await getPendingProviders();
        console.log('Pending providers response:', pendingResponse);
        if (pendingResponse.success && pendingResponse.data) {
          setPendingProviders(pendingResponse.data);
          // Update pending count if user counts failed
          setPendingApprovalCount(pendingResponse.data.length);
          setUserCounts(prev => ({
            ...prev,
            pendingApprovals: pendingResponse.data.length
          }));
        }
      } catch (pendingError) {
        console.error('Error fetching pending providers:', pendingError);
      }

      // Fetch approved providers
      try {
        const approvedResponse = await getApprovedProviders();
        console.log('Approved providers response:', approvedResponse);
        if (approvedResponse.success && approvedResponse.data) {
          setApprovedProviders(approvedResponse.data);
          // Update service providers count if user counts failed
          setServiceProviderCount(approvedResponse.data.length);
          setUserCounts(prev => ({
            ...prev,
            serviceProviders: approvedResponse.data.length
          }));
        }
      } catch (approvedError) {
        console.error('Error fetching approved providers:', approvedError);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProvider = async (providerId) => {
    try {
      await approveServiceProvider(providerId);
      
      // Move provider from pending to approved
      const approvedProvider = pendingProviders.find(p => p._id === providerId);
      if (approvedProvider) {
        setPendingProviders(prev => prev.filter(p => p._id !== providerId));
        setApprovedProviders(prev => [...prev, { ...approvedProvider, approved: true }]);
        
        // Update counts
        setPendingApprovalCount(prev => prev - 1);
        setServiceProviderCount(prev => prev + 1);
        setUserCounts(prev => ({
          ...prev,
          pendingApprovals: prev.pendingApprovals - 1,
          serviceProviders: prev.serviceProviders + 1
        }));
      }
      
      setDialogOpen(false);
      setSelectedProvider(null);
    } catch (error) {
      console.error('Error approving provider:', error);
      setError('Failed to approve provider');
    }
  };

  const handleViewProvider = (provider) => {
    setSelectedProvider(provider);
    setDialogOpen(true);
  };

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card sx={{ minHeight: 120 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h3" component="div" color={`${color}.main`}>
              {loading ? <CircularProgress size={40} /> : value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: `${color}.main`, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary" fontWeight="bold">
          Welcome, Admin Dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Customers"
              value={userCounts.customers}
              icon={<PeopleIcon />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Service Providers"
              value={userCounts.serviceProviders}
              icon={<StoreIcon />}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending Approvals"
              value={userCounts.pendingApprovals}
              icon={<NotificationsIcon />}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Users"
              value={userCounts.totalUsers}
              icon={<DashboardIcon />}
              color="info"
            />
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Pending Providers" />
            <Tab label="Approved Providers" />
            <Tab label="Pending Services" />
            <Tab label="Service History" />
          </Tabs>
        </Box>

        {/* Pending Providers Tab */}
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
            Pending Service Provider Approvals
          </Typography>
          
          {pendingProviders.length === 0 ? (
            <Alert severity="info">
              No pending approvals at this time.
            </Alert>
          ) : (
            <TableContainer component={Paper} sx={{ mb: 4, border: '2px solid #e0e0e0' }}>
              <Table>
                <TableHead sx={{ bgcolor: 'primary.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Business</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>City</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date Applied</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingProviders.map((provider) => (
                    <TableRow 
                      key={provider._id}
                      hover
                      sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                      onClick={() => handleViewProvider(provider)}
                      style={{ cursor: 'pointer' }}
                    >
                      <TableCell>{provider.fullName}</TableCell>
                      <TableCell>{provider.emailAddress}</TableCell>
                      <TableCell>{provider.businessName || 'N/A'}</TableCell>
                      <TableCell>{provider.city || 'N/A'}</TableCell>
                      <TableCell>
                        {provider.createdAt ? new Date(provider.createdAt).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProvider(provider);
                          }}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApproveProvider(provider._id);
                          }}
                          color="success"
                        >
                          <CheckCircleIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        {/* Approved Providers Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
            Approved Service Providers
          </Typography>
          
          {approvedProviders.length === 0 ? (
            <Alert severity="info">
              No approved service providers yet.
            </Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ bgcolor: 'success.main' }}>
                  <TableRow>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Business</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>City</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {approvedProviders.map((provider) => (
                    <TableRow key={provider._id} hover>
                      <TableCell>{provider.fullName}</TableCell>
                      <TableCell>{provider.emailAddress}</TableCell>
                      <TableCell>{provider.businessName || 'N/A'}</TableCell>
                      <TableCell>{provider.city || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip label="Approved" color="success" size="small" />
                      </TableCell>
                      <TableCell>
                        <IconButton 
                          onClick={() => handleViewProvider(provider)}
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        {/* Other tabs content */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom>
            Pending Services
          </Typography>
          <Alert severity="info">
            This feature will be implemented soon.
          </Alert>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5" gutterBottom>
            Service History
          </Typography>
          <Alert severity="info">
            This feature will be implemented soon.
          </Alert>
        </TabPanel>
      </Container>

      <ProviderDetailsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        provider={selectedProvider}
        onApprove={handleApproveProvider}
      />

      <Footer />
    </Box>
  );
};

export default AdminDashboard;