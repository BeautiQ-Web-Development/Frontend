// components/EnhancedPackageUpdateDialog.js - Better UX for package updates
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Typography,
  Box,
  Chip,
  Divider,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton
} from '@mui/material';
import {
  Warning as WarningIcon,
  Update as UpdateIcon,
  Delete as DeleteIcon,
  Pending as PendingIcon,
  CheckCircle as CheckIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Info as InfoIcon,
  Schedule as ScheduleIcon,
  History as HistoryIcon
} from '@mui/icons-material';

const EnhancedPackageUpdateDialog = ({ 
  open, 
  onClose, 
  packageData, 
  onProceed, 
  onViewPending,
  onCancel 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!packageData || !open) return null;

  const { pendingChanges } = packageData;
  const requestType = pendingChanges?.requestType;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const renderDeletePendingDialog = () => (
    <>
      <DialogTitle sx={{ 
        bgcolor: '#ffebee', 
        color: '#d32f2f', 
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <DeleteIcon />
        Package Scheduled for Deletion
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            ⚠️ This package has a pending deletion request
          </Typography>
          <Typography variant="body2">
            This package is scheduled for deletion and cannot be modified until the admin makes a decision.
          </Typography>
        </Alert>

        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Package:</strong> {packageData.packageName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Package ID:</strong> {packageData.packageId || 'Pending'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Deletion Requested:</strong> {formatDate(pendingChanges.submittedAt)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Status:</strong> <Chip label="Awaiting Admin Decision" color="error" size="small" />
                </Typography>
              </Grid>
              {pendingChanges.reason && (
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Reason:</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    p: 2, 
                    bgcolor: '#f5f5f5', 
                    borderRadius: 1,
                    fontStyle: 'italic'
                  }}>
                    {pendingChanges.reason}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ mt: 2, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <InfoIcon color="info" />
            <strong>What happens next?</strong>
          </Typography>
          <List dense sx={{ mt: 1 }}>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <ScheduleIcon fontSize="small" color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Your package remains active and bookable until admin approval" 
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <HistoryIcon fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="Package ID will be preserved for audit trail" 
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckIcon fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="You can contact admin to cancel this deletion request" 
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          </List>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: '#fafafa' }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </>
  );

  const renderUpdatePendingDialog = () => (
    <>
      <DialogTitle sx={{ 
        bgcolor: '#fff3e0', 
        color: '#e65100', 
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <UpdateIcon />
        Package Update in Progress
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            📝 This package has pending updates awaiting approval
          </Typography>
          <Typography variant="body2">
            If you continue with a new update, your current pending changes will be replaced 
            with the new changes you submit. <strong>The same package record will be updated.</strong>
          </Typography>
        </Alert>

        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Package:</strong> {packageData.packageName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Package ID:</strong> {packageData.packageId || 'Pending'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Update Submitted:</strong> {formatDate(pendingChanges.submittedAt)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Status:</strong> <Chip label="Awaiting Admin Review" color="warning" size="small" />
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Expandable current pending changes */}
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent sx={{ pb: '16px !important' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Current Pending Changes
              </Typography>
              <IconButton
                onClick={() => setShowDetails(!showDetails)}
                size="small"
              >
                {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Box>
            
            <Collapse in={showDetails}>
              <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                {pendingChanges.reason && (
                  <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
                    Reason: {pendingChanges.reason}
                  </Typography>
                )}
                {pendingChanges.changedFields && pendingChanges.changedFields.length > 0 ? (
                  <>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      Fields being updated:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {pendingChanges.changedFields.map((field, index) => (
                        <Chip 
                          key={index} 
                          label={field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
                          size="small" 
                          variant="outlined"
                          color="warning"
                        />
                      ))}
                    </Box>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Detailed changes information not available
                  </Typography>
                )}
              </Box>
            </Collapse>
          </CardContent>
        </Card>

        <Box sx={{ mt: 2, p: 2, bgcolor: '#e8f5e8', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <HistoryIcon color="success" />
            <strong>Package ID Consistency Guaranteed</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your Package ID <strong>{packageData.packageId}</strong> will remain unchanged. 
            The system updates the existing record, ensuring data integrity and consistent tracking.
          </Typography>
        </Box>

        <Box sx={{ mt: 2, p: 2, bgcolor: '#fff3e0', borderRadius: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            What happens if you proceed?
          </Typography>
          <List dense>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <UpdateIcon fontSize="small" color="warning" />
              </ListItemIcon>
              <ListItemText 
                primary="Your current pending changes will be replaced with new changes" 
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckIcon fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText 
                primary="The live package remains unchanged until admin approves" 
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <HistoryIcon fontSize="small" color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Same Package ID preserved - no new record created" 
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <ScheduleIcon fontSize="small" color="info" />
              </ListItemIcon>
              <ListItemText 
                primary="Admin will review the new changes (not the old ones)" 
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          </List>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: '#fafafa' }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        {onViewPending && (
          <Button 
            onClick={onViewPending} 
            variant="outlined" 
            color="info"
            startIcon={<InfoIcon />}
          >
            View Current Changes
          </Button>
        )}
        <Button 
          onClick={onProceed} 
          variant="contained" 
          color="warning"
          startIcon={<UpdateIcon />}
        >
          Submit New Update
        </Button>
      </DialogActions>
    </>
  );

  // Render appropriate dialog based on request type
  if (requestType === 'delete') {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        {renderDeletePendingDialog()}
      </Dialog>
    );
  }

  if (requestType === 'update') {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        {renderUpdatePendingDialog()}
      </Dialog>
    );
  }

  // Default for any other pending changes
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ 
        bgcolor: '#e3f2fd', 
        color: '#1976d2', 
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <PendingIcon />
        Package Changes Pending
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            This package has pending changes awaiting admin approval
          </Typography>
          <Typography variant="body2">
            Please wait for admin review or contact support for more information.
          </Typography>
        </Alert>

        <Card variant="outlined">
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Package:</strong> {packageData.packageName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Package ID:</strong> {packageData.packageId || 'Pending'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Request Type:</strong>{' '}
                  <Chip 
                    label={requestType} 
                    color="info" 
                    size="small" 
                  />
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Submitted:</strong> {formatDate(pendingChanges.submittedAt)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: '#fafafa' }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EnhancedPackageUpdateDialog;