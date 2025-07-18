import { 
  Environment, 
  Purpose, 
  BuildingType, 
  BuildingHeight, 
  LouverApplication,
  AirflowRequirement,
  WaterTolerance,
  SelectOption,
  ApplicationOption,
  SelectionOption
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

// Legacy Form Options (for backward compatibility)
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

// Enhanced Application Options for Guided Selection
export const LOUVER_APPLICATIONS: ApplicationOption[] = [
  {
    id: 'mission-critical',
    name: 'Mission Critical',
    description: 'Data centers, hospitals, critical infrastructure',
    icon: '🏥',
    examples: ['Data centers', 'Server rooms', 'Medical facilities', 'Clean rooms'],
    colorClass: 'application-card-critical',
    defaultAirflow: 'maximum',
    defaultWater: 'zero',
    reasoning: 'Critical equipment requires maximum airflow for cooling and zero water penetration for protection'
  },
  {
    id: 'commercial-general',
    name: 'Commercial General', 
    description: 'Office buildings, retail, standard commercial',
    icon: '🏢',
    examples: ['Office buildings', 'Retail spaces', 'Shopping centers', 'Hotels'],
    colorClass: 'application-card-commercial',
    defaultAirflow: 'good',
    defaultWater: 'minimal',
    reasoning: 'Commercial spaces need balanced performance with good protection against weather'
  },
  {
    id: 'industrial-warehouse',
    name: 'Industrial & Warehouse',
    description: 'Manufacturing, storage, industrial facilities', 
    icon: '🏭',
    examples: ['Manufacturing plants', 'Warehouses', 'Distribution centers', 'Factories'],
    colorClass: 'application-card-industrial',
    defaultAirflow: 'good',
    defaultWater: 'moderate',
    reasoning: 'Industrial environments can handle moderate water exposure while maintaining good airflow'
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    description: 'Transportation, utilities, public facilities',
    icon: '🚇',
    examples: ['MRT stations', 'Airports', 'Utility buildings', 'Public facilities'],
    colorClass: 'application-card-infrastructure',
    defaultAirflow: 'good',
    defaultWater: 'minimal',
    reasoning: 'Public infrastructure requires reliable performance with good weather protection'
  },
  {
    id: 'screening-aesthetic',
    name: 'Screening & Aesthetic',
    description: 'Equipment screening, architectural features',
    icon: '🎨',
    examples: ['Equipment screening', 'Architectural features', 'Facade elements', 'Privacy screens'],
    colorClass: 'application-card-aesthetic',
    defaultAirflow: 'basic',
    defaultWater: 'moderate',
    reasoning: 'Aesthetic applications prioritize visual appeal with basic functional requirements'
  },
  {
    id: 'specialized-acoustic',
    name: 'Specialized Acoustic',
    description: 'Sound-sensitive environments requiring noise control',
    icon: '🔇',
    examples: ['Recording studios', 'Libraries', 'Residential areas', 'Schools'],
    colorClass: 'application-card-acoustic',
    defaultAirflow: 'good',
    defaultWater: 'minimal',
    reasoning: 'Acoustic environments need balanced airflow while minimizing water ingress that could affect acoustics'
  }
];

// Airflow Requirement Options
export const AIRFLOW_OPTIONS: SelectionOption[] = [
  {
    id: 'basic',
    name: 'Basic Airflow',
    description: 'Minimal ventilation needs',
    technicalNote: 'Lower airflow coefficient, cost-effective solution',
    icon: '💨',
    performance: 'Low'
  },
  {
    id: 'good', 
    name: 'Good Airflow',
    description: 'Standard ventilation requirements',
    technicalNote: 'Balanced airflow performance for most applications',
    icon: '🌬️',
    performance: 'Medium'
  },
  {
    id: 'maximum',
    name: 'Maximum Airflow',
    description: 'High ventilation/cooling needs',
    technicalNote: 'High airflow coefficient, premium performance',
    icon: '🌪️',
    performance: 'High'
  }
];

// Water Tolerance Options
export const WATER_TOLERANCE_OPTIONS: SelectionOption[] = [
  {
    id: 'zero',
    name: 'Zero Tolerance',
    description: 'Mission critical equipment protection',
    technicalNote: 'Class A rain defense, maximum water resistance',
    icon: '🛡️',
    protection: 'Maximum'
  },
  {
    id: 'minimal',
    name: 'Minimal Water',
    description: 'Light spray/mist acceptable',
    technicalNote: 'Class B rain defense, good water resistance',
    icon: '☔',
    protection: 'Good'
  },
  {
    id: 'moderate',
    name: 'Moderate Protection',
    description: 'Light rain acceptable',
    technicalNote: 'Class C/D rain defense, standard protection',
    icon: '🌧️',
    protection: 'Standard'
  }
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

// Legacy Matching Weights (kept for compatibility)
export const MATCH_WEIGHTS = {
  environment: 0.15,
  purpose: 0.25,
  buildingType: 0.15,
  buildingHeight: 0.10,
  rainDefense: 0.20,
  airflow: 0.15
} as const;

// Enhanced Scoring Weights (for new algorithm)
export const ENHANCED_WEIGHTS = {
  application: 0.40,        // Primary application - 40%
  airflowRequirement: 0.25, // Airflow performance - 25%
  waterTolerance: 0.20,     // Water protection - 20%
  environment: 0.10,        // Environmental factors - 10%
  specialFactors: 0.05      // Context adjustments - 5%
} as const;

// Louver Model Performance Characteristics
export const MODEL_CHARACTERISTICS = {
  'PL-2250': {
    strengths: ['Maximum airflow', 'Excellent rain defense', 'High performance'],
    applications: ['Data centers', 'Critical facilities', 'High-rise buildings'],
    specifications: { pitch: 50, depth: 225, banks: 2 }
  },
  'PL-2250V': {
    strengths: ['Vertical orientation', 'Good rain defense', 'Equipment screening'],
    applications: ['Equipment screening', 'Vertical applications', 'Industrial'],
    specifications: { pitch: 50, depth: 225, banks: 2 }
  },
  'PL-2075': {
    strengths: ['Balanced performance', 'Architectural integration', 'Cost-effective'],
    applications: ['Commercial buildings', 'Office complexes', 'Mixed-use'],
    specifications: { pitch: 75, depth: 200, banks: 2 }
  },
  'PL-1075': {
    strengths: ['Aesthetic appeal', 'Single bank design', 'Economical'],
    applications: ['Residential', 'Light commercial', 'Architectural features'],
    specifications: { pitch: 75, depth: 100, banks: 1 }
  },
  'PL-3075': {
    strengths: ['Triple bank', 'Maximum protection', 'Heavy-duty'],
    applications: ['Industrial', 'Harsh environments', 'High exposure'],
    specifications: { pitch: 75, depth: 300, banks: 3 }
  },
  'AC-150': {
    strengths: ['Acoustic performance', 'Noise reduction', 'Single bank'],
    applications: ['Schools', 'Hospitals', 'Quiet zones'],
    specifications: { pitch: 150, depth: 150, banks: 1 }
  },
  'AC-300': {
    strengths: ['Maximum acoustic', 'Superior noise control', 'Double bank'],
    applications: ['Recording studios', 'Critical acoustic environments'],
    specifications: { pitch: 150, depth: 300, banks: 2 }
  }
} as const;

// Rain Defense Class Standards (BS EN 13030:2001)
export const RAIN_DEFENSE_STANDARDS = {
  'A': { effectiveness: '99-100%', penetration: '≤0.75 l/h/m²', description: 'Excellent protection' },
  'B': { effectiveness: '95-98.9%', penetration: '≤3.75 l/h/m²', description: 'Very good protection' },
  'C': { effectiveness: '80-94.9%', penetration: '≤15.00 l/h/m²', description: 'Good protection' },
  'D': { effectiveness: '<80%', penetration: '>15.00 l/h/m²', description: 'Basic protection' }
} as const;

// Airflow Class Standards
export const AIRFLOW_CLASS_STANDARDS = {
  1: { coefficient: '0.4-1.0', rating: 'Excellent', description: 'Lowest resistance' },
  2: { coefficient: '0.3-0.399', rating: 'Very Good', description: 'Low resistance' },
  3: { coefficient: '0.2-0.299', rating: 'Good', description: 'Moderate resistance' },
  4: { coefficient: '≤0.199', rating: 'Fair', description: 'Higher resistance' }
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
  },
  applications: {
    critical: '#ef4444',
    commercial: '#3b82f6',
    industrial: '#6b7280',
    infrastructure: '#10b981',
    aesthetic: '#8b5cf6',
    acoustic: '#4f46e5'
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
  fadeIn: 400,
  substep: 500
} as const;

// Enhanced Default Form Values
export const DEFAULT_FORM_DATA = {
  name: '',
  email: '',
  location: '',
  environment: '' as Environment,
  // New guided selection fields
  louverApplication: '' as LouverApplication,
  airflowRequirement: '' as AirflowRequirement,
  waterTolerance: '' as WaterTolerance,
  // Legacy fields (for backward compatibility)
  purpose: '' as Purpose,
  buildingType: '' as BuildingType,
  buildingHeight: '' as BuildingHeight,
  // Aesthetics
  mullionVisibility: 'visible' as const,
  bladeOrientation: 'horizontal' as const,
  color: '#10b981',
  customization: ''
} as const;

// Confidence Level Mapping
export const CONFIDENCE_LEVELS = {
  HIGH: { min: 85, label: 'High', color: '#10b981', description: 'Excellent match' },
  MEDIUM: { min: 70, label: 'Medium', color: '#f59e0b', description: 'Good match' },
  LOW: { min: 0, label: 'Low', color: '#ef4444', description: 'Basic match' }
} as const;

// Weather Integration Constants
export const WEATHER_FACTORS = {
  windSpeedThresholds: {
    low: 10,    // m/s
    medium: 20, // m/s
    high: 30    // m/s
  },
  rainfallThresholds: {
    low: 5,     // mm/day
    medium: 15, // mm/day
    high: 30    // mm/day
  }
} as const;