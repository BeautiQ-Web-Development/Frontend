import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Chip,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#001F3F',
  boxShadow: '0 2px 8px rgba(0, 31, 63, 0.15)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.4rem',
  color: '#FFFFFF',
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.9
  }
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: '#FFFFFF',
  fontWeight: 500,
  fontSize: '0.85rem',
  borderRadius: 6,
  padding: '6px 16px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  }
}));

const RoleChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  color: '#FFFFFF',
  fontSize: '0.7rem',
  height: 24,
  fontWeight: 500
}));

const EnhancedAppBar = ({ 
  role, 
  user, 
  onMenuClick, 
  onLogout, 
  title = "Dashboard",
  notifications = 0,
  notificationsList = []
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleNotifClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleNotificationClick = (notification) => {
    if (role === 'admin') {
      // Navigate to notifications page with the specific notification
      navigate('/admin/notifications', { 
        state: { 
          selectedNotification: notification,
          fromAppBar: true 
        } 
      });
    } else if (role === 'serviceProvider') {
      // Handle service provider notifications
      navigate('/service-provider/notifications');
    }
    handleClose();
  };

  const handleViewAllNotifications = () => {
    if (role === 'admin') {
      navigate('/admin/notifications');
    } else if (role === 'serviceProvider') {
      navigate('/service-provider/notifications');
    }
    handleClose();
  };

  const getRoleLabel = (userRole) => {
    switch (userRole) {
      case 'admin': return 'Admin';
      case 'serviceProvider': return 'Provider';
      case 'customer': return 'Customer';
      default: return 'User';
    }
  };

  return (
    <StyledAppBar position="static">
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* left side: menu, logo, title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton 
            edge="start" 
            color="inherit" 
            onClick={onMenuClick}
            sx={{ 
              color: '#FFFFFF',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <LogoText variant="h6">
            BeautiQ
          </LogoText>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
            <DashboardIcon sx={{ color: '#FFFFFF', fontSize: 20 }} />
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              fontSize: '1rem',
              color: '#FFFFFF'
            }}>
              {title}
            </Typography>
            <RoleChip label={getRoleLabel(role)} size="small" />
          </Box>
        </Box>

        {/* right side: notifications + logout */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" onClick={handleNotifClick}>
            <Badge badgeContent={notifications} color="error">
              <NotificationsIcon sx={{ color: '#FFFFFF' }} />
            </Badge>
          </IconButton>
          
          <Menu 
            anchorEl={anchorEl} 
            open={open} 
            onClose={handleClose}
            PaperProps={{
              sx: { maxWidth: 350, maxHeight: 400 }
            }}
          >
            {notificationsList.length > 0 ? (
              <>
                {notificationsList.slice(0, 5).map((notification, index) => (
                  <MenuItem 
                    key={notification.id || index} 
                    onClick={() => handleNotificationClick(notification)}
                    sx={{ 
                      whiteSpace: 'normal',
                      py: 1.5,
                      borderBottom: '1px solid rgba(0,0,0,0.1)',
                      '&:hover': { bgcolor: 'rgba(0, 31, 63, 0.05)' }
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        New Service Provider Registration
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {notification.data?.businessName || notification.data?.fullName}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
                <MenuItem 
                  onClick={handleViewAllNotifications}
                  sx={{ 
                    textAlign: 'center', 
                    fontWeight: 'bold',
                    color: 'primary.main',
                    borderTop: '1px solid rgba(0,0,0,0.1)'
                  }}
                >
                  View All Notifications ({notifications})
                </MenuItem>
              </>
            ) : (
              <MenuItem onClick={handleClose} sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No new notifications
                </Typography>
              </MenuItem>
            )}
          </Menu>

          <Typography variant="body2" sx={{ 
            color: '#FFFFFF', 
            mr: 1,
            fontSize: '0.8rem'
          }}>
            {user?.fullName || user?.businessName || 'User'}
          </Typography>
          
          <NavButton
            onClick={onLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </NavButton>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
};

export default EnhancedAppBar;
