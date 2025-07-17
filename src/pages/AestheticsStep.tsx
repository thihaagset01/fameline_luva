import * as React from 'react';
import { StepProps } from '@/types';
import { ColorInput, Textarea, ToggleButton } from '@/components/inputs';
import { NavigationButton } from '@/components/NavigationButton';

// Popular color presets
const POPULAR_COLORS = [
  { name: 'Silver', hex: '#C0C0C0' },
  { name: 'Charcoal', hex: '#36454F' },
  { name: 'Bronze', hex: '#CD7F32' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#2C2C2C' },
  { name: 'Copper', hex: '#B87333' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Blue', hex: '#3B82F6' }
];

// Helper function to adjust color brightness
function adjustColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const r = (num >> 16) + amt;
  const g = ((num >> 8) & 0x00FF) + amt;
  const b = (num & 0x0000FF) + amt;
  return '#' + (
    0x1000000 +
    (Math.min(Math.max(r, 0), 255) * 0x10000) +
    (Math.min(Math.max(g, 0), 255) * 0x100) +
    Math.min(Math.max(b, 0), 255)
  ).toString(16).slice(1);
}

export const AestheticsStep: React.FC<StepProps> = ({ formData, updateFormData, onPrevStep, onNextStep }) => {
  return (
    <div className="app-container">
      <div className="content-card">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl lg:text-4xl font-light text-white mb-4">Aesthetics</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Define the visual characteristics and design preferences for your louver
          </p>
        </div>
      
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* Left Controls */}
          <div className="space-y-10 lg:space-y-12">
            {/* Mullion Visibility */}
            <div>
              <h3 className="text-white/90 text-lg mb-6 font-medium">Mullion visibility</h3>
              <div className="flex space-x-4">
                <ToggleButton
                  isActive={formData.mullionVisibility === 'visible'}
                  onClick={() => updateFormData('mullionVisibility', 'visible')}
                  label="Visible mullion"
                >
                  <div className="w-8 h-8 border-2 border-current rounded flex items-center justify-center">
                    <div className="w-3 h-3 border border-current"></div>
                  </div>
                </ToggleButton>
                
                <ToggleButton
                  isActive={formData.mullionVisibility === 'hidden'}
                  onClick={() => updateFormData('mullionVisibility', 'hidden')}
                  label="Hidden mullion"
                >
                  <div className="w-8 h-8 relative">
                    <div className="absolute inset-0 border-2 border-current rounded"></div>
                    <div className="absolute inset-1 bg-current rounded-sm opacity-60"></div>
                  </div>
                </ToggleButton>
              </div>
              <p className="text-white/60 text-sm mt-3">
                {formData.mullionVisibility === 'visible' 
                  ? 'Structural elements remain visible for architectural emphasis'
                  : 'Clean appearance with hidden structural elements'
                }
              </p>
            </div>
            
            {/* Blade Orientation */}
            <div>
              <h3 className="text-white/90 text-lg mb-6 font-medium">Blade orientation</h3>
              <div className="flex space-x-4">
                <ToggleButton
                  isActive={formData.bladeOrientation === 'horizontal'}
                  onClick={() => updateFormData('bladeOrientation', 'horizontal')}
                  label="Horizontal blades"
                >
                  <div className="w-8 h-8 flex flex-col justify-center space-y-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-0.5 bg-current rounded"></div>
                    ))}
                  </div>
                </ToggleButton>
                
                <ToggleButton
                  isActive={formData.bladeOrientation === 'vertical'}
                  onClick={() => updateFormData('bladeOrientation', 'vertical')}
                  label="Vertical blades"
                >
                  <div className="w-8 h-8 flex justify-center space-x-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="w-0.5 h-full bg-current rounded"></div>
                    ))}
                  </div>
                </ToggleButton>
              </div>
              <p className="text-white/60 text-sm mt-3">
                {formData.bladeOrientation === 'horizontal' 
                  ? 'Traditional horizontal lines for classic architectural appeal'
                  : 'Modern vertical lines for contemporary design'
                }
              </p>
            </div>
          </div>
          
          {/* Center 3D Louver Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <div 
                className="w-72 h-72 lg:w-80 lg:h-80 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, ${formData.color || '#10b981'}, ${adjustColor(formData.color || '#10b981', -20)})`
                }}
              >
                {/* Louver blade pattern */}
                <div className="w-full h-full p-8 flex items-center justify-center">
                  {formData.bladeOrientation === 'horizontal' ? (
                    <div className="w-full space-y-3">
                      {[...Array(8)].map((_, i) => (
                        <div 
                          key={i} 
                          className="h-2 bg-black/20 rounded-sm"
                          style={{ opacity: 0.3 + (i % 2) * 0.2 }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center space-x-3">
                      {[...Array(8)].map((_, i) => (
                        <div 
                          key={i} 
                          className="w-2 h-full bg-black/20 rounded-sm"
                          style={{ opacity: 0.3 + (i % 2) * 0.2 }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Mullion visibility indicator */}
                {formData.mullionVisibility === 'visible' && (
                  <div className="absolute inset-4 border-2 border-black/30 rounded-lg pointer-events-none"></div>
                )}
              </div>
              
              {/* Design details */}
              <div className="absolute -bottom-4 left-0 right-0 text-center">
                <span className="inline-block glass-effect px-4 py-2 rounded-full text-white/80 text-sm">
                  Preview Visualization
                </span>
              </div>
            </div>
          </div>
          
          {/* Right Controls */}
          <div className="space-y-6 lg:space-y-8">
            <ColorInput
              label="Colour (Hex)"
              placeholder="E.g. #808080"
              value={formData.color}
              onChange={(value) => updateFormData('color', value)}
            />
            
            <Textarea
              label="Further customisation"
              placeholder="E.g. Dimensions, material, aesthetics, blade thickness, blade-to-blade distance."
              value={formData.customization}
              onChange={(value) => updateFormData('customization', value)}
              rows={6}
            />

            {/* Quick color presets */}
            <div>
              <h4 className="text-white/90 text-sm mb-3 font-medium">Popular Colors</h4>
              <div className="grid grid-cols-4 gap-2">
                {POPULAR_COLORS.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => updateFormData('color', color.hex)}
                    className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-105 ${
                      formData.color === color.hex ? 'border-emerald-400' : 'border-white/30'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={`Select ${color.name} color`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Disclaimer */}
        <div className="text-center mt-12 lg:mt-16">
          <p className="text-white/60 text-sm max-w-2xl mx-auto">
            This is a drafted visual of your aesthetic and design needs, and is
            not a final representation of your louver. Final specifications will be 
            provided by our technical team.
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-8">
          <NavigationButton 
            onClick={onPrevStep || (() => {})} 
            direction="prev" 
          />
          <div className="text-center">
            <p className="text-white/50 text-sm">
              Step 4 of 6 • Design Preferences
            </p>
          </div>
          <NavigationButton 
            onClick={onNextStep || (() => {})} 
            direction="next" 
          />
        </div>
      </div>
    </div>
  );
};