// Validation utilities for form inputs

export const validateEmail = (email) => {
  const errors = [];
  
  if (!email) {
    errors.push('Email is required');
    return errors;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return errors;
};

export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('Password is required');
    return errors;
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }
  
  return errors;
};

export const validateMobileNumber = (mobile) => {
  const errors = [];
  
  if (!mobile) {
    errors.push('Mobile number is required');
    return errors;
  }
  
  // Remove all non-digit characters for validation
  const cleanedMobile = mobile.replace(/\D/g, '');
  
  // Sri Lankan mobile number patterns
  const patterns = [
    /^94[7][0-9]{8}$/, // +94 format
    /^0[7][0-9]{8}$/, // 0 format
    /^[7][0-9]{8}$/ // without prefix
  ];
  
  const isValid = patterns.some(pattern => pattern.test(cleanedMobile));
  
  if (!isValid) {
    errors.push('Please enter a valid Sri Lankan mobile number (e.g., 0771234567 or +94771234567)');
  }
  
  return errors;
};

export const validateNIC = (nic) => {
  const errors = [];
  
  if (!nic) {
    errors.push('NIC number is required');
    return errors;
  }
  
  // Remove whitespace
  const cleanedNIC = nic.trim();
  
  // Old NIC format: 9 digits + V/X
  const oldNICPattern = /^[0-9]{9}[VvXx]$/;
  
  // New NIC format: 12 digits
  const newNICPattern = /^[0-9]{12}$/;
  
  if (!oldNICPattern.test(cleanedNIC) && !newNICPattern.test(cleanedNIC)) {
    errors.push('Please enter a valid NIC number (e.g., 123456789V or 199812345678)');
  }
  
  return errors;
};

export const validateName = (name) => {
  const errors = [];
  
  if (!name || !name.trim()) {
    errors.push('Name is required');
    return errors;
  }
  
  if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if (!/^[a-zA-Z\s.'-]+$/.test(name.trim())) {
    errors.push('Name can only contain letters, spaces, dots, hyphens, and apostrophes');
  }
  
  return errors;
};

export const validateAddress = (address) => {
  const errors = [];
  
  if (!address || !address.trim()) {
    errors.push('Address is required');
    return errors;
  }
  
  if (address.trim().length < 10) {
    errors.push('Please provide a complete address (at least 10 characters)');
  }
  
  return errors;
};

export const validateBusinessName = (businessName) => {
  const errors = [];
  
  if (!businessName || !businessName.trim()) {
    errors.push('Business name is required');
    return errors;
  }
  
  if (businessName.trim().length < 2) {
    errors.push('Business name must be at least 2 characters long');
  }
  
  return errors;
};

export const validateServiceData = (service) => {
  const errors = {};
  
  if (!service.serviceName || !service.serviceName.trim()) {
    errors.serviceName = 'Service name is required';
  }
  
  if (!service.serviceType) {
    errors.serviceType = 'Service type must be selected';
  }
  
  if (!service.targetAudience) {
    errors.targetAudience = 'Target audience must be selected';
  }
  
  if (!service.detailedDescription || !service.detailedDescription.trim()) {
    errors.detailedDescription = 'Detailed description is required';
  }
  
  if (!service.pricing || !service.pricing.basePrice || service.pricing.basePrice <= 0) {
    errors.basePrice = 'Base price must be greater than 0';
  }
  
  return errors;
};
