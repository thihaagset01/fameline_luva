import * as React from 'react';
import { StepProps } from '@/types';
import { TextInput } from '@/components/inputs';

export const UserInfoStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  return (
    <div className="app-container fixed-height-page">
      <div className="content-card">
        <div className="form-side">
          {/* Welcome Message */}
          <div className="welcome-message">
            <h1 className="welcome-title">
              I'm <span className="welcome-name">Luva</span>,
            </h1>
          </div>
          
          {/* Form Fields */}
          <div className="form-fields">
            {/* Name Input */}
            <TextInput
              label="What is your name?"
              placeholder="E.g. John Doe"
              value={formData.name}
              onChange={(value) => updateFormData('name', value)}
            />
            
            {/* Email Input */}
            <TextInput
              label="What is your email?"
              placeholder="E.g. johndoe@gmail.com"
              value={formData.email}
              onChange={(value) => updateFormData('email', value)}
              type="email"
            />
          </div>
        </div>
        
        {/* Orb side */}
        <div className="orb-side">
          <div className="orb-container">
            <div className="orb">
              <div className="orb-inner"></div>
              <div className="orb-highlight"></div>
              <div className="orb-glow"></div>
              <div className="orb-reflection"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};