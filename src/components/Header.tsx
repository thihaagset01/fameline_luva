/**
 * Header Component 🔥
 * 
 * This component renders the application header with navigation elements and progress indicators.
 * It appears at the top of every page in the wizard flow and shows the current step progress.
 * 
 * The header is fixed to the top of the screen and includes:
 * - A home button for easy navigation back to the start
 * - Progress dots showing completed, current, and upcoming steps
 * - Click functionality on completed steps to navigate backward
 */
import * as React from 'react';
import { Home } from 'lucide-react';
import { HeaderProps } from '@/types';
import './Header.css';

/**
 * Renders the application header with navigation and progress indicators
 * 
 * @param currentStep - The current active step in the wizard (0-based index)
 * @param totalSteps - The total number of steps in the wizard
 */
export const Header: React.FC<HeaderProps> = ({ currentStep, totalSteps }) => {
  /* Progress step labels */
  const stepLabels = ['User Info', 'Location', 'Context', 'Aesthetics', 'Suggestion', 'Consultation'];
  /**
   * Navigate to a specific step in the wizard
   * 
   * This function allows users to click on completed progress dots
   * to go back to previous steps. It prevents navigation to future steps
   * that haven't been completed yet.
   * 
   * @param stepIndex - The step index to navigate to (0-based)
   */
  const navigateToStep = (stepIndex: number) => {
    // Only allow navigation to completed steps (prevent jumping ahead)
    if (stepIndex <= currentStep) {
      // Use window.history to update the URL hash without a full navigation
      window.history.pushState({}, '', `#step-${stepIndex}`);
      // Reload the page to reset the application state to the selected step
      // Note: In a more sophisticated implementation, we might use React Router
      // or state management to avoid a full page reload
      window.location.reload();
    }

  };
  return (
    // Header container with fixed positioning and gradient background
    // The high z-index (100) ensures it stays above other content
    <header className="fixed top-0 left-0 right-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-transparent py-4">
      {/* Top row with home navigation */}
      <div className="w-full flex items-center justify-between px-5">
        {/* Empty left side to balance the layout visually */}
        <div className="w-6 h-6"></div>
        
        {/* Home icon - returns to landing page */}
        <a href="/" className="home-icon-link inline-flex items-center justify-center w-6 h-6">
          <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/691b4ce4126b21a2b826b1369a540af253ae50a2?width=1107" alt="Home" className="w-6 h-6" />
        </a>
      </div>

      {/* Progress dots showing the wizard steps and current position */}
      {/* These dots provide visual feedback about progress and navigation */}
      <div className="progress-dots mt-4 flex gap-4">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="progress-step">
            <div 
              className={`progress-dot ${index === currentStep 
                ? 'active' // Current step (highlighted)
                : index < currentStep 
                  ? 'completed' // Steps we've already done
                  : ''} ${index < currentStep ? 'clickable' : ''}`} // Only completed steps are clickable
              onClick={() => index < currentStep ? navigateToStep(index) : null} // Navigate back to completed steps
              role={index < currentStep ? "button" : undefined} // Accessibility: only completed steps are interactive
              tabIndex={index < currentStep ? 0 : undefined} // Keyboard navigation for completed steps
              aria-label={index < currentStep ? `Go back to step ${index + 1}: ${stepLabels[index]}` : undefined} // Screen reader text
            >
              {/* Show step number for current and future steps, empty for completed steps */}
              {index < currentStep ? '' : (index + 1)}
            </div>
            <div className="progress-label">
              {stepLabels[index] || `Step ${index + 1}`}
            </div>
          </div>
        ))}
      </div>
    </header>
  );
};