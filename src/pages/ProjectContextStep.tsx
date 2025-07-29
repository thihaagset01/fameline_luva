import * as React from 'react';
import './styles/ProjectContextStep.css';
import { useState, useEffect, useCallback, memo } from 'react';
import { StepProps } from '@/types';

/**
 * 📃 ProjectContextStep Component
 * 
 * This step collects critical information about the project's requirements
 * that will drive the louver recommendation process. It's structured as a
 * multi-step wizard within a single page, where each choice reveals the next
 * set of options.
 * 
 * The user progresses through three key selections:
 * 1. Louver application type (e.g., Mission Critical, Commercial)
 * 2. Airflow requirements (Basic, Good, Maximum)
 * 3. Water tolerance level (Zero, Minimal, Moderate)
 * 
 * The component uses intelligent defaults to recommend options based on
 * the user's application selection, making the process easier while still
 * allowing for customization.
 */

/**
 * Type extension for FormData to include project context fields
 * 
 * This declaration extends the FormData interface from @/types to include
 * the specific fields needed for this step. This ensures proper type checking
 * throughout the application when these fields are accessed.
 */
declare module '@/types' {
  interface FormData {
    // Using consistent types for form data fields
    // These must match the types defined elsewhere in the application
    louverApplication?: LouverApplication | undefined;
    airflowRequirement?: AirflowRequirement | undefined;
    waterTolerance?: WaterTolerance | undefined;
  }
}

/**
 * 🏢 Application Context Data (Step 1)
 * 
 * This array defines all possible louver application categories that a user
 * can select from. Each application has specific characteristics that influence
 * the recommended louver type.
 * 
 * Each object includes:
 * - id: Unique identifier used in form data
 * - name: Display name shown to users
 * - description: Brief explanation of the application type
 * - icon: Emoji for visual identification
 * - examples: Real-world examples to help users understand the category
 * - colorClass: CSS class for styling the selection card
 */
const louverApplications = [
  {
    id: 'mission-critical',
    name: 'Mission Critical',
    description: 'Data centers, hospitals, critical infrastructure',
    icon: '🏥',
    examples: ['Data centers', 'Server rooms', 'Medical facilities', 'Clean rooms'],
    colorClass: 'application-card-critical'
  },
  {
    id: 'commercial-general',
    name: 'Commercial General', 
    description: 'Office buildings, retail, standard commercial',
    icon: '🏢',
    examples: ['Office buildings', 'Retail spaces', 'Shopping centers', 'Hotels'],
    colorClass: 'application-card-commercial'
  },
  {
    id: 'industrial-warehouse',
    name: 'Industrial & Warehouse',
    description: 'Manufacturing, storage, industrial facilities', 
    icon: '🏭',
    examples: ['Manufacturing plants', 'Warehouses', 'Distribution centers', 'Factories'],
    colorClass: 'application-card-industrial'
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    description: 'Transportation, utilities, public facilities',
    icon: '🚇',
    examples: ['MRT stations', 'Airports', 'Utility buildings', 'Public facilities'],
    colorClass: 'application-card-infrastructure'
  },
  {
    id: 'screening-aesthetic',
    name: 'Screening & Aesthetic',
    description: 'Equipment screening, architectural features',
    icon: '🎨',
    examples: ['Equipment screening', 'Architectural features', 'Facade elements', 'Privacy screens'],
    colorClass: 'application-card-aesthetic'
  },
  {
    id: 'specialized-acoustic',
    name: 'Specialized Acoustic',
    description: 'Sound-sensitive environments requiring noise control',
    icon: '🔇',
    examples: ['Recording studios', 'Libraries', 'Residential areas', 'Schools'],
    colorClass: 'application-card-acoustic'
  }
];

const airflowOptions = [
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

const waterToleranceOptions = [
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

const getIntelligentDefaults = (applicationId: string) => {
  const defaultMap: Record<string, { airflow: string; water: string; reasoning: string }> = {
    'mission-critical': {
      airflow: 'maximum',
      water: 'zero',
      reasoning: 'Critical equipment requires maximum airflow for cooling and zero water penetration for protection'
    },
    'commercial-general': {
      airflow: 'good', 
      water: 'minimal',
      reasoning: 'Commercial spaces need balanced performance with good protection against weather'
    },
    'industrial-warehouse': {
      airflow: 'good',
      water: 'moderate', 
      reasoning: 'Industrial environments can handle moderate water exposure while maintaining good airflow'
    },
    'infrastructure': {
      airflow: 'good',
      water: 'minimal',
      reasoning: 'Public infrastructure requires reliable performance with good weather protection'
    },
    'screening-aesthetic': {
      airflow: 'basic',
      water: 'moderate',
      reasoning: 'Aesthetic applications prioritize visual appeal with basic functional requirements'
    },
    'specialized-acoustic': {
      airflow: 'good',
      water: 'minimal',
      reasoning: 'Acoustic environments need balanced airflow while minimizing water ingress that could affect acoustics'
    }
  };
  
  return defaultMap[applicationId] || {
    airflow: 'good',
    water: 'minimal', 
    reasoning: 'Standard balanced recommendation for general applications'
  };
};

const ApplicationCard = memo(({ 
  app, 
  selected, 
  onClick 
}: { 
  app: typeof louverApplications[0]; 
  selected: boolean; 
  onClick: () => void;
}) => (
  <div
    className={`application-card ${app.colorClass} ${selected ? 'selected' : ''}`}
    onClick={onClick}
    tabIndex={0}
    role="button"
    aria-pressed={selected}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    }}
  >
    <span className="application-icon" aria-hidden="true">{app.icon}</span>
    <h4 className="application-name">{app.name}</h4>
    <p className="application-description">{app.description}</p>
    <p className="application-examples">
      Examples: {app.examples.join(', ')}
    </p>
  </div>
));

const SelectionOptionCard = memo(({ 
  option, 
  selected, 
  recommended,
  onClick 
}: { 
  option: any; 
  selected: boolean; 
  recommended: boolean;
  onClick: () => void;
}) => (
  <div
    className={`selection-option-card ${selected ? 'selected' : ''} ${recommended ? 'recommended' : ''}`}
    onClick={onClick}
    tabIndex={0}
    role="button"
    aria-pressed={selected}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    }}
  >
    {recommended && <span className="recommended-badge" aria-label="Recommended">Recommended</span>}
    <span className="application-icon" aria-hidden="true">{option.icon}</span>
    <h4 className="application-name">{option.name}</h4>
    <p className="application-description">{option.description}</p>
    <p className="technical-note">{option.technicalNote}</p>
  </div>
));

export const ProjectContextStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const [currentSubStep, setCurrentSubStep] = useState<1 | 2 | 3>(1);
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendationReasoning, setRecommendationReasoning] = useState('');

  // Auto-advance to next sub-step when selection is made
  useEffect(() => {
    if (formData.louverApplication && currentSubStep === 1) {
      setTimeout(() => setCurrentSubStep(2), 300);
    }
    if (formData.airflowRequirement && currentSubStep === 2) {
      setTimeout(() => setCurrentSubStep(3), 300);
    }
  }, [formData.louverApplication, formData.airflowRequirement, currentSubStep]);

  // Event Handlers with useCallback for performance
  const handleApplicationSelect = useCallback((applicationId: string) => {
    const defaults = getIntelligentDefaults(applicationId);
    
    // Update application selection
    updateFormData('louverApplication', applicationId);
    
    // Set intelligent defaults
    updateFormData('airflowRequirement', defaults.airflow);
    updateFormData('waterTolerance', defaults.water);
    
    // Show reasoning
    setRecommendationReasoning(defaults.reasoning);
    setShowRecommendation(true);

    // For backward compatibility
    const purposeMap: Record<string, string> = {
      'mission-critical': 'ventilation',
      'commercial-general': 'weather-protection',
      'industrial-warehouse': 'ventilation',
      'infrastructure': 'weather-protection',
      'screening-aesthetic': 'aesthetic',
      'specialized-acoustic': 'acoustic'
    };
    
    const buildingTypeMap: Record<string, string> = {
      'mission-critical': 'healthcare',
      'commercial-general': 'commercial',
      'industrial-warehouse': 'industrial',
      'infrastructure': 'commercial',
      'screening-aesthetic': 'commercial',
      'specialized-acoustic': 'education'
    };
    
    // Update legacy fields for backward compatibility
    updateFormData('purpose', purposeMap[applicationId] || 'ventilation');
    updateFormData('buildingType', buildingTypeMap[applicationId] || 'commercial');
  }, [updateFormData]);

  const handleAirflowChange = useCallback((airflowId: string) => {
    updateFormData('airflowRequirement', airflowId);
  }, [updateFormData]);

  const handleWaterToleranceChange = useCallback((waterToleranceId: string) => {
    updateFormData('waterTolerance', waterToleranceId);
  }, [updateFormData]);

  const getRecommendedOptions = () => {
    if (!formData.louverApplication) return { airflow: null, water: null };
    const defaults = getIntelligentDefaults(formData.louverApplication);
    return {
      airflow: defaults.airflow,
      water: defaults.water
    };
  };

  const recommendedOptions = getRecommendedOptions();

  return (
    <div className="project-context-step">
      {/* Page title and description */}
      <h1 className="page-title">Project Context</h1>
      <p className="page-subtitle">Tell us about your louver application requirements.</p>

      {/* Step 1: Application Selection */}
      <div className={`substep-container ${currentSubStep >= 1 ? 'substep-fade-in' : ''}`}>
        <h3 className="input-label">What is your louver application?</h3>
        <div className="application-grid">
          {louverApplications.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              selected={formData.louverApplication === app.id}
              onClick={() => handleApplicationSelect(app.id)}
            />
          ))}
        </div>
        
        {showRecommendation && (
          <div className="reasoning-text">
            <strong>💡 Smart Recommendation:</strong> {recommendationReasoning}
          </div>
        )}
      </div>

      {/* Step 2: Airflow Requirements */}
      {formData.louverApplication && (
        <div className={`substep-container ${currentSubStep >= 2 ? 'substep-fade-in' : ''}`}>
          <h3 className="input-label">Select airflow requirements:</h3>
          <div className="selection-option-row">
            {airflowOptions.map((option) => (
              <SelectionOptionCard
                key={option.id}
                option={option}
                selected={formData.airflowRequirement === option.id}
                recommended={recommendedOptions.airflow === option.id}
                onClick={() => handleAirflowChange(option.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Water Tolerance */}
      {formData.airflowRequirement && (
        <div className={`substep-container ${currentSubStep >= 3 ? 'substep-fade-in' : ''}`}>
          <h3 className="input-label">Select water tolerance level:</h3>
          <div className="selection-option-row">
            {waterToleranceOptions.map((option) => (
              <SelectionOptionCard
                key={option.id}
                option={option}
                selected={formData.waterTolerance === option.id}
                recommended={recommendedOptions.water === option.id}
                onClick={() => handleWaterToleranceChange(option.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
