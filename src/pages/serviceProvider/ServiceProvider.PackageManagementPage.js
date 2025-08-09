// // serviceProvider/ServiceProvider.PackageManagementPage.js - ENHANCED WITH PROPER UPDATE DETECTION

// import React, { useState, useEffect } from 'react';
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
//   AppBar,
//   Toolbar,
//   Chip,
//   Card,
//   CardContent,
//   Divider,
//   InputAdornment,
//   Snackbar
// } from '@mui/material';
// import {
//   Add as AddIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Visibility as ViewIcon,
//   CheckCircle as ApprovedIcon,
//   Pending as PendingIcon,
//   Cancel as RejectedIcon,
//   Menu as MenuIcon,
//   Logout as LogoutIcon,
//   AttachMoney as PriceIcon,
//   Schedule as TimeIcon,
//   Update as UpdateIcon,
//   Warning as WarningIcon,
//   History as HistoryIcon
// } from '@mui/icons-material';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import Footer from '../../components/footer';
// import ServiceProviderSidebar from '../../components/ServiceProviderSidebar';
// import api from '../../services/auth';
// import { styled } from '@mui/material/styles';

// // Styled components (keeping existing styles)
// const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
//   borderRadius: theme.shape.borderRadius * 2,
//   boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
//   overflow: 'hidden',
//   border: '1px solid rgba(139, 75, 156, 0.1)'
// }));

// const HeaderCell = styled(TableCell)(({ theme }) => ({
//   backgroundColor: '#003047',
//   color: theme.palette.common.white,
//   fontWeight: 700,
//   fontSize: '0.95rem',
//   padding: theme.spacing(2),
//   borderBottom: 'none'
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: 'rgba(139, 75, 156, 0.02)',
//   },
//   '&:hover': {
//     backgroundColor: 'rgba(139, 75, 156, 0.08)',
//     transform: 'translateY(-1px)',
//     boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//     transition: 'all 0.2s ease-in-out'
//   }
// }));

// const PackageManagement = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();

//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [packages, setPackages] = useState([]);
//   const [openPackageDialog, setOpenPackageDialog] = useState(false);
//   const [editingPackage, setEditingPackage] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   // 🔧 VIEW: Dialog state
//   const [viewDialog, setViewDialog] = useState({ open: false, package: null });
  
//   const [notification, setNotification] = useState({
//     open: false,
//     message: '',
//     severity: 'success'
//   });

//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [packageToDelete, setPackageToDelete] = useState(null);

//   const [packageFormData, setPackageFormData] = useState({
//     packageName: '',
//     packageType: 'bridal',
//     targetAudience: 'Women',
//     packageDescription: '',
//     totalDuration: 180,
//     totalPrice: '',
//     packageLocation: 'both',
//     customNotes: '',
//     preparationRequired: '',
//     cancellationPolicy: '24 hours notice required',
//     minLeadTime: 2,
//     maxLeadTime: 30,
//     packageImage: '',
//     specialOffers: {
//       discountPercentage: 0,
//       validUntil: '',
//       description: ''
//     },
//     requirements: {
//       ageRestriction: { minAge: 0, maxAge: 100 },
//       healthConditions: [],
//       allergies: []
//     }
//   });

//   const packageTypes = ['bridal', 'party', 'wedding', 'festival', 'custom'];
//   const targetAudiences = ['Women', 'Men', 'Kids', 'Unisex'];

//   const showNotification = (message, severity = 'success') => {
//     setNotification({
//       open: true,
//       message,
//       severity
//     });
//   };

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
//     fetchPackages();
//   }, []);

//   const fetchPackages = async () => {
//     try {
//       setLoading(true);
//       console.log('📦 Fetching provider packages...');
      
//       const response = await api.get('/packages/provider');
//       if (response.data.success) {
//         const fetchedPackages = response.data.packages || response.data.data || [];
//         console.log('📦 Received packages:', fetchedPackages.length);
        
//         setPackages(fetchedPackages);
        
//         // Show notifications for newly approved packages
//         const newlyApproved = fetchedPackages.filter(pkg => 
//           pkg.status === 'approved' && 
//           pkg.packageId && 
//           pkg.firstApprovedAt &&
//           !pkg.pendingChanges
//         );
        
//         if (newlyApproved.length > 0) {
//           const approvedNames = newlyApproved.map(pkg => `${pkg.packageName} (${pkg.packageId})`).join(', ');
//           showNotification(
//             `✅ Packages approved: ${approvedNames}`,
//             'success'
//           );
//         }
//       }
//     } catch (error) {
//       console.error('❌ Failed to fetch packages:', error);
//       showNotification('Failed to fetch packages', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔧 ENHANCED: Determine if package is truly new or existing
//   const isNewPackage = (pkg) => {
//     return !pkg || (!pkg.firstApprovedAt && !pkg.packageId);
//   };

//   // 🔧 ENHANCED: Handle edit package with proper pending changes detection
//   const handleEditPackage = (pkg) => {
//     console.log('📝 Edit package requested:', {
//       packageId: pkg.packageId,
//       status: pkg.status,
//       pendingChanges: pkg.pendingChanges?.requestType,
//       isNew: isNewPackage(pkg)
//     });

//     // Check for pending changes and show appropriate warnings
//     if (pkg.pendingChanges && pkg.adminActionTaken !== true) {
//       const requestType = pkg.pendingChanges.requestType;
      
//       if (requestType === 'delete') {
//         showNotification(
//           'This package has a pending deletion request. You cannot edit it until the admin makes a decision.',
//           'warning'
//         );
//         return;
//       } else if (requestType === 'update') {
//         const proceedWithEdit = window.confirm(
//           `⚠️ PENDING UPDATE DETECTED\n\n` +
//           `Package: ${pkg.packageName}\n` +
//           `Package ID: ${pkg.packageId || 'Will be assigned'}\n` +
//           `Current Status: Update pending admin approval\n\n` +
//           `If you continue:\n` +
//           `• Your current pending changes will be overwritten\n` +
//           `• Your Package ID will remain the same: ${pkg.packageId || 'Will be assigned on approval'}\n` +
//           `• The admin will review your NEW changes instead\n\n` +
//           `Do you want to proceed with editing this package?`
//         );
//         if (!proceedWithEdit) {
//           return;
//         }
//       } else if (requestType === 'create') {
//         const proceedWithEdit = window.confirm(
//           `⚠️ PENDING CREATION DETECTED\n\n` +
//           `Package: ${pkg.packageName}\n` +
//           `Status: Awaiting initial approval\n\n` +
//           `If you continue:\n` +
//           `• Your current pending creation will be updated\n` +
//           `• Package ID will be assigned after admin approval\n\n` +
//           `Do you want to proceed with editing this package?`
//         );
//         if (!proceedWithEdit) {
//           return;
//         }
//       }
//     }

//     // Set editing mode
//     setEditingPackage(pkg);
    
//     // Pre-fill form with existing data
//     setPackageFormData({
//       packageName: pkg.packageName || '',
//       packageType: pkg.packageType || 'bridal',
//       targetAudience: pkg.targetAudience || 'Women',
//       packageDescription: pkg.packageDescription || '',
//       totalDuration: pkg.totalDuration || 180,
//       totalPrice: pkg.totalPrice || '',
//       packageLocation: pkg.packageLocation || 'both',
//       customNotes: pkg.customNotes || '',
//       preparationRequired: pkg.preparationRequired || '',
//       cancellationPolicy: pkg.cancellationPolicy || '24 hours notice required',
//       minLeadTime: pkg.minLeadTime || 2,
//       maxLeadTime: pkg.maxLeadTime || 30,
//       packageImage: pkg.packageImage || '',
//       specialOffers: {
//         discountPercentage: pkg.specialOffers?.discountPercentage || 0,
//         validUntil: pkg.specialOffers?.validUntil || '',
//         description: pkg.specialOffers?.description || ''
//       },
//       requirements: {
//         ageRestriction: {
//           minAge: pkg.requirements?.ageRestriction?.minAge || 0,
//           maxAge: pkg.requirements?.ageRestriction?.maxAge || 100
//         },
//         healthConditions: pkg.requirements?.healthConditions || [],
//         allergies: pkg.requirements?.allergies || []
//       }
//     });
    
//     setOpenPackageDialog(true);
//   };

//   // 🔧 ENHANCED: Handle view package details
//   const handleViewPackage = (pkg) => {
//     console.log('👁️ Viewing package:', pkg.packageName);
//     setViewDialog({ open: true, package: pkg });
//   };

//   // 🔧 ENHANCED: Handle package form submission with proper messaging
//   const handlePackageSubmit = async () => {
//     setLoading(true);
//     try {
//       console.log('📦 Submitting package form...', {
//         isEditing: !!editingPackage,
//         packageId: editingPackage?.packageId,
//         formData: packageFormData
//       });
      
//       // Validate required fields
//       if (!packageFormData.packageName?.trim()) {
//         throw new Error('Package name is required');
//       }
//       if (!packageFormData.packageType) {
//         throw new Error('Package type is required');
//       }
//       if (!packageFormData.totalPrice || parseFloat(packageFormData.totalPrice) <= 0) {
//         throw new Error('Valid total price is required');
//       }

//       const url = editingPackage
//         ? `/packages/${editingPackage._id}`
//         : '/packages';
//       const method = editingPackage ? 'put' : 'post';
      
//       const response = await api[method](url, packageFormData);

//       if (response.data.success) {
//         const pkg = response.data.package || {};
//         const isNew = response.data.isNewPackage;
        
//         if (editingPackage) {
//           // Handle update response
//           if (pkg.pendingChanges || response.data.hasPendingChanges) {
//             if (pkg.packageId) {
//               showNotification(
//                 `✅ Package update request submitted successfully!\n🔒 Package ID ${pkg.packageId} will be preserved when approved.`,
//                 'info'
//               );
//             } else {
//               showNotification(
//                 '✅ Package update request submitted for admin approval.',
//                 'info'
//               );
//             }
//           } else {
//             showNotification('✅ Package updated successfully', 'success');
//           }
//         } else {
//           // Handle creation response
//           if (isNew) {
//             showNotification(
//               '✅ New package created successfully and submitted for admin approval!\n🆔 Package ID will be assigned after approval.',
//               'success'
//             );
//           } else {
//             showNotification('✅ Package created successfully', 'success');
//           }
//         }
        
//         setOpenPackageDialog(false);
//         resetPackageForm();
//         fetchPackages();
//         setError('');
//       } else {
//         throw new Error(response.data.message || 'Failed to save package');
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || error.message;
//       setError(errorMessage);
//       showNotification(errorMessage, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔧 ENHANCED: Handle delete package
//   const handleDeletePackage = (pkg) => {
//     setPackageToDelete(pkg);
//     setDeleteDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       setLoading(true);
//       setDeleteDialogOpen(false);
      
//       console.log('🗑️ Requesting package deletion:', packageToDelete._id);
      
//       const response = await api.delete(`/packages/${packageToDelete._id}`);
      
//       if (response.data.success) {
//         if (response.data.packageRemoved) {
//           showNotification(
//             '✅ Package removed successfully.',
//             'success'
//           );
//         } else {
//           const message = response.data.packageIdPreserved 
//             ? `✅ Deletion request submitted successfully. Package ID ${packageToDelete.packageId} will be preserved for audit purposes.`
//             : '✅ Deletion request submitted successfully.';
//           showNotification(message, 'success');
//         }
        
//         fetchPackages();
//       } else {
//         throw new Error(response.data.message || 'Failed to submit deletion request');
//       }
      
//     } catch (error) {
//       console.error('❌ Package deletion error:', error);
//       const errorMessage = error.response?.data?.message || 'Failed to submit deletion request';
//       showNotification(errorMessage, 'error');
//     } finally {
//       setLoading(false);
//       setPackageToDelete(null);
//     }
//   };

//   const resetPackageForm = () => {
//     setPackageFormData({
//       packageName: '',
//       packageType: 'bridal',
//       targetAudience: 'Women',
//       packageDescription: '',
//       totalDuration: 180,
//       totalPrice: '',
//       packageLocation: 'both',
//       customNotes: '',
//       preparationRequired: '',
//       cancellationPolicy: '24 hours notice required',
//       minLeadTime: 2,
//       maxLeadTime: 30,
//       packageImage: '',
//       specialOffers: {
//         discountPercentage: 0,
//         validUntil: '',
//         description: ''
//       },
//       requirements: {
//         ageRestriction: { minAge: 0, maxAge: 100 },
//         healthConditions: [],
//         allergies: []
//       }
//     });
//     setEditingPackage(null);
//   };

//   // 🔧 ENHANCED: Status display with better visual indicators
//   const getStatusIcon = (status, pendingChanges, packageId) => {
//     if (pendingChanges) {
//       const requestType = pendingChanges.requestType;
//       if (requestType === 'delete') {
//         return (
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//             <Chip icon={<WarningIcon />} label="Deletion Pending" color="error" size="small" />
//             {packageId && (
//               <Typography variant="caption" color="error.main">
//                 (ID {packageId} preserved)
//               </Typography>
//             )}
//           </Box>
//         );
//       } else if (requestType === 'update') {
//         return (
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//             <Chip icon={<UpdateIcon />} label="Update Pending" color="warning" size="small" />
//             {packageId && (
//               <Typography variant="caption" color="warning.main">
//                 (ID {packageId} preserved)
//               </Typography>
//             )}
//           </Box>
//         );
//       } else if (requestType === 'create') {
//         return <Chip icon={<PendingIcon />} label="Creation Pending" color="info" size="small" />;
//       }
//     }
    
//     switch (status) {
//       case 'approved':
//         return <Chip icon={<ApprovedIcon />} label="Approved" color="success" size="small" />;
//       case 'pending_approval':
//         return <Chip icon={<PendingIcon />} label="Pending Approval" color="warning" size="small" />;
//       case 'rejected':
//         return <Chip icon={<RejectedIcon />} label="Rejected" color="error" size="small" />;
//       case 'deleted':
//         return <Chip icon={<RejectedIcon />} label="Deleted" color="error" size="small" />;
//       default:
//         return <Chip icon={<PendingIcon />} label="Unknown" color="default" size="small" />;
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/service-provider-login');
//   };

//   // 🔧 ENHANCED: Get dialog title with proper detection
//   const getDialogTitle = () => {
//     if (!editingPackage) {
//       return 'Create New Package';
//     }
    
//     const isNew = isNewPackage(editingPackage);
//     if (isNew) {
//       return `Edit Package (Awaiting First Approval)`;
//     } else {
//       return `Update Package${editingPackage.packageId ? ` - ID: ${editingPackage.packageId}` : ''}`;
//     }
//   };

//   // 🔧 ENHANCED: Get button text with proper detection
//   const getSubmitButtonText = () => {
//     if (loading) return 'Saving...';
    
//     if (!editingPackage) {
//       return 'Create Package';
//     }
    
//     const isNew = isNewPackage(editingPackage);
//     if (isNew) {
//       return 'Update Package Request';
//     } else {
//       return 'Submit Update Request';
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fafafa' }}>
//       <AppBar position="static" sx={{ bgcolor: '#003047', boxShadow: '0 4px 12px rgba(139,75,156,0.3)' }}>
//         <Toolbar>
//           <IconButton edge="start" color="inherit" onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ mr: 2 }}>
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
//             BeautiQ Package Management
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
//       />

//       <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
//         <Box sx={{ mb: 4 }}>
//           <Typography variant="h3" gutterBottom sx={{ color: '#003047', fontWeight: 800, mb: 1 }}>
//             Package Management
//           </Typography>
//           <Typography variant="subtitle1" sx={{ color: '#666', mb: 3 }}>
//             Create and manage your beauty service packages. Package IDs are assigned once and never change.
//           </Typography>
          
//           <Alert severity="info" sx={{ mb: 3 }}>
//             <Typography variant="body2">
//               <strong>🔒 Package ID Consistency:</strong> Once a package is approved, it receives a permanent Package ID that never changes, 
//               even after updates or modifications. This ensures consistent tracking throughout the package lifecycle.
//             </Typography>
//           </Alert>
//         </Box>

//         {error && (
//           <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
//             {error}
//           </Alert>
//         )}

//         {/* Packages Table */}
//         <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
//           <CardContent sx={{ p: 0 }}>
//             <StyledTableContainer>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <HeaderCell>Package Details</HeaderCell>
//                     <HeaderCell>Package ID</HeaderCell>
//                     <HeaderCell>Type & Audience</HeaderCell>
//                     <HeaderCell>Pricing & Duration</HeaderCell>
//                     <HeaderCell>First Submitted</HeaderCell>
//                     <HeaderCell>First Approved</HeaderCell>
//                     <HeaderCell>Last Updated</HeaderCell>
//                     <HeaderCell>Status</HeaderCell>
//                     <HeaderCell align="center">Actions</HeaderCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {packages.map(pkg => (
//                     <StyledTableRow key={pkg._id}>
//                       <TableCell>
//                         <Box>
//                           <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#003047' }}>
//                             {pkg.packageName}
//                           </Typography>
//                           <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
//                             {pkg.packageDescription?.substring(0, 60)}...
//                           </Typography>
//                           {pkg.packageId && (
//                             <Typography variant="caption" sx={{ 
//                               display: 'flex', 
//                               alignItems: 'center', 
//                               gap: 0.5, 
//                               mt: 0.5,
//                               color: '#4caf50',
//                               fontWeight: 600
//                             }}>
//                               🔒 ID Locked: {pkg.packageId}
//                             </Typography>
//                           )}
//                         </Box>
//                       </TableCell>

//                       <TableCell>
//                         <Box>
//                           <Typography variant="body2" sx={{ 
//                             fontWeight: 600, 
//                             color: pkg.packageId ? '#4caf50' : '#ff9800' 
//                           }}>
//                             {pkg.packageId || 'Pending Assignment'}
//                           </Typography>
//                           {pkg.packageId && (
//                             <Typography variant="caption" color="success.main">
//                               ✅ Permanent ID
//                             </Typography>
//                           )}
//                           {!pkg.packageId && (
//                             <Typography variant="caption" color="warning.main">
//                               ⏳ Awaits approval
//                             </Typography>
//                           )}
//                         </Box>
//                       </TableCell>

//                       <TableCell>
//                         <Chip label={pkg.packageType} variant="outlined" size="small" sx={{ mb: 0.5 }} />
//                         <Typography variant="body2" color="text.secondary">
//                           {pkg.targetAudience}
//                         </Typography>
//                       </TableCell>

//                       <TableCell>
//                         <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
//                           <PriceIcon sx={{ fontSize: 16, mr: 0.5, color: '#003047' }} />
//                           <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
//                             LKR {pkg.totalPrice?.toLocaleString()}
//                           </Typography>
//                         </Box>
//                         <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                           <TimeIcon sx={{ fontSize: 16, mr: 0.5, color: '#666' }} />
//                           <Typography variant="body2" color="text.secondary">
//                             {pkg.totalDuration} min
//                           </Typography>
//                         </Box>
//                       </TableCell>

//                       <TableCell>
//                         <Typography variant="body2">
//                           {formatDate(pkg.firstSubmittedAt || pkg.createdAt)}
//                         </Typography>
//                       </TableCell>

//                       <TableCell>
//                         <Typography variant="body2" sx={{ 
//                           color: pkg.firstApprovedAt ? '#4caf50' : 'text.secondary',
//                           fontWeight: pkg.firstApprovedAt ? 600 : 400
//                         }}>
//                           {formatDate(pkg.firstApprovedAt)}
//                         </Typography>
//                       </TableCell>

//                       <TableCell>
//                         <Typography variant="body2" sx={{ 
//                           fontWeight: pkg.lastUpdatedAt ? 700 : 400,
//                           color: pkg.lastUpdatedAt ? '#ff9800' : 'text.secondary'
//                         }}>
//                           {formatDate(pkg.lastUpdatedAt)}
//                         </Typography>
//                       </TableCell>

//                       <TableCell>
//                         {getStatusIcon(pkg.status, pkg.pendingChanges, pkg.packageId)}
//                       </TableCell>

//                       <TableCell align="center">
//                         <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
//                           <IconButton
//                             onClick={() => handleViewPackage(pkg)}
//                             sx={{ color: '#003047' }}
//                             title="View Package Details"
//                           >
//                             <ViewIcon />
//                           </IconButton>
//                           <IconButton
//                             onClick={() => handleEditPackage(pkg)}
//                             sx={{ color: '#003047' }}
//                             title="Edit Package"
//                           >
//                             <EditIcon />
//                           </IconButton>
//                           <IconButton
//                             onClick={() => handleDeletePackage(pkg)}
//                             sx={{ color: '#f44336' }}
//                             title="Delete Package"
//                           >
//                             <DeleteIcon />
//                           </IconButton>
//                         </Box>
//                       </TableCell>
//                     </StyledTableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </StyledTableContainer>
//           </CardContent>
//         </Card>

//         {/* Action Buttons */}
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={() => {
//               resetPackageForm();
//               setOpenPackageDialog(true);
//             }}
//             sx={{
//               bgcolor: '#003047',
//               '&:hover': { bgcolor: '#003047' },
//               borderRadius: 2,
//               px: 4,
//               py: 1.5,
//               fontWeight: 600,
//               boxShadow: '0 4px 12px rgba(85, 70, 180, 0.3)'
//             }}
//           >
//             Add New Package
//           </Button>
//         </Box>

//         {/* View Package Dialog */}
//         <Dialog 
//           open={viewDialog.open} 
//           onClose={() => setViewDialog({ open: false, package: null })}
//           maxWidth="lg"
//           fullWidth
//         >
//           <DialogTitle sx={{ bgcolor: '#003047', color: 'white', fontWeight: 700 }}>
//             📦 Package Details - {viewDialog.package?.packageName}
//           </DialogTitle>
//           <DialogContent sx={{ p: 3 }}>
//             {viewDialog.package && (
//               <Box>
//                 {/* Package ID consistency banner */}
//                 {viewDialog.package.packageId && (
//                   <Alert severity="success" sx={{ mb: 3 }}>
//                     <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
//                       🔒 Package ID: {viewDialog.package.packageId}
//                     </Typography>
//                     <Typography variant="body2">
//                       This Package ID is <strong>permanent and will never change</strong>, ensuring consistent 
//                       tracking across all updates and modifications.
//                     </Typography>
//                   </Alert>
//                 )}
                
//                 <Grid container spacing={3}>
//                   {/* Basic Information */}
//                   <Grid item xs={12}>
//                     <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2 }}>
//                       📋 Basic Information
//                     </Typography>
//                     <Divider sx={{ mb: 2 }} />
//                     <Grid container spacing={2}>
//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="body2" sx={{ mb: 1 }}>
//                           <strong>Package Name:</strong> {viewDialog.package.packageName}
//                         </Typography>
//                         <Typography variant="body2" sx={{ mb: 1 }}>
//                           <strong>Package ID:</strong> {viewDialog.package.packageId || 'Pending Assignment'}
//                         </Typography>
//                         <Typography variant="body2" sx={{ mb: 1 }}>
//                           <strong>Package Type:</strong> {viewDialog.package.packageType}
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="body2" sx={{ mb: 1 }}>
//                           <strong>Target Audience:</strong> {viewDialog.package.targetAudience}
//                         </Typography>
//                         <Typography variant="body2" sx={{ mb: 1 }}>
//                           <strong>Location:</strong> {viewDialog.package.packageLocation}
//                         </Typography>
//                         <Typography variant="body2" sx={{ mb: 1 }}>
//                           <strong>Status:</strong> {viewDialog.package.status}
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={12}>
//                         <Typography variant="body2" sx={{ mb: 1 }}>
//                           <strong>Description:</strong>
//                         </Typography>
//                         <Typography variant="body2" sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
//                           {viewDialog.package.packageDescription || 'No description provided'}
//                         </Typography>
//                       </Grid>
//                     </Grid>
//                   </Grid>

//                   {/* Package History */}
//                   <Grid item xs={12}>
//                     <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2 }}>
//                       📅 Package History
//                     </Typography>
//                     <Divider sx={{ mb: 2 }} />
//                     <Grid container spacing={2}>
//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="body2" sx={{ mb: 1 }}>
//                           <strong>First Submitted:</strong> {formatDate(viewDialog.package.firstSubmittedAt || viewDialog.package.createdAt)}
//                         </Typography>
//                         <Typography variant="body2" sx={{ mb: 1, color: viewDialog.package.firstApprovedAt ? '#4caf50' : 'text.secondary' }}>
//                           <strong>First Approved:</strong> {formatDate(viewDialog.package.firstApprovedAt)}
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="body2" sx={{ 
//                           mb: 1, 
//                           fontWeight: viewDialog.package.lastUpdatedAt ? 700 : 400,
//                           color: viewDialog.package.lastUpdatedAt ? '#ff9800' : 'text.secondary'
//                         }}>
//                           <strong>Last Updated:</strong> {formatDate(viewDialog.package.lastUpdatedAt)}
//                         </Typography>
//                       </Grid>
//                     </Grid>
                    
//                     {/* Package ID Info */}
//                     <Box sx={{ mt: 2, p: 2, bgcolor: '#e8f5e8', borderRadius: 1 }}>
//                       <Typography variant="body2" sx={{ fontWeight: 600, color: '#2e7d32' }}>
//                         🔒 Package ID Consistency: {viewDialog.package.packageId || 'Will be assigned on first approval'}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         This Package ID is permanent and will never change, ensuring consistent tracking across all updates.
//                       </Typography>
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </Box>
//             )}
//           </DialogContent>
//           <DialogActions sx={{ p: 3 }}>
//             <Button 
//               onClick={() => setViewDialog({ open: false, package: null })}
//               variant="outlined"
//             >
//               Close
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Delete confirmation dialog */}
//         <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
//           <DialogTitle sx={{ color: '#d32f2f', fontWeight: 600 }}>
//             Confirm Package Deletion Request
//           </DialogTitle>
//           <DialogContent>
//             <Typography sx={{ mb: 2 }}>
//               Are you sure you want to request deletion for "{packageToDelete?.packageName}"?
//             </Typography>
//             <Alert severity="info" sx={{ mb: 2 }}>
//               <Typography variant="body2">
//                 <strong>🔒 Package ID Preservation:</strong> 
//                 {packageToDelete?.packageId 
//                   ? ` Package ID ${packageToDelete.packageId} will be preserved in the system for audit purposes.`
//                   : ' If this package gets approved first, its Package ID will be preserved for audit purposes.'
//                 }
//               </Typography>
//             </Alert>
//             <Typography variant="body2" color="text.secondary">
//               You can cancel this request by contacting the admin before they make a decision.
//             </Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setDeleteDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={confirmDelete} color="error" variant="contained">
//               Submit Deletion Request
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* 🔧 ENHANCED: Package Form Dialog with proper title and button text */}
//         <Dialog open={openPackageDialog} onClose={() => setOpenPackageDialog(false)} maxWidth="lg" fullWidth>
//           <DialogTitle sx={{ bgcolor: '#003047', color: 'white', fontWeight: 700 }}>
//             {getDialogTitle()}
//           </DialogTitle>
//           <DialogContent sx={{ p: 3 }}>
//             {/* Package ID consistency notice for edits */}
//             {editingPackage && (
//               <Alert severity="info" sx={{ mb: 3 }}>
//                 <Typography variant="body2">
//                   {editingPackage.packageId ? (
//                     <>
//                       <strong>🔒 Package ID Consistency:</strong> This package has the permanent ID <strong>{editingPackage.packageId}</strong>. 
//                       This ID will remain unchanged after your update is approved by the admin.
//                     </>
//                   ) : (
//                     <>
//                       <strong>🆔 Package ID Assignment:</strong> This package will receive a permanent Package ID after admin approval. 
//                       Once assigned, this ID will never change.
//                     </>
//                   )}
//                 </Typography>
//               </Alert>
//             )}
            
//             <Grid container spacing={3} sx={{ mt: 1 }}>
//               {/* Basic Information */}
//               <Grid item xs={12}>
//                 <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2 }}>
//                   Basic Information
//                 </Typography>
//                 <Divider sx={{ mb: 2 }} />
//               </Grid>
              
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Package Name"
//                   value={packageFormData.packageName}
//                   onChange={(e) => setPackageFormData({...packageFormData, packageName: e.target.value})}
//                   variant="outlined"
//                 />
//               </Grid>
              
//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>Package Type</InputLabel>
//                   <Select
//                     value={packageFormData.packageType}
//                     onChange={(e) => setPackageFormData({...packageFormData, packageType: e.target.value})}
//                   >
//                     {packageTypes.map((type) => (
//                       <MenuItem key={type} value={type}>{type}</MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>Target Audience</InputLabel>
//                   <Select
//                     value={packageFormData.targetAudience}
//                     onChange={(e) => setPackageFormData({...packageFormData, targetAudience: e.target.value})}
//                   >
//                     {targetAudiences.map((audience) => (
//                       <MenuItem key={audience} value={audience}>{audience}</MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <FormControl fullWidth>
//                   <InputLabel>Package Location</InputLabel>
//                   <Select
//                     value={packageFormData.packageLocation}
//                     onChange={(e) => setPackageFormData({...packageFormData, packageLocation: e.target.value})}
//                   >
//                     <MenuItem value="home_service">Home Service</MenuItem>
//                     <MenuItem value="salon_only">Salon Only</MenuItem>
//                     <MenuItem value="both">Both</MenuItem>
//                   </Select>
//                 </FormControl>
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={4}
//                   label="Package Description"
//                   value={packageFormData.packageDescription}
//                   onChange={(e) => setPackageFormData({...packageFormData, packageDescription: e.target.value})}
//                 />
//               </Grid>

//               {/* Pricing & Duration */}
//               <Grid item xs={12}>
//                 <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2, mt: 2 }}>
//                   Pricing & Duration
//                 </Typography>
//                 <Divider sx={{ mb: 2 }} />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   type="number"
//                   label="Total Price"
//                   value={packageFormData.totalPrice}
//                   onChange={(e) => setPackageFormData({...packageFormData, totalPrice: e.target.value})}
//                   InputProps={{
//                     startAdornment: <InputAdornment position="start">LKR</InputAdornment>,
//                   }}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   type="number"
//                   label="Total Duration (minutes)"
//                   value={packageFormData.totalDuration}
//                   onChange={(e) => setPackageFormData({...packageFormData, totalDuration: parseInt(e.target.value)})}
//                 />
//               </Grid>

//               {/* Additional fields */}
//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   fullWidth
//                   type="number"
//                   label="Min Lead Time (hours)"
//                   value={packageFormData.minLeadTime}
//                   onChange={(e) => setPackageFormData({...packageFormData, minLeadTime: parseInt(e.target.value)})}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   fullWidth
//                   type="number"
//                   label="Max Advance Booking (days)"
//                   value={packageFormData.maxLeadTime}
//                   onChange={(e) => setPackageFormData({...packageFormData, maxLeadTime: parseInt(e.target.value)})}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={4}>
//                 <TextField
//                   fullWidth
//                   label="Cancellation Policy"
//                   value={packageFormData.cancellationPolicy}
//                   onChange={(e) => setPackageFormData({...packageFormData, cancellationPolicy: e.target.value})}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={3}
//                   label="Custom Notes"
//                   value={packageFormData.customNotes}
//                   onChange={(e) => setPackageFormData({...packageFormData, customNotes: e.target.value})}
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   multiline
//                   rows={3}
//                   label="Preparation Required"
//                   value={packageFormData.preparationRequired}
//                   onChange={(e) => setPackageFormData({...packageFormData, preparationRequired: e.target.value})}
//                 />
//               </Grid>
//             </Grid>
//           </DialogContent>
//           <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5' }}>
//             <Button 
//               onClick={() => setOpenPackageDialog(false)}
//               sx={{ color: '#666' }}
//             >
//               Cancel
//             </Button>
//             <Button 
//               onClick={handlePackageSubmit} 
//               variant="contained" 
//               disabled={loading}
//               sx={{
//                 bgcolor: '#003047',
//                 '&:hover': { bgcolor: '#003047' },
//                 fontWeight: 600
//               }}
//             >
//               {getSubmitButtonText()}
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Enhanced notification system */}
//         <Snackbar
//           open={notification.open}
//           autoHideDuration={6000}
//           onClose={() => setNotification({ ...notification, open: false })}
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//         >
//           <Alert 
//             onClose={() => setNotification({ ...notification, open: false })} 
//             severity={notification.severity}
//             sx={{ width: '100%' }}
//           >
//             {notification.message}
//           </Alert>
//         </Snackbar>
//       </Container>
//       <Footer />
//     </Box>
//   );
// };

// export default PackageManagement;

// Fixed Service Provider Package Management - Proper Deleted Status Display
import React, { useState, useEffect } from 'react';
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
  AppBar,
  Toolbar,
  Chip,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  Snackbar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as ApprovedIcon,
  Pending as PendingIcon,
  Cancel as RejectedIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  AttachMoney as PriceIcon,
  Schedule as TimeIcon,
  Update as UpdateIcon,
  Warning as WarningIcon,
  History as HistoryIcon,
  Block as BlockIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/footer';
import ServiceProviderSidebar from '../../components/ServiceProviderSidebar';
import api from '../../services/auth';
import { styled } from '@mui/material/styles';

// Styled components (keeping existing styles)
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
  overflow: 'hidden',
  border: '1px solid rgba(139, 75, 156, 0.1)'
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: '#003047',
  color: theme.palette.common.white,
  fontWeight: 700,
  fontSize: '0.95rem',
  padding: theme.spacing(2),
  borderBottom: 'none'
}));

const StyledTableRow = styled(TableRow)(({ theme, isDeleted }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(139, 75, 156, 0.02)',
  },
  opacity: isDeleted ? 0.6 : 1,
  '&:hover': {
    backgroundColor: isDeleted ? 'rgba(128, 128, 128, 0.15)' : 'rgba(139, 75, 156, 0.08)',
    transform: isDeleted ? 'none' : 'translateY(-1px)',
    boxShadow: isDeleted ? 'none' : '0 4px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease-in-out'
  }
}));

const PackageManagement = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [packages, setPackages] = useState([]);
  const [openPackageDialog, setOpenPackageDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 🔧 VIEW: Dialog state
  const [viewDialog, setViewDialog] = useState({ open: false, package: null });
  
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState(null);

  const [packageFormData, setPackageFormData] = useState({
    packageName: '',
    packageType: 'bridal',
    targetAudience: 'Women',
    packageDescription: '',
    totalDuration: 180,
    totalPrice: '',
    packageLocation: 'both',
    customNotes: '',
    preparationRequired: '',
    cancellationPolicy: '24 hours notice required',
    minLeadTime: 2,
    maxLeadTime: 30,
    packageImage: '',
    specialOffers: {
      discountPercentage: 0,
      validUntil: '',
      description: ''
    },
    requirements: {
      ageRestriction: { minAge: 0, maxAge: 100 },
      healthConditions: [],
      allergies: []
    }
  });

  const packageTypes = ['bridal', 'party', 'wedding', 'festival', 'custom'];
  const targetAudiences = ['Women', 'Men', 'Kids', 'Unisex'];

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

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
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      console.log('📦 Fetching provider packages...');
      
      const response = await api.get('/packages/provider');
      if (response.data.success) {
        const fetchedPackages = response.data.packages || response.data.data || [];
        console.log('📦 Received packages:', fetchedPackages.length);
        console.log('📦 Deleted packages:', fetchedPackages.filter(p => p.status === 'deleted').length);
        
        setPackages(fetchedPackages);
        
        // Show notifications for newly approved packages
        const newlyApproved = fetchedPackages.filter(pkg => 
          pkg.status === 'approved' && 
          pkg.packageId && 
          pkg.firstApprovedAt &&
          !pkg.pendingChanges
        );
        
        if (newlyApproved.length > 0) {
          const approvedNames = newlyApproved.map(pkg => `${pkg.packageName} (${pkg.packageId})`).join(', ');
          showNotification(
            `✅ Packages approved: ${approvedNames}`,
            'success'
          );
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch packages:', error);
      showNotification('Failed to fetch packages', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 🔧 ENHANCED: Determine if package is truly new or existing
  const isNewPackage = (pkg) => {
    return !pkg || (!pkg.firstApprovedAt && !pkg.packageId);
  };

  // 🔧 ENHANCED: Handle edit package with proper pending changes detection
  const handleEditPackage = (pkg) => {
    console.log('📝 Edit package requested:', {
      packageId: pkg.packageId,
      status: pkg.status,
      pendingChanges: pkg.pendingChanges?.requestType,
      isNew: isNewPackage(pkg)
    });

    // FIXED: Prevent editing deleted packages
    if (pkg.status === 'deleted') {
      showNotification(
        'This package has been deleted and cannot be edited.',
        'error'
      );
      return;
    }

    // Check for pending changes and show appropriate warnings
    if (pkg.pendingChanges && pkg.adminActionTaken !== true) {
      const requestType = pkg.pendingChanges.requestType;
      
      if (requestType === 'delete') {
        showNotification(
          'This package has a pending deletion request. You cannot edit it until the admin makes a decision.',
          'warning'
        );
        return;
      } else if (requestType === 'update') {
        const proceedWithEdit = window.confirm(
          `⚠️ PENDING UPDATE DETECTED\n\n` +
          `Package: ${pkg.packageName}\n` +
          `Package ID: ${pkg.packageId || 'Will be assigned'}\n` +
          `Current Status: Update pending admin approval\n\n` +
          `If you continue:\n` +
          `• Your current pending changes will be overwritten\n` +
          `• Your Package ID will remain the same: ${pkg.packageId || 'Will be assigned on approval'}\n` +
          `• The admin will review your NEW changes instead\n\n` +
          `Do you want to proceed with editing this package?`
        );
        if (!proceedWithEdit) {
          return;
        }
      } else if (requestType === 'create') {
        const proceedWithEdit = window.confirm(
          `⚠️ PENDING CREATION DETECTED\n\n` +
          `Package: ${pkg.packageName}\n` +
          `Status: Awaiting initial approval\n\n` +
          `If you continue:\n` +
          `• Your current pending creation will be updated\n` +
          `• Package ID will be assigned after admin approval\n\n` +
          `Do you want to proceed with editing this package?`
        );
        if (!proceedWithEdit) {
          return;
        }
      }
    }

    // Set editing mode
    setEditingPackage(pkg);
    
    // Pre-fill form with existing data
    setPackageFormData({
      packageName: pkg.packageName || '',
      packageType: pkg.packageType || 'bridal',
      targetAudience: pkg.targetAudience || 'Women',
      packageDescription: pkg.packageDescription || '',
      totalDuration: pkg.totalDuration || 180,
      totalPrice: pkg.totalPrice || '',
      packageLocation: pkg.packageLocation || 'both',
      customNotes: pkg.customNotes || '',
      preparationRequired: pkg.preparationRequired || '',
      cancellationPolicy: pkg.cancellationPolicy || '24 hours notice required',
      minLeadTime: pkg.minLeadTime || 2,
      maxLeadTime: pkg.maxLeadTime || 30,
      packageImage: pkg.packageImage || '',
      specialOffers: {
        discountPercentage: pkg.specialOffers?.discountPercentage || 0,
        validUntil: pkg.specialOffers?.validUntil || '',
        description: pkg.specialOffers?.description || ''
      },
      requirements: {
        ageRestriction: {
          minAge: pkg.requirements?.ageRestriction?.minAge || 0,
          maxAge: pkg.requirements?.ageRestriction?.maxAge || 100
        },
        healthConditions: pkg.requirements?.healthConditions || [],
        allergies: pkg.requirements?.allergies || []
      }
    });
    
    setOpenPackageDialog(true);
  };

  // 🔧 ENHANCED: Handle view package details
  const handleViewPackage = (pkg) => {
    console.log('👁️ Viewing package:', pkg.packageName);
    setViewDialog({ open: true, package: pkg });
  };

  // 🔧 ENHANCED: Handle package form submission with proper messaging
  const handlePackageSubmit = async () => {
    setLoading(true);
    try {
      console.log('📦 Submitting package form...', {
        isEditing: !!editingPackage,
        packageId: editingPackage?.packageId,
        formData: packageFormData
      });
      
      // Validate required fields
      if (!packageFormData.packageName?.trim()) {
        throw new Error('Package name is required');
      }
      if (!packageFormData.packageType) {
        throw new Error('Package type is required');
      }
      if (!packageFormData.totalPrice || parseFloat(packageFormData.totalPrice) <= 0) {
        throw new Error('Valid total price is required');
      }

      const url = editingPackage
        ? `/packages/${editingPackage._id}`
        : '/packages';
      const method = editingPackage ? 'put' : 'post';
      
      const response = await api[method](url, packageFormData);

      if (response.data.success) {
        const pkg = response.data.package || {};
        const isNew = response.data.isNewPackage;
        
        if (editingPackage) {
          // Handle update response
          if (pkg.pendingChanges || response.data.hasPendingChanges) {
            if (pkg.packageId) {
              showNotification(
                `✅ Package update request submitted successfully!\n🔒 Package ID ${pkg.packageId} will be preserved when approved.`,
                'info'
              );
            } else {
              showNotification(
                '✅ Package update request submitted for admin approval.',
                'info'
              );
            }
          } else {
            showNotification('✅ Package updated successfully', 'success');
          }
        } else {
          // Handle creation response
          if (isNew) {
            showNotification(
              '✅ New package created successfully and submitted for admin approval!\n🆔 Package ID will be assigned after approval.',
              'success'
            );
          } else {
            showNotification('✅ Package created successfully', 'success');
          }
        }
        
        setOpenPackageDialog(false);
        resetPackageForm();
        fetchPackages();
        setError('');
      } else {
        throw new Error(response.data.message || 'Failed to save package');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // 🔧 ENHANCED: Handle delete package
  const handleDeletePackage = (pkg) => {
    // FIXED: Prevent deleting already deleted packages
    if (pkg.status === 'deleted') {
      showNotification(
        'This package has already been deleted.',
        'warning'
      );
      return;
    }

    setPackageToDelete(pkg);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      setDeleteDialogOpen(false);
      
      console.log('🗑️ Requesting package deletion:', packageToDelete._id);
      
      const response = await api.delete(`/packages/${packageToDelete._id}`);
      
      if (response.data.success) {
        if (response.data.packageRemoved) {
          showNotification(
            '✅ Package removed successfully.',
            'success'
          );
        } else {
          const message = response.data.packageIdPreserved 
            ? `✅ Deletion request submitted successfully. Package ID ${packageToDelete.packageId} will be preserved for audit purposes.`
            : '✅ Deletion request submitted successfully.';
          showNotification(message, 'success');
        }
        
        fetchPackages();
      } else {
        throw new Error(response.data.message || 'Failed to submit deletion request');
      }
      
    } catch (error) {
      console.error('❌ Package deletion error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit deletion request';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
      setPackageToDelete(null);
    }
  };

  const resetPackageForm = () => {
    setPackageFormData({
      packageName: '',
      packageType: 'bridal',
      targetAudience: 'Women',
      packageDescription: '',
      totalDuration: 180,
      totalPrice: '',
      packageLocation: 'both',
      customNotes: '',
      preparationRequired: '',
      cancellationPolicy: '24 hours notice required',
      minLeadTime: 2,
      maxLeadTime: 30,
      packageImage: '',
      specialOffers: {
        discountPercentage: 0,
        validUntil: '',
        description: ''
      },
      requirements: {
        ageRestriction: { minAge: 0, maxAge: 100 },
        healthConditions: [],
        allergies: []
      }
    });
    setEditingPackage(null);
  };

  // 🔧 FIXED: Enhanced status display with proper deleted handling
  const getStatusIcon = (status, pendingChanges, packageId) => {
    // PRIORITY 1: Handle deleted packages
    if (status === 'deleted') {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Chip 
            icon={<BlockIcon />} 
            label="DELETED" 
            sx={{ 
              backgroundColor: '#616161',
              color: 'white',
              fontWeight: 'bold',
              '& .MuiChip-icon': {
                color: 'white'
              }
            }}
          />
          {packageId && (
            <Typography variant="caption" sx={{ color: '#616161', fontWeight: 'bold' }}>
              (ID {packageId} preserved)
            </Typography>
          )}
        </Box>
      );
    }

    // PRIORITY 2: Handle pending changes
    if (pendingChanges) {
      const requestType = pendingChanges.requestType;
      if (requestType === 'delete') {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip icon={<WarningIcon />} label="Deletion Pending" color="error" size="small" />
            {packageId && (
              <Typography variant="caption" color="error.main">
                (ID {packageId} preserved)
              </Typography>
            )}
          </Box>
        );
      } else if (requestType === 'update') {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Chip icon={<UpdateIcon />} label="Update Pending" color="warning" size="small" />
            {packageId && (
              <Typography variant="caption" color="warning.main">
                (ID {packageId} preserved)
              </Typography>
            )}
          </Box>
        );
      } else if (requestType === 'create') {
        return <Chip icon={<PendingIcon />} label="Creation Pending" color="info" size="small" />;
      }
    }
    
    // PRIORITY 3: Regular status handling
    switch (status) {
      case 'approved':
        return <Chip icon={<ApprovedIcon />} label="Approved" color="success" size="small" />;
      case 'pending_approval':
        return <Chip icon={<PendingIcon />} label="Pending Approval" color="warning" size="small" />;
      case 'rejected':
        return <Chip icon={<RejectedIcon />} label="Rejected" color="error" size="small" />;
      default:
        return <Chip icon={<PendingIcon />} label="Unknown" color="default" size="small" />;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/service-provider-login');
  };

  // 🔧 ENHANCED: Get dialog title with proper detection
  const getDialogTitle = () => {
    if (!editingPackage) {
      return 'Create New Package';
    }
    
    const isNew = isNewPackage(editingPackage);
    if (isNew) {
      return `Edit Package (Awaiting First Approval)`;
    } else {
      return `Update Package${editingPackage.packageId ? ` - ID: ${editingPackage.packageId}` : ''}`;
    }
  };

  // 🔧 ENHANCED: Get button text with proper detection
  const getSubmitButtonText = () => {
    if (loading) return 'Saving...';
    
    if (!editingPackage) {
      return 'Create Package';
    }
    
    const isNew = isNewPackage(editingPackage);
    if (isNew) {
      return 'Update Package Request';
    } else {
      return 'Submit Update Request';
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fafafa' }}>
      <AppBar position="static" sx={{ bgcolor: '#003047', boxShadow: '0 4px 12px rgba(139,75,156,0.3)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
            BeautiQ Package Management - Fixed Deleted Package Display
          </Typography>
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
        </Toolbar>
      </AppBar>

      <ServiceProviderSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" gutterBottom sx={{ color: '#003047', fontWeight: 800, mb: 1 }}>
            Package Management
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#666', mb: 3 }}>
            Create and manage your beauty service packages. Package IDs are assigned once and never change.
          </Typography>
          
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>✅ Fixed Deleted Package Display:</strong> Deleted packages now properly show "DELETED" status 
              and cannot be edited or deleted again. Package IDs are preserved for audit purposes.
            </Typography>
          </Alert>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>🔒 Package ID Consistency:</strong> Once a package is approved, it receives a permanent Package ID that never changes, 
              even after updates or modifications. This ensures consistent tracking throughout the package lifecycle.
            </Typography>
          </Alert>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Packages Table */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 0 }}>
            <StyledTableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 1000 }}>
                <TableHead>
                  <TableRow>
                    <HeaderCell>Package Details</HeaderCell>
                    <HeaderCell>Package ID</HeaderCell>
                    <HeaderCell>Type & Audience</HeaderCell>
                    <HeaderCell>Pricing & Duration</HeaderCell>
                    <HeaderCell>First Submitted</HeaderCell>
                    <HeaderCell>First Approved</HeaderCell>
                    <HeaderCell>Last Updated</HeaderCell>
                    <HeaderCell>Status</HeaderCell>
                    <HeaderCell align="center">Actions</HeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {packages.map(pkg => {
                    const isDeleted = pkg.status === 'deleted';
                    
                    return (
                      <StyledTableRow key={pkg._id} isDeleted={isDeleted}>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle1" sx={{ 
                              fontWeight: 600, 
                              color: isDeleted ? '#9e9e9e' : '#003047',
                              textDecoration: isDeleted ? 'line-through' : 'none'
                            }}>
                              {pkg.packageName}
                              {isDeleted && (
                                <Typography component="span" sx={{ 
                                  ml: 1, 
                                  color: '#f44336', 
                                  fontWeight: 'bold',
                                  fontSize: '0.8rem'
                                }}>
                                  [DELETED]
                                </Typography>
                              )}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {pkg.packageDescription?.substring(0, 60)}...
                            </Typography>
                            {pkg.packageId && (
                              <Typography variant="caption" sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 0.5, 
                                mt: 0.5,
                                color: isDeleted ? '#9e9e9e' : '#4caf50',
                                fontWeight: 600
                              }}>
                                🔒 ID {isDeleted ? 'Preserved' : 'Locked'}: {pkg.packageId}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ 
                              fontWeight: 600, 
                              color: pkg.packageId ? (isDeleted ? '#9e9e9e' : '#4caf50') : '#ff9800'
                            }}>
                              {pkg.packageId || 'Pending Assignment'}
                            </Typography>
                            {pkg.packageId && (
                              <Typography variant="caption" sx={{ 
                                color: isDeleted ? '#9e9e9e' : 'success.main' 
                              }}>
                                {isDeleted ? '🗑️ Preserved' : '✅ Permanent ID'}
                              </Typography>
                            )}
                            {!pkg.packageId && (
                              <Typography variant="caption" color="warning.main">
                                ⏳ Awaits approval
                              </Typography>
                            )}
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Chip 
                            label={pkg.packageType} 
                            variant="outlined" 
                            size="small" 
                            sx={{ 
                              mb: 0.5,
                              opacity: isDeleted ? 0.6 : 1
                            }} 
                          />
                          <Typography variant="body2" color="text.secondary">
                            {pkg.targetAudience}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <PriceIcon sx={{ 
                              fontSize: 16, 
                              mr: 0.5, 
                              color: isDeleted ? '#9e9e9e' : '#003047' 
                            }} />
                            <Typography variant="subtitle2" sx={{ 
                              fontWeight: 600,
                              color: isDeleted ? '#9e9e9e' : 'text.primary',
                              textDecoration: isDeleted ? 'line-through' : 'none'
                            }}>
                              LKR {pkg.totalPrice?.toLocaleString()}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TimeIcon sx={{ fontSize: 16, mr: 0.5, color: '#666' }} />
                            <Typography variant="body2" color="text.secondary">
                              {pkg.totalDuration} min
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(pkg.firstSubmittedAt || pkg.createdAt)}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="body2" sx={{ 
                            color: pkg.firstApprovedAt ? '#4caf50' : 'text.secondary',
                            fontWeight: pkg.firstApprovedAt ? 600 : 400
                          }}>
                            {formatDate(pkg.firstApprovedAt)}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography variant="body2" sx={{ 
                              fontWeight: pkg.lastUpdatedAt ? 700 : 400,
                              color: pkg.lastUpdatedAt ? '#ff9800' : 'text.secondary'
                            }}>
                              {formatDate(pkg.lastUpdatedAt)}
                            </Typography>
                            {pkg.deletedAt && (
                              <Typography variant="caption" sx={{ 
                                color: '#f44336', 
                                fontWeight: 700,
                                fontSize: '0.7rem'
                              }}>
                                🗑️ Deleted: {formatDate(pkg.deletedAt)}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>

                        <TableCell>
                          {getStatusIcon(pkg.status, pkg.pendingChanges, pkg.packageId)}
                        </TableCell>

                        <TableCell align="center">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <IconButton
                              onClick={() => handleViewPackage(pkg)}
                              sx={{ color: '#003047' }}
                              title="View Package Details"
                            >
                              <ViewIcon />
                            </IconButton>
                            {!isDeleted && (
                              <>
                                <IconButton
                                  onClick={() => handleEditPackage(pkg)}
                                  sx={{ color: '#003047' }}
                                  title="Edit Package"
                                  disabled={pkg.pendingChanges?.requestType === 'delete'}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleDeletePackage(pkg)}
                                  sx={{ color: '#f44336' }}
                                  title="Delete Package"
                                  disabled={pkg.pendingChanges?.requestType === 'delete'}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            )}
                            {isDeleted && (
                              <Typography variant="caption" sx={{ 
                                color: '#9e9e9e', 
                                fontStyle: 'italic',
                                fontSize: '0.7rem'
                              }}>
                                No actions available
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              resetPackageForm();
              setOpenPackageDialog(true);
            }}
            sx={{
              bgcolor: '#003047',
              '&:hover': { bgcolor: '#003047' },
              borderRadius: 2,
              px: 4,
              py: 1.5,
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(85, 70, 180, 0.3)'
            }}
          >
            Add New Package
          </Button>
        </Box>

        {/* FIXED: View Package Dialog with proper deleted package handling */}
        <Dialog 
          open={viewDialog.open} 
          onClose={() => setViewDialog({ open: false, package: null })}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle sx={{ 
            bgcolor: viewDialog.package?.status === 'deleted' ? '#f44336' : '#003047', 
            color: 'white', 
            fontWeight: 700 
          }}>
            📦 Package Details - {viewDialog.package?.packageName}
            {viewDialog.package?.status === 'deleted' && ' [DELETED]'}
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {viewDialog.package && (
              <Box>
                {/* Package ID consistency banner */}
                {viewDialog.package.packageId && (
                  <Alert severity={viewDialog.package.status === 'deleted' ? "error" : "success"} sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      🔒 Package ID: {viewDialog.package.packageId}
                    </Typography>
                    <Typography variant="body2">
                      {viewDialog.package.status === 'deleted' ? (
                        <>This package has been <strong>deleted</strong> but Package ID is <strong>preserved for audit trail</strong>. 
                        The package is no longer available for booking.</>
                      ) : (
                        <>This Package ID is <strong>permanent and will never change</strong>, ensuring consistent 
                        tracking across all updates and modifications.</>
                      )}
                    </Typography>
                  </Alert>
                )}

                {/* Show deletion warning for deleted packages */}
                {viewDialog.package.status === 'deleted' && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      <strong>🗑️ PACKAGE DELETED:</strong> This package was permanently deleted on {formatDate(viewDialog.package.deletedAt)}. 
                      Package ID <strong>{viewDialog.package.packageId}</strong> is preserved for audit purposes. 
                      The package is no longer available for new bookings or modifications.
                    </Typography>
                  </Alert>
                )}
                
                <Grid container spacing={3}>
                  {/* Basic Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2 }}>
                      📋 Basic Information
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Package Name:</strong> {viewDialog.package.packageName}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Package ID:</strong> {viewDialog.package.packageId || 'Pending Assignment'}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Package Type:</strong> {viewDialog.package.packageType}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Target Audience:</strong> {viewDialog.package.targetAudience}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Location:</strong> {viewDialog.package.packageLocation}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          mb: 1,
                          color: viewDialog.package.status === 'deleted' ? '#f44336' : 'text.primary',
                          fontWeight: viewDialog.package.status === 'deleted' ? 'bold' : 'normal'
                        }}>
                          <strong>Status:</strong> {
                            viewDialog.package.status === 'deleted' ? 'DELETED - No longer available' : viewDialog.package.status
                          }
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Description:</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          p: 2, 
                          bgcolor: '#f5f5f5', 
                          borderRadius: 1,
                          textDecoration: viewDialog.package.status === 'deleted' ? 'line-through' : 'none',
                          color: viewDialog.package.status === 'deleted' ? '#9e9e9e' : 'text.primary'
                        }}>
                          {viewDialog.package.packageDescription || 'No description provided'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Package History */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2 }}>
                      📅 Package History
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>First Submitted:</strong> {formatDate(viewDialog.package.firstSubmittedAt || viewDialog.package.createdAt)}
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          mb: 1, 
                          color: viewDialog.package.firstApprovedAt ? '#4caf50' : 'text.secondary',
                          fontWeight: viewDialog.package.firstApprovedAt ? 'bold' : 'normal'
                        }}>
                          <strong>First Approved:</strong> {formatDate(viewDialog.package.firstApprovedAt)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" sx={{ 
                          mb: 1, 
                          fontWeight: viewDialog.package.lastUpdatedAt ? 700 : 400,
                          color: viewDialog.package.lastUpdatedAt ? '#ff9800' : 'text.secondary'
                        }}>
                          <strong>Last Updated:</strong> {formatDate(viewDialog.package.lastUpdatedAt)}
                        </Typography>
                        {viewDialog.package.deletedAt && (
                          <Typography variant="body2" sx={{ mb: 1, color: '#f44336', fontWeight: 700 }}>
                            <strong>🗑️ Deleted:</strong> {formatDate(viewDialog.package.deletedAt)}
                          </Typography>
                        )}
                      </Grid>
                    </Grid>
                    
                    {/* Package ID Info */}
                    <Box sx={{ 
                      mt: 2, 
                      p: 2, 
                      bgcolor: viewDialog.package.status === 'deleted' ? '#ffebee' : '#e8f5e8', 
                      borderRadius: 1, 
                      border: viewDialog.package.status === 'deleted' ? '2px solid #f44336' : '2px solid #4caf50' 
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <HistoryIcon sx={{ 
                          color: viewDialog.package.status === 'deleted' ? '#f44336' : '#2e7d32' 
                        }} />
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 700, 
                          color: viewDialog.package.status === 'deleted' ? '#f44336' : '#2e7d32' 
                        }}>
                          Package ID {viewDialog.package.status === 'deleted' ? 'Preservation (Deleted Package)' : 'Consistency Guarantee'}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Current Package ID:</strong> {viewDialog.package.packageId || 'Will be assigned on first approval'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {viewDialog.package.status === 'deleted' ? (
                          <>
                            🗑️ This package has been <strong>deleted</strong> but Package ID is <strong>preserved for audit trail</strong><br/>
                            📋 Deletion maintains Package ID for historical reference and compliance<br/>
                            🚫 Package is no longer available for new bookings or modifications<br/>
                            📝 All historical data and transactions remain accessible via this Package ID
                          </>
                        ) : (
                          <>
                            ✅ This Package ID is <strong>permanent</strong> and will <strong>never change</strong><br/>
                            ✅ Updates and modifications preserve the original Package ID<br/>
                            ✅ Consistent tracking throughout the entire package lifecycle<br/>
                            ✅ Audit trail maintains Package ID for historical reference
                          </>
                        )}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setViewDialog({ open: false, package: null })}
              variant="outlined"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete confirmation dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle sx={{ color: '#d32f2f', fontWeight: 600 }}>
            Confirm Package Deletion Request
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Are you sure you want to request deletion for "{packageToDelete?.packageName}"?
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>🔒 Package ID Preservation:</strong> 
                {packageToDelete?.packageId 
                  ? ` Package ID ${packageToDelete.packageId} will be preserved in the system for audit purposes.`
                  : ' If this package gets approved first, its Package ID will be preserved for audit purposes.'
                }
              </Typography>
            </Alert>
            <Typography variant="body2" color="text.secondary">
              You can cancel this request by contacting the admin before they make a decision.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Submit Deletion Request
            </Button>
          </DialogActions>
        </Dialog>

        {/* 🔧 ENHANCED: Package Form Dialog with proper title and button text */}
        <Dialog open={openPackageDialog} onClose={() => setOpenPackageDialog(false)} maxWidth="lg" fullWidth>
          <DialogTitle sx={{ bgcolor: '#003047', color: 'white', fontWeight: 700 }}>
            {getDialogTitle()}
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {/* Package ID consistency notice for edits */}
            {editingPackage && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  {editingPackage.packageId ? (
                    <>
                      <strong>🔒 Package ID Consistency:</strong> This package has the permanent ID <strong>{editingPackage.packageId}</strong>. 
                      This ID will remain unchanged after your update is approved by the admin.
                    </>
                  ) : (
                    <>
                      <strong>🆔 Package ID Assignment:</strong> This package will receive a permanent Package ID after admin approval. 
                      Once assigned, this ID will never change.
                    </>
                  )}
                </Typography>
              </Alert>
            )}
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2 }}>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Package Name"
                  value={packageFormData.packageName}
                  onChange={(e) => setPackageFormData({...packageFormData, packageName: e.target.value})}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Package Type</InputLabel>
                  <Select
                    value={packageFormData.packageType}
                    onChange={(e) => setPackageFormData({...packageFormData, packageType: e.target.value})}
                  >
                    {packageTypes.map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Target Audience</InputLabel>
                  <Select
                    value={packageFormData.targetAudience}
                    onChange={(e) => setPackageFormData({...packageFormData, targetAudience: e.target.value})}
                  >
                    {targetAudiences.map((audience) => (
                      <MenuItem key={audience} value={audience}>{audience}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Package Location</InputLabel>
                  <Select
                    value={packageFormData.packageLocation}
                    onChange={(e) => setPackageFormData({...packageFormData, packageLocation: e.target.value})}
                  >
                    <MenuItem value="home_service">Home Service</MenuItem>
                    <MenuItem value="salon_only">Salon Only</MenuItem>
                    <MenuItem value="both">Both</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Package Description"
                  value={packageFormData.packageDescription}
                  onChange={(e) => setPackageFormData({...packageFormData, packageDescription: e.target.value})}
                />
              </Grid>

              {/* Pricing & Duration */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2, mt: 2 }}>
                  Pricing & Duration
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Price"
                  value={packageFormData.totalPrice}
                  onChange={(e) => setPackageFormData({...packageFormData, totalPrice: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">LKR</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Total Duration (minutes)"
                  value={packageFormData.totalDuration}
                  onChange={(e) => setPackageFormData({...packageFormData, totalDuration: parseInt(e.target.value)})}
                />
              </Grid>

              {/* Additional fields */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Min Lead Time (hours)"
                  value={packageFormData.minLeadTime}
                  onChange={(e) => setPackageFormData({...packageFormData, minLeadTime: parseInt(e.target.value)})}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Max Advance Booking (days)"
                  value={packageFormData.maxLeadTime}
                  onChange={(e) => setPackageFormData({...packageFormData, maxLeadTime: parseInt(e.target.value)})}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Cancellation Policy"
                  value={packageFormData.cancellationPolicy}
                  onChange={(e) => setPackageFormData({...packageFormData, cancellationPolicy: e.target.value})}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Custom Notes"
                  value={packageFormData.customNotes}
                  onChange={(e) => setPackageFormData({...packageFormData, customNotes: e.target.value})}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Preparation Required"
                  value={packageFormData.preparationRequired}
                  onChange={(e) => setPackageFormData({...packageFormData, preparationRequired: e.target.value})}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5' }}>
            <Button 
              onClick={() => setOpenPackageDialog(false)}
              sx={{ color: '#666' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePackageSubmit} 
              variant="contained" 
              disabled={loading}
              sx={{
                bgcolor: '#003047',
                '&:hover': { bgcolor: '#003047' },
                fontWeight: 600
              }}
            >
              {getSubmitButtonText()}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Enhanced notification system */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setNotification({ ...notification, open: false })} 
            severity={notification.severity}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
      <Footer />
    </Box>
  );
};

export default PackageManagement;