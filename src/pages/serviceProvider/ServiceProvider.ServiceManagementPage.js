// //Frontend codes - serviceProvider/ServiceProvider.ServiceManagementPage.js
// import React, { useState, useEffect } from 'react';
// import { useLocation } from 'react-router-dom';
// import {
//   Box,
//   Container,
//   Typography,
//   Button,
//   Paper,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Grid,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Chip,
//   AppBar,
//   Toolbar,
//   Checkbox,
//   Divider // Add missing import
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   CheckCircle as ApprovedIcon,
//   Pending as PendingIcon,
//   Cancel as RejectedIcon,
//   Menu as MenuIcon,
//   Logout as LogoutIcon,
//   Visibility as ViewIcon // Add missing import
// } from '@mui/icons-material';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import Footer from '../../components/footer';
// import ServiceProviderSidebar from '../../components/ServiceProviderSidebar';
// import api from '../../services/auth';
// import { styled } from '@mui/material/styles';
// import SuccessDialog from '../../components/SuccessDialog';


// const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
//   borderRadius: theme.shape.borderRadius,
//   boxShadow: theme.shadows[3],
//   overflow: 'auto', // Changed from default to 'auto'
//   // Set minimum width for horizontal scrolling
//   '& .MuiTable-root': {
//     minWidth: 1400, // Wide enough for all columns
//   },
//   // Enhanced scrollbar styling
//   '&::-webkit-scrollbar': {
//     height: 8,
//     width: 8,
//   },
//   '&::-webkit-scrollbar-track': {
//     backgroundColor: 'rgba(0,0,0,0.05)',
//     borderRadius: 4,
//   },
//   '&::-webkit-scrollbar-thumb': {
//     backgroundColor: 'rgba(0,48,71,0.3)',
//     borderRadius: 4,
//     '&:hover': {
//       backgroundColor: '#00003f',
//     },
//   },
//   // Add smooth scrolling
//   scrollBehavior: 'smooth',
// }));

// const HeaderCell = styled(TableCell)(({ theme }) => ({
//   backgroundColor: theme.palette.primary.main,
//   color: theme.palette.common.white,
//   fontWeight: theme.typography.fontWeightBold,
// }));

// const ServiceManagement = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const { pathname } = useLocation();
//   const isServicesPage = pathname.endsWith('/services');

//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [services, setServices] = useState([]);
//   const [openServiceDialog, setOpenServiceDialog] = useState(false);
//   const [editingService, setEditingService] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [resignationDialogOpen, setResignationDialogOpen] = useState(false);
//   const [selectedServices, setSelectedServices] = useState([]);
//   const [successDialog, setSuccessDialog] = useState({ open: false, message: '', title: 'Success' });
//   const [serviceDetailsDialog, setServiceDetailsDialog] = useState({ open: false, service: null });

//   const [serviceFormData, setServiceFormData] = useState({
//     serviceName: '',
//     serviceType: '',
//     targetAudience: '',
//     serviceSubType: '',
//     detailedDescription: '',
//     duration: 60,
//     experienceLevel: 'beginner',
//     basePrice: '',
//     priceType: 'fixed',
//     serviceLocation: 'both',
//     customNotes: '',
//     preparationRequired: '',
//     cancellationPolicy: '24 hours notice required',
//     minLeadTime: 2,
//     maxLeadTime: 30
//   });

//   const serviceTypes = [
//  'Hairstyle', 'Haircuts', 'Face Makeup', 'Nail Art','Saree Drapping', 'Eye Makeup'
//   ];

//   const targetAudiences = ['Women', 'Men', 'Kids', 'Unisex'];
  
//   const serviceStyles = ['Bridal', 'Party', 'Traditional', 'Casual', 'Formal', 'Everyday', 'Special Occasion'];

//   const [serviceSubtypes, setServiceSubtypes] = useState([]);

//   // Utility function to format dates
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (error) {
//       return 'Invalid date';
//     }
//   };

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   const fetchServices = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get('/services/my-services');
//       if (response.data.success) {
//         setServices(response.data.services || []);
//       }
//     } catch (error) {
//       setError('Failed to fetch services');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchServiceSubtypes = async (serviceType) => {
//     if (!serviceType) {
//       setServiceSubtypes([]);
//       return;
//     }
    
//     try {
//       const response = await api.get(`/services/subtypes/${serviceType}`);
//       if (response.data.success) {
//         setServiceSubtypes(response.data.subtypes);
//       }
//     } catch (error) {
//       console.error('Error fetching subtypes:', error);
//       setServiceSubtypes([]);
//     }
//   };

//   const handleServiceSubmit = async () => {
//     setLoading(true);
//     try {
//       // Enhanced validation first
//       if (!serviceFormData.serviceName?.trim()) {
//         throw new Error('Service name is required');
//       }
//       if (!serviceFormData.serviceType) {
//         throw new Error('Service type is required');
//       }
//       if (!serviceFormData.targetAudience) {
//         throw new Error('Target audience is required');
//       }
//       if (!serviceFormData.detailedDescription?.trim()) {
//         throw new Error('Service description is required');
//       }
//       if (!serviceFormData.basePrice || isNaN(parseFloat(serviceFormData.basePrice)) || parseFloat(serviceFormData.basePrice) <= 0) {
//         throw new Error('Valid base price is required');
//       }

//       // Properly map the form data to match backend expectations
//       const serviceData = {
//         name: serviceFormData.serviceName.trim(),
//         type: serviceFormData.serviceType,
//         serviceSubType: serviceFormData.serviceSubType || '',
//         category: serviceFormData.targetAudience,
//         description: serviceFormData.detailedDescription.trim(),
//         pricing: {
//           basePrice: parseFloat(serviceFormData.basePrice),
//           priceType: serviceFormData.priceType || 'fixed',
//           variations: [],
//           addOns: []
//         },
//         duration: parseInt(serviceFormData.duration) || 60,
//         experienceLevel: serviceFormData.experienceLevel || 'beginner',
//         serviceLocation: serviceFormData.serviceLocation || 'both',
//         preparationRequired: serviceFormData.preparationRequired?.trim() || '',
//         customNotes: serviceFormData.customNotes?.trim() || '',
//         cancellationPolicy: serviceFormData.cancellationPolicy?.trim() || '24 hours notice required',
//         minLeadTime: parseInt(serviceFormData.minLeadTime) || 2,
//         maxLeadTime: parseInt(serviceFormData.maxLeadTime) || 30,
//         availability: {
//           days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
//           timeSlots: [{ start: '09:00', end: '18:00' }]
//         }
//       };

//       console.log('Submitting service data:', serviceData);

//       const url = editingService ? `/services/${editingService._id}` : '/services/add';
//       const method = editingService ? 'put' : 'post';

//       const response = await api[method](url, serviceData);
      
//     if (response.data.success) {
//   const svc = response.data.service || {};
//   // Notify provider of pending or immediate update
//   if (svc.pendingChanges || svc.hasPendingChanges) {
//     setSuccessDialog({
//       open: true,
//       message: 'Successfully submitted. Please wait for admin response.',
//       title: 'Request Submitted'
//     });
//   } else {
//     setSuccessDialog({
//       open: true,
//       message: 'Service saved successfully!',
//       title: 'Success'
//     });
//   }
//   resetServiceForm();
//   setOpenServiceDialog(false);
//   fetchServices();
//   setError(''); // Clear any previous errors
// } else {
//         throw new Error(response.data.message || 'Failed to save service');
//       }
//     } catch (error) {
//       console.error('Service submission error:', error);
//       let errorMessage = 'Failed to save service';
      
//       if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
//         errorMessage = error.response.data.details.join(', ');
//       } else if (error.response?.data?.message) {
//         errorMessage = error.response.data.message;
//       } else if (error.message) {
//         errorMessage = error.message;
//       }
      
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteService = async (serviceId) => {
//     try {
//       const response = await api.delete(`/services/${serviceId}`);
//     if (response.data.success) {
//   const svc = response.data.service || {};
//   if (svc.pendingDeletion) {
//     setSuccessDialog({
//       open: true,
//       message: 'Deletion request submitted for admin approval.',
//       title: 'Request Submitted'
//     });
//   } else {
//     setSuccessDialog({
//       open: true,
//       message: 'Service deleted successfully!',
//       title: 'Success'
//     });
//   }
//   fetchServices();
// }
//       return response.data.success;
//     } catch (err) {
//       console.error('Service deletion error:', err);
//       const errorMessage = err.response?.data?.message || 'Failed to submit deletion request';
//       setError(errorMessage);
//       return false;
//     }
//   };

//   const handleDeleteSelectedServices = async () => {
//     if (window.confirm(`Are you sure you want to request deletion for ${selectedServices.length} selected service(s)?`)) {
//       setLoading(true);
//       const deletionPromises = selectedServices.map(id => handleDeleteService(id));
//       const results = await Promise.all(deletionPromises);
      
//       const successfulDeletions = results.filter(res => res).length;
//     if (successfulDeletions > 0) {
//   setError(''); // Clear previous errors
//   fetchServices(); // Refresh the list
//   setSelectedServices([]); // Clear selection
//   setSuccessDialog({
//     open: true,
//     message: `${successfulDeletions} service deletion request(s) submitted successfully.`,
//     title: 'Requests Submitted'
//   });
// }
//       setLoading(false);
//     }
//   };

//   const handleEditService = async (serviceId) => {
//     try {
//       const serviceToEdit = services.find(s => s._id === serviceId);
//       if (!serviceToEdit) {
//         setError('Service not found');
//         return;
//       }

//       // Show warning for pending changes but allow editing
//       if (serviceToEdit.pendingChanges) {
//         const proceedWithEdit = window.confirm(
//           'This service has pending changes awaiting approval. ' +
//           'If you continue, your current pending changes may be overwritten. ' +
//           'Do you want to proceed?'
//         );
//         if (!proceedWithEdit) {
//           return;
//         }
//       }

//       // Map service data back to form format for editing
//       const mappedData = {
//         serviceName: serviceToEdit.name || '',
//         serviceType: serviceToEdit.type || '',
//         targetAudience: serviceToEdit.category || '',
//         serviceSubType: serviceToEdit.serviceSubType || '',
//         detailedDescription: serviceToEdit.description || '',
//         duration: serviceToEdit.duration || 60,
//         experienceLevel: serviceToEdit.experienceLevel || 'beginner',
//         basePrice: serviceToEdit.pricing?.basePrice?.toString() || '',
//         priceType: serviceToEdit.pricing?.priceType || 'fixed',
//         serviceLocation: serviceToEdit.serviceLocation || 'both',
//         customNotes: serviceToEdit.customNotes || '',
//         preparationRequired: serviceToEdit.preparationRequired || '',
//         cancellationPolicy: serviceToEdit.cancellationPolicy || '24 hours notice required',
//         minLeadTime: serviceToEdit.minLeadTime || 2,
//         maxLeadTime: serviceToEdit.maxLeadTime || 30
//       };

//       setEditingService(serviceToEdit);
//       setServiceFormData(mappedData);
//       setOpenServiceDialog(true);
//     } catch (err) {
//       console.error('Error preparing service for editing:', err);
//       setError('Failed to load service for editing');
//     }
//   };

//   const resetServiceForm = () => {
//     setServiceFormData({
//       serviceName: '',
//       serviceType: '',
//       targetAudience: '',
//       serviceSubType: '',
//       detailedDescription: '',
//       duration: 60,
//       experienceLevel: 'beginner',
//       basePrice: '',
//       priceType: 'fixed',
//       serviceLocation: 'both',
//       customNotes: '',
//       preparationRequired: '',
//       cancellationPolicy: '24 hours notice required',
//       minLeadTime: 2,
//       maxLeadTime: 30
//     });
//     setEditingService(null);
//   };

//   const handleSelectAllClick = (event) => {
//     if (event.target.checked) {
//       const newSelecteds = services.map((n) => n._id);
//       setSelectedServices(newSelecteds);
//       return;
//     }
//     setSelectedServices([]);
//   };

//   const handleClick = (event, id) => {
//     const selectedIndex = selectedServices.indexOf(id);
//     let newSelected = [];

//     if (selectedIndex === -1) {
//       newSelected = newSelected.concat(selectedServices, id);
//     } else if (selectedIndex === 0) {
//       newSelected = newSelected.concat(selectedServices.slice(1));
//     } else if (selectedIndex === selectedServices.length - 1) {
//       newSelected = newSelected.concat(selectedServices.slice(0, -1));
//     } else if (selectedIndex > 0) {
//       newSelected = newSelected.concat(
//         selectedServices.slice(0, selectedIndex),
//         selectedServices.slice(selectedIndex + 1),
//       );
//     }

//     setSelectedServices(newSelected);
//   };

//   const isSelected = (id) => selectedServices.indexOf(id) !== -1;

//   const getStatusIcon = (service) => {
//     const status = service.status;
//     const hasChanges = !!service.pendingChanges;
    
//     if (hasChanges) {
//       const requestType = service.pendingChanges.requestType || service.pendingChanges.actionType;
//       if (requestType === 'delete') {
//         return (
//           <Chip 
//             label="Deletion Pending"
//             size="small"
//             sx={{ 
//               bgcolor: '#FF5722', 
//               color: 'white',
//               fontWeight: 'bold'
//             }}
//           />
//         );
//       } else {
//         return (
//           <Chip 
//             label="Update Pending"
//             size="small"
//             sx={{ 
//               bgcolor: '#FF9800', 
//               color: 'white',
//               fontWeight: 'bold'
//             }}
//           />
//         );
//       }
//     }
    
//     switch (status) {
//       case 'approved':
//         return <Chip label="Approved" size="small" sx={{ bgcolor: '#4CAF50', color: 'white' }} />;
//       case 'pending_approval':
//         return <Chip label="Pending Approval" size="small" sx={{ bgcolor: '#FF9800', color: 'white' }} />;
//       case 'rejected':
//         return <Chip 
//           label="Rejected" 
//           size="small" 
//           sx={{ 
//             bgcolor: '#F44336', 
//             color: 'white',
//             '&:hover': {
//               opacity: 0.9,
//               cursor: 'pointer'
//             }
//           }} 
//           onClick={(e) => {
//             e.stopPropagation();
//             handleViewServiceDetails(service);
//           }}
//         />;
//       case 'inactive':
//         return <Chip label="Inactive" size="small" sx={{ bgcolor: '#9E9E9E', color: 'white' }} />;
//       default:
//         return <Chip label={status} size="small" sx={{ bgcolor: '#9E9E9E', color: 'white' }} />;
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/service-provider-login');
//   };

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const handleViewServiceDetails = (service) => {
//     setServiceDetailsDialog({ open: true, service });
//   };

//   // derive disabled states for provider actions
//   const isSingle = selectedServices.length === 1;
//   const selSvc = isSingle
//     ? services.find(s => s._id === selectedServices[0])
//     : null;
//   const editDisabled = !isSingle || selSvc?.status === 'rejected';
//   const deleteDisabled = selectedServices.length === 0
//     || selectedServices.some(id => services.find(s => s._id === id)?.status === 'rejected');

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
//       <AppBar position="static" sx={{ bgcolor: '#003047' }}>
//         <Toolbar>
//           <IconButton
//             edge="start"
//             color="inherit"
//             aria-label="menu"
//             onClick={toggleSidebar}
//             sx={{ mr: 2 }}
//           >
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#FFFFFF', fontWeight: 600 }}>
//             Service Registration Page
//           </Typography>
//           <Button 
//             onClick={handleLogout}
//             startIcon={<LogoutIcon />}
//             sx={{
//               bgcolor: 'white',
//               color: '#003047',
//               fontWeight: 600,
//               border: '1px solid #003047',
//               borderRadius: 2,
//               px: 2,
//               py: 0.5,
//               transition: 'all 0.2s ease-in-out',
//               '&:hover': {
//                 bgcolor: '#003047',
//                 color: 'white',
//                 transform: 'translateY(-2px)',
//                 boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
//               }
//             }}
//           >
//             Logout
//           </Button>
//         </Toolbar>
//       </AppBar>

//       <ServiceProviderSidebar
//         open={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//         user={user}
//         onResignation={() => setResignationDialogOpen(true)}
//       />

//       <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
//         <Typography variant="h4" gutterBottom sx={{ color: '#003047', fontWeight: 'bold' }}>
//           Service Management
//         </Typography>

//         {error && (
//           <Alert severity="error" sx={{ mb: 3 }}>
//             {error}
//           </Alert>
//         )}

//         {/* SERVICES TABLE */}
//         <Typography variant="h5" sx={{ mb: 3, color: '#003047', fontWeight: 600 }}>
//           My Services
//         </Typography>
//         <StyledTableContainer component={Paper} sx={{ mb: 4, boxShadow: '0 12px 24px rgba(0,0,0,0.15)' }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <HeaderCell padding="checkbox">
//                   <Checkbox
//                     color="primary"
//                     indeterminate={selectedServices.length > 0 && selectedServices.length < services.length}
//                     checked={services.length > 0 && selectedServices.length === services.length}
//                     onChange={handleSelectAllClick}
//                     inputProps={{ 'aria-label': 'select all services' }}
//                     sx={{ color: 'white' }}
//                   />
//                 </HeaderCell>
//              <HeaderCell>Service Name</HeaderCell>
// <HeaderCell>Service ID</HeaderCell>
// <HeaderCell>Provider ID</HeaderCell>
// <HeaderCell>Type</HeaderCell>
// <HeaderCell>Audience</HeaderCell>
// <HeaderCell>Base Price</HeaderCell>
// <HeaderCell>Duration</HeaderCell>
// <HeaderCell>First Submitted</HeaderCell>
// <HeaderCell>First Approved</HeaderCell>
// <HeaderCell>Last Updated</HeaderCell>
// <HeaderCell>Rejected At</HeaderCell>
// <HeaderCell>Availability</HeaderCell>
// <HeaderCell>Status</HeaderCell>
// <HeaderCell>Provider Info</HeaderCell>
// <HeaderCell>Actions</HeaderCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {services.map(svc => {
//                 const isItemSelected = isSelected(svc._id);
//                 return (
//                 <TableRow 
//                   key={svc._id} 
//                   hover
//                   onClick={(event) => handleClick(event, svc._id)}
//                   role="checkbox"
//                   aria-checked={isItemSelected}
//                   tabIndex={-1}
//                   selected={isItemSelected}
//                   sx={{ 
//                     cursor: 'pointer',
//                     '&:hover': { backgroundColor: 'rgba(139, 75, 156, 0.08)' },
//                     '&.Mui-selected': { backgroundColor: 'rgba(139, 75, 156, 0.12)' },
//                     // Add red background for rejected services
//                     ...(svc.status === 'rejected' && {
//                       backgroundColor: 'rgba(244, 67, 54, 0.05)',
//                       '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.08)' },
//                     })
//                   }}
//                 >
//                   <TableCell padding="checkbox">
//                     <Checkbox
//                       color="primary"
//                       checked={isItemSelected}
//                     />
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: 500 }}>
//                     {svc.name || svc.serviceName}
//                     {svc.status === 'rejected' && svc.rejectionReason && (
//                       <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
//                         Reason: {svc.rejectionReason.substring(0, 40)}
//                         {svc.rejectionReason.length > 40 ? '...' : ''}
//                       </Typography>
//                     )}
//                   </TableCell>
//                   <TableCell sx={{ fontWeight: 500, color: '#003047' }}>
//                     {svc.serviceId || 'Pending'}
//                   </TableCell>
//                   <TableCell sx={{ color: 'text.secondary' }}>
//                     {svc.serviceProviderId || 'Not assigned'}
//                   </TableCell>
//                   <TableCell>{svc.type || svc.serviceType}</TableCell>
//                   <TableCell>{svc.category || svc.targetAudience}</TableCell>
//                   <TableCell sx={{ fontWeight: 600, color: '#003047' }}>LKR {svc.pricing?.basePrice || svc.basePrice}</TableCell>
//                   <TableCell>{svc.duration} min</TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {svc.firstSubmittedAt ? formatDate(svc.firstSubmittedAt) : 'N/A'}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {svc.firstApprovedAt ? formatDate(svc.firstApprovedAt) : 'Not approved'}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2">
//                       {svc.lastUpdatedAt ? formatDate(svc.lastUpdatedAt) : 'Never'}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     <Typography variant="body2" color={svc.status === 'rejected' ? 'error' : 'text.secondary'}>
//                       {svc.rejectedAt ? formatDate(svc.rejectedAt) : 'N/A'}
//                     </Typography>
//                   </TableCell>
//                   <TableCell>
//                     {/** normalize availability */}
//                     {(() => {
//                       const raw = svc.availabilityStatus || 'Available';
//                       const label = raw === 'No Longer Available' || svc.status === 'rejected'
//                         ? 'Unavailable'
//                         : raw;
//                       return (
//                         <Chip
//                           label={label}
//                           color={label === 'Available' ? 'success' : 'error'}
//                           size="small"
//                         />
//                       );
//                     })()}
//                   </TableCell>
//                   <TableCell>{getStatusIcon(svc)}</TableCell>
//                   <TableCell>
//                     <Box>
//                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#003047' }}>
//                         {svc.serviceProvider?.businessName || 'Business name not available'}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {svc.serviceProvider?.fullName || 'Name not available'}
//                       </Typography>
//                       <br />
//                       <Typography variant="caption" color="text.secondary">
//                         {svc.serviceProvider?.emailAddress || 'Email not available'}
//                       </Typography>
//                     </Box>
//                   </TableCell>
//                   <TableCell>
//                     <IconButton
//                       size="small"
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleViewServiceDetails(svc);
//                       }}
//                       sx={{ color: '#003047' }}
//                     >
//                       <ViewIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               )})}
//             </TableBody>
//           </Table>
//         </StyledTableContainer>

//        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
//   <Button
//     variant="contained"
//     startIcon={<AddIcon />}
//     onClick={() => navigate('/service-provider/my-services')}
//     sx={{
//       bgcolor: '#003047',
//       '&:hover': { bgcolor: '#075B5E' },
//       borderRadius: 2,
//       px: 3,
//       py: 1
//     }}
//   >
//     Create New Service
//   </Button>
//   <Button
//     variant="outlined"
//     startIcon={<EditIcon />}
//     disabled={editDisabled}
//     onClick={() => navigate(`/service-provider/services/edit/${selectedServices[0]}`)}
//     sx={{
//       borderRadius: 2,
//       px: 3,
//       py: 1
//     }}
//   >
//     Edit Service
//   </Button>
//   <Button
//     variant="outlined"
//     color="error"
//     startIcon={<DeleteIcon />}
//     disabled={deleteDisabled}
//     onClick={handleDeleteSelectedServices}
//     sx={{
//       borderRadius: 2,
//       px: 3,
//       py: 1
//     }}
//   >
//     Delete Selected
//   </Button>
// </Box>

//         {/* Service Dialog */}
//         <Dialog 
//           open={openServiceDialog} 
//           onClose={() => setOpenServiceDialog(false)} 
//           maxWidth="lg" 
//           fullWidth
//           PaperProps={{
//             sx: { borderRadius: 3, boxShadow: '0 16px 32px rgba(0,0,0,0.2)' }
//           }}
//         >
//           <DialogTitle>
//             {editingService ? 'Edit Service' : 'Add New Service'}
//           </DialogTitle>
//           <DialogContent>
//             <Grid container spacing={2} sx={{ mt: 1 }}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Service Name"
//                   value={serviceFormData.serviceName}
//                   onChange={(e) => setServiceFormData({...serviceFormData, serviceName: e.target.value})}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>Service Type</InputLabel>
//                   <Select
//                     value={serviceFormData.serviceType}
//                     onChange={(e) => {
//                       setServiceFormData({...serviceFormData, serviceType: e.target.value, serviceSubType: ''});
//                       fetchServiceSubtypes(e.target.value);
//                     }}
//                   >
//                     {serviceTypes.map((type) => (
//                       <MenuItem key={type} value={type}>{type}</MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>Target Audience</InputLabel>
//                   <Select
//                     value={serviceFormData.targetAudience}
//                     onChange={(e) => setServiceFormData({...serviceFormData, targetAudience: e.target.value})}
//                   >
//                     {targetAudiences.map((audience) => (
//                       <MenuItem key={audience} value={audience}>{audience}</MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>Service Style</InputLabel>
//                   <Select
//                     value={serviceFormData.serviceSubType}
//                     onChange={(e) => setServiceFormData({...serviceFormData, serviceSubType: e.target.value})}
//                   >
//                     {serviceStyles.map((style) => (
//                       <MenuItem key={style} value={style}>{style}</MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={3}
//                   label="Detailed Description"
//                   value={serviceFormData.detailedDescription}
//                   onChange={(e) => setServiceFormData({...serviceFormData, detailedDescription: e.target.value})}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   type="number"
//                   label="Duration (minutes)"
//                   value={serviceFormData.duration ?? ''}
//                   onChange={(e) =>
//                     setServiceFormData({
//                       ...serviceFormData,
//                       duration:
//                         e.target.value === '' ? '' : parseInt(e.target.value, 10)
//                     })
//                   }
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   type="number"
//                   label="Base Price (LKR)"
//                   value={serviceFormData.basePrice}
//                   onChange={(e) => setServiceFormData({...serviceFormData, basePrice: e.target.value})}
//                 />
//               </Grid>
//             </Grid>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenServiceDialog(false)}>Cancel</Button>
//             <Button onClick={handleServiceSubmit} variant="contained" disabled={loading}>
//               {loading ? 'Saving...' : 'Save Service'}
//             </Button>
// </DialogActions>
//         </Dialog>

//         {/* Success Dialog */}
//         <SuccessDialog
//           open={successDialog.open}
//           onClose={() => setSuccessDialog({ open: false, message: '', title: 'Success' })}
//           message={successDialog.message}
//           title={successDialog.title}
//         />

//         {/* Enhanced Service Details Dialog */}
//         <Dialog
//           open={serviceDetailsDialog.open}
//           onClose={() => setServiceDetailsDialog({ open: false, service: null })}
//           maxWidth="md"
//           fullWidth
//           PaperProps={{
//             sx: {
//               borderRadius: 4,
//               boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
//               background: 'linear-gradient(135deg, #ffffff, #f0f2f5)',
//               overflow: 'hidden',
//               transition: 'all 0.3s ease-in-out'
//             }
//           }}
//         >
//           <DialogTitle
//             sx={{
//               bgcolor: serviceDetailsDialog.service?.status === 'rejected' 
//                       ? '#f44336' 
//                       : serviceDetailsDialog.service?.status === 'approved' 
//                         ? '#4caf50' 
//                         : '#616161',
//               color: '#fff',
//               display: 'flex',
//               alignItems: 'center',
//               gap: 1,
//               py: 2,
//               px: 3,
//               fontSize: '1.5rem',
//               fontWeight: 600
//             }}
//           >
//             <InfoIcon fontSize="large" />
//             Service Details: {serviceDetailsDialog.service?.name}
//           </DialogTitle>
//           <DialogContent
//             sx={{
//               backgroundColor: '#fafbfc',
//               p: 4,
//               '& .MuiTypography-subtitle2': { color: '#666', fontWeight: 500 },
//               '& .MuiTypography-body1':    { color: '#333' }
//             }}
//           >
//             {serviceDetailsDialog.service && (
//               <Grid container spacing={3}>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2" color="text.secondary">Service Name</Typography>
//                   <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
//                     {serviceDetailsDialog.service.name}
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2" color="text.secondary">Service ID</Typography>
//                   <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
//                     {serviceDetailsDialog.service.serviceId || 'Not yet assigned'}
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2" color="text.secondary">Type</Typography>
//                   <Typography variant="body1" sx={{ mb: 2 }}>
//                     {serviceDetailsDialog.service.type}
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2" color="text.secondary">Target Audience</Typography>
//                   <Typography variant="body1" sx={{ mb: 2 }}>
//                     {serviceDetailsDialog.service.category || serviceDetailsDialog.service.targetAudience}
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2" color="text.secondary">Base Price</Typography>
//                   <Typography variant="body1" sx={{ fontWeight: 600, color: '#003047', mb: 2 }}>
//                     LKR {serviceDetailsDialog.service.pricing?.basePrice || 
//                         serviceDetailsDialog.service.basePrice}
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
//                   <Typography variant="body1" sx={{ mb: 2 }}>
//                     {serviceDetailsDialog.service.duration} minutes
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Typography variant="subtitle2" color="text.secondary">Description</Typography>
//                   <Typography variant="body1" sx={{ mb: 2 }}>
//                     {serviceDetailsDialog.service.description}
//                   </Typography>
//                 </Grid>
                
//                 <Grid item xs={12}>
//                   <Divider sx={{ my: 2 }} />
//                   <Typography variant="h6" sx={{ mb: 2, color: '#003047' }}>Status Information</Typography>
//                 </Grid>
                
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2" color="text.secondary">Current Status</Typography>
//                   <Box sx={{ mb: 2 }}>
//                     {getStatusIcon(serviceDetailsDialog.service)}
//                   </Box>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2" color="text.secondary">Availability</Typography>
//                   <Box sx={{ mb: 2 }}>
//                     <Chip 
//                       label={serviceDetailsDialog.service.normalizedAvailability || 'Available'} 
//                       color={(serviceDetailsDialog.service.normalizedAvailability || 'Available') === 'Available' ? 'success' : 'error'} 
//                       size="small" 
//                     />
//                   </Box>
//                 </Grid>
                
//                 {/* Enhanced rejection details section */}
//                 {serviceDetailsDialog.service.status === 'rejected' && (
//                   <Grid item xs={12}>
//                     <Paper sx={{ p: 3, bgcolor: '#ffebee', borderRadius: 2, mt: 1 }}>
//                       <Typography variant="h6" sx={{ color: '#d32f2f', mb: 2, fontWeight: 600 }}>
//                         Rejection Information
//                       </Typography>
//                       <Grid container spacing={2}>
//                         <Grid item xs={12} sm={6}>
//                           <Typography variant="subtitle2" color="text.secondary">Rejected At</Typography>
//                           <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
//                             {serviceDetailsDialog.service.rejectedAt ? 
//                               formatDate(serviceDetailsDialog.service.rejectedAt) : 'N/A'}
//                           </Typography>
//                         </Grid>
//                         <Grid item xs={12} sm={6}>
//                           <Typography variant="subtitle2" color="text.secondary">Rejected By</Typography>
//                           <Typography variant="body1" sx={{ mb: 1 }}>
//                             Admin
//                           </Typography>
//                         </Grid>
//                         <Grid item xs={12}>
//                           <Typography variant="subtitle2" color="text.secondary">Rejection Reason</Typography>
//                           <Typography variant="body1" sx={{ fontStyle: 'italic', p: 2, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 1 }}>
//                             {serviceDetailsDialog.service.rejectionReason || 'No reason provided'}
//                           </Typography>
//                         </Grid>
//                       </Grid>
//                     </Paper>
//                   </Grid>
//                 )}
                
//                 {/* Pending Changes section */}
//                 {serviceDetailsDialog.service.pendingChanges && (
//                   <Grid item xs={12}>
//                     <Paper sx={{ p: 3, bgcolor: '#fff8e1', borderRadius: 2, mt: 1 }}>
//                       <Typography variant="h6" sx={{ color: '#f57c00', mb: 2, fontWeight: 600 }}>
//                         Pending Changes
//                       </Typography>
//                       <Typography variant="body2">
//                         This service has pending changes awaiting admin approval.
//                       </Typography>
//                     </Paper>
//                   </Grid>
//                 )}
//                 {/* ENHANCED: Additional fields */}
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2" color="text.secondary">Price Type</Typography>
//                   <Typography variant="body1" sx={{ mb: 2 }}>
//                     {serviceDetailsDialog.service.pricing?.priceType || 'N/A'}
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2" color="text.secondary">Experience Level</Typography>
//                   <Typography variant="body1" sx={{ mb: 2 }}>
//                     {serviceDetailsDialog.service.experienceLevel || 'N/A'}
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Typography variant="subtitle2" color="text.secondary">Preparation Required</Typography>
//                   <Typography variant="body1" sx={{ mb: 2 }}>
//                     {serviceDetailsDialog.service.preparationRequired || 'None'}
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Typography variant="subtitle2" color="text.secondary">Custom Notes</Typography>
//                   <Typography variant="body1" sx={{ mb: 2 }}>
//                     {serviceDetailsDialog.service.customNotes || 'None'}
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={12}>
//                   <Typography variant="subtitle2" color="text.secondary">Cancellation Policy</Typography>
//                   <Typography variant="body1" sx={{ mb: 2 }}>
//                     {serviceDetailsDialog.service.cancellationPolicy || 'Standard'}
//                   </Typography>
//                 </Grid>
//               </Grid>
//             )}
//           </DialogContent>
//           <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5' }}>
//             <Button 
//               onClick={() => setServiceDetailsDialog({ open: false, service: null })}
//               variant="contained"
//               sx={{ bgcolor: '#003047' }}
//             >
//               Close
//             </Button>
//             {serviceDetailsDialog.service?.status === 'rejected' && (
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={() => {
//                   setServiceDetailsDialog({ open: false, service: null });
//                   handleEditService(serviceDetailsDialog.service._id);
//                 }}
//                 startIcon={<EditIcon />}
//               >
//                 Edit & Resubmit
//               </Button>
//             )}
//           </DialogActions>
//         </Dialog>
//       </Container>
//       <Footer />
//     </Box>
//   );
// };

// export default ServiceManagement;

//serviceProvider/ServiceProvider.ServiceManagementPage.js - ENHANCED VERSION
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  AppBar,
  Toolbar,
  Checkbox,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as ApprovedIcon,
  Pending as PendingIcon,
  Cancel as RejectedIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/footer';
import ServiceProviderSidebar from '../../components/ServiceProviderSidebar';
import api from '../../services/auth';
import { styled } from '@mui/material/styles';
import SuccessDialog from '../../components/SuccessDialog';
import InfoIcon from '@mui/icons-material/Info';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  overflow: 'auto',
  '& .MuiTable-root': {
    minWidth: 1400,
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
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontWeight: theme.typography.fontWeightBold,
}));

const ServiceManagement = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isServicesPage = pathname.endsWith('/services');

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resignationDialogOpen, setResignationDialogOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [successDialog, setSuccessDialog] = useState({ open: false, message: '', title: 'Success' });
  const [serviceDetailsDialog, setServiceDetailsDialog] = useState({ open: false, service: null });

  // ENHANCED: Add refresh indicator
  const [refreshing, setRefreshing] = useState(false);
  const [providerTab, setProviderTab] = useState(0);

  const [serviceFormData, setServiceFormData] = useState({
    serviceName: '',
    serviceType: '',
    targetAudience: '',
    serviceSubType: '',
    detailedDescription: '',
    duration: 60,
    experienceLevel: 'beginner',
    basePrice: '',
    priceType: 'fixed',
    serviceLocation: 'both',
    customNotes: '',
    preparationRequired: '',
    cancellationPolicy: '24 hours notice required',
    minLeadTime: 2,
    maxLeadTime: 30
  });

  const serviceTypes = [
    'Hairstyle', 'Haircuts', 'Face Makeup', 'Nail Art','Saree Drapping', 'Eye Makeup'
  ];

  const targetAudiences = ['Women', 'Men', 'Kids', 'Unisex'];
  const serviceStyles = ['Bridal', 'Party', 'Traditional', 'Casual', 'Formal', 'Everyday', 'Special Occasion'];
  const [serviceSubtypes, setServiceSubtypes] = useState([]);

  // Utility function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ENHANCED: Fetch services with optimistic UI updates
  const fetchServices = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      console.log('🔄 Fetching services...');
      const response = await api.get('/services/my-services');
      
      if (response.data.success) {
        const fetchedServices = response.data.services || [];
        console.log(`✅ Fetched ${fetchedServices.length} services`);
        
        // Enhanced service data with status calculations
        const enhancedServices = fetchedServices.map(service => ({
          ...service,
          // Normalize status display
          displayStatus: getServiceDisplayStatus(service),
          // Calculate action availability
          canEdit: canEditService(service),
          canDelete: canDeleteService(service),
          // Enhanced availability status
          normalizedAvailability: getNormalizedAvailability(service)
        }));
        
        setServices(enhancedServices);
        setError(''); // Clear any previous errors
      }
    } catch (error) {
      console.error('❌ Error fetching services:', error);
      setError('Failed to fetch services');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ENHANCED: Helper functions for service status management
  const getServiceDisplayStatus = (service) => {
    if (service.status === 'rejected') return 'rejected';
    if (service.status === 'deleted') return 'deleted';
    if (service.pendingChanges) {
      const actionType = service.pendingChanges.actionType || service.pendingChanges.requestType;
      if (actionType === 'delete') return 'deletion_pending';
      return 'update_pending';
    }
    return service.status;
  };

  const canEditService = (service) => {
    return service.status !== 'rejected' && service.status !== 'deleted';
  };

  const canDeleteService = (service) => {
    return service.status !== 'rejected' && service.status !== 'deleted';
  };

  const getNormalizedAvailability = (service) => {
    if (service.status === 'rejected' || service.status === 'deleted') {
      return 'Unavailable';
    }
    const raw = service.availabilityStatus || 'Available';
    return raw === 'No Longer Available' ? 'Unavailable' : raw;
  };

  const fetchServiceSubtypes = async (serviceType) => {
    if (!serviceType) {
      setServiceSubtypes([]);
      return;
    }
    
    try {
      const response = await api.get(`/services/subtypes/${serviceType}`);
      if (response.data.success) {
        setServiceSubtypes(response.data.subtypes);
      }
    } catch (error) {
      console.error('Error fetching subtypes:', error);
      setServiceSubtypes([]);
    }
  };

  const handleServiceSubmit = async () => {
    setLoading(true);
    try {
      // Enhanced validation first
      if (!serviceFormData.serviceName?.trim()) {
        throw new Error('Service name is required');
      }
      if (!serviceFormData.serviceType) {
        throw new Error('Service type is required');
      }
      if (!serviceFormData.targetAudience) {
        throw new Error('Target audience is required');
      }
      if (!serviceFormData.detailedDescription?.trim()) {
        throw new Error('Service description is required');
      }
      if (!serviceFormData.basePrice || isNaN(parseFloat(serviceFormData.basePrice)) || parseFloat(serviceFormData.basePrice) <= 0) {
        throw new Error('Valid base price is required');
      }

      // Map form data to service schema
      const serviceData = {
        name: serviceFormData.serviceName.trim(),
        type: serviceFormData.serviceType,
        serviceSubType: serviceFormData.serviceSubType || '',
        category: serviceFormData.targetAudience,
        description: serviceFormData.detailedDescription.trim(),
        pricing: {
          basePrice: parseFloat(serviceFormData.basePrice),
          priceType: serviceFormData.priceType || 'fixed',
          variations: [],
          addOns: []
        },
        duration: parseInt(serviceFormData.duration) || 60,
        experienceLevel: serviceFormData.experienceLevel || 'beginner',
        serviceLocation: serviceFormData.serviceLocation || 'both',
        preparationRequired: serviceFormData.preparationRequired?.trim() || '',
        customNotes: serviceFormData.customNotes?.trim() || '',
        cancellationPolicy: serviceFormData.cancellationPolicy?.trim() || '24 hours notice required',
        minLeadTime: parseInt(serviceFormData.minLeadTime) || 2,
        maxLeadTime: parseInt(serviceFormData.maxLeadTime) || 30,
        availability: {
          days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          timeSlots: [{ start: '09:00', end: '18:00' }]
        }
      };

      console.log('📤 Submitting service data:', serviceData);

      const url = editingService ? `/services/${editingService._id}` : '/services/add';
      const method = editingService ? 'put' : 'post';

      const response = await api[method](url, serviceData);
      
      if (response.data.success) {
        const svc = response.data.service || {};
        
        // ENHANCED: Better success messaging based on response
        if (svc.pendingChanges || svc.hasPendingChanges) {
          setSuccessDialog({
            open: true,
            message: 'Successfully submitted. Please wait for admin response.',
            title: 'Request Submitted'
          });
        } else {
          setSuccessDialog({
            open: true,
            message: 'Service saved successfully!',
            title: 'Success'
          });
        }
        
        resetServiceForm();
        setOpenServiceDialog(false);
        
        // ENHANCED: Immediate refresh with indicator
        await fetchServices(true);
        setError('');
      } else {
        throw new Error(response.data.message || 'Failed to save service');
      }
    } catch (error) {
      console.error('❌ Service submission error:', error);
      let errorMessage = 'Failed to save service';
      
      if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
        errorMessage = error.response.data.details.join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      console.log(`🗑️ Deleting service ${serviceId}`);
      const response = await api.delete(`/services/${serviceId}`);
      
      if (response.data.success) {
        const svc = response.data.service || {};
        
        if (svc.pendingDeletion) {
          setSuccessDialog({
            open: true,
            message: 'Deletion request submitted for admin approval.',
            title: 'Request Submitted'
          });
        } else {
          setSuccessDialog({
            open: true,
            message: 'Service deleted successfully!',
            title: 'Success'
          });
        }
        
        // ENHANCED: Immediate refresh to show updated status
        await fetchServices(true);
      }
      return response.data.success;
    } catch (err) {
      console.error('❌ Service deletion error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to submit deletion request';
      setError(errorMessage);
      return false;
    }
  };

  const handleDeleteSelectedServices = async () => {
    if (window.confirm(`Are you sure you want to request deletion for ${selectedServices.length} selected service(s)?`)) {
      setLoading(true);
      const deletionPromises = selectedServices.map(id => handleDeleteService(id));
      const results = await Promise.all(deletionPromises);
      
      const successfulDeletions = results.filter(res => res).length;
      if (successfulDeletions > 0) {
        setError('');
        setSelectedServices([]);
        setSuccessDialog({
          open: true,
          message: `${successfulDeletions} service deletion request(s) submitted successfully.`,
          title: 'Requests Submitted'
        });
        
        // ENHANCED: Refresh to show updated statuses
        await fetchServices(true);
      }
      setLoading(false);
    }
  };

  const handleEditService = async (serviceId) => {
    try {
      const serviceToEdit = services.find(s => s._id === serviceId);
      if (!serviceToEdit) {
        setError('Service not found');
        return;
      }

      // Show warning for pending changes but allow editing
      if (serviceToEdit.pendingChanges) {
        const proceedWithEdit = window.confirm(
          'This service has pending changes awaiting approval. ' +
          'If you continue, your current pending changes may be overwritten. ' +
          'Do you want to proceed?'
        );
        if (!proceedWithEdit) {
          return;
        }
      }

      // Map service data back to form format for editing
      const mappedData = {
        serviceName: serviceToEdit.name || '',
        serviceType: serviceToEdit.type || '',
        targetAudience: serviceToEdit.category || '',
        serviceSubType: serviceToEdit.serviceSubType || '',
        detailedDescription: serviceToEdit.description || '',
        duration: serviceToEdit.duration || 60,
        experienceLevel: serviceToEdit.experienceLevel || 'beginner',
        basePrice: serviceToEdit.pricing?.basePrice?.toString() || '',
        priceType: serviceToEdit.pricing?.priceType || 'fixed',
        serviceLocation: serviceToEdit.serviceLocation || 'both',
        customNotes: serviceToEdit.customNotes || '',
        preparationRequired: serviceToEdit.preparationRequired || '',
        cancellationPolicy: serviceToEdit.cancellationPolicy || '24 hours notice required',
        minLeadTime: serviceToEdit.minLeadTime || 2,
        maxLeadTime: serviceToEdit.maxLeadTime || 30
      };

      setEditingService(serviceToEdit);
      setServiceFormData(mappedData);
      setOpenServiceDialog(true);
    } catch (err) {
      console.error('❌ Error preparing service for editing:', err);
      setError('Failed to load service for editing');
    }
  };

  const resetServiceForm = () => {
    setServiceFormData({
      serviceName: '',
      serviceType: '',
      targetAudience: '',
      serviceSubType: '',
      detailedDescription: '',
      duration: 60,
      experienceLevel: 'beginner',
      basePrice: '',
      priceType: 'fixed',
      serviceLocation: 'both',
      customNotes: '',
      preparationRequired: '',
      cancellationPolicy: '24 hours notice required',
      minLeadTime: 2,
      maxLeadTime: 30
    });
    setEditingService(null);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const selectableServices = services.filter(s => canDeleteService(s));
      const newSelecteds = selectableServices.map((n) => n._id);
      setSelectedServices(newSelecteds);
      return;
    }
    setSelectedServices([]);
  };

  const handleClick = (event, id) => {
    const service = services.find(s => s._id === id);
    if (!service || !canDeleteService(service)) {
      return; // Don't allow selection of non-deletable services
    }

    const selectedIndex = selectedServices.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedServices, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedServices.slice(1));
    } else if (selectedIndex === selectedServices.length - 1) {
      newSelected = newSelected.concat(selectedServices.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedServices.slice(0, selectedIndex),
        selectedServices.slice(selectedIndex + 1),
      );
    }

    setSelectedServices(newSelected);
  };

  const isSelected = (id) => selectedServices.indexOf(id) !== -1;

  // ENHANCED: Status icon with comprehensive state handling
  const getStatusIcon = (service) => {
    const status = service.status;
    const displayStatus = service.displayStatus;
    
    switch (displayStatus) {
      case 'deletion_pending':
        return (
          <Chip 
            label="Deletion Pending"
            size="small"
            sx={{ 
              bgcolor: '#FF5722', 
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        );
      case 'update_pending':
        return (
          <Chip 
            label="Update Pending"
            size="small"
            sx={{ 
              bgcolor: '#FF9800', 
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        );
      case 'rejected':
        return (
          <Chip 
            label="Rejected" 
            size="small" 
            sx={{ 
              bgcolor: '#F44336', 
              color: 'white',
              '&:hover': {
                opacity: 0.9,
                cursor: 'pointer'
              }
            }} 
            onClick={(e) => {
              e.stopPropagation();
              handleViewServiceDetails(service);
            }}
          />
        );
      case 'deleted':
        return (
          <Chip 
            label="Deleted" 
            size="small" 
            sx={{ 
              bgcolor: '#616161', 
              color: 'white'
            }} 
          />
        );
      case 'approved':
        return <Chip label="Approved" size="small" sx={{ bgcolor: '#4CAF50', color: 'white' }} />;
      case 'pending_approval':
        return <Chip label="Pending Approval" size="small" sx={{ bgcolor: '#FF9800', color: 'white' }} />;
      case 'inactive':
        return <Chip label="Inactive" size="small" sx={{ bgcolor: '#9E9E9E', color: 'white' }} />;
      default:
        return <Chip label={status} size="small" sx={{ bgcolor: '#9E9E9E', color: 'white' }} />;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/service-provider-login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleViewServiceDetails = (service) => {
    setServiceDetailsDialog({ open: true, service });
  };

  // ENHANCED: Determine displayed services based on selected tab
  const displayedServices = providerTab === 0
    ? services
    : providerTab === 1
      ? services.filter(s => s.pendingChanges?.actionType === 'update')
      : services.filter(s => s.pendingChanges?.actionType === 'delete');
  // ENHANCED: Better action availability logic
  const selectableServices = displayedServices.filter(s => canDeleteService(s));
  const isSingle = selectedServices.length === 1;
  const selSvc = isSingle ? services.find(s => s._id === selectedServices[0]) : null;
  const editDisabled = !isSingle || !canEditService(selSvc);
  const deleteDisabled = selectedServices.length === 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
            Service Registration Page
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#FFFFFF', ml: 2 }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user.businessName || user.fullName} ({user.role})
            </Typography>
            <Typography variant="body2">
              {new Date().toLocaleString()}
            </Typography>
          </Box>
          {/* Sidebar handles logout for service provider */}
          {user?.role !== 'serviceProvider' && (
            <Button 
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                bgcolor: 'white',
                color: '#003047',
                fontWeight: 600,
                border: '1px solid #003047',
                borderRadius: 2,
                px: 2,
                py: 0.5,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: '#003047',
                  color: 'white',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }
              }}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <ServiceProviderSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onResignation={() => setResignationDialogOpen(true)}
      />

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#003047', fontWeight: 'bold' }}>
          Service Management
        </Typography>
        <Tabs
          value={providerTab}
          onChange={(e, newVal) => setProviderTab(newVal)}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
        >
          <Tab label={`All Services (${services.length})`} />
          <Tab label={`Update Requests (${services.filter(s => s.pendingChanges?.actionType === 'update').length})`} />
          <Tab label={`Delete Requests (${services.filter(s => s.pendingChanges?.actionType === 'delete').length})`} />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* ENHANCED: Loading indicator for refresh */}
        {refreshing && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Refreshing service data...
          </Alert>
        )}

        {/* SERVICES TABLE */}
        <Typography variant="h5" sx={{ mb: 3, color: '#003047', fontWeight: 600 }}>
          My Services
        </Typography>
        <StyledTableContainer component={Paper} sx={{ mb: 4, boxShadow: '0 12px 24px rgba(0,0,0,0.15)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <HeaderCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selectedServices.length > 0 && selectedServices.length < selectableServices.length}
                    checked={selectableServices.length > 0 && selectedServices.length === selectableServices.length}
                    onChange={handleSelectAllClick}
                    inputProps={{ 'aria-label': 'select all services' }}
                    sx={{ color: 'white' }}
                  />
                </HeaderCell>
                <HeaderCell>Service Name</HeaderCell>
                <HeaderCell>Service ID</HeaderCell>
                <HeaderCell>Provider ID</HeaderCell>
                <HeaderCell>Type</HeaderCell>
                <HeaderCell>Audience</HeaderCell>
                <HeaderCell>Base Price</HeaderCell>
                <HeaderCell>Duration</HeaderCell>
                <HeaderCell>First Submitted</HeaderCell>
                <HeaderCell>First Approved</HeaderCell>
                <HeaderCell>Last Updated</HeaderCell>
                <HeaderCell>Rejected At</HeaderCell>
                <HeaderCell>Availability</HeaderCell>
                <HeaderCell>Status</HeaderCell>
                <HeaderCell>Provider Info</HeaderCell>
                <HeaderCell>Actions</HeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map(svc => {
                const isItemSelected = isSelected(svc._id);
                const isSelectable = canDeleteService(svc);
                
                return (
                  <TableRow 
                    key={svc._id} 
                    hover={isSelectable}
                    onClick={isSelectable ? (event) => handleClick(event, svc._id) : undefined}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    selected={isItemSelected}
                    sx={{ 
                      cursor: isSelectable ? 'pointer' : 'default',
                      '&:hover': isSelectable ? { backgroundColor: 'rgba(139, 75, 156, 0.08)' } : {},
                      '&.Mui-selected': { backgroundColor: 'rgba(139, 75, 156, 0.12)' },
                      // Enhanced styling for different statuses
                      ...(svc.status === 'rejected' && {
                        backgroundColor: 'rgba(244, 67, 54, 0.05)',
                        '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.08)' },
                      }),
                      ...(svc.status === 'deleted' && {
                        backgroundColor: 'rgba(158, 158, 158, 0.05)',
                        opacity: 0.7,
                      }),
                      ...(svc.pendingChanges && {
                        backgroundColor: 'rgba(255, 152, 0, 0.05)',
                        '&:hover': { backgroundColor: 'rgba(255, 152, 0, 0.08)' },
                      })
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        disabled={!isSelectable}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {svc.name || svc.serviceName}
                      {svc.status === 'rejected' && svc.rejectionReason && (
                        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                          Reason: {svc.rejectionReason.substring(0, 40)}
                          {svc.rejectionReason.length > 40 ? '...' : ''}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500, color: '#003047' }}>
                      {svc.serviceId || 'Pending'}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      {svc.serviceProviderId || 'Not assigned'}
                    </TableCell>
                    <TableCell>{svc.type || svc.serviceType}</TableCell>
                    <TableCell>{svc.category || svc.targetAudience}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#003047' }}>
                      LKR {svc.pricing?.basePrice || svc.basePrice}
                    </TableCell>
                    <TableCell>{svc.duration} min</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {svc.firstSubmittedAt ? formatDate(svc.firstSubmittedAt) : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {svc.firstApprovedAt ? formatDate(svc.firstApprovedAt) : 'Not approved'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {svc.lastUpdatedAt ? formatDate(svc.lastUpdatedAt) : 'Never'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color={svc.status === 'rejected' ? 'error' : 'text.secondary'}>
                        {svc.rejectedAt ? formatDate(svc.rejectedAt) : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={svc.normalizedAvailability}
                        color={svc.normalizedAvailability === 'Available' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{getStatusIcon(svc)}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#003047' }}>
                          {svc.serviceProvider?.businessName || 'Business name not available'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {svc.serviceProvider?.fullName || 'Name not available'}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {svc.serviceProvider?.emailAddress || 'Email not available'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewServiceDetails(svc);
                        }}
                        sx={{ color: '#003047' }}
                      >
                        <ViewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </StyledTableContainer>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/service-provider/my-services')}
            sx={{
              bgcolor: '#003047',
              '&:hover': { bgcolor: '#075B5E' },
              borderRadius: 2,
              px: 3,
              py: 1
            }}
          >
            Create New Service
          </Button>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            disabled={editDisabled}
            onClick={() => navigate(`/service-provider/services/edit/${selectedServices[0]}`)}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1
            }}
          >
            Edit Service
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            disabled={deleteDisabled}
            onClick={handleDeleteSelectedServices}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1
            }}
          >
            Delete Selected
          </Button>
        </Box>

        {/* Service Dialog */}
        <Dialog 
          open={openServiceDialog} 
          onClose={() => setOpenServiceDialog(false)} 
          maxWidth="lg" 
          fullWidth
          PaperProps={{
            sx: { borderRadius: 3, boxShadow: '0 16px 32px rgba(0,0,0,0.2)' }
          }}
        >
          <DialogTitle>
            {editingService ? 'Edit Service' : 'Add New Service'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Service Name"
                  value={serviceFormData.serviceName}
                  onChange={(e) => setServiceFormData({...serviceFormData, serviceName: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Service Type</InputLabel>
                  <Select
                    value={serviceFormData.serviceType}
                    onChange={(e) => {
                      setServiceFormData({...serviceFormData, serviceType: e.target.value, serviceSubType: ''});
                      fetchServiceSubtypes(e.target.value);
                    }}
                  >
                    {serviceTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Target Audience</InputLabel>
                  <Select
                    value={serviceFormData.targetAudience}
                    onChange={(e) => setServiceFormData({...serviceFormData, targetAudience: e.target.value})}
                  >
                    {targetAudiences.map((audience) => (
                      <MenuItem key={audience} value={audience}>{audience}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Service Style</InputLabel>
                  <Select
                    value={serviceFormData.serviceSubType}
                    onChange={(e) => setServiceFormData({...serviceFormData, serviceSubType: e.target.value})}
                  >
                    {serviceStyles.map((style) => (
                      <MenuItem key={style} value={style}>{style}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Detailed Description"
                  value={serviceFormData.detailedDescription}
                  onChange={(e) => setServiceFormData({...serviceFormData, detailedDescription: e.target.value})}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Duration (minutes)"
                  value={serviceFormData.duration ?? ''}
                  onChange={(e) =>
                    setServiceFormData({
                      ...serviceFormData,
                      duration:
                        e.target.value === '' ? '' : parseInt(e.target.value, 10)
                    })
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Base Price (LKR)"
                  value={serviceFormData.basePrice}
                  onChange={(e) => setServiceFormData({...serviceFormData, basePrice: e.target.value})}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenServiceDialog(false)}>Cancel</Button>
            <Button onClick={handleServiceSubmit} variant="contained" disabled={loading}>
              {loading ? 'Saving...' : 'Save Service'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Success Dialog */}
        <SuccessDialog
          open={successDialog.open}
          onClose={() => setSuccessDialog({ open: false, message: '', title: 'Success' })}
          message={successDialog.message}
          title={successDialog.title}
        />

        {/* Enhanced Service Details Dialog */}
        <Dialog
          open={serviceDetailsDialog.open}
          onClose={() => setServiceDetailsDialog({ open: false, service: null })}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
              background: 'linear-gradient(135deg, #ffffff, #f0f2f5)',
              overflow: 'hidden',
              transition: 'all 0.3s ease-in-out'
            }
          }}
        >
          <DialogTitle
            sx={{
              bgcolor: serviceDetailsDialog.service?.status === 'rejected' 
                      ? '#f44336' 
                      : serviceDetailsDialog.service?.status === 'approved' 
                        ? '#4caf50' 
                        : '#616161',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              py: 2,
              px: 3,
              fontSize: '1.5rem',
              fontWeight: 600
            }}
          >
            <InfoIcon fontSize="large" />
            Service Details: {serviceDetailsDialog.service?.name}
          </DialogTitle>
          <DialogContent
            sx={{
              backgroundColor: '#fafbfc',
              p: 4,
              '& .MuiTypography-subtitle2': { color: '#666', fontWeight: 500 },
              '& .MuiTypography-body1':    { color: '#333' }
            }}
          >
            {serviceDetailsDialog.service && (
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Service Name</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                    {serviceDetailsDialog.service.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Service ID</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                    {serviceDetailsDialog.service.serviceId || 'Not yet assigned'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Type</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {serviceDetailsDialog.service.type}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Target Audience</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {serviceDetailsDialog.service.category || serviceDetailsDialog.service.targetAudience}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Base Price</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#003047', mb: 2 }}>
                    LKR {serviceDetailsDialog.service.pricing?.basePrice || 
                        serviceDetailsDialog.service.basePrice}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {serviceDetailsDialog.service.duration} minutes
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {serviceDetailsDialog.service.description}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2, color: '#003047' }}>Status Information</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Current Status</Typography>
                  <Box sx={{ mb: 2 }}>
                    {getStatusIcon(serviceDetailsDialog.service)}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Availability</Typography>
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={serviceDetailsDialog.service.normalizedAvailability || 'Available'} 
                      color={(serviceDetailsDialog.service.normalizedAvailability || 'Available') === 'Available' ? 'success' : 'error'} 
                      size="small" 
                    />
                  </Box>
                </Grid>
                
                {/* Enhanced rejection details section */}
                {serviceDetailsDialog.service.status === 'rejected' && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, bgcolor: '#ffebee', borderRadius: 2, mt: 1 }}>
                      <Typography variant="h6" sx={{ color: '#d32f2f', mb: 2, fontWeight: 600 }}>
                        Rejection Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Rejected At</Typography>
                          <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                            {serviceDetailsDialog.service.rejectedAt ? 
                              formatDate(serviceDetailsDialog.service.rejectedAt) : 'N/A'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Rejected By</Typography>
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            Admin
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">Rejection Reason</Typography>
                          <Typography variant="body1" sx={{ fontStyle: 'italic', p: 2, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 1 }}>
                            {serviceDetailsDialog.service.rejectionReason || 'No reason provided'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                )}
                
                {/* Pending Changes section */}
                {serviceDetailsDialog.service.pendingChanges && (
                  <Grid item xs={12}>
                    <Paper sx={{ p: 3, bgcolor: '#fff8e1', borderRadius: 2, mt: 1 }}>
                      <Typography variant="h6" sx={{ color: '#f57c00', mb: 2, fontWeight: 600 }}>
                        Pending Changes
                      </Typography>
                      <Typography variant="body2">
                        This service has pending changes awaiting admin approval.
                      </Typography>
                    </Paper>
                  </Grid>
                )}
                {/* ENHANCED: Additional fields */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Price Type</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {serviceDetailsDialog.service.pricing?.priceType || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Experience Level</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {serviceDetailsDialog.service.experienceLevel || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Preparation Required</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {serviceDetailsDialog.service.preparationRequired || 'None'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Custom Notes</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {serviceDetailsDialog.service.customNotes || 'None'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Cancellation Policy</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {serviceDetailsDialog.service.cancellationPolicy || 'Standard'}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5' }}>
            <Button 
              onClick={() => setServiceDetailsDialog({ open: false, service: null })}
              variant="contained"
              sx={{ bgcolor: '#003047' }}
            >
              Close
            </Button>
            {serviceDetailsDialog.service?.status === 'rejected' && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setServiceDetailsDialog({ open: false, service: null });
                  handleEditService(serviceDetailsDialog.service._id);
                }}
                startIcon={<EditIcon />}
              >
                Edit & Resubmit
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Container>
      <Footer />
    </Box>
  );
};

export default ServiceManagement;