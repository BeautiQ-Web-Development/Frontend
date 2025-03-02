import React from 'react';
import { Box, styled } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';

// Page imports
import LandingPage from './pages/landingPage';
import CustomerLogin from './pages/customerLoginPage';
import CustomerRegister from './pages/customerRegisterPage';
import CustomerDashboard from './pages/customerDashboardPage'; // Add this import
import ServiceProviderLogin from './pages/serviceProviderLoginPage';
import ServiceProviderRegister from './pages/serviceProviderRegisterPage';
import AdminLogin from './pages/adminLoginPage';
import AdminRegister from './pages/adminRegisterPage';
import ForgotPassword from './pages/forgotPasswordPage';
import ResetPassword from './pages/resetPasswordPage';

const GradientBackground = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #F5A8FFFF 0%, #a8c1ff 100%)',
  minHeight: '100vh',
  overflow: 'hidden',
}));

function App() {
  return (
    <AuthProvider>
      <Router>
        <GradientBackground>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/customer-register" element={<CustomerRegister />} />
            
            {/* Protected routes */}
            <Route
              path="/customer-dashboard"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            {/* Customer routes */}
            <Route path="/customer-login" element={<CustomerLogin />} />
            <Route path="/customer-register" element={<CustomerRegister />} />
            <Route path="/customer-forgot-password" element={<ForgotPassword />} />
            
            {/* Service Provider routes */}
            <Route path="/service-provider-login" element={<ServiceProviderLogin />} />
            <Route path="/service-provider-register" element={<ServiceProviderRegister />} />
            <Route path="/service-provider-forgot-password" element={<ForgotPassword />} />
            
            {/* Admin routes */}
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/register" element={<AdminRegister />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Routes>
        </GradientBackground>
      </Router>
    </AuthProvider>
  );
}

export default App;