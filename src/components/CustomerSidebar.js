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
  AccordionDetails,
  Button
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
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
  NotificationImportant as RemindersIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate, useLocation } from 'react-router-dom';

const CustomerSidebar = ({ open, onClose, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Enhanced menu items with better descriptions
  const menuItems = [
    {
      text: 'Dashboard',
      path: '/customer-dashboard',
      icon: <DashboardIcon />,
      description: 'Overview of services & bookings'
    },
    {
      text: 'Browse Services',
      path: '/customer/browse-services',
      icon: <SearchIcon />,
      description: 'Find beauty services'
    },
    {
      text: 'My Bookings',
      path: '/customer/my-bookings',
      icon: <AppointmentsIcon />,
      description: 'Upcoming appointments'
    },
    // {
    //   text: 'History',
    //   path: '/customer/appointment-history',
    //   icon: <HistoryIcon />,
    //   description: 'Past appointments'
    // },
    {
      text: 'Profile Settings',
      path: '/profile-settings',
      icon: <SettingsIcon />,
      description: 'Manage your account'
    },
    {
      text: 'Notifications',
      path: '/customer/notifications',
      icon: <RemindersIcon />,
      description: 'View your notifications'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  // Get current page name for display
  const getCurrentPageName = () => {
    const currentItem = menuItems.find(item => location.pathname === item.path || 
                                               location.pathname.startsWith(item.path + '/'));
    return currentItem ? currentItem.text : 'BeautiQ';
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
        <Typography variant="body2" sx={{ 
          color: 'white', 
          mt: 1,
          p: 1, 
          bgcolor: 'rgba(255,255,255,0.1)',
          borderRadius: 1,
          fontWeight: 500
        }}>
          Current Page: {getCurrentPageName()}
        </Typography>
      </Box>

      <List sx={{ pt: 0 }}>
        {/* Dashboard */}
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => handleNavigation('/customer-dashboard')} 
            selected={location.pathname === '/customer-dashboard'}
            sx={{
              '&.Mui-selected': {
                bgcolor: '#E6F7F8',
                '&:hover': {
                  bgcolor: '#E6F7F8',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: 4,
                  bgcolor: '#003047',
                }
              }
            }}
          >
            <ListItemIcon sx={{ color: '#003047', minWidth: 40 }}><DashboardIcon/></ListItemIcon>
            <ListItemText 
              primary="Dashboard" 
              secondary="Overview: Services available & appointments" 
              primaryTypographyProps={{ fontWeight: location.pathname === '/customer-dashboard' ? 700 : 400 }}
            />
          </ListItemButton>
        </ListItem>
        
        {/* Browse Services */}
        {/* <ListItem disablePadding>
          <ListItemButton 
            onClick={() => handleNavigation('/customer/browse-services')} 
            selected={location.pathname === '/customer/browse-services'}
            sx={{
              '&.Mui-selected': {
                bgcolor: '#E6F7F8',
                '&:hover': {
                  bgcolor: '#E6F7F8',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: 4,
                  bgcolor: '#003047',
                }
              }
            }}
          >
            <ListItemIcon sx={{ color: '#003047', minWidth: 40 }}><SearchIcon/></ListItemIcon>
            <ListItemText 
              primary="Browse Services" 
              secondary="Find and book beauty services" 
              primaryTypographyProps={{ fontWeight: location.pathname === '/customer/browse-services' ? 700 : 400 }}
            />
          </ListItemButton>
        </ListItem> */}

        {/* collapsible My Activities */}
        <Accordion disableGutters elevation={0} sx={{ '& .MuiAccordionSummary-root': { px: 2, py: 0 } }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#F0FAFB' }}>
            <Typography sx={{ color: '#003047', fontWeight: 'bold' }}>My Activities</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            {menuItems.filter(i => ['My Bookings','History'].includes(i.text)).map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton 
                  onClick={() => handleNavigation(item.path)} 
                  selected={location.pathname === item.path || location.pathname.startsWith(item.path + '/')} 
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: '#E6F7F8',
                      '&:hover': {
                        bgcolor: '#E6F7F8',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: 4,
                        bgcolor: '#003047',
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: '#003047', minWidth: 40 }}>{item.icon}</ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    secondary={item.description}
                    primaryTypographyProps={{ 
                      fontWeight: (location.pathname === item.path || location.pathname.startsWith(item.path + '/')) ? 700 : 400 
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </AccordionDetails>
        </Accordion>

        {/* Browse Services */}
        {/* <ListItem disablePadding>
          <ListItemButton 
            onClick={() => handleNavigation('/customer/browse-services')} 
            selected={location.pathname === '/customer/browse-services' || location.pathname.startsWith('/customer/browse-services/')}
            sx={{
              '&.Mui-selected': {
                bgcolor: '#E6F7F8',
                '&:hover': {
                  bgcolor: '#E6F7F8',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: 4,
                  bgcolor: '#003047',
                }
              }
            }}
          >
            <ListItemIcon sx={{ color: '#003047', minWidth: 40 }}><SearchIcon/></ListItemIcon>
            <ListItemText 
              primary="Browse Services" 
              secondary="Find beauty services" 
              primaryTypographyProps={{ 
                fontWeight: (location.pathname === '/customer/browse-services' || location.pathname.startsWith('/customer/browse-services/')) ? 700 : 400 
              }}
            />
          </ListItemButton>
        </ListItem> */}

        {/* Profile Settings */}
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => handleNavigation('/profile-settings')} 
            selected={location.pathname === '/profile-settings'}
            sx={{
              '&.Mui-selected': {
                bgcolor: '#E6F7F8',
                '&:hover': {
                  bgcolor: '#E6F7F8',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: 4,
                  bgcolor: '#003047',
                }
              }
            }}
          >
            <ListItemIcon sx={{ color: '#003047', minWidth: 40 }}><SettingsIcon/></ListItemIcon>
            <ListItemText 
              primary="Profile Settings" 
              secondary="Adjust your profile settings"
              primaryTypographyProps={{ 
                fontWeight: location.pathname === '/profile-settings' ? 700 : 400 
              }}
            />
          </ListItemButton>
        </ListItem>

        {/* Notifications - New Menu Item */}
        <ListItem disablePadding>
          <ListItemButton 
            onClick={() => handleNavigation('/customer/notifications')} 
            selected={location.pathname === '/customer/notifications'}
            sx={{
              '&.Mui-selected': {
                bgcolor: '#E6F7F8',
                '&:hover': {
                  bgcolor: '#E6F7F8',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: 4,
                  bgcolor: '#003047',
                }
              }
            }}
          >
            <ListItemIcon sx={{ color: '#003047', minWidth: 40 }}><RemindersIcon/></ListItemIcon>
            <ListItemText 
              primary="Notifications" 
              secondary="View your notifications"
              primaryTypographyProps={{ 
                fontWeight: location.pathname === '/customer/notifications' ? 700 : 400 
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
      
      <Divider sx={{ mx: 2, borderColor: '#003047' }} />
      
      {/* <Box sx={{ p: 2, mt: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => {
            logout();
            navigate('/login');
            onClose();
          }}
          sx={{
            backgroundColor: '#001F3F',
            '&:hover': { backgroundColor: '#003366' },
            mb: 2
          }}
        >
          Logout
        </Button>
      </Box>
       */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Typography variant="caption" sx={{ color: '#003047', display: 'block', textAlign: 'center' }}>
          BeautiQ Customer Portal
        </Typography>
        <Typography variant="caption" sx={{ color: '#003047', display: 'block', textAlign: 'center', mt: 1 }}>
          Current Page: {getCurrentPageName()}
        </Typography>
      </Box>
    </Drawer>
  );
};

export default CustomerSidebar;