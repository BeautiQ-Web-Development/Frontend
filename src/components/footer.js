import React from 'react';
import {
  Box,
  Container,
  Divider,
  Grid,
  Link,
  Typography,
  IconButton,
  styled,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';

// Styled components with enhanced dark blur design
const FooterContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #00003f 0%, #00003f 100%)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  position: 'relative',
  marginTop: theme.spacing(6),
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    zIndex: 0,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
    zIndex: 1,
  }
}));

const FooterContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  padding: theme.spacing(6, 0, 4, 0),
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.8)',
  textDecoration: 'none',
  fontSize: '0.95rem',
  fontWeight: 400,
  transition: 'all 0.3s ease',
  display: 'block',
  marginBottom: theme.spacing(1.5),
  position: 'relative',
  paddingLeft: theme.spacing(2),
  '&:before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transition: 'all 0.3s ease',
  },
  '&:hover': {
    color: 'white',
    textDecoration: 'none',
    paddingLeft: theme.spacing(3),
    '&:before': {
      backgroundColor: 'white',
      transform: 'translateY(-50%) scale(1.5)',
    }
  },
}));

const FooterHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(3),
  color: 'white',
  fontSize: '1.1rem',
  position: 'relative',
  paddingBottom: theme.spacing(1),
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '40px',
    height: '2px',
    background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.8) 0%, transparent 100%)',
    borderRadius: '1px',
  }
}));

const Copyright = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(3),
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  marginTop: theme.spacing(4),
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  margin: theme.spacing(0, 1),
  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  '&:hover': {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: 'translateY(-2px) scale(1.05)',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  }
}));

const ContactInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1.5),
  color: 'rgba(255, 255, 255, 0.8)',
  fontSize: '0.95rem',
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1.5),
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.6)',
  }
}));

const BrandSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const BrandTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 800,
  fontSize: '2rem',
  color: 'white',
  marginBottom: theme.spacing(1),
  background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
}));

const BrandTagline = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '1rem',
  marginBottom: theme.spacing(2),
  fontStyle: 'italic',
}));

const Footer = () => {
  // Footer link sections
  const quickLinks = [
    { text: 'Terms of Service', url: '/terms' },
    { text: 'Privacy Policy', url: '/privacy' },
    { text: 'Contact Us', url: '/contact' },
    { text: 'Support', url: '/support' },
  ];

  const aboutLinks = [
    { text: 'About Us', url: '/about' },
    { text: 'Our Team', url: '/team' },
    { text: 'Careers', url: '/careers' },
    { text: 'Partners', url: '/partners' },
  ];

  const userLinks = [
    { text: 'Help Center', url: '/help' },
    { text: 'FAQ', url: '/faq' },
    { text: 'BeautiQ Select', url: '/select' },
    { text: 'Mobile App', url: '/app' },
  ];

  const socialLinks = [
    { icon: FacebookIcon, url: 'https://facebook.com', label: 'Facebook' },
    { icon: TwitterIcon, url: 'https://twitter.com', label: 'Twitter' },
    { icon: InstagramIcon, url: 'https://instagram.com', label: 'Instagram' },
    { icon: LinkedInIcon, url: 'https://linkedin.com', label: 'LinkedIn' },
  ];

  return (
    <FooterContainer>
      <FooterContent>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Brand Section */}
            <Grid item xs={12} md={4}>
              <BrandSection>
                <BrandTitle>
                  ✨ BeautiQ
                </BrandTitle>
                <BrandTagline>
                  Your Beauty, Our Passion
                </BrandTagline>
                <Typography sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)', 
                  fontSize: '0.9rem', 
                  lineHeight: 1.6,
                  mb: 3
                }}>
                  Connecting you with the finest beauty professionals and premium wellness experiences in your area.
                </Typography>
                
                {/* Contact Information */}
                <ContactInfo>
                  <EmailIcon />
                  <span>hello@beautiq.com</span>
                </ContactInfo>
                <ContactInfo>
                  <PhoneIcon />
                  <span>+1 (555) 123-4567</span>
                </ContactInfo>
                <ContactInfo>
                  <LocationIcon />
                  <span>New York, NY 10001</span>
                </ContactInfo>
              </BrandSection>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={4} md={2.5}>
              <FooterHeading variant="subtitle1">Quick Links</FooterHeading>
              {quickLinks.map((link, index) => (
                <FooterLink key={index} href={link.url}>
                  {link.text}
                </FooterLink>
              ))}
            </Grid>

            {/* About BeautiQ */}
            <Grid item xs={12} sm={4} md={2.5}>
              <FooterHeading variant="subtitle1">Company</FooterHeading>
              {aboutLinks.map((link, index) => (
                <FooterLink key={index} href={link.url}>
                  {link.text}
                </FooterLink>
              ))}
            </Grid>

            {/* User Links */}
            <Grid item xs={12} sm={4} md={3}>
              <FooterHeading variant="subtitle1">Resources</FooterHeading>
              {userLinks.map((link, index) => (
                <FooterLink key={index} href={link.url}>
                  {link.text}
                </FooterLink>
              ))}
              
              {/* Social Media */}
              <Box sx={{ mt: 3 }}>
                <FooterHeading variant="subtitle1" sx={{ mb: 2 }}>
                  Follow Us
                </FooterHeading>
                <Box>
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <SocialIconButton
                        key={index}
                        href={social.url}
                        aria-label={social.label}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <IconComponent fontSize="small" />
                      </SocialIconButton>
                    );
                  })}
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Copyright>
            <Typography sx={{ 
              fontSize: '0.85rem', 
              color: 'rgba(255, 255, 255, 0.6)',
              fontWeight: 400
            }}>
              © {new Date().getFullYear()} BeautiQ Inc. All rights reserved. | 
              Made with ❤️ for beautiful experiences
            </Typography>
          </Copyright>
        </Container>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;