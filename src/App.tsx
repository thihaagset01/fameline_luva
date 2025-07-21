/**
 * App.tsx - Main Application Component 🌐
 * 
 * This is the root component of the LouverBoy application. It manages the wizard flow
 * between different steps of the louver selection process and maintains the global form state.
 * 
 * The application follows a step-by-step wizard pattern where users progress through
 * a series of screens to collect information and ultimately provide louver recommendations.
 */
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { NavigationButton } from '@/components/NavigationButton';

// Step components for the wizard flow
import { UserInfoStep } from '@/pages/UserInfoStep';
import { LocationStep } from '@/pages/LocationStep';
import { ProjectContextStep } from '@/pages/ProjectContextStep';
import { AestheticsStep } from '@/pages/AestheticsStep';
import { RecommendationStep } from '@/pages/RecommendationStep';
import { SummaryStep } from '@/pages/SummaryStep';

// Custom hooks and types
import { useFormData } from '@/hooks/useFormData';
import { STEPS } from '@/utils/constants';

/**
 * Main App component that orchestrates the wizard flow
 * 
 * This component manages:
 * 1. Step navigation (forward/backward between wizard screens)
 * 2. Form data state via the useFormData hook
 * 3. Conditional rendering of the appropriate step component
 * 4. Scroll behavior for different steps
 * 
 * The wizard has 6 steps:
 * - Step 0: User Info (name, email)
 * - Step 1: Location (where the louvers will be installed)
 * - Step 2: Project Context (application, environment, requirements)
 * - Step 3: Aesthetics (appearance preferences)
 * - Step 4: Recommendations (suggested louver models)
 * - Step 5: Summary (final selection and contact info)
 */
function App() {
  // Current step index in the wizard flow (0-based)
  const [currentStep, setCurrentStep] = useState(0);
  
  // Custom hook that manages all form data and validation
  const { formData, updateFormData, resetFormData, isStepValid } = useFormData();

  /**
   * Handle scrolling behavior for different steps
   * 
   * Some steps (like ProjectContext, Recommendation, and Summary) have more content
   * than can fit on a single screen, so we need to enable scrolling for those steps.
   * Other steps are designed to fit entirely on one screen without scrolling.
   * 
   * 💡 This effect adds or removes CSS classes that control the scrolling behavior
   * whenever the current step changes.
   */
  useEffect(() => {
    // Steps that need scrolling (ProjectContextStep, RecommendationStep, SummaryStep)
    const scrollableSteps = [2, 4, 5];
    const needsScrolling = scrollableSteps.includes(currentStep);
    
    // Apply or remove scrollable classes to all relevant elements in the DOM hierarchy
    document.documentElement.classList.toggle('has-scrollable-page', needsScrolling);
    document.body.classList.toggle('has-scrollable-page', needsScrolling);
    document.getElementById('root')?.classList.toggle('has-scrollable-page', needsScrolling);
  }, [currentStep]);

  /**
   * Navigate to the next step in the wizard
   * 
   * This function advances to the next step if we're not already at the last step.
   * It's passed down to each step component so they can trigger navigation when ready.
   */
  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  /**
   * Navigate to the previous step in the wizard
   * 
   * This function goes back to the previous step if we're not already at the first step.
   * It's passed down to each step component so they can trigger navigation when needed.
   */
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  /**
   * Render the current step component based on the currentStep state
   * 
   * This function uses a switch statement to determine which step component to render
   * and passes the appropriate props to each component:
   * - formData: The current state of all user inputs
   * - updateFormData: Function to update the form data
   * - onNextStep/onPrevStep: Navigation functions
   * - onReset: Function to reset the form (only used in the final step)
   * 
   * @returns The React component for the current step
   */
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <UserInfoStep formData={formData} updateFormData={updateFormData} onNextStep={nextStep} />;
      case 1:
        return <LocationStep formData={formData} updateFormData={updateFormData} onPrevStep={prevStep} onNextStep={nextStep} />;
      case 2:
        return <ProjectContextStep formData={formData} updateFormData={updateFormData} onPrevStep={prevStep} onNextStep={nextStep} />;
      case 3:
        return <AestheticsStep formData={formData} updateFormData={updateFormData} onPrevStep={prevStep} onNextStep={nextStep} />;
      case 4:
        return <RecommendationStep formData={formData} />;
      case 5:
        return <SummaryStep formData={formData} onReset={resetFormData} />;
      default:
        return null;
    }
  };

  // Determine if the current step has valid data to proceed to the next step
  const canProceed = isStepValid(currentStep);
  
  // Check if we're on the final step of the wizard
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="gradient-bg">
      {/* Header component with progress indicator - fixed at the top */}
      <Header 
        currentStep={currentStep} 
        totalSteps={STEPS.length} 
      />
      
      {/* Main container with padding to account for the fixed header */}
      <div className="h-full flex flex-col pt-16"> 
        {/* Main content area where the current step is rendered */}
        <main className="flex-1">
          {renderStep()}
        </main>
        
        {/* Previous step button - only shown if not on the first step */}
        {currentStep > 0 && (
          <NavigationButton 
            onClick={prevStep} 
            direction="prev"
          />
        )}
        
        {/* Next step button - shown on all steps except the last one */}
        {/* The button is disabled if the current step's data is invalid */}
        {!isLastStep && currentStep !== 5 && (
          <NavigationButton 
            onClick={nextStep} 
            disabled={!canProceed}
          />
        )}
      </div>
    </div>
  );
}

export default App;