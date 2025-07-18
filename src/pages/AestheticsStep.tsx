import * as React from 'react';
import { StepProps } from '@/types';

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

export const AestheticsStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  return (
    <div className="app-container fixed-height-page aesthetics-step">
      <h1 className="page-title">Design Aesthetics</h1>
      
      <div className="aesthetics-container">
        {/* Left column - Controls */}
        <div className="aesthetics-controls">
          {/* Mullion visibility */}
          <div className="aesthetics-group">
            <h3>Mullion visibility</h3>
            <div className="aesthetics-toggle-group">
              <button 
                className={`aesthetics-toggle ${formData.mullionVisibility === 'visible' ? 'active' : 'inactive'}`}
                onClick={() => updateFormData('mullionVisibility', 'visible')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                  <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
                </svg>
              </button>
              
              <button 
                className={`aesthetics-toggle ${formData.mullionVisibility === 'hidden' ? 'active' : 'inactive'}`}
                onClick={() => updateFormData('mullionVisibility', 'hidden')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                  <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Blade orientation */}
          <div className="aesthetics-group">
            <h3>Blade orientation</h3>
            <div className="aesthetics-toggle-group">
              <button 
                className={`aesthetics-toggle ${formData.bladeOrientation === 'horizontal' ? 'active' : 'inactive'}`}
                onClick={() => updateFormData('bladeOrientation', 'horizontal')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                  <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              
              <button 
                className={`aesthetics-toggle ${formData.bladeOrientation === 'vertical' ? 'active' : 'inactive'}`}
                onClick={() => updateFormData('bladeOrientation', 'vertical')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                  <path d="M6 4v16M12 4v16M18 4v16" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Middle column - Visualization */}
        <div className="aesthetics-visualization">
          <div className="louver-preview">
            <div 
              className="louver-frame"
              style={{
                background: `linear-gradient(135deg, ${formData.color || '#10b981'}, ${adjustColor(formData.color || '#10b981', -20)})`
              }}
            >
              <div className="louver-slats" style={{
                background: formData.bladeOrientation === 'horizontal' 
                  ? 'repeating-linear-gradient(0deg, transparent 0px, transparent 20px, rgba(0, 0, 0, 0.1) 20px, rgba(0, 0, 0, 0.1) 22px)'
                  : 'repeating-linear-gradient(90deg, transparent 0px, transparent 20px, rgba(0, 0, 0, 0.1) 20px, rgba(0, 0, 0, 0.1) 22px)'
              }}>
              </div>
              
              {formData.mullionVisibility === 'visible' && (
                <div className="mullion-indicator" style={{
                  position: 'absolute',
                  inset: '1rem',
                  border: '2px solid rgba(0, 0, 0, 0.3)',
                  borderRadius: '0.5rem',
                  pointerEvents: 'none'
                }}></div>
              )}
            </div>
          </div>
          <p className="louver-preview-note">
            This is a drafted visual of your aesthetic and design needs, and is
            not a final representation of your louver.
          </p>
        </div>
        
        {/* Right column - Inputs */}
        <div className="aesthetics-inputs">
          {/* Color picker */}
          <div className="aesthetics-input-group">
            <label>Color</label>
            <input 
              type="color" 
              className="aesthetics-input"
              value={formData.color || '#10b981'}
              onChange={(e) => updateFormData('color', e.target.value)}
            />
          </div>
          
          {/* Further customization */}
          <div className="aesthetics-input-group">
            <label>Further customisation</label>
            <textarea 
              className="aesthetics-textarea"
              placeholder="E.g. Dimensions, material, aesthetics, blade thickness, blade-to-blade distance."
              value={formData.customization || ''}
              onChange={(e) => updateFormData('customization', e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
};