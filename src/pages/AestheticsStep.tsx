import * as React from 'react';
import { StepProps } from '@/types';
import './styles/AestheticsStep.css';
import { Orb } from '@/components/Orb';

/**
 * 🎨 AestheticsStep Component
 * 
 * This step allows users to customize the visual appearance of their louvers.
 * Users can select design preferences such as:
 * - Mullion visibility (visible or hidden structural elements)
 * - Blade orientation (horizontal or vertical slats) - NOW SMART!
 * - Color selection (using a color picker)
 * - Additional customization notes (via text input)
 * 
 * The component includes an interactive preview that updates in real-time
 * as users make selections, helping them visualize their choices.
 * 
 * 🆕 NEW: Smart blade orientation logic - only shows vertical option when
 * it's actually viable based on application type and historical data.
 */

/**
 * 🌈 Helper function to adjust color brightness
 * 
 * This utility function takes a hex color and adjusts its brightness
 * by the specified percentage. It's used to create gradient effects
 * in the louver preview visualization.
 * 
 * @param hex - The hex color code to adjust (e.g., '#10b981')
 * @param percent - Percentage to adjust brightness (-100 to 100)
 * @returns A new hex color code with adjusted brightness
 * 
 * Example: adjustColor('#10b981', -20) → darker version of the color
 */
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

/**
 * Main AestheticsStep component implementation
 * 
 * This component is structured in three columns:
 * 1. Left: Controls for mullion visibility and blade orientation (SMART!)
 * 2. Middle: Interactive louver visualization that updates based on selections
 * 3. Right: Color picker and customization text input
 * 
 * All user selections are stored in formData and updated via updateFormData.
 */
export const AestheticsStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  console.log('🎨 AestheticsStep - Current formData:', {
    bladeOrientation: formData.bladeOrientation,
    mullionVisibility: formData.mullionVisibility,
    color: formData.color,
    louverApplication: formData.louverApplication
  });

  /**
   * 🧠 Smart Logic: Only show blade orientation when vertical models are viable
   * Based on real-world historical data from our training dataset
   */
  const shouldShowBladeOrientation = (): boolean => {
    const { louverApplication, waterTolerance, airflowRequirement } = formData;
    
    // Case 1: Screening/Aesthetic applications - PL-2150V sometimes viable
    // Historical: Rooftop projects like Micron, Raffles City
    if (louverApplication === 'screening-aesthetic') {
      return true;
    }
    
    // Case 2: Budget-conscious industrial - PL-2150V can be cost-effective  
    // Historical: SUNWAY Warehouse chose PL-2150V for "cheapest vertical option"
    if (louverApplication === 'industrial-warehouse' && 
        (waterTolerance === 'moderate' || airflowRequirement === 'basic')) {
      return true;
    }
    
    // Case 3: Mission-critical with high-end requirements - PL-2250V viable
    // Historical: Data centers sometimes use PL-2250V alongside PL-2250
    if (louverApplication === 'mission-critical') {
      return true;
    }
    
    // Default: Hide blade orientation for applications where vertical is rarely used
    // Commercial, Infrastructure, Acoustic applications prefer horizontal (per historical data)
    return false;
  };

  /**
   * 🎯 Get context-specific help text for blade orientation
   */
  const getBladeOrientationHelpText = (): string => {
    const { louverApplication } = formData;
    
    switch (louverApplication) {
      case 'screening-aesthetic':
        return "Vertical orientation available for aesthetic screening applications";
      case 'industrial-warehouse':
        return "Vertical orientation can be cost-effective for warehouse projects";
      case 'mission-critical':
        return "Both orientations perform similarly - PL-2250 vs PL-2250V";
      default:
        return "";
    }
  };

  /**
   * 🔄 Auto-select horizontal if vertical becomes unavailable
   * Prevents users from being stuck with invalid selections
   */
  React.useEffect(() => {
    if (!shouldShowBladeOrientation() && formData.bladeOrientation === 'vertical') {
      console.log('🔄 Auto-switching to horizontal - vertical not viable for:', formData.louverApplication);
      updateFormData('bladeOrientation', 'horizontal');
    }
  }, [formData.louverApplication, formData.waterTolerance, formData.airflowRequirement]);

  const showBladeOrientation = shouldShowBladeOrientation();

  return (
    <div className="app-container fixed-height-page aesthetics-step">
      <h1 className="aesthetics-title">Aesthetics</h1>
      <div className="aesthetics-container">

        {/* Orb in top-right corner */}
                    <div className="orb-position-top-right">
                      <div className="orb-text"></div>
                        <Orb size="12rem" />
                        <div className="floating-text">Ooh, this louver is looking good!</div>
                    </div>

        {/* Left column - Controls for structural elements */}
        {/* These toggle buttons let users select key structural features */}
        <div className="aesthetics-left-controls">
          {/* Mullion visibility - Always shown */}
          <div className="aesthetics-group">
            <h3>Mullion visibility</h3>
            <div className="aesthetics-toggle-group">
              <button 
                className={`aesthetics-toggle ${formData.mullionVisibility === 'visible' ? 'active' : 'inactive'}`}
                onClick={() => updateFormData('mullionVisibility', 'visible')}
                title="Show structural frame (visible mullion)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                  <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
                </svg>
              </button>
              
              <button 
                className={`aesthetics-toggle ${formData.mullionVisibility === 'hidden' ? 'active' : 'inactive'}`}
                onClick={() => updateFormData('mullionVisibility', 'hidden')}
                title="Hide structural frame (hidden mullion)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                  <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Blade orientation - Conditionally shown based on application */}
          {showBladeOrientation && (
            <div className="aesthetics-group">
              <h3>Blade orientation</h3>
              <div className="aesthetics-toggle-group">
                <button 
                  className={`aesthetics-toggle ${formData.bladeOrientation === 'horizontal' ? 'active' : 'inactive'}`}
                  onClick={() => updateFormData('bladeOrientation', 'horizontal')}
                  title="Horizontal blade orientation (industry standard)"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                    <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
                
                <button 
                  className={`aesthetics-toggle ${formData.bladeOrientation === 'vertical' ? 'active' : 'inactive'}`}
                  onClick={() => updateFormData('bladeOrientation', 'vertical')}
                  title="Vertical blade orientation (specialized applications)"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="24" height="24">
                    <path d="M6 4v16M12 4v16M18 4v16" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              
              {/* Helper text explaining when vertical is viable */}
              {getBladeOrientationHelpText() && (
                <p className="orientation-help-text">
                  💡 {getBladeOrientationHelpText()}
                </p>
              )}
            </div>
          )}
          
          {/* Show explanation when blade orientation is hidden */}
          {!showBladeOrientation && (
            <div className="aesthetics-note">
              <div className="note-content">
                <h4>Horizontal Orientation</h4>
                <p>
                  is recommended for{' '}
                  <span className="application-highlight">
                    {formData.louverApplication?.replace('-', ' ')} applications
                  </span>{' '}
                  based on performance data and industry best practices.
                </p>
                <div className="note-details">
                  {formData.louverApplication === 'commercial-general' && (
                    <small>MRT stations and commercial buildings prefer horizontal</small>
                  )}
                  {formData.louverApplication === 'infrastructure' && (
                    <small>LTA and infrastructure projects use horizontal orientation</small>
                  )}
                  {formData.louverApplication === 'specialized-acoustic' && (
                    <small>Acoustic performance optimized for horizontal orientation</small>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Middle column - Interactive louver visualization */}
        {/* This preview updates in real-time to show how selections affect appearance */}
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
                  ? 'repeating-linear-gradient(0deg, transparent 0px, transparent 20px, rgba(0, 0, 0, 0.4) 20px, rgba(0, 0, 0, 0.1) 22px)'
                  : 'repeating-linear-gradient(90deg, transparent 0px, transparent 20px, rgba(0, 0, 0, 0.4) 20px, rgba(0, 0, 0, 0.1) 22px)'
              }}>
              </div>
              
              {formData.mullionVisibility === 'visible' && (
                <div className="mullion-indicator" style={{
                  position: 'absolute',
                  inset: '1rem',
                  border: '5px solid rgba(0, 0, 0, 0.3)',
                  borderRadius: '1rem',
                  pointerEvents: 'none'
                }}></div>
              )}
            </div>
          </div>
          <p className="louver-preview-note">
            This is a drafted visual and is not a final representation of your louver.
          </p>
        </div>
        
        {/* Right column - Color and custom inputs */}
        {/* These controls allow for color selection and additional customization notes */}
        <div className="aesthetics-right-inputs">
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