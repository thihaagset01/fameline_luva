import * as React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import './NavigationButton.css';

/**
 * NavigationButton Component 🧭
 * 
 * This component renders circular navigation buttons used throughout the wizard
 * to move between steps. It supports both forward (next) and backward (previous) 
 * navigation with appropriate arrow icons and styling.
 * 
 * The buttons are styled as green circular buttons with arrow icons, following
 * the design preference to use only circular navigation buttons in the UI.
 */

/**
 * Props for the NavigationButton component
 * 
 * @property onClick - Function to call when the button is clicked
 * @property disabled - Whether the button should be disabled (e.g., when form is invalid)
 * @property direction - Which direction the button navigates ('next' or 'prev')
 */
interface NavigationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  direction?: 'next' | 'prev';
}

/**
 * Renders a circular navigation button with appropriate styling and icon
 * 
 * The button appearance changes based on the direction prop:
 * - 'next' buttons show a right arrow and are positioned on the right
 * - 'prev' buttons show a left arrow and are positioned on the left
 * 
 * When disabled, the button shows a visual indication that it can't be clicked.
 * 
 * @param props - The component props
 */
export const NavigationButton: React.FC<NavigationButtonProps> = ({ 
  onClick, 
  disabled = false,
  direction = 'next'
}) => {
  // Determine if this is a 'next' button or a 'prev' button
  const isNext = direction === 'next';
  
  return (
    // Container div positions the button on the right or left side
    <div className={`nav-button-container ${isNext ? 'next-container' : 'prev-container'}`}>
      {/* The button itself with conditional styling based on direction and disabled state */}
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          circular-nav-button
          ${isNext ? 'next-button' : 'prev-button'}
          ${disabled ? 'nav-button-disabled' : ''}
        `}
        aria-label={isNext ? "Continue to next step" : "Go back to previous step"}
      >
        {/* Show the appropriate arrow icon based on direction */}
        {isNext ? 
          <ArrowRight size={24} className="nav-button-icon" /> : 
          <ArrowLeft size={24} className="nav-button-icon" />}
      </button>
    </div>
  );
};