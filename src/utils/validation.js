// Enhanced validation utilities

// Password validation
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('Password is required');
    return errors;
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (password.length > 128) {
    errors.push('Password must not exceed 128 characters');
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
  
  if (/\s/.test(password)) {
    errors.push('Password must not contain spaces');
  }
  
  return errors;
};

// Sri Lankan mobile number validation
export const validateMobileNumber = (mobile) => {
  const errors = [];
  
  if (!mobile) {
    errors.push('Mobile number is required');
    return errors;
  }
  
  // Remove all non-digit characters for validation
  const cleanNumber = mobile.replace(/\D/g, '');
  
  // Sri Lankan mobile number patterns
  const patterns = [
    /^0(70|71|72|74|75|76|77|78)\d{7}$/, // Local format: 0771234567
    /^94(70|71|72|74|75|76|77|78)\d{7}$/, // International format: 94771234567
    /^\+94(70|71|72|74|75|76|77|78)\d{7}$/ // International format with +: +94771234567
  ];
  
  const isValid = patterns.some(pattern => pattern.test(mobile.replace(/\s/g, '')));
  
  if (!isValid) {
    errors.push('Please enter a valid Sri Lankan mobile number (e.g., 0771234567, +94771234567)');
  }
  
  if (cleanNumber.length < 9 || cleanNumber.length > 12) {
    errors.push('Mobile number must be between 9-12 digits');
  }
  
  return errors;
};

// Sri Lankan NIC validation
export const validateNIC = (nic) => {
  const errors = [];
  
  if (!nic) {
    errors.push('NIC number is required');
    return errors;
  }
  
  const cleanNIC = nic.trim().toUpperCase();
  
  // Old NIC format: 9 digits + V (e.g., 123456789V)
  const oldNICPattern = /^[0-9]{9}[VX]$/;
  
  // New NIC format: 12 digits (e.g., 199812345678)
  const newNICPattern = /^[0-9]{12}$/;
  
  if (!oldNICPattern.test(cleanNIC) && !newNICPattern.test(cleanNIC)) {
    errors.push('Please enter a valid Sri Lankan NIC (e.g., 123456789V or 199812345678)');
    return errors;
  }
  
  // Additional validation for old format
  if (oldNICPattern.test(cleanNIC)) {
    const yearPart = cleanNIC.substring(0, 2);
    const dayPart = cleanNIC.substring(2, 5);
    
    if (parseInt(dayPart) < 1 || parseInt(dayPart) > 866) {
      errors.push('Invalid day count in NIC number');
    }
  }
  
  // Additional validation for new format
  if (newNICPattern.test(cleanNIC)) {
    const year = cleanNIC.substring(0, 4);
    const dayPart = cleanNIC.substring(4, 7);
    
    if (parseInt(year) < 1900 || parseInt(year) > new Date().getFullYear()) {
      errors.push('Invalid birth year in NIC number');
    }
    
    if (parseInt(dayPart) < 1 || parseInt(dayPart) > 866) {
      errors.push('Invalid day count in NIC number');
    }
  }
  
  return errors;
};

// Email validation
export const validateEmail = (email) => {
  const errors = [];
  
  if (!email) {
    errors.push('Email address is required');
    return errors;
  }
  
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailPattern.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  if (email.length > 254) {
    errors.push('Email address is too long');
  }
  
  return errors;
};

// Name validation
export const validateName = (name, fieldName = 'Name') => {
  const errors = [];
  
  if (!name) {
    errors.push(`${fieldName} is required`);
    return errors;
  }
  
  if (name.trim().length < 2) {
    errors.push(`${fieldName} must be at least 2 characters long`);
  }
  
  if (name.length > 50) {
    errors.push(`${fieldName} must not exceed 50 characters`);
  }
  
  if (!/^[a-zA-Z\s'.,-]+$/.test(name)) {
    errors.push(`${fieldName} can only contain letters, spaces, and common punctuation`);
  }
  
  return errors;
};

// Address validation
export const validateAddress = (address) => {
  const errors = [];
  
  if (!address) {
    errors.push('Address is required');
    return errors;
  }
  
  if (address.trim().length < 10) {
    errors.push('Address must be at least 10 characters long');
  }
  
  if (address.length > 200) {
    errors.push('Address must not exceed 200 characters');
  }
  
  return errors;
};

// Business name validation
export const validateBusinessName = (businessName) => {
  const errors = [];
  
  if (!businessName) {
    errors.push('Business name is required');
    return errors;
  }
  
  if (businessName.trim().length < 2) {
    errors.push('Business name must be at least 2 characters long');
  }
  
  if (businessName.length > 100) {
    errors.push('Business name must not exceed 100 characters');
  }
  
  return errors;
};

// Service validation
export const validateServiceData = (serviceData) => {
  const errors = [];
  
  // Service name validation
  if (!serviceData.name || serviceData.name.trim().length < 3) {
    errors.push('Service name must be at least 3 characters long');
  }
  
  // Service type validation
  if (!serviceData.type) {
    errors.push('Service type is required');
  }
  
  // Service category validation
  if (!serviceData.category) {
    errors.push('Target audience is required');
  }
  
  // Description validation
  if (!serviceData.description || serviceData.description.trim().length < 10) {
    errors.push('Service description must be at least 10 characters long');
  }
  
  // Price validation
  if (!serviceData.pricing?.basePrice || isNaN(parseFloat(serviceData.pricing.basePrice)) || parseFloat(serviceData.pricing.basePrice) <= 0) {
    errors.push('Valid base price is required (must be greater than 0)');
  }
  
  // Duration validation
  if (!serviceData.duration || isNaN(parseInt(serviceData.duration)) || parseInt(serviceData.duration) < 15) {
    errors.push('Service duration must be at least 15 minutes');
  }
  
  return errors;
};

// Service provider registration validation
export const validateServiceProviderRegistration = (formData) => {
  const errors = {};
  
  // Personal Information
  const nameErrors = validateName(formData.fullName, 'Full name');
  if (nameErrors.length > 0) errors.fullName = nameErrors[0];
  
  const emailErrors = validateEmail(formData.emailAddress);
  if (emailErrors.length > 0) errors.emailAddress = emailErrors[0];
  
  const mobileErrors = validateMobileNumber(formData.mobileNumber);
  if (mobileErrors.length > 0) errors.mobileNumber = mobileErrors[0];
  
  if (formData.recoveryMobileNumber) {
    const recoveryMobileErrors = validateMobileNumber(formData.recoveryMobileNumber);
    if (recoveryMobileErrors.length > 0) errors.recoveryMobileNumber = recoveryMobileErrors[0];
  }
  
  const nicErrors = validateNIC(formData.nicNumber);
  if (nicErrors.length > 0) errors.nicNumber = nicErrors[0];
  
  const passwordErrors = validatePassword(formData.password);
  if (passwordErrors.length > 0) errors.password = passwordErrors[0];
  
  const currentAddressErrors = validateAddress(formData.currentAddress);
  if (currentAddressErrors.length > 0) errors.currentAddress = currentAddressErrors[0];
  
  const homeAddressErrors = validateAddress(formData.homeAddress);
  if (homeAddressErrors.length > 0) errors.homeAddress = homeAddressErrors[0];
  
  // Business Information
  const businessNameErrors = validateBusinessName(formData.businessName);
  if (businessNameErrors.length > 0) errors.businessName = businessNameErrors[0];
  
  if (!formData.businessType) {
    errors.businessType = 'Business type is required';
  }
  
  if (!formData.city || formData.city.trim().length < 2) {
    errors.city = 'City is required and must be at least 2 characters';
  }
  
  // Document validation
  if (!formData.nicFrontPhoto) {
    errors.nicFrontPhoto = 'NIC front photo is required';
  }
  
  if (!formData.nicBackPhoto) {
    errors.nicBackPhoto = 'NIC back photo is required';
  }
  
  if (!formData.certificatesPhotos || formData.certificatesPhotos.length === 0) {
    errors.certificatesPhotos = 'At least one certificate or skill proof photo is required';
  }
  
  // Services validation
  if (!formData.services || formData.services.length === 0) {
    errors.services = 'At least one service must be provided';
  } else {
    formData.services.forEach((service, index) => {
      const serviceErrors = validateServiceData(service);
      if (serviceErrors.length > 0) {
        errors[`service_${index}`] = serviceErrors[0];
      }
    });
  }
  
  // Terms agreement
  if (!formData.agreeToTerms) {
    errors.agreeToTerms = 'You must agree to the terms and conditions';
  }
  
  return errors;
};

// File type validation
export const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']) => {
  const errors = [];
  
  if (!file) {
    errors.push('File is required');
    return errors;
  }
  
  if (!allowedTypes.includes(file.type)) {
    errors.push(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    errors.push('File size must be less than 5MB');
  }
  
  return errors;
};

// Format phone number for display
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format Sri Lankan numbers
  if (cleaned.startsWith('94')) {
    return `+94 ${cleaned.substring(2, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
  } else if (cleaned.startsWith('0')) {
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 6)} ${cleaned.substring(6)}`;
  }
  
  return phoneNumber;
};

// Format NIC for display
export const formatNIC = (nic) => {
  if (!nic) return '';
  
  const cleaned = nic.trim().toUpperCase();
  
  // Old format: 123456789V
  if (cleaned.length === 10) {
    return `${cleaned.substring(0, 9)}${cleaned.substring(9)}`;
  }
  
  // New format: 199812345678
  if (cleaned.length === 12) {
    return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 8)} ${cleaned.substring(8)}`;
  }
  
  return nic;
};

// Format error messages for display
export const formatValidationErrors = (errors) => {
  if (typeof errors === 'string') return errors;
  if (Array.isArray(errors)) return errors.join(', ');
  if (typeof errors === 'object') {
    return Object.values(errors).flat().join(', ');
  }
  return 'Validation error occurred';
};
