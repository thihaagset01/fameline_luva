/**
 * ============================================================================
 * 📝 TYPE DEFINITIONS - The Blueprint of LouverBoy
 * ============================================================================
 * 
 * Welcome to the types.ts file - the foundation of our TypeScript architecture! 🏗️
 * 
 * This file defines all the data structures, interfaces, and types used throughout
 * the application. Think of it as the DNA that shapes how data flows through the app.
 * 
 * Why is this file important?
 * - It ensures type safety across the entire application
 * - It provides autocomplete and IntelliSense in your IDE
 * - It documents the shape of our data for all team members
 * - It creates a single source of truth for data structures
 * 
 * When adding new features, you'll likely need to extend these types.
 * Please keep related types grouped together and maintain the existing organization.
 */

/**
 * FormData - The Wizard's Data Collection 📝
 * 
 * This is our central data structure that holds ALL user input as they progress
 * through the wizard steps. Think of it as the application's memory of what the
 * user has told us about their project.
 * 
 * It includes:
 * - Personal info (name, email)
 * - Project location and environment
 * - Technical requirements (airflow, water tolerance)
 * - Visual preferences (colors, orientation)
 * 
 * This data drives our recommendation engine and is passed between components
 * as the user navigates through the application.
 */
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

/**
 * WeatherData - Climate Intelligence 🌧️🌡️
 * 
 * This interface represents the local weather conditions at the user's project location.
 * We fetch this data from our Earth Engine API when the user enters their location.
 * 
 * Why it matters:
 * - Different regions have different weather challenges (heavy rain, high winds, etc.)
 * - The recommended_rain_class field helps us suggest louvers that can handle local rainfall
 * - Wind speed and direction inform structural requirements
 * 
 * This data helps us make smarter recommendations that account for real-world
 * environmental conditions rather than just theoretical performance.
 */
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

/**
 * LouverModel - Our Product Blueprint 📐
 * 
 * This is the digital representation of a physical louver product in our catalog.
 * Each louver model has unique specifications and performance characteristics.
 * 
 * Key aspects:
 * - Technical specs (blade type, pitch, depth)
 * - Performance ratings at different air velocities
 * - Airflow and water resistance classifications
 * 
 * We load this data from our product database (CSV) and use it for both
 * generating recommendations and displaying product details to users.
 * 
 * When adding new louver models to our catalog, you'll need to ensure
 * they conform to this interface structure.
 */
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

/**
 * LouverRecommendation - The Magic Result ✨
 * 
 * This is what our recommendation engine produces after analyzing the user's
 * requirements and preferences. It's the "answer" we present to the user.
 * 
 * It includes:
 * - The primary recommended louver model
 * - Alternative options that might also work well
 * - Confidence score (how sure we are this is the right choice)
 * - Performance ratings across different categories
 * - Explanations for why this model was recommended
 * 
 * The RecommendationStep component uses this data to create the visual
 * presentation that users see, including the 3D visualization and spec cards.
 */
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

/**
 * MatchReason - The "Why" Behind Recommendations 🔍
 * 
 * This explains to users WHY a particular louver model was recommended.
 * It makes our recommendation process transparent and builds trust.
 * 
 * Each reason includes:
 * - Category (e.g., "Airflow Performance", "Water Resistance")
 * - Score (how well the louver performs in this category)
 * - User-friendly explanation in plain language
 * - Weight (how important this factor was in the overall decision)
 * 
 * These reasons appear as explanation cards in the RecommendationStep UI.
 */
export interface MatchReason {
  category: string;
  score: number;
  explanation: string;
  weight: number;
}

/**
 * WeatherCompatibility - Real-World Performance Prediction 🌧️💨
 * 
 * This connects our product specs with the user's local climate data.
 * It answers the question: "How will this louver perform in MY location?"
 * 
 * It includes:
 * - Rain defense class appropriate for local rainfall patterns
 * - Wind resistance rating based on local wind conditions
 * - Specific recommendations for installation or maintenance
 * 
 * This helps users understand how theoretical product specs translate
 * to real-world performance in their specific environment.
 */
export interface WeatherCompatibility {
  rainDefenseClass: RainDefenseClass;
  windResistance: 'Low' | 'Medium' | 'High';
  recommendations: string[];
}

/**
 * Core Type Definitions - Our Type Vocabulary 📖
 * 
 * These are the fundamental "building blocks" of our type system - the basic
 * categories and options that appear throughout the application.
 * 
 * Most of these are string literal unions (e.g., 'urban' | 'coastal') that
 * define the valid values for various form fields and configuration options.
 * 
 * Benefits:
 * - Prevents typos and invalid values
 * - Provides autocomplete in the IDE
 * - Makes refactoring easier (rename in one place)
 * - Documents valid options for other developers
 */
export type Environment = 'urban' | 'coastal' | 'industrial' | 'suburban';
export type Purpose = 'ventilation' | 'weather-protection' | 'acoustic' | 'aesthetic';
export type BuildingType = 'commercial' | 'residential' | 'industrial' | 'healthcare' | 'education';
export type BuildingHeight = 'low-rise' | 'mid-rise' | 'high-rise';

/**
 * Guided Selection Types
 * 
 * These types are used in the new guided selection process, which provides
 * a more intuitive way for users to specify their requirements without
 * needing technical knowledge about louvers.
 */
/**
 * LouverApplication - The primary use case for the louver
 * 
 * This is the most important selection in the wizard as it drives many default values
 * and heavily influences the recommendation algorithm's scoring.
 */
export type LouverApplication = 
  | 'mission-critical'
  | 'commercial-general' 
  | 'industrial-warehouse'
  | 'infrastructure'
  | 'screening-aesthetic'
  | 'specialized-acoustic';

/**
 * AirflowRequirement - How much air needs to flow through the louver
 * 
 * - basic: Minimal airflow needed (e.g., for aesthetic applications)
 * - good: Standard airflow for general ventilation
 * - maximum: Maximum possible airflow (e.g., for cooling critical equipment)
 */
export type AirflowRequirement = 'basic' | 'good' | 'maximum';
/**
 * WaterTolerance - How much water penetration is acceptable
 * 
 * - zero: No water penetration allowed (e.g., for electronics or sensitive equipment)
 * - minimal: Very little water penetration acceptable (e.g., for general commercial use)
 * - moderate: Some water penetration is acceptable (e.g., for industrial applications)
 */
export type WaterTolerance = 'zero' | 'minimal' | 'moderate';

/**
 * Product Specification Types
 * 
 * These types represent the technical characteristics of louver products.
 * They're used both in the product database and in the UI for displaying
 * specifications to users.
 */
export type LouverType = 'Single' | 'Double' | 'Triple';
export type BladeType = 'Horizontal' | 'Vertical';
export type MullionVisibility = 'visible' | 'hidden';
export type BladeOrientation = 'horizontal' | 'vertical';
export type Rating = 'Excellent' | 'Very Good' | 'Good' | 'Fair';
export type PerformanceGrade = 'A' | 'B' | 'C' | 'D';
export type RainDefenseClass = 'A' | 'B' | 'C' | 'D';

/**
 * UI Component Types
 * 
 * The following interfaces define the data structures used by UI components
 * throughout the application. They help ensure consistent data passing
 * between components.
 */

/**
 * ApplicationOption - Data for application selection cards
 * 
 * This structure defines the content displayed in the application selection step,
 * including visual elements, descriptions, and default values.
 */
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

/**
 * SelectionOption - Generic option for selection components
 * 
 * Used for various selection UI components throughout the wizard,
 * providing consistent structure for options with descriptions and icons.
 */
export interface SelectionOption {
  id: string;
  name: string;
  description: string;
  technicalNote: string;
  icon: string;
  performance?: string;
  protection?: string;
}

/**
 * Component Props
 * 
 * These interfaces define the props for reusable components throughout the application.
 * They ensure consistent data passing and type safety between components.
 */
/**
 * StepProps - Common props for all wizard step components
 * 
 * Every step in the wizard receives these props, which include the current form data,
 * a method to update it, and navigation callbacks.
 */
export interface StepProps {
  formData: FormData;
  updateFormData: (field: keyof FormData, value: string) => void;
  onPrevStep?: () => void;
  onNextStep?: () => void;
}

/**
 * HeaderProps - Props for the wizard header component
 * 
 * The header shows the current step, total steps, and provides navigation.
 */
export interface HeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
}

/**
 * NavigationButtonProps - Props for navigation buttons
 * 
 * These buttons allow users to move between wizard steps.
 */
export interface NavigationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  direction?: 'prev' | 'next';
}

/**
 * Form Field Types - Input Component Building Blocks 📝
 * 
 * These types define the structure of data used by our form input components.
 * They ensure consistency across all form elements in the application.
 * 
 * When creating new form components or extending existing ones,
 * use these types to maintain a consistent interface.
 */
/**
 * SelectOption - Dropdown Menu Options 💻
 * 
 * This simple but crucial interface defines the standard format for
 * all dropdown menu options throughout the application.
 * 
 * The consistent { value, label } pattern makes it easy to:
 * - Generate options dynamically
 * - Map between display text and stored values
 * - Create reusable select components
 */
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Data Source Types - External Data Interfaces 💾
 * 
 * These types represent the raw data structures we receive from external sources
 * before we transform them into our application's internal formats.
 * 
 * They act as a bridge between the outside world and our application,
 * defining the exact shape of data we expect from each source.
 * 
 * When integrating with new data sources or APIs, start by defining
 * the raw data structure here.
 */
/**
 * CsvLouverData - Raw Product Database Format 📂
 * 
 * This interface exactly mirrors the column structure of our product CSV file.
 * It's the first step in our data pipeline before transformation.
 * 
 * Important: If the CSV structure changes, this interface must be updated!
 * 
 * The data loader converts this raw format into our internal LouverModel type
 * by mapping fields and converting values to the appropriate types.
 * 
 * See utils/dataLoader.ts for the transformation logic.
 */
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

/**
 * Calculation Types - Technical Engineering Data 🧲
 * 
 * These types support the technical engineering calculations performed
 * throughout the application, especially in the recommendation engine.
 * 
 * They represent physical properties, performance metrics, and calculated
 * values that help determine the most appropriate louver for a given situation.
 * 
 * If you're working on the technical calculation aspects of the app,
 * these types will be your close companions.
 */
/**
 * PerformanceCalculation - Airflow Physics Results 💨
 * 
 * This interface captures the results of our airflow engineering calculations.
 * These are the actual physical performance characteristics that determine
 * how a louver will perform in real-world conditions.
 * 
 * The values include:
 * - Airflow rate: How much air passes through (m³/s)
 * - Pressure drop: Resistance to airflow (Pa)
 * - Free area: Percentage of open area for air passage (%)
 * - Velocity: Speed of air through the louver (m/s)
 * - Efficiency: Overall performance rating (%)
 * 
 * These calculations help us match louvers to specific ventilation requirements.
 */
export interface PerformanceCalculation {
  airflowRate: number; // m³/s
  pressureDrop: number; // Pa
  freeArea: number; // %
  velocity: number; // m/s
  efficiency: number; // %
}

/**
 * Application Constants - Global Configuration Values 🔑
 * 
 * These constants define important values used throughout the application.
 * They're exported here rather than in constants.ts because they're
 * closely tied to the type system.
 * 
 * Having them here ensures they're always in sync with the types they relate to
 * and makes it easier to find type-related configuration.
 */
export const VELOCITY_STEPS = [0.0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5] as const;
export const CONFIDENCE_THRESHOLD = 0.8;

/**
 * Smart Defaults Configuration - Intelligent Presets 🤓
 * 
 * This clever mapping helps us create a more intuitive user experience by
 * automatically suggesting appropriate values based on earlier selections.
 * 
 * For example, when a user selects "Mission Critical" as their application,
 * we can pre-select "Maximum Airflow" and "Zero Water Tolerance" as the
 * most likely requirements for that application type.
 * 
 * This makes the form feel "smart" and reduces the cognitive load on users
 * while still allowing them to override our suggestions if needed.
 * 
 * The mapping also includes "reasoning" text that explains WHY we've made
 * these suggestions, which appears in the UI as helpful guidance.
 */
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