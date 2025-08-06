import React from 'react';
import { WeatherData } from '@/types';
import { Thermometer, Wind, Droplets, Shield, Cloud } from 'lucide-react';
import WeatherService from '@/services/weatherService';

const weatherService = WeatherService.getInstance();

interface WeatherSummaryProps {
  /**
   * Weather data object containing temperature, rainfall, wind speed, and more
   */
  weatherData: WeatherData;

}

/**
 * Renders a detailed weather analysis card with climate insights
 * 
 * @param props - Component props containing weather data
 */
export const WeatherSummary: React.FC<WeatherSummaryProps> = ({ weatherData }) => {
  /**
   * Maps rain defense classes to appropriate colors for visual indication
   * 
   * Class A (highest protection) is red, while Class D (basic protection)
   * is green, creating an intuitive visual scale of protection requirements.
   * 
   * @param rainClass - The rain defense class (A, B, C, or D)
   * @returns Hex color code corresponding to the rain class
   */
  const getRainClassColor = (rainClass: string): string => {
    switch (rainClass) {
      case 'A': return '#ef4444'; // Red - highest protection needed
      case 'B': return '#f97316'; // Orange - high protection
      case 'C': return '#eab308'; // Yellow - moderate protection  
      case 'D': return '#10b981'; // Green - basic protection sufficient
      default: return '#6b7280'; // Gray - unknown
    }
  };

  /**
   * Determines wind category, color, and description based on wind speed
   * 
   * Categorizes the project location's wind conditions into Low, Medium, or High
   * based on the average wind speed. Each category has a corresponding color
   * and description to help users understand the implications for louver selection.
   * 
   * @returns Object with category name, color code, and descriptive text
   */
  const getWindCategory = (): { category: string; color: string; description: string } => {
    const windSpeed = weatherData.windSpeed;
    if (windSpeed >= 20) {
      return { category: 'High', color: '#ef4444', description: 'Strong winds - enhanced structural requirements' };
    } else if (windSpeed >= 10) {
      return { category: 'Medium', color: '#f97316', description: 'Moderate winds - standard requirements' };
    } else {
      return { category: 'Low', color: '#10b981', description: 'Light winds - minimal wind load considerations' };
    }
  };

  const windInfo = getWindCategory();

  return (
    <div className="weather-summary-card">
      <div className="weather-header">
        <Cloud className="weather-icon" />
        <div>
          <h3 className="weather-title">Climate Analysis</h3>
          <p className="weather-subtitle">
            Based on historical data • {weatherData.period}
          </p>
        </div>
      </div>

      <div className="weather-grid">
        {/* Temperature */}
        <div className="weather-stat">
          <div className="stat-icon">
            <Thermometer size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{weatherData.temperature.toFixed(1)}°C</div>
            <div className="stat-label">Avg Temperature</div>
          </div>
        </div>

        {/* Rainfall */}
        <div className="weather-stat">
          <div className="stat-icon">
            <Droplets size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{weatherData.rainfall.toFixed(1)} mm</div>
            <div className="stat-label">Daily Rainfall</div>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="weather-stat">
          <div className="stat-icon">
            <Wind size={20} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{weatherData.windSpeed.toFixed(1)} m/s</div>
            <div className="stat-label">Wind Speed</div>
            <div className="stat-category" style={{ color: windInfo.color }}>
              {windInfo.category}
            </div>
          </div>
        </div>

        {/* Rain Defense Class */}
        <div className="weather-stat rain-class-stat">
          <div className="stat-icon">
            <Shield size={20} />
          </div>
          <div className="stat-content">
            <div 
              className="stat-value rain-class-value" 
              style={{ color: getRainClassColor(weatherData.recommended_rain_class) }}
            >
              Class {weatherData.recommended_rain_class}
            </div>
            <div className="stat-label">Rain Defense Required</div>
          </div>
        </div>
      </div>

      {/* Weather Insights */}
      <div className="weather-insights">
        <h4 className="insights-title">Climate Considerations</h4>

        <div className="insight-item">
          <div className="insight-label">Rain Protection:</div>
          <div className="insight-text">
            {weatherService.getRainDefenseExplanation(weatherData.recommended_rain_class)}

          </div>
        </div>

        {weatherData.windSpeed >= 15 && (
          <div className="insight-item">
            <div className="insight-label">Wind Exposure:</div>
            <div className="insight-text">
              {windInfo.description}
            </div>
          </div>
        )}

        {weatherData.rainfall >= 20 && (
          <div className="insight-item">
            <div className="insight-label">High Rainfall:</div>
            <div className="insight-text">
              Above-average rainfall suggests prioritizing superior water resistance features.
            </div>
          </div>
        )}
      </div>

      {/* BS EN 13030:2001 Standard Note */}
      <div className="standard-note">
        <p className="standard-text">
          Rain defense classification calculated according to 
          <strong> BS EN 13030:2001</strong> standard using wind-driven rain analysis.
        </p>
      </div>

      {/* 
        CSS Styles for the WeatherSummary component
        
        Note: In a future update, these styles should be migrated to global CSS
        classes in index.css for better maintainability and consistency across
        the application.
      */}
      <style>{`
        .weather-summary-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          margin: 1.5rem 0;
        }

        .weather-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .weather-icon {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          padding: 0.5rem;
          border-radius: 0.5rem;
        }

        .weather-title {
          color: white;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }

        .weather-subtitle {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
          margin: 0;
        }

        .weather-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .weather-stat {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .stat-icon {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          padding: 0.5rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          color: white;
          font-size: 1.125rem;
          font-weight: 600;
          line-height: 1.2;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        .stat-category {
          font-size: 0.75rem;
          font-weight: 500;
          margin-top: 0.25rem;
        }

        .rain-class-stat {
          border: 2px solid ${getRainClassColor(weatherData.recommended_rain_class)};
          background: rgba(${getRainClassColor(weatherData.recommended_rain_class).slice(1).match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ')}, 0.1);
        }

        .rain-class-value {
          font-weight: 700;
          font-size: 1.25rem;
        }

        .weather-insights {
          margin-bottom: 1.5rem;
        }

        .insights-title {
          color: white;
          font-size: 1rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
        }

        .insight-item {
          margin-bottom: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 0.5rem;
          border-left: 3px solid #10b981;
        }

        .insight-label {
          color: #10b981;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .insight-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .standard-note {
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .standard-text {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.75rem;
          margin: 0;
          text-align: center;
          line-height: 1.4;
        }

        .standard-text strong {
          color: #10b981;
        }

        @media (max-width: 768px) {
          .weather-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .weather-stat {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};