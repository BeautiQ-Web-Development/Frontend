import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, styled } from '@mui/material';


// Import all components

import CustomerLoginPage from './pages/auth/customerLoginPage';
import CustomerRegisterPage from './pages/auth/customerRegisterPage';
import ServiceProviderLoginPage from './pages/auth/serviceProviderLoginPage';
import ServiceProviderRegisterPage from './pages/auth/serviceProviderRegisterPage';
import AdminLoginPage from './pages/auth/adminLoginPage';
import AdminRegisterPage from './pages/auth/adminRegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
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
import CustomerBookServicePage from './pages/customer/Customer.CustomerBookServicePage';
import CustomerPaymentPage from './pages/customer/Customer.PaymentPage';
import ProfileSettingsPage from './pages/profile/ProfileSettingsPage';
import CustomerNotificationsPage from './pages/customer/Customer.NotificationsPage';
import CustomerMyBookingsPage from './pages/customer/Customer.MyBookingsPage';
import ServiceProviderBookingsPage from './pages/serviceProvider/ServiceProvider.BookingsPage';
import ServiceProviderNotificationsPage from './pages/serviceProvider/ServiceProvider.NotificationsPage';
import CustomerChatPage from './pages/customer/Customer.ChatPage';
import ServiceProviderChatPage from './pages/serviceProvider/ServiceProvider.ChatPage';
import AdminChatPage from './pages/admin/Admin.ChatPage';
import { ChatProvider } from './context/ChatContext';

// Styled component for clean white background
const CleanBackground = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFFFF',
  minHeight: '100vh',
  color: '#001F3F'
}));

function App() {
  // // Set up the placeholder interceptor to handle via.placeholder.com URLs
  // useEffect(() => {
  //   // This will intercept all via.placeholder.com requests and redirect to our local service
  //   const cleanup = setupPlaceholderInterception();
  //   return cleanup;
  // }, []);

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
          <Route 
            path="/customer/my-bookings" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerMyBookingsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/customer/browse-services" 
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
<Route 
  path="/service-provider/bookings" 
  element={
    <ProtectedRoute allowedRoles={[ 'serviceProvider' ]}>
      <ServiceProviderBookingsPage />
    </ProtectedRoute>
  } 
/>  
<Route
  path="/service-provider/notifications"
  element={
    <ProtectedRoute allowedRoles={[ 'serviceProvider' ]}>
      <ServiceProviderNotificationsPage />
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
          <Route 
            path="/customer/book-service/:serviceId" 
            element={<CustomerBookServicePage />} 
          />
          <Route 
            path="/customer/payment" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <CustomerPaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/profile-settings" element={
            <ProtectedRoute>
              <ProfileSettingsPage />
            </ProtectedRoute>
          } />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
  path="/customer/notifications"
  element={
    <ProtectedRoute allowedRoles={['customer']}>
      <CustomerNotificationsPage />
    </ProtectedRoute>
  }
/>
          {/* Chat Routes */}
          <Route
            path="/customer/chat"
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <ChatProvider>
                  <CustomerChatPage />
                </ChatProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/service-provider/chat"
            element={
              <ProtectedRoute allowedRoles={['serviceProvider']}>
                <ChatProvider>
                  <ServiceProviderChatPage />
                </ChatProvider>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/chat"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ChatProvider>
                  <AdminChatPage />
                </ChatProvider>
              </ProtectedRoute>
            }
          />
          {/* Route already defined above */}
        </Routes>
    </CleanBackground>
  );
}

export default App;