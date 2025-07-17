import * as React from 'react';

interface ToggleButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  isActive,
  onClick,
  label,
  children
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center space-y-2 transition-all duration-200 ${
        isActive 
          ? 'text-emerald-400' 
          : 'text-white/60 hover:text-white/80'
      }`}
      aria-pressed={isActive}
      type="button"
    >
      <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
        isActive 
          ? 'bg-emerald-400/20 border-2 border-emerald-400' 
          : 'bg-white/10 border-2 border-white/20 hover:border-white/30'
      }`}>
        {children}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};
