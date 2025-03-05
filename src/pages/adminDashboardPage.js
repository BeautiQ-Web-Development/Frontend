// import React, { useEffect, useState } from 'react';
// import { Box, Typography, Container } from '@mui/material';
// import { useAuth } from '../context/AuthContext';
// import Header from '../components/Header';
// import Footer from '../components/footer';

// const AdminDashboard = () => {
//   const { user } = useAuth();
//   const [dashboardData, setDashboardData] = useState(null);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/admin/dashboard', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${user.token}`,
//             'Content-Type': 'application/json'
//           }
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           setDashboardData(data);
//         }
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//       }
//     };

//     if (user?.token) {
//       fetchDashboardData();
//     }
//   }, [user]);

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//       <Header />
//       <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
//         <Typography variant="h4" component="h1" gutterBottom>
//           Admin Dashboard
//         </Typography>
//         {dashboardData && (
//           // Display dashboard data here
//           <Box>
//             {/* Add your dashboard content */}
//           </Box>
//         )}
//       </Container>
//       <Footer />
//     </Box>
//   );
// };

// export default AdminDashboard;


import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  AppBar,
  Toolbar
} from '@mui/material';
import { 
  CheckCircle as ApproveIcon, 
  Cancel as RejectIcon,
  Notifications as NotificationIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Store as StoreIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/footer';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pendingProviders, setPendingProviders] = useState([]);
  const [approvedProviders, setApprovedProviders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // Fetch pending service providers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || (user && user.token);
        
        // Fetch pending service providers
        const pendingRes = await axios.get('http://localhost:5000/api/auth/pending-providers', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setPendingProviders(pendingRes.data.pendingProviders || []);
        
        // Fetch other data (if needed)
        // For demo purposes, we'll use mock data
        setApprovedProviders([
          { _id: '1', fullName: 'Jane Doe Salon', businessName: 'JD Beauty', emailAddress: 'jane@example.com' },
          { _id: '2', fullName: 'Mike Smith', businessName: 'Mike\'s Barber Shop', emailAddress: 'mike@example.com' }
        ]);
        
        setCustomers([
          { _id: '1', fullName: 'John Customer', emailAddress: 'john@example.com' },
          { _id: '2', fullName: 'Alice User', emailAddress: 'alice@example.com' },
          { _id: '3', fullName: 'Bob Client', emailAddress: 'bob@example.com' }
        ]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again.');
        setSnackbarOpen(true);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  const handleApprove = (provider) => {
    setSelectedProvider(provider);
    setDialogOpen(true);
  };
  
  const confirmApproval = async () => {
    try {
      const token = localStorage.getItem('token') || (user && user.token);
      
      await axios.put(
        `http://localhost:5000/api/auth/approve-provider/${selectedProvider._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update state to remove from pending
      setPendingProviders(prevProviders => 
        prevProviders.filter(p => p._id !== selectedProvider._id)
      );
      
      // Add to approved providers
      setApprovedProviders(prevProviders => [...prevProviders, selectedProvider]);
      
      setSuccess(`${selectedProvider.businessName || selectedProvider.fullName} has been approved successfully!`);
      setSnackbarOpen(true);
      setDialogOpen(false);
    } catch (err) {
      console.error('Error approving provider:', err);
      setError('Failed to approve provider. Please try again.');
      setSnackbarOpen(true);
      setDialogOpen(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Custom AppBar with Logout */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BeautiQ Admin Dashboard
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
          Welcome, {user?.fullName || 'Admin'}
        </Typography>
        
        {/* Dashboard Summary */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#e3f2fd', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div">
                    Customers
                  </Typography>
                  <PeopleIcon color="primary" />
                </Box>
                <Typography variant="h3" component="div" sx={{ mt: 2 }}>
                  {customers.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#e8f5e9', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div">
                    Service Providers
                  </Typography>
                  <StoreIcon color="success" />
                </Box>
                <Typography variant="h3" component="div" sx={{ mt: 2 }}>
                  {approvedProviders.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#fff8e1', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div">
                    Pending Approvals
                  </Typography>
                  <NotificationIcon color="warning" />
                </Box>
                <Typography variant="h3" component="div" sx={{ mt: 2 }}>
                  {pendingProviders.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#f3e5f5', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div">
                    Total Users
                  </Typography>
                  <DashboardIcon color="secondary" />
                </Box>
                <Typography variant="h3" component="div" sx={{ mt: 2 }}>
                  {customers.length + approvedProviders.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Pending Approvals Section */}
        <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
          Pending Service Provider Approvals
        </Typography>
        
        {pendingProviders.length === 0 ? (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="body1">No pending approvals at this time.</Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><Typography fontWeight="bold">Business Name</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Owner Name</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Email</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Phone</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Services</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold">Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingProviders.map((provider) => (
                  <TableRow key={provider._id} hover>
                    <TableCell>{provider.businessName}</TableCell>
                    <TableCell>{provider.fullName}</TableCell>
                    <TableCell>{provider.emailAddress}</TableCell>
                    <TableCell>{provider.mobileNumber}</TableCell>
                    <TableCell>
                      {provider.services && provider.services.map((service, idx) => (
                        <Chip 
                          key={idx} 
                          label={service.name} 
                          size="small" 
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        color="success" 
                        onClick={() => handleApprove(provider)}
                        title="Approve"
                      >
                        <ApproveIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {/* Approved Providers Section */}
        <Typography variant="h5" sx={{ mb: 2 }}>
          Approved Service Providers
        </Typography>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell><Typography fontWeight="bold">Business Name</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Owner Name</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Email</Typography></TableCell>
                <TableCell><Typography fontWeight="bold">Status</Typography></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {approvedProviders.map((provider) => (
                <TableRow key={provider._id} hover>
                  <TableCell>{provider.businessName}</TableCell>
                  <TableCell>{provider.fullName}</TableCell>
                  <TableCell>{provider.emailAddress}</TableCell>
                  <TableCell>
                    <Chip 
                      label="Approved" 
                      color="success" 
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {/* Approval Confirmation Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          aria-labelledby="approval-dialog-title"
          aria-describedby="approval-dialog-description"
        >
          <DialogTitle id="approval-dialog-title">
            Confirm Service Provider Approval
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="approval-dialog-description">
              Are you sure you want to approve {selectedProvider?.businessName || selectedProvider?.fullName}? 
              Once approved, they will be notified and can start providing services.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={confirmApproval} color="primary" autoFocus>
              Approve
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Success/Error Snackbar */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={success ? "success" : "error"} 
            sx={{ width: '100%' }}
          >
            {success || error}
          </Alert>
        </Snackbar>
      </Container>
      <Footer />
    </Box>
  );
};

export default AdminDashboard;