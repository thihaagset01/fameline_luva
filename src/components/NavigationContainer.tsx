import * as React from 'react';
import { NavigationButton } from './NavigationButton';
import './NavigationContainer.css';

/**
 * NavigationContainer Component 🧭
 * 
 * A wrapper component that handles the alignment and positioning of navigation buttons.
 * This provides consistent layout patterns for different navigation scenarios.
 * 
 * Replaces the current pattern of individual NavigationButton components and 
 * manual div containers with guided-navigation class.
 */

interface NavigationContainerProps {
  /** Callback for previous button click */
  onPrevious?: () => void;
  /** Callback for next button click */
  onNext?: () => void;
  /** Whether the next button should be disabled */
  nextDisabled?: boolean;
  /** Whether the previous button should be disabled */
  prevDisabled?: boolean;
  /** Whether to show the previous button */
  showPrevious?: boolean;
  /** Whether to show the next button */
  showNext?: boolean;
  /** Alignment style for the navigation buttons */
  alignment?: 'spaced' | 'center' | 'right' | 'left' | 'fixed';
  /** Additional CSS classes */
  className?: string;
}

/**
 * Renders navigation buttons with proper alignment and spacing
 * 
 * Usage Examples:
 * 
 * // Both buttons spaced apart (default)
 * <NavigationContainer onPrevious={handlePrev} onNext={handleNext} />
 * 
 * // Only next button, aligned right
 * <NavigationContainer onNext={handleNext} showPrevious={false} />
 * 
 * // Fixed positioning (floating buttons)
 * <NavigationContainer onPrevious={handlePrev} onNext={handleNext} alignment="fixed" />
 * 
 * // Centered together
 * <NavigationContainer onPrevious={handlePrev} onNext={handleNext} alignment="center" />
 */
export const NavigationContainer: React.FC<NavigationContainerProps> = ({
  onPrevious,
  onNext,
  nextDisabled = false,
  prevDisabled = false,
  showPrevious = true,
  showNext = true,
  alignment = 'spaced',
  className = ''
}) => {
  
  // For fixed positioning, render buttons separately
  if (alignment === 'fixed') {
    return (
      <>
        {showPrevious && onPrevious && (
          <div className="nav-button-fixed nav-button-fixed-prev">
            <NavigationButton
              onClick={onPrevious}
              disabled={prevDisabled}
              direction="prev"
            />
          </div>
        )}
        
        {showNext && onNext && (
          <div className="nav-button-fixed nav-button-fixed-next">
            <NavigationButton
              onClick={onNext}
              disabled={nextDisabled}
              direction="next"
            />
          </div>
        )}
      </>
    );
  }

  // Determine container classes based on alignment
  const getContainerClasses = () => {
    const baseClasses = 'navigation-container';
    
    switch (alignment) {
      case 'spaced':
        return `${baseClasses} nav-spaced`;
      case 'center':
        return `${baseClasses} nav-center`;
      case 'right':
        return `${baseClasses} nav-right`;
      case 'left':
        return `${baseClasses} nav-left`;
      default:
        return `${baseClasses} nav-spaced`;
    }
  };

  return (
    <div className={`${getContainerClasses()} ${className}`}>
      {/* Previous Button */}
      {showPrevious && onPrevious && (
        <NavigationButton
          onClick={onPrevious}
          disabled={prevDisabled}
          direction="prev"
        />
      )}
      
      {/* Spacer for single button scenarios with spaced alignment */}
      {alignment === 'spaced' && (!showPrevious || !showNext) && (
        <div className="nav-spacer" />
      )}
      
      {/* Next Button */}
      {showNext && onNext && (
        <NavigationButton
          onClick={onNext}
          disabled={nextDisabled}
          direction="next"
        />
      )}
    </div>
  );
};