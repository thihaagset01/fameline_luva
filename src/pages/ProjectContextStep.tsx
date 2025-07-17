import * as React from 'react';
import { StepProps } from '@/types';
import {
  PURPOSE_OPTIONS,
  BUILDING_TYPE_OPTIONS,
  BUILDING_HEIGHT_OPTIONS
} from '@/utils/constants';

export const ProjectContextStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  return (
    <div className="app-container">
      <div className="content-card">
        <div className="form-side">
          {/* Welcome Message */}
          <div className="welcome-message">
            <h1 className="welcome-title">
              Project <span className="welcome-name">Context</span>
            </h1>
            <p className="welcome-subtitle">
              Tell us about the purpose and type of your building project.
            </p>
          </div>
          
          {/* Form Container */}
          <div className="form-container">
            <div className="input-group">
              <label className="input-label">What is the purpose?</label>
              <div className="input-wrapper">
                <select
                  className="input-field"
                  value={formData.purpose || ''}
                  onChange={(e) => updateFormData('purpose', e.target.value)}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 1rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '16px',
                    paddingRight: '3rem',
                    appearance: 'none'
                  }}
                >
                  <option value="">Choose purpose</option>
                  {PURPOSE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="input-indicator">
                  {formData.purpose && (
                    <div className="input-active-dot"></div>
                  )}
                </div>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">What is the building type?</label>
              <div className="input-wrapper">
                <select
                  className="input-field"
                  value={formData.buildingType || ''}
                  onChange={(e) => updateFormData('buildingType', e.target.value)}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 1rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '16px',
                    paddingRight: '3rem',
                    appearance: 'none'
                  }}
                >
                  <option value="">Choose building type</option>
                  {BUILDING_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="input-indicator">
                  {formData.buildingType && (
                    <div className="input-active-dot"></div>
                  )}
                </div>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">What is the building height?</label>
              <div className="input-wrapper">
                <select
                  className="input-field"
                  value={formData.buildingHeight || ''}
                  onChange={(e) => updateFormData('buildingHeight', e.target.value)}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 1rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '16px',
                    paddingRight: '3rem',
                    appearance: 'none'
                  }}
                >
                  <option value="">Choose building height</option>
                  {BUILDING_HEIGHT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="input-indicator">
                  {formData.buildingHeight && (
                    <div className="input-active-dot"></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Hint */}
          <div className="progress-hint">
            <p className="text-white/50 text-sm">
              Step 3 of 6 • Project Context
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};