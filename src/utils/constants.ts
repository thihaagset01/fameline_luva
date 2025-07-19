/**
 * Constants.ts - Application Configuration Hub 📊
 *
 * This file serves as the central repository for all application constants,
 * configuration values, and data structures used throughout the LouverBoy app.
 *
 * It contains:
 * - Wizard step definitions
 * - Form options and selections
 * - Application categories and their properties
 * - Performance standards and specifications
 * - Validation rules
 * - Default values
 * - Color schemes and theme values
 *
 * When modifying this file, please keep related constants grouped together
 * and maintain the existing organization to help other developers find what they need.
 */
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

/**
 * Wizard Step Configuration 💼
 * 
 * Defines the sequence and names of steps in the application wizard.
 * These values are used for navigation, progress tracking, and UI display.
 * 
 * The wizard follows this sequence:
 * 1. User Info - Collect basic contact information
 * 2. Location - Get project location and environment
 * 3. Project Context - Understand application needs and requirements
 * 4. Aesthetics - Capture design preferences
 * 5. Recommendation - Show suggested louver models
 * 6. Summary - Final overview and submission
 */
export const STEPS = [
  'User Info',
  'Location', 
  'Project Context',
  'Aesthetics',
  'Recommendation',
  'Summary'
];

/**
 * Environment Options 🌍
 * 
 * Defines the possible environmental contexts for louver installation.
 * The environment affects recommendations for water resistance and durability.
 * 
 * Note: These are part of the legacy form system but still supported.
 */
export const ENVIRONMENT_OPTIONS: SelectOption[] = [
  { value: 'urban', label: 'Urban' },       // City environments with moderate exposure
  { value: 'coastal', label: 'Coastal' },    // Near ocean/sea with salt spray and high winds
  { value: 'industrial', label: 'Industrial' }, // Manufacturing areas with potential pollutants
  { value: 'suburban', label: 'Suburban' }   // Residential areas with standard conditions
];

/**
 * Purpose Options 🛠️
 * 
 * Defines the primary functional purpose of the louvers.
 * This helps determine which performance characteristics to prioritize.
 * 
 * Note: Part of the legacy form system but still supported.
 */
export const PURPOSE_OPTIONS: SelectOption[] = [
  { value: 'ventilation', label: 'Ventilation' },           // Prioritize airflow performance
  { value: 'weather-protection', label: 'Weather Protection' }, // Prioritize water resistance
  { value: 'acoustic', label: 'Acoustic Attenuation' },     // Prioritize noise reduction
  { value: 'aesthetic', label: 'Aesthetic Integration' }    // Prioritize appearance
];

/**
 * Building Type Options 🏘️
 * 
 * Categorizes the type of building where louvers will be installed.
 * Different building types have different performance requirements and standards.
 * 
 * Note: Part of the legacy form system but still supported.
 */
export const BUILDING_TYPE_OPTIONS: SelectOption[] = [
  { value: 'commercial', label: 'Commercial' },   // Office buildings, retail, etc.
  { value: 'residential', label: 'Residential' },  // Houses, apartments, condos
  { value: 'industrial', label: 'Industrial' },    // Factories, warehouses, plants
  { value: 'healthcare', label: 'Healthcare' },    // Hospitals, clinics, medical facilities
  { value: 'education', label: 'Education' }       // Schools, universities, libraries
];

/**
 * Building Height Options 🖥️
 * 
 * Categorizes buildings by height, which affects wind load and exposure factors.
 * Taller buildings typically require louvers with better performance against high winds.
 * 
 * Note: Part of the legacy form system but still supported.
 */
export const BUILDING_HEIGHT_OPTIONS: SelectOption[] = [
  { value: 'low-rise', label: 'Low-rise (1-3 floors)' },    // Standard wind loads
  { value: 'mid-rise', label: 'Mid-rise (4-12 floors)' },   // Moderate wind exposure
  { value: 'high-rise', label: 'High-rise (13+ floors)' }   // High wind exposure
];

/**
 * Enhanced Application Options for Guided Selection 📍
 * 
 * These define the main application categories in our new guided selection process.
 * Each application has default settings for airflow and water tolerance based on
 * typical requirements for that category.
 * 
 * This is the preferred way to categorize projects in the new UI.
 */
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

/**
 * Airflow Requirement Options 🌬️
 * 
 * Defines the different levels of airflow performance a project might need.
 * These options help users communicate their ventilation requirements without
 * needing technical knowledge of airflow coefficients.
 */
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

/**
 * Water Tolerance Options 💧
 * 
 * Defines how much water penetration is acceptable for the project.
 * These options help translate technical water penetration metrics into
 * user-friendly terms that clients can easily understand and select.
 */
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

/**
 * Enhanced Scoring Weights 📊
 * 
 * These weights determine how much each factor contributes to the overall
 * recommendation score in our new algorithm. The weights sum to 1.0 (100%).
 * 
 * Adjusting these values will change which louver models are recommended
 * for different scenarios.
 */
export const ENHANCED_WEIGHTS = {
  application: 0.40,        // Primary application - 40%
  airflowRequirement: 0.25, // Airflow performance - 25%
  waterTolerance: 0.20,     // Water protection - 20%
  environment: 0.10,        // Environmental factors - 10%
  specialFactors: 0.05      // Context adjustments - 5%
} as const;

/**
 * Louver Model Performance Characteristics 📈
 * 
 * Detailed information about each louver model's strengths, ideal applications,
 * and technical specifications. This data is used for both recommendations and
 * displaying product information to users.
 * 
 * Each model has:
 * - strengths: Key performance advantages
 * - applications: Ideal use cases
 * - specifications: Technical details like pitch, depth, and bank count
 */
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

/**
 * Rain Defense Class Standards ☔
 * 
 * Based on the British Standard BS EN 13030:2001, these classes define
 * how well louvers prevent water penetration during rainfall.
 * 
 * Class A provides the best protection, while Class D offers minimal protection.
 * The effectiveness percentage indicates how much water is prevented from entering.
 */
export const RAIN_DEFENSE_STANDARDS = {
  'A': { effectiveness: '99-100%', penetration: '≤0.75 l/h/m²', description: 'Excellent protection' },
  'B': { effectiveness: '95-98.9%', penetration: '≤3.75 l/h/m²', description: 'Very good protection' },
  'C': { effectiveness: '80-94.9%', penetration: '≤15.00 l/h/m²', description: 'Good protection' },
  'D': { effectiveness: '<80%', penetration: '>15.00 l/h/m²', description: 'Basic protection' }
} as const;

/**
 * Airflow Class Standards 💨
 * 
 * Industry standards for categorizing louver airflow performance.
 * The coefficient represents how easily air passes through the louver.
 * 
 * Class 1 offers the best airflow (least resistance), while Class 4
 * has the most restricted airflow (highest resistance).
 */
export const AIRFLOW_CLASS_STANDARDS = {
  1: { coefficient: '0.4-1.0', rating: 'Excellent', description: 'Lowest resistance' },
  2: { coefficient: '0.3-0.399', rating: 'Very Good', description: 'Low resistance' },
  3: { coefficient: '0.2-0.299', rating: 'Good', description: 'Moderate resistance' },
  4: { coefficient: '≤0.199', rating: 'Fair', description: 'Higher resistance' }
} as const;

/**
 * Application Color Scheme 🎨
 * 
 * Defines the color palette used throughout the application.
 * These colors ensure visual consistency and help communicate
 * information through color coding.
 * 
 * The scheme includes:
 * - Primary colors for main UI elements
 * - Secondary colors for supporting elements
 * - Accent colors for highlights and attention
 * - Application-specific colors for category identification
 */
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

/**
 * Form Validation Rules ✅
 * 
 * Defines the requirements for valid form inputs.
 * These rules are used by the validation functions to check user input
 * and provide appropriate error messages.
 * 
 * Each field has its own set of rules, such as:
 * - Minimum/maximum length
 * - Required status
 * - Pattern matching (for emails, etc.)
 */
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

/**
 * Animation Durations ⏱
 * 
 * Defines standard timing values for animations throughout the app.
 * Using consistent animation durations helps create a smooth, cohesive feel.
 * 
 * Values are in milliseconds (ms).
 */
export const ANIMATION = {
  step: 300,
  button: 200,
  fadeIn: 400,
  substep: 500
} as const;

/**
 * Default Form Values 📁
 * 
 * Initial values for all form fields when a new session starts.
 * This serves as the starting point for the form state.
 * 
 * Includes both new guided selection fields and legacy fields
 * to support both input methods.
 */
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

/**
 * Confidence Level Mapping 📊
 * 
 * Defines thresholds and display properties for recommendation confidence levels.
 * These are used to visually communicate how well a recommended louver
 * matches the user's requirements.
 * 
 * Each level has:
 * - Minimum score threshold (percentage)
 * - Display label
 * - Color for visual indication
 * - Description text
 */
export const CONFIDENCE_LEVELS = {
  HIGH: { min: 85, label: 'High', color: '#10b981', description: 'Excellent match' },
  MEDIUM: { min: 70, label: 'Medium', color: '#f59e0b', description: 'Good match' },
  LOW: { min: 0, label: 'Low', color: '#ef4444', description: 'Basic match' }
} as const;

/**
 * Weather Integration Constants 🌧️
 * 
 * Thresholds for categorizing weather conditions that affect louver selection.
 * These values help determine how local weather patterns should influence
 * louver recommendations.
 * 
 * Includes thresholds for:
 * - Wind speed (affects structural requirements)
 * - Rainfall (affects water penetration resistance needs)
 */
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