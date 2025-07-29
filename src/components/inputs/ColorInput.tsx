import * as React from 'react';
import './InputStyles.css';

interface ColorInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export const ColorInput: React.FC<ColorInputProps> = ({
  label,
  placeholder,
  value,
  onChange
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-white text-lg">{label}</label>
      <div className="flex space-x-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-12 rounded-lg cursor-pointer"
          aria-label={`Select color for ${label}`}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-pill flex-1"
          pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
          title="Please enter a valid hex color code (e.g. #FF0000)"
        />
      </div>
    </div>
  );
};
