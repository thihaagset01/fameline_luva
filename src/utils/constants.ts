import { 
    Environment, 
    Purpose, 
    BuildingType, 
    BuildingHeight, 
    SelectOption 
  } from '@/types';
  
  // Step Configuration
  export const STEPS = [
    'User Info',
    'Location', 
    'Project Context',
    'Aesthetics',
    'Recommendation',
    'Summary'
  ];
  
  // Form Options
  export const ENVIRONMENT_OPTIONS: SelectOption[] = [
    { value: 'urban', label: 'Urban' },
    { value: 'coastal', label: 'Coastal' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'suburban', label: 'Suburban' }
  ];
  
  export const PURPOSE_OPTIONS: SelectOption[] = [
    { value: 'ventilation', label: 'Ventilation' },
    { value: 'weather-protection', label: 'Weather Protection' },
    { value: 'acoustic', label: 'Acoustic Attenuation' },
    { value: 'aesthetic', label: 'Aesthetic Integration' }
  ];
  
  export const BUILDING_TYPE_OPTIONS: SelectOption[] = [
    { value: 'commercial', label: 'Commercial' },
    { value: 'residential', label: 'Residential' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' }
  ];
  
  export const BUILDING_HEIGHT_OPTIONS: SelectOption[] = [
    { value: 'low-rise', label: 'Low-rise (1-3 floors)' },
    { value: 'mid-rise', label: 'Mid-rise (4-12 floors)' },
    { value: 'high-rise', label: 'High-rise (13+ floors)' }
  ];
  
  // Performance Grade Scores
  export const GRADE_SCORES = {
    'A': 4,
    'B': 3,
    'C': 2,
    'D': 1
  } as const;
  
  // Rating Values (for scoring)
  export const RATING_SCORES = {
    'Excellent': 4,
    'Very Good': 3,
    'Good': 2,
    'Fair': 1
  } as const;
  
  // Matching Weights for Recommendation Engine
  export const MATCH_WEIGHTS = {
    environment: 0.15,
    purpose: 0.25,
    buildingType: 0.15,
    buildingHeight: 0.10,
    rainDefense: 0.20,
    airflow: 0.15
  } as const;
  
  // Application Colors
  export const COLORS = {
    primary: {
      emerald: '#34d399',
      green: '#10b981'
    },
    secondary: {
      gray: '#6b7280',
      white: '#ffffff'
    },
    accent: {
      orange: '#f97316',
      blue: '#3b82f6'
    }
  } as const;
  
  // Validation Rules
  export const VALIDATION = {
    name: {
      minLength: 2,
      maxLength: 50,
      required: true
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      required: true
    },
    location: {
      minLength: 3,
      maxLength: 100,
      required: true
    }
  } as const;
  
  // Animation Durations
  export const ANIMATION = {
    step: 300,
    button: 200,
    fadeIn: 400
  } as const;
  
  // Default Form Values
  export const DEFAULT_FORM_DATA = {
    name: '',
    email: '',
    location: '',
    environment: '' as Environment,
    purpose: '' as Purpose,
    buildingType: '' as BuildingType,
    buildingHeight: '' as BuildingHeight,
    mullionVisibility: 'visible' as const,
    bladeOrientation: 'horizontal' as const,
    color: '#808080',
    customization: ''
  } as const;