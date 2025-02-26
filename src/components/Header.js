//src/components/Header.js

import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  styled,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  position: 'static',
}));

const LogoTypography = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  color: theme.palette.common.black,
  marginRight: 'auto',
}));

const Header = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const menuItems = [
    { text: 'Admin Register', path: '/register' },
    { text: 'Admin Log In', path: '/login' },
    { text: 'Customer Support', path: '/support' },
  ];

  return (
    <StyledAppBar>
      <Container>
        <Toolbar disableGutters>
          {/* Logo */}
          <LogoTypography variant="h5" component="div">
            BeautiQ
          </LogoTypography>

          {/* For Customer Button */}
          <Button
            variant="contained"
            onClick={() => navigate('/customer-login')}
            sx={{ ml: 2 }}
          >
            For Customer
          </Button>

          {/* For Service Provider Button */}
          <Button
            variant="contained"
            onClick={() => navigate('/service-provider-login')}
            sx={{ ml: 2 }}
          >
            For Service Provider
          </Button>

          {/* Menu Icon */}
          <IconButton
            size="large"
            aria-label="menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
            sx={{ marginLeft: 2 }} // Add margin to the left
          >
            <MenuIcon />
          </IconButton>

          {/* Menu Items */}
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            keepMounted
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
          >
            {menuItems.map((item, index) => (
              <MenuItem key={index} onClick={() => navigate(item.path)}>
                <Typography textAlign="center">{item.text}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Header;