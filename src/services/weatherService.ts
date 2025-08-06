import { WeatherData } from '@/types';

/**
 * 🌧️ WeatherService Class - Updated for Railway Deployment
 * 
 * This service handles all weather-related API calls and data processing.
 * Updated to work with Railway backend deployment.
 */

class WeatherService {
  /**
   * Singleton instance of the WeatherService
   */
  private static instance: WeatherService;
  
  /**
   * Base URL for the Flask backend API
   * Uses environment variable for Railway deployment or fallback to localhost
   */
  private baseUrl = 'https://famelineluva-production.up.railway.app';
  /**
   * In-memory cache to store weather data by location
   * This reduces API calls and improves performance
   */
  private cache = new Map<string, WeatherData>();

  private constructor() {
    console.log(`Weather service initialized with API URL: ${this.baseUrl}`);
  }

  /**
   * Gets the singleton instance of WeatherService
   */
  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  /**
   * 📍 Validates a location without fetching full weather data
   */
  async validateLocation(location: string): Promise<{
    location: string;
    coordinates: [number, number];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/validate-location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Location validation failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Location validation error:', error);
      throw error;
    }
  }

  /**
   * 🌤️ Gets comprehensive weather data for a location
   */
  async getWeatherData(location: string): Promise<WeatherData> {
    if (this.cache.has(location)) {
      return this.cache.get(location)!;
    }

    try {
      const response = await fetch(`${this.baseUrl}/weather`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Weather data fetch failed');
      }

      const data = await response.json();
      
      const weatherData: WeatherData = {
        temperature: data.average_temperature,
        rainfall: data.average_rainfall,
        windSpeed: data.average_wind_speed,
        windDirection: data.average_wind_direction,
        recommended_rain_class: data.recommended_rain_class,
        location_valid: true,
        location: data.location,
        coordinates: data.coordinates,
        period: data.period,
        dataSource: data.data_source
      };

      this.cache.set(location, weatherData);
      return weatherData;
    } catch (error) {
      console.error('Weather data fetch error:', error);
      throw error;
    }
  }

  /**
   * 🌍 Gets weather data by coordinates
   */
  async getWeatherDataByCoordinates(lat: number, lon: number): Promise<WeatherData> {
    const cacheKey = `${lat},${lon}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch(`${this.baseUrl}/weather?lat=${lat}&lon=${lon}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Weather data fetch failed');
      }

      const data = await response.json();
      
      const weatherData: WeatherData = {
        temperature: data.average_temperature,
        rainfall: data.average_rainfall,
        windSpeed: data.average_wind_speed,
        windDirection: data.average_wind_direction,
        recommended_rain_class: data.recommended_rain_class,
        location_valid: true,
        location: data.location,
        coordinates: data.coordinates,
        period: data.period,
        dataSource: data.data_source
      };

      this.cache.set(cacheKey, weatherData);
      return weatherData;
    } catch (error) {
      console.error('Weather data fetch error:', error);
      throw error;
    }
  }

  /**
   * 🔌 Checks if the weather service backend is available
   */
  async healthCheck(): Promise<{ status: string; earthEngineInitialized: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (!response.ok) {
        throw new Error('Health check failed');
      }
      
      const data = await response.json();
      return {
        status: data.status,
        earthEngineInitialized: data.earth_engine_initialized
      };
    } catch (error) {
      console.error('Weather service health check failed:', error);
      return {
        status: 'error',
        earthEngineInitialized: false
      };
    }
  }

  /**
   * 🌧️ Gets user-friendly explanation of rain defense classes
   */
  getRainDefenseExplanation(rainClass: string): string {
    const explanations = {
      'A': 'Excellent protection - suitable for heavy tropical rainfall and storm conditions',
      'B': 'Very good protection - handles moderate to heavy rainfall effectively',
      'C': 'Good protection - suitable for light to moderate rainfall conditions',
      'D': 'Basic protection - best for dry climates with minimal rainfall'
    };
    
    return explanations[rainClass as keyof typeof explanations] || 'Protection level information not available';
  }

  /**
   * Clear cache (useful for development/testing)
   */
  clearCache(): void {
    this.cache.clear();
    console.log('Weather service cache cleared');
  }
}

export default WeatherService;