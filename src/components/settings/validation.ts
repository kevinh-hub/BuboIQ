export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateCompanySettings = (settings: any): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!settings.name?.trim()) {
    errors.push({ field: 'name', message: 'Company name is required' });
  }

  if (!settings.supportEmail?.trim()) {
    errors.push({ field: 'supportEmail', message: 'Support email is required' });
  } else if (!validateEmail(settings.supportEmail)) {
    errors.push({ field: 'supportEmail', message: 'Please enter a valid email address' });
  }

  if (settings.website?.trim() && !validateUrl(settings.website)) {
    errors.push({ field: 'website', message: 'Please enter a valid URL' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateSLASettings = (settings: any): ValidationResult => {
  const errors: ValidationError[] = [];

  const validateHours = (value: string, field: string, label: string) => {
    const hours = parseInt(value);
    if (isNaN(hours) || hours <= 0) {
      errors.push({ field, message: `${label} must be a positive number` });
    } else if (hours > 168) {
      errors.push({ field, message: `${label} cannot exceed 168 hours (1 week)` });
    }
  };

  validateHours(settings.highPriority, 'highPriority', 'High priority response time');
  validateHours(settings.mediumPriority, 'mediumPriority', 'Medium priority response time');
  validateHours(settings.lowPriority, 'lowPriority', 'Low priority response time');

  // Validate that high priority < medium priority < low priority
  const high = parseInt(settings.highPriority);
  const medium = parseInt(settings.mediumPriority);
  const low = parseInt(settings.lowPriority);

  if (!isNaN(high) && !isNaN(medium) && high >= medium) {
    errors.push({ field: 'mediumPriority', message: 'Medium priority time must be greater than high priority' });
  }

  if (!isNaN(medium) && !isNaN(low) && medium >= low) {
    errors.push({ field: 'lowPriority', message: 'Low priority time must be greater than medium priority' });
  }

  if (!settings.workingHours?.trim()) {
    errors.push({ field: 'workingHours', message: 'Working hours are required' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateBrandingSettings = (settings: any): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!settings.primaryColor?.trim()) {
    errors.push({ field: 'primaryColor', message: 'Primary color is required' });
  } else if (!/^#[0-9A-F]{6}$/i.test(settings.primaryColor)) {
    errors.push({ field: 'primaryColor', message: 'Please enter a valid hex color (e.g., #00C48C)' });
  }

  if (settings.customDomain?.trim() && !settings.customDomain.includes('.')) {
    errors.push({ field: 'customDomain', message: 'Please enter a valid domain name' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};