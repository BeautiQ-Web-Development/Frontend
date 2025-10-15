//src/components/Header.js

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminIcon,
  AccessTime as TimeIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = ({ toggleSidebar, pageTitle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const isLoggedIn = Boolean(user);
  const isLanding = location.pathname === '/';  // Check if on landing page

  // hide logout on any auth page
  const authPaths = [
    '/login',
    '/customer-login',
    '/service-provider-login',
    '/customer-register',
    '/service-provider-register',
    '/admin-register'
  ];
  const isAuthPage = authPaths.includes(location.pathname);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleMenuClose();
  };

  const handleLogout = () => {
    // clear auth, then redirect
    localStorage.clear();
    navigate('/login');
    handleMenuClose();
  };

  const formatDateTime = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // New accent and hover styles
  const navButtonSx = {
    color: '#FFFFFF',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: 2,
    px: 3,
    py: 1,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      backgroundColor: '#003047',  // darker hover
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    },
  };

  const menuItemSx = {
    py: 1.5,
    px: 3,
    '&:hover': {
      backgroundColor: '#E6F7F8',
      color: '#001F3F',
    },
  };

  // Map routes to page titles if pageTitle prop is not provided
  const getPageTitle = () => {
    if (pageTitle) return pageTitle;
    
    const pathToTitle = {
      '/customer-dashboard': 'Customer Dashboard',
      '/customer/browse-services': 'Browse Services',
      '/customer/my-bookings': 'My Bookings',
      '/customer/appointment-history': 'Appointment History',
      '/customer/book-service': 'Book Service',
      '/profile-settings': 'Profile Settings',
      '/customer/provider-details': 'Service Provider Details'
    };
    
    // Find the matching path or return default
    return pathToTitle[location.pathname] || 
           pathToTitle[location.pathname.split('/').slice(0, 3).join('/')] || 
           'BeautiQ';
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#001F3F',  // solid accent
        boxShadow: '0 4px 20px rgba(0,31,63,0.3)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Left Side - Menu icon separate from logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Sidebar Toggle Button - FAR LEFT CORNER when logged in (outside the inner Box) */}
            {isLoggedIn && !isLanding && !isAuthPage && toggleSidebar && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open sidebar"
                onClick={toggleSidebar}
                sx={{
                  color: '#FFFFFF',
                  mr: 1, // Add margin to separate from logo
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
            
            {/* Logo */}
            <Typography
              variant="h5"
              onClick={() => navigate('/')}
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(45deg, #FFFFFF 30%, #E6F7F8 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                cursor: 'pointer'
              }}
            >
              BeautiQ
            </Typography>
            
            {/* Date & Time Display - Next to logo */}
            <Chip
              icon={<TimeIcon sx={{ color: '#FFFFFF !important' }} />}
              label={formatDateTime(currentTime)}
              sx={{
                bgcolor: 'rgba(255,255,255,0.15)',
                color: '#FFFFFF',
                fontWeight: 500,
                fontSize: '0.85rem',
                backdropFilter: 'blur(10px)',
                display: { xs: 'none', sm: 'flex' }
              }}
            />
          </Box>

          {/* Right Side - User Menu or User Name */}
          {(!isLoggedIn || isLanding || isAuthPage) ? (
            <>
              <IconButton
                color="inherit"
                aria-label="menu"
                onClick={handleMenuClick}
                edge="end"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    mt: 1
                  }
                }}
              >
                <MenuItem onClick={() => handleNavigation('/')} sx={menuItemSx}>
                  🏠 Home
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/customer-login')} sx={menuItemSx}>
                  <PersonIcon sx={{ mr: 1, fontSize: 18 }} /> For Customers
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/service-provider-login')} sx={menuItemSx}>
                  <BusinessIcon sx={{ mr: 1, fontSize: 18 }} /> For Providers
                </MenuItem>
                <MenuItem onClick={() => handleNavigation('/login')} sx={menuItemSx}>
                  <AdminIcon sx={{ mr: 1, fontSize: 18 }} /> Admin Portal
                </MenuItem>
              </Menu>
            </>
          ) : (
            // logged in: show user name on right side (menu icon is on left)
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* User Name Display */}
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                {user?.fullName || user?.emailAddress}
              </Typography>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;