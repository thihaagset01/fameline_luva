import { useState, useCallback } from 'react';
import { FormData, INTELLIGENT_DEFAULTS } from '@/types';
import { DEFAULT_FORM_DATA, VALIDATION } from '@/utils/constants';

export const useFormData = () => {
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);

  const updateFormData = useCallback((field: string, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-populate intelligent defaults when application is selected
      if (field === 'louverApplication' && value) {
        const defaults = INTELLIGENT_DEFAULTS[value as keyof typeof INTELLIGENT_DEFAULTS];
        if (defaults) {
          return {
            ...updated,
            airflowRequirement: defaults.airflow,
            waterTolerance: defaults.water,
            // Update legacy fields for backward compatibility
            purpose: defaults.legacyPurpose,
            buildingType: defaults.legacyBuildingType,
            buildingHeight: 'mid-rise' // Default height
          };
        }
      }
      
      return updated;
    });
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

      // New guided selection validation
      case 'louverApplication':
        if (!value) return 'Please select an application';
        return null;

      case 'airflowRequirement':
        if (!value) return 'Please select airflow requirement';
        return null;

      case 'waterTolerance':
        if (!value) return 'Please select water tolerance';
        return null;

      // Legacy field validation (for backward compatibility)
      case 'purpose':
        if (!value) return 'Purpose is required';
        return null;

      case 'buildingType':
        if (!value) return 'Building type is required';
        return null;

      case 'buildingHeight':
        if (!value) return 'Building height is required';
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
        // Environment is optional on location step - can be set later
        break;

      case 2: // Project Context
        // Prioritize guided selection fields
        if (formData.louverApplication) {
          // Using guided selection - validate new fields
          if (!formData.louverApplication) errors.louverApplication = 'Please select an application';
          if (!formData.airflowRequirement) errors.airflowRequirement = 'Please select airflow requirement';
          if (!formData.waterTolerance) errors.waterTolerance = 'Please select water tolerance';
        } else {
          // Fall back to legacy fields if guided selection not used
          const purposeError = validateField('purpose', formData.purpose);
          const buildingTypeError = validateField('buildingType', formData.buildingType);
          if (purposeError) errors.purpose = purposeError;
          if (buildingTypeError) errors.buildingType = buildingTypeError;
        }
        break;

      case 3: // Aesthetics
        // All fields are optional or have defaults
        break;

      case 4: // Recommendation
        // Validation handled by recommendation engine
        break;

      case 5: // Summary
        // No validation needed
        break;
    }

    return errors;
  }, [formData, validateField]);

  const isStepValid = useCallback((step: number): boolean => {
    const errors = getFieldErrors(step);
    return Object.keys(errors).length === 0;
  }, [getFieldErrors]);

  const getCompletionPercentage = useCallback((): number => {
    // Check for either guided selection or legacy fields
    const hasGuidedSelection = formData.louverApplication && formData.airflowRequirement && formData.waterTolerance;
    const hasLegacyFields = formData.purpose && formData.buildingType && formData.buildingHeight;
    
    const requiredFields = [
      'name', 
      'email', 
      'location',
      hasGuidedSelection || hasLegacyFields ? 'projectContext' : ''
    ].filter(Boolean);
    
    const completedFields = requiredFields.filter(field => {
      if (field === 'projectContext') {
        return hasGuidedSelection || hasLegacyFields;
      }
      const value = formData[field as keyof FormData];
      return value && value.toString().trim() !== '';
    });

    return Math.round((completedFields.length / requiredFields.length) * 100);
  }, [formData]);

  const getRecommendationReadiness = useCallback((): boolean => {
    // Check if we have enough data for recommendations
    const hasBasicInfo = formData.name && formData.email && formData.location;
    const hasApplicationInfo = formData.louverApplication && formData.airflowRequirement && formData.waterTolerance;
    const hasLegacyInfo = formData.purpose && formData.buildingType;
    
    return !!(hasBasicInfo && (hasApplicationInfo || hasLegacyInfo));
  }, [formData]);

  const getIntelligentDefaults = useCallback((applicationId: string) => {
    return INTELLIGENT_DEFAULTS[applicationId as keyof typeof INTELLIGENT_DEFAULTS];
  }, []);

  const updateFormDataBatch = useCallback((updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    formData,
    updateFormData,
    updateFormDataBatch,
    resetFormData,
    isStepValid,
    getFieldErrors,
    validateField,
    getCompletionPercentage,
    getRecommendationReadiness,
    getIntelligentDefaults
  };
};