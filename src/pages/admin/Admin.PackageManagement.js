// // admin/Admin.PackageManagement.js - COMPLETE ENHANCED VERSION WITH CLEAR REQUEST TYPE INDICATORS
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Container,
//   Typography,
//   Paper,
//   Alert,
//   AlertTitle,
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
//   Collapse,
//   Badge,
//   Tooltip
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
//   Inventory as PackageIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   ExpandMore as ExpandMoreIcon,
//   ExpandLess as ExpandLessIcon,
//   AttachMoney as PriceIcon,
//   Schedule as TimeIcon,
//   LocationOn as LocationIcon,
//   Group as AudienceIcon,
//   Update as UpdateIcon,
//   NewReleases as NewIcon,
//   Warning as WarningIcon,
//   History as HistoryIcon,
//   CompareArrows as CompareIcon,
//   Info as InfoIcon,
//   Assignment as RequestIcon,
//   Psychology as AnalyzeIcon,
//   Priority as PriorityIcon
// } from '@mui/icons-material';
// import { useAuth } from '../../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import Footer from '../../components/footer';
// import AdminSidebar from '../../components/AdminSidebar';
// import api from '../../services/auth';
// import { styled, keyframes } from '@mui/material/styles';

// // Enhanced Animations
// const pulseAnimation = keyframes`
//   0% {
//     box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.7);
//   }
//   70% {
//     box-shadow: 0 0 0 10px rgba(255, 152, 0, 0);
//   }
//   100% {
//     box-shadow: 0 0 0 0 rgba(255, 152, 0, 0);
//   }
// `;

// const slideInAnimation = keyframes`
//   from {
//     opacity: 0;
//     transform: translateY(-10px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// `;

// // Enhanced Styled Components
// const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
//   borderRadius: theme.shape.borderRadius * 2,
//   boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
//   overflow: 'hidden',
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

// const StyledTableRow = styled(TableRow)(({ theme, status, hasUpdates, isDeleted, updateType }) => {
//   let backgroundColor;
//   let borderColor;
//   let animation;
  
//   if (isDeleted || status === 'deleted') {
//     backgroundColor = 'rgba(128, 128, 128, 0.08)';
//     borderColor = '#9e9e9e';
//   } else if (hasUpdates) {
//     if (updateType === 'update') {
//       backgroundColor = 'rgba(255, 152, 0, 0.15)';
//       borderColor = '#ff9800';
//       animation = `${pulseAnimation} 2s infinite`;
//     } else if (updateType === 'delete') {
//       backgroundColor = 'rgba(244, 67, 54, 0.12)';
//       borderColor = '#f44336';
//       animation = `${pulseAnimation} 2s infinite`;
//     } else if (updateType === 'create') {
//       backgroundColor = 'rgba(33, 150, 243, 0.12)';
//       borderColor = '#2196f3';
//       animation = `${slideInAnimation} 0.5s ease-out`;
//     }
//   } else {
//     switch (status) {
//       case 'approved':
//         backgroundColor = 'rgba(76, 175, 80, 0.05)';
//         borderColor = '#4caf50';
//         break;
//       case 'pending_approval':
//       case 'pending':
//         backgroundColor = 'rgba(255, 193, 7, 0.05)';
//         borderColor = '#ffc107';
//         break;
//       case 'rejected':
//         backgroundColor = 'rgba(244, 67, 54, 0.05)';
//         borderColor = '#f44336';
//         break;
//       default:
//         backgroundColor = 'rgba(255, 193, 7, 0.05)';
//         borderColor = '#ffc107';
//     }
//   }
  
//   return {
//     backgroundColor,
//     borderLeft: hasUpdates ? `4px solid ${borderColor}` : `2px solid transparent`,
//     animation: hasUpdates ? animation : 'none',
//     position: 'relative',
//     '&::before': hasUpdates ? {
//       content: '""',
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       height: '2px',
//       backgroundColor: borderColor,
//       animation: `${pulseAnimation} 2s infinite`
//     } : {},
//     '&:hover': {
//       backgroundColor: isDeleted 
//         ? 'rgba(128, 128, 128, 0.15)'
//         : hasUpdates 
//         ? (updateType === 'update' ? 'rgba(255, 152, 0, 0.25)' : 
//            updateType === 'delete' ? 'rgba(244, 67, 54, 0.20)' : 
//            updateType === 'create' ? 'rgba(33, 150, 243, 0.20)' : 'rgba(255, 193, 7, 0.15)')
//         : status === 'approved' 
//         ? 'rgba(76, 175, 80, 0.15)' 
//         : status === 'rejected' 
//         ? 'rgba(244, 67, 54, 0.15)'
//         : 'rgba(255, 193, 7, 0.15)',
//       transform: 'translateY(-1px)',
//       boxShadow: hasUpdates 
//         ? `0 8px 24px rgba(255, 152, 0, 0.3)`
//         : '0 4px 8px rgba(0,0,0,0.1)',
//       transition: 'all 0.2s ease-in-out'
//     }
//   };
// });

// const UpdateBadge = styled(Badge)(({ theme, updatetype }) => ({
//   '& .MuiBadge-badge': {
//     backgroundColor: updatetype === 'update' ? '#ff9800' : 
//                      updatetype === 'delete' ? '#f44336' : 
//                      updatetype === 'create' ? '#2196f3' : '#9c27b0',
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: '0.7rem',
//     animation: updatetype !== 'create' ? `${pulseAnimation} 2s infinite` : 'none',
//     minWidth: '28px',
//     height: '20px',
//     padding: '0 6px'
//   }
// }));

// const RequestTypeCard = styled(Card)(({ theme, requesttype }) => {
//   const colors = {
//     create: { bg: '#e3f2fd', border: '#2196f3', hover: '#bbdefb' },
//     update: { bg: '#fff3e0', border: '#ff9800', hover: '#ffcc02' },
//     delete: { bg: '#ffebee', border: '#f44336', hover: '#ffcdd2' },
//     regular: { bg: '#f3e5f5', border: '#9c27b0', hover: '#e1bee7' }
//   };
  
//   const color = colors[requesttype] || colors.regular;
  
//   return {
//     backgroundColor: color.bg,
//     borderLeft: `4px solid ${color.border}`,
//     cursor: 'pointer',
//     transition: 'all 0.3s ease',
//     '&:hover': {
//       backgroundColor: color.hover,
//       transform: 'translateY(-4px)',
//       boxShadow: `0 8px 24px rgba(0,0,0,0.15)`
//     }
//   };
// });

// // Enhanced Component: Request Context Helper
// const getRequestContext = (pkg) => {
//   if (!pkg.pendingChanges) {
//     return {
//       type: 'regular',
//       label: 'Standard Approval',
//       description: 'Regular package approval needed',
//       icon: PendingIcon,
//       color: '#9c27b0',
//       bgColor: '#f3e5f5',
//       actionText: 'Approve Package',
//       packageIdAction: 'Will assign Package ID'
//     };
//   }
  
//   const requestType = pkg.pendingChanges.requestType;
  
//   const contexts = {
//     create: {
//       type: 'create',
//       label: 'New Package',
//       description: 'First-time package submission awaiting approval',
//       icon: NewIcon,
//       color: '#2196f3',
//       bgColor: '#e3f2fd',
//       actionText: 'Approve New Package',
//       packageIdAction: 'Will assign new Package ID',
//       priority: 'HIGH'
//     },
//     update: {
//       type: 'update',
//       label: 'Update Request',
//       description: 'Existing package has pending modifications',
//       icon: EditIcon,
//       color: '#ff9800',
//       bgColor: '#fff3e0',
//       actionText: 'Approve Changes',
//       packageIdAction: `Will preserve Package ID ${pkg.packageId}`,
//       priority: 'MEDIUM'
//     },
//     delete: {
//       type: 'delete',
//       label: 'Delete Request',
//       description: 'Package deletion has been requested',
//       icon: DeleteIcon,
//       color: '#f44336',
//       bgColor: '#ffebee',
//       actionText: 'Approve Deletion',
//       packageIdAction: `Will preserve Package ID ${pkg.packageId} for audit`,
//       priority: 'HIGH'
//     }
//   };
  
//   return contexts[requestType] || contexts.create;
// };

// // Enhanced Component: Request Type Column
// const RequestTypeColumn = ({ pkg }) => {
//   const context = getRequestContext(pkg);
//   const IconComponent = context.icon;
  
//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 200 }}>
//       {/* Main Request Type Display */}
//       <Box sx={{ 
//         display: 'flex', 
//         alignItems: 'center', 
//         gap: 1,
//         p: 1,
//         bgcolor: context.bgColor,
//         borderRadius: 2,
//         border: `2px solid ${context.color}`
//       }}>
//         <IconComponent sx={{ color: context.color, fontSize: 20 }} />
//         <Box sx={{ flexGrow: 1 }}>
//           <Typography variant="subtitle2" sx={{ 
//             fontWeight: 'bold', 
//             color: context.color,
//             fontSize: '0.85rem'
//           }}>
//             {context.label.toUpperCase()}
//           </Typography>
//           <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
//             {context.description}
//           </Typography>
//         </Box>
//         {context.priority && (
//           <Chip 
//             label={context.priority} 
//             size="small" 
//             color={context.priority === 'HIGH' ? 'error' : 'warning'}
//             sx={{ fontSize: '0.6rem', height: 20 }}
//           />
//         )}
//       </Box>
      
//       {/* Request Details */}
//       {pkg.pendingChanges && (
//         <Box sx={{ 
//           p: 1, 
//           bgcolor: 'rgba(0,0,0,0.02)', 
//           borderRadius: 1,
//           border: '1px solid rgba(0,0,0,0.1)'
//         }}>
//           <Typography variant="caption" sx={{ 
//             display: 'block', 
//             fontWeight: 'bold', 
//             mb: 0.5,
//             color: 'text.primary'
//           }}>
//             Request Details:
//           </Typography>
//           <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
//             Submitted: {formatDate(pkg.pendingChanges.submittedAt)}
//           </Typography>
//           {pkg.pendingChanges.reason && (
//             <Typography variant="caption" sx={{ 
//               display: 'block', 
//               fontStyle: 'italic',
//               color: 'text.secondary',
//               fontSize: '0.7rem',
//               mt: 0.5
//             }}>
//               Reason: {pkg.pendingChanges.reason}
//             </Typography>
//           )}
//         </Box>
//       )}
      
//       {/* Package ID Status */}
//       <Alert 
//         severity={context.type === 'create' ? 'info' : 'success'} 
//         sx={{ py: 0.5, fontSize: '0.7rem' }}
//       >
//         <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
//           ID Status: {context.packageIdAction}
//         </Typography>
//       </Alert>
      
//       {/* Changes Summary for Updates */}
//       {pkg.pendingChanges?.changedFields && pkg.pendingChanges.changedFields.length > 0 && (
//         <Box sx={{ 
//           p: 1, 
//           bgcolor: 'rgba(255, 152, 0, 0.1)', 
//           borderRadius: 1,
//           border: '1px solid #ff9800'
//         }}>
//           <Typography variant="caption" sx={{ 
//             fontWeight: 'bold', 
//             color: '#e65100',
//             fontSize: '0.7rem'
//           }}>
//             Changes: {pkg.pendingChanges.changedFields.join(', ')}
//           </Typography>
//         </Box>
//       )}
//     </Box>
//   );
// };

// // Enhanced Component: Action Buttons
// const EnhancedActionButtons = ({ pkg, onApprove, onReject, loading }) => {
//   const context = getRequestContext(pkg);
//   const needsAction = needsAdminAction(pkg);
  
//   if (!needsAction) {
//     return (
//       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
//         <Chip 
//           label="No Action Needed" 
//           size="small" 
//           color="success" 
//           variant="outlined"
//           icon={<ApprovedIcon />}
//         />
//         <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
//           Admin action completed
//         </Typography>
//       </Box>
//     );
//   }
  
//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 140 }}>
//       {/* Approve Button */}
//       <Tooltip title={`${context.actionText} - ${context.packageIdAction}`}>
//         <Button
//           variant="contained"
//           color="success"
//           size="small"
//           startIcon={<ApproveIcon />}
//           onClick={onApprove}
//           disabled={loading}
//           sx={{
//             fontSize: '0.75rem',
//             py: 0.8,
//             px: 1.5,
//             fontWeight: 'bold',
//             animation: pkg.pendingChanges ? `${pulseAnimation} 2s infinite` : 'none',
//             '&:hover': {
//               transform: 'scale(1.05)'
//             }
//           }}
//         >
//           {context.actionText}
//         </Button>
//       </Tooltip>
      
//       {/* Reject Button */}
//       <Tooltip title={`Reject ${context.label.toLowerCase()}`}>
//         <Button
//           variant="outlined"
//           color="error"
//           size="small"
//           startIcon={<RejectIcon />}
//           onClick={onReject}
//           disabled={loading}
//           sx={{
//             fontSize: '0.75rem',
//             py: 0.8,
//             px: 1.5,
//             fontWeight: 'bold',
//             '&:hover': {
//               transform: 'scale(1.05)'
//             }
//           }}
//         >
//           Reject {context.type === 'create' ? 'Package' : context.type === 'update' ? 'Changes' : 'Deletion'}
//         </Button>
//       </Tooltip>
      
//       {/* Urgency Indicator */}
//       {context.priority === 'HIGH' && (
//         <Box sx={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           gap: 0.5,
//           justifyContent: 'center'
//         }}>
//           <PriorityIcon sx={{ fontSize: 12, color: '#f44336' }} />
//           <Typography variant="caption" sx={{ 
//             fontSize: '0.65rem', 
//             color: '#f44336',
//             fontWeight: 'bold'
//           }}>
//             HIGH PRIORITY
//           </Typography>
//         </Box>
//       )}
      
//       {/* Submission Time */}
//       {pkg.pendingChanges && (
//         <Typography variant="caption" sx={{ 
//           fontSize: '0.65rem', 
//           textAlign: 'center',
//           color: 'text.secondary'
//         }}>
//           {formatDate(pkg.pendingChanges.submittedAt)}
//         </Typography>
//       )}
//     </Box>
//   );
// };

// // Enhanced Component: Summary Cards
// const RequestTypeSummaryCards = ({ packages }) => {
//   const summary = {
//     create: packages.filter(p => p.pendingChanges?.requestType === 'create').length,
//     update: packages.filter(p => p.pendingChanges?.requestType === 'update').length,
//     delete: packages.filter(p => p.pendingChanges?.requestType === 'delete').length,
//     regular: packages.filter(p => !p.pendingChanges && p.status === 'pending_approval').length
//   };
  
//   const totalPending = summary.create + summary.update + summary.delete + summary.regular;
  
//   return (
//     <Box sx={{ mb: 4 }}>
//       {/* Overall Summary */}
//       <Alert severity="info" sx={{ mb: 3 }}>
//         <AlertTitle sx={{ fontWeight: 'bold' }}>
//           📋 Admin Action Required: {totalPending} Total Requests Pending
//         </AlertTitle>
//         <Typography variant="body2">
//           Review and take action on pending package requests. Each request type has different implications for Package ID management.
//         </Typography>
//       </Alert>
      
//       {/* Summary Cards */}
//       <Grid container spacing={3}>
//         {/* New Packages */}
//         <Grid item xs={12} sm={6} md={3}>
//           <RequestTypeCard requesttype="create">
//             <CardContent sx={{ p: 2 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                 <NewIcon sx={{ color: '#2196f3', fontSize: 28 }} />
//                 <Typography variant="h4" sx={{ 
//                   fontWeight: 'bold', 
//                   color: '#2196f3' 
//                 }}>
//                   {summary.create}
//                 </Typography>
//               </Box>
//               <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
//                 New Packages
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                 First-time submissions awaiting approval
//               </Typography>
//               <Chip 
//                 label="Package IDs will be assigned" 
//                 size="small" 
//                 color="info" 
//                 variant="outlined"
//                 sx={{ fontSize: '0.7rem' }}
//               />
//               {summary.create > 0 && (
//                 <Box sx={{ mt: 1 }}>
//                   <Chip 
//                     label="ACTION REQUIRED" 
//                     size="small" 
//                     color="error"
//                     sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
//                   />
//                 </Box>
//               )}
//             </CardContent>
//           </RequestTypeCard>
//         </Grid>
        
//         {/* Update Requests */}
//         <Grid item xs={12} sm={6} md={3}>
//           <RequestTypeCard requesttype="update">
//             <CardContent sx={{ p: 2 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                 <EditIcon sx={{ color: '#ff9800', fontSize: 28 }} />
//                 <Typography variant="h4" sx={{ 
//                   fontWeight: 'bold', 
//                   color: '#ff9800' 
//                 }}>
//                   {summary.update}
//                 </Typography>
//               </Box>
//               <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
//                 Update Requests
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                 Existing packages with pending changes
//               </Typography>
//               <Chip 
//                 label="Package IDs will be preserved" 
//                 size="small" 
//                 color="success" 
//                 variant="outlined"
//                 sx={{ fontSize: '0.7rem' }}
//               />
//               {summary.update > 0 && (
//                 <Box sx={{ mt: 1 }}>
//                   <Chip 
//                     label="CHANGES PENDING" 
//                     size="small" 
//                     color="warning"
//                     sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
//                   />
//                 </Box>
//               )}
//             </CardContent>
//           </RequestTypeCard>
//         </Grid>
        
//         {/* Delete Requests */}
//         <Grid item xs={12} sm={6} md={3}>
//           <RequestTypeCard requesttype="delete">
//             <CardContent sx={{ p: 2 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                 <DeleteIcon sx={{ color: '#f44336', fontSize: 28 }} />
//                 <Typography variant="h4" sx={{ 
//                   fontWeight: 'bold', 
//                   color: '#f44336' 
//                 }}>
//                   {summary.delete}
//                 </Typography>
//               </Box>
//               <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
//                 Delete Requests
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                 Packages requested for deletion
//               </Typography>
//               <Chip 
//                 label="Package IDs preserved for audit" 
//                 size="small" 
//                 color="error" 
//                 variant="outlined"
//                 sx={{ fontSize: '0.7rem' }}
//               />
//               {summary.delete > 0 && (
//                 <Box sx={{ mt: 1 }}>
//                   <Chip 
//                     label="URGENT REVIEW" 
//                     size="small" 
//                     color="error"
//                     sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
//                   />
//                 </Box>
//               )}
//             </CardContent>
//           </RequestTypeCard>
//         </Grid>
        
//         {/* Regular Pending */}
//         <Grid item xs={12} sm={6} md={3}>
//           <RequestTypeCard requesttype="regular">
//             <CardContent sx={{ p: 2 }}>
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                 <PendingIcon sx={{ color: '#9c27b0', fontSize: 28 }} />
//                 <Typography variant="h4" sx={{ 
//                   fontWeight: 'bold', 
//                   color: '#9c27b0' 
//                 }}>
//                   {summary.regular}
//                 </Typography>
//               </Box>
//               <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
//                 Regular Pending
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                 Standard packages awaiting review
//               </Typography>
//               <Chip 
//                 label="Standard approval process" 
//                 size="small" 
//                 color="secondary" 
//                 variant="outlined"
//                 sx={{ fontSize: '0.7rem' }}
//               />
//               {summary.regular > 0 && (
//                 <Box sx={{ mt: 1 }}>
//                   <Chip 
//                     label="STANDARD REVIEW" 
//                     size="small" 
//                     color="secondary"
//                     sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
//                   />
//                 </Box>
//               )}
//             </CardContent>
//           </RequestTypeCard>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// // Enhanced Table Header
// const EnhancedTableHeader = () => (
//   <TableHead>
//     <TableRow>
//       <HeaderCell>Package Details</HeaderCell>
//       <HeaderCell>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <HistoryIcon sx={{ fontSize: 16 }} />
//           Package ID Status
//         </Box>
//       </HeaderCell>
//       <HeaderCell>Provider Info</HeaderCell>
//       <HeaderCell>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <RequestIcon sx={{ fontSize: 16 }} />
//           Request Type & Details
//         </Box>
//       </HeaderCell>
//       <HeaderCell>Pricing & Duration</HeaderCell>
//       <HeaderCell>Timeline</HeaderCell>
//       <HeaderCell align="center">
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
//           <AnalyzeIcon sx={{ fontSize: 16 }} />
//           Admin Actions
//         </Box>
//       </HeaderCell>
//     </TableRow>
//   </TableHead>
// );

// const PackageManagementAdmin = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
  
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [packages, setPackages] = useState([]);
//   const [pendingPackages, setPendingPackages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedItemId, setSelectedItemId] = useState(null);
//   const [detailsDialog, setDetailsDialog] = useState({ open: false, item: null, type: '' });
//   const [currentTab, setCurrentTab] = useState(0);
//   const [expandedRows, setExpandedRows] = useState({});
//   const [rejectDialog, setRejectDialog] = useState({ open: false, packageId: null, reason: '' });
//   const [updatedPackages, setUpdatedPackages] = useState(new Set());

//   useEffect(() => {
//     fetchPackageData();
//   }, []);

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

//   const fetchPackageData = async () => {
//     try {
//       setLoading(true);
//       console.log('📦 Admin fetching package data...');
      
//       const [historyRes, pendingRes] = await Promise.all([
//         api.get('/packages/admin/history'),
//         api.get('/packages/admin/pending')
//       ]);

//       if (historyRes.data.success) {
//         const historyPackages = historyRes.data.data || [];
//         setPackages(historyPackages);
        
//         const updatedIds = new Set();
//         historyPackages.forEach(pkg => {
//           if (pkg.pendingChanges && pkg.pendingChanges.requestType) {
//             updatedIds.add(pkg._id);
//           }
//         });
//         setUpdatedPackages(updatedIds);
//       }
      
//       if (pendingRes.data.success) {
//         const pendingPackagesData = pendingRes.data.data || [];
//         setPendingPackages(pendingPackagesData);
//       }

//     } catch (error) {
//       setError('Failed to fetch package data');
//       console.error('❌ Fetch package data error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePackageAction = async (packageId, action, reason = '') => {
//     try {
//       setLoading(true);
//       console.log(`📦 Admin ${action}ing package:`, packageId, 'Reason:', reason);
      
//       let response;
//       if (action === 'approve') {
//         response = await api.post(`/packages/admin/${packageId}/approve`, { 
//           reason: reason || 'Package approved by admin' 
//         });
//       } else {
//         response = await api.post(`/packages/admin/${packageId}/reject`, { 
//           reason: reason || 'Package does not meet our standards' 
//         });
//       }
      
//       if (response.data.success) {
//         console.log(`✅ Package ${action}ed successfully:`, response.data);
        
//         let successMessage = response.data.message;
//         if (action === 'approve' && response.data.packageId) {
//           successMessage += ` Package ID: ${response.data.packageId}`;
//         }
        
//         setDetailsDialog({ open: false, item: null, type: '' });
//         setRejectDialog({ open: false, packageId: null, reason: '' });
//         setSelectedItemId(null);
//         setError('');
        
//         setUpdatedPackages(prev => {
//           const newSet = new Set(prev);
//           newSet.delete(packageId);
//           return newSet;
//         });
        
//         console.log('🔄 Refreshing package data to sync UI...');
//         await fetchPackageData();
        
//         if (action === 'approve') {
//           console.log(`✅ Package approved successfully. Package ID: ${response.data.packageId || 'Assigned'}`);
//         } else {
//           console.log(`❌ Package ${action}ed successfully`);
//         }
        
//       } else {
//         throw new Error(response.data.message || `Failed to ${action} package`);
//       }
//     } catch (error) {
//       console.error(`❌ Error ${action}ing package:`, error);
//       setError(`Failed to ${action} package: ${error.response?.data?.message || error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusDisplay = (pkg) => {
//     if (pkg.status === 'deleted') {
//       return <Chip icon={<DeleteIcon />} label="Deleted" color="error" size="small" />;
//     }

//     if (pkg.pendingChanges) {
//       const requestType = pkg.pendingChanges.requestType;
//       if (requestType === 'delete') {
//         return (
//           <UpdateBadge badgeContent="DEL" updatetype="delete">
//             <Chip 
//               icon={<WarningIcon />} 
//               label="Deletion Pending" 
//               color="error" 
//               size="small"
//               sx={{ 
//                 animation: `${pulseAnimation} 2s infinite`,
//                 backgroundColor: 'rgba(244, 67, 54, 0.15)'
//               }}
//             />
//           </UpdateBadge>
//         );
//       } else if (requestType === 'update') {
//         return (
//           <UpdateBadge badgeContent="UPD" updatetype="update">
//             <Chip 
//               icon={<UpdateIcon />} 
//               label="Update Pending" 
//               color="warning" 
//               size="small"
//               sx={{ 
//                 animation: `${pulseAnimation} 2s infinite`,
//                 backgroundColor: 'rgba(255, 152, 0, 0.15)'
//               }}
//             />
//           </UpdateBadge>
//         );
//       } else if (requestType === 'create') {
//         return (
//           <UpdateBadge badgeContent="NEW" updatetype="create">
//             <Chip 
//               icon={<NewIcon />} 
//               label="Creation Pending" 
//               color="info" 
//               size="small"
//               sx={{ 
//                 backgroundColor: 'rgba(33, 150, 243, 0.15)'
//               }}
//             />
//           </UpdateBadge>
//         );
//       }
//     }
    
//     switch (pkg.status) {
//       case 'approved':
//         return <Chip icon={<ApprovedIcon />} label="Approved" color="success" size="small" />;
//       case 'pending_approval':
//         return <Chip icon={<PendingIcon />} label="Pending Approval" color="warning" size="small" />;
//       case 'rejected':
//         return <Chip icon={<RejectedIcon />} label="Rejected" color="error" size="small" />;
//       default:
//         return <Chip icon={<PendingIcon />} label="Unknown" color="default" size="small" />;
//     }
//   };

//   const hasUpdates = (pkg) => {
//     return pkg.pendingChanges && (
//       pkg.pendingChanges.requestType === 'update' || 
//       pkg.pendingChanges.requestType === 'delete' ||
//       pkg.pendingChanges.requestType === 'create'
//     );
//   };

//   const getUpdateType = (pkg) => {
//     if (pkg.pendingChanges) {
//       return pkg.pendingChanges.requestType;
//     }
//     return null;
//   };

//   const needsAdminAction = (pkg) => {
//     if (pkg.adminActionTaken === true) {
//       return false;
//     }
    
//     return (
//       (pkg.status === 'pending_approval' && !pkg.firstApprovedAt) ||
//       (pkg.pendingChanges && pkg.pendingChanges.requestType && (
//         pkg.pendingChanges.requestType === 'create' ||
//         pkg.pendingChanges.requestType === 'update' ||
//         pkg.pendingChanges.requestType === 'delete'
//       ))
//     );
//   };

//   const handleLogout = () => {
//     logout();
//     navigate('/admin-login');
//   };

//   const filterItems = (items, searchField) => {
//     return items.filter(item =>
//       item[searchField]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (item.serviceProvider && typeof item.serviceProvider === 'object' && 
//        item.serviceProvider.businessName?.toLowerCase().includes(searchTerm.toLowerCase()))
//     );
//   };

//   const handleViewDetails = (item, type) => {
//     setDetailsDialog({ open: true, item, type });
//   };

//   const handleExpandClick = (packageId) => {
//     setExpandedRows(prev => ({
//       ...prev,
//       [packageId]: !prev[packageId]
//     }));
//   };

//   const renderPackagesTable = (packagesData, showActions = false) => {
//     const filteredPackages = filterItems(packagesData, 'packageName');
    
//     return (
//       <StyledTableContainer>
//         <Table>
//           <EnhancedTableHeader />
//           <TableBody>
//             {filteredPackages.map((pkg) => {
//               const isExpanded = expandedRows[pkg._id];
//               const packageHasUpdates = hasUpdates(pkg);
//               const updateType = getUpdateType(pkg);
//               const isDeleted = pkg.status === 'deleted';
//               const showActionButtons = showActions && needsAdminAction(pkg);
              
//               return (
//                 <React.Fragment key={pkg._id}>
//                   <StyledTableRow 
//                     status={pkg.status}
//                     hasUpdates={packageHasUpdates}
//                     updateType={updateType}
//                     isDeleted={isDeleted}
//                     selected={selectedItemId === pkg._id}
//                     onClick={() => setSelectedItemId(pkg._id)}
//                     sx={{ cursor: 'pointer' }}
//                   >
//                     {/* Package Details Column */}
//                     <TableCell>
//                       <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
//                         <Box sx={{ flexGrow: 1 }}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
//                             <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#003047' }}>
//                               {pkg.packageName}
//                             </Typography>
//                             {packageHasUpdates && (
//                               <Box sx={{ display: 'flex', gap: 0.5 }}>
//                                 {updateType === 'update' && (
//                                   <Tooltip title="Package has pending updates - Package ID will be preserved">
//                                     <UpdateBadge badgeContent="UPD" updatetype="update">
//                                       <UpdateIcon sx={{ color: '#ff9800', fontSize: 20 }} />
//                                     </UpdateBadge>
//                                   </Tooltip>
//                                 )}
//                                 {updateType === 'delete' && (
//                                   <Tooltip title="Package deletion requested - Package ID will be preserved">
//                                     <UpdateBadge badgeContent="DEL" updatetype="delete">
//                                       <WarningIcon sx={{ color: '#f44336', fontSize: 20 }} />
//                                     </UpdateBadge>
//                                   </Tooltip>
//                                 )}
//                                 {updateType === 'create' && (
//                                   <Tooltip title="New package pending approval">
//                                     <UpdateBadge badgeContent="NEW" updatetype="create">
//                                       <NewIcon sx={{ color: '#2196f3', fontSize: 20 }} />
//                                     </UpdateBadge>
//                                   </Tooltip>
//                                 )}
//                               </Box>
//                             )}
//                           </Box>
//                           <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
//                             {pkg.packageDescription ? 
//                               `${pkg.packageDescription.substring(0, 60)}${pkg.packageDescription.length > 60 ? '...' : ''}` 
//                               : 'No description'
//                             }
//                           </Typography>
//                           <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
//                             <Chip icon={<AudienceIcon />} label={pkg.targetAudience} size="small" variant="outlined" />
//                             <Chip icon={<LocationIcon />} label={pkg.packageLocation} size="small" variant="outlined" />
//                             {pkg.packageId && (
//                               <Tooltip title={`Package ID ${pkg.packageId} is permanent and never changes`}>
//                                 <Chip 
//                                   icon={<HistoryIcon />} 
//                                   label="ID Locked" 
//                                   size="small" 
//                                   color="success"
//                                   variant="outlined"
//                                 />
//                               </Tooltip>
//                             )}
//                           </Box>
//                         </Box>
//                       </Box>
//                     </TableCell>

//                     {/* Package ID Status */}
//                     <TableCell>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <Typography variant="body2" sx={{ 
//                           fontWeight: 600, 
//                           color: pkg.packageId ? '#4caf50' : '#ff9800' 
//                         }}>
//                           {pkg.packageId || 'Will be assigned'}
//                         </Typography>
//                         {pkg.packageId && (
//                           <Tooltip title="Package ID is permanent and never changes">
//                             <HistoryIcon sx={{ fontSize: 14, color: '#4caf50', opacity: 0.7 }} />
//                           </Tooltip>
//                         )}
//                       </Box>
//                       {pkg.firstApprovedAt && (
//                         <Typography variant="caption" color="text.secondary">
//                           {pkg.lastUpdatedAt ? 'Updated Package' : 'Original Package'}
//                         </Typography>
//                       )}
//                     </TableCell>

//                     {/* Provider Info */}
//                     <TableCell>
//                       <Typography variant="body2" color="text.secondary">
//                         {pkg.serviceProviderId || 'Not assigned'}
//                       </Typography>
//                       <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
//                         {pkg.serviceProvider?.businessName || pkg.serviceProvider?.fullName || 'Unknown'}
//                       </Typography>
//                     </TableCell>

//                     {/* NEW: Request Type & Details Column */}
//                     <TableCell>
//                       <RequestTypeColumn pkg={pkg} />
//                     </TableCell>

//                     {/* Pricing & Duration */}
//                     <TableCell>
//                       <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
//                         <PriceIcon sx={{ fontSize: 16, mr: 0.5, color: '#003047' }} />
//                         <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
//                           LKR {pkg.totalPrice?.toLocaleString()}
//                         </Typography>
//                       </Box>
//                       <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                         <TimeIcon sx={{ fontSize: 16, mr: 0.5, color: '#666' }} />
//                         <Typography variant="body2" color="text.secondary">
//                           {pkg.totalDuration} min
//                         </Typography>
//                       </Box>
//                     </TableCell>

//                     {/* Timeline */}
//                     <TableCell>
//                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                         <Typography variant="caption" color="text.secondary">
//                           Submitted: {formatDate(pkg.firstSubmittedAt || pkg.createdAt)}
//                         </Typography>
//                         {pkg.firstApprovedAt && (
//                           <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 600 }}>
//                             First Approved: {formatDate(pkg.firstApprovedAt)}
//                           </Typography>
//                         )}
//                         {pkg.lastUpdatedAt && (
//                           <Typography variant="caption" sx={{ color: '#ff9800', fontWeight: 600 }}>
//                             Last Updated: {formatDate(pkg.lastUpdatedAt)}
//                           </Typography>
//                         )}
//                         {pkg.deletedAt && (
//                           <Typography variant="caption" sx={{ color: '#f44336', fontWeight: 600 }}>
//                             Deleted: {formatDate(pkg.deletedAt)}
//                           </Typography>
//                         )}
//                       </Box>
//                     </TableCell>

//                     {/* Enhanced Actions */}
//                     <TableCell align="center">
//                       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
//                         <Box sx={{ display: 'flex', gap: 0.5 }}>
//                           <IconButton 
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleExpandClick(pkg._id);
//                             }}
//                             sx={{ color: '#003047' }}
//                           >
//                             {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//                           </IconButton>
                          
//                           <IconButton 
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleViewDetails(pkg, 'package');
//                             }}
//                             sx={{ color: '#003047' }}
//                           >
//                             <ViewIcon />
//                           </IconButton>
//                         </Box>
                        
//                         {showActionButtons && (
//                           <EnhancedActionButtons
//                             pkg={pkg}
//                             onApprove={() => handlePackageAction(pkg._id, 'approve')}
//                             onReject={() => setRejectDialog({ open: true, packageId: pkg._id, reason: '' })}
//                             loading={loading}
//                           />
//                         )}
//                       </Box>
//                     </TableCell>
//                   </StyledTableRow>

//                   {/* Expanded Details Row */}
//                   <TableRow>
//                     <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
//                       <Collapse in={isExpanded} timeout="auto" unmountOnExit>
//                         <Box sx={{ margin: 2, p: 2, backgroundColor: 'white', borderRadius: 2 }}>
//                           <Typography variant="h6" gutterBottom sx={{ color: '#003047', fontWeight: 600 }}>
//                             📋 Complete Package Details - ID Consistency Guaranteed
//                           </Typography>
                          
//                           {pkg.packageId && (
//                             <Alert severity="success" sx={{ mb: 2 }}>
//                               <Typography variant="body2">
//                                 <strong>🔒 Package ID: {pkg.packageId}</strong> - This ID is permanent and will never change, 
//                                 even after updates or modifications. This ensures consistent tracking throughout the package lifecycle.
//                               </Typography>
//                             </Alert>
//                           )}
                          
//                           <Grid container spacing={3}>
//                             <Grid item xs={12} md={6}>
//                               <Card variant="outlined" sx={{ p: 2 }}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#003047' }}>
//                                   📦 Basic Information
//                                 </Typography>
//                                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//                                   <Typography variant="body2">
//                                     <strong>Package Name:</strong> {pkg.packageName}
//                                   </Typography>
//                                   <Typography variant="body2">
//                                     <strong>Package Type:</strong> {pkg.packageType}
//                                   </Typography>
//                                   <Typography variant="body2">
//                                     <strong>Target Audience:</strong> {pkg.targetAudience}
//                                   </Typography>
//                                   <Typography variant="body2">
//                                     <strong>Location:</strong> {pkg.packageLocation}
//                                   </Typography>
//                                   <Typography variant="body2">
//                                     <strong>Description:</strong> {pkg.packageDescription || 'No description provided'}
//                                   </Typography>
//                                 </Box>
//                               </Card>
//                             </Grid>

//                             <Grid item xs={12} md={6}>
//                               <Card variant="outlined" sx={{ p: 2 }}>
//                                 <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#003047' }}>
//                                   💰 Pricing & Duration
//                                 </Typography>
//                                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//                                   <Typography variant="body2">
//                                     <strong>Total Price:</strong> LKR {pkg.totalPrice?.toLocaleString()}
//                                   </Typography>
//                                   <Typography variant="body2">
//                                     <strong>Duration:</strong> {pkg.totalDuration} minutes
//                                   </Typography>
//                                   <Typography variant="body2">
//                                     <strong>Min Lead Time:</strong> {pkg.minLeadTime} hours
//                                   </Typography>
//                                   <Typography variant="body2">
//                                     <strong>Max Advance Booking:</strong> {pkg.maxLeadTime} days
//                                   </Typography>
//                                   {pkg.specialOffers?.discountPercentage > 0 && (
//                                     <Typography variant="body2" sx={{ color: 'success.main' }}>
//                                       <strong>Special Offer:</strong> {pkg.specialOffers.discountPercentage}% discount
//                                     </Typography>
//                                   )}
//                                 </Box>
//                               </Card>
//                             </Grid>

//                             {pkg.pendingChanges && (
//                               <Grid item xs={12}>
//                                 <Card 
//                                   variant="outlined" 
//                                   sx={{ 
//                                     p: 2, 
//                                     backgroundColor: pkg.pendingChanges.requestType === 'delete' ? '#ffebee' : 
//                                                    pkg.pendingChanges.requestType === 'update' ? '#fff3e0' : '#e3f2fd', 
//                                     borderColor: pkg.pendingChanges.requestType === 'delete' ? '#f44336' : 
//                                                pkg.pendingChanges.requestType === 'update' ? '#ff9800' : '#2196f3',
//                                     borderWidth: 2,
//                                     animation: `${pulseAnimation} 2s infinite`
//                                   }}
//                                 >
//                                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//                                     {pkg.pendingChanges.requestType === 'delete' && <WarningIcon sx={{ color: '#f44336' }} />}
//                                     {pkg.pendingChanges.requestType === 'update' && <UpdateIcon sx={{ color: '#ff9800' }} />}
//                                     {pkg.pendingChanges.requestType === 'create' && <NewIcon sx={{ color: '#2196f3' }} />}
//                                     <Typography variant="subtitle1" sx={{ 
//                                       fontWeight: 700, 
//                                       color: pkg.pendingChanges.requestType === 'delete' ? '#d32f2f' : 
//                                             pkg.pendingChanges.requestType === 'update' ? '#e65100' : '#1976d2'
//                                     }}>
//                                       ⏳ {pkg.pendingChanges.requestType?.toUpperCase()} REQUEST PENDING
//                                     </Typography>
//                                   </Box>
                                  
//                                   <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
//                                     <Typography variant="body2">
//                                       <strong>Request Type:</strong> {pkg.pendingChanges.requestType}
//                                     </Typography>
//                                     <Typography variant="body2">
//                                       <strong>Submitted:</strong> {formatDate(pkg.pendingChanges.submittedAt)}
//                                     </Typography>
//                                     <Typography variant="body2">
//                                       <strong>Reason:</strong> {pkg.pendingChanges.reason}
//                                     </Typography>
                                    
//                                     {pkg.pendingChanges.requestType === 'delete' && (
//                                       <Alert severity="error" sx={{ mt: 1 }}>
//                                         <Typography variant="body2">
//                                           <strong>⚠️ DELETION REQUEST:</strong> This package is scheduled for deletion. 
//                                           The Package ID <strong>{pkg.packageId}</strong> will be preserved in the audit trail, 
//                                           but the package will become unavailable.
//                                         </Typography>
//                                       </Alert>
//                                     )}
                                    
//                                     {pkg.pendingChanges.requestType === 'update' && (
//                                       <Alert severity="warning" sx={{ mt: 1 }}>
//                                         <Typography variant="body2">
//                                           <strong>📝 UPDATE REQUEST:</strong> The Package ID <strong>{pkg.packageId}</strong> will 
//                                           remain unchanged. Only the package content will be updated with approval.
//                                         </Typography>
//                                       </Alert>
//                                     )}

//                                     {pkg.pendingChanges.requestType === 'create' && (
//                                       <Alert severity="info" sx={{ mt: 1 }}>
//                                         <Typography variant="body2">
//                                           <strong>🆕 NEW PACKAGE:</strong> A new Package ID will be assigned upon approval. 
//                                           This will be the permanent identifier for this package.
//                                         </Typography>
//                                       </Alert>
//                                     )}
//                                   </Box>
//                                 </Card>
//                               </Grid>
//                             )}
//                           </Grid>
//                         </Box>
//                       </Collapse>
//                     </TableCell>
//                   </TableRow>
//                 </React.Fragment>
//               );
//             })}
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
//              BeautiQ Admin - Enhanced Package Management
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
//             Enhanced Package Management with Request Type Clarity
//           </Typography>
//           <Typography variant="subtitle1" sx={{ color: '#666', mb: 2 }}>
//             Manage packages with clear visual indicators for CREATE, UPDATE, and DELETE requests.
//           </Typography>
          
//           <Alert severity="info" sx={{ mb: 2 }}>
//             <AlertTitle sx={{ fontWeight: 'bold' }}>Request Type Guide</AlertTitle>
//             <Box component="ul" sx={{ m: 0, pl: 2 }}>
//               <li><strong>🆕 NEW:</strong> First-time package submissions (Package ID assigned on approval)</li>
//               <li><strong>📝 UPDATE:</strong> Modifications to existing packages (Package ID preserved)</li>
//               <li><strong>🗑️ DELETE:</strong> Deletion requests (Package ID preserved for audit trail)</li>
//             </Box>
//           </Alert>
          
//           <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//               <Box sx={{ width: 16, height: 16, bgcolor: '#2196f3', borderRadius: 1 }}></Box>
//               <Typography variant="caption">New Package Requests</Typography>
//             </Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//               <Box sx={{ width: 16, height: 16, bgcolor: '#ff9800', borderRadius: 1 }}></Box>
//               <Typography variant="caption">Update Requests (ID Preserved)</Typography>
//             </Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//               <Box sx={{ width: 16, height: 16, bgcolor: '#f44336', borderRadius: 1 }}></Box>
//               <Typography variant="caption">Deletion Requests (ID Preserved)</Typography>
//             </Box>
//             <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//               <HistoryIcon sx={{ fontSize: 16, color: '#4caf50' }}/>
//               <Typography variant="caption">Package ID Never Changes</Typography>
//             </Box>
//           </Box>
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
//               placeholder="Search by package name or provider..."
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
//               onClick={fetchPackageData}
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
//               icon={<PackageIcon />} 
//               label={`All Packages (${packages.length})`} 
//               iconPosition="start"
//             />
//             <Tab 
//               icon={<Badge badgeContent={pendingPackages.filter(hasUpdates).length} color="warning">
//                 <PendingIcon />
//               </Badge>} 
//               label={`Pending Approval (${pendingPackages.length})`} 
//               iconPosition="start"
//             />
//           </Tabs>
          
//           <CardContent sx={{ p: 0 }}>
//             {currentTab === 0 && renderPackagesTable(packages, false)}
//             {currentTab === 1 && (
//               <>
//                 <RequestTypeSummaryCards packages={pendingPackages} />
//                 {renderPackagesTable(pendingPackages, true)}
//               </>
//             )}
//           </CardContent>
//         </Card>

//         {/* Rejection Dialog */}
//         <Dialog 
//           open={rejectDialog.open} 
//           onClose={() => setRejectDialog({ open: false, packageId: null, reason: '' })}
//           maxWidth="sm"
//           fullWidth
//         >
//           <DialogTitle sx={{ bgcolor: '#d32f2f', color: 'white' }}>
//             Reject Package Request
//           </DialogTitle>
//           <DialogContent sx={{ p: 3 }}>
//             <TextField
//               fullWidth
//               multiline
//               rows={4}
//               label="Rejection Reason"
//               value={rejectDialog.reason}
//               onChange={(e) => setRejectDialog(prev => ({ ...prev, reason: e.target.value }))}
//               placeholder="Please provide a detailed reason for rejecting this package request..."
//               sx={{ mt: 2 }}
//             />
//           </DialogContent>
//           <DialogActions sx={{ p: 3 }}>
//             <Button 
//               onClick={() => setRejectDialog({ open: false, packageId: null, reason: '' })}
//               variant="outlined"
//             >
//               Cancel
//             </Button>
//             <Button 
//               onClick={() => handlePackageAction(rejectDialog.packageId, 'reject', rejectDialog.reason)}
//               variant="contained"
//               color="error"
//               disabled={loading || !rejectDialog.reason.trim()}
//             >
//               Reject Package
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Enhanced Details Dialog */}
//         <Dialog 
//           open={detailsDialog.open} 
//           onClose={() => setDetailsDialog({ open: false, item: null, type: '' })}
//           maxWidth="lg"
//           fullWidth
//         >
//           <DialogTitle sx={{ bgcolor: '#003047', color: 'white', fontWeight: 700 }}>
//             📦 Complete Package Details - Request Type Analysis
//           </DialogTitle>
//           <DialogContent sx={{ p: 3 }}>
//             {detailsDialog.item && (
//               <Grid container spacing={3} sx={{ mt: 1 }}>
//                 <Grid item xs={12}>
//                   <Alert severity="success" sx={{ mb: 2 }}>
//                     <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
//                       🔒 Package ID: {detailsDialog.item.packageId || 'Will be assigned on approval'}
//                     </Typography>
//                     <Typography variant="body2">
//                       This Package ID is <strong>permanent and will never change</strong>, ensuring consistent 
//                       tracking across all updates, modifications, and the entire package lifecycle.
//                     </Typography>
//                   </Alert>
//                 </Grid>

//                 {/* Request Type Analysis */}
//                 <Grid item xs={12}>
//                   <RequestTypeColumn pkg={detailsDialog.item} />
//                 </Grid>

//                 {/* Complete package information display */}
//                 <Grid item xs={12}>
//                   <Card variant="outlined" sx={{ p: 3 }}>
//                     <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#003047' }}>
//                       {detailsDialog.item.packageName}
//                     </Typography>
                    
//                     <Grid container spacing={2}>
//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="body1" sx={{ mb: 1 }}>
//                           <strong>Package ID:</strong> {detailsDialog.item.packageId || 'Pending Assignment'}
//                         </Typography>
//                         <Typography variant="body1" sx={{ mb: 1 }}>
//                           <strong>Provider ID:</strong> {detailsDialog.item.serviceProviderId || 'Not assigned'}
//                         </Typography>
//                         <Typography variant="body1" sx={{ mb: 1 }}>
//                           <strong>Type:</strong> {detailsDialog.item.packageType}
//                         </Typography>
//                         <Typography variant="body1" sx={{ mb: 1 }}>
//                           <strong>Target Audience:</strong> {detailsDialog.item.targetAudience}
//                         </Typography>
//                         <Typography variant="body1" sx={{ mb: 1 }}>
//                           <strong>Location:</strong> {detailsDialog.item.packageLocation}
//                         </Typography>
//                       </Grid>
                      
//                       <Grid item xs={12} sm={6}>
//                         <Typography variant="body1" sx={{ mb: 1 }}>
//                           <strong>Price:</strong> LKR {detailsDialog.item.totalPrice?.toLocaleString()}
//                         </Typography>
//                         <Typography variant="body1" sx={{ mb: 1 }}>
//                           <strong>Duration:</strong> {detailsDialog.item.totalDuration} minutes
//                         </Typography>
//                         <Typography variant="body1" sx={{ mb: 1 }}>
//                           <strong>Lead Time:</strong> {detailsDialog.item.minLeadTime} - {detailsDialog.item.maxLeadTime} hours
//                         </Typography>
//                         <Typography variant="body1" sx={{ mb: 1 }}>
//                           <strong>Status:</strong> {detailsDialog.item.status}
//                         </Typography>
//                         <Typography variant="body1" sx={{ mb: 1 }}>
//                           <strong>Availability:</strong> {detailsDialog.item.availabilityStatus || 'Available'}
//                         </Typography>
//                       </Grid>

//                       {/* Package History */}
//                       <Grid item xs={12}>
//                         <Divider sx={{ my: 2 }} />
//                         <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#003047' }}>
//                           📅 Package History & Request Analysis
//                         </Typography>
//                         <Grid container spacing={2}>
//                           <Grid item xs={12} sm={6}>
//                             <Typography variant="body2" sx={{ mb: 1 }}>
//                               <strong>First Submitted:</strong> {formatDate(detailsDialog.item.firstSubmittedAt || detailsDialog.item.createdAt)}
//                             </Typography>
//                             <Typography variant="body2" sx={{ mb: 1, color: detailsDialog.item.firstApprovedAt ? '#4caf50' : 'text.secondary' }}>
//                               <strong>First Approved:</strong> {detailsDialog.item.firstApprovedAt ? formatDate(detailsDialog.item.firstApprovedAt) : 'Not approved yet'}
//                             </Typography>
//                           </Grid>
//                           <Grid item xs={12} sm={6}>
//                             <Typography variant="body2" sx={{ 
//                               mb: 1, 
//                               fontWeight: detailsDialog.item.lastUpdatedAt ? 700 : 400,
//                               color: detailsDialog.item.lastUpdatedAt ? '#ff9800' : 'text.secondary'
//                             }}>
//                               <strong>Last Updated:</strong> {detailsDialog.item.lastUpdatedAt ? formatDate(detailsDialog.item.lastUpdatedAt) : 'Never updated'}
//                             </Typography>
//                             {detailsDialog.item.deletedAt && (
//                               <Typography variant="body2" sx={{ mb: 1, color: 'error.main', fontWeight: 700 }}>
//                                 <strong>Deleted:</strong> {formatDate(detailsDialog.item.deletedAt)}
//                               </Typography>
//                             )}
//                           </Grid>
//                         </Grid>
                        
//                         {/* Package ID Consistency Info */}
//                         <Box sx={{ mt: 2, p: 2, bgcolor: '#e8f5e8', borderRadius: 1, border: '2px solid #4caf50' }}>
//                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
//                             <HistoryIcon sx={{ color: '#2e7d32' }} />
//                             <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2e7d32' }}>
//                               Package ID Consistency Guarantee
//                             </Typography>
//                           </Box>
//                           <Typography variant="body2" sx={{ mb: 1 }}>
//                             <strong>Current Package ID:</strong> {detailsDialog.item.packageId || 'Will be assigned on first approval'}
//                           </Typography>
//                           <Typography variant="body2" color="text.secondary">
//                             ✅ This Package ID is <strong>permanent</strong> and will <strong>never change</strong><br/>
//                             ✅ Updates and modifications preserve the original Package ID<br/>
//                             ✅ Consistent tracking throughout the entire package lifecycle<br/>
//                             ✅ Audit trail maintains Package ID for historical reference
//                           </Typography>
//                         </Box>
//                       </Grid>

//                       {/* Enhanced Pending Changes with Request Type Analysis */}
//                       {detailsDialog.item.pendingChanges && (
//                         <Grid item xs={12}>
//                           <Divider sx={{ my: 2 }} />
//                           <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#e65100' }}>
//                             ⏳ Pending Request Analysis - {detailsDialog.item.pendingChanges.requestType?.toUpperCase()}
//                           </Typography>
//                           <Card variant="outlined" sx={{ 
//                             p: 2, 
//                             backgroundColor: detailsDialog.item.pendingChanges.requestType === 'delete' ? '#ffebee' : 
//                                            detailsDialog.item.pendingChanges.requestType === 'update' ? '#fff3e0' : '#e3f2fd', 
//                             borderColor: detailsDialog.item.pendingChanges.requestType === 'delete' ? '#f44336' : 
//                                        detailsDialog.item.pendingChanges.requestType === 'update' ? '#ff9800' : '#2196f3',
//                             borderWidth: 2
//                           }}>
//                             <Typography variant="body2" sx={{ mb: 1 }}>
//                               <strong>Request Type:</strong> {detailsDialog.item.pendingChanges.requestType}
//                             </Typography>
//                             <Typography variant="body2" sx={{ mb: 1 }}>
//                               <strong>Submitted:</strong> {formatDate(detailsDialog.item.pendingChanges.submittedAt)}
//                             </Typography>
//                             <Typography variant="body2" sx={{ mb: 1 }}>
//                               <strong>Reason:</strong> {detailsDialog.item.pendingChanges.reason}
//                             </Typography>
                            
//                             {detailsDialog.item.pendingChanges.changedFields && (
//                               <Typography variant="body2" sx={{ mb: 1 }}>
//                                 <strong>Changed Fields:</strong> {detailsDialog.item.pendingChanges.changedFields.join(', ')}
//                               </Typography>
//                             )}
                            
//                             {/* Request Type Specific Information */}
//                             {detailsDialog.item.pendingChanges.requestType === 'create' && (
//                               <Alert severity="info" sx={{ mt: 2 }}>
//                                 <Typography variant="body2">
//                                   <strong>🆕 NEW PACKAGE REQUEST:</strong> This is a first-time package submission. 
//                                   A new Package ID will be assigned upon approval and will become the permanent identifier.
//                                 </Typography>
//                               </Alert>
//                             )}

//                             {detailsDialog.item.pendingChanges.requestType === 'update' && (
//                               <Alert severity="warning" sx={{ mt: 2 }}>
//                                 <Typography variant="body2">
//                                   <strong>📝 UPDATE REQUEST:</strong> Modifications requested for existing package. 
//                                   Package ID <strong>{detailsDialog.item.packageId}</strong> will be preserved, 
//                                   only content will be updated.
//                                 </Typography>
//                               </Alert>
//                             )}

//                             {detailsDialog.item.pendingChanges.requestType === 'delete' && (
//                               <Alert severity="error" sx={{ mt: 2 }}>
//                                 <Typography variant="body2">
//                                   <strong>🗑️ DELETION REQUEST:</strong> Package deletion has been requested. 
//                                   Package ID <strong>{detailsDialog.item.packageId}</strong> will be preserved 
//                                   in the audit trail for historical tracking.
//                                 </Typography>
//                               </Alert>
//                             )}
//                           </Card>
//                         </Grid>
//                       )}
//                     </Grid>
//                   </Card>
//                 </Grid>
//               </Grid>
//             )}
//           </DialogContent>
//           <DialogActions sx={{ p: 3 }}>
//             {/* Enhanced action buttons with request type context */}
//             {detailsDialog.item && needsAdminAction(detailsDialog.item) && (
//               <>
//                 <Button 
//                   onClick={() => setRejectDialog({ open: true, packageId: detailsDialog.item._id, reason: '' })}
//                   variant="contained"
//                   color="error"
//                   startIcon={<RejectIcon />}
//                   disabled={loading}
//                   sx={{ mr: 1 }}
//                 >
//                   Reject {getRequestContext(detailsDialog.item).label}
//                 </Button>
//                 <Button 
//                   onClick={() => handlePackageAction(detailsDialog.item._id, 'approve')}
//                   variant="contained"
//                   color="success"
//                   startIcon={<ApproveIcon />}
//                   disabled={loading}
//                   sx={{ mr: 1 }}
//                 >
//                   {getRequestContext(detailsDialog.item).actionText}
//                 </Button>
//               </>
//             )}
//             <Button 
//               onClick={() => setDetailsDialog({ open: false, item: null, type: '' })}
//               variant="outlined"
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

// export default PackageManagementAdmin;
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
  Collapse,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as ApprovedIcon,
  Pending as PendingIcon,
  Cancel as RejectedIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Check as ApproveIcon,
  Close as RejectIcon,
  Inventory as PackageIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  AttachMoney as PriceIcon,
  Schedule as TimeIcon,
  LocationOn as LocationIcon,
  Group as AudienceIcon,
  Update as UpdateIcon,
  NewReleases as NewIcon,
  Warning as WarningIcon,
  History as HistoryIcon,
  Assignment as RequestIcon,
  Priority as PriorityIcon,
  Block as BlockIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

// Enhanced Animations
const pulseAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(255, 152, 0, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 152, 0, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 152, 0, 0);
  }
`;

const slideInAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Enhanced Styled Components
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
  overflow: 'hidden',
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

const StyledTableRow = styled(TableRow)(({ theme, status, hasUpdates, isDeleted, updateType }) => {
  let backgroundColor;
  let borderColor;
  let animation;
  
  // CRITICAL FIX: PRIORITY 1 - Handle actual deleted packages (status = 'deleted')
  if (status === 'deleted') {
    backgroundColor = 'rgba(128, 128, 128, 0.15)';
    borderColor = '#616161';
  } else if (hasUpdates) {
    if (updateType === 'delete') {
      backgroundColor = 'rgba(244, 67, 54, 0.12)';
      borderColor = '#f44336';
      animation = `${pulseAnimation} 2s infinite`;
    } else if (updateType === 'update') {
      backgroundColor = 'rgba(255, 152, 0, 0.15)';
      borderColor = '#ff9800';
      animation = `${pulseAnimation} 2s infinite`;
    } else if (updateType === 'create') {
      backgroundColor = 'rgba(33, 150, 243, 0.12)';
      borderColor = '#2196f3';
      animation = `${slideInAnimation} 0.5s ease-out`;
    }
  } else {
    switch (status) {
      case 'approved':
        backgroundColor = 'rgba(76, 175, 80, 0.05)';
        borderColor = '#4caf50';
        break;
      case 'pending_approval':
      case 'pending':
        backgroundColor = 'rgba(255, 193, 7, 0.05)';
        borderColor = '#ffc107';
        break;
      case 'rejected':
        backgroundColor = 'rgba(244, 67, 54, 0.05)';
        borderColor = '#f44336';
        break;
      default:
        backgroundColor = 'rgba(255, 193, 7, 0.05)';
        borderColor = '#ffc107';
    }
  }
  
  return {
    backgroundColor,
    borderLeft: (hasUpdates || status === 'deleted') ? `4px solid ${borderColor}` : `2px solid transparent`,
    animation: hasUpdates ? animation : 'none',
    position: 'relative',
    opacity: status === 'deleted' ? 0.7 : 1,
    '&::before': hasUpdates ? {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '2px',
      backgroundColor: borderColor,
      animation: `${pulseAnimation} 2s infinite`
    } : {},
    '&:hover': {
      backgroundColor: status === 'deleted'
        ? 'rgba(128, 128, 128, 0.25)'
        : hasUpdates 
        ? (updateType === 'update' ? 'rgba(255, 152, 0, 0.25)' : 
           updateType === 'delete' ? 'rgba(244, 67, 54, 0.20)' : 
           updateType === 'create' ? 'rgba(33, 150, 243, 0.20)' : 'rgba(255, 193, 7, 0.15)')
        : status === 'approved' 
        ? 'rgba(76, 175, 80, 0.15)' 
        : status === 'rejected' 
        ? 'rgba(244, 67, 54, 0.15)'
        : 'rgba(255, 193, 7, 0.15)',
      transform: status === 'deleted' ? 'none' : 'translateY(-1px)',
      boxShadow: status === 'deleted' 
        ? 'none'
        : hasUpdates 
        ? `0 8px 24px rgba(255, 152, 0, 0.3)`
        : '0 4px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.2s ease-in-out'
    }
  };
});

const UpdateBadge = styled(Badge)(({ theme, updatetype }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: updatetype === 'update' ? '#ff9800' : 
                     updatetype === 'delete' ? '#f44336' : 
                     updatetype === 'create' ? '#2196f3' : '#9c27b0',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.7rem',
    animation: updatetype !== 'create' ? `${pulseAnimation} 2s infinite` : 'none',
    minWidth: '28px',
    height: '20px',
    padding: '0 6px'
  }
}));

// Mock data and functions for demo
const mockPackages = [
  {
    _id: '1',
    packageName: 'Golden Packages',
    packageId: 'PKG_001',
    status: 'deleted', // This is the key issue - this should show as DELETED
    packageDescription: 'Root Cause Analysis: Priority Logic Issue: The...',
    packageType: 'festival',
    targetAudience: 'Women',
    totalPrice: 28720,
    totalDuration: 180,
    packageLocation: 'both',
    availabilityStatus: 'Available', // This should be "No Longer Available"
    serviceProviderId: 'SP002',
    serviceProvider: { businessName: 'Beauty Salon' },
    firstSubmittedAt: '2025-07-27T06:24:00.000Z',
    firstApprovedAt: '2025-07-27T06:25:00.000Z',
    lastUpdatedAt: '2025-07-27T06:26:00.000Z',
    deletedAt: '2025-07-27T06:27:00.000Z',
    pendingChanges: null, // No pending changes - it's actually deleted
    adminActionTaken: true
  },
  {
    _id: '2',
    packageName: 'Bridal Package Deluxe',
    packageId: 'PKG_002',
    status: 'approved',
    packageDescription: 'Complete bridal makeover package...',
    packageType: 'bridal',
    targetAudience: 'Women',
    totalPrice: 45000,
    totalDuration: 240,
    packageLocation: 'both',
    availabilityStatus: 'Available',
    serviceProviderId: 'SP001',
    serviceProvider: { businessName: 'Elite Beauty' },
    firstSubmittedAt: '2025-07-26T06:24:00.000Z',
    firstApprovedAt: '2025-07-26T08:25:00.000Z',
    lastUpdatedAt: null,
    deletedAt: null,
    pendingChanges: null,
    adminActionTaken: true
  },
  {
    _id: '3',
    packageName: 'Party Makeup Special',
    packageId: null,
    status: 'pending_approval',
    packageDescription: 'Evening party makeup with glamorous look...',
    packageType: 'party',
    targetAudience: 'Women',
    totalPrice: 15000,
    totalDuration: 120,
    packageLocation: 'salon_only',
    availabilityStatus: 'Available',
    serviceProviderId: 'SP003',
    serviceProvider: { businessName: 'Glow Studio' },
    firstSubmittedAt: '2025-07-27T05:24:00.000Z',
    firstApprovedAt: null,
    lastUpdatedAt: null,
    deletedAt: null,
    pendingChanges: {
      requestType: 'delete',
      submittedAt: '2025-07-27T06:00:00.000Z',
      reason: 'Provider requested deletion'
    },
    adminActionTaken: false
  }
];

const PackageManagementAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [packages, setPackages] = useState(mockPackages);
  const [pendingPackages, setPendingPackages] = useState(mockPackages.filter(p => p.status !== 'deleted'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState({ open: false, item: null, type: '' });
  const [currentTab, setCurrentTab] = useState(0);
  const [expandedRows, setExpandedRows] = useState({});
  const [rejectDialog, setRejectDialog] = useState({ open: false, packageId: null, reason: '' });

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

  const hasUpdates = (pkg) => {
    return pkg.pendingChanges && (
      pkg.pendingChanges.requestType === 'update' || 
      pkg.pendingChanges.requestType === 'delete' ||
      pkg.pendingChanges.requestType === 'create'
    );
  };

  const getUpdateType = (pkg) => {
    if (pkg.pendingChanges) {
      return pkg.pendingChanges.requestType;
    }
    return null;
  };

  const needsAdminAction = (pkg) => {
    // CRITICAL FIX: Deleted packages don't need admin action
    if (pkg.status === 'deleted') {
      console.log('❌ Package is deleted, no admin action needed:', pkg.packageName);
      return false;
    }
    
    if (pkg.adminActionTaken === true) {
      console.log('✅ Admin action already taken for package:', pkg.packageName);
      return false;
    }
    
    const needsAction = (
      (pkg.status === 'pending_approval' && !pkg.firstApprovedAt) ||
      (pkg.pendingChanges && pkg.pendingChanges.requestType && (
        pkg.pendingChanges.requestType === 'create' ||
        pkg.pendingChanges.requestType === 'update' ||
        pkg.pendingChanges.requestType === 'delete'
      ))
    );

    console.log('🔍 Admin action needed for package:', pkg.packageName, needsAction);
    return needsAction;
  };

  // CRITICAL FIX: Enhanced status display with PRIORITY 1 for deleted packages
  const getStatusDisplay = (pkg) => {
    console.log('🔍 getStatusDisplay - Package analysis:', {
      packageName: pkg.packageName,
      status: pkg.status,
      pendingChanges: pkg.pendingChanges?.requestType,
      deletedAt: pkg.deletedAt
    });

    // CRITICAL FIX: PRIORITY 1 - Check if package is actually deleted (status = 'deleted')
    if (pkg.status === 'deleted') {
      console.log('✅ Displaying DELETED status for:', pkg.packageName);
      return (
        <Chip 
          icon={<BlockIcon />} 
          label="DELETED" 
          sx={{ 
            fontWeight: 'bold',
            backgroundColor: '#616161',
            color: 'white',
            '& .MuiChip-icon': {
              color: 'white'
            }
          }}
        />
      );
    }

    // PRIORITY 2: Check if package has pending deletion request
    if (pkg.pendingChanges?.requestType === 'delete') {
      console.log('⚠️ Displaying DELETION PENDING for:', pkg.packageName);
      return (
        <UpdateBadge badgeContent="DEL" updatetype="delete">
          <Chip 
            icon={<WarningIcon />} 
            label="Deletion Pending" 
            color="error" 
            size="small"
            sx={{ 
              animation: `${pulseAnimation} 2s infinite`,
              backgroundColor: 'rgba(244, 67, 54, 0.15)',
              fontWeight: 'bold'
            }}
          />
        </UpdateBadge>
      );
    }

    // PRIORITY 3: Check other pending changes
    if (pkg.pendingChanges) {
      const requestType = pkg.pendingChanges.requestType;
      
      if (requestType === 'update') {
        console.log('🔄 Displaying UPDATE PENDING for:', pkg.packageName);
        return (
          <UpdateBadge badgeContent="UPD" updatetype="update">
            <Chip 
              icon={<UpdateIcon />} 
              label="Update Pending" 
              color="warning" 
              size="small"
              sx={{ 
                animation: `${pulseAnimation} 2s infinite`,
                backgroundColor: 'rgba(255, 152, 0, 0.15)'
              }}
            />
          </UpdateBadge>
        );
      } else if (requestType === 'create') {
        console.log('🆕 Displaying CREATION PENDING for:', pkg.packageName);
        return (
          <UpdateBadge badgeContent="NEW" updatetype="create">
            <Chip 
              icon={<NewIcon />} 
              label="Creation Pending" 
              color="info" 
              size="small"
              sx={{ 
                backgroundColor: 'rgba(33, 150, 243, 0.15)'
              }}
            />
          </UpdateBadge>
        );
      }
    }
    
    // PRIORITY 4: Regular status handling
    console.log('📝 Displaying regular status for:', pkg.packageName, pkg.status);
    switch (pkg.status) {
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

  // CRITICAL FIX: Get proper availability status with PRIORITY 1 for deleted packages
  const getAvailabilityStatus = (pkg) => {
    console.log('🔍 getAvailabilityStatus - Package analysis:', {
      packageName: pkg.packageName,
      status: pkg.status,
      pendingChanges: pkg.pendingChanges?.requestType,
      availabilityStatus: pkg.availabilityStatus
    });

    // CRITICAL FIX: PRIORITY 1 - Package is deleted
    if (pkg.status === 'deleted') {
      console.log('✅ Displaying NO LONGER AVAILABLE for deleted package:', pkg.packageName);
      return (
        <Chip 
          label="No Longer Available" 
          sx={{ 
            fontWeight: 'bold',
            backgroundColor: '#616161',
            color: 'white'
          }}
        />
      );
    }
    
    // PRIORITY 2: Package has pending deletion request
    if (pkg.pendingChanges?.requestType === 'delete') {
      console.log('⚠️ Displaying PENDING DELETION for:', pkg.packageName);
      return (
        <Chip 
          label="Pending Deletion" 
          color="error" 
          size="small" 
          sx={{ 
            animation: `${pulseAnimation} 2s infinite`,
            fontWeight: 'bold',
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            color: '#d32f2f'
          }}
        />
      );
    }
    
    // PRIORITY 3: Regular availability status
    const status = pkg.availabilityStatus || 'Available';
    console.log('📝 Displaying regular availability for:', pkg.packageName, status);
    return (
      <Chip 
        label={status} 
        color={status === 'Available' ? 'success' : 'warning'} 
        size="small" 
      />
    );
  };

  // FIXED: Enhanced Component: Request Type Display with PRIORITY 1 for deleted packages
  const RequestTypeDisplay = ({ pkg }) => {
    console.log('🔍 RequestTypeDisplay - Package status analysis:', {
      packageName: pkg.packageName,
      status: pkg.status,
      pendingChanges: pkg.pendingChanges?.requestType,
      deletedAt: pkg.deletedAt,
      packageId: pkg.packageId
    });

    // CRITICAL FIX: PRIORITY 1 - Handle actually deleted packages (status = 'deleted')
    if (pkg.status === 'deleted') {
      console.log('✅ Showing DELETED status for package:', pkg.packageName);
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          p: 1.5,
          bgcolor: '#f5f5f5',
          borderRadius: 2,
          border: '3px solid #616161',
          opacity: 0.8
        }}>
          <BlockIcon sx={{ color: '#616161', fontSize: 24 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ 
              fontWeight: 'bold', 
              color: '#616161',
              fontSize: '0.9rem'
            }}>
              PACKAGE DELETED
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              Package no longer available
            </Typography>
          </Box>
          <Chip 
            label="FINAL" 
            size="small" 
            sx={{ 
              fontSize: '0.65rem', 
              height: 20, 
              fontWeight: 'bold',
              backgroundColor: '#616161',
              color: 'white'
            }}
          />
        </Box>
      );
    }

    // PRIORITY 2: Handle pending deletion requests (pendingChanges.requestType = 'delete')
    if (pkg.pendingChanges?.requestType === 'delete') {
      console.log('⚠️ Showing PENDING DELETION for package:', pkg.packageName);
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          p: 1.5,
          bgcolor: '#ffebee',
          borderRadius: 2,
          border: '3px solid #f44336'
        }}>
          <DeleteIcon sx={{ color: '#f44336', fontSize: 24 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ 
              fontWeight: 'bold', 
              color: '#f44336',
              fontSize: '0.9rem'
            }}>
              DELETE REQUEST
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              Pending deletion approval
            </Typography>
          </Box>
          <Chip 
            label="HIGH" 
            size="small" 
            color="error"
            sx={{ fontSize: '0.65rem', height: 20, fontWeight: 'bold' }}
          />
        </Box>
      );
    }

    // PRIORITY 3: Handle other request types
    if (!pkg.pendingChanges?.requestType) {
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          p: 1,
          bgcolor: '#f3e5f5',
          borderRadius: 2,
          border: '2px solid #9c27b0'
        }}>
          <PendingIcon sx={{ color: '#9c27b0', fontSize: 20 }} />
          <Box>
            <Typography variant="subtitle2" sx={{ 
              fontWeight: 'bold', 
              color: '#9c27b0',
              fontSize: '0.85rem'
            }}>
              STANDARD APPROVAL
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
              Regular package approval
            </Typography>
          </Box>
        </Box>
      );
    }

    const requestType = pkg.pendingChanges.requestType;
    
    const configs = {
      create: {
        icon: NewIcon,
        label: 'NEW PACKAGE',
        description: 'First-time submission',
        color: '#2196f3',
        bgColor: '#e3f2fd',
        priority: 'HIGH',
        priorityColor: 'error'
      },
      update: {
        icon: EditIcon,
        label: 'UPDATE REQUEST',
        description: 'Existing package modification',
        color: '#ff9800',
        bgColor: '#fff3e0',
        priority: 'MEDIUM',
        priorityColor: 'warning'
      }
    };

    const config = configs[requestType] || configs.create;
    const IconComponent = config.icon;

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 200 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          p: 1.5,
          bgcolor: config.bgColor,
          borderRadius: 2,
          border: `3px solid ${config.color}`,
          animation: requestType !== 'create' ? `${pulseAnimation} 2s infinite` : 'none'
        }}>
          <IconComponent sx={{ color: config.color, fontSize: 24 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2" sx={{ 
              fontWeight: 'bold', 
              color: config.color,
              fontSize: '0.9rem'
            }}>
              {config.label}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {config.description}
            </Typography>
          </Box>
          <Chip 
            label={config.priority} 
            size="small" 
            color={config.priorityColor}
            sx={{ fontSize: '0.65rem', height: 20, fontWeight: 'bold' }}
          />
        </Box>
      </Box>
    );
  };

  const handleLogout = () => {
    alert('Logout functionality - would redirect to admin login');
  };

  const filterItems = (items, searchField) => {
    return items.filter(item =>
      item[searchField]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.serviceProvider && typeof item.serviceProvider === 'object' && 
       item.serviceProvider.businessName?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const handleViewDetails = (item, type) => {
    setDetailsDialog({ open: true, item, type });
  };

  const handleExpandClick = (packageId) => {
    setExpandedRows(prev => ({
      ...prev,
      [packageId]: !prev[packageId]
    }));
  };

  const handlePackageAction = async (packageId, action, reason = '') => {
    alert(`Demo: Would ${action} package ${packageId} with reason: ${reason}`);
  };

  const fetchPackageData = () => {
    alert('Demo: Would refresh package data from server');
  };

  // FIXED: Enhanced Summary Cards with proper deletion counting
  const RequestTypeSummaryCards = ({ packages }) => {
    const summary = {
      create: packages.filter(p => p.pendingChanges?.requestType === 'create').length,
      update: packages.filter(p => p.pendingChanges?.requestType === 'update').length,
      delete: packages.filter(p => p.pendingChanges?.requestType === 'delete').length,
      regular: packages.filter(p => !p.pendingChanges && p.status === 'pending_approval').length,
      actuallyDeleted: packages.filter(p => p.status === 'deleted').length // Count actually deleted packages
    };
    
    const totalPending = summary.create + summary.update + summary.delete + summary.regular;
    
    console.log('📊 Summary breakdown:', summary);
    
    return (
      <Box sx={{ mb: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle sx={{ fontWeight: 'bold' }}>
            📋 Admin Action Required: {totalPending} Total Requests Pending
            {summary.actuallyDeleted > 0 && ` | ${summary.actuallyDeleted} Packages Deleted`}
          </AlertTitle>
          <Typography variant="body2">
            Review and take action on pending package requests. Each request type has different implications for Package ID management.
            {summary.actuallyDeleted > 0 && ` ${summary.actuallyDeleted} packages have been deleted and are no longer available.`}
          </Typography>
        </Alert>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ 
              backgroundColor: '#f5f5f5', 
              borderLeft: '4px solid #616161',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }
            }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <BlockIcon sx={{ color: '#616161', fontSize: 28 }} />
                  <Typography variant="h4" sx={{ 
                    fontWeight: 'bold', 
                    color: '#616161' 
                  }}>
                    {summary.actuallyDeleted}
                  </Typography>
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  🚫 Deleted Packages
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  No longer available
                </Typography>
                {summary.actuallyDeleted > 0 && (
                  <Chip 
                    label="ARCHIVED" 
                    size="small" 
                    sx={{ 
                      fontWeight: 'bold', 
                      fontSize: '0.7rem',
                      backgroundColor: '#616161',
                      color: 'white'
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderPackagesTable = (packagesData, showActions = false) => {
    const filteredPackages = filterItems(packagesData, 'packageName');
    
    console.log(`📊 Rendering table for ${filteredPackages.length} packages, showActions: ${showActions}`);
    
    return (
      <StyledTableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <HeaderCell>Package Details</HeaderCell>
              <HeaderCell>Package ID</HeaderCell>
              <HeaderCell>Type & Audience</HeaderCell>
              <HeaderCell>Pricing & Duration</HeaderCell>
              <HeaderCell>First Submitted</HeaderCell>
              <HeaderCell>First Approved</HeaderCell>
              <HeaderCell>Last Updated</HeaderCell>
              <HeaderCell>Availability Status</HeaderCell>
              <HeaderCell>Status</HeaderCell>
              <HeaderCell align="center">Actions</HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPackages.map((pkg) => {
              const isExpanded = expandedRows[pkg._id];
              const packageHasUpdates = hasUpdates(pkg);
              const updateType = getUpdateType(pkg);
              const isDeleted = pkg.status === 'deleted';
              const showActionButtons = showActions && needsAdminAction(pkg);
              
              console.log(`📦 Rendering package: ${pkg.packageName}`, {
                status: pkg.status,
                isDeleted,
                pendingChanges: pkg.pendingChanges?.requestType,
                showActionButtons,
                needsAction: needsAdminAction(pkg)
              });
              
              return (
                <React.Fragment key={pkg._id}>
                  <StyledTableRow 
                    status={pkg.status}
                    hasUpdates={packageHasUpdates}
                    updateType={updateType}
                    isDeleted={isDeleted}
                    selected={selectedItemId === pkg._id}
                    onClick={() => setSelectedItemId(pkg._id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {/* Package Details Column */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" sx={{ 
                            fontWeight: 700, 
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
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {pkg.packageDescription ? 
                              `${pkg.packageDescription.substring(0, 60)}${pkg.packageDescription.length > 60 ? '...' : ''}` 
                              : 'No description'
                            }
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip icon={<AudienceIcon />} label={pkg.targetAudience} size="small" variant="outlined" />
                            <Chip icon={<LocationIcon />} label={pkg.packageLocation} size="small" variant="outlined" />
                            {pkg.packageId && (
                              <Tooltip title={`Package ID ${pkg.packageId} is permanent and never changes`}>
                                <Chip 
                                  icon={<HistoryIcon />} 
                                  label={`ID: ${pkg.packageId}`}
                                  size="small" 
                                  color={isDeleted ? "default" : "success"}
                                  variant="outlined"
                                />
                              </Tooltip>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Package ID Column */}
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

                    {/* Type & Audience */}
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

                    {/* Pricing & Duration */}
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

                    {/* First Submitted */}
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(pkg.firstSubmittedAt || pkg.createdAt)}
                      </Typography>
                    </TableCell>

                    {/* First Approved */}
                    <TableCell>
                      <Typography variant="body2" sx={{ 
                        color: pkg.firstApprovedAt ? '#4caf50' : 'text.secondary',
                        fontWeight: pkg.firstApprovedAt ? 600 : 400
                      }}>
                        {formatDate(pkg.firstApprovedAt)}
                      </Typography>
                    </TableCell>

                    {/* Last Updated */}
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

                    {/* CRITICAL FIX: Availability Status Column */}
                    <TableCell>
                      {getAvailabilityStatus(pkg)}
                    </TableCell>

                    {/* CRITICAL FIX: Status Column */}
                    <TableCell>
                      {getStatusDisplay(pkg)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExpandClick(pkg._id);
                            }}
                            sx={{ color: '#003047' }}
                          >
                            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                          
                          <IconButton 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(pkg, 'package');
                            }}
                            sx={{ color: '#003047' }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Box>
                        
                        {showActionButtons && (
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 140 }}>
                            <Tooltip title={`Approve ${pkg.pendingChanges?.requestType || 'package'} - Package ID will be preserved`}>
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                startIcon={<ApproveIcon />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePackageAction(pkg._id, 'approve');
                                }}
                                disabled={loading}
                                sx={{
                                  fontSize: '0.75rem',
                                  py: 0.8,
                                  px: 1.5,
                                  fontWeight: 'bold',
                                  animation: packageHasUpdates ? `${pulseAnimation} 2s infinite` : 'none',
                                  '&:hover': {
                                    transform: 'scale(1.05)'
                                  }
                                }}
                              >
                                Approve {pkg.pendingChanges?.requestType === 'create' ? 'New' : 
                                         pkg.pendingChanges?.requestType === 'update' ? 'Changes' : 
                                         pkg.pendingChanges?.requestType === 'delete' ? 'Deletion' : 'Package'}
                              </Button>
                            </Tooltip>
                            
                            <Tooltip title={`Reject ${pkg.pendingChanges?.requestType || 'package'}`}>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<RejectIcon />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setRejectDialog({ open: true, packageId: pkg._id, reason: '' });
                                }}
                                disabled={loading}
                                sx={{
                                  fontSize: '0.75rem',
                                  py: 0.8,
                                  px: 1.5,
                                  fontWeight: 'bold',
                                  '&:hover': {
                                    transform: 'scale(1.05)'
                                  }
                                }}
                              >
                                Reject
                              </Button>
                            </Tooltip>
                            
                            {(pkg.pendingChanges?.requestType === 'create' || pkg.pendingChanges?.requestType === 'delete') && (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'center' }}>
                                <PriorityIcon sx={{ fontSize: 12, color: '#f44336' }} />
                                <Typography variant="caption" sx={{ 
                                  fontSize: '0.65rem', 
                                  color: '#f44336',
                                  fontWeight: 'bold'
                                }}>
                                  HIGH PRIORITY
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        )}
                        
                        {/* Show message for deleted packages */}
                        {isDeleted && (
                          <Typography variant="caption" sx={{ 
                            color: '#9e9e9e', 
                            fontStyle: 'italic',
                            fontSize: '0.7rem',
                            textAlign: 'center'
                          }}>
                            Package deleted<br/>No actions available
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                  </StyledTableRow>

                  {/* Expanded Details Row */}
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2, p: 2, backgroundColor: 'white', borderRadius: 2 }}>
                          <Typography variant="h6" gutterBottom sx={{ color: '#003047', fontWeight: 600 }}>
                            📋 Complete Package Details {isDeleted && '- DELETED PACKAGE'}
                          </Typography>
                          
                          {pkg.packageId && (
                            <Alert severity={isDeleted ? "error" : "success"} sx={{ mb: 2 }}>
                              <Typography variant="body2">
                                <strong>🔒 Package ID: {pkg.packageId}</strong> - This ID is permanent and will never change{isDeleted ? ', even after deletion' : ''}. 
                                {isDeleted ? ' Package is preserved for audit trail.' : ' Consistent tracking throughout the package lifecycle.'}
                              </Typography>
                            </Alert>
                          )}

                          {/* CRITICAL: Show deletion status clearly */}
                          {pkg.status === 'deleted' && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                              <Typography variant="body2">
                                <strong>🗑️ PACKAGE DELETED:</strong> This package has been permanently deleted on {formatDate(pkg.deletedAt)}. 
                                Package ID <strong>{pkg.packageId}</strong> is preserved for audit trail. The package is no longer available for booking.
                              </Typography>
                            </Alert>
                          )}

                          {pkg.pendingChanges?.requestType === 'delete' && (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                              <Typography variant="body2">
                                <strong>⚠️ DELETION PENDING:</strong> This package is awaiting admin approval for deletion. 
                                Package ID <strong>{pkg.packageId}</strong> will be preserved for audit trail.
                              </Typography>
                            </Alert>
                          )}

                          {/* Request Type Display */}
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ color: '#003047', fontWeight: 600 }}>
                              📋 Request Type Analysis
                            </Typography>
                            <RequestTypeDisplay pkg={pkg} />
                          </Box>
                          
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Card variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#003047' }}>
                                  📦 Basic Information
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                  <Typography variant="body2">
                                    <strong>Package Name:</strong> {pkg.packageName}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Package Type:</strong> {pkg.packageType}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Target Audience:</strong> {pkg.targetAudience}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Location:</strong> {pkg.packageLocation}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Description:</strong> {pkg.packageDescription || 'No description provided'}
                                  </Typography>
                                  <Typography variant="body2" sx={{ 
                                    color: pkg.status === 'deleted' ? '#f44336' : 'text.primary',
                                    fontWeight: pkg.status === 'deleted' ? 'bold' : 'normal'
                                  }}>
                                    <strong>Current Status:</strong> {
                                      pkg.status === 'deleted' ? '🗑️ DELETED - No longer available' :
                                      pkg.pendingChanges?.requestType === 'delete' ? '⚠️ Pending deletion' :
                                      pkg.status
                                    }
                                  </Typography>
                                </Box>
                              </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                              <Card variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#003047' }}>
                                  💰 Pricing & Duration
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                  <Typography variant="body2">
                                    <strong>Total Price:</strong> LKR {pkg.totalPrice?.toLocaleString()}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>Duration:</strong> {pkg.totalDuration} minutes
                                  </Typography>
                                  <Typography variant="body2" sx={{ 
                                    color: pkg.status === 'deleted' ? '#f44336' : 
                                           pkg.pendingChanges?.requestType === 'delete' ? '#ff9800' : '#4caf50',
                                    fontWeight: 'bold'
                                  }}>
                                    <strong>Availability:</strong> {
                                      pkg.status === 'deleted' ? '❌ No Longer Available' :
                                      pkg.pendingChanges?.requestType === 'delete' ? '⚠️ Pending Deletion' :
                                      '✅ Available for booking'
                                    }
                                  </Typography>
                                </Box>
                              </Card>
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
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
             BeautiQ Admin - CRITICAL FIX: Deleted Package Status Display
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

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#003047', fontWeight: 800, mb: 1 }}>
            CRITICAL FIX: Deleted Package Status Display
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#666', mb: 2 }}>
            Fixed the core issue where deleted packages were showing "Pending" instead of "Deleted".
          </Typography>
          
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle sx={{ fontWeight: 'bold' }}>🚨 CRITICAL FIXES APPLIED</AlertTitle>
            <Typography variant="body2">
              <strong>Root cause identified and fixed:</strong>
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2, mt: 1 }}>
              <li><strong>Priority Logic:</strong> Added PRIORITY 1 check for status === 'deleted' in all display functions</li>
              <li><strong>Data Filtering:</strong> Removed deleted packages from pending packages list</li>
              <li><strong>Console Logging:</strong> Added extensive logging to track package status processing</li>
              <li><strong>Status Functions:</strong> Fixed getStatusDisplay() and getAvailabilityStatus() priority order</li>
              <li><strong>Visual Indicators:</strong> Proper gray styling and "DELETED" labels for deleted packages</li>
            </Box>
          </Alert>
          
          <Alert severity="success" sx={{ mb: 2 }}>
            <AlertTitle sx={{ fontWeight: 'bold' }}>✅ Expected Results After Fix</AlertTitle>
            <Typography variant="body2">
              <strong>Deleted packages will now show:</strong>
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2, mt: 1 }}>
              <li><strong>Status:</strong> "DELETED" (gray chip with block icon)</li>
              <li><strong>Request Type:</strong> "PACKAGE DELETED" (gray box with "FINAL" label)</li>
              <li><strong>Visual Style:</strong> Gray row background, strikethrough text, reduced opacity</li>
              <li><strong>Actions:</strong> No action buttons, "No actions available" message</li>
              <li><strong>Filtering:</strong> Deleted packages removed from "Pending Approval" tab</li>
            </Box>
          </Alert>
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
              placeholder="Search by package name or provider..."
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
              onClick={fetchPackageData}
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
              icon={<PackageIcon />} 
              label={`All Packages (${packages.length})`} 
              iconPosition="start"
            />
            <Tab 
              icon={<Badge badgeContent={pendingPackages.filter(hasUpdates).length} color="warning">
                <PendingIcon />
              </Badge>} 
              label={`Pending Approval (${pendingPackages.length})`} 
              iconPosition="start"
            />
          </Tabs>
          
          <CardContent sx={{ p: 0 }}>
            {currentTab === 0 && renderPackagesTable(packages, false)}
            {currentTab === 1 && (
              <>
                <RequestTypeSummaryCards packages={pendingPackages} />
                {renderPackagesTable(pendingPackages, true)}
              </>
            )}
          </CardContent>
        </Card>

        {/* Rejection Dialog */}
        <Dialog 
          open={rejectDialog.open} 
          onClose={() => setRejectDialog({ open: false, packageId: null, reason: '' })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: '#d32f2f', color: 'white' }}>
            Reject Package Request
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Rejection Reason"
              value={rejectDialog.reason}
              onChange={(e) => setRejectDialog(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="Please provide a detailed reason for rejecting this package request..."
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button 
              onClick={() => setRejectDialog({ open: false, packageId: null, reason: '' })}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handlePackageAction(rejectDialog.packageId, 'reject', rejectDialog.reason)}
              variant="contained"
              color="error"
              disabled={loading || !rejectDialog.reason.trim()}
            >
              Reject Package
            </Button>
          </DialogActions>
        </Dialog>

        {/* Enhanced Details Dialog */}
        <Dialog 
          open={detailsDialog.open} 
          onClose={() => setDetailsDialog({ open: false, item: null, type: '' })}
          maxWidth="lg"
          fullWidth
        >
          <DialogTitle sx={{ 
            bgcolor: detailsDialog.item?.status === 'deleted' ? '#f44336' : '#003047', 
            color: 'white', 
            fontWeight: 700 
          }}>
            📦 Complete Package Details {detailsDialog.item?.status === 'deleted' && '- DELETED PACKAGE'}
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {detailsDialog.item && (
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Alert severity={detailsDialog.item.status === 'deleted' ? "error" : "success"} sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                      🔒 Package ID: {detailsDialog.item.packageId || 'Will be assigned on approval'}
                    </Typography>
                    <Typography variant="body2">
                      {detailsDialog.item.status === 'deleted' ? (
                        <>This package has been <strong>deleted</strong> but Package ID is <strong>preserved for audit trail</strong>. 
                        The package is no longer available for booking.</>
                      ) : (
                        <>This Package ID is <strong>permanent and will never change</strong>, ensuring consistent 
                        tracking across all updates, modifications, and the entire package lifecycle.</>
                      )}
                    </Typography>
                  </Alert>
                </Grid>

                {/* Show deletion warning for deleted packages */}
                {detailsDialog.item.status === 'deleted' && (
                  <Grid item xs={12}>
                    <Alert severity="error" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>🗑️ PACKAGE DELETED:</strong> This package was permanently deleted on {formatDate(detailsDialog.item.deletedAt)}. 
                        Package ID <strong>{detailsDialog.item.packageId}</strong> is preserved for audit purposes. 
                        The package is no longer available for new bookings.
                      </Typography>
                    </Alert>
                  </Grid>
                )}

                {/* Request Type Analysis */}
                <Grid item xs={12}>
                  <RequestTypeDisplay pkg={detailsDialog.item} />
                </Grid>

                {/* Complete package information display */}
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ 
                      fontWeight: 700, 
                      mb: 2, 
                      color: '#003047',
                      textDecoration: detailsDialog.item.status === 'deleted' ? 'line-through' : 'none'
                    }}>
                      {detailsDialog.item.packageName}
                      {detailsDialog.item.status === 'deleted' && (
                        <Typography component="span" sx={{ ml: 1, color: '#f44336', fontWeight: 'bold' }}>
                          [DELETED]
                        </Typography>
                      )}
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Package ID:</strong> {detailsDialog.item.packageId || 'Pending Assignment'}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Provider ID:</strong> {detailsDialog.item.serviceProviderId || 'Not assigned'}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Type:</strong> {detailsDialog.item.packageType}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Target Audience:</strong> {detailsDialog.item.targetAudience}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Location:</strong> {detailsDialog.item.packageLocation}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Price:</strong> LKR {detailsDialog.item.totalPrice?.toLocaleString()}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Duration:</strong> {detailsDialog.item.totalDuration} minutes
                        </Typography>
                        <Typography variant="body1" sx={{ 
                          mb: 1,
                          color: detailsDialog.item.status === 'deleted' ? '#f44336' : 'text.primary',
                          fontWeight: detailsDialog.item.status === 'deleted' ? 'bold' : 'normal'
                        }}>
                          <strong>Status:</strong> {
                            detailsDialog.item.status === 'deleted' ? 'DELETED' : detailsDialog.item.status
                          }
                        </Typography>
                        <Typography variant="body1" sx={{ 
                          mb: 1,
                          color: detailsDialog.item.status === 'deleted' ? '#f44336' : '#4caf50',
                          fontWeight: 'bold'
                        }}>
                          <strong>Availability:</strong> {
                            detailsDialog.item.status === 'deleted' ? 'No Longer Available' : 
                            (detailsDialog.item.availabilityStatus || 'Available')
                          }
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            {detailsDialog.item && needsAdminAction(detailsDialog.item) && (
              <>
                <Button 
                  onClick={() => setRejectDialog({ open: true, packageId: detailsDialog.item._id, reason: '' })}
                  variant="contained"
                  color="error"
                  startIcon={<RejectIcon />}
                  disabled={loading}
                  sx={{ mr: 1 }}
                >
                  Reject Request
                </Button>
                <Button 
                  onClick={() => handlePackageAction(detailsDialog.item._id, 'approve')}
                  variant="contained"
                  color="success"
                  startIcon={<ApproveIcon />}
                  disabled={loading}
                  sx={{ mr: 1 }}
                >
                  Approve Request
                </Button>
              </>
            )}
            <Button 
              onClick={() => setDetailsDialog({ open: false, item: null, type: '' })}
              variant="outlined"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default PackageManagementAdmin;