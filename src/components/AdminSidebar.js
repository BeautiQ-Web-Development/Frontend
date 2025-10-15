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
  Button
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as UsersIcon,
  Store as ProvidersIcon,
  Assignment as ApprovalsIcon,
  Analytics as AnalyticsIcon,
  Report as ReportsIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Chat as ChatIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = ({ open, onClose, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/admin-dashboard',
      description: 'System overview and key metrics'
    },
    {
      text: 'Customer Management',
      icon: <UsersIcon />,
      path: '/admin/users',
      description: 'View and manage all users'
    },
    {
      text: 'Service Provider Management',
      icon: <ApprovalsIcon />,
      path: '/admin/service-management',
      description: 'Manage service provider registrations and packages'
    },
    // {
    //   text: 'Appointments',
    //   icon: <AnalyticsIcon />,
    //   path: '/admin/appointments',
    //   description: 'View all platform-wide bookings'
    // },
    // {
    //   text: 'Rent & Payments',
    //   icon: <ReportsIcon />,
    //   path: '/admin/rent-payments',
    //   description: 'Track provider rent payments'
    // },
    // {
    //   text: 'Settings',
    //   icon: <SettingsIcon />,
    //   path: '/admin/settings',
    //   description: 'Configure platform policies'
    // },
    // {
    //   text: 'Analytics',
    //   icon: <SecurityIcon />,
    //   path: '/admin/analytics',
    //   description: 'System-wide usage and trends'
    // },
    {
      text: 'Chat',
      icon: <ChatIcon />,
      path: '/admin/chat',
      description: 'Chat with service providers'
    },
    {
      text: 'Notifications',
      icon: <NotificationsIcon />,
      path: '/admin/notifications',
      description: 'Pending approvals and system notifications'}
    // },
    // {
    //   text: 'Profile',
    //   icon: <UsersIcon />,
    //   path: '/admin/profile',
    //   description: 'Admin profile and password update'
    // }
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
          borderRight: '1px solid #003047',
          zIndex: 1300
        }
      }}
    >
      <Box sx={{ p: 3, bgcolor: '#003047' }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          Admin Panel
        </Typography>
        <Typography variant="body2" sx={{ color: '#E6F7F8' }}>
          {user?.fullName || 'Administrator'}
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
              <ListItemIcon sx={{ color: '#003047', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                secondary={item.description}
                sx={{ 
                  '& .MuiListItemText-primary': {
                    fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                    color: '#003047',
                    fontSize: '0.95rem'
                  },
                  '& .MuiListItemText-secondary': {
                    color: '#003047',
                    fontSize: '0.75rem'
                  }
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: 2, borderColor: '#003047' }} />
      
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={() => {
            logout();
            navigate('/login');
            onClose();
          }}
          sx={{
            backgroundColor: '#d32f2f',
            '&:hover': { backgroundColor: '#b71c1c' },
            mb: 2
          }}
        >
          Logout
        </Button>
        <Typography variant="caption" sx={{ color: '#003047', display: 'block', textAlign: 'center' }}>
          BeautiQ Admin Portal
        </Typography>
      </Box>
    </Drawer>
  );
};

export default AdminSidebar;