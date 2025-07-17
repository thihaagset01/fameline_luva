import * as React from 'react';

interface TextInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  icon?: React.ReactNode;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  icon
}) => {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
      <div className="input-wrapper relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`input-field ${icon ? 'pl-12' : ''}`}
        />
        <div className="input-indicator">
          {value && (
            <div className="input-active-dot"></div>
          )}
        </div>
      </div>
    </div>
  );
};
