import * as React from 'react';
import { Home } from 'lucide-react';
import { HeaderProps } from '@/types';

export const Header: React.FC<HeaderProps> = ({ currentStep, totalSteps }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between">
      {/* Empty left side to balance the layout */}
      <div className="p-5"></div>
      
      {/* Progress indicators if needed */}
      <div className="flex-1"></div>
      
      {/* Home icon in top right */}
      <div className="p-5 pointer-events-none">
        <a href="/" className="home-icon-link inline-block pointer-events-auto">
          <Home className="w-6 h-6 text-white" />
        </a>
      </div>
      
      {/* Progress Indicator */}
      <div className="flex items-center space-x-3">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentStep 
              ? 'bg-emerald-400 scale-110 shadow-lg shadow-emerald-400/30' 
              : index < currentStep 
                ? 'bg-white/50' 
                : 'bg-white/20'}`}
          />
        ))}
      </div>
    </header>
  );
};