import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { MapPin, CheckCircle, AlertCircle, Cloud } from 'lucide-react';
import { StepProps } from '@/types';
import { weatherService } from '@/services/weatherService';
import { ENVIRONMENT_OPTIONS } from '@/utils/constants';

export const LocationStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  const [locationValid, setLocationValid] = useState(false);
  const [locationValidating, setLocationValidating] = useState(false);
  const [locationError, setLocationError] = useState<string>('');
  const [weatherLoading, setWeatherLoading] = useState(false);
  // Coordinates removed as they were unused
  const [validatedAddress, setValidatedAddress] = useState<string>('');

  // Debounced location validation
  const validateLocation = useCallback(async (location: string) => {
    if (!location || location.length < 3) {
      setLocationValid(false);
      setLocationError('');
      return;
    }

    setLocationValidating(true);
    setLocationError('');

    try {
      const result = await weatherService.validateLocation(location);
      setLocationValid(true);
      // Coordinates handling removed as they were unused
      setValidatedAddress(result.location);
      setLocationError('');
      
      // Start fetching weather data in the background
      fetchWeatherData(location);
    } catch (error) {
      setLocationValid(false);
      setLocationError(error instanceof Error ? error.message : 'Location not found');
      // Coordinates handling removed
      setValidatedAddress('');
    } finally {
      setLocationValidating(false);
    }
  }, []);

  // Fetch weather data in background
  const fetchWeatherData = useCallback(async (location: string) => {
    setWeatherLoading(true);
    try {
      const weatherData = await weatherService.getWeatherData(location);
      
      // Update form data with weather information
      updateFormData('weatherData', JSON.stringify(weatherData));
      
      // Auto-set environment based on location characteristics
      autoSetEnvironment(weatherData, location);
      
    } catch (error) {
      console.warn('Weather data fetch failed, continuing without weather:', error);
      // Don't show error to user - weather data is optional
    } finally {
      setWeatherLoading(false);
    }
  }, [updateFormData]);

  // Auto-set environment based on weather and location
  const autoSetEnvironment = useCallback((weatherData: any, location: string) => {
    const locationLower = location.toLowerCase();
    
    // Check for coastal indicators
    if (locationLower.includes('coast') || 
        locationLower.includes('beach') || 
        locationLower.includes('port') ||
        locationLower.includes('marine') ||
        weatherData.windSpeed > 15) {
      updateFormData('environment', 'coastal');
      return;
    }
    
    // Check for industrial indicators
    if (locationLower.includes('industrial') || 
        locationLower.includes('factory') || 
        locationLower.includes('plant')) {
      updateFormData('environment', 'industrial');
      return;
    }
    
    // Check for urban indicators
    if (locationLower.includes('city') || 
        locationLower.includes('downtown') || 
        locationLower.includes('urban') ||
        locationLower.includes('metro')) {
      updateFormData('environment', 'urban');
      return;
    }
    
    // Default to suburban
    updateFormData('environment', 'suburban');
  }, [updateFormData]);

  // Debounce location validation
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.location) {
        validateLocation(formData.location);
      }
    }, 800); // 800ms delay

    return () => clearTimeout(timeoutId);
  }, [formData.location, validateLocation]);

  const handleLocationChange = (value: string) => {
    updateFormData('location', value);
    // Reset validation state when user types
    if (value !== formData.location) {
      setLocationValid(false);
      setLocationError('');
      // Coordinates handling removed
      setValidatedAddress('');
    }
  };

  const getLocationInputStatus = () => {
    if (locationValidating) return 'validating';
    if (locationError) return 'error';
    if (locationValid) return 'valid';
    return 'default';
  };

  const renderLocationStatus = () => {
    const status = getLocationInputStatus();
    
    switch (status) {
      case 'validating':
        return (
          <div className="location-status validating">
            <div className="spinner"></div>
            <span>Validating location...</span>
          </div>
        );
      
      case 'valid':
        return (
          <div className="location-status valid">
            <CheckCircle size={16} className="status-icon" />
            <div className="status-content">
              <span className="status-text">Location verified</span>
              <span className="status-detail">{validatedAddress}</span>
              {weatherLoading && (
                <span className="weather-loading">
                  <Cloud size={14} />
                  Fetching weather data...
                </span>
              )}
            </div>
          </div>
        );
      
      case 'error':
        return (
          <div className="location-status error">
            <AlertCircle size={16} className="status-icon" />
            <span className="status-text">{locationError}</span>
          </div>
        );
      
      default:
        return null;
    }
  };

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
            {/* Location Input */}
            <div className="input-group">
              <label className="input-label">
                <MapPin size={20} className="inline mr-2" />
                Where is your project?
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  className={`input-field ${getLocationInputStatus()}`}
                  placeholder="E.g. Singapore, New York, London"
                  value={formData.location || ''}
                  onChange={(e) => handleLocationChange(e.target.value)}
                />
                <div className="input-indicator">
                  {formData.location && locationValid && (
                    <div className="input-active-dot"></div>
                  )}
                </div>
              </div>
              
              {/* Location Status */}
              {renderLocationStatus()}
            </div>

            {/* Environment Selection - Auto-populated but user can override */}
            {locationValid && (
              <div className="input-group environment-selection">
                <label className="input-label">
                  What type of environment? 
                  <span className="auto-detected">(Auto-detected)</span>
                </label>
                <div className="environment-options">
                  {ENVIRONMENT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`environment-option ${formData.environment === option.value ? 'selected' : ''}`}
                      onClick={() => updateFormData('environment', option.value)}
                    >
                      <span className="option-label">{option.label}</span>
                      {formData.environment === option.value && (
                        <CheckCircle size={16} className="option-check" />
                      )}
                    </button>
                  ))}
                </div>
                <p className="environment-help">
                  We've suggested an environment based on your location. You can change it if needed.
                </p>
              </div>
            )}

            {/* Location Tips */}
            <div className="location-tips">
              <h4>💡 Location Tips</h4>
              <ul>
                <li>Enter city name, address, or landmark</li>
                <li>Include country for better accuracy</li>
                <li>We'll automatically detect environment type</li>
                <li>Weather data helps optimize recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Styles */}
      <style>{`
        .location-status {
          margin-top: 0.75rem;
          padding: 0.75rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }
        
        .location-status.validating {
          background-color: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #3b82f6;
        }
        
        .location-status.valid {
          background-color: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #10b981;
        }
        
        .location-status.error {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }
        
        .status-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .status-detail {
          font-size: 0.75rem;
          opacity: 0.8;
        }
        
        .weather-loading {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          opacity: 0.7;
        }
        
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .input-field.validating {
          border: 2px solid #3b82f6;
        }
        
        .input-field.valid {
          border: 2px solid #10b981;
        }
        
        .input-field.error {
          border: 2px solid #ef4444;
        }
        
        .environment-selection {
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .auto-detected {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: normal;
          margin-left: 0.5rem;
        }
        
        .environment-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-top: 1rem;
        }
        
        .environment-option {
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .environment-option:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }
        
        .environment-option.selected {
          background: rgba(16, 185, 129, 0.2);
          border-color: #10b981;
          color: #10b981;
        }
        
        .environment-help {
          margin-top: 0.75rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          text-align: center;
        }
        
        .location-tips {
          margin-top: 2rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .location-tips h4 {
          margin: 0 0 0.75rem 0;
          color: #10b981;
          font-size: 0.875rem;
        }
        
        .location-tips ul {
          margin: 0;
          padding-left: 1rem;
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.75rem;
        }
        
        .location-tips li {
          margin-bottom: 0.25rem;
        }
      `}</style>
    </div>
  );
};