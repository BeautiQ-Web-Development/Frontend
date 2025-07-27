// import api from './auth';

// // fetch all notifications for current user
// export const fetchNotifications = async () => {
//   try {
//     const response = await api.get('/notifications');
//     return response.data.notifications || [];
//   } catch {
//     return [];
//   }
// };

// // approve a service provider request
// export const approveProviderRequest = async (requestId) => {
//   const { data } = await api.put(`/notifications/providers/${requestId}/approve`);
//   return data;
// };

// // reject a service provider request with a reason
// export const rejectProviderRequest = async (requestId, reason) => {
//   const { data } = await api.put(
//     `/notifications/providers/${requestId}/reject`,
//     { reason }
//   );
//   return data;
// };

// // expose the names your pages expect:
// export const approveServiceProvider = approveProviderRequest;
// export const rejectServiceProvider  = rejectProviderRequest;


// services/notification.js
import api from './auth';

// fetch all notifications for current user
export const fetchNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    return response.data.notifications || [];
  } catch {
    return [];
  }
};
export const approveServiceProvider = async (providerId) => {
  console.log('Making PUT request to: /notifications/providers/' + providerId + '/approve');
  const response = await api.put(`/notifications/providers/${providerId}/approve`);
  return response.data;
};

export const rejectServiceProvider = async (providerId, reason) => {
  console.log('Making PUT request to: /notifications/providers/' + providerId + '/reject');
  const response = await api.put(`/notifications/providers/${providerId}/reject`, { reason });
  return response.data;
};