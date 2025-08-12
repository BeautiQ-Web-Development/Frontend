import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, styled } from '@mui/material';

// Import all components

import CustomerLoginPage from './pages/auth/customerLoginPage';
import CustomerRegisterPage from './pages/auth/customerRegisterPage';
import ServiceProviderLoginPage from './pages/auth/serviceProviderLoginPage';
import ServiceProviderRegisterPage from './pages/auth/serviceProviderRegisterPage';
import AdminLoginPage from './pages/auth/adminLoginPage';
import AdminRegisterPage from './pages/auth/adminRegisterPage';
import ForgotPasswordPage from './pages/auth/forgotPasswordPage';
import ResetPasswordPage from './pages/auth/resetPasswordPage';
import AdminDashboardPage from './pages/dashboards/adminDashboardPage';
import ServiceProviderDashboardPage from './pages/dashboards/serviceProviderDashboardPage';
import CustomerDashboardPage from './pages/dashboards/customerDashboardPage';
import ServiceProviderApprovalSuccessPage from './components/ServiceProviderApprovalSuccess';
import ServiceManagementPage from './pages/serviceProvider/ServiceProvider.ServiceManagementPage';
import ServiceProviderServiceButtonsPage from './pages/serviceProvider/ServiceProvider.ServiceButtonsPage';
// ServiceProviderServiceFormPage uses default export
import ServiceProviderServiceFormPage from './pages/serviceProvider/ServiceProvider.ServiceFormPage';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/landingPage';
// import PackageManagement from './pages/serviceProvider/ServiceProvider.PackageManagementPage';
import ServiceManagementAdmin from './pages/admin/Admin.ServiceManagement';
import UserManagementAdmin from './pages/admin/Admin.UserManagementPage';
import AdminNotifications from './pages/admin/Admin.NotificationsPage';


// Styled component for clean white background
const CleanBackground = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  minHeight: '100vh',
  color: '#001F3F'
}));

function App() {
  return (
    <CleanBackground>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AdminLoginPage />} />
          <Route path="/customer-login" element={<CustomerLoginPage />} />
          <Route path="/customer-register" element={<CustomerRegisterPage />} />
          <Route path="/service-provider-login" element={<ServiceProviderLoginPage />} />
          <Route path="/service-provider-register" element={<ServiceProviderRegisterPage />} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
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
        {/* Service Provider Routes */}
<Route 
  path="/service-provider/my-services" 
  element={
    <ProtectedRoute allowedRoles={[ 'serviceProvider' ]}>
      <ServiceProviderServiceButtonsPage />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/service-provider/services/new" 
  element={
    <ProtectedRoute allowedRoles={[ 'serviceProvider' ]}>
      <ServiceProviderServiceFormPage />
    </ProtectedRoute>
  } 
/>
<Route 
  path="/service-provider/services/edit/:serviceId" 
  element={
    <ProtectedRoute allowedRoles={[ 'serviceProvider' ]}>
      <ServiceProviderServiceFormPage />
    </ProtectedRoute>
  } 
/>  
<Route 
  path="/service-provider/services" 
  element={
    <ProtectedRoute allowedRoles={[ 'serviceProvider' ]}>
      <ServiceManagementPage />
    </ProtectedRoute>
  } 
 />
          {/* <Route 
            path="/service-provider/packages" 
            element={
              <ProtectedRoute allowedRoles={['serviceProvider']}>
                <PackageManagement />
              </ProtectedRoute>
            } 
          />  */}
          <Route 
            path="/admin/service-management" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ServiceManagementAdmin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagementAdmin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/notifications" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminNotifications />
              </ProtectedRoute>
            } 
          />
        </Routes>
    </CleanBackground>
  );
}

export default App;