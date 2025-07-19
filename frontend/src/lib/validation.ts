import { ValidationRules } from '@/hooks/useForm';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Username validation regex (letters, numbers, underscores only)
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

// Validation rules for login form (accepts username, email, or phone)
export const loginValidationRules: ValidationRules = {
  email: {
    required: true,
    minLength: 1,
    custom: (value: string) => {
      if (!value.trim()) {
        return 'Username, email or mobile number is required';
      }
      return null;
    }
  },
  password: {
    required: true,
    minLength: 1,
    custom: (value: string) => {
      if (!value.trim()) {
        return 'Password is required';
      }
      return null;
    }
  }
};

// Validation rules for registration form
export const registerValidationRules: ValidationRules = {
  email: {
    required: true,
    pattern: EMAIL_REGEX,
    custom: (value: string) => {
      if (!EMAIL_REGEX.test(value)) {
        return 'Please enter a valid email address';
      }
      return null;
    }
  },
  username: {
    required: true,
    minLength: 3,
    maxLength: 30,
    pattern: USERNAME_REGEX,
    custom: (value: string) => {
      if (value.length < 3) {
        return 'Username must be at least 3 characters long';
      }
      if (value.length > 30) {
        return 'Username must be no more than 30 characters long';
      }
      if (!USERNAME_REGEX.test(value)) {
        return 'Username can only contain letters, numbers, and underscores';
      }
      return null;
    }
  },
  fullName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    custom: (value: string) => {
      const trimmed = value.trim();
      if (trimmed.length < 2) {
        return 'Full name must be at least 2 characters long';
      }
      if (trimmed.length > 50) {
        return 'Full name must be no more than 50 characters long';
      }
      return null;
    }
  },
  password: {
    required: true,
    minLength: 6,
    custom: (value: string) => {
      if (value.length < 6) {
        return 'Password must be at least 6 characters long';
      }
      return null;
    }
  }
};

// Validation rules for forgot password form
export const forgotPasswordValidationRules: ValidationRules = {
  email: {
    required: true,
    pattern: EMAIL_REGEX,
    custom: (value: string) => {
      if (!EMAIL_REGEX.test(value)) {
        return 'Please enter a valid email address';
      }
      return null;
    }
  },
  newPassword: {
    required: true,
    minLength: 6,
    custom: (value: string) => {
      if (value.length < 6) {
        return 'Password must be at least 6 characters long';
      }
      return null;
    }
  },
  confirmPassword: {
    required: true,
    minLength: 6,
    custom: (value: string) => {
      if (value.length < 6) {
        return 'Password must be at least 6 characters long';
      }
      return null;
    }
  }
};

// Custom validation for password confirmation
export const validatePasswordConfirmation = (password: string, confirmPassword: string): string => {
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return '';
};

// General validation utilities
export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const validateUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 30 && USERNAME_REGEX.test(username);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateFullName = (fullName: string): boolean => {
  const trimmed = fullName.trim();
  return trimmed.length >= 2 && trimmed.length <= 50;
};

// Form validation helpers
export const getFieldError = (fieldName: string, value: string, rules: ValidationRules): string => {
  const rule = rules[fieldName];
  if (!rule) return '';

  // Required validation
  if (rule.required && !value.trim()) {
    return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
  }

  // Skip other validations if field is empty and not required
  if (!value.trim() && !rule.required) {
    return '';
  }

  // Min length validation
  if (rule.minLength && value.length < rule.minLength) {
    return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${rule.minLength} characters`;
  }

  // Max length validation
  if (rule.maxLength && value.length > rule.maxLength) {
    return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be no more than ${rule.maxLength} characters`;
  }

  // Pattern validation
  if (rule.pattern && !rule.pattern.test(value)) {
    return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} format is invalid`;
  }

  // Custom validation
  if (rule.custom) {
    const customError = rule.custom(value);
    if (customError) return customError;
  }

  return '';
};
