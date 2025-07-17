import * as React from 'react';
import { MapPin } from 'lucide-react';
import { StepProps } from '@/types';
import { TextInput, SelectInput } from '@/components/inputs';
import { ENVIRONMENT_OPTIONS } from '@/utils/constants';

export const LocationStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  return (
    <div className="app-container">
      <div className="content-card">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Map Placeholder */}
          <div className="order-2 lg:order-1">
            <div className="glass-effect rounded-3xl p-6 lg:p-8">
              <div className="w-full h-64 sm:h-80 bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl flex items-center justify-center relative overflow-hidden">
                {/* Map placeholder with Singapore landmarks */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200"></div>
                <div className="relative z-10 text-center">
                  <MapPin size={48} className="text-red-500 mx-auto mb-2" />
                  <p className="text-gray-700 font-medium">Project Location</p>
                  {formData.location && (
                    <p className="text-gray-600 text-sm mt-1">{formData.location}</p>
                  )}
                </div>
                
                {/* Decorative map elements */}
                <div className="absolute top-4 left-4 w-20 h-20 bg-green-200 rounded-lg opacity-60"></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 bg-blue-300 rounded-lg opacity-60"></div>
                <div className="absolute top-1/2 right-8 w-12 h-12 bg-yellow-200 rounded-lg opacity-60"></div>
              </div>
            </div>
          </div>
          
          {/* Form */}
          <div className="order-1 lg:order-2 space-y-6 lg:space-y-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-light text-white mb-2">Location</h2>
              <p className="text-white/70">Tell us about your project location</p>
            </div>
            
            <TextInput
              label="Where is your project?"
              placeholder="E.g. Upper Changi, Singapore"
              value={formData.location}
              onChange={(value) => updateFormData('location', value)}
              icon={<MapPin size={20} />}
            />
            
            <SelectInput
              label="What is the environment?"
              placeholder="Choose environment"
              value={formData.environment}
              onChange={(value) => updateFormData('environment', value)}
              options={ENVIRONMENT_OPTIONS}
            />

            {/* Environment descriptions */}
            {formData.environment && (
              <div className="glass-effect rounded-2xl p-4">
                <h4 className="text-emerald-400 font-medium mb-2">Environment Characteristics</h4>
                <p className="text-white/80 text-sm">
                  {getEnvironmentDescription(formData.environment)}
                </p>
              </div>
            )}

            {/* Progress Hint */}
            <div className="text-center pt-2">
              <p className="text-white/50 text-sm">
                Step 2 of 6 • Project Location
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getEnvironmentDescription(environment: string): string {
  const descriptions = {
    urban: "Dense city environment with moderate wind exposure and air pollution considerations. Requires balanced ventilation and aesthetic integration.",
    coastal: "High salt air exposure with strong wind-driven rain. Requires excellent corrosion resistance and superior rain defense capabilities.",
    industrial: "Heavy-duty environment with high air movement requirements and potential contaminants. Robust performance and easy maintenance essential.",
    suburban: "Moderate exposure with emphasis on aesthetics and residential compatibility. Balanced performance requirements."
  };
  
  return descriptions[environment as keyof typeof descriptions] || "General environment conditions apply.";
}