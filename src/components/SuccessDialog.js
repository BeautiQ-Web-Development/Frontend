import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box
} from '@mui/material';
import { CheckCircle as CheckIcon } from '@mui/icons-material';

const SuccessDialog = ({ open, onClose, message, title = "Success" }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { 
          borderRadius: 3, 
          boxShadow: '0 16px 32px rgba(0,0,0,0.2)',
          textAlign: 'center'
        }
      }}
    >
      <DialogContent sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CheckIcon 
            sx={{ 
              fontSize: 64, 
              color: '#4CAF50', 
              mb: 2,
              animation: 'pulse 2s infinite'
            }} 
          />
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#003047' }}>
            {title}
          </Typography>
          <Typography variant="body1" sx={{ color: '#666', textAlign: 'center' }}>
            {message}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: '#003047',
            '&:hover': { bgcolor: '#003047' },
            px: 4,
            py: 1,
            borderRadius: 2
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessDialog;