import React from 'react';
import { StepProps } from '@/types';
import { SelectInput } from '@/components/inputs';
import { 
  PURPOSE_OPTIONS, 
  BUILDING_TYPE_OPTIONS, 
  BUILDING_HEIGHT_OPTIONS 
} from '@/utils/constants';

export const ProjectContextStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Title */}
      <h1 className="text-4xl lg:text-5xl font-light text-white mb-16 text-center">
        Project Context
      </h1>
      
      {/* Three Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl w-full">
        {/* Purpose Column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{
            fontSize: '1.25rem',
            color: 'white',
            fontWeight: '300',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            What is the purpose?
          </h3>
          <select
            style={{
              width: '100%',
              maxWidth: '280px',
              padding: '1rem 1.5rem',
              borderRadius: '9999px',
              backgroundColor: 'white',
              color: '#374151',
              fontSize: '1rem',
              fontWeight: '500',
              border: 'none',
              outline: 'none',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 1.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '16px',
              paddingRight: '3rem'
            }}
            value={formData.purpose || ''}
            onChange={(e) => updateFormData('purpose', e.target.value)}
          >
            <option value="">Choose purpose</option>
            {PURPOSE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Building Type Column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{
            fontSize: '1.25rem',
            color: 'white',
            fontWeight: '300',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            What is the building?
          </h3>
          <select
            style={{
              width: '100%',
              maxWidth: '280px',
              padding: '1rem 1.5rem',
              borderRadius: '9999px',
              backgroundColor: 'white',
              color: '#374151',
              fontSize: '1rem',
              fontWeight: '500',
              border: 'none',
              outline: 'none',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 1.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '16px',
              paddingRight: '3rem'
            }}
            value={formData.buildingType || ''}
            onChange={(e) => updateFormData('buildingType', e.target.value)}
          >
            <option value="">Choose building type</option>
            {BUILDING_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Building Height Column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{
            fontSize: '1.25rem',
            color: 'white',
            fontWeight: '300',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            What is the building height?
          </h3>
          <select
            style={{
              width: '100%',
              maxWidth: '280px',
              padding: '1rem 1.5rem',
              borderRadius: '9999px',
              backgroundColor: 'white',
              color: '#374151',
              fontSize: '1rem',
              fontWeight: '500',
              border: 'none',
              outline: 'none',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 1.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '16px',
              paddingRight: '3rem'
            }}
            value={formData.buildingHeight || ''}
            onChange={(e) => updateFormData('buildingHeight', e.target.value)}
          >
            <option value="">Choose height</option>
            {BUILDING_HEIGHT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};