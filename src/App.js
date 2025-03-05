import { Box, styled } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';

// Page imports
import LandingPage from './pages/landingPage';
import CustomerLogin from './pages/customerLoginPage';
import CustomerRegister from './pages/customerRegisterPage';
import CustomerDashboard from './pages/customerDashboardPage';
import ServiceProviderLogin from './pages/serviceProviderLoginPage';
import ServiceProviderRegister from './pages/serviceProviderRegisterPage';
import ServiceProviderDashboard from './pages/serviceProviderDashboardPage';
import AdminLogin from './pages/adminLoginPage';
import AdminRegister from './pages/adminRegisterPage';
import AdminDashboard from './pages/adminDashboardPage';
import ForgotPassword from './pages/forgotPasswordPage';
import ResetPassword from './pages/resetPasswordPage';
import ServiceProviderApprovalSuccess from './pages/ServiceProviderApprovalSuccess';

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
            
            {/* Customer routes */}
            <Route path="/customer-login" element={<CustomerLogin />} />
            <Route path="/customer-register" element={<CustomerRegister />} />
            <Route path="/customer-forgot-password" element={<ForgotPassword userType="customer" />} />
            <Route
              path="/customer-dashboard"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Service Provider routes */}
            <Route path="/service-provider-login" element={<ServiceProviderLogin />} />
            <Route path="/service-provider-register" element={<ServiceProviderRegister />} />
            <Route path="/service-provider-forgot-password" element={<ForgotPassword userType="serviceProvider" />} />
            <Route
              path="/service-provider-dashboard"
              element={
                <ProtectedRoute allowedRoles={['serviceProvider']}>
                  <ServiceProviderDashboard />
                </ProtectedRoute>
              }
            />
            <Route 
              path="/service-provider-approval-success" 
              element={<ServiceProviderApprovalSuccess />} 
            />
            
            {/* Admin routes */}
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/register" element={<AdminRegister />} />
            <Route path="/forgot-password" element={<ForgotPassword userType="admin" />} />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Common routes */}
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </GradientBackground>
      </Router>
    </AuthProvider>
  );
}

export default App;