import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboardRoutes = {
      admin: '/admin/dashboard',
      service_provider: '/service-provider/dashboard',
      customer: '/customer/dashboard'
    };
    return <Navigate to={dashboardRoutes[user.role] || '/login'} replace />;
  }

  return children;
};

export default ProtectedRoute;
