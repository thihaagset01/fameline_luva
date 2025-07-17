import * as React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface NavigationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  direction?: 'next' | 'prev';
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({ 
  onClick, 
  disabled = false,
  direction = 'next'
}) => {
  const isNext = direction === 'next';
  
  return (
    <div className={`nav-button-container ${isNext ? 'next-container' : 'prev-container'}`}>
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
        {isNext ? 
          <ArrowRight size={24} className="nav-button-icon" /> : 
          <ArrowLeft size={24} className="nav-button-icon" />}
      </button>
    </div>
  );
};