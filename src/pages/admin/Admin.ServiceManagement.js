// admin/Admin.ServiceManagement.js - COMPLETELY FIXED VERSION
import React, { useState, useEffect, forwardRef } from 'react';
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
  Divider,
  CircularProgress,
  Slide,
  Modal,
  Backdrop
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
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CalendarToday as DateIcon,
  Description as DescriptionIcon,
  Work as ExperienceIcon,
  Home as HomeIcon,
  Business as BusinessAddressIcon,
  Photo as PhotoIcon,
  Block as BlockIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/footer';
import AdminSidebar from '../../components/AdminSidebar';
import api, { 
  approveServiceProvider, 
  rejectServiceProvider, 
  approveProviderUpdate, 
  rejectProviderUpdate,
  rejectProvider  // Add our new smart function
} from '../../services/auth';
import { styled } from '@mui/material/styles';
import { adminServicesAPI } from '../../services/services';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
  overflow: 'auto',
  border: '1px solid rgba(7, 91, 94, 0.1)',
  '& .MuiTable-root': {
    minWidth: 1200,
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

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const ServiceManagementAdmin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Helper function to check if provider has pending updates
  const hasProviderPendingChanges = (provider) => {
    if (!provider) return false;
    
    // Check for pending approval (new registration)
    if (provider.approvalStatus === 'pending') {
      return true;
    }
    
    // Check for pending updates (profile changes or deletion request)
    return provider.pendingUpdates && provider.pendingUpdates.status === 'pending';
  };
  
  // Helper function to get the type of pending changes
  const getProviderPendingChangeType = (provider) => {
    if (!provider) return 'none';
    
    if (provider.approvalStatus === 'pending') {
      return 'registration';
    }
    
    if (provider.pendingUpdates?.status === 'pending') {
      return provider.pendingUpdates.deleteRequested ? 'deletion' : 'update';
    }
    
    return 'none';
  };
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [providerSubTab, setProviderSubTab] = useState(0);
  const [serviceSubTab, setServiceSubTab] = useState(0);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState({ open: false, item: null, type: '' });
  const [selectedProvider, setSelectedProvider] = useState(null);

  // Enhanced state for rejection dialog
  const [rejectDialog, setRejectDialog] = useState({ 
    open: false, 
    serviceId: null, 
    type: '', 
    itemData: null 
  });
  const [rejectReason, setRejectReason] = useState('');
  const [rejectionLoading, setRejectionLoading] = useState(false);

  // CRITICAL: Add processing state to prevent duplicate actions
  const [processingActions, setProcessingActions] = useState(new Set());
  
  // Add state for image preview modal
  const [imagePreview, setImagePreview] = useState({
    open: false,
    imageUrl: '',
    title: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching admin data...');
      
      const [providersRes, servicesRes, pendingServicesRes, pendingProviderUpdatesRes] = await Promise.all([
        api.get('/auth/service-providers'),
        adminServicesAPI.getAllServices(),
        adminServicesAPI.getPendingServices(),
        api.get('/auth/service-providers/pending-updates') // Get providers with pending updates
      ]);

      console.log('📊 Data received:', {
        providers: providersRes.data.providers?.length || 0,
        services: servicesRes.services?.length || 0,
        pendingServices: pendingServicesRes.pendingServices?.length || 0,
        pendingProviderUpdates: pendingProviderUpdatesRes.data.pendingUpdates?.length || 0
      });

      if (providersRes.data.success) {
        // Get all providers
        const allProviders = providersRes.data.providers || [];
        
        // Get providers with pending updates 
        const providersWithPendingUpdates = pendingProviderUpdatesRes.data.pendingUpdates || [];
        
        console.log('👥 Providers with pending updates:', providersWithPendingUpdates.length);
        
        // Combine providers data
        const combinedProviders = [...allProviders];
        
        // Update provider information with pending update status
        providersWithPendingUpdates.forEach(pendingProvider => {
          const index = combinedProviders.findIndex(p => p._id === pendingProvider._id);
          if (index !== -1) {
            combinedProviders[index] = {
              ...combinedProviders[index],
              pendingUpdates: pendingProvider.pendingUpdates
            };
          }
        });
        
        setServiceProviders(combinedProviders);
      }
      
      if (servicesRes.success) {
        const allServices = servicesRes.services || [];
        const pendingServices = pendingServicesRes.success ? pendingServicesRes.pendingServices || [] : [];
        
  const validServices = allServices.filter(service => service != null);
  const validPendingServices = pendingServices.filter(service => service != null);
        
        // Override existing services with pending updates/deletes
        const combinedServices = [...validServices];
        validPendingServices.forEach(pending => {
          const idx = combinedServices.findIndex(s => s._id === pending._id);
          if (idx !== -1) {
            combinedServices[idx] = pending;
          } else {
            combinedServices.push(pending);
          }
        });
        
  setServices(combinedServices);
        console.log(`✅ Total services loaded: ${combinedServices.length}`);
      }
      
      // Clear any selected items after refresh
      setSelectedItemId(null);
      setError('');
    } catch (error) {
      setError('Failed to fetch data');
      console.error('❌ Fetch data error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ENHANCED: Handle approval with proper state management
  const handleApproval = async (id, itemType, action) => {
    // Prevent duplicate processing
    const actionKey = `${id}_${action}`;
    if (processingActions.has(actionKey)) {
      console.log('⏳ Action already in progress, ignoring duplicate');
      return;
    }

    setProcessingActions(prev => new Set(prev).add(actionKey));
    setLoading(true);

    try {
      setLoading(true);
      console.log(`🔄 Processing ${action} for ${itemType} ${id}`);
      
      if (itemType === 'provider') {
        let endpoint = `/auth/approve-provider/${id}`;
        let requestBody = { reason: action === 'reject' ? 'Provider rejected by admin' : 'Provider approved by admin' };
        const response = await api.put(endpoint, requestBody);
        if (!response.data.success) {
          throw new Error(response.data.message || `Failed to ${action} provider`);
        }
      }
      else if (itemType === 'service') {
        // use service wrapper to call POST /services/admin/:id/approve
        const reason = 'Service approved by admin';
        await adminServicesAPI.approveService(id, reason);
      }

      // CRITICAL: Close all dialogs and clear selections BEFORE refresh
      setDetailsDialog({ open: false, item: null, type: '' });
      setSelectedItemId(null);
      setError('');
      
      // Refresh data to get updated state
      await fetchData();

      console.log(`✅ ${itemType} ${action}ed successfully`);
    } catch (error) {
      console.error(`❌ Error ${action}ing ${itemType}:`, error);
      setError(`Failed to ${action} ${itemType}: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionKey);
        return newSet;
      });
    }
  };

  // ENHANCED: Open reject dialog with item data
  const handleOpenRejectDialog = (id, itemType) => {
    // Find the item we're attempting to reject
    const itemData = itemType === 'service' 
      ? services.find(s => s._id === id)
      : serviceProviders.find(p => p._id === id);
    
    // For providers, check if there are pending updates before allowing rejection
    if (itemType === 'provider') {
      const provider = itemData;
      
      // Use our helper function to check for pending changes
      if (!hasProviderPendingChanges(provider)) {
        console.log('❌ Cannot reject provider - no pending updates or approvals', {
          providerId: id,
          businessName: provider?.businessName || provider?.fullName,
          approvalStatus: provider?.approvalStatus,
          hasPendingUpdates: !!provider?.pendingUpdates,
          pendingStatus: provider?.pendingUpdates?.status
        });
        
        // Show error message with more details
        setError(`Cannot reject ${provider?.businessName || provider?.fullName} - there are no pending updates or approval requests to reject.`);
        
        // Scroll to the error message
        setTimeout(() => {
          document.querySelector('.MuiAlert-root')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        
        return;
      }
      
      // Get the type of pending changes
      const pendingChangeType = getProviderPendingChangeType(provider);
      const isPendingApproval = pendingChangeType === 'registration';
      const hasPendingUpdates = pendingChangeType === 'update' || pendingChangeType === 'deletion';
      
      console.log('🔍 Opening reject dialog for provider:', {
        providerId: id,
        pendingChangeType,
        isPendingApproval,
        hasPendingUpdates,
        businessName: provider?.businessName || provider?.fullName
      });
    }
    
    setRejectDialog({ 
      open: true, 
      serviceId: id, 
      type: itemType,
      itemData: itemData 
    });
    setRejectReason('');
  };

  // ENHANCED: Handle rejection with comprehensive state updates
  const handleRejectWithReason = async () => {
    const trimmedReason = rejectReason.trim();
    
    if (!trimmedReason || trimmedReason.length < 10) {
      setError('Please provide a detailed reason for rejection (at least 10 characters)');
      return;
    }

    const { serviceId: rId, type: rejectType } = rejectDialog;
    
    if (!rId) {
      setError('Missing ID for the item to reject');
      console.error('❌ Missing ID in rejection dialog:', rejectDialog);
      return;
    }
    
    const actionKey = `${rId}_reject`;
    
    // Prevent duplicate processing
    if (processingActions.has(actionKey)) {
      console.log('⏳ Rejection already in progress, ignoring duplicate');
      return;
    }

    setProcessingActions(prev => new Set(prev).add(actionKey));
    setRejectionLoading(true);

    try {
      console.log(`🔄 Rejecting ${rejectType} ${rId} with reason:`, trimmedReason);
      
      if (rejectType === 'provider') {
        // Find the provider to verify it has pending changes
        const provider = serviceProviders.find(p => p._id === rId);
        
        if (!provider) {
          throw new Error(`Provider with ID ${rId} not found`);
        }
        
        if (!hasProviderPendingChanges(provider)) {
          throw new Error(`No pending updates found for provider ${provider.businessName || provider.fullName}`);
        }
        
        // Determine if this is a new registration rejection or an update rejection
        const isNewRegistration = provider.approvalStatus === 'pending';
        
        // Use our smart rejection function that handles both types of rejections
        console.log('Calling smart rejectProvider with params:', { 
          providerId: rId, 
          reason: trimmedReason,
          isNewRegistration,
          approvalStatus: provider.approvalStatus,
          hasPendingUpdates: !!provider.pendingUpdates,
          pendingStatus: provider.pendingUpdates?.status,
          deleteRequested: provider.pendingUpdates?.deleteRequested
        });
        
        await rejectProvider(rId, trimmedReason, isNewRegistration);
      }
      else if (rejectType === 'service') {
        // use service wrapper to call POST /services/admin/:id/reject
        await adminServicesAPI.rejectService(rId, trimmedReason);
      }

      // CRITICAL: Update local state immediately with optimistic updates
      if (rejectType === 'service') {
        setServices(prevServices => 
          prevServices.map(service => 
            service._id === rId 
              ? {
                  ...service,
                  status: 'rejected',
                  rejectedAt: new Date().toISOString(),
                  rejectionReason: rejectReason.trim(),
                  availabilityStatus: 'No Longer Available',
                  isActive: false,
                  // Clear pending changes if any
                  pendingChanges: null
                }
              : service
          )
        );
      } else if (rejectType === 'provider') {
        setServiceProviders(prevProviders =>
          prevProviders.map(provider =>
            provider._id === rId
              ? {
                  ...provider,
                  approvalStatus: 'rejected',
                  rejectedAt: new Date().toISOString(),
                  rejectionReason: rejectReason.trim()
                }
              : provider
          )
        );
      }

      // Close all dialogs and clear selections
      setDetailsDialog({ open: false, item: null, type: '' });
      setRejectDialog({ open: false, serviceId: null, type: '', itemData: null });
      setSelectedItemId(null);
      setRejectReason('');
      setError('');
      
      // Refresh data to ensure consistency
      await fetchData();
      
      console.log(`✅ ${rejectType} rejected successfully`);
    } catch (error) {
      console.error(`❌ Error rejecting ${rejectType}:`, error);
      
      // Provide detailed error message for better debugging
      const errorResponse = error.response?.data;
      const statusCode = error.response?.status;
      const errorMessage = errorResponse?.message || error.message;
      
      console.log('Rejection error details:', {
        statusCode,
        errorMessage,
        errorData: errorResponse,
        itemId: rId,
        rejectType
      });
      
      // Provide user-friendly error message based on status code
      if (statusCode === 400) {
        setError(`Validation error: ${errorMessage}`);
      } else if (statusCode === 403) {
        setError('You don\'t have permission to perform this action');
      } else if (statusCode === 404) {
        setError(`The ${rejectType} could not be found. It may have been deleted or already processed.`);
      } else {
        setError(`Failed to reject: ${errorMessage}`);
      }
    } finally {
      setRejectionLoading(false);
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionKey);
        return newSet;
      });
    }
  };

  const handleProviderAction = async (id, action) => {
    const actionKey = `${id}_${action}`;
    if (processingActions.has(actionKey)) {
      return;
    }

    setProcessingActions(prev => new Set(prev).add(actionKey));
    
    try {
      setLoading(true);
      if (action === 'approve') {
        // Check if this is a pending profile update or deletion request
        const provider = serviceProviders.find(p => p._id === id);
        if (provider.pendingUpdates?.status === 'pending') {
          // Approve update/delete request
          await approveProviderUpdate(id);
        } else {
          // Approve new registration
          await approveServiceProvider(id);
        }
      } else {
        // Trigger rejection dialog for registration requests
        handleOpenRejectDialog(id, 'provider');
        return;
      }
      await fetchData();
    } catch (err) {
      setError(`Failed to ${action} provider`);
    } finally {
      setLoading(false);
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(actionKey);
        return newSet;
      });
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      approved: { label: 'Approved', color: 'success', icon: <ApprovedIcon /> },
      pending_approval: { label: 'Pending', color: 'warning', icon: <PendingIcon /> },
      pending: { label: 'Pending', color: 'warning', icon: <PendingIcon /> },
      rejected: { label: 'Rejected', color: 'error', icon: <RejectedIcon /> },
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

  const handleViewDetails = (item, itemType) => {
    setDetailsDialog({ open: true, item, type: itemType });
  };

  const handleSelectProvider = (prov) => {
    setSelectedProvider(prov);
    setCurrentTab(0);
    fetchData();
  };

  // Helper function to display image with proper error handling and preview functionality
  const renderImage = (imagePath, altText) => {
    if (!imagePath) return null;
    
    let imageUrl;
    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      // Check if it's a placeholder URL and use our local placeholder instead
      if (imagePath.includes('via.placeholder.com')) {
        // Extract dimensions and text from the URL
        const urlParts = imagePath.split('/');
        const dimensions = urlParts[urlParts.length - 1].split('?')[0];
        const text = (imagePath.includes('?text=') ? 
          imagePath.split('?text=')[1] : 'No+Image');
        
        // Use our local placeholder service
        imageUrl = `${baseUrl}/placeholder/${dimensions}?text=${text}`;
      } else {
        imageUrl = imagePath;
      }
    } else if (imagePath.startsWith('uploads/')) {
      // Path already has uploads prefix
      imageUrl = `${baseUrl}/${imagePath}`;
    } else if (imagePath.includes('/')) {
      // Might be a subfolder path, use as is
      imageUrl = `${baseUrl}/uploads/${imagePath}`;
    } else {
      // Just a filename - for service provider images, they're in serviceProviders folder
      // Check if this is a service provider image (contains profilePhoto, nicFrontPhoto, etc.)
      if (imagePath.includes('profilePhoto') || imagePath.includes('nicFrontPhoto') || 
          imagePath.includes('nicBackPhoto') || imagePath.includes('certificatesPhotos')) {
        imageUrl = `${baseUrl}/uploads/serviceProviders/${imagePath}`;
      } else {
        imageUrl = `${baseUrl}/uploads/${imagePath}`;
      }
    }
    
    // Function to open image in a larger preview modal
    const handleImageClick = () => {
      setImagePreview({
        open: true,
        imageUrl: imageUrl,
        title: altText
      });
    };
    
    return (
      <Card 
        sx={{ 
          maxWidth: 200, 
          mb: 2, 
          border: '1px solid #ddd',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }
        }}
        onClick={handleImageClick}
      >
        <Box sx={{ position: 'relative', height: 150, overflow: 'hidden' }}>
          <img
            src={imageUrl}
            alt={altText}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '4px 4px 0 0'
            }}
            onLoad={(e) => {
              e.target.style.border = '2px solid #4caf50';
            }}
            onError={(e) => {
              // Try alternative URL before showing error
              const originalUrl = e.target.src;
              const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
              let alternativeUrl;
              
              // If URL has api/uploads, try without api
              if (originalUrl.includes('/api/uploads/')) {
                alternativeUrl = originalUrl.replace('/api/uploads/', '/uploads/');
                e.target.src = alternativeUrl;
                return; // Give it a chance to load
              }
              // If URL has uploads/serviceProviders, try just uploads
              else if (originalUrl.includes('/uploads/serviceProviders/')) {
                const filename = originalUrl.split('/').pop();
                alternativeUrl = `${baseUrl}/uploads/${filename}`;
                e.target.src = alternativeUrl;
                return; // Give it a chance to load
              }
              // If URL is from via.placeholder.com, use our local placeholder
              else if (originalUrl.includes('via.placeholder.com')) {
                // Extract dimensions and text
                const urlParts = originalUrl.split('/');
                const dimensionsPart = urlParts[urlParts.length - 1];
                const dimensions = dimensionsPart.split('?')[0] || '300x140';
                const text = originalUrl.includes('?text=') ? 
                  originalUrl.split('?text=')[1] : 'No+Image';
                
                alternativeUrl = `${baseUrl}/placeholder/${dimensions}?text=${text}`;
                e.target.src = alternativeUrl;
                return;
              }
              
              // If we get here, show the error placeholder
              e.target.style.display = 'none';
              const errorDiv = e.target.parentElement;
              if (errorDiv && !errorDiv.querySelector('.error-placeholder')) {
                const placeholder = document.createElement('div');
                placeholder.className = 'error-placeholder';
                placeholder.style.cssText = `
                  width: 100%;
                  height: 100%;
                  background: #f5f5f5;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  color: #666;
                  text-align: center;
                  padding: 20px;
                `;
                placeholder.innerHTML = `
                  <div style="font-size: 24px; margin-bottom: 8px;">📷</div>
                  <div style="font-size: 12px;">Image not found</div>
                  <div style="font-size: 10px; margin-top: 4px;">${imagePath}</div>
                `;
                errorDiv.appendChild(placeholder);
              }
            }}
          />
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 8, 
              right: 8, 
              bgcolor: 'rgba(0,0,0,0.6)', 
              color: 'white', 
              borderRadius: '50%', 
              p: 0.5,
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ZoomInIcon fontSize="small" />
          </Box>
        </Box>
        <Box sx={{ p: 1, textAlign: 'center', bgcolor: '#f8f9fa' }}>
          <Typography variant="caption" sx={{ fontWeight: 500, color: '#003047' }}>
            {altText}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', fontSize: '0.7rem', color: '#666', mt: 0.5 }}>
            {imagePath}
          </Typography>
        </Box>
      </Card>
    );
  };

  const renderServiceProvidersTable = (items = serviceProviders) => {
    const filteredProviders = filterItems(items, 'businessName');
    
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
              <HeaderCell>Deleted At</HeaderCell>
              <HeaderCell>Deletion Reason</HeaderCell>
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
                      Experience: {provider.experience?.years || 0} years
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
                <TableCell>
                  {provider.isActive === false ? (
                    // Deleted account
                    getStatusChip('deleted')
                  ) : provider.pendingUpdates?.status === 'pending' ? (
                    <Chip
                      label={provider.pendingUpdates.deleteRequested ? 'Delete Request' : 'Update Request'}
                      color="warning"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  ) : (
                    getStatusChip(provider.approvalStatus)
                  )}
                </TableCell>
                <TableCell>
                  {provider.isActive === false && formatDate(provider.deletedAt)}
                </TableCell>
                <TableCell>
                  {provider.isActive === false && provider.deletionReason}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={(e) => { e.stopPropagation(); handleViewDetails(provider, 'provider'); }}
                    sx={{ color: '#003047' }}
                  >
                    <ViewIcon />
                  </IconButton>
                  {hasProviderPendingChanges(provider) && (
                    <>
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); handleProviderAction(provider._id, 'approve'); }}
                        sx={{ color: '#4CAF50' }}
                        disabled={processingActions.has(`${provider._id}_approve`) || loading}
                        title={provider.pendingUpdates?.status === 'pending' ? 'Approve update request' : 'Approve registration'}
                      >
                        <ApproveIcon />
                      </IconButton>
                      <IconButton
                        onClick={(e) => { e.stopPropagation(); handleOpenRejectDialog(provider._id, 'provider'); }}
                        sx={{ color: '#f44336' }}
                        disabled={processingActions.has(`${provider._id}_reject`) || loading}
                        title={provider.pendingUpdates?.status === 'pending' ? 'Reject update request' : 'Reject registration'}
                      >
                        <RejectIcon />
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

  const renderServicesTable = (items = services) => {
  const filteredServices = items ? filterItems(items.filter(service => service != null), 'name') : [];
    
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
              <HeaderCell>Last Updated</HeaderCell>
              <HeaderCell>Rejected At</HeaderCell>
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
                
                // ENHANCED: Better logic for determining actionable state
                const isRejected = service.status === 'rejected';
                const isDeleted = service.status === 'deleted';
                const isApproved = service.status === 'approved';
                const isPending = service.status === 'pending_approval';
                const hasValidPendingChanges = service.pendingChanges && 
                  ['update', 'delete', 'reactivate'].includes(service.pendingChanges.actionType);
                
                // CRITICAL: Actions only available for truly pending items
                const canTakeAction = !isRejected && !isDeleted && 
                  (isPending || hasValidPendingChanges);
                
                const isProcessing = processingActions.has(`${service._id}_approve`) || 
                                   processingActions.has(`${service._id}_reject`);
                
                // Determine highlight color for update/delete requests
                const isUpdateReq = service.pendingChanges?.actionType === 'update';
                const isDeleteReq = service.pendingChanges?.actionType === 'delete';
                const highlightBg = isUpdateReq
                  ? 'rgba(255, 193, 7, 0.15)'
                  : isDeleteReq
                    ? 'rgba(244, 67, 54, 0.15)'
                    : undefined;
                return (
                  <StyledTableRow 
                    key={service._id}
                    status={service.status}
                    selected={selectedItemId === service._id}
                    onClick={() => setSelectedItemId(service._id)}
                    sx={{ cursor: 'pointer', backgroundColor: highlightBg }}
                  >
                    <TableCell>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#8B4B9C' }}>
                        {service.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {service.description?.substring(0, 50)}...
                      </Typography>
                      {service.rejectionReason && (
                        <Typography variant="body2" color="error" sx={{ mt: 1, fontStyle: 'italic' }}>
                          Reason: {service.rejectionReason.substring(0, 60)}
                          {service.rejectionReason.length > 60 ? '...' : ''}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#003047' }}>
                        {service?.serviceId || 'Not assigned'}
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
                    <TableCell>
                      <Typography variant="body2">
                        {service?.lastUpdatedAt ? formatDate(service.lastUpdatedAt) : 'Never'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color={service.status === 'rejected' ? 'error' : 'text.secondary'}>
                        {service?.rejectedAt ? formatDate(service.rejectedAt) : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color={service?.deletedAt ? 'error' : 'text.secondary'}>
                        {service?.deletedAt ? formatDate(service.deletedAt) : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {(() => {
                        const raw = service?.availabilityStatus || 'Available';
                        const label = raw === 'No Longer Available' || service.status === 'rejected'
                          ? 'Unavailable'
                          : raw;
                        return (
                          <Chip 
                            label={label} 
                            color={label === 'Available' ? 'success' : 'error'} 
                            size="small" 
                          />
                        );
                      })()}
                    </TableCell>
                    <TableCell>{getStatusChip(service.status)}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(service, 'service');
                        }}
                        sx={{ color: '#003047' }}
                      >
                        <ViewIcon />
                      </IconButton>
                      {/* CRITICAL: Only show action buttons for truly actionable items */}
                      {canTakeAction && !isProcessing && (
                        <>
                          <IconButton 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApproval(service._id, 'service', 'approve');
                            }}
                            sx={{ color: '#4CAF50' }}
                            disabled={loading || isProcessing}
                          >
                            <ApproveIcon />
                          </IconButton>
                          <IconButton 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenRejectDialog(service._id, 'service');
                            }}
                            sx={{ color: '#f44336' }}
                            disabled={loading || isProcessing}
                          >
                            <RejectIcon />
                          </IconButton>
                        </>
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fafafa' }}>
      <AppBar position="static" sx={{ bgcolor: '#003047', boxShadow: '0 4px 12px rgba(7,91,94,0.3)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setSidebarOpen(!sidebarOpen)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: '#fafafa' }}>
             BeautiQ Admin Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#fafafa', ml: 2 }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user.fullName} ({user.role})
            </Typography>
            <Typography variant="body2">
              {new Date().toLocaleString()}
            </Typography>
          </Box>
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
            Manage service providers and services
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
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
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
          </Tabs>
          
          <CardContent sx={{ p: 0 }}>
            {currentTab === 0 && (
              <>
                <Tabs
                  value={providerSubTab}
                  onChange={(e, newValue) => setProviderSubTab(newValue)}
                  variant="fullWidth"
                  textColor="primary"
                  indicatorColor="primary"
                  sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                  {/* Only active providers in "All Providers" */}
                  <Tab label={`All Providers (${serviceProviders.filter(p => p.isActive !== false).length})`} />
                  <Tab label={`Update Requests (${serviceProviders.filter(p => p.pendingUpdates?.status === 'pending' && !p.pendingUpdates?.deleteRequested).length})`} />
                  <Tab label={`Deleted Providers (${serviceProviders.filter(p => p.isActive === false).length})`} />
                </Tabs>
                {/* Active providers only */}
                {providerSubTab === 0 && renderServiceProvidersTable(serviceProviders.filter(p => p.isActive !== false))}
                {/* Pending update requests */}
                {providerSubTab === 1 && renderServiceProvidersTable(
                  serviceProviders.filter(
                    p => p.pendingUpdates?.status === 'pending' && !p.pendingUpdates?.deleteRequested
                  )
                )}
                {/* Deleted providers */}
                {providerSubTab === 2 && renderServiceProvidersTable(
                  serviceProviders.filter(p => p.isActive === false)
                )}
              </>
            )}
            {currentTab === 1 && (
              <>
                <Tabs
                  value={serviceSubTab}
                  onChange={(e, newValue) => setServiceSubTab(newValue)}
                  variant="fullWidth"
                  textColor="primary"
                  indicatorColor="primary"
                  sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                  <Tab label={`All Details (${services.length})`} />
                  <Tab label={`Update Requests (${services.filter(s => s.pendingChanges?.actionType === 'update').length})`} />
                  <Tab label={`Delete Requests (${services.filter(s => s.pendingChanges?.actionType === 'delete').length})`} />
                </Tabs>
                {serviceSubTab === 0 && renderServicesTable()}
                {serviceSubTab === 1 && renderServicesTable(services.filter(s => s.pendingChanges?.actionType === 'update'))}
                {serviceSubTab === 2 && renderServicesTable(services.filter(s => s.pendingChanges?.actionType === 'delete'))}
              </>
            )}
          </CardContent>
        </Card>

        {/* DETAILS DIALOG */}
        <Dialog
          TransitionComponent={Transition}
          keepMounted
          open={detailsDialog.open}
          onClose={() => setDetailsDialog({ open: false, item: null, type: '' })}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
              border: '1px solid rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }
          }}
        >
          <DialogTitle
            sx={{
              background: 'linear-gradient(135deg, #075B5E 0%, #003047 100%)',
              color: 'white',
              fontSize: '1.75rem',
              fontWeight: 700,
              py: 2,
              px: 3
            }}
          >
            {detailsDialog.type === 'provider'
              ? '👤 Provider Details'
              : '🔧 Service Details'}
          </DialogTitle>
          <DialogContent
            sx={{
              backgroundColor: '#fff',
              p: 4,
              maxHeight: '70vh',
              overflowY: 'auto',
              '&::-webkit-scrollbar': { width: 6 },
              '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 3 }
            }}
          >
            
            {/* SERVICE PROVIDER DETAILS */}
            {detailsDialog.item && detailsDialog.type === 'provider' && (
              <Grid container spacing={3}>
                {/* Personal Information Section */}
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 3, mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1 }} />
                      Personal Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                          {detailsDialog.item.fullName || 'Not provided'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">NIC Number</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                          {detailsDialog.item.nicNumber || 'Not provided'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Email Address</Typography>
                        <Typography variant="body1">{detailsDialog.item.emailAddress}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Mobile Number</Typography>
                        <Typography variant="body1">{detailsDialog.item.mobileNumber || 'Not provided'}</Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                {/* Address Information Section */}
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 3, mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
                      <LocationIcon sx={{ mr: 1 }} />
                      Address Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">City</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                          {detailsDialog.item.city || 'Not provided'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <BusinessAddressIcon sx={{ mr: 1, color: '#003047' }} />
                          <Typography variant="subtitle2" color="text.secondary">Business Address</Typography>
                        </Box>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                          {detailsDialog.item.currentAddress || 'Not provided'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <HomeIcon sx={{ mr: 1, color: '#003047' }} />
                          <Typography variant="subtitle2" color="text.secondary">Home Address</Typography>
                        </Box>
                        <Typography variant="body1">
                          {detailsDialog.item.homeAddress || 'Not provided'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                {/* Business Information Section */}
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 3, mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
                      <BusinessIcon sx={{ mr: 1 }} />
                      Business Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Business Name</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                          {detailsDialog.item.businessName || 'Not provided'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Business Type</Typography>
                        <Chip 
                          label={detailsDialog.item.businessType || 'Not specified'} 
                          color="primary" 
                          size="small" 
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <ExperienceIcon sx={{ mr: 1, color: '#003047' }} />
                          <Typography variant="subtitle2" color="text.secondary">Years of Experience</Typography>
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {detailsDialog.item.experienceYears || detailsDialog.item.experience?.years || 0} years
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Provider ID</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: '#4caf50' }}>
                          {detailsDialog.item.serviceProviderId || 'Will be assigned on approval'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <DescriptionIcon sx={{ mr: 1, color: '#003047' }} />
                          <Typography variant="subtitle2" color="text.secondary">Business Description</Typography>
                        </Box>
                        <Typography variant="body1">
                          {detailsDialog.item.businessDescription || detailsDialog.item.experience?.description || 'No description provided'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>

                {/* Registration Status & Dates */}
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 3, mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
                      <DateIcon sx={{ mr: 1 }} />
                      Registration Status & Timeline
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Registration Date</Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          {formatDate(detailsDialog.item.createdAt)}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Current Status</Typography>
                        <Box sx={{ mb: 1 }}>
                          {getStatusChip(detailsDialog.item.isActive === false ? 'deleted' : detailsDialog.item.approvalStatus)}
                        </Box>
                      </Grid>
                      {detailsDialog.item.approvedAt && (
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">Approved Date</Typography>
                          <Typography variant="body1" sx={{ color: '#4caf50', fontWeight: 500 }}>
                            {formatDate(detailsDialog.item.approvedAt)}
                          </Typography>
                        </Grid>
                      )}
                      {detailsDialog.item.rejectedAt && (
                        <>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">Rejected Date</Typography>
                            <Typography variant="body1" sx={{ color: '#f44336', fontWeight: 500 }}>
                              {formatDate(detailsDialog.item.rejectedAt)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="subtitle2" color="text.secondary">Rejection Reason</Typography>
                            <Typography variant="body1" sx={{ color: '#f44336' }}>
                              {detailsDialog.item.rejectionReason || 'No reason provided'}
                            </Typography>
                          </Grid>
                        </>
                      )}
                      {detailsDialog.item.deletedAt && (
                        <>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">Deleted Date</Typography>
                            <Typography variant="body1" sx={{ color: '#616161', fontWeight: 500 }}>
                              {formatDate(detailsDialog.item.deletedAt)}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">Deletion Reason</Typography>
                            <Typography variant="body1" sx={{ color: '#616161' }}>
                              {detailsDialog.item.deletionReason || 'No reason provided'}
                            </Typography>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Card>
                </Grid>

                {/* Document Uploads Section */}
                <Grid item xs={12}>
                  <Card variant="outlined" sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
                      <PhotoIcon sx={{ mr: 1 }} />
                      Uploaded Documents & Photos
                    </Typography>
                    
                    <Grid container spacing={3}>
                      {/* Profile Photo */}
                      {detailsDialog.item.profilePhoto && (
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                            Profile Photo
                          </Typography>
                          {renderImage(detailsDialog.item.profilePhoto, 'Profile Photo')}
                        </Grid>
                      )}
                      
                      {/* NIC Front Photo */}
                      {detailsDialog.item.nicFrontPhoto && (
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                            NIC Front Photo
                          </Typography>
                          {renderImage(detailsDialog.item.nicFrontPhoto, 'NIC Front')}
                        </Grid>
                      )}
                      
                      {/* NIC Back Photo */}
                      {detailsDialog.item.nicBackPhoto && (
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                            NIC Back Photo
                          </Typography>
                          {renderImage(detailsDialog.item.nicBackPhoto, 'NIC Back')}
                        </Grid>
                      )}
                      
                      {/* Certificate Photos */}
                      {detailsDialog.item.certificatesPhotos && detailsDialog.item.certificatesPhotos.length > 0 && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                            Experience Certificates ({detailsDialog.item.certificatesPhotos.length})
                          </Typography>
                          <Grid container spacing={2}>
                            {detailsDialog.item.certificatesPhotos.map((cert, index) => (
                              <Grid item xs={12} sm={6} md={4} key={index}>
                                {renderImage(cert, `Certificate ${index + 1}`)}
                              </Grid>
                            ))}
                          </Grid>
                        </Grid>
                      )}
                      
                      {/* No Documents Message */}
                      {!detailsDialog.item.profilePhoto && !detailsDialog.item.nicFrontPhoto && 
                       !detailsDialog.item.nicBackPhoto && (!detailsDialog.item.certificatesPhotos || detailsDialog.item.certificatesPhotos.length === 0) && (
                        <Grid item xs={12}>
                          <Alert severity="warning">
                            No documents have been uploaded by this service provider.
                          </Alert>
                        </Grid>
                      )}
                    </Grid>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* SERVICE DETAILS */}
            {detailsDialog.item && detailsDialog.type === 'service' && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ color: '#003047', fontWeight: 600, mb: 2 }}>
                    {detailsDialog.item.name}
                  </Typography>
                  {getStatusChip(detailsDialog.item.status)}
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
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                  <Typography variant="body1">{detailsDialog.item.description}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Provider</Typography>
                  <Typography variant="body1">
                    {detailsDialog.item.serviceProvider?.businessName || detailsDialog.item.serviceProvider?.fullName || 'N/A'}
                  </Typography>
                </Grid>

                {/* ENHANCED: Additional service fields */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Price Type</Typography>
                  <Typography variant="body1">LKR {detailsDialog.item.pricing?.priceType || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Experience Level</Typography>
                  <Typography variant="body1">{detailsDialog.item.experienceLevel || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Preparation Required</Typography>
                  <Typography variant="body1">{detailsDialog.item.preparationRequired || 'None'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Custom Notes</Typography>
                  <Typography variant="body1">{detailsDialog.item.customNotes || 'None'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Cancellation Policy</Typography>
                  <Typography variant="body1">{detailsDialog.item.cancellationPolicy || 'Standard'}</Typography>
                </Grid>

                {detailsDialog.item.rejectionReason && (
                  <Grid item xs={12}>
                    <Alert severity="error" sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">Rejection Reason</Typography>
                      <Typography variant="body2">{detailsDialog.item.rejectionReason}</Typography>
                    </Alert>
                  </Grid>
                )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 3, bgcolor: '#f5f5f5' }}>
            {/* CRITICAL: Only show action buttons for pending items */}
            {detailsDialog.type === 'provider' && hasProviderPendingChanges(detailsDialog.item) && (
              <>
                <Button 
                  onClick={() => handleOpenRejectDialog(detailsDialog.item._id, 'provider')}
                  variant="contained"
                  color="error"
                  startIcon={<RejectIcon />}
                  disabled={loading || processingActions.has(`${detailsDialog.item._id}_reject`)}
                  sx={{ mr: 1 }}
                >
                  {detailsDialog.item.pendingUpdates?.status === 'pending' ? 
                    (detailsDialog.item.pendingUpdates?.deleteRequested ? 'Reject Deletion' : 'Reject Updates') : 
                    'Reject Registration'}
                </Button>
                <Button 
                  onClick={() => handleProviderAction(detailsDialog.item._id, 'approve')}
                  variant="contained"
                  color="success"
                  startIcon={<ApproveIcon />}
                  disabled={loading || processingActions.has(`${detailsDialog.item._id}_approve`)}
                  sx={{ mr: 1 }}
                >
                  {detailsDialog.item.pendingUpdates?.status === 'pending' ? 
                    (detailsDialog.item.pendingUpdates?.deleteRequested ? 'Approve Deletion' : 'Approve Updates') : 
                    'Approve Registration'}
                </Button>
              </>
            )}
            
            {/* CRITICAL: Only show action buttons for actionable services */}
            {detailsDialog.item && detailsDialog.type === 'service' && 
             detailsDialog.item.status !== 'rejected' && 
             detailsDialog.item.status !== 'deleted' && 
             (detailsDialog.item.status === 'pending_approval' || detailsDialog.item.pendingChanges) && (
              <>
                <Button 
                  onClick={() => handleOpenRejectDialog(detailsDialog.item._id, 'service')}
                  variant="contained"
                  color="error"
                  startIcon={<RejectIcon />}
                  disabled={loading || processingActions.has(`${detailsDialog.item._id}_reject`)}
                  sx={{ mr: 1 }}
                >
                  Reject
                </Button>
                <Button 
                  onClick={() => handleApproval(detailsDialog.item._id, detailsDialog.type, 'approve')}
                  variant="contained"
                  color="success"
                  startIcon={<ApproveIcon />}
                  disabled={loading || processingActions.has(`${detailsDialog.item._id}_approve`)}
                  sx={{ mr: 1 }}
                >
                  Approve
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
        
        {/* ENHANCED Rejection Dialog */}
        <Dialog
          open={rejectDialog.open}
          onClose={() => setRejectDialog({ open: false, serviceId: null, type: '', itemData: null })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: '#f44336', color: 'white' }}>
            Reject {rejectDialog.type === 'service' ? 'Service' : 'Provider'}
          </DialogTitle>
          {rejectDialog.itemData && (
            <Box sx={{ px: 3, pt: 1, pb: 0 }}>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, fontWeight: 'bold' }}>
                {rejectDialog.type === 'service' 
                  ? rejectDialog.itemData.name 
                  : rejectDialog.itemData.businessName || rejectDialog.itemData.fullName}
              </Typography>
            </Box>
          )}
          <DialogContent sx={{ pt: 3 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Please provide a detailed reason for rejection. This will be sent to the service provider.
            </Typography>
            <TextField
              autoFocus
              label="Rejection Reason"
              fullWidth
              multiline
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              error={rejectReason.trim().length < 10}
              helperText={rejectReason.trim().length < 10 ? "Reason must be at least 10 characters" : ""}
              sx={{ mb: 2 }}
            />
            <Alert severity="info">
              A detailed rejection reason helps service providers understand what needs to be fixed.
            </Alert>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button 
              onClick={() => setRejectDialog({ open: false, serviceId: null, type: '', itemData: null })}
              color="inherit"
              disabled={rejectionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectWithReason}
              variant="contained"
              color="error"
              disabled={rejectionLoading || rejectReason.trim().length < 10}
              startIcon={rejectionLoading ? <CircularProgress size={20} /> : <RejectIcon />}
            >
              {rejectionLoading ? 'Rejecting...' : 'Reject & Notify Provider'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      
      {/* Image Preview Modal */}
      <Modal
        open={imagePreview.open}
        onClose={() => setImagePreview({ ...imagePreview, open: false })}
        aria-labelledby="image-preview-title"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 1,
            maxWidth: '90vw',
            maxHeight: '90vh',
            outline: 'none',
            overflow: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" component="h2" sx={{ p: 1 }}>
              {imagePreview.title}
            </Typography>
            <IconButton 
              onClick={() => setImagePreview({ ...imagePreview, open: false })}
              sx={{ color: 'gray' }}
            >
              <RejectIcon />
            </IconButton>
          </Box>
          
          <Box
            sx={{
              position: 'relative',
              maxWidth: '100%',
              maxHeight: 'calc(90vh - 60px)',
              overflow: 'auto',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {imagePreview.imageUrl && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  id="image-preview"
                  src={imagePreview.imageUrl}
                  alt={imagePreview.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: 'calc(90vh - 100px)',
                    objectFit: 'contain',
                  }}
                  onError={(e) => {
                    // Store the original URL for potential retry
                    const originalUrl = e.target.src;
                    const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
                    
                    // Try alternative URLs first before showing error
                    if (originalUrl.includes('/api/uploads/')) {
                      e.target.src = originalUrl.replace('/api/uploads/', '/uploads/');
                      return;
                    } 
                    else if (originalUrl.includes('/uploads/serviceProviders/')) {
                      const filename = originalUrl.split('/').pop();
                      e.target.src = `${baseUrl}/uploads/${filename}`;
                      return;
                    }
                    else if (originalUrl.includes('via.placeholder.com')) {
                      // Extract dimensions and text
                      const urlParts = originalUrl.split('/');
                      const dimensionsPart = urlParts[urlParts.length - 1];
                      const dimensions = dimensionsPart.split('?')[0] || '300x140';
                      const text = originalUrl.includes('?text=') ? 
                        originalUrl.split('?text=')[1] : 'No+Image';
                      
                      e.target.src = `${baseUrl}/placeholder/${dimensions}?text=${text}`;
                      return;
                    }
                    
                    // If we get here, all fallbacks failed
                    e.target.style.display = 'none';
                    
                    const errorContainer = document.createElement('div');
                    errorContainer.id = "image-error-container";
                    errorContainer.style.cssText = `
                      padding: 2rem;
                      text-align: center;
                      color: #d32f2f;
                      background-color: #ffebee;
                      border-radius: 8px;
                      margin: 1rem;
                      max-width: 600px;
                    `;
                    
                    // Try to get filename from URL for better display
                    const filename = originalUrl.split('/').pop();
                    
                    errorContainer.innerHTML = `
                      <div style="font-size: 1.25rem; font-weight: 500; margin-bottom: 0.5rem;">Failed to load image</div>
                      <div style="font-size: 0.875rem; color: #666;">The image could not be loaded or may be missing.</div>
                      <div style="font-size: 0.75rem; color: #999; margin-top: 0.5rem; word-break: break-all;">${filename || originalUrl}</div>
                      <div style="margin-top: 1.5rem; display: flex; justify-content: center; gap: 10px;">
                        <button id="retry-direct-btn" style="padding: 8px 16px; background-color: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer;">Try Direct Path</button>
                        <button id="retry-api-btn" style="padding: 8px 16px; background-color: #2196f3; color: white; border: none; border-radius: 4px; cursor: pointer;">Try API Path</button>
                      </div>
                    `;
                    
                    const parentElement = e.target.parentElement;
                    parentElement.appendChild(errorContainer);
                    
                    // Add event listeners for the retry buttons
                    setTimeout(() => {
                      const retryDirectBtn = document.getElementById('retry-direct-btn');
                      const retryApiBtn = document.getElementById('retry-api-btn');
                      const imgPreview = document.getElementById('image-preview');
                      const errorCont = document.getElementById('image-error-container');
                      
                      if (retryDirectBtn) {
                        retryDirectBtn.addEventListener('click', () => {
                          // Try direct uploads path
                          let newUrl;
                          if (originalUrl.includes('/api/uploads/')) {
                            newUrl = originalUrl.replace('/api/uploads/', '/uploads/');
                          } else {
                            // Extract the filename and build a direct path
                            const filename = originalUrl.split('/').pop();
                            newUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${filename}`;
                          }
                          
                          imgPreview.style.display = '';
                          imgPreview.src = newUrl;
                          errorCont.style.display = 'none';
                        });
                      }
                      
                      if (retryApiBtn) {
                        retryApiBtn.addEventListener('click', () => {
                          // Try API path
                          let newUrl;
                          if (originalUrl.includes('/uploads/')) {
                            newUrl = originalUrl.replace('/uploads/', '/api/uploads/');
                          } else {
                            // Extract the filename and build an API path
                            const filename = originalUrl.split('/').pop();
                            newUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/uploads/${filename}`;
                          }
                          
                          imgPreview.style.display = '';
                          imgPreview.src = newUrl;
                          errorCont.style.display = 'none';
                        });
                      }
                    }, 0);
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Modal>
      
      <Footer />
    </Box>
  );
};

export default ServiceManagementAdmin;