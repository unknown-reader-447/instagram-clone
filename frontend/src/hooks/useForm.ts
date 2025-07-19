import { useState, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationRules {
  [key: string]: ValidationRule;
}

export interface FormErrors {
  [key: string]: string;
}

export interface UseFormReturn<T> {
  values: T;
  errors: FormErrors;
  isValid: boolean;
  isSubmitting: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (onSubmit: (values: T) => Promise<void> | void) => (e: React.FormEvent) => Promise<void>;
  setFieldValue: (field: keyof T, value: string) => void;
  setFieldError: (field: keyof T, error: string) => void;
  clearErrors: () => void;
  reset: () => void;
  setSubmitting: (submitting: boolean) => void;
}

export function useForm<T extends Record<string, string>>(
  initialValues: T,
  validationRules: ValidationRules = {}
): UseFormReturn<T> {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate a single field
  const validateField = useCallback((name: string, value: string): string => {
    const rules = validationRules[name];
    if (!rules) return '';

    // Required validation
    if (rules.required && !value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value.trim() && !rules.required) {
      return '';
    }

    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rules.minLength} characters`;
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be no more than ${rules.maxLength} characters`;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} format is invalid`;
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) return customError;
    }

    return '';
  }, [validationRules]);

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    Object.keys(values).forEach((key) => {
      const error = validateField(key, values[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Handle form submission
  const handleSubmit = useCallback((onSubmit: (values: T) => Promise<void> | void) => {
    return async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (isSubmitting) return;
      
      const isValid = validateForm();
      if (!isValid) return;
      
      setIsSubmitting(true);
      
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, isSubmitting, validateForm]);

  // Set field value programmatically
  const setFieldValue = useCallback((field: keyof T, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field as string]) {
      setErrors(prev => ({ ...prev, [field as string]: '' }));
    }
  }, [errors]);

  // Set field error programmatically
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field as string]: error }));
  }, []);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set submitting state
  const setSubmitting = useCallback((submitting: boolean) => {
    setIsSubmitting(submitting);
  }, []);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0 && Object.values(errors).every(error => !error);

  return {
    values,
    errors,
    isValid,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldError,
    clearErrors,
    reset,
    setSubmitting
  };
}
