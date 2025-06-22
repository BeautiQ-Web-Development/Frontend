// Complete implementations for service provider registration

// Service management functions
const addService = () => {
  const newService = {
    serviceName: '',
    serviceType: '',
    targetAudience: '',
    serviceSubType: '',
    detailedDescription: '',
    duration: 60,
    experienceLevel: 'beginner',
    pricing: {
      basePrice: '',
      priceType: 'fixed'
    },
    serviceLocation: 'both',
    images: [],
    customNotes: '',
    preparationRequired: '',
    cancellationPolicy: '24 hours notice required',
    minLeadTime: 2,
    maxLeadTime: 30,
    isActive: true
  };
  
  setFormData(prev => ({
    ...prev,
    services: [...prev.services, newService]
  }));
};

const removeService = (serviceIndex) => {
  if (formData.services.length > 1) {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, index) => index !== serviceIndex)
    }));
  }
};

const handleServiceChange = (serviceIndex, field, value) => {
  setFormData(prev => ({
    ...prev,
    services: prev.services.map((service, index) => {
      if (index === serviceIndex) {
        if (field.includes('.')) {
          const [parentField, childField] = field.split('.');
          return {
            ...service,
            [parentField]: {
              ...service[parentField],
              [childField]: value
            }
          };
        } else {
          return {
            ...service,
            [field]: value
          };
        }
      }
      return service;
    })
  }));
};

// Package management functions
const addPackage = () => {
  const newPackage = {
    packageName: '',
    packageType: 'bridal',
    targetAudience: 'Women',
    includedServices: [],
    packageDescription: '',
    totalDuration: 180,
    totalPrice: '',
    packageLocation: 'both',
    customNotes: '',
    preparationRequired: '',
    isActive: true
  };
  
  setFormData(prev => ({
    ...prev,
    packages: [...prev.packages, newPackage]
  }));
};

const removePackage = (packageIndex) => {
  if (formData.packages.length > 1) {
    setFormData(prev => ({
      ...prev,
      packages: prev.packages.filter((_, index) => index !== packageIndex)
    }));
  }
};

const handlePackageChange = (packageIndex, field, value) => {
  setFormData(prev => ({
    ...prev,
    packages: prev.packages.map((pkg, index) => {
      if (index === packageIndex) {
        return {
          ...pkg,
          [field]: value
        };
      }
      return pkg;
    })
  }));
};

// Enhanced submit handler
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateStep(activeStep)) {
    setError('Please fix all validation errors');
    setSnackbarOpen(true);
    return;
  }
  
  setLoading(true);
  setError('');
  
  try {
    // Create FormData for file uploads
    const submitData = new FormData();
    
    // Add all form fields except files first
    Object.keys(formData).forEach(key => {
      if (key !== 'nicFrontPhoto' && key !== 'nicBackPhoto' && key !== 'certificatesPhotos' && key !== 'profilePhoto') {
        if (Array.isArray(formData[key]) || typeof formData[key] === 'object') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      }
    });
    
    // Add files
    if (formData.nicFrontPhoto) {
      submitData.append('nicFrontPhoto', formData.nicFrontPhoto);
    }
    if (formData.nicBackPhoto) {
      submitData.append('nicBackPhoto', formData.nicBackPhoto);
    }
    if (formData.profilePhoto) {
      submitData.append('profilePhoto', formData.profilePhoto);
    }
    formData.certificatesPhotos.forEach((file, index) => {
      submitData.append(`certificatesPhotos`, file);
    });
    
    console.log('Submitting FormData with role: serviceProvider');
    
    const response = await register(submitData, 'serviceProvider');
    
    if (response.success) {
      setRegistrationSuccess(true);
      setDialogOpen(true);
    } else {
      setError(response.message || 'Registration failed. Please try again.');
      setSnackbarOpen(true);
    }
  } catch (err) {
    console.error('Registration error:', err);
    setError(err.message || 'Registration failed. Please check your information and try again.');
    setSnackbarOpen(true);
  } finally {
    setLoading(false);
  }
};

// Step content function
const getStepContent = (step) => {
  switch (step) {
    case 0:
      return renderPersonalInfoForm();
    case 1:
      return renderBusinessInfoForm();
    case 2:
      return renderServicesForm();
    case 3:
      return renderPackagesForm();
    case 4:
      return renderPoliciesForm();
    default:
      return 'Unknown step';
  }
};