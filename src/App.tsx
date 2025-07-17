// React is used implicitly for JSX transformation
import { useState } from 'react';
import { Header } from '@/components/Header';
import { NavigationButton } from '@/components/NavigationButton';
import { UserInfoStep } from '@/pages/UserInfoStep';
import { LocationStep } from '@/pages/LocationStep';
import { ProjectContextStep } from '@/pages/ProjectContextStep';
import { AestheticsStep } from '@/pages/AestheticsStep';
import { RecommendationStep } from '@/pages/RecommendationStep';
import { SummaryStep } from '@/pages/SummaryStep';
import { useFormData } from '@/hooks/useFormData';
import { STEPS } from '@/utils/constants';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const { formData, updateFormData, resetFormData, isStepValid } = useFormData();

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

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
        return <RecommendationStep formData={formData} onPrevStep={prevStep} onNextStep={nextStep} />;
      case 5:
        return <SummaryStep formData={formData} onReset={resetFormData} onPrevStep={prevStep} />;
      default:
        return null;
    }
  };

  const canProceed = isStepValid(currentStep);
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="gradient-bg">
      <div className="h-full flex flex-col">
        <Header 
          currentStep={currentStep} 
          totalSteps={STEPS.length} 
        />
        
        {/* Main Content */}
        <main className="flex-1">
          {renderStep()}
        </main>
        
        {/* Navigation Buttons */}
        {currentStep > 0 && (
          <NavigationButton 
            onClick={prevStep} 
            direction="prev"
          />
        )}
        
        {!isLastStep && (
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