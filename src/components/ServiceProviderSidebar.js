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
  Divider
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
  CardGiftcard as PackageIcon
} from '@mui/icons-material';
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
    text: 'Service Management',
    icon: <PackageIcon />,
    path: '/service-provider/services', // This goes to the table view
    description: 'View and manage all services'
  },
  {
    text: 'My Packages',
    icon: <PackageIcon />,
    path: '/service-provider/packages',
    description: 'View and manage your packages'
  },
    {
      text: 'Chat',
      icon: <ChatIcon />,
      path: '/service-provider/chat',
      description: 'Real-time messages'
    },
    {
      text: 'Performance',
      icon: <PerformanceIcon />,
      path: '/service-provider/performance',
      description: 'Insights & stats'
    },
    {
      text: 'Rent & Income',
      icon: <RentIcon />,
      path: '/service-provider/rent-income',
      description: 'Check income logs'
    },
    {
      text: 'My Details',
      icon: <ProfileIcon />,
      path: '/service-provider/profile',
      description: 'Personal & business info'
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
          width: 300,
          bgcolor: '#F8F8FF',
          borderRight: '1px solid #075B5E',
          zIndex: 1300
        }
      }}
    >
      <Box sx={{ p: 3, bgcolor: '#075B5E' }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          {user?.businessName || 'Service Provider'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#E6F7F8' }}>
          {user?.fullName}
        </Typography>
      </Box>

      <List sx={{ pt: 0 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleItemClick(item)}
              selected={item.path && location.pathname === item.path}
              sx={{
                py: 1.5,
                '&.Mui-selected': {
                  bgcolor: '#CCF0F2',
                  '&:hover': {
                    bgcolor: '#B8E6E9'
                  }
                },
                '&:hover': {
                  bgcolor: '#F0FAFB'
                }
              }}
            >
              <ListItemIcon sx={{ color: '#075B5E', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                secondary={item.description}
                sx={{ 
                  '& .MuiListItemText-primary': {
                    fontWeight: item.path && location.pathname === item.path ? 'bold' : 'normal',
                    color: '#075B5E',
                    fontSize: '0.95rem'
                  },
                  '& .MuiListItemText-secondary': {
                    color: '#054548',
                    fontSize: '0.75rem'
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: 2, borderColor: '#075B5E' }} />
      
      {/* Resignation Button */}
      <List>
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
      </List>

      <Box sx={{ p: 2, mt: 'auto' }}>
        <Typography variant="caption" sx={{ color: '#054548', display: 'block', textAlign: 'center' }}>
          BeautiQ Service Provider Portal
        </Typography>
      </Box>
    </Drawer>
  );
};

export default ServiceProviderSidebar;
