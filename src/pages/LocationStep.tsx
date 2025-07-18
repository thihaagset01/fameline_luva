import * as React from 'react';
import { StepProps } from '@/types';

export const LocationStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  return (
    <div className="app-container fixed-height-page">
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
                  placeholder="E.g. Singapore"
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

          </div>
        </div>

      </div>
    </div>
  );
};
