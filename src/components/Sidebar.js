import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Avatar
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Event as BookingsIcon,
  Build as ServicesIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Payment as PaymentIcon,
  Analytics as AnalyticsIcon,
  People as CustomersIcon,
  Store as ProvidersIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ 
  open, 
  onClose, 
  userRole, 
  userName, 
  userAvatar, 
  currentPath 
}) => {
  const navigate = useNavigate();

  const getMenuItems = () => {
    const baseItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: `/${userRole}-dashboard` },
      { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
      { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
    ];

    switch (userRole) {
      case 'customer':
        return [
          ...baseItems.slice(0, 1),
          { text: 'My Bookings', icon: <BookingsIcon />, path: '/customer/bookings' },
          { text: 'Find Services', icon: <ServicesIcon />, path: '/services' },
          { text: 'Payment History', icon: <PaymentIcon />, path: '/customer/payments' },
          ...baseItems.slice(1),
          { text: 'Help & Support', icon: <HelpIcon />, path: '/help' }
        ];
      
      case 'serviceProvider':
        return [
          ...baseItems.slice(0, 1),
          { text: 'My Bookings', icon: <BookingsIcon />, path: '/provider/bookings' },
          { text: 'My Services', icon: <ServicesIcon />, path: '/provider/services' },
          { text: 'Analytics', icon: <AnalyticsIcon />, path: '/provider/analytics' },
          { text: 'Payments', icon: <PaymentIcon />, path: '/provider/payments' },
          ...baseItems.slice(1),
          { text: 'Help & Support', icon: <HelpIcon />, path: '/help' }
        ];
      
      case 'admin':
        return [
          ...baseItems.slice(0, 1),
          { text: 'Manage Users', icon: <CustomersIcon />, path: '/admin/users' },
          { text: 'Service Providers', icon: <ProvidersIcon />, path: '/admin/providers' },
          { text: 'All Bookings', icon: <BookingsIcon />, path: '/admin/bookings' },
          { text: 'Analytics', icon: <AnalyticsIcon />, path: '/admin/analytics' },
          ...baseItems.slice(1)
        ];
      
      default:
        return baseItems;
    }
  };

  const handleItemClick = (path) => {
    navigate(path);
    onClose();
  };

  const menuItems = getMenuItems();

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 280,
          bgcolor: '#f8f9fa'
        }
      }}
    >
      <Box sx={{ p: 3, borderBottom: '1px solid #e0e0e0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={userAvatar}
            sx={{ 
              width: 50, 
              height: 50,
              bgcolor: '#075B5E'
            }}
          >
            {userName?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {userName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
              {userRole === 'serviceProvider' ? 'Service Provider' : userRole}
            </Typography>
          </Box>
        </Box>
      </Box>

      <List sx={{ py: 2 }}>
        {menuItems.map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleItemClick(item.path)}
              selected={currentPath === item.path}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 2,
                '&.Mui-selected': {
                  bgcolor: '#075B5E',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#054548'
                  }
                },
                '&.Mui-selected .MuiListItemIcon-root': {
                  color: 'white'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: currentPath === item.path ? 'bold' : 'normal'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;