import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  styled,
} from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Minimal footer container with very small height
const FooterContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #00003f 0%, #00003f 100%)',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  marginTop: 'auto',
}));

const FooterContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
  minHeight: '40px',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: theme.spacing(0.5),
    padding: theme.spacing(1),
  }
}));

const HomeButton = styled(Button)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.8)',
  fontSize: '0.75rem',
  textTransform: 'none',
  padding: theme.spacing(0.5, 1.5),
  minHeight: '28px',
  transition: 'all 0.2s ease',
  '&:hover': {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1rem',
    marginRight: theme.spacing(0.5),
  }
}));

const Footer = () => {
  const navigate = useNavigate();

  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <FooterContent>
          <Typography sx={{ 
            fontSize: '0.75rem', 
            color: 'rgba(255, 255, 255, 0.6)',
            fontWeight: 400
          }}>
            © 2025 BeautiQ Inc. All rights reserved.
          </Typography>
          
          <HomeButton 
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
          >
            Home
          </HomeButton>
        </FooterContent>
      </Container>
    </FooterContainer>
  );
};

export default Footer;