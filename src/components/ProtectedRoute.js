// import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { user, loading } = useAuth();
//   const location = useLocation();
  
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!user) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (!allowedRoles.includes(user.role)) {
//     // Redirect to appropriate dashboard based on role
//     const dashboardRoutes = {
//       admin: '/admin/dashboard',
//       service_provider: '/service-provider/dashboard',
//       customer: '/customer/dashboard'
//     };
//     return <Navigate to={dashboardRoutes[user.role] || '/login'} replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;


import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    // Redirect to appropriate login based on intended role
    let loginRoute = '/login'; // Default to admin login
    
    if (allowedRoles.includes('customer')) {
      loginRoute = '/customer-login';
    } else if (allowedRoles.includes('serviceProvider')) {
      loginRoute = '/service-provider-login';
    }
    
    return <Navigate to={loginRoute} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on actual role
    const dashboardRoutes = {
      admin: '/admin-dashboard',
      serviceProvider: '/service-provider-dashboard',
      customer: '/customer-dashboard'
    };
    
    return <Navigate to={dashboardRoutes[user.role] || '/'} replace />;
  }

  // For service providers, check if they're approved
  if (user.role === 'serviceProvider' && !user.approved) {
    return <Navigate to="/service-provider-login" state={{ pendingApproval: true }} replace />;
  }

  return children;
};

export default ProtectedRoute;