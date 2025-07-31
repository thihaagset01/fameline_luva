import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import {  CheckCircle, AlertCircle, Cloud } from 'lucide-react';
import { StepProps } from '@/types';
import { weatherService } from '@/services/weatherService';
import { ENVIRONMENT_OPTIONS } from '@/utils/constants';
import './styles/LocationStep.css';

/**
 * 📍 LocationStep Component - FIXED VERSION
 */
export const LocationStep: React.FC<StepProps> = ({ formData, updateFormData }) => {
  // Basic state
  const [locationValid, setLocationValid] = useState(false);
  const [locationValidating, setLocationValidating] = useState(false);
  const [locationError, setLocationError] = useState<string>('');
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [validatedAddress, setValidatedAddress] = useState<string>('');
  
  // User intent tracking
  const [userHasManuallySelectedEnvironment, setUserHasManuallySelectedEnvironment] = useState(false);
  
  // Debounce ref
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * 🧠 Auto-set environment based on location and weather
   * MOVED TO TOP to fix "used before declaration" error
   */
  const autoSetEnvironment = useCallback((weatherData: any, location: string) => {
    // Only auto-set if user hasn't manually selected
    if (userHasManuallySelectedEnvironment) {
      console.log('User has manually selected environment, skipping auto-detection');
      return;
    }
    
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
  }, [updateFormData, userHasManuallySelectedEnvironment]);

  /**
   * Fetch weather data for validated location
   */
  const fetchWeatherData = useCallback(async (location: string) => {
    if (weatherLoading) {
      console.log('⏳ Weather data fetch already in progress');
      return;
    }

    console.log('🌤️ Fetching weather data for:', location);
    setWeatherLoading(true);
    
    try {
      const weatherData = await weatherService.getWeatherData(location);
      
      // Update form data with weather information
      updateFormData('weatherData', JSON.stringify(weatherData));
      
      // Auto-set environment based on location characteristics
      autoSetEnvironment(weatherData, location);
      
      console.log('✅ Weather data fetched successfully');
    } catch (error) {
      console.warn('⚠️ Weather data fetch failed, continuing without weather:', error);
    } finally {
      setWeatherLoading(false);
    }
  }, [updateFormData, autoSetEnvironment, weatherLoading]);

  /**
   * Validate location with proper error handling and deduplication
   */
  const validateLocation = useCallback(async (location: string) => {
    if (!location || location.length < 3) {
      setLocationValid(false);
      setLocationError('');
      return;
    }

    // Prevent duplicate requests
    if (locationValidating) {
      console.log('⏳ Validation already in progress, skipping:', location);
      return;
    }

    console.log('🌍 Starting validation for:', location);
    setLocationValidating(true);
    setLocationError('');

    try {
      const result = await weatherService.validateLocation(location);
      setLocationValid(true);
      setValidatedAddress(result.location);
      setLocationError('');
      
      console.log('✅ Location validated, fetching weather data');
      // Start fetching weather data in the background
      fetchWeatherData(location);
    } catch (error) {
      console.log('❌ Location validation failed:', error);
      setLocationValid(false);
      setLocationError(error instanceof Error ? error.message : 'Location not found');
      setValidatedAddress('');
    } finally {
      setLocationValidating(false);
    }
  }, [locationValidating, fetchWeatherData]);

  /**
   * Handle location input changes
   */
  const handleLocationChange = (value: string) => {
    console.log('📝 Location input changed to:', value);
    
    // Update form data
    updateFormData('location', value);
    
    // Reset validation state immediately for visual feedback
    if (value !== formData.location) {
      setLocationValid(false);
      setLocationError('');
      setValidatedAddress('');
      
      // Only check for significant changes if both values exist and are meaningful
      if (formData.location && formData.location.length > 2 && value.length > 2) {
        const currentLocation = formData.location.toLowerCase().trim();
        const newLocation = value.toLowerCase().trim();
        
        // Conservative significant change detection
        const isSignificantChange = (
          Math.abs(currentLocation.length - newLocation.length) > 10 || 
          !newLocation.includes(currentLocation.substring(0, Math.min(5, currentLocation.length)))
        );
        
        if (isSignificantChange) {
          setUserHasManuallySelectedEnvironment(false);
          console.log('🔄 Major location change - re-enabling auto-environment detection');
        }
      }
    }
  };

  /**
   * ⏱️ FIXED Debounced location validation
   */
  useEffect(() => {
    // Clear existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Only validate if location is meaningful (3+ characters)
    if (formData.location && formData.location.length >= 3) {
      debounceRef.current = setTimeout(() => {
        console.log('🔄 Debounced validation triggered for:', formData.location);
        validateLocation(formData.location);
      }, 2000); // 2 second delay
    } else {
      // Reset validation state for short inputs
      setLocationValid(false);
      setLocationError('');
      setValidatedAddress('');
    }

    // Cleanup function
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [formData.location]); // Removed validateLocation from deps to prevent loops

  /**
   * Get status for styling location input
   */
  const getLocationInputStatus = () => {
    if (locationValidating) return 'validating';
    if (locationError) return 'error';
    if (locationValid) return 'valid';
    return 'default';
  };

  /**
   * Render location status message
   */
  const renderLocationStatus = () => {
    if (locationValidating) {
      return (
        <div className="location-status validating">
          <div className="status-spinner"></div>
          <span>Validating location...</span>
        </div>
      );
    }
    
    if (locationError) {
      return (
        <div className="location-status error">
          <AlertCircle size={16} />
          <span>{locationError}</span>
        </div>
      );
    }
    
    if (locationValid) {
      return (
        <div className="location-status valid">
          <CheckCircle size={16} />
          <span>Location verified: {validatedAddress}</span>
          {weatherLoading && (
            <div className="weather-loading">
              <Cloud size={14} />
              <span>Getting weather data...</span>
            </div>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="step-container">
      <div className="step-content">
        <div className="step-header">
          <h2 className="step-title">Project Location</h2>
          <p className="step-description">
          Location and environment details help us recommend the perfect louver solution.
          </p>
        </div>
      
        {/* Location Input */}
        <div className="input-group">
          <label className="input-label">
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
              {userHasManuallySelectedEnvironment ? (
                <span className="user-selected">✓ User Selected</span>
              ) : (
                <span className="auto-detected">🤖 Auto-detected</span>
              )}
            </label>
            <div className="environment-options">
              {ENVIRONMENT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`environment-option ${formData.environment === option.value ? 'selected' : ''}`}
                  onClick={() => {
                    updateFormData('environment', option.value);
                    setUserHasManuallySelectedEnvironment(true);
                    console.log(`User manually selected environment: ${option.value}`);
                  }}
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
  );
};