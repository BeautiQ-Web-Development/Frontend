import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import FeedbackRequestModal from '../components/FeedbackRequestModal';
import { submitFeedback } from '../services/feedback';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

const FeedbackContext = createContext({
  openFeedbackModal: () => {},
  closeFeedbackModal: () => {},
  isModalOpen: false,
  currentRequest: null,
});

export const FeedbackProvider = ({ children }) => {
  const { user } = useAuth();
  const notificationsApi = useNotifications();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const openFeedbackModal = useCallback((requestPayload) => {
    if (!requestPayload) return;

    setCurrentRequest(requestPayload);
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsModalOpen(true);
  }, []);

  const closeFeedbackModal = useCallback(() => {
    if (submitting) return;
    setIsModalOpen(false);
    setCurrentRequest(null);
    setSubmitError(null);
    setSubmitSuccess(null);
  }, [submitting]);

  const handleSubmit = useCallback(async ({ rating, feedback }) => {
    if (!currentRequest || !user?.userId) {
      setSubmitError('Missing details required to submit feedback.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        bookingId: currentRequest.bookingId,
        customerId: user.userId,
        serviceId: currentRequest.serviceId,
        serviceName: currentRequest.serviceName,
        providerId: currentRequest.providerId,
        providerName: currentRequest.providerName,
        scheduledAt: currentRequest.scheduledAt,
        rating,
        feedback,
        notificationId: currentRequest.notificationId,
      };

      const response = await submitFeedback(payload);
      setSubmitSuccess(response?.message || 'Thank you for sharing your experience!');

      if (currentRequest.notificationId && notificationsApi?.markAsRead) {
        notificationsApi.markAsRead(currentRequest.notificationId);
      }
      if (notificationsApi?.refreshNotifications) {
        notificationsApi.refreshNotifications(true);
      }

      setTimeout(() => {
        setIsModalOpen(false);
        setCurrentRequest(null);
      }, 1500);
    } catch (error) {
      setSubmitError(error.message || 'Unable to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [currentRequest, notificationsApi, user?.userId]);

  const contextValue = useMemo(() => ({
    openFeedbackModal,
    closeFeedbackModal,
    isModalOpen,
    currentRequest,
    submitting,
  }), [openFeedbackModal, closeFeedbackModal, isModalOpen, currentRequest, submitting]);

  return (
    <FeedbackContext.Provider value={contextValue}>
      {children}
      <FeedbackRequestModal
        open={isModalOpen}
        request={currentRequest}
        submitting={submitting}
        submitError={submitError}
        submitSuccess={submitSuccess}
        onClose={closeFeedbackModal}
        onSubmit={handleSubmit}
      />
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => useContext(FeedbackContext);

export default FeedbackContext;
