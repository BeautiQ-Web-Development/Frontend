//src/components/Header.js

import React, { useState } from 'react';
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
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

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

  return (
    <AppBar position="static" sx={{ backgroundColor: '#075B5E' }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ fontWeight: 'bold' }}
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' , color: '#FFFFFF' }}
          >
            BeautiQ
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button 
              color="inherit" 
              onClick={() => navigate('/')}
            >
              Home
            </Button>
            
            <Button 
              color="inherit" 
              onClick={() => navigate('/customer-login')}
            >
              Customer Login
            </Button>
            
            <Button 
              color="inherit" 
              onClick={() => navigate('/service-provider-login')}
            >
              Service Provider Login
            </Button>

            <Button
              color="inherit"
              onClick={handleMenuClick}
            >
              Admin
            </Button>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            style={{ cursor: 'pointer' , color: '#FFFFFF' , borderRadius: '8px' , borderColor: '#075B5E' }}
          >
            <MenuItem onClick={() => handleNavigation('/login')}>
              Admin Login
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/admin-register')}>
              Admin Register
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;