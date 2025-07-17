import React from 'react';
import { SelectOption } from '@/types';

// Text Input Component
interface TextInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email';
  icon?: React.ReactNode;
  error?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  icon,
  error
}) => {
  return (
    <div className="w-full">
      <label className="block text-white/90 text-lg mb-3 font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            input-pill ${icon ? 'pl-12' : ''} ${error ? 'ring-2 ring-red-400' : ''}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${label}-error` : undefined}
        />
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-600">
            {icon}
          </div>
        )}
      </div>
      {error && (
        <p id={`${label}-error`} className="mt-2 text-red-400 text-sm">
          {error}
        </p>
      )}
    </div>
  );
};

// Select Input Component
interface SelectInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  error?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  options,
  error
}) => {
  return (
    <div className="w-full">
      <label className="block text-white/90 text-lg mb-3 font-medium">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            input-pill appearance-none pr-12 cursor-pointer
            ${error ? 'ring-2 ring-red-400' : ''}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${label}-error` : undefined}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p id={`${label}-error`} className="mt-2 text-red-400 text-sm">
          {error}
        </p>
      )}
    </div>
  );
};

// Textarea Component
interface TextareaProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  rows = 6,
  error
}) => {
  return (
    <div className="w-full">
      <label className="block text-white/90 text-lg mb-3 font-medium">
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`
          w-full px-6 py-4 rounded-3xl bg-white text-gray-800 placeholder-gray-400 text-lg 
          focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none transition-all duration-200
          ${error ? 'ring-2 ring-red-400' : ''}
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${label}-error` : undefined}
      />
      {error && (
        <p id={`${label}-error`} className="mt-2 text-red-400 text-sm">
          {error}
        </p>
      )}
    </div>
  );
};

// Toggle Button Component
interface ToggleButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  label?: string;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  isActive,
  onClick,
  children,
  className = '',
  label
}) => {
  return (
    <button
      onClick={onClick}
      className={`toggle-button ${isActive ? 'active' : 'inactive'} ${className}`}
      aria-pressed={isActive}
      aria-label={label}
    >
      {children}
    </button>
  );
};

// Color Input Component
interface ColorInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const ColorInput: React.FC<ColorInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error
}) => {
  return (
    <div className="w-full">
      <label className="block text-white/90 text-lg mb-3 font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            input-pill pr-16 ${error ? 'ring-2 ring-red-400' : ''}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${label}-error` : undefined}
        />
        {/* Color preview */}
        <div 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full border-2 border-gray-300"
          style={{ backgroundColor: value || '#808080' }}
          aria-hidden="true"
        />
      </div>
      {error && (
        <p id={`${label}-error`} className="mt-2 text-red-400 text-sm">
          {error}
        </p>
      )}
    </div>
  );
};