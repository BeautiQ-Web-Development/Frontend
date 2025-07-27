import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, token, loading } = useAuth();

  console.log('ProtectedRoute - token:', !!token);
  console.log('ProtectedRoute - user:', user);
  console.log('ProtectedRoute - allowedRoles:', allowedRoles);
  console.log('ProtectedRoute - loading:', loading);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const isAuthenticated = !!(token && user);

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    
    // Redirect based on required role
    if (allowedRoles.includes('admin')) {
      return <Navigate to="/admin-login" replace />;
    } else if (allowedRoles.includes('serviceProvider')) {
      return <Navigate to="/service-provider-login" replace />;
    } else if (allowedRoles.includes('customer')) {
      return <Navigate to="/customer-login" replace />;
    }
    
    return <Navigate to="/login" replace />;
  }

  // Check if user role is allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.log('User role not allowed:', user?.role, 'Required:', allowedRoles);
    return <Navigate to="/" replace />;
  }

  // Special check for service providers - they must be approved
  if (user?.role === 'serviceProvider' && !user?.approved) {
    return <Navigate to="/service-provider-approval-success" replace />;
  }

  console.log('Access granted to protected route');
  return children;
};

export default ProtectedRoute;