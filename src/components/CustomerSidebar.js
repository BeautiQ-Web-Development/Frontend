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
  Search as SearchIcon,
  BookOnline as BookIcon,
  Event as AppointmentsIcon,
  Person as ProfileIcon,
  Favorite as FavoritesIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  Token as TokenIcon,
  Chat as ChatIcon,
  NotificationImportant as RemindersIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const CustomerSidebar = ({ open, onClose, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/customer-dashboard',
      description: 'Your overview'
    },
    {
      text: 'Browse Services',
      icon: <SearchIcon />,
      path: '/customer/browse-services',
      description: 'Search and filter available services'
    },
    {
      text: 'My Appointments',
      icon: <AppointmentsIcon />,
      path: '/customer/appointments',
      description: 'View, cancel, or reschedule bookings'
    },
    {
      text: 'Reschedule Tokens',
      icon: <TokenIcon />,
      path: '/customer/reschedule-tokens',
      description: 'Track reusable services after cancellation'
    },
    {
      text: 'Chat',
      icon: <ChatIcon />,
      path: '/customer/chat',
      description: 'Communicate with booked providers'
    },
    {
      text: 'Reminders',
      icon: <RemindersIcon />,
      path: '/customer/reminders',
      description: 'View smart reminders and upcoming alerts'
    },
    {
      text: 'History & Reviews',
      icon: <HistoryIcon />,
      path: '/customer/history',
      description: 'See past services and submit ratings'
    },
    {
      text: 'Profile',
      icon: <ProfileIcon />,
      path: '/customer/profile',
      description: 'Update personal details and preferences'
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
          Welcome, {user?.fullName || 'Customer'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#E6F7F8' }}>
          {user?.emailAddress}
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
          BeautiQ Customer Portal
        </Typography>
      </Box>
    </Drawer>
  );
};

export default CustomerSidebar;