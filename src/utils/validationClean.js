// Clean validation utility functions for registration

export const validateEmail = (email) => {
  const errors = [];
  if (!email) {
    errors.push('Email is required');
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.push('Email format is invalid');
  }
  return errors;
};

export const validateMobileNumber = (mobile) => {
  const errors = [];
  if (!mobile) {
    errors.push('Mobile number is required');
  } else if (!/^(\+94|94|0)?[1-9]\d{8}$/.test(mobile.replace(/\s/g, ''))) {
    errors.push('Invalid mobile number format');
  }
  return errors;
};

export const validateNIC = (nic) => {
  const errors = [];
  if (!nic) {
    errors.push('NIC number is required');
  } else if (!/^(\d{9}[vVxX]|\d{12})$/.test(nic)) {
    errors.push('Invalid NIC format');
  }
  return errors;
};

export const validatePassword = (password) => {
  const errors = [];
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
    errors.push('Password must contain uppercase, lowercase, number and special character');
  }
  return errors;
};