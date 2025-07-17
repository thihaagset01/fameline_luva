import * as React from 'react';
import { StepProps } from '@/types';
import { ENVIRONMENT_OPTIONS } from '@/utils/constants';

export const LocationStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  return (
    <div className="app-container">
      <div className="content-card">
        <div className="form-side">
          {/* Welcome Message */}
          <div className="welcome-message">
            <h1 className="welcome-title">
              Tell us about your <span className="welcome-name">project location</span>
            </h1>
            <p className="welcome-subtitle">
              Location and environment details help us recommend the perfect louver solution.
            </p>
          </div>
          
          {/* Form Container */}
          <div className="form-container">
            <div className="input-group">
              <label className="input-label">Where is your project?</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  className="input-field"
                  placeholder="E.g. Upper Changi, Singapore"
                  value={formData.location || ''}
                  onChange={(e) => updateFormData('location', e.target.value)}
                />
                <div className="input-indicator">
                  {formData.location && (
                    <div className="input-active-dot"></div>
                  )}
                </div>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">What is the environment?</label>
              <div className="input-wrapper">
                <select
                  className="input-field"
                  value={formData.environment || ''}
                  onChange={(e) => updateFormData('environment', e.target.value)}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 1rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '16px',
                    paddingRight: '3rem',
                    appearance: 'none'
                  }}
                >
                  <option value="">Choose environment</option>
                  {ENVIRONMENT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="input-indicator">
                  {formData.environment && (
                    <div className="input-active-dot"></div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Progress Hint */}
          <div className="progress-hint">
            <p className="text-white/50 text-sm">
              Step 2 of 6 • Project Location
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
