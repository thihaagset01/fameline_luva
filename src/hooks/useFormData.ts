/**
 * useFormData Hook 📋
 * 
 * This custom hook manages all form data throughout the LouverBoy application wizard.
 * It provides state management, validation, and intelligent defaults for the multi-step form.
 * 
 * Key features:
 * - Form state management across all wizard steps
 * - Field validation with helpful error messages
 * - Intelligent defaults based on selected applications
 * - Progress tracking and completion percentage
 * - Support for both guided selection and legacy fields
 */
import { useState, useCallback } from 'react';
import { FormData, INTELLIGENT_DEFAULTS } from '@/types';
import { DEFAULT_FORM_DATA, VALIDATION } from '@/utils/constants';

/**
 * Main form data management hook
 * 
 * This hook centralizes all form state management and validation logic for the wizard.
 * It's used by the App component and passed down to each step component.
 * 
 * @returns An object containing form state and helper functions
 */
export const useFormData = () => {
  // Main form state that holds all user input across all steps
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);

  /**
   * Update a single field in the form data
   * 
   * This function also handles intelligent defaults - when certain fields change
   * (like louverApplication), it automatically sets recommended values for related fields.
   * 
   * @param field - The form field name to update
   * @param value - The new value for the field
   */
  const updateFormData = useCallback((field: string, value: string) => {
    /*console.log('📝 useFormData - Updating field:', field, 'with value:', value);*/
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      /*console.log('📝 useFormData - New formData:', updated);*/
      // ✨ Auto-populate intelligent defaults when application is selected
      // This makes the form smarter and easier to use - when a user selects an application
      // like "Commercial Ventilation", we automatically set recommended values for airflow
      // and water tolerance based on typical requirements for that application.
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

  /**
   * Reset the form data to default values
   * 
   * Used when the user completes the wizard and wants to start over,
   * or when they explicitly choose to reset their progress.
   */
  const resetFormData = useCallback(() => {
    setFormData(DEFAULT_FORM_DATA);
  }, []);

  /**
   * Validate a single form field
   * 
   * Checks if the given field value meets the required validation rules
   * and returns an error message if it doesn't.
   * 
   * @param field - The form field to validate
   * @param value - The current value of the field
   * @returns Error message if validation fails, null if valid
   */
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

  /**
   * Get all validation errors for a specific step
   * 
   * Each step has different required fields, so this function checks
   * only the relevant fields for the current step.
   * 
   * @param step - The step index to validate (0-5)
   * @returns Object with field names as keys and error messages as values
   */
  const getFieldErrors = useCallback((step: number): Record<string, string> => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 0: // User Info Step (name & email)
        const nameError = validateField('name', formData.name);
        const emailError = validateField('email', formData.email);
        if (nameError) errors.name = nameError;
        if (emailError) errors.email = emailError;
        break;

      case 1: // Location Step (address & environment)
        const locationError = validateField('location', formData.location);
        if (locationError) errors.location = locationError;
        // Environment is optional on location step - can be set later
        break;

      case 2: // Project Context Step (application, airflow, water tolerance)
        // 🔄 Support both new guided selection and legacy fields
        // The app has two ways to collect project requirements:
        // 1. New guided selection (louverApplication, airflowRequirement, waterTolerance)
        // 2. Legacy fields (purpose, buildingType) for backward compatibility
        
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

      case 3: // Aesthetics Step (appearance preferences)
        // All fields are optional or have defaults
        break;

      case 4: // Recommendation Step (louver selection)
        // Validation handled by recommendation engine
        break;

      case 5: // Summary Step (final review)
        // No validation needed
        break;
    }

    return errors;
  }, [formData, validateField]);

  /**
   * Check if a step has valid data
   * 
   * Used to enable/disable the next button in the wizard.
   * 
   * @param step - The step index to check
   * @returns True if the step has no validation errors
   */
  const isStepValid = useCallback((step: number): boolean => {
    const errors = getFieldErrors(step);
    return Object.keys(errors).length === 0;
  }, [getFieldErrors]);

  /**
   * Calculate the overall form completion percentage
   * 
   * This is used for progress tracking and can be displayed to the user.
   * It checks all required fields across all steps.
   * 
   * @returns Percentage of required fields that are completed (0-100)
   */
  const getCompletionPercentage = useCallback((): number => {
    // 📊 Check for either guided selection or legacy fields
    // We support both input methods, so we need to check if either set is complete
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

  /**
   * Check if we have enough data to generate recommendations
   * 
   * This determines if the recommendation engine has sufficient information
   * to provide meaningful louver suggestions.
   * 
   * @returns True if we have enough data for recommendations
   */
  const getRecommendationReadiness = useCallback((): boolean => {
    // Check if we have enough data for recommendations
    const hasBasicInfo = formData.name && formData.email && formData.location;
    const hasApplicationInfo = formData.louverApplication && formData.airflowRequirement && formData.waterTolerance;
    const hasLegacyInfo = formData.purpose && formData.buildingType;
    
    return !!(hasBasicInfo && (hasApplicationInfo || hasLegacyInfo));
  }, [formData]);

  /**
   * Get intelligent defaults for a specific application
   * 
   * Retrieves the recommended settings for airflow, water tolerance, etc.
   * based on the selected application type.
   * 
   * @param applicationId - The application ID to get defaults for
   * @returns Default settings for the application or undefined
   */
  const getIntelligentDefaults = useCallback((applicationId: string) => {
    return INTELLIGENT_DEFAULTS[applicationId as keyof typeof INTELLIGENT_DEFAULTS];
  }, []);

  /**
   * Update multiple form fields at once
   * 
   * Useful when you need to update several related fields together,
   * such as when loading saved data or applying a template.
   * 
   * @param updates - Object with field names and values to update
   */
  const updateFormDataBatch = useCallback((updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    formData,              // The current state of all form fields
    updateFormData,         // Update a single field
    updateFormDataBatch,    // Update multiple fields at once
    resetFormData,          // Reset all fields to defaults
    isStepValid,            // Check if a step has valid data
    getFieldErrors,         // Get validation errors for a step
    validateField,          // Validate a single field
    getCompletionPercentage, // Calculate overall completion %
    getRecommendationReadiness, // Check if we can generate recommendations
    getIntelligentDefaults  // Get defaults for an application
  };
};