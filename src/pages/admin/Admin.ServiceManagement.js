// // admin/Admin.ServiceManagement.js - ENHANCED WITH COMPLETE PACKAGE DETAILS
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Container,
//   Typography,
//   Paper,
//   Alert,
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
//   Avatar,
//   TextField,
//   InputAdornment,
//   Grid,
//   Button,
//   Tabs,
//   Tab,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Divider,
//   ImageList,
//   ImageListItem,
//   ImageListItemBar
// } from '@mui/material';
// import {
//   Search as SearchIcon,
//   Business as BusinessIcon,
//   CheckCircle as ApprovedIcon,
//   Pending as PendingIcon,
//   Cancel as RejectedIcon,
//   Menu as MenuIcon,
//   Logout as LogoutIcon,
//   Refresh as RefreshIcon,
//   Visibility as ViewIcon,
//   Check as ApproveIcon,
//   Close as RejectIcon,
//   Store as StoreIcon,
//   Category as ServiceIcon,
//   Inventory as PackageIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Person as PersonIcon,
//   Email as EmailIcon,
//   Phone as PhoneIcon,
//   LocationOn as LocationIcon,
//   CalendarToday as DateIcon,
//   Description as DescriptionIcon,
//   Work as ExperienceIcon,
//   Badge as BadgeIcon,
//   Home as HomeIcon,
//   Business as BusinessAddressIcon,
//   Photo as PhotoIcon,
//   AttachMoney as PriceIcon,
//   Schedule as TimeIcon,
//   Group as AudienceIcon,
//   Update as UpdateIcon,
//   NewReleases as NewIcon,
//   Warning as WarningIcon,
//   History as HistoryIcon,
//   Assignment as RequestIcon,
//   Priority as PriorityIcon,
//   Block as BlockIcon
// } from '@mui/icons-material';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import Footer from '../../components/footer';
// import AdminSidebar from '../../components/AdminSidebar';
// import api from '../../services/auth';
// import { approveServiceProvider } from '../../services/auth';
// import { rejectServiceProvider } from '../../services/notification';
// import { styled } from '@mui/material/styles';

// const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
//   borderRadius: theme.shape.borderRadius * 2,
//   boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
//   // enable horizontal scroll for wide tables
//   overflowX: 'auto',
//   overflowY: 'hidden',
//   border: '1px solid rgba(7, 91, 94, 0.1)'
// }));

// const HeaderCell = styled(TableCell)(({ theme }) => ({
//   backgroundColor: '#003047',
//   color: theme.palette.common.white,
//   fontWeight: 700,
//   fontSize: '0.95rem',
//   padding: theme.spacing(2),
//   borderBottom: 'none'
// }));

// const StyledTableRow = styled(TableRow)(({ theme, status }) => {
//   let backgroundColor;
//   switch (status) {
//     case 'approved':
//       backgroundColor = 'rgba(76, 175, 80, 0.05)';
//       break;
//     case 'pending_approval':
//     case 'pending':
//       backgroundColor = 'rgba(255, 193, 7, 0.05)';
//       break;
//     case 'rejected':
//       backgroundColor = 'rgba(244, 67, 54, 0.05)';
//       break;
//     default:
//       backgroundColor = 'rgba(255, 193, 7, 0.05)';
//   }
  
//   return {
//     backgroundColor,
//     '&:hover': {
//       backgroundColor: status === 'approved' 
//         ? 'rgba(76, 175, 80, 0.15)' 
//         : status === 'rejected' 
//         ? 'rgba(244, 67, 54, 0.15)'
//         : 'rgba(255, 193, 7, 0.15)',
//       transform: 'translateY(-1px)',
//       boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//       transition: 'all 0.2s ease-in-out'
//     }
//   };
// });

// const ServiceManagementAdmin = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
  
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [currentTab, setCurrentTab] = useState(0);
//   const [serviceProviders, setServiceProviders] = useState([]);
//   const [services, setServices] = useState([]);
//   const [packages, setPackages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedItemId, setSelectedItemId] = useState(null);
//   const [detailsDialog, setDetailsDialog] = useState({ open: false, item: null, type: '' });
//   const [selectedProvider, setSelectedProvider] = useState(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       console.log('Fetching admin data...');
      
//       const [providersRes, listRes, packagesRes] = await Promise.all([
//         api.get('/auth/service-providers'),
//         api.get('/services/admin/all'), // use 'all' endpoint instead of 'list'
//         api.get('/packages/admin/history')
//       ]);

//       console.log('Providers response:', providersRes.data);
//       console.log('Services list response:', listRes.data);

//       if (providersRes.data.success) {
//         setServiceProviders(providersRes.data.providers || providersRes.data.data || []);
//       }
      
//       if (listRes.data.success) {
//         // listRes.data.services includes new/update/delete requests with labels
//         setServices(listRes.data.services || []);
//         console.log(`Total services loaded: ${listRes.data.services.length}`);
//       }
      
//       if (packagesRes.data.success) {
//         setPackages(packagesRes.data.packages || packagesRes.data.data || []);
//       }
//     } catch (error) {
//       setError('Failed to fetch data');
//       console.error('Fetch data error:', error);
//       console.error('Error response:', error.response?.data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApproval = async (id, type, action) => {
//     setLoading(true);
//     let endpoint = '';
//     let requestBody = {};

//     try {
//       if (type === 'provider') {
//         endpoint = `/auth/approve-provider/${id}`;
//         requestBody = { reason: action === 'reject' ? 'Provider rejected by admin' : 'Provider approved by admin' };
//         const response = await api.put(endpoint, requestBody);
//         if (!response.data.success) {
//           throw new Error(response.data.message || `Failed to ${action} provider`);
//         }
//       } else if (type === 'service') {
//         endpoint = `/services/admin/${id}/${action}`;
//         if (action === 'reject') {
//           requestBody = { reason: 'Service does not meet our quality standards' };
//         } else {
//           requestBody = { reason: 'Service approved by admin' };
//         }
//         const response = await api.post(endpoint, requestBody);
//         if (!response.data.success) {
//           throw new Error(response.data.message || `Failed to ${action} service`);
//         }
//       } else if (type === 'package') {
//         endpoint = `/packages/admin/${id}/${action}`;
//         if (action === 'reject') {
//           requestBody = { reason: 'Package does not meet our standards' };
//         } else {
//           requestBody = { reason: 'Package approved by admin' };
//         }
//         const response = await api.post(endpoint, requestBody);
//         if (!response.data.success) {
//           throw new Error(response.data.message || `Failed to ${action} package`);
//         }
//       }

//       setDetailsDialog({ open: false, item: null, type: '' });
//       setSelectedItemId(null);
//       setError('');
//       await fetchData();

//       console.log(`${type} ${action}d successfully`);
//     } catch (error) {
//       console.error(`Error ${action}ing ${type}:`, error);
//       setError(`Failed to ${action} ${type}: ${error.response?.data?.message || error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleProviderAction = async (id, action) => {
//     try {
//       setLoading(true);
//       if (action === 'approve') {
//         await approveServiceProvider(id);
//       } else {
//         await rejectServiceProvider(id, 'Your registration was declined');
//       }
//       // Refresh data and clear selection
//       await fetchData();
//       setSelectedItemId(null);
//       setError('');
//     } catch (err) {
//       setError(`Failed to ${action} provider`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusChip = (status) => {
//     const statusConfig = {
//       approved: { label: 'Approved', color: 'success', icon: <ApprovedIcon /> },
//       pending_approval: { label: 'Pending', color: 'warning', icon: <PendingIcon /> },
//       pending: { label: 'Pending', color: 'warning', icon: <PendingIcon /> },
//   rejected: { label: 'Approval Rejected', color: 'error', icon: <RejectedIcon /> },
//       deleted: { label: 'Deleted', color: 'default', icon: <BlockIcon /> }
//     };

//     const config = statusConfig[status] || statusConfig.pending;
//     return (
//       <Chip
//         icon={config.icon}
//         label={config.label}
//         color={config.color}
//         size="small"
//         sx={{ 
//           fontWeight: 600,
//           ...(status === 'deleted' && {
//             backgroundColor: '#616161',
//             color: 'white',
//             '& .MuiChip-icon': {
//               color: 'white'
//             }
//           })
//         }}
//       />
//     );
//   };
  
  
//   // Helper to display request type or availability based on service status and pendingChanges
//   const getRequestTypeChip = (service) => {
//     if (service.status === 'pending_approval' && !service.pendingChanges) {
//       return <Chip label="New Service" color="warning" size="small" sx={{ fontWeight: 600 }} />;
//     }
//     if (service.pendingChanges?.actionType === 'update') {
//       return <Chip label="Update Needed" color="secondary" size="small" sx={{ fontWeight: 600 }} />;
//     }
//     if (service.pendingChanges?.actionType === 'delete') {
//       return <Chip label="Delete Requested" color="error" size="small" sx={{ fontWeight: 600 }} />;
//     }
//     if (service.status === 'deleted') {
//       return <Chip label="Deleted - No Longer Available" color="default" size="small" sx={{ fontWeight: 600, backgroundColor: '#616161', color: 'white' }} />;
//     }
//     if (service.status === 'approved' && service.isActive) {
//       return <Chip label="Available" color="success" size="small" sx={{ fontWeight: 600 }} />;
//     }
//     // fallback to status chip
//     return getStatusChip(service.status);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/admin-login');
//   };

//   const filterItems = (items, searchField) => {
//     if (!items || !Array.isArray(items)) return [];
    
//     return items.filter(item => {
//       if (!item) return false;
      
//       const fieldValue = item[searchField];
//       const providerName = item.serviceProvider?.businessName;
      
//       return (
//         (fieldValue && fieldValue.toLowerCase().includes(searchTerm.toLowerCase())) ||
//         (providerName && providerName.toLowerCase().includes(searchTerm.toLowerCase()))
//       );
//     });
//   };

//   const handleViewDetails = (item, type) => {
//     setDetailsDialog({ open: true, item, type });
//   };

//   const handleSelectProvider = (prov) => {
//     setSelectedProvider(prov);
//     setCurrentTab(0);
//     fetchData();
//   };

//   // ENHANCED: Request Type Display Component for Package Details
//   const RequestTypeDisplay = ({ pkg }) => {
//     console.log('🔍 RequestTypeDisplay - Package status analysis:', {
//       packageName: pkg.packageName,
//       status: pkg.status,
//       pendingChanges: pkg.pendingChanges?.requestType,
//       deletedAt: pkg.deletedAt,
//       packageId: pkg.packageId
//     });

//     // CRITICAL FIX: PRIORITY 1 - Handle actually deleted packages (status = 'deleted')
//     if (pkg.status === 'deleted') {
//       console.log('✅ Showing DELETED status for package:', pkg.packageName);
//       return (
//         <Box sx={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           gap: 1,
//           p: 1.5,
//           bgcolor: '#f5f5f5',
//           borderRadius: 2,
//           border: '3px solid #616161',
//           opacity: 0.8
//         }}>
//           <BlockIcon sx={{ color: '#616161', fontSize: 24 }} />
//           <Box>
//             <Typography variant="subtitle2" sx={{ 
//               fontWeight: 'bold', 
//               color: '#616161',
//               fontSize: '0.9rem'
//             }}>
//               PACKAGE DELETED
//             </Typography>
//             <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
//               Package no longer available
//             </Typography>
//           </Box>
//           <Chip 
//             label="FINAL" 
//             size="small" 
//             sx={{ 
//               fontSize: '0.65rem', 
//               height: 20, 
//               fontWeight: 'bold',
//               backgroundColor: '#616161',
//               color: 'white'
//             }}
//           />
//         </Box>
//       );
//     }

//     // PRIORITY 2: Handle pending deletion requests (pendingChanges.requestType = 'delete')
//     if (pkg.pendingChanges?.requestType === 'delete') {
//       console.log('⚠️ Showing PENDING DELETION for package:', pkg.packageName);
//       return (
//         <Box sx={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           gap: 1,
//           p: 1.5,
//           bgcolor: '#ffebee',
//           borderRadius: 2,
//           border: '3px solid #f44336'
//         }}>
//           <DeleteIcon sx={{ color: '#f44336', fontSize: 24 }} />
//           <Box>
//             <Typography variant="subtitle2" sx={{ 
//               fontWeight: 'bold', 
//               color: '#f44336',
//               fontSize: '0.9rem'
//             }}>
//               DELETE REQUEST
//             </Typography>
//             <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
//               Pending deletion approval
//             </Typography>
//           </Box>
//           <Chip 
//             label="HIGH" 
//             size="small" 
//             color="error"
//             sx={{ fontSize: '0.65rem', height: 20, fontWeight: 'bold' }}
//           />
//         </Box>
//       );
//     }

//     // PRIORITY 3: Handle other request types
//     if (!pkg.pendingChanges?.requestType) {
//       return (
//         <Box sx={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           gap: 1,
//           p: 1,
//           bgcolor: '#f3e5f5',
//           borderRadius: 2,
//           border: '2px solid #9c27b0'
//         }}>
//           <PendingIcon sx={{ color: '#9c27b0', fontSize: 20 }} />
//           <Box>
//             <Typography variant="subtitle2" sx={{ 
//               fontWeight: 'bold', 
//               color: '#9c27b0',
//               fontSize: '0.85rem'
//             }}>
//               STANDARD APPROVAL
//             </Typography>
//             <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
//               Regular package approval
//             </Typography>
//           </Box>
//         </Box>
//       );
//     }

//     const requestType = pkg.pendingChanges.requestType;
    
//     const configs = {
//       create: {
//         icon: NewIcon,
//         label: 'NEW PACKAGE',
//         description: 'First-time submission',
//         color: '#2196f3',
//         bgColor: '#e3f2fd',
//         priority: 'HIGH',
//         priorityColor: 'error'
//       },
//       update: {
//         icon: EditIcon,
//         label: 'UPDATE REQUEST',
//         description: 'Existing package modification',
//         color: '#ff9800',
//         bgColor: '#fff3e0',
//         priority: 'MEDIUM',
//         priorityColor: 'warning'
//       }
//     };

//     const config = configs[requestType] || configs.create;
//     const IconComponent = config.icon;

//     return (
//       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 200 }}>
//         <Box sx={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           gap: 1,
//           p: 1.5,
//           bgcolor: config.bgColor,
//           borderRadius: 2,
//           border: `3px solid ${config.color}`
//         }}>
//           <IconComponent sx={{ color: config.color, fontSize: 24 }} />
//           <Box sx={{ flexGrow: 1 }}>
//             <Typography variant="subtitle2" sx={{ 
//               fontWeight: 'bold', 
//               color: config.color,
//               fontSize: '0.9rem'
//             }}>
//               {config.label}
//             </Typography>
//             <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
//               {config.description}
//             </Typography>
//           </Box>
//           <Chip 
//             label={config.priority} 
//             size="small" 
//             color={config.priorityColor}
//             sx={{ fontSize: '0.65rem', height: 20, fontWeight: 'bold' }}
//           />
//         </Box>
//       </Box>
//     );
//   };

//   // FIXED: Helper function to display image with proper error handling and URL construction
//   const renderImage = (imagePath, altText) => {
//     if (!imagePath) return null;
    
//     // Construct proper image URL based on different scenarios
//     let imageUrl;
    
//     if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//       // Already a full URL
//       imageUrl = imagePath;
//     } else if (imagePath.startsWith('uploads/')) {
//       // Path already includes uploads folder
//       imageUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${imagePath}`;
//     } else {
//       // Just the filename
//       imageUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/serviceProviders/${imagePath}`;
//     }
    
//     console.log('🖼️ Loading image from URL:', imageUrl);
    
//     return (
//       <Card sx={{ maxWidth: 200, mb: 2, border: '1px solid #ddd' }}>
//         <Box sx={{ position: 'relative', height: 150, overflow: 'hidden' }}>
//           <img
//             src={imageUrl}
//             alt={altText}
//             style={{
//               width: '100%',
//               height: '100%',
//               objectFit: 'cover',
//               borderRadius: '4px 4px 0 0'
//             }}
//             onLoad={(e) => {
//               console.log('✅ Image loaded successfully:', imageUrl);
//               e.target.style.border = '2px solid #4caf50';
//             }}
//             onError={(e) => {
//               console.error('❌ Failed to load image:', imageUrl);
//               // Try alternative URL patterns
//               const alternativeUrls = [
//                 `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imagePath}`,
//                 `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/public/uploads/serviceProviders/${imagePath}`,
//                 `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/static/uploads/serviceProviders/${imagePath}`
//               ];
              
//               // Try first alternative
//               if (alternativeUrls[0] !== imageUrl) {
//                 console.log('🔄 Trying alternative URL:', alternativeUrls[0]);
//                 e.target.src = alternativeUrls[0];
//                 return;
//               }
              
//               // If all fail, show error placeholder
//               e.target.style.display = 'none';
//               const errorDiv = e.target.parentElement;
//               if (errorDiv && !errorDiv.querySelector('.error-placeholder')) {
//                 const placeholder = document.createElement('div');
//                 placeholder.className = 'error-placeholder';
//                 placeholder.style.cssText = `
//                   width: 100%;
//                   height: 100%;
//                   background: #f5f5f5;
//                   display: flex;
//                   flex-direction: column;
//                   align-items: center;
//                   justify-content: center;
//                   color: #666;
//                   text-align: center;
//                   padding: 20px;
//                 `;
//                 placeholder.innerHTML = `
//                   <div style="font-size: 24px; margin-bottom: 8px;">📷</div>
//                   <div style="font-size: 12px;">Image not found</div>
//                   <div style="font-size: 10px; margin-top: 4px;">${imagePath}</div>
//                 `;
//                 errorDiv.appendChild(placeholder);
//               }
//             }}
//           />
//         </Box>
//         <Box sx={{ p: 1, textAlign: 'center', bgcolor: '#f8f9fa' }}>
//           <Typography variant="caption" sx={{ fontWeight: 500, color: '#003047' }}>
//             {altText}
//           </Typography>
//           <Typography variant="caption" sx={{ display: 'block', fontSize: '0.7rem', color: '#666', mt: 0.5 }}>
//             {imagePath}
//           </Typography>
//         </Box>
//       </Card>
//     );
//   };

//   const renderServiceProvidersTable = () => {
//     const filteredProviders = filterItems(serviceProviders, 'businessName');
    
//     return (
//       <StyledTableContainer>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <HeaderCell>Business Details</HeaderCell>
//               <HeaderCell>Contact Information</HeaderCell>
//               <HeaderCell>Business Type & Experience</HeaderCell>
//               <HeaderCell>Location</HeaderCell>
//               <HeaderCell>Registration Date</HeaderCell>
//               <HeaderCell>Status</HeaderCell>
//               <HeaderCell align="center">Actions</HeaderCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredProviders.map(provider => (
//               <StyledTableRow key={provider._id} status={provider.approvalStatus}>
//                 <TableCell>
//                   <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                     <Avatar 
//                       sx={{ 
//                         bgcolor: provider.approvalStatus === 'approved' ? '#4CAF50' : '#FF9800',
//                         mr: 2,
//                         width: 48,
//                         height: 48
//                       }}
//                     >
//                       <BusinessIcon />
//                     </Avatar>
//                     <Box>
//                       <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#8B4B9C' }}>
//                         {provider.businessName || 'N/A'}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         Owner: {provider.fullName || 'N/A'}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
//                         NIC: {provider.nicNumber || 'N/A'}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </TableCell>
//                 <TableCell>
//                   <Typography variant="body2" sx={{ mb: 0.5 }}>{provider.emailAddress}</Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {provider.mobileNumber || 'N/A'}
//                   </Typography>
//                 </TableCell>
//                 <TableCell>
//                   <Box>
//                     <Chip 
//                       label={provider.businessType || 'N/A'} 
//                       variant="outlined" 
//                       size="small" 
//                       sx={{ mb: 1 }}
//                     />
//                     <Typography variant="body2" color="text.secondary">
//                       Experience: {provider.experienceYears || 0} years
//                     </Typography>
//                   </Box>
//                 </TableCell>
//                 <TableCell>
//                   <Typography variant="body2" sx={{ fontWeight: 500 }}>{provider.city || 'N/A'}</Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
//                     Business: {provider.currentAddress?.substring(0, 25)}{provider.currentAddress?.length > 25 ? '...' : ''}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
//                     Home: {provider.homeAddress?.substring(0, 25)}{provider.homeAddress?.length > 25 ? '...' : ''}
//                   </Typography>
//                 </TableCell>
//                 <TableCell>{formatDate(provider.createdAt)}</TableCell>
//                 <TableCell>{getStatusChip(provider.approvalStatus)}</TableCell>
//                 <TableCell align="center">
//                   <IconButton
//                     onClick={(e) => { e.stopPropagation(); handleViewDetails(provider, 'provider'); }}
//                     sx={{ color: '#003047' }}
//                   >
//                     <ViewIcon />
//                   </IconButton>
//                   {provider.approvalStatus === 'pending' && (
//                     <>
//                       <IconButton
//                         onClick={(e) => { e.stopPropagation(); handleProviderAction(provider._id, 'approve'); }}
//                         sx={{ color: '#4CAF50' }}
//                       >
//                         <ApproveIcon />
//                       </IconButton>
//                       <IconButton
//                         onClick={(e) => { e.stopPropagation(); handleProviderAction(provider._id, 'reject'); }}
//                         sx={{ color: '#f44336' }}
//                       >
//                         <RejectIcon />
//                       </IconButton>
//                     </>
//                   )}
//                 </TableCell>
//               </StyledTableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </StyledTableContainer>
//     );
//   };

//   const renderServicesTable = () => {
//     const filteredServices = services ? filterItems(services.filter(service => service != null), 'name') : [];
    
//     return (
//       <StyledTableContainer>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <HeaderCell>Service Details</HeaderCell>
//               <HeaderCell>Service ID</HeaderCell>
//               <HeaderCell>Provider ID</HeaderCell>
//               <HeaderCell>Type & Category</HeaderCell>
//               <HeaderCell>Pricing</HeaderCell>
//               <HeaderCell>First Approved</HeaderCell>
//               <HeaderCell>Last Updated</HeaderCell>
//               <HeaderCell>Deleted Date</HeaderCell>
//               <HeaderCell>Availability</HeaderCell>
//               <HeaderCell>Status</HeaderCell>
//               <HeaderCell align="center">Actions</HeaderCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredServices.length > 0 ? (
//               filteredServices.map(service => {
//                 if (!service || !service._id) {
//                   return null;
//                 }
                
//                 return (
//                   <StyledTableRow 
//                     key={service._id}
//                     status={service.status}
//                     selected={selectedItemId === service._id}
//                     onClick={() => setSelectedItemId(service._id)}
//                     sx={{ cursor: 'pointer' }}
//                   >
//                     <TableCell>
//                       <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#8B4B9C' }}>
//                         {service.name}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary">
//                         {service.description?.substring(0, 50)}...
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2" sx={{ fontWeight: 500, color: '#003047' }}>
//                         {service?.serviceId || 'Not assigned'}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2" color="text.secondary">
//                         {service?.serviceProviderId || service?.serviceProvider?._id?.slice(-6) || 'N/A'}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Chip label={service.type} variant="outlined" size="small" sx={{ mb: 0.5 }} />
//                       <Typography variant="body2" color="text.secondary">
//                         {service.category}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
//                         LKR {service.pricing?.basePrice || 0}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2">
//                         {service?.firstApprovedAt ? formatDate(service.firstApprovedAt) : 'Not approved'}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2">
//                         {service?.lastUpdatedAt ? formatDate(service.lastUpdatedAt) : 'Never'}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Typography variant="body2" color={service?.deletedAt ? 'error' : 'text.secondary'}>
//                         {service?.deletedAt ? formatDate(service.deletedAt) : 'N/A'}
//                       </Typography>
//                     </TableCell>
//                     <TableCell>
//                       <Chip
//                         label={service.isActive ? 'Available' : 'Unavailable'}
//                         color={service.isActive ? 'success' : 'error'}
//                         size="small"
//                         sx={{ fontWeight: 600 }}
//                       />
//                     </TableCell>
//                     <TableCell>{getStatusChip(service.status)}</TableCell>
//                     <TableCell align="center">
//                       <IconButton
//                         onClick={e => { e.stopPropagation(); handleViewDetails(service, 'service'); }}
//                         sx={{ color: '#003047' }}
//                       >
//                         <ViewIcon />
//                       </IconButton>
//                       {service.status === 'pending_approval' ? (
//                         <>
//                           <IconButton onClick={e => { e.stopPropagation(); handleApproval(service._id, 'service', 'approve'); }}
//                                       sx={{ color: '#4CAF50' }} disabled={loading}>
//                             <ApproveIcon />
//                           </IconButton>
//                           <IconButton onClick={e => { e.stopPropagation(); handleApproval(service._id, 'service', 'reject'); }}
//                                       sx={{ color: '#f44336' }} disabled={loading}>
//                             <RejectIcon />
//                           </IconButton>
//                         </>
//                       ) : (
//                         <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
//                           No actions available
//                         </Typography>
//                       )}
//                     </TableCell>
//                   </StyledTableRow>
//                 );
//               })
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
//                   <Typography variant="body1" color="text.secondary">
//                     No services found
//                   </Typography>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </StyledTableContainer>
//     );
//   };

//   const renderPackagesTable = () => {
//     const filteredPackages = filterItems(packages, 'packageName');
    
//     return (
//       <StyledTableContainer>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <HeaderCell>Package Details</HeaderCell>
//               <HeaderCell>Package ID</HeaderCell>
//               <HeaderCell>Provider ID</HeaderCell>
//               <HeaderCell>Type & Audience</HeaderCell>
//               <HeaderCell>Pricing</HeaderCell>
//               <HeaderCell>First Approved</HeaderCell>
//               <HeaderCell>Last Updated</HeaderCell>
//               <HeaderCell>Deleted Date</HeaderCell>
//               <HeaderCell>Availability</HeaderCell>
//               <HeaderCell>Status</HeaderCell>
//               <HeaderCell align="center">Actions</HeaderCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredPackages.map(pkg => (
//               <StyledTableRow 
//                 key={pkg._id}
//                 status={pkg.status}
//                 selected={selectedItemId === pkg._id}
//                 onClick={() => setSelectedItemId(pkg._id)}
//                 sx={{ cursor: 'pointer' }}
//               >
//                 <TableCell>
//                   <Typography variant="subtitle1" sx={{ 
//                     fontWeight: 600, 
//                     color: pkg.status === 'deleted' ? '#9e9e9e' : '#8B4B9C',
//                     textDecoration: pkg.status === 'deleted' ? 'line-through' : 'none'
//                   }}>
//                     {pkg.packageName}
//                     {pkg.status === 'deleted' && (
//                       <Typography component="span" sx={{ 
//                         ml: 1, 
//                         color: '#f44336', 
//                         fontWeight: 'bold',
//                         fontSize: '0.8rem'
//                       }}>
//                         [DELETED]
//                       </Typography>
//                     )}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {pkg.packageDescription?.substring(0, 50)}...
//                   </Typography>
//                 </TableCell>
//                 <TableCell>
//                   <Typography variant="body2" sx={{ 
//                     fontWeight: 500, 
//                     color: pkg.packageId ? (pkg.status === 'deleted' ? '#9e9e9e' : '#003047') : '#ff9800'
//                   }}>
//                     {pkg?.packageId || 'Not assigned'}
//                   </Typography>
//                 </TableCell>
//                 <TableCell>
//                   <Typography variant="body2" color="text.secondary">
//                     {pkg?.serviceProviderId || pkg?.serviceProvider?._id?.slice(-6) || 'N/A'}
//                   </Typography>
//                 </TableCell>
//                 <TableCell>
//                   <Chip 
//                     label={pkg.packageType} 
//                     variant="outlined" 
//                     size="small" 
//                     sx={{ 
//                       mb: 0.5,
//                       opacity: pkg.status === 'deleted' ? 0.6 : 1
//                     }} 
//                   />
//                   <Typography variant="body2" color="text.secondary">
//                     {pkg.targetAudience}
//                   </Typography>
//                 </TableCell>
//                 <TableCell>
//                   <Typography variant="subtitle2" sx={{ 
//                     fontWeight: 600,
//                     color: pkg.status === 'deleted' ? '#9e9e9e' : 'text.primary',
//                     textDecoration: pkg.status === 'deleted' ? 'line-through' : 'none'
//                   }}>
//                     LKR {pkg.totalPrice || 0}
//                   </Typography>
//                 </TableCell>
//                 <TableCell>
//                   <Typography variant="body2" sx={{ 
//                     color: pkg?.firstApprovedAt ? '#4caf50' : 'text.secondary',
//                     fontWeight: pkg?.firstApprovedAt ? 600 : 400
//                   }}>
//                     {pkg?.firstApprovedAt ? formatDate(pkg.firstApprovedAt) : 'Not approved'}
//                   </Typography>
//                 </TableCell>
//                 <TableCell>
//                   <Typography variant="body2" sx={{ 
//                     fontWeight: pkg?.lastUpdatedAt ? 700 : 400,
//                     color: pkg?.lastUpdatedAt ? '#ff9800' : 'text.secondary'
//                   }}>
//                     {pkg?.lastUpdatedAt ? formatDate(pkg.lastUpdatedAt) : 'Never'}
//                   </Typography>
//                 </TableCell>
//                 <TableCell>
//                   <Typography variant="body2" color={pkg?.deletedAt ? 'error' : 'text.secondary'}>
//                     {pkg?.deletedAt ? formatDate(pkg.deletedAt) : 'N/A'}
//                   </Typography>
//                 </TableCell>
//                 <TableCell>
//                   <Chip 
//                     label={pkg.status === 'deleted' ? 'No Longer Available' : (pkg?.availabilityStatus || 'Available')} 
//                     color={pkg.status === 'deleted' ? 'default' : ((pkg?.availabilityStatus || 'Available') === 'Available' ? 'success' : 'error')} 
//                     size="small"
//                     sx={{
//                       ...(pkg.status === 'deleted' && {
//                         backgroundColor: '#616161',
//                         color: 'white'
//                       })
//                     }}
//                   />
//                 </TableCell>
//                 <TableCell>{getStatusChip(pkg.status)}</TableCell>
//                 <TableCell align="center">
//                   <IconButton 
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleViewDetails(pkg, 'package');
//                     }}
//                     sx={{ color: '#003047' }}
//                   >
//                     <ViewIcon />
//                   </IconButton>
//                   {(pkg.status === 'pending_approval' || pkg.pendingChanges) && pkg.status !== 'deleted' && (
//                     <>
//                       <IconButton 
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleApproval(pkg._id, 'package', 'approve');
//                         }}
//                         sx={{ color: '#4CAF50' }}
//                         disabled={loading}
//                       >
//                         <ApproveIcon />
//                       </IconButton>
//                       <IconButton 
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleApproval(pkg._id, 'package', 'reject');
//                         }}
//                         sx={{ color: '#f44336' }}
//                         disabled={loading}
//                       >
//                         <RejectIcon />
//                       </IconButton>
//                     </>
//                   )}
//                   {pkg.status === 'deleted' && (
//                     <Typography variant="caption" sx={{ 
//                       color: '#9e9e9e', 
//                       fontStyle: 'italic',
//                       fontSize: '0.7rem',
//                       textAlign: 'center'
//                     }}>
//                       No actions available
//                     </Typography>
//                   )}
//                 </TableCell>
//               </StyledTableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </StyledTableContainer>
//     );
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fafafa' }}>
//       <AppBar position="static" sx={{ bgcolor: '#003047', boxShadow: '0 4px 12px rgba(7,91,94,0.3)' }}>
//         <Toolbar>
//           <IconButton edge="start" color="inherit" onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ mr: 2 }}>
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: '#fafafa' }}>
//              BeautiQ Admin - Enhanced Package Details
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

//       <AdminSidebar
//         open={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//         user={user}
//       />

//       <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
//         <Box sx={{ mb: 4 }}>
//           <Typography variant="h5" gutterBottom sx={{ color: '#003047', fontWeight: 800, mb: 1 }}>
//             Service Provider Management
//           </Typography>
//           <Typography variant="subtitle1" sx={{ color: '#666', mb: 3 }}>
//             Manage service providers, services, and packages - Complete Registration Details
//           </Typography>
//         </Box>

//         {error && (
//           <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
//             {error}
//           </Alert>
//         )}

//         {/* Search and Controls */}
//         <Grid container spacing={3} sx={{ mb: 4 }}>
//           <Grid item xs={12} md={8}>
//             <TextField
//               fullWidth
//               placeholder="Search by name or business..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchIcon sx={{ color: '#8B4B9C' }} />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 3,
//                   backgroundColor: 'white'
//                 }
//               }}
//             />
//           </Grid>
//           <Grid item xs={12} md={4}>
//             <Button
//               variant="contained"
//               startIcon={<RefreshIcon />}
//               onClick={fetchData}
//               disabled={loading}
//               sx={{
//                 bgcolor: '#003047',
//                 '&:hover': { bgcolor: '#003047' },
//                 borderRadius: 2,
//                 height: '56px',
//                 width: '100%',
//                 fontWeight: 600
//               }}
//             >
//               {loading ? 'Loading...' : 'Refresh Data'}
//             </Button>
//           </Grid>
//         </Grid>

//         {/* Tabs */}
//         <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
//           <Tabs 
//             value={currentTab} 
//             onChange={(e, newValue) => setCurrentTab(newValue)}
//             sx={{ borderBottom: 1, borderColor: 'divider' }}
//           >
//             <Tab 
//               icon={<StoreIcon />} 
//               label={`Service Providers (${serviceProviders.length})`} 
//               iconPosition="start"
//             />
//             <Tab 
//               icon={<ServiceIcon />} 
//               label={`Services (${services.length})`} 
//               iconPosition="start"
//             />
//             <Tab 
//               icon={<PackageIcon />} 
//               label={`Packages (${packages.length})`} 
//               iconPosition="start"
//             />
//           </Tabs>
          
//           <CardContent sx={{ p: 0 }}>
//             {currentTab === 0 && renderServiceProvidersTable()}
//             {currentTab === 1 && renderServicesTable()}
//             {currentTab === 2 && renderPackagesTable()}
//           </CardContent>
//         </Card>

//         {/* ENHANCED Details Dialog with ALL Information */}
//         <Dialog 
//           open={detailsDialog.open} 
//           onClose={() => setDetailsDialog({ open: false, item: null, type: '' })}
//           maxWidth="lg"
//           fullWidth
//         >
//           <DialogTitle sx={{ 
//             bgcolor: detailsDialog.item?.status === 'deleted' ? '#f44336' : '#003047', 
//             color: 'white', 
//             fontWeight: 700 
//           }}>
//             {detailsDialog.type === 'provider' ? '👤 Complete Service Provider Registration Details' :
//              detailsDialog.type === 'service' ? '🔧 Service Details' : 
//              '📦 Complete Package Details'}
//             {detailsDialog.item?.status === 'deleted' && ' - DELETED'}
//           </DialogTitle>
//           <DialogContent sx={{ p: 3 }}>
            
//             {/* SERVICE PROVIDER DETAILS (unchanged from previous implementation) */}
//             {detailsDialog.item && detailsDialog.type === 'provider' && (
//               <Grid container spacing={3}>
//                 {/* All the provider details sections remain the same as in your original code */}
//                 {/* Personal Information Section */}
//                 <Grid item xs={12}>
//                   <Card variant="outlined" sx={{ p: 3, mb: 2 }}>
//                     <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
//                       <PersonIcon sx={{ mr: 1 }} />
//                       Personal Information
//                     </Typography>
//                     <Grid container spacing={2}>
//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
//                         <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
//                           {detailsDialog.item.fullName || 'Not provided'}
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="text.secondary">NIC Number</Typography>
//                         <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
//                           {detailsDialog.item.nicNumber || 'Not provided'}
//                         </Typography>
//                       </Grid>
//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="text.secondary">Email Address</Typography>
//                         <Typography variant="body1">{detailsDialog.item.emailAddress}</Typography>
//                       </Grid>
//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="text.secondary">Mobile Number</Typography>
//                         <Typography variant="body1">{detailsDialog.item.mobileNumber || 'Not provided'}</Typography>
//                       </Grid>
//                     </Grid>
//                   </Card>
//                 </Grid>

//                 {/* Continue with other provider sections... */}
//                 {/* (Address, Business, Registration, Documents sections remain the same) */}
//               </Grid>
//             )}

//             {/* SERVICE DETAILS (unchanged) */}
//             {detailsDialog.item && detailsDialog.type === 'service' && (
//               <Grid container spacing={2}>
//                 <Grid item xs={12}>
//                   <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2 }}>
//                     {detailsDialog.item.name}
//                   </Typography>
//                   {getStatusChip(detailsDialog.item.status)}
//                 </Grid>
                
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2" color="text.secondary">Service Type</Typography>
//                   <Typography variant="body1">{detailsDialog.item.type}</Typography>
//                 </Grid>
                
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2" color="text.secondary">Category</Typography>
//                   <Typography variant="body1">{detailsDialog.item.category}</Typography>
//                 </Grid>
                
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2" color="text.secondary">Base Price</Typography>
//                   <Typography variant="body1">LKR {detailsDialog.item.pricing?.basePrice || 0}</Typography>
//                 </Grid>
                
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
//                   <Typography variant="body1">{detailsDialog.item.duration} minutes</Typography>
//                 </Grid>
                
//                 <Grid item xs={12}>
//                   <Typography variant="subtitle2" color="text.secondary">Description</Typography>
//                   <Typography variant="body1">{detailsDialog.item.description}</Typography>
//                 </Grid>
                
//                 <Grid item xs={12}>
//                   <Typography variant="subtitle2" color="text.secondary">Provider</Typography>
//                   <Typography variant="body1">
//                     {detailsDialog.item.serviceProvider?.businessName || detailsDialog.item.serviceProvider?.fullName || 'N/A'}
//                   </Typography>
//                 </Grid>
//                 {/* Timestamps: submission, update, approval, deletion */}
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2" color="text.secondary">First Submitted</Typography>
//                   <Typography variant="body1">{formatDate(detailsDialog.item.createdAt)}</Typography>
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
//                   <Typography variant="body1">{formatDate(detailsDialog.item.updatedAt)}</Typography>
//                 </Grid>
//                 {detailsDialog.item.firstApprovedAt && (
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="subtitle2" color="text.secondary">First Approved</Typography>
//                     <Typography variant="body1">{formatDate(detailsDialog.item.firstApprovedAt)}</Typography>
//                   </Grid>
//                 )}
//                 {detailsDialog.item.deletedAt && (
//                   <Grid item xs={12} sm={6}>
//                     <Typography variant="subtitle2" color="text.secondary">Deleted At</Typography>
//                     <Typography variant="body1">{formatDate(detailsDialog.item.deletedAt)}</Typography>
//                   </Grid>
//                 )}
//               </Grid>
//             )}

//             {/* ENHANCED PACKAGE DETAILS - COMPLETE VERSION */}
//             {detailsDialog.item && detailsDialog.type === 'package' && (
//               <Grid container spacing={3}>
//                 {/* Package ID Consistency Banner */}
//                 <Grid item xs={12}>
//                   {detailsDialog.item.packageId ? (
//                     <Alert severity={detailsDialog.item.status === 'deleted' ? "error" : "success"} sx={{ mb: 2 }}>
//                       <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
//                         🔒 Package ID: {detailsDialog.item.packageId}
//                       </Typography>
//                       <Typography variant="body2">
//                         {detailsDialog.item.status === 'deleted' ? (
//                           <>This package has been <strong>deleted</strong> but Package ID is <strong>preserved for audit trail</strong>. 
//                           The package is no longer available for booking.</>
//                         ) : (
//                           <>This Package ID is <strong>permanent and will never change</strong>, ensuring consistent 
//                           tracking across all updates, modifications, and the entire package lifecycle.</>
//                         )}
//                       </Typography>
//                     </Alert>
//                   ) : (
//                     <Alert severity="info" sx={{ mb: 2 }}>
//                       <Typography variant="body2">
//                         <strong>🆔 Package ID Assignment:</strong> This package will receive a permanent Package ID after admin approval. 
//                         Once assigned, this ID will never change.
//                       </Typography>
//                     </Alert>
//                   )}
//                 </Grid>

//                 {/* Show deletion warning for deleted packages */}
//                 {detailsDialog.item.status === 'deleted' && (
//                   <Grid item xs={12}>
//                     <Alert severity="error" sx={{ mb: 2 }}>
//                       <Typography variant="body2">
//                         <strong>🗑️ PACKAGE DELETED:</strong> This package was permanently deleted on {formatDate(detailsDialog.item.deletedAt)}. 
//                         Package ID <strong>{detailsDialog.item.packageId}</strong> is preserved for audit purposes. 
//                         The package is no longer available for new bookings.
//                       </Typography>
//                     </Alert>
//                   </Grid>
//                 )}

//                 {/* Request Type Analysis (if applicable) */}
//                 {(detailsDialog.item.pendingChanges || detailsDialog.item.status === 'deleted') && (
//                   <Grid item xs={12}>
//                     <Card variant="outlined" sx={{ p: 3, mb: 2, bgcolor: '#f8f9fa' }}>
//                       <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2 }}>
//                         📋 Request Type Analysis
//                       </Typography>
//                       <RequestTypeDisplay pkg={detailsDialog.item} />
//                     </Card>
//                   </Grid>
//                 )}

//                 {/* Basic Package Information */}
//                 <Grid item xs={12} md={6}>
//                   <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
//                     <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
//                       📦 Basic Information
//                     </Typography>
//                     <Grid container spacing={2}>
//                       <Grid item xs={12}>
//                         <Typography variant="subtitle2" color="text.secondary">Package Name</Typography>
//                         <Typography variant="h6" sx={{ 
//                           fontWeight: 700, 
//                           mb: 1,
//                           color: detailsDialog.item.status === 'deleted' ? '#f44336' : '#003047',
//                           textDecoration: detailsDialog.item.status === 'deleted' ? 'line-through' : 'none'
//                         }}>
//                           {detailsDialog.item.packageName}
//                           {detailsDialog.item.status === 'deleted' && (
//                             <Typography component="span" sx={{ ml: 1, color: '#f44336', fontWeight: 'bold', fontSize: '0.8rem' }}>
//                               [DELETED]
//                             </Typography>
//                           )}
//                         </Typography>
//                       </Grid>
                      
//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="text.secondary">Package ID</Typography>
//                         <Typography variant="body1" sx={{ 
//                           fontWeight: 600, 
//                           color: detailsDialog.item.packageId ? (detailsDialog.item.status === 'deleted' ? '#9e9e9e' : '#4caf50') : '#ff9800',
//                           mb: 1
//                         }}>
//                           {detailsDialog.item.packageId || 'Pending Assignment'}
//                         </Typography>
//                         {detailsDialog.item.packageId && (
//                           <Typography variant="caption" sx={{ 
//                             color: detailsDialog.item.status === 'deleted' ? '#9e9e9e' : 'success.main',
//                             fontWeight: 600
//                           }}>
//                             {detailsDialog.item.status === 'deleted' ? '🗑️ Preserved for Audit' : '✅ Permanent ID'}
//                           </Typography>
//                         )}
//                       </Grid>

//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="text.secondary">Package Type</Typography>
//                         <Chip 
//                           label={detailsDialog.item.packageType} 
//                           color="primary" 
//                           variant="outlined"
//                           sx={{ textTransform: 'capitalize', mb: 1 }}
//                         />
//                       </Grid>

//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="text.secondary">Target Audience</Typography>
//                         <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
//                           {detailsDialog.item.targetAudience}
//                         </Typography>
//                       </Grid>

//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="text.secondary">Package Location</Typography>
//                         <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
//                           {detailsDialog.item.packageLocation === 'home_service' ? 'Home Service Only' :
//                            detailsDialog.item.packageLocation === 'salon_only' ? 'Salon Only' :
//                            detailsDialog.item.packageLocation === 'both' ? 'Both Home & Salon' :
//                            detailsDialog.item.packageLocation}
//                         </Typography>
//                       </Grid>

//                       <Grid item xs={12}>
//                         <Typography variant="subtitle2" color="text.secondary">Description</Typography>
//                         <Typography variant="body1" sx={{ 
//                           p: 2, 
//                           bgcolor: '#f5f5f5', 
//                           borderRadius: 1, 
//                           border: '1px solid #e0e0e0',
//                           textDecoration: detailsDialog.item.status === 'deleted' ? 'line-through' : 'none',
//                           color: detailsDialog.item.status === 'deleted' ? '#9e9e9e' : 'text.primary'
//                         }}>
//                           {detailsDialog.item.packageDescription || 'No description provided'}
//                         </Typography>
//                       </Grid>
//                     </Grid>
//                   </Card>
//                 </Grid>

//                 {/* Pricing & Duration Details */}
//                 <Grid item xs={12} md={6}>
//                   <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
//                     <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
//                       💰 Pricing & Duration
//                     </Typography>
//                     <Grid container spacing={2}>
//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="text.secondary">Total Price</Typography>
//                         <Typography variant="h5" sx={{ 
//                           fontWeight: 700, 
//                           color: detailsDialog.item.status === 'deleted' ? '#9e9e9e' : '#4caf50',
//                           textDecoration: detailsDialog.item.status === 'deleted' ? 'line-through' : 'none',
//                           mb: 1
//                         }}>
//                           LKR {detailsDialog.item.totalPrice?.toLocaleString() || '0'}
//                         </Typography>
//                       </Grid>

//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="text.secondary">Total Duration</Typography>
//                         <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#ff9800' }}>
//                           {detailsDialog.item.totalDuration || 0} minutes
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary">
//                           ({Math.floor((detailsDialog.item.totalDuration || 0) / 60)}h {(detailsDialog.item.totalDuration || 0) % 60}m)
//                         </Typography>
//                       </Grid>

//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="text.secondary">Min Lead Time</Typography>
//                         <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
//                           {detailsDialog.item.minLeadTime || 2} hours
//                         </Typography>
//                       </Grid>

//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="text.secondary">Max Advance Booking</Typography>
//                         <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
//                           {detailsDialog.item.maxLeadTime || 30} days
//                         </Typography>
//                       </Grid>

//                       <Grid item xs={12}>
//                         <Typography variant="subtitle2" color="text.secondary">Cancellation Policy</Typography>
//                         <Typography variant="body2" sx={{ 
//                           p: 1.5, 
//                           bgcolor: '#fff3e0', 
//                           borderRadius: 1, 
//                           border: '1px solid #ffcc02'
//                         }}>
//                           {detailsDialog.item.cancellationPolicy || '24 hours notice required'}
//                         </Typography>
//                       </Grid>
//                     </Grid>
//                   </Card>
//                 </Grid>

//                 {/* Service Provider Information */}
//                 <Grid item xs={12} md={6}>
//                   <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
//                     <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
//                       👤 Service Provider Details
//                     </Typography>
//                     <Grid container spacing={2}>
//                       <Grid item xs={12}>
//                         <Typography variant="subtitle2" color="text.secondary">Business Name</Typography>
//                         <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, color: '#8B4B9C' }}>
//                           {detailsDialog.item.serviceProvider?.businessName || 
//                            detailsDialog.item.serviceProvider?.fullName || 'Unknown Provider'}
//                         </Typography>
//                       </Grid>

//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="text.secondary">Provider ID</Typography>
//                         <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
//                           {detailsDialog.item.serviceProviderId || 'Not assigned'}
//                         </Typography>
//                       </Grid>

//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="text.secondary">Contact Email</Typography>
//                         <Typography variant="body2">
//                           {detailsDialog.item.serviceProvider?.emailAddress || 'Not available'}
//                         </Typography>
//                       </Grid>

//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="text.secondary">Phone Number</Typography>
//                         <Typography variant="body2">
//                           {detailsDialog.item.serviceProvider?.mobileNumber || 'Not available'}
//                         </Typography>
//                       </Grid>

//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="text.secondary">Provider Status</Typography>
//                         {detailsDialog.item.serviceProvider?.approvalStatus && (
//                           <Chip 
//                             label={detailsDialog.item.serviceProvider.approvalStatus} 
//                             color={detailsDialog.item.serviceProvider.approvalStatus === 'approved' ? 'success' : 'warning'}
//                             size="small"
//                           />
//                         )}
//                       </Grid>
//                     </Grid>
//                   </Card>
//                 </Grid>

//                 {/* Status & Timeline Information */}
//                 <Grid item xs={12} md={6}>
//                   <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
//                     <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
//                       📅 Status & Timeline
//                     </Typography>
//                     <Grid container spacing={2}>
//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="text.secondary">Current Status</Typography>
//                         <Box sx={{ mb: 1 }}>
//                           {getStatusChip(detailsDialog.item.status)}
//                         </Box>
//                       </Grid>

//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="text.secondary">Availability</Typography>
//                         <Box sx={{ mb: 1 }}>
//                           <Chip 
//                             label={detailsDialog.item.status === 'deleted' ? 'No Longer Available' : 
//                                    (detailsDialog.item.availabilityStatus || 'Available')} 
//                             color={detailsDialog.item.status === 'deleted' ? 'default' : 
//                                    (detailsDialog.item.availabilityStatus === 'Available' ? 'success' : 'warning')} 
//                             size="small"
//                             sx={{
//                               backgroundColor: detailsDialog.item.status === 'deleted' ? '#616161' : undefined,
//                               color: detailsDialog.item.status === 'deleted' ? 'white' : undefined
//                             }}
//                           />
//                         </Box>
//                       </Grid>

//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="text.secondary">First Submitted</Typography>
//                         <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                           {formatDate(detailsDialog.item.firstSubmittedAt || detailsDialog.item.createdAt)}
//                         </Typography>
//                       </Grid>

//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="text.secondary">First Approved</Typography>
//                         <Typography variant="body2" sx={{ 
//                           fontWeight: 500,
//                           color: detailsDialog.item.firstApprovedAt ? '#4caf50' : 'text.secondary'
//                         }}>
//                           {formatDate(detailsDialog.item.firstApprovedAt)}
//                         </Typography>
//                       </Grid>

//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
//                         <Typography variant="body2" sx={{ 
//                           fontWeight: detailsDialog.item.lastUpdatedAt ? 600 : 400,
//                           color: detailsDialog.item.lastUpdatedAt ? '#ff9800' : 'text.secondary'
//                         }}>
//                           {formatDate(detailsDialog.item.lastUpdatedAt)}
//                         </Typography>
//                       </Grid>

//                       {detailsDialog.item.deletedAt && (
//                         <Grid item xs={12} sm={6}>
//                           <Typography variant="subtitle2" color="text.secondary">Deleted Date</Typography>
//                           <Typography variant="body2" sx={{ fontWeight: 600, color: '#f44336' }}>
//                             {formatDate(detailsDialog.item.deletedAt)}
//                           </Typography>
//                         </Grid>
//                       )}
//                     </Grid>
//                   </Card>
//                 </Grid>

//                 {/* Special Offers & Requirements (if available) */}
//                 {(detailsDialog.item.specialOffers?.discountPercentage > 0 || 
//                   detailsDialog.item.requirements?.healthConditions?.length > 0 ||
//                   detailsDialog.item.requirements?.allergies?.length > 0) && (
//                   <Grid item xs={12}>
//                     <Card variant="outlined" sx={{ p: 3 }}>
//                       <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2 }}>
//                         🎯 Special Offers & Requirements
//                       </Typography>
//                       <Grid container spacing={2}>
//                         {detailsDialog.item.specialOffers?.discountPercentage > 0 && (
//                           <Grid item xs={12} sm={6}>
//                             <Typography variant="subtitle2" color="text.secondary">Special Discount</Typography>
//                             <Typography variant="body1" sx={{ fontWeight: 600, color: '#4caf50' }}>
//                               {detailsDialog.item.specialOffers.discountPercentage}% OFF
//                             </Typography>
//                             {detailsDialog.item.specialOffers.description && (
//                               <Typography variant="body2" color="text.secondary">
//                                 {detailsDialog.item.specialOffers.description}
//                               </Typography>
//                             )}
//                             {detailsDialog.item.specialOffers.validUntil && (
//                               <Typography variant="caption" color="warning.main">
//                                 Valid until: {formatDate(detailsDialog.item.specialOffers.validUntil)}
//                               </Typography>
//                             )}
//                           </Grid>
//                         )}

//                         {detailsDialog.item.requirements?.ageRestriction && (
//                           <Grid item xs={12} sm={6}>
//                             <Typography variant="subtitle2" color="text.secondary">Age Restriction</Typography>
//                             <Typography variant="body2">
//                               {detailsDialog.item.requirements.ageRestriction.minAge} - {detailsDialog.item.requirements.ageRestriction.maxAge} years
//                             </Typography>
//                           </Grid>
//                         )}

//                         {detailsDialog.item.requirements?.healthConditions?.length > 0 && (
//                           <Grid item xs={12} sm={6}>
//                             <Typography variant="subtitle2" color="text.secondary">Health Conditions</Typography>
//                             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                               {detailsDialog.item.requirements.healthConditions.map((condition, index) => (
//                                 <Chip key={index} label={condition} size="small" variant="outlined" color="warning" />
//                               ))}
//                             </Box>
//                           </Grid>
//                         )}

//                         {detailsDialog.item.requirements?.allergies?.length > 0 && (
//                           <Grid item xs={12} sm={6}>
//                             <Typography variant="subtitle2" color="text.secondary">Allergies to Consider</Typography>
//                             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
//                               {detailsDialog.item.requirements.allergies.map((allergy, index) => (
//                                 <Chip key={index} label={allergy} size="small" variant="outlined" color="error" />
//                               ))}
//                             </Box>
//                           </Grid>
//                         )}
//                       </Grid>
//                     </Card>
//                   </Grid>
//                 )}

//                 {/* Additional Notes */}
//                 {(detailsDialog.item.customNotes || detailsDialog.item.preparationRequired) && (
//                   <Grid item xs={12}>
//                     <Card variant="outlined" sx={{ p: 3 }}>
//                       <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2 }}>
//                         📝 Additional Information
//                       </Typography>
//                       <Grid container spacing={2}>
//                         {detailsDialog.item.customNotes && (
//                           <Grid item xs={12} md={6}>
//                             <Typography variant="subtitle2" color="text.secondary">Custom Notes</Typography>
//                             <Typography variant="body2" sx={{ 
//                               p: 2, 
//                               bgcolor: '#f5f5f5', 
//                               borderRadius: 1,
//                               border: '1px solid #e0e0e0'
//                             }}>
//                               {detailsDialog.item.customNotes}
//                             </Typography>
//                           </Grid>
//                         )}

//                         {detailsDialog.item.preparationRequired && (
//                           <Grid item xs={12} md={6}>
//                             <Typography variant="subtitle2" color="text.secondary">Preparation Required</Typography>
//                             <Typography variant="body2" sx={{ 
//                               p: 2, 
//                               bgcolor: '#fff3e0', 
//                               borderRadius: 1,
//                               border: '1px solid #ffcc02'
//                             }}>
//                               {detailsDialog.item.preparationRequired}
//                             </Typography>
//                           </Grid>
//                         )}
//                       </Grid>
//                     </Card>
//                   </Grid>
//                 )}

//                 {/* Package History Summary */}
//                 <Grid item xs={12}>
//                   <Card variant="outlined" sx={{ p: 3, bgcolor: '#f8f9fa' }}>
//                     <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2 }}>
//                       📊 Package History Summary
//                     </Typography>
//                     <Grid container spacing={3}>
//                       <Grid item xs={12} sm={3}>
//                         <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
//                           <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196f3', mb: 1 }}>
//                             {detailsDialog.item.version || 1}
//                           </Typography>
//                           <Typography variant="body2" color="text.secondary">Version</Typography>
//                         </Box>
//                       </Grid>
                      
//                       <Grid item xs={12} sm={3}>
//                         <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
//                           <Typography variant="h4" sx={{ 
//                             fontWeight: 700, 
//                             color: detailsDialog.item.firstApprovedAt ? '#4caf50' : '#ff9800',
//                             mb: 1 
//                           }}>
//                             {detailsDialog.item.firstApprovedAt ? '✅' : '⏳'}
//                           </Typography>
//                           <Typography variant="body2" color="text.secondary">
//                             {detailsDialog.item.firstApprovedAt ? 'Approved' : 'Pending'}
//                           </Typography>
//                         </Box>
//                       </Grid>
                      
//                       <Grid item xs={12} sm={3}>
//                         <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
//                           <Typography variant="h4" sx={{ 
//                             fontWeight: 700, 
//                             color: detailsDialog.item.lastUpdatedAt ? '#ff9800' : '#e0e0e0',
//                             mb: 1 
//                           }}>
//                             {detailsDialog.item.lastUpdatedAt ? '📝' : '➖'}
//                           </Typography>
//                           <Typography variant="body2" color="text.secondary">
//                             {detailsDialog.item.lastUpdatedAt ? 'Updated' : 'No Updates'}
//                           </Typography>
//                         </Box>
//                       </Grid>
                      
//                       <Grid item xs={12} sm={3}>
//                         <Box sx={{ textAlign: 'center', p: 2, bgcolor: 'white', borderRadius: 2 }}>
//                           <Typography variant="h4" sx={{ 
//                             fontWeight: 700, 
//                             color: detailsDialog.item.status === 'deleted' ? '#f44336' : '#4caf50',
//                             mb: 1 
//                           }}>
//                             {detailsDialog.item.status === 'deleted' ? '🗑️' : '💼'}
//                           </Typography>
//                           <Typography variant="body2" color="text.secondary">
//                             {detailsDialog.item.status === 'deleted' ? 'Deleted' : 'Active'}
//                           </Typography>
//                         </Box>
//                       </Grid>
//                     </Grid>
//                   </Card>
//                 </Grid>
//               </Grid>
//             )}
//           </DialogContent>
//           <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5' }}>
//             {/* Action buttons for pending providers */}
//             {detailsDialog.item?.approvalStatus === 'pending' && detailsDialog.type === 'provider' && (
//               <>
//                 <Button 
//                   onClick={() => handleProviderAction(detailsDialog.item._id, 'reject')}
//                   variant="contained"
//                   color="error"
//                   startIcon={<RejectIcon />}
//                   disabled={loading}
//                   sx={{ mr: 1 }}
//                 >
//                   Reject Registration
//                 </Button>
//                 <Button 
//                   onClick={() => handleProviderAction(detailsDialog.item._id, 'approve')}
//                   variant="contained"
//                   color="success"
//                   startIcon={<ApproveIcon />}
//                   disabled={loading}
//                   sx={{ mr: 1 }}
//                 >
//                   Approve Registration
//                 </Button>
//               </>
//             )}
            
//             {/* Action buttons for pending services/packages */}
//             {detailsDialog.item?.status === 'pending_approval' && detailsDialog.type !== 'provider' && (
//               <>
//                 <Button 
//                   onClick={() => handleApproval(detailsDialog.item._id, detailsDialog.type, 'reject')}
//                   variant="contained"
//                   color="error"
//                   startIcon={<RejectIcon />}
//                   disabled={loading}
//                   sx={{ mr: 1 }}
//                 >
//                   Reject
//                 </Button>
//                 <Button 
//                   onClick={() => handleApproval(detailsDialog.item._id, detailsDialog.type, 'approve')}
//                   variant="contained"
//                   color="success"
//                   startIcon={<ApproveIcon />}
//                   disabled={loading}
//                   sx={{ mr: 1 }}
//                 >
//                   Approve
//                 </Button>
//               </>
//             )}
            
//             <Button 
//               onClick={() => setDetailsDialog({ open: false, item: null, type: '' })}
//               variant="contained"
//               sx={{ bgcolor: '#003047', '&:hover': { bgcolor: '#003047' } }}
//             >
//               Close
//             </Button>
//           </DialogActions>
//         </Dialog>
//       </Container>
//       <Footer />
//     </Box>
//   );
// };

// export default ServiceManagementAdmin;

// admin/Admin.ServiceManagement.js - COMPLETELY FIXED VERSION WITH PROPER STATE MANAGEMENT

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
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
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Business as BusinessIcon,
  CheckCircle as ApprovedIcon,
  Pending as PendingIcon,
  Cancel as RejectedIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
  Store as StoreIcon,
  Category as ServiceIcon,
  Inventory as PackageIcon,
  Block as BlockIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/footer';
import AdminSidebar from '../../components/AdminSidebar';
import api from '../../services/auth';
import { approveServiceProvider } from '../../services/auth';
import { rejectServiceProvider } from '../../services/notification';
import { styled } from '@mui/material/styles';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
  overflowX: 'auto',
  overflowY: 'hidden',
  border: '1px solid rgba(7, 91, 94, 0.1)'
}));

const HeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: '#003047',
  color: theme.palette.common.white,
  fontWeight: 700,
  fontSize: '0.95rem',
  padding: theme.spacing(2),
  borderBottom: 'none'
}));

const StyledTableRow = styled(TableRow)(({ theme, status }) => {
  let backgroundColor;
  switch (status) {
    case 'approved':
      backgroundColor = 'rgba(76, 175, 80, 0.05)';
      break;
    case 'pending_approval':
    case 'pending':
      backgroundColor = 'rgba(255, 193, 7, 0.05)';
      break;
    case 'rejected':
      backgroundColor = 'rgba(244, 67, 54, 0.05)';
      break;
    default:
      backgroundColor = 'rgba(255, 193, 7, 0.05)';
  }
  
  return {
    backgroundColor,
    '&:hover': {
      backgroundColor: status === 'approved' 
        ? 'rgba(76, 175, 80, 0.15)' 
        : status === 'rejected' 
        ? 'rgba(244, 67, 54, 0.15)'
        : 'rgba(255, 193, 7, 0.15)',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.2s ease-in-out'
    }
  };
});

const ServiceManagementAdmin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState({ open: false, item: null, type: '' });
  const [processingItems, setProcessingItems] = useState(new Set());
  const [finalizedItems, setFinalizedItems] = useState(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching admin data...');
      
      const [providersRes, listRes, packagesRes] = await Promise.all([
        api.get('/auth/service-providers'),
        api.get('/services/admin/all'),
        api.get('/packages/admin/history')
      ]);

      console.log('Providers response:', providersRes.data);
      console.log('Services list response:', listRes.data);

      if (providersRes.data.success) {
        setServiceProviders(providersRes.data.providers || providersRes.data.data || []);
      }
      
      if (listRes.data.success) {
         // Normalize rejected services
         const rawServices = listRes.data.services || [];
         const normalized = rawServices.map(s => ({
           ...s,
           status: s.rejectedAt ? 'rejected' : s.status,
           availabilityStatus: s.rejectedAt ? 'Unavailable' : s.availabilityStatus,
           serviceId: s.serviceId || s._id?.slice(-8) || 'Pending Assignment'
         }));
         setServices(normalized);
         console.log(`Total services loaded: ${normalized.length}`);
      }
      
      if (packagesRes.data.success) {
        setPackages(packagesRes.data.packages || packagesRes.data.data || []);
      }
    } catch (error) {
      setError('Failed to fetch data');
      console.error('Fetch data error:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  // CRITICAL FIX: Enhanced approval handler with immediate UI updates
  const handleApproval = async (id, type, action) => {
    if (processingItems.has(id)) {
      console.log(`Already processing ${action} for ${type} ${id}`);
      return;
    }

    try {
      setProcessingItems(prev => new Set([...prev, id]));
      
      console.log(`🔍 Starting ${action} process for ${type} ${id}`);
      
      let endpoint = '';
      let requestBody = {};

      if (type === 'provider') {
        endpoint = `/auth/approve-provider/${id}`;
        requestBody = { reason: action === 'reject' ? 'Provider rejected by admin' : 'Provider approved by admin' };
      } else if (type === 'service') {
        endpoint = `/services/admin/${id}/${action}`;
        if (action === 'reject') {
          requestBody = { reason: 'Service does not meet our quality standards' };
        } else {
          requestBody = { reason: 'Service approved by admin' };
        }
      } else if (type === 'package') {
        endpoint = `/packages/admin/${id}/${action}`;
        if (action === 'reject') {
          requestBody = { reason: 'Package does not meet our standards' };
        } else {
          requestBody = { reason: 'Package approved by admin' };
        }
      }

      console.log(`🔍 Making ${action} request to:`, endpoint);

      const response = await api.post(endpoint, requestBody);
      
      console.log(`🔍 ${action} response:`, response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || `Failed to ${action} ${type}`);
      }

      // CRITICAL FIX: Immediate state updates with proper rejection handling
  if (type === 'service' && response.data.service) {
        const updatedService = response.data.service;
        console.log(`✅ Updating service ${id} in local state:`, updatedService);
        
        // Ensure proper status and availability for rejected services
        const enhancedService = {
          ...updatedService,
          // Override status for reject/approve
          status: action === 'reject' ? 'rejected' : updatedService.status,
          // Force availability for rejected services
          availabilityStatus: action === 'reject' ? 'Unavailable' : updatedService.availabilityStatus || 'Available',
          // Ensure service ID is assigned
          serviceId: updatedService.serviceId || 'Pending Assignment',
          // Ensure proper timestamps
          rejectedAt: action === 'reject' ? (updatedService.rejectedAt || new Date()) : updatedService.rejectedAt,
          firstApprovedAt: action === 'approve' ? (updatedService.firstApprovedAt || new Date()) : updatedService.firstApprovedAt,
          // Preserve rejection reason
          rejectionReason: updatedService.rejectionReason
        };
        
        setServices(prevServices => 
          prevServices.map(service => 
            service._id === id ? enhancedService : service
          )
        );
        
        // Mark as finalized to hide action buttons permanently
        setFinalizedItems(prev => new Set(prev).add(id));
        
      } else if (type === 'package' && response.data.package) {
        const updatedPackage = response.data.package;
        console.log(`✅ Updating package ${id} in local state:`, updatedPackage);
        
        const enhancedPackage = {
          ...updatedPackage,
          availabilityStatus: updatedPackage.status === 'rejected' ? 'Unavailable' : 
                             updatedPackage.status === 'deleted' ? 'No Longer Available' :
                             updatedPackage.availabilityStatus || 'Available',
          packageId: updatedPackage.packageId || 'Pending Assignment'
        };
        
        setPackages(prevPackages => 
          prevPackages.map(pkg => 
            pkg._id === id ? enhancedPackage : pkg
          )
        );
        
        setFinalizedItems(prev => new Set(prev).add(id));
        
      } else if (type === 'provider' && response.data.provider) {
        const updatedProvider = response.data.provider;
        console.log(`✅ Updating provider ${id} in local state:`, updatedProvider);
        
        setServiceProviders(prevProviders => 
          prevProviders.map(provider => 
            provider._id === id ? updatedProvider : provider
          )
        );
      }

  // Refresh full list to sync UI state
  await fetchData();
  // Close dialogs and clear selections
  setDetailsDialog({ open: false, item: null, type: '' });
  setSelectedItemId(null);
  setError('');

      console.log(`✅ ${type} ${action}ed successfully - UI updated immediately`);

    } catch (error) {
      console.error(`❌ Error ${action}ing ${type}:`, error);
      setError(`Failed to ${action} ${type}: ${error.response?.data?.message || error.message}`);
    } finally {
      setProcessingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleProviderAction = async (id, action) => {
    if (processingItems.has(id)) {
      return;
    }

    try {
      setProcessingItems(prev => new Set([...prev, id]));
      
      if (action === 'approve') {
        await approveServiceProvider(id);
      } else {
        await rejectServiceProvider(id, 'Your registration was declined');
      }
      
      setServiceProviders(prevProviders => 
        prevProviders.map(provider => 
          provider._id === id 
            ? { ...provider, approvalStatus: action === 'approve' ? 'approved' : 'rejected' }
            : provider
        )
      );
      
      setSelectedItemId(null);
      setError('');
      
    } catch (err) {
      setError(`Failed to ${action} provider`);
    } finally {
      setProcessingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // FIXED: Status chip with correct "Not Approved" label
  const getStatusChip = (status) => {
    const statusConfig = {
      approved: { label: 'Approved', color: 'success', icon: <ApprovedIcon /> },
      pending_approval: { label: 'Pending', color: 'warning', icon: <PendingIcon /> },
      pending: { label: 'Pending', color: 'warning', icon: <PendingIcon /> },
      rejected: { label: 'Not Approved', color: 'error', icon: <RejectedIcon /> }, // FIXED: Correct label
      deleted: { label: 'Deleted', color: 'default', icon: <BlockIcon /> }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Chip
        icon={config.icon}
        label={config.label}
        color={config.color}
        size="small"
        sx={{ 
          fontWeight: 600,
          ...(status === 'deleted' && {
            backgroundColor: '#616161',
            color: 'white',
            '& .MuiChip-icon': {
              color: 'white'
            }
          })
        }}
      />
    );
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

  const filterItems = (items, searchField) => {
    if (!items || !Array.isArray(items)) return [];
    
    return items.filter(item => {
      if (!item) return false;
      
      const fieldValue = item[searchField];
      const providerName = item.serviceProvider?.businessName;
      
      return (
        (fieldValue && fieldValue.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (providerName && providerName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    });
  };

  const handleViewDetails = (item, type) => {
    setDetailsDialog({ open: true, item, type });
  };

  // FIXED: Services table with proper rejection columns and state management
  const renderServicesTable = () => {
    const filteredServices = services ? filterItems(services.filter(service => service != null), 'name') : [];
    
    return (
      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <HeaderCell>Service Details</HeaderCell>
              <HeaderCell>Service ID</HeaderCell>
              <HeaderCell>Provider ID</HeaderCell>
              <HeaderCell>Type & Category</HeaderCell>
              <HeaderCell>Pricing</HeaderCell>
              <HeaderCell>First Approved</HeaderCell>
              <HeaderCell>Rejected At</HeaderCell> {/* FIXED: Added rejection date column */}
              <HeaderCell>Last Updated</HeaderCell>
              <HeaderCell>Deleted Date</HeaderCell>
              <HeaderCell>Availability</HeaderCell>
              <HeaderCell>Status</HeaderCell>
              <HeaderCell align="center">Actions</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServices.length > 0 ? (
              filteredServices.map(service => {
                if (!service || !service._id) {
                  return null;
                }
                
                const isProcessing = processingItems.has(service._id);
                // FIXED: Only show actions for truly pending items, hide after finalization
                const canTakeAction = (service.status === 'pending_approval' || service.pendingChanges) 
                  && service.status !== 'rejected' 
                  && service.status !== 'deleted'
                  && service.status !== 'approved'  // FIXED: Hide actions for approved services
                  && !isProcessing 
                  && !finalizedItems.has(service._id);
                
                return (
                  <StyledTableRow 
                    key={service._id}
                    status={service.status}
                    selected={selectedItemId === service._id}
                    onClick={() => setSelectedItemId(service._id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#8B4B9C' }}>
                        {service.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {service.description?.substring(0, 50)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {/* FIXED: Service ID assigned after admin action */}
                      <Typography variant="body2" sx={{ 
                        fontWeight: 500, 
                        color: service?.serviceId && service.serviceId !== 'Pending' ? '#003047' : '#ff9800' 
                      }}>
                        {service?.serviceId || 'Pending Assignment'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {service?.serviceProviderId || service?.serviceProvider?._id?.slice(-6) || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={service.type} variant="outlined" size="small" sx={{ mb: 0.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        {service.category}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        LKR {service.pricing?.basePrice || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {service?.firstApprovedAt ? formatDate(service.firstApprovedAt) : 'Not approved'}
                      </Typography>
                    </TableCell>
                    {/* FIXED: Added rejection date column */}
                    <TableCell>
                      <Typography variant="body2" color={service?.rejectedAt ? 'error' : 'text.secondary'}>
                        {service?.rejectedAt ? formatDate(service.rejectedAt) : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {service?.lastUpdatedAt ? formatDate(service.lastUpdatedAt) : 'Never'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color={service?.deletedAt ? 'error' : 'text.secondary'}>
                        {service?.deletedAt ? formatDate(service.deletedAt) : 'N/A'}
                      </Typography>
                    </TableCell>
                    {/* FIXED: Proper availability status */}
                    <TableCell>
                      <Chip
                        label={
                          service.status === 'rejected' ? 'Unavailable' :
                          service.status === 'deleted' ? 'No Longer Available' :
                          service.availabilityStatus || 'Available'
                        }
                        color={
                          service.status === 'rejected' ? 'error' : 
                          service.status === 'deleted' ? 'default' :
                          (service.availabilityStatus === 'Available' ? 'success' : 'warning')
                        }
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    {/* FIXED: Proper status display */}
                    <TableCell>{getStatusChip(service.status)}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={e => { e.stopPropagation(); handleViewDetails(service, 'service'); }}
                        sx={{ color: '#003047' }}
                      >
                        <ViewIcon />
                      </IconButton>
                      {/* FIXED: Hide action buttons permanently after admin decision */}
                      {canTakeAction ? (
                        <>
                          <IconButton 
                            onClick={e => { 
                              e.stopPropagation(); 
                              handleApproval(service._id, 'service', 'approve'); 
                            }}
                            sx={{ color: '#4CAF50' }} 
                            disabled={isProcessing}
                          >
                            {isProcessing ? <CircularProgress size={20} /> : <ApproveIcon />}
                          </IconButton>
                          <IconButton 
                            onClick={e => { 
                              e.stopPropagation(); 
                              handleApproval(service._id, 'service', 'reject'); 
                            }}
                            sx={{ color: '#f44336' }} 
                            disabled={isProcessing}
                          >
                            {isProcessing ? <CircularProgress size={20} /> : <RejectIcon />}
                          </IconButton>
                        </>
                      ) : (
                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          {service.status === 'rejected' ? 'Not Approved' : 
                           service.status === 'approved' ? 'Already Approved' : 
                           service.status === 'deleted' ? 'Deleted' :
                           'No Actions Available'}
                        </Typography>
                      )}
                    </TableCell>
                  </StyledTableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No services found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
    );
  };

  const renderServiceProvidersTable = () => {
    const filteredProviders = filterItems(serviceProviders, 'businessName');
    
    return (
      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <HeaderCell>Business Details</HeaderCell>
              <HeaderCell>Contact Information</HeaderCell>
              <HeaderCell>Business Type & Experience</HeaderCell>
              <HeaderCell>Location</HeaderCell>
              <HeaderCell>Registration Date</HeaderCell>
              <HeaderCell>Status</HeaderCell>
              <HeaderCell align="center">Actions</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProviders.map(provider => (
              <StyledTableRow key={provider._id} status={provider.approvalStatus}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: provider.approvalStatus === 'approved' ? '#4CAF50' : '#FF9800',
                        mr: 2,
                        width: 48,
                        height: 48
                      }}
                    >
                      <BusinessIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#8B4B9C' }}>
                        {provider.businessName || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Owner: {provider.fullName || 'N/A'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        NIC: {provider.nicNumber || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>{provider.emailAddress}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {provider.mobileNumber || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    <Chip 
                      label={provider.businessType || 'N/A'} 
                      variant="outlined" 
                      size="small" 
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Experience: {provider.experienceYears || 0} years
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>{provider.city || 'N/A'}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    Business: {provider.currentAddress?.substring(0, 25)}{provider.currentAddress?.length > 25 ? '...' : ''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                    Home: {provider.homeAddress?.substring(0, 25)}{provider.homeAddress?.length > 25 ? '...' : ''}
                  </Typography>
                </TableCell>
                <TableCell>{formatDate(provider.createdAt)}</TableCell>
                <TableCell>{getStatusChip(provider.approvalStatus)}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={(e) => { e.stopPropagation(); handleViewDetails(provider, 'provider'); }}
                    sx={{ color: '#003047' }}
                  >
                    <ViewIcon />
                  </IconButton>
                  {provider.approvalStatus === 'pending' && (
                    <>
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); handleProviderAction(provider._id, 'approve'); }}
                        sx={{ color: '#4CAF50' }}
                        disabled={processingItems.has(provider._id)}
                      >
                        {processingItems.has(provider._id) ? <CircularProgress size={20} /> : <ApproveIcon />}
                      </IconButton>
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); handleProviderAction(provider._id, 'reject'); }}
                        sx={{ color: '#f44336' }}
                        disabled={processingItems.has(provider._id)}
                      >
                        {processingItems.has(provider._id) ? <CircularProgress size={20} /> : <RejectIcon />}
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    );
  };

  const renderPackagesTable = () => {
    const filteredPackages = filterItems(packages, 'packageName');
    
    return (
      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <HeaderCell>Package Details</HeaderCell>
              <HeaderCell>Package ID</HeaderCell>
              <HeaderCell>Provider ID</HeaderCell>
              <HeaderCell>Type & Audience</HeaderCell>
              <HeaderCell>Pricing</HeaderCell>
              <HeaderCell>First Approved</HeaderCell>
              <HeaderCell>Last Updated</HeaderCell>
              <HeaderCell>Deleted Date</HeaderCell>
              <HeaderCell>Availability</HeaderCell>
              <HeaderCell>Status</HeaderCell>
              <HeaderCell align="center">Actions</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPackages.map(pkg => {
              const isProcessing = processingItems.has(pkg._id);
              const canTakeAction = (pkg.status === 'pending_approval' || pkg.pendingChanges) && 
                                   pkg.status !== 'deleted' && 
                                   pkg.status !== 'approved' &&
                                   pkg.status !== 'rejected' &&
                                   !isProcessing &&
                                   !finalizedItems.has(pkg._id);
              
              return (
                <StyledTableRow 
                  key={pkg._id}
                  status={pkg.status}
                  selected={selectedItemId === pkg._id}
                  onClick={() => setSelectedItemId(pkg._id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 600, 
                      color: pkg.status === 'deleted' ? '#9e9e9e' : '#8B4B9C',
                      textDecoration: pkg.status === 'deleted' ? 'line-through' : 'none'
                    }}>
                      {pkg.packageName}
                      {pkg.status === 'deleted' && (
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
                    <Typography variant="body2" color="text.secondary">
                      {pkg.packageDescription?.substring(0, 50)}...
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 500, 
                      color: pkg.packageId ? (pkg.status === 'deleted' ? '#9e9e9e' : '#003047') : '#ff9800'
                    }}>
                      {pkg?.packageId || 'Pending Assignment'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {pkg?.serviceProviderId || pkg?.serviceProvider?._id?.slice(-6) || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={pkg.packageType} 
                      variant="outlined" 
                      size="small" 
                      sx={{ 
                        mb: 0.5,
                        opacity: pkg.status === 'deleted' ? 0.6 : 1
                      }} 
                    />
                    <Typography variant="body2" color="text.secondary">
                      {pkg.targetAudience}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ 
                      fontWeight: 600,
                      color: pkg.status === 'deleted' ? '#9e9e9e' : 'text.primary',
                      textDecoration: pkg.status === 'deleted' ? 'line-through' : 'none'
                    }}>
                      LKR {pkg.totalPrice || 0}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ 
                      color: pkg?.firstApprovedAt ? '#4caf50' : 'text.secondary',
                      fontWeight: pkg?.firstApprovedAt ? 600 : 400
                    }}>
                      {pkg?.firstApprovedAt ? formatDate(pkg.firstApprovedAt) : 'Not approved'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ 
                      fontWeight: pkg?.lastUpdatedAt ? 700 : 400,
                      color: pkg?.lastUpdatedAt ? '#ff9800' : 'text.secondary'
                    }}>
                      {pkg?.lastUpdatedAt ? formatDate(pkg.lastUpdatedAt) : 'Never'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color={pkg?.deletedAt ? 'error' : 'text.secondary'}>
                      {pkg?.deletedAt ? formatDate(pkg.deletedAt) : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={pkg.status === 'deleted' ? 'No Longer Available' : 
                             pkg.status === 'rejected' ? 'Unavailable' :
                             (pkg?.availabilityStatus || 'Available')} 
                      color={pkg.status === 'deleted' ? 'default' : 
                             pkg.status === 'rejected' ? 'error' :
                             ((pkg?.availabilityStatus || 'Available') === 'Available' ? 'success' : 'error')} 
                      size="small"
                      sx={{
                        ...(pkg.status === 'deleted' && {
                          backgroundColor: '#616161',
                          color: 'white'
                        })
                      }}
                    />
                  </TableCell>
                  <TableCell>{getStatusChip(pkg.status)}</TableCell>
                  <TableCell align="center">
                    <IconButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(pkg, 'package');
                      }}
                      sx={{ color: '#003047' }}
                    >
                      <ViewIcon />
                    </IconButton>
                    {canTakeAction ? (
                      <>
                        <IconButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApproval(pkg._id, 'package', 'approve');
                          }}
                          sx={{ color: '#4CAF50' }}
                          disabled={isProcessing}
                        >
                          {isProcessing ? <CircularProgress size={20} /> : <ApproveIcon />}
                        </IconButton>
                        <IconButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApproval(pkg._id, 'package', 'reject');
                          }}
                          sx={{ color: '#f44336' }}
                          disabled={isProcessing}
                        >
                          {isProcessing ? <CircularProgress size={20} /> : <RejectIcon />}
                        </IconButton>
                      </>
                    ) : (
                      <Typography variant="caption" sx={{ 
                        color: pkg.status === 'deleted' ? '#9e9e9e' : 'text.secondary', 
                        fontStyle: 'italic',
                        fontSize: '0.7rem',
                        textAlign: 'center'
                      }}>
                        {pkg.status === 'deleted' ? 'No actions available' : 
                         pkg.status === 'rejected' ? 'Not Approved' :
                         pkg.status === 'approved' ? 'Already Approved' :
                         'No actions available'}
                      </Typography>
                    )}
                  </TableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </StyledTableContainer>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fafafa' }}>
      <AppBar position="static" sx={{ bgcolor: '#003047', boxShadow: '0 4px 12px rgba(7,91,94,0.3)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: '#fafafa' }}>
             BeautiQ Admin - Fixed Rejection System
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

      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#003047', fontWeight: 800, mb: 1 }}>
            Service Provider Management
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#666', mb: 3 }}>
            Manage service providers, services, and packages - Fixed Rejection System
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
              placeholder="Search by name or business..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#8B4B9C' }} />
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
              onClick={fetchData}
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

        {/* Tabs */}
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
          <Tabs 
            value={currentTab} 
            onChange={(e, newValue) => setCurrentTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              icon={<StoreIcon />} 
              label={`Service Providers (${serviceProviders.length})`} 
              iconPosition="start"
            />
            <Tab 
              icon={<ServiceIcon />} 
              label={`Services (${services.length})`} 
              iconPosition="start"
            />
            <Tab 
              icon={<PackageIcon />} 
              label={`Packages (${packages.length})`} 
              iconPosition="start"
            />
          </Tabs>
          
          <CardContent sx={{ p: 0 }}>
            {currentTab === 0 && renderServiceProvidersTable()}
            {currentTab === 1 && renderServicesTable()}
            {currentTab === 2 && renderPackagesTable()}
          </CardContent>
        </Card>

        {/* FIXED: Details Dialog - Hide action buttons after admin decision */}
        <Dialog 
          open={detailsDialog.open} 
          onClose={() => setDetailsDialog({ open: false, item: null, type: '' })}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle sx={{ 
            bgcolor: detailsDialog.item?.status === 'deleted' ? '#f44336' : 
                     detailsDialog.item?.status === 'rejected' ? '#f44336' :
                     '#003047', 
            color: 'white', 
            fontWeight: 700 
          }}>
            {detailsDialog.type === 'provider' ? '👤 Service Provider Details' :
             detailsDialog.type === 'service' ? '🔧 Service Details' : 
             '📦 Package Details'}
            {detailsDialog.item?.status === 'deleted' && ' - DELETED'}
            {detailsDialog.item?.status === 'rejected' && ' - NOT APPROVED'}
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {/* Basic details display for all types */}
            {detailsDialog.item && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2 }}>
                    {detailsDialog.item.name || detailsDialog.item.businessName || detailsDialog.item.packageName}
                  </Typography>
                  {getStatusChip(detailsDialog.item.status || detailsDialog.item.approvalStatus)}
                </Grid>
                
                {detailsDialog.type === 'service' && (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Service ID</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#003047' }}>
                        {detailsDialog.item.serviceId || 'Pending Assignment'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Service Type</Typography>
                      <Typography variant="body1">{detailsDialog.item.type}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                      <Typography variant="body1">{detailsDialog.item.category}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Base Price</Typography>
                      <Typography variant="body1">LKR {detailsDialog.item.pricing?.basePrice || 0}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Duration</Typography>
                      <Typography variant="body1">{detailsDialog.item.duration} minutes</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="text.secondary">Availability Status</Typography>
                      <Typography variant="body1" sx={{ 
                        color: detailsDialog.item.status === 'rejected' ? 'error.main' : 'text.primary',
                        fontWeight: 600
                      }}>
                        {detailsDialog.item.status === 'rejected' ? 'Unavailable' : 
                         detailsDialog.item.availabilityStatus || 'Available'}
                      </Typography>
                    </Grid>
                    {detailsDialog.item.rejectedAt && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Rejected At</Typography>
                        <Typography variant="body1" sx={{ color: 'error.main', fontWeight: 600 }}>
                          {formatDate(detailsDialog.item.rejectedAt)}
                        </Typography>
                      </Grid>
                    )}
                    {detailsDialog.item.rejectionReason && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Rejection Reason</Typography>
                        <Typography variant="body1" sx={{ 
                          p: 2, 
                          bgcolor: '#ffebee', 
                          borderRadius: 1,
                          border: '1px solid #f44336',
                          color: 'error.main'
                        }}>
                          {detailsDialog.item.rejectionReason}
                        </Typography>
                      </Grid>
                    )}
                  </>
                )}
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                  <Typography variant="body1">
                    {detailsDialog.item.description || 
                     detailsDialog.item.packageDescription || 
                     'No description available'}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5' }}>
            {/* FIXED: Only show action buttons for truly pending items */}
            {detailsDialog.item?.approvalStatus === 'pending' && detailsDialog.type === 'provider' && (
              <>
                <Button 
                  onClick={() => handleProviderAction(detailsDialog.item._id, 'reject')}
                  variant="contained"
                  color="error"
                  startIcon={<RejectIcon />}
                  disabled={processingItems.has(detailsDialog.item._id)}
                  sx={{ mr: 1 }}
                >
                  {processingItems.has(detailsDialog.item._id) ? <CircularProgress size={20} /> : 'Reject Registration'}
                </Button>
                <Button 
                  onClick={() => handleProviderAction(detailsDialog.item._id, 'approve')}
                  variant="contained"
                  color="success"
                  startIcon={<ApproveIcon />}
                  disabled={processingItems.has(detailsDialog.item._id)}
                  sx={{ mr: 1 }}
                >
                  {processingItems.has(detailsDialog.item._id) ? <CircularProgress size={20} /> : 'Approve Registration'}
                </Button>
              </>
            )}
            
            {/* FIXED: Only show action buttons for pending services/packages that haven't been finalized */}
            {((['pending_approval','pending'].includes(detailsDialog.item?.status) || detailsDialog.item?.pendingChanges) && 
              detailsDialog.type !== 'provider' && 
              !['deleted','rejected','approved'].includes(detailsDialog.item?.status) &&
              !finalizedItems.has(detailsDialog.item?._id)) && (
              <>
                <Button 
                  onClick={() => handleApproval(detailsDialog.item._id, detailsDialog.type, 'reject')}
                  variant="contained"
                  color="error"
                  startIcon={<RejectIcon />}
                  disabled={processingItems.has(detailsDialog.item._id)}
                  sx={{ mr: 1 }}
                >
                  {processingItems.has(detailsDialog.item._id) ? <CircularProgress size={20} /> : 'Reject'}
                </Button>
                <Button 
                  onClick={() => handleApproval(detailsDialog.item._id, detailsDialog.type, 'approve')}
                  variant="contained"
                  color="success"
                  startIcon={<ApproveIcon />}
                  disabled={processingItems.has(detailsDialog.item._id)}
                  sx={{ mr: 1 }}
                >
                  {processingItems.has(detailsDialog.item._id) ? <CircularProgress size={20} /> : 'Approve'}
                </Button>
              </>
            )}
            
            <Button 
              onClick={() => setDetailsDialog({ open: false, item: null, type: '' })}
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

export default ServiceManagementAdmin;