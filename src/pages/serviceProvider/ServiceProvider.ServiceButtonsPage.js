import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  CardActions,
  Chip,
  Fade,
  Grow,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  ContentCut as HairCutIcon,
  Style as HairStyleIcon,
  Face as FaceMakeupIcon,
  Visibility as EyeMakeupIcon,
  Checkroom as SareeDrapingIcon,
  ColorLens as NailArtIcon,
  List as AllServicesIcon,
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
  StarBorder as StarIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ServiceProviderSidebar from '../../components/ServiceProviderSidebar';
import Footer from '../../components/footer';
import api from '../../services/auth';

const serviceCategories = [
  {
    name: 'Hair Cut',
    icon: <HairCutIcon sx={{ fontSize: 48 }} />,
    color: '#FF6B6B',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%)',
    description: 'Professional hair cutting services',
    popular: true
  },
  {
    name: 'Hair Style',
    icon: <HairStyleIcon sx={{ fontSize: 48 }} />,
    color: '#4ECDC4',
    gradient: 'linear-gradient(135deg, #4ECDC4 0%, #6ED5CC 100%)',
    description: 'Creative hair styling and treatments',
    popular: true
  },
  {
    name: 'Face Makeup',
    icon: <FaceMakeupIcon sx={{ fontSize: 48 }} />,
    color: '#45B7D1',
    gradient: 'linear-gradient(135deg, #45B7D1 0%, #67C3D6 100%)',
    description: 'Complete face makeup services',
    popular: false
  },
  {
    name: 'Eye Makeup',
    icon: <EyeMakeupIcon sx={{ fontSize: 48 }} />,
    color: '#96CEB4',
    gradient: 'linear-gradient(135deg, #96CEB4 0%, #A8D4BC 100%)',
    description: 'Specialized eye makeup artistry',
    popular: false
  },
  {
    name: 'Saree Draping',
    icon: <SareeDrapingIcon sx={{ fontSize: 48 }} />,
    color: '#FFEAA7',
    gradient: 'linear-gradient(135deg, #FFEAA7 0%, #FFECB5 100%)',
    description: 'Traditional and modern saree draping',
    popular: true
  },
  {
    name: 'Nail Art',
    icon: <NailArtIcon sx={{ fontSize: 48 }} />,
    color: '#DDA0DD',
    gradient: 'linear-gradient(135deg, #DDA0DD 0%, #E4B0E4 100%)',
    description: 'Creative nail art and manicure services',
    popular: false
  }
];

const ServiceProviderServiceButtonsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resignationDialogOpen, setResignationDialogOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch services data on component mount
  useEffect(() => {
    fetchServicesData();
  }, []);

  const fetchServicesData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/services/my-services');
      if (response.data.success) {
        setServices(response.data.services || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from services
  const totalServices = services.length;
  const approvedServices = services.filter(s => s.status === 'approved').length;
  const pendingServices = services.filter(s => s.status === 'pending_approval').length;

  const handleServiceButtonClick = (category) => {
    navigate(`/service-provider/services/new?category=${encodeURIComponent(category)}`);
  };

  const handleAllServicesClick = () => {
    navigate('/service-provider/services');
  };

  const handleLogout = () => {
    logout();
    navigate('/service-provider-login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header - Matching ServiceManagementPage styling exactly */}
      <AppBar position="static" sx={{ bgcolor: '#003047' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#FFFFFF', fontWeight: 600 }}>
            BeautiQ Service Provider Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#FFFFFF', ml: 2 }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {user.businessName || user.fullName} ({user.role})
            </Typography>
            <Typography variant="body2">
              {new Date().toLocaleString()}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar - Matching ServiceManagementPage */}
      <ServiceProviderSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onResignation={() => setResignationDialogOpen(true)}
      />

      {/* Main Content - Using same Container setup as ServiceManagementPage */}
      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {/* Page Title - Consistent with ServiceManagementPage */}
        <Typography variant="h4" gutterBottom sx={{ color: '#003047', fontWeight: 'bold', mb: 4 }}>
          My Services
        </Typography>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Fade in timeout={800}>
            <Typography variant="h2" gutterBottom sx={{ 
              color: '#003047', 
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(135deg, #003047 0%, #075B5E 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Create Your Services
            </Typography>
          </Fade>
          <Fade in timeout={1000}>
            <Typography variant="h5" sx={{ 
              color: '#666', 
              mb: 4,
              maxWidth: '700px',
              mx: 'auto',
              lineHeight: 1.6
            }}>
              Select a service category to create a new service, or view all your services.
            </Typography>
          </Fade>
        </Box>

        {/* Service Categories Grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {serviceCategories.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={service.name}>
              <Grow in timeout={600 + index * 100}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.4s ease',
                    borderRadius: 4,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    background: hoveredCard === index ? service.gradient : 'white',
                    position: 'relative',
                    overflow: 'visible',
                    '&:hover': {
                      transform: 'translateY(-12px) scale(1.02)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: service.gradient,
                      borderRadius: '16px 16px 0 0'
                    }
                  }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => handleServiceButtonClick(service.name)}
                >
                  <CardContent sx={{ 
                    textAlign: 'center', 
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {/* Popular Badge */}
                    {service.popular && (
                      <Chip
                        icon={<StarIcon />}
                        label="Popular"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          bgcolor: '#FFD700',
                          color: '#003047',
                          fontWeight: 600,
                          fontSize: '0.7rem'
                        }}
                      />
                    )}

                    <Box
                      sx={{
                        color: hoveredCard === index ? 'white' : service.color,
                        mb: 3,
                        transition: 'all 0.3s ease',
                        transform: hoveredCard === index ? 'scale(1.1)' : 'scale(1)'
                      }}
                    >
                      {service.icon}
                    </Box>
                    
                    <Typography variant="h4" gutterBottom sx={{ 
                      fontWeight: 700, 
                      color: hoveredCard === index ? 'white' : '#003047',
                      mb: 2,
                      transition: 'color 0.3s ease'
                    }}>
                      {service.name}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ 
                      color: hoveredCard === index ? 'rgba(255,255,255,0.9)' : '#666',
                      fontSize: '1rem',
                      lineHeight: 1.5,
                      transition: 'color 0.3s ease'
                    }}>
                      {service.description}
                    </Typography>
                  </CardContent>
                  
                  <CardActions sx={{ 
                    justifyContent: 'center', 
                    pb: 3,
                    pt: 0
                  }}>
                    <Button
                      startIcon={<AddIcon />}
                      variant={hoveredCard === index ? "contained" : "outlined"}
                      sx={{
                        borderRadius: 3,
                        px: 3,
                        py: 1,
                        fontWeight: 600,
                        bgcolor: hoveredCard === index ? 'rgba(255,255,255,0.2)' : 'transparent',
                        borderColor: hoveredCard === index ? 'white' : service.color,
                        color: hoveredCard === index ? 'white' : service.color,
                        '&:hover': {
                          bgcolor: hoveredCard === index ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.04)'
                        }
                      }}
                    >
                      Create Service
                    </Button>
                  </CardActions>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* All Services Section */}
        <Grow in timeout={1200}>
          <Paper
            elevation={8}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #003047 0%, #075B5E 50%, #0A6B6F 100%)',
              mb: 6,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                opacity: 0.5
              }
            }}
          >
            <Box sx={{ 
              p: 6, 
              textAlign: 'center',
              position: 'relative',
              zIndex: 1
            }}>
              <AllServicesIcon sx={{ 
                fontSize: 64, 
                color: 'white', 
                mb: 2,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
              }} />
              
              <Typography variant="h3" sx={{ 
                fontWeight: 'bold',
                color: 'white',
                mb: 2,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                Manage All Services
              </Typography>
              
              <Typography variant="h6" sx={{ 
                color: 'rgba(255,255,255,0.9)',
                mb: 4,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}>
                View, edit, and monitor all your services in one comprehensive dashboard
              </Typography>
              
              <Button
                variant="contained"
                size="large"
                onClick={handleAllServicesClick}
                startIcon={<AllServicesIcon />}
                sx={{
                  bgcolor: 'white',
                  color: '#003047',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  px: 4,
                  py: 2,
                  borderRadius: 3,
                  boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: '#f8f9fa',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.4)'
                  }
                }}
              >
                View All Services
              </Button>
            </Box>
          </Paper>
        </Grow>

        {/* Quick Stats Section */}
        <Typography variant="h5" sx={{ mb: 3, color: '#003047', fontWeight: 600 }}>
          Service Statistics
        </Typography>
        <Grid container spacing={3}>
          {[
            { title: 'Total Services', value: totalServices, color: '#003047', icon: '📊' },
            { title: 'Approved Services', value: approvedServices, color: '#4CAF50', icon: '✅' },
            { title: 'Pending Approval', value: pendingServices, color: '#FF9800', icon: '⏳' }
          ].map((stat, index) => (
            <Grid item xs={12} sm={4} key={stat.title}>
              <Grow in timeout={1000 + index * 200}>
                <Paper sx={{ 
                  p: 4, 
                  textAlign: 'center', 
                  borderRadius: 3,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                  }
                }}>
                  <Typography variant="h6" sx={{ fontSize: '2rem', mb: 1 }}>
                    {stat.icon}
                  </Typography>
                  <Typography variant="h3" sx={{ 
                    color: stat.color, 
                    fontWeight: 'bold',
                    mb: 1
                  }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: '#666',
                    fontWeight: 500
                  }}>
                    {stat.title}
                  </Typography>
                </Paper>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer - Matching ServiceManagementPage */}
      <Footer />
    </Box>
  );
};

export default ServiceProviderServiceButtonsPage;