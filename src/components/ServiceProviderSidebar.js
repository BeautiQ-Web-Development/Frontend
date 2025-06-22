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
  Schedule as AvailabilityIcon,
  Event as AppointmentsIcon,
  AccessTime as PostponeIcon,
  Chat as ChatIcon,
  Analytics as PerformanceIcon,
  Payment as RentIcon,
  Person as ProfileIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const ServiceProviderSidebar = ({ open, onClose, user }) => {
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
      path: '/service-provider/services',
      description: 'Add, edit, and view own services'
    },
    {
      text: 'Availability',
      icon: <AvailabilityIcon />,
      path: '/service-provider/availability',
      description: 'Set and manage working hours'
    },
    {
      text: 'Appointments',
      icon: <AppointmentsIcon />,
      path: '/service-provider/appointments',
      description: 'View upcoming and past bookings'
    },
    {
      text: 'Postpone Requests',
      icon: <PostponeIcon />,
      path: '/service-provider/postpone',
      description: 'Manage customer reschedule requests'
    },
    {
      text: 'Chat',
      icon: <ChatIcon />,
      path: '/service-provider/chat',
      description: 'Real-time messages with customers'
    },
    {
      text: 'Performance',
      icon: <PerformanceIcon />,
      path: '/service-provider/performance',
      description: 'View service insights and booking stats'
    },
    {
      text: 'Rent & Income',
      icon: <RentIcon />,
      path: '/service-provider/rent-income',
      description: 'Check rent status and income logs'
    },
    {
      text: 'Profile',
      icon: <ProfileIcon />,
      path: '/service-provider/profile',
      description: 'Manage provider profile and business details'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
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
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
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
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
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
      
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Typography variant="caption" sx={{ color: '#054548', display: 'block', textAlign: 'center' }}>
          BeautiQ Service Provider Portal
        </Typography>
      </Box>
    </Drawer>
  );
};

export default ServiceProviderSidebar;
