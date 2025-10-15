import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Tooltip,
  Button
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Store as ServicesIcon,
  Chat as ChatIcon,
  Analytics as PerformanceIcon,
  Payment as RentIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon,
  ExitToApp as ResignIcon,
  CardGiftcard as PackageIcon,
  Settings as SettingsIcon,
  EventNote as BookingsIcon
} from '@mui/icons-material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate, useLocation } from 'react-router-dom';

const ServiceProviderSidebar = ({ open, onClose, user, onResignation }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/service-provider-dashboard',
      description: 'Overview of bookings, income, and service status'
    },
    {
      text: 'My Services',
      icon: <ServicesIcon />,
      path: '/service-provider/my-services', // This should navigate to the buttons page
      description: 'Create and manage your services'
    },
    {
      text: 'Notifications',
      icon: <NotificationsIcon />,  // notification bell icon
      path: '/service-provider/notifications',
      description: 'View your notifications'
    },
    {
      text: 'Bookings',
      icon: <BookingsIcon />,
      path: '/service-provider/bookings',
      description: 'View and manage customer bookings'
    },
    {
      text: 'Service Management',
      icon: <PackageIcon />,
      path: '/service-provider/services', // This goes to the table view
      description: 'View and manage all services'
    },
    // {
    //   text: 'My Packages',
    //   icon: <PackageIcon />,
    //   path: '/service-provider/packages',
    //   description: 'View and manage your packages'
    // },
    {
      text: 'Chat',
      icon: <ChatIcon />,
      path: '/service-provider/chat',
      description: 'Chat with customers and admin'
    },
    // {
    //   text: 'Performance',
    //   icon: <PerformanceIcon />,
    //   path: '/service-provider/performance',
    //   description: 'Insights & stats'
    // },
    // {
    //   text: 'Rent & Income',
    //   icon: <RentIcon />,
    //   path: '/service-provider/rent-income',
    //   description: 'Check income logs'
    // },
    // {
    //   text: 'My Details',
    //   icon: <ProfileIcon />,
    //   path: '/service-provider/profile',
    //   description: 'Personal & business info'
    // },
    {
      text: 'Profile Settings',
      icon: <SettingsIcon />,
      path: '/profile-settings',
      description: 'Update your profile settings'
    }
  ];

  const handleItemClick = (item) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
    if (onClose) onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          bgcolor: '#F8F8FF',
          borderRight: '2px solid #003047',
          boxShadow: 3,
          zIndex: 1300
        }
      }}
    >
      <Box sx={{ p: 2, bgcolor: '#003047', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: '#E6F7F8', color: '#003047', width: 48, height: 48 }}>
          {user?.fullName?.charAt(0) || 'S'}
        </Avatar>
        <Box>
          <Typography variant="h6" sx={{ color: '#E6F7F8', fontWeight: 600, fontSize: '1rem' }}>
            {user?.businessName || 'Service Provider'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#C5E8EA', fontSize: '0.85rem' }}>
            {user?.fullName}
          </Typography>
        </Box>
      </Box>

      <List sx={{ pt: 0 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Tooltip title={item.description} placement="right" arrow>
              <ListItemButton
                onClick={() => handleItemClick(item)}
                selected={item.path && location.pathname === item.path}
                sx={{
                  py: 1.5,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(0,48,71,0.1)',
                    '&:hover': { bgcolor: 'rgba(0,48,71,0.15)' }
                  },
                  '&:hover': { bgcolor: 'rgba(0,48,71,0.05)' }
                }}
              >
                <ListItemIcon sx={{ color: '#003047', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{ 
                    '& .MuiListItemText-primary': {
                      fontWeight: item.path && location.pathname === item.path ? 600 : 400,
                      color: '#003047',
                      fontSize: '0.95rem'
                    }
                  }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: 2, borderColor: '#003047' }} />
      
      {/* Resignation Button */}
      {/* <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={onResignation}
            sx={{
              py: 1.5,
              '&:hover': {
                bgcolor: '#FFEBEE'
              }
            }}
          >
            <ListItemIcon sx={{ color: '#d32f2f', minWidth: 40 }}>
              <ResignIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Request Resignation"
              secondary="Leave the platform"
              sx={{ 
                '& .MuiListItemText-primary': {
                  color: '#d32f2f',
                  fontSize: '0.95rem'
                },
                '& .MuiListItemText-secondary': {
                  color: '#757575',
                  fontSize: '0.75rem'
                }
              }}
            />
          </ListItemButton>
        </ListItem>
      </List> */}

      <Box sx={{ p: 2, mt: 'auto', textAlign: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={() => { onClose && onClose(); navigate('/login'); }}
          sx={{ color: '#003047', borderColor: '#003047', textTransform: 'none' }}
        >
          Logout
        </Button>
        <Typography variant="caption" sx={{ color: '#777', display: 'block', mt: 1 }}>
          BeautiQ Service Provider Portal
        </Typography>
      </Box>
    </Drawer>
  );
};

export default ServiceProviderSidebar;
