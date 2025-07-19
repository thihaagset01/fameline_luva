// ============================================================================
// TYPE DEFINITIONS - Enhanced types for Fameline Luva
// ============================================================================

// Enhanced Form Data Structure
export interface FormData {
  // User Information
  name: string;
  email: string;
  
  // Location Details
  location: string;
  environment: Environment;
  
  // Enhanced Project Context (New guided selection)
  louverApplication?: LouverApplication;
  airflowRequirement?: AirflowRequirement;
  waterTolerance?: WaterTolerance;
  
  // Legacy Project Context (Backward compatibility)
  purpose: Purpose;
  buildingType: BuildingType;
  buildingHeight: BuildingHeight;
  
  // Aesthetic Preferences
  mullionVisibility: MullionVisibility;
  bladeOrientation: BladeOrientation;
  color: string;
  customization: string;

  // Weather Data (Optional)
  weatherData?: string; // JSON stringified WeatherData
}

// Weather Data Structure
export interface WeatherData {
  temperature: number;
  rainfall: number;
  windSpeed: number;
  windDirection: number;
  recommended_rain_class: RainDefenseClass;
  location_valid: boolean;
  location?: string;
  coordinates?: [number, number];
  period?: string;
  dataSource?: string;
}

// Louver Model (from CSV data)
export interface LouverModel {
  id: string;
  model: string;
  type: LouverType;
  frontBlade: BladeType;
  rearBlade: BladeType | 'N/A';
  bladePitch: number;
  louverDepth: number;
  
  // Performance ratings at different velocities
  velocityRatings: Record<string, PerformanceGrade>;
  
  // Performance metrics
  airflowCoefficient: number;
  airflowClass: number;
  rainDefenseRating: Rating;
  airflowRating: Rating;
}

// Enhanced Recommendation Result
export interface LouverRecommendation {
  louver: LouverModel;
  model: string;
  type: string;
  confidence: number; // 0-1 scale
  confidenceScore: number; // 0-1 scale
  airflowRating: number; // 0-10 scale
  waterResistanceRating: number; // 0-10 scale
  durabilityRating: number; // 0-10 scale
  aestheticsRating: number; // 0-10 scale
  matchReasons: MatchReason[];
  alternatives?: LouverModel[];
  weatherCompatibility?: WeatherCompatibility;
}

export interface MatchReason {
  category: string;
  score: number;
  explanation: string;
  weight: number;
}

export interface WeatherCompatibility {
  rainDefenseClass: RainDefenseClass;
  windResistance: 'Low' | 'Medium' | 'High';
  recommendations: string[];
}

// Enhanced Enums and Types
export type Environment = 'urban' | 'coastal' | 'industrial' | 'suburban';
export type Purpose = 'ventilation' | 'weather-protection' | 'acoustic' | 'aesthetic';
export type BuildingType = 'commercial' | 'residential' | 'industrial' | 'healthcare' | 'education';
export type BuildingHeight = 'low-rise' | 'mid-rise' | 'high-rise';

// New Guided Selection Types
export type LouverApplication = 
  | 'mission-critical'
  | 'commercial-general' 
  | 'industrial-warehouse'
  | 'infrastructure'
  | 'screening-aesthetic'
  | 'specialized-acoustic';

export type AirflowRequirement = 'basic' | 'good' | 'maximum';
export type WaterTolerance = 'zero' | 'minimal' | 'moderate';

// Existing Types
export type LouverType = 'Single' | 'Double' | 'Triple';
export type BladeType = 'Horizontal' | 'Vertical';
export type MullionVisibility = 'visible' | 'hidden';
export type BladeOrientation = 'horizontal' | 'vertical';
export type Rating = 'Excellent' | 'Very Good' | 'Good' | 'Fair';
export type PerformanceGrade = 'A' | 'B' | 'C' | 'D';
export type RainDefenseClass = 'A' | 'B' | 'C' | 'D';

// Application Option Interface
export interface ApplicationOption {
  id: LouverApplication;
  name: string;
  description: string;
  icon: string;
  examples: string[];
  colorClass: string;
  defaultAirflow: AirflowRequirement;
  defaultWater: WaterTolerance;
  reasoning: string;
}

// Selection Option Interface
export interface SelectionOption {
  id: string;
  name: string;
  description: string;
  technicalNote: string;
  icon: string;
  performance?: string;
  protection?: string;
}

// Component Props
export interface StepProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string) => void;
  onPrevStep?: () => void;
  onNextStep?: () => void;
}

export interface HeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
}

export interface NavigationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  direction?: 'prev' | 'next';
}

// Options for form fields
export interface SelectOption {
  value: string;
  label: string;
}

// CSV Raw Data Structure (unchanged)
export interface CsvLouverData {
  'Louver Model': string;
  'Type': string;
  'Front Blade': string;
  'Rear Blade': string;
  'Blade Pitch': number;
  'Louver Depth': number;
  'Airflow Velocity: 0.0': string;
  'Airflow Velocity: 0.5': string;
  'Airflow Velocity: 1.0': string;
  'Airflow Velocity: 1.5': string;
  'Airflow Velocity: 2.0': string;
  'Airflow Velocity: 2.5': string;
  'Airflow Velocity: 3.0': string;
  'Airflow Velocity: 3.5': string;
  'Airflow Coefficient': number;
  'Airflow Class': number;
  'Rain Defense Rating': string;
  'Airflow Rating': string;
}

// Performance Calculation (unchanged)
export interface PerformanceCalculation {
  airflowRate: number; // m³/s
  pressureDrop: number; // Pa
  freeArea: number; // %
  velocity: number; // m/s
  efficiency: number; // %
}

// Constants (unchanged)
export const VELOCITY_STEPS = [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5] as const;
export const CONFIDENCE_THRESHOLD = 0.8;

// Smart Defaults Map
export const INTELLIGENT_DEFAULTS: Record<LouverApplication, {
  airflow: AirflowRequirement;
  water: WaterTolerance;
  reasoning: string;
  legacyPurpose: Purpose;
  legacyBuildingType: BuildingType;
}> = {
  'mission-critical': {
    airflow: 'maximum',
    water: 'zero',
    reasoning: 'Critical equipment requires maximum airflow for cooling and zero water penetration for protection',
    legacyPurpose: 'ventilation',
    legacyBuildingType: 'healthcare'
  },
  'commercial-general': {
    airflow: 'good',
    water: 'minimal',
    reasoning: 'Commercial spaces need balanced performance with good protection against weather',
    legacyPurpose: 'weather-protection',
    legacyBuildingType: 'commercial'
  },
  'industrial-warehouse': {
    airflow: 'good',
    water: 'moderate',
    reasoning: 'Industrial environments can handle moderate water exposure while maintaining good airflow',
    legacyPurpose: 'ventilation',
    legacyBuildingType: 'industrial'
  },
  'infrastructure': {
    airflow: 'good',
    water: 'minimal',
    reasoning: 'Public infrastructure requires reliable performance with good weather protection',
    legacyPurpose: 'weather-protection',
    legacyBuildingType: 'commercial'
  },
  'screening-aesthetic': {
    airflow: 'basic',
    water: 'moderate',
    reasoning: 'Aesthetic applications prioritize visual appeal with basic functional requirements',
    legacyPurpose: 'aesthetic',
    legacyBuildingType: 'commercial'
  },
  'specialized-acoustic': {
    airflow: 'good',
    water: 'minimal',
    reasoning: 'Acoustic environments need balanced airflow while minimizing water ingress that could affect acoustics',
    legacyPurpose: 'acoustic',
    legacyBuildingType: 'education'
  }
} as const;