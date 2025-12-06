import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import FeedbackRequestModal from '../components/FeedbackRequestModal';
import { submitFeedback, checkFeedbackExists } from '../services/feedback';
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
  const [checkingFeedback, setCheckingFeedback] = useState(false);

  const openFeedbackModal = useCallback(async (requestPayload) => {
    if (!requestPayload) return;

    // Check if feedback already exists for this booking
    if (requestPayload.bookingId) {
      setCheckingFeedback(true);
      try {
        const feedbackExists = await checkFeedbackExists(requestPayload.bookingId);
        if (feedbackExists) {
          // Feedback already submitted - show message instead of modal
          setSubmitError('You have already submitted feedback for this booking.');
          setSubmitSuccess(null);
          setCurrentRequest(requestPayload);
          setIsModalOpen(true);
          setCheckingFeedback(false);
          return;
        }
      } catch (error) {
        console.error('Error checking feedback existence:', error);
        // Continue to open modal if check fails
      }
      setCheckingFeedback(false);
    }

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
    // Get the user ID - can be either 'id' or 'userId' depending on context
    const userId = user?.userId || user?.id || user?._id;
    
    if (!currentRequest || !userId) {
      console.error('Missing feedback submission details:', { 
        hasCurrentRequest: !!currentRequest, 
        userId,
        user 
      });
      setSubmitError('Missing details required to submit feedback.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload = {
        bookingId: currentRequest.bookingId,
        customerId: userId,
        serviceId: currentRequest.serviceId,
        serviceName: currentRequest.serviceName,
        providerId: currentRequest.providerId,
        providerName: currentRequest.providerName,
        scheduledAt: currentRequest.scheduledAt,
        rating,
        feedbackText: feedback, // Backend expects 'feedbackText' field
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
      // Handle duplicate feedback error specifically
      if (error.message?.includes('already submitted') || error.message?.includes('DUPLICATE_FEEDBACK')) {
        setSubmitError('You have already submitted feedback for this booking. Each booking can only have one feedback.');
      } else {
        setSubmitError(error.message || 'Unable to submit feedback. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }, [currentRequest, notificationsApi, user]);

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
