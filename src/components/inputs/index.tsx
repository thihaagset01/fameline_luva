import React from 'react';

/**
 * SelectOption Interface
 * Defines the structure for dropdown option items
 */
interface SelectOption {
  /** Unique identifier or value for the option */
  value: string;
  /** Display text shown to the user */
  label: string;
}

/**
 * 🎨 Input Components Collection
 * 
 * This file contains all the reusable input components used throughout the application.
 * Each component follows consistent patterns for styling, validation, and user interaction.
 * 
 * Components include:
 * - TextInput: For single-line text entry
 * - SelectInput: For dropdown selections
 * - Textarea: For multi-line text entry
 * - ToggleButton: For toggle button functionality
 * - ColorInput: For color selection with visual preview
 * 
 * All inputs maintain consistent styling with the global design system
 * and provide proper accessibility attributes.
 */

/**
 * TextInput Component 📝
 * 
 * A styled text input field with optional icon and error state.
 * Used for collecting single-line text data from users.
 */
interface TextInputProps {
  /** The label displayed above the input field */
  label: string;
  /** Placeholder text shown when the input is empty */
  placeholder: string;
  /** Current value of the input field */
  value: string;
  /** Handler function called when the input value changes */
  onChange: (value: string) => void;
  /** Input type - either regular text or email with validation */
  type?: 'text' | 'email';
  /** Optional icon to display inside the input field */
  icon?: React.ReactNode;
  /** Error message to display when validation fails */
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

/**
 * SelectInput Component 🔽
 * 
 * A styled dropdown select component with custom styling and error handling.
 * Used for selecting from predefined options throughout the application.
 */
interface SelectInputProps {
  /** The label displayed above the select field */
  label: string;
  /** Text shown when no option is selected */
  placeholder: string;
  /** Currently selected value */
  value: string;
  /** Handler function called when selection changes */
  onChange: (value: string) => void;
  /** Array of options to display in the dropdown */
  options: SelectOption[];
  /** Error message to display when validation fails */
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

/**
 * Textarea Component 📝
 * 
 * A multi-line text input for longer form responses.
 * Used for collecting detailed information from users.
 */
interface TextareaProps {
  /** The label displayed above the textarea */
  label: string;
  /** Placeholder text shown when the textarea is empty */
  placeholder: string;
  /** Current content of the textarea */
  value: string;
  /** Handler function called when the content changes */
  onChange: (value: string) => void;
  /** Number of visible text rows (default: 6) */
  rows?: number;
  /** Error message to display when validation fails */
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

/**
 * ToggleButton Component 🔊
 * 
 * A button that can be toggled between active and inactive states.
 * Used for binary selections throughout the application.
 */
interface ToggleButtonProps {
  /** Whether the toggle is currently in active state */
  isActive: boolean;
  /** Handler function called when the button is clicked */
  onClick: () => void;
  /** Content to display inside the button */
  children: React.ReactNode;
  /** Additional CSS classes to apply to the button */
  className?: string;
  /** Accessible label for screen readers (important for a11y) */
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

/**
 * ColorInput Component 🎨
 * 
 * A specialized input for color selection with a visual color preview.
 * Used for selecting colors for louver customization.
 */
interface ColorInputProps {
  /** The label displayed above the color input */
  label: string;
  /** Placeholder text shown when no color is selected */
  placeholder: string;
  /** Current color value (hex code or color name) */
  value: string;
  /** Handler function called when the color changes */
  onChange: (value: string) => void;
  /** Error message to display when validation fails */
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