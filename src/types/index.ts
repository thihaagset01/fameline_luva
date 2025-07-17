// ============================================================================
// TYPE DEFINITIONS - Core types for LouverBoy
// ============================================================================

// Form Data Structure
export interface FormData {
    // User Information
    name: string;
    email: string;
    
    // Location Details
    location: string;
    environment: Environment;
    
    // Project Context
    purpose: Purpose;
    buildingType: BuildingType;
    buildingHeight: BuildingHeight;
    
    // Aesthetic Preferences
    mullionVisibility: MullionVisibility;
    bladeOrientation: BladeOrientation;
    color: string;
    customization: string;
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
  
  // Recommendation Result
  export interface LouverRecommendation {
    louver: LouverModel;
    confidence: number; // 0-100
    matchReasons: MatchReason[];
    alternatives?: LouverModel[];
  }
  
  export interface MatchReason {
    category: string;
    score: number;
    explanation: string;
    weight: number;
  }
  
  // Enums and Types
  export type Environment = 'urban' | 'coastal' | 'industrial' | 'suburban';
  export type Purpose = 'ventilation' | 'weather-protection' | 'acoustic' | 'aesthetic';
  export type BuildingType = 'commercial' | 'residential' | 'industrial' | 'healthcare' | 'education';
  export type BuildingHeight = 'low-rise' | 'mid-rise' | 'high-rise';
  export type LouverType = 'Single' | 'Double' | 'Triple';
  export type BladeType = 'Horizontal' | 'Vertical';
  export type MullionVisibility = 'visible' | 'hidden';
  export type BladeOrientation = 'horizontal' | 'vertical';
  export type Rating = 'Excellent' | 'Very Good' | 'Good' | 'Fair';
  export type PerformanceGrade = 'A' | 'B' | 'C' | 'D';
  
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
  }
  
  // Options for form fields
  export interface SelectOption {
    value: string;
    label: string;
  }
  
  // CSV Raw Data Structure
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
  
  // Performance Calculation
  export interface PerformanceCalculation {
    airflowRate: number; // m³/s
    pressureDrop: number; // Pa
    freeArea: number; // %
    velocity: number; // m/s
    efficiency: number; // %
  }
  
  // Constants
  export const VELOCITY_STEPS = [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5] as const;
  export const CONFIDENCE_THRESHOLD = 0.8;