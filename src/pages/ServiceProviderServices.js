import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
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
  DialogActions,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  MoreVert as MoreVertIcon,
  Restore as RestoreIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ServiceProviderSidebar from '../components/ServiceProviderSidebar';
import Footer from '../components/footer';
import axios from 'axios';

const ServiceProviderServices = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuServiceId, setMenuServiceId] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/services/my-services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setServices(response.data.services || []);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to fetch services');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/service-provider-login');
  };

  const handleViewService = (service) => {
    setSelectedService(service);
    setViewDialogOpen(true);
    handleCloseMenu();
  };

  const handleEditService = (serviceId) => {
    navigate(`/service-provider/services/edit/${serviceId}`);
    handleCloseMenu();
  };

  const handleDeleteService = (service) => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
    handleCloseMenu();
  };

  const handleReactivateService = async (serviceId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/services/${serviceId}/reactivate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('Service reactivation request submitted for approval');
      setSnackbarOpen(true);
      fetchServices();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reactivate service');
      setSnackbarOpen(true);
    }
    handleCloseMenu();
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/services/${serviceToDelete._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccess('Service deletion request submitted for approval');
      setSnackbarOpen(true);
      setDeleteDialogOpen(false);
      fetchServices();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete service');
      setSnackbarOpen(true);
    }
  };

  const handleMenuOpen = (event, serviceId) => {
    setAnchorEl(event.currentTarget);
    setMenuServiceId(serviceId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuServiceId(null);
  };

  const getStatusChip = (service) => {
    const status = service.status;
    const hasChanges = !!service.pendingChanges;
    
    if (hasChanges) {
      const requestType = service.pendingChanges.requestType;
      return (
        <Chip 
          label={`${requestType} Pending`}
          size="small"
          sx={{ 
            bgcolor: '#FF9800', 
            color: 'white',
            fontWeight: 'bold'
          }}
        />
      );
    }
    
    switch (status) {
      case 'active':
        return <Chip label="Active" size="small" sx={{ bgcolor: '#4CAF50', color: 'white' }} />;
      case 'pending_approval':
        return <Chip label="Pending Approval" size="small" sx={{ bgcolor: '#FF9800', color: 'white' }} />;
      case 'rejected':
        return <Chip label="Rejected" size="small" sx={{ bgcolor: '#F44336', color: 'white' }} />;
      case 'inactive':
        return <Chip label="Inactive" size="small" sx={{ bgcolor: '#9E9E9E', color: 'white' }} />;
      default:
        return <Chip label={status} size="small" sx={{ bgcolor: '#9E9E9E', color: 'white' }} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Loading services...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ bgcolor: '#8B4B9C' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setSidebarOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#FFFFFF', fontWeight: 600 }}>
            My Services
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ color: '#FFFFFF', fontWeight: 600 }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <ServiceProviderSidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#2D1B3D' }}>
            My Services
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/service-provider/services/new')}
            sx={{ 
              bgcolor: '#8B4B9C',
              '&:hover': { bgcolor: '#6A3A75' },
              borderRadius: 3,
              px: 3
            }}
          >
            Add New Service
          </Button>
        </Box>

        {services.length === 0 ? (
          <Paper sx={{ 
            p: 4, 
            textAlign: 'center',
            bgcolor: '#F8F5F3',
            border: '2px dashed #E8B4CB',
            borderRadius: 3
          }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No services added yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Start by adding your first service to attract customers
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/service-provider/services/new')}
              sx={{ 
                bgcolor: '#8B4B9C',
                '&:hover': { bgcolor: '#6A3A75' }
              }}
            >
              Add Your First Service
            </Button>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ 
            border: '2px solid #8B4B9C',
            borderRadius: 3,
            boxShadow: '0 8px 25px rgba(139, 75, 156, 0.15)'
          }}>
            <Table>
              <TableHead sx={{ bgcolor: '#8B4B9C' }}>
                <TableRow>
                  <TableCell><Typography fontWeight="bold" sx={{ color: 'white' }}>Service Name</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold" sx={{ color: 'white' }}>Type</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold" sx={{ color: 'white' }}>Category</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold" sx={{ color: 'white' }}>Price</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold" sx={{ color: 'white' }}>Duration</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold" sx={{ color: 'white' }}>Status</Typography></TableCell>
                  <TableCell><Typography fontWeight="bold" sx={{ color: 'white' }}>Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.map((service) => (
                  <TableRow 
                    key={service._id}
                    hover
                    sx={{ '&:hover': { bgcolor: '#F5E1EA' } }}
                  >
                    <TableCell>
                      <Typography fontWeight="bold" sx={{ color: '#2D1B3D' }}>
                        {service.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{service.type}</TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>LKR {service.pricing?.basePrice?.toLocaleString()}</TableCell>
                    <TableCell>{service.duration} min</TableCell>
                    <TableCell>{getStatusChip(service)}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, service._id)}
                        sx={{ color: '#8B4B9C' }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && menuServiceId === service._id}
                        onClose={handleCloseMenu}
                      >
                        <MenuItem onClick={() => handleViewService(service)}>
                          <ViewIcon sx={{ mr: 1 }} /> View Details
                        </MenuItem>
                        <MenuItem onClick={() => handleEditService(service._id)}>
                          <EditIcon sx={{ mr: 1 }} /> Edit Service
                        </MenuItem>
                        {service.isVisibleToProvider ? (
                          <MenuItem 
                            onClick={() => handleDeleteService(service)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon sx={{ mr: 1 }} /> Delete Service
                          </MenuItem>
                        ) : (
                          <MenuItem 
                            onClick={() => handleReactivateService(service._id)}
                            sx={{ color: 'success.main' }}
                          >
                            <RestoreIcon sx={{ mr: 1 }} /> Reactivate Service
                          </MenuItem>
                        )}
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Fab
          color="primary"
          aria-label="add"
          onClick={() => navigate('/service-provider/services/new')}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            bgcolor: '#8B4B9C',
            '&:hover': { bgcolor: '#6A3A75' }
          }}
        >
          <AddIcon />
        </Fab>
      </Container>

      {/* Service Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#8B4B9C', color: 'white' }}>
          Service Details
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedService && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {selectedService.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {selectedService.type} • {selectedService.category}
                </Typography>
                {getStatusChip(selectedService)}
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight="bold">Base Price:</Typography>
                <Typography>LKR {selectedService.pricing?.basePrice?.toLocaleString()}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight="bold">Duration:</Typography>
                <Typography>{selectedService.duration} minutes</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight="bold">Description:</Typography>
                <Typography>{selectedService.description}</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight="bold">Service Location:</Typography>
                <Typography>
                  {selectedService.serviceLocation === 'home_service' ? 'Home Service Only' :
                   selectedService.serviceLocation === 'salon_only' ? 'Salon Only' :
                   'Both Home & Salon'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight="bold">Experience Level:</Typography>
                <Typography>{selectedService.experienceLevel}</Typography>
              </Grid>
              
              {selectedService.customNotes && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="bold">Custom Notes:</Typography>
                  <Typography>{selectedService.customNotes}</Typography>
                </Grid>
              )}
              
              {selectedService.preparationRequired && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="bold">Preparation Required:</Typography>
                  <Typography>{selectedService.preparationRequired}</Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Service Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{serviceToDelete?.name}"? 
            This action will be submitted for admin approval.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={success ? "success" : "error"}
          sx={{ width: '100%' }}
        >
          {success || error}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default ServiceProviderServices;
