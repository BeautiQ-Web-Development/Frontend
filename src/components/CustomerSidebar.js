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
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate, useLocation } from 'react-router-dom';

const CustomerSidebar = ({ open, onClose, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/customer-dashboard',
      description: 'Overview: Services available & completed appointments'
    },
    {
      text: 'Bookings',
      icon: <AppointmentsIcon />,
      path: '/customer/appointments',
      description: 'Manage appointments and reschedules'
    },
    {
      text: 'History',
      icon: <HistoryIcon />,
      path: '/customer/history',
      description: 'View past appointments'
    },
    {
      text: 'Profile',
      icon: <ProfileIcon />,
      path: '/customer/profile',
      description: 'Manage details, change password, delete account'
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
          borderRight: '1px solid #003047',
          zIndex: 1400,
          top: 0,
          height: 'calc(100vh - 0px)'
        }
      }}
    >
      <Box sx={{ p: 3, bgcolor: '#003047' }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
          Welcome, {user?.fullName || 'Customer'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#E6F7F8' }}>
          {user?.emailAddress}
        </Typography>
      </Box>

      <List sx={{ pt: 0 }}>
        {/* Dashboard */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/customer-dashboard')} selected={location.pathname === '/customer-dashboard'}>
            <ListItemIcon sx={{ color: '#003047', minWidth: 40 }}><DashboardIcon/></ListItemIcon>
            <ListItemText primary="Dashboard" secondary="Overview: Services available & completed appointments" />
          </ListItemButton>
        </ListItem>

        {/* collapsible My Activities */}
        <Accordion disableGutters elevation={0} sx={{ '& .MuiAccordionSummary-root': { px: 2, py: 0 } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#F0FAFB' }}>
            <Typography sx={{ color: '#003047', fontWeight: 'bold' }}>My Activities</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            {menuItems.filter(i => ['Bookings','History'].includes(i.text)).map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton onClick={() => handleNavigation(item.path)} selected={location.pathname === item.path}>
                  <ListItemIcon sx={{ color: '#003047', minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} secondary={item.description} />
                </ListItemButton>
              </ListItem>
            ))}
          </AccordionDetails>
        </Accordion>

        {/* Profile */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => handleNavigation('/customer/profile')} selected={location.pathname === '/customer/profile'}>
            <ListItemIcon sx={{ color: '#003047', minWidth: 40 }}><ProfileIcon/></ListItemIcon>
            <ListItemText primary="Profile" secondary="Manage details, change password, delete account" />
          </ListItemButton>
        </ListItem>
      </List>
      
      <Divider sx={{ mx: 2, borderColor: '#003047' }} />
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Typography variant="caption" sx={{ color: '#003047', display: 'block', textAlign: 'center' }}>
          BeautiQ Customer Portal
        </Typography>
      </Box>
    </Drawer>
  );
};

export default CustomerSidebar;