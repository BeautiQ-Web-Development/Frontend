import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, styled } from '@mui/material';

// Import all components

import CustomerLoginPage from './pages/customerLoginPage';
import CustomerRegisterPage from './pages/customerRegisterPage';
import ServiceProviderLoginPage from './pages/serviceProviderLoginPage';
import ServiceProviderRegisterPage from './pages/serviceProviderRegisterPage';
import AdminLoginPage from './pages/adminLoginPage';
import AdminRegisterPage from './pages/adminRegisterPage';
import ForgotPasswordPage from './pages/forgotPasswordPage';
import ResetPasswordPage from './pages/resetPasswordPage';
import AdminDashboardPage from './pages/adminDashboardPage';
import ServiceProviderDashboardPage from './pages/serviceProviderDashboardPage';
import CustomerDashboardPage from './pages/customerDashboardPage';
import ServiceProviderApprovalSuccessPage from './pages/ServiceProviderApprovalSuccess';
import ServiceManagementPage from './pages/serviceManagementPage';
import ServiceBrowserPage from './pages/serviceBrowserPage';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/landingPage';


// Styled component for gradient background with teal and off-white theme
const GradientBackground = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #F8F8FF 0%, #E6F7F8 50%, #CCF0F2 100%)', // Off-white to light teal
  minHeight: '100vh',
  overflow: 'hidden',
}));

function App() {
  return (
    <GradientBackground>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/customer-login" element={<CustomerLoginPage />} />
          <Route path="/customer-register" element={<CustomerRegisterPage />} />
          <Route path="/service-provider-login" element={<ServiceProviderLoginPage />} />
          <Route path="/service-provider-register" element={<ServiceProviderRegisterPage />} />
          <Route path="/login" element={<AdminLoginPage />} />
          <Route path="/admin-register" element={<AdminRegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/service-provider-approval-success" element={<ServiceProviderApprovalSuccessPage />} />
          
          {/* Protected Routes */}
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/service-provider-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['serviceProvider']}>
                <ServiceProviderDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/customer-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/service-management" 
            element={
              <ProtectedRoute allowedRoles={['serviceProvider']}>
                <ServiceManagementPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/service-browser" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <ServiceBrowserPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </GradientBackground>
  );
}

export default App;