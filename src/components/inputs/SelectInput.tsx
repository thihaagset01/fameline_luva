import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import './InputStyles.css';

/**
 * SelectInput Component 📝
 * 
 * A styled dropdown select component used throughout the application for user selections.
 * This component creates a consistent, branded dropdown with optional icon support.
 * 
 * Features:
 * - Custom styled dropdown with pill-shaped appearance
 * - Optional left icon (for categories, types, etc.)
 * - Right chevron indicator for dropdown functionality
 * - Consistent styling with other form inputs
 */

/**
 * Defines the structure of options in the dropdown
 * 
 * @property value - The actual value that will be stored/submitted (e.g., "commercial")
 * @property label - The user-friendly text displayed in the dropdown (e.g., "Commercial Building")
 */
interface SelectOption {
  value: string;
  label: string;
}

/**
 * Props for the SelectInput component
 * 
 * @property label - Text label shown above the select input
 * @property placeholder - Text shown when no option is selected
 * @property value - Currently selected value
 * @property onChange - Function called when selection changes
 * @property options - Array of available options to choose from
 * @property icon - Optional icon to display on the left side of the input
 */
interface SelectInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  icon?: React.ReactNode;
}

/**
 * Renders a styled select dropdown input with label and optional icon
 * 
 * This component is used throughout the wizard for all dropdown selections,
 * ensuring a consistent look and feel across the application.
 * 
 * @example
 * <SelectInput
 *   label="Building Type"
 *   placeholder="Select building type"
 *   value={buildingType}
 *   onChange={setBuildingType}
 *   options={[
 *     { value: "commercial", label: "Commercial" },
 *     { value: "residential", label: "Residential" }
 *   ]}
 *   icon={<Building size={20} />}
 * />
 */
export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  options,
  icon
}) => {
  // Render the select input with its label and styling
  return (
    // Container with spacing between label and input
    <div className="space-y-2">
      {/* Label above the select input */}
      <label className="block text-white text-lg">{label}</label>
      {/* Relative positioning container for the select and its icons */}
      <div className="relative">
        {/* Optional left icon (only rendered if provided) */}
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        {/* The select element with conditional padding based on icon presence */}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`input-pill ${icon ? 'pl-12' : ''} pr-12`}
          required
        >
          {/* Placeholder option (disabled, shown when no selection) */}
          <option value="" disabled>{placeholder}</option>
          {/* Map through all available options */}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown indicator (chevron) positioned on the right */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <ChevronDown size={20} />
        </div>
      </div>
    </div>
  );
};
