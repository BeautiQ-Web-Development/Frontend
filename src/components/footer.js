import React from 'react';
import {
  Box,
  Container,
  Divider,
  Grid,
  Link,
  Typography,
  styled,
} from '@mui/material';

// Styled components
const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  padding: theme.spacing(4, 0),
  borderRadius: theme.spacing(2, 2, 0, 0),
  marginTop: theme.spacing(4),
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
  display: 'block',
  marginBottom: theme.spacing(1),
}));

const FooterHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
}));

const Copyright = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginTop: theme.spacing(2),
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));

const Footer = () => {
  // Footer link sections
  const quickLinks = [
    { text: 'Terms of Service', url: '/terms' },
    { text: 'Privacy Policy', url: '/privacy' },
    { text: 'Contact Us', url: '/contact' },
  ];

  const aboutLinks = [
    { text: 'About Us', url: '/about' },
    { text: 'Our Team', url: '/team' },
    { text: 'Careers', url: '/careers' },
  ];

  const userLinks = [
    { text: 'Help Center', url: '/help' },
    { text: 'FAQ', url: '/faq' },
    { text: 'Top A-Z Salon', url: '/salons' },
    { text: 'Leave Tea Trending', url: '/trending' },
    { text: 'BeautiQ Select', url: '/select' },
  ];

  return (
    <FooterContainer>
      <Container>
        <Grid container spacing={4}>
          {/* Quick Links */}
          <Grid item xs={12} sm={4} md={4}>
            <FooterHeading variant="subtitle1">Quick Links</FooterHeading>
            {quickLinks.map((link, index) => (
              <FooterLink key={index} href={link.url}>
                {link.text}
              </FooterLink>
            ))}
          </Grid>

          {/* About BeautiQ */}
          <Grid item xs={12} sm={4} md={4}>
            <FooterHeading variant="subtitle1">About BeautiQ</FooterHeading>
            {aboutLinks.map((link, index) => (
              <FooterLink key={index} href={link.url}>
                {link.text}
              </FooterLink>
            ))}
          </Grid>

          {/* User Links */}
          <Grid item xs={12} sm={4} md={4}>
            <FooterHeading variant="subtitle1">User Links</FooterHeading>
            {userLinks.map((link, index) => (
              <FooterLink key={index} href={link.url}>
                {link.text}
              </FooterLink>
            ))}
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        
        <Copyright>
          ©{new Date().getFullYear()} BeautiQ Inc. All rights reserved.
        </Copyright>
      </Container>
    </FooterContainer>
  );
};

export default Footer;