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
    <div className="app-container">
      <div className="content-card">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-light text-white mb-4">Project Context</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Help us understand your building requirements and performance needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {/* Purpose */}
          <div className="space-y-4">
            <SelectInput
              label="What is the purpose?"
              placeholder="Choose purpose"
              value={formData.purpose}
              onChange={(value) => updateFormData('purpose', value)}
              options={PURPOSE_OPTIONS}
            />
            
            {formData.purpose && (
              <div className="glass-effect rounded-xl p-4">
                <h4 className="text-emerald-400 text-sm font-medium mb-1">Purpose Focus</h4>
                <p className="text-white/80 text-xs">
                  {getPurposeDescription(formData.purpose)}
                </p>
              </div>
            )}
          </div>
          
          {/* Building Type */}
          <div className="space-y-4">
            <SelectInput
              label="What is the building?"
              placeholder="Choose building type"
              value={formData.buildingType}
              onChange={(value) => updateFormData('buildingType', value)}
              options={BUILDING_TYPE_OPTIONS}
            />
            
            {formData.buildingType && (
              <div className="glass-effect rounded-xl p-4">
                <h4 className="text-emerald-400 text-sm font-medium mb-1">Building Requirements</h4>
                <p className="text-white/80 text-xs">
                  {getBuildingTypeDescription(formData.buildingType)}
                </p>
              </div>
            )}
          </div>
          
          {/* Building Height */}
          <div className="space-y-4">
            <SelectInput
              label="What is the building height?"
              placeholder="Choose height"
              value={formData.buildingHeight}
              onChange={(value) => updateFormData('buildingHeight', value)}
              options={BUILDING_HEIGHT_OPTIONS}
            />
            
            {formData.buildingHeight && (
              <div className="glass-effect rounded-xl p-4">
                <h4 className="text-emerald-400 text-sm font-medium mb-1">Height Considerations</h4>
                <p className="text-white/80 text-xs">
                  {getHeightDescription(formData.buildingHeight)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Preview */}
        {formData.purpose && formData.buildingType && formData.buildingHeight && (
          <div className="mt-12 text-center">
            <div className="glass-effect rounded-2xl p-6 max-w-2xl mx-auto">
              <h3 className="text-emerald-400 font-medium mb-3">Project Summary</h3>
              <p className="text-white/90 text-lg">
                {getProjectSummary(formData.purpose, formData.buildingType, formData.buildingHeight)}
              </p>
            </div>
          </div>
        )}

        {/* Step indicator */}
        <div className="text-center mt-8">
          <p className="text-white/50 text-sm">
            Step 3 of 6 • Project Requirements
          </p>
        </div>
      </div>
    </div>
  );
};

function getPurposeDescription(purpose: string): string {
  const descriptions = {
    ventilation: "Maximize airflow efficiency and air exchange rates",
    'weather-protection': "Superior rain defense and wind resistance",
    acoustic: "Sound transmission control and noise reduction",
    aesthetic: "Architectural integration and visual appeal"
  };
  return descriptions[purpose as keyof typeof descriptions] || "";
}

function getBuildingTypeDescription(buildingType: string): string {
  const descriptions = {
    commercial: "Professional appearance with reliable performance",
    residential: "Aesthetic compatibility with moderate performance",
    industrial: "Robust construction for high-duty applications", 
    healthcare: "Acoustic control and superior air quality",
    education: "Noise reduction for learning environments"
  };
  return descriptions[buildingType as keyof typeof descriptions] || "";
}

function getHeightDescription(height: string): string {
  const descriptions = {
    'low-rise': "Standard performance for ground-level exposure",
    'mid-rise': "Enhanced wind resistance for moderate heights",
    'high-rise': "Superior weather protection for high wind exposure"
  };
  return descriptions[height as keyof typeof descriptions] || "";
}

function getProjectSummary(purpose: string, buildingType: string, height: string): string {
  const purposeLabels = {
    ventilation: "ventilation",
    'weather-protection': "weather protection", 
    acoustic: "acoustic control",
    aesthetic: "aesthetic integration"
  };
  
  const buildingLabels = {
    commercial: "commercial",
    residential: "residential",
    industrial: "industrial",
    healthcare: "healthcare",
    education: "educational"
  };
  
  const heightLabels = {
    'low-rise': "low-rise",
    'mid-rise': "mid-rise", 
    'high-rise': "high-rise"
  };
  
  return `${purposeLabels[purpose as keyof typeof purposeLabels]} for ${heightLabels[height as keyof typeof heightLabels]} ${buildingLabels[buildingType as keyof typeof buildingLabels]} building`;
}