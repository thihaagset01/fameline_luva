import { useState, useCallback } from 'react';
import { FormData } from '@/types';
import { DEFAULT_FORM_DATA, VALIDATION } from '@/utils/constants';

export const useFormData = () => {
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);

  const updateFormData = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetFormData = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA);
  }, []);

  const validateField = useCallback((field: keyof FormData, value: string): string | null => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length < VALIDATION.name.minLength) return `Name must be at least ${VALIDATION.name.minLength} characters`;
        if (value.length > VALIDATION.name.maxLength) return `Name must be less than ${VALIDATION.name.maxLength} characters`;
        return null;

      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!VALIDATION.email.pattern.test(value)) return 'Please enter a valid email address';
        return null;

      case 'location':
        if (!value.trim()) return 'Location is required';
        if (value.length < VALIDATION.location.minLength) return `Location must be at least ${VALIDATION.location.minLength} characters`;
        return null;

      case 'environment':
        if (!value) return 'Environment is required';
        return null;

      case 'purpose':
        if (!value) return 'Purpose is required';
        return null;

      case 'buildingType':
        if (!value) return 'Building type is required';
        return null;

      case 'buildingHeight':
        if (!value) return 'Building height is required';
        return null;

      case 'louverApplication':
        if (!value) return 'Please select an application';
        return null;

      case 'airflowRequirement':
        if (!value) return 'Please select airflow requirement';
        return null;

      case 'waterTolerance':
        if (!value) return 'Please select water tolerance';
        return null;

      default:
        return null;
    }
  }, []);

  const getFieldErrors = useCallback((step: number): Record<string, string> => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 0: // User Info
        const nameError = validateField('name', formData.name);
        const emailError = validateField('email', formData.email);
        if (nameError) errors.name = nameError;
        if (emailError) errors.email = emailError;
        break;

      case 1: // Location
        const locationError = validateField('location', formData.location);
        if (locationError) errors.location = locationError;
        break;

      case 2: // Project Context
        // Check for guided selection fields first
        if (formData.louverApplication) {
          // If using guided selection, validate those fields
          if (!formData.louverApplication) errors.louverApplication = 'Please select an application';
          if (!formData.airflowRequirement) errors.airflowRequirement = 'Please select airflow requirement';
          if (!formData.waterTolerance) errors.waterTolerance = 'Please select water tolerance';
        } else {
          // Fall back to legacy fields
          const purposeError = validateField('purpose', formData.purpose);
          const buildingTypeError = validateField('buildingType', formData.buildingType);
          const buildingHeightError = validateField('buildingHeight', formData.buildingHeight);
          if (purposeError) errors.purpose = purposeError;
          if (buildingTypeError) errors.buildingType = buildingTypeError;
          if (buildingHeightError) errors.buildingHeight = buildingHeightError;
        }
        break;

      case 3: // Aesthetics
        // All fields are optional or have defaults
        break;
    }

    return errors;
  }, [formData, validateField]);

  const isStepValid = useCallback((step: number): boolean => {
    const errors = getFieldErrors(step);
    return Object.keys(errors).length === 0;
  }, [getFieldErrors]);

  const getCompletionPercentage = useCallback((): number => {
    const requiredFields = [
      'name', 'email', 'location', 
      'purpose', 'buildingType', 'buildingHeight'
    ];
    
    const completedFields = requiredFields.filter(field => {
      const value = formData[field as keyof FormData];
      return value && value.toString().trim() !== '';
    });

    return Math.round((completedFields.length / requiredFields.length) * 100);
  }, [formData]);

  return {
    formData,
    updateFormData,
    resetFormData,
    isStepValid,
    getFieldErrors,
    validateField,
    getCompletionPercentage
  };
};