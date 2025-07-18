import * as React from 'react';
import { Home } from 'lucide-react';
import { HeaderProps } from '@/types';
import { STEPS } from '@/utils/constants';

export const Header: React.FC<HeaderProps> = ({ currentStep, totalSteps }) => {
  // Function to navigate to a specific step
  const navigateToStep = (stepIndex: number) => {
    // Only allow navigation to completed steps
    if (stepIndex <= currentStep) {
      // Use window.history to navigate to the specific step
      window.history.pushState({}, '', `#step-${stepIndex}`);
      window.location.reload();
    }
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between" style={{ position: 'fixed', top: 0, left: 0, right: 0 }}>
      {/* Empty left side to balance the layout */}
      <div className="p-5"></div>
      
      {/* Progress dots */}
      <div className="progress-dots">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index}
            className={`progress-dot ${index === currentStep 
              ? 'active' 
              : index < currentStep 
                ? 'completed' 
                : ''} ${index < currentStep ? 'clickable' : ''}`}
            onClick={() => index < currentStep ? navigateToStep(index) : null}
            role={index < currentStep ? "button" : undefined}
            tabIndex={index < currentStep ? 0 : undefined}
            aria-label={index < currentStep ? `Go back to step ${index + 1}` : undefined}
          >
            {index < currentStep ? '' : (index + 1)}
          </div>
        ))}
      </div>
      
      {/* Home icon in top right */}
      <div className="p-5">
        <a href="/" className="home-icon-link inline-flex items-center justify-center w-6 h-6">
          <Home className="w-6 h-6 text-white" />
        </a>
      </div>
    </header>
  );
};