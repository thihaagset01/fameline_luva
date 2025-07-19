import { WeatherData } from '@/types';

/**
 * 🌧️ WeatherService Class
 * 
 * This service handles all weather-related API calls and data processing.
 * It's implemented as a singleton to ensure consistent caching and state
 * management throughout the application.
 * 
 * Key features:
 * - Location validation
 * - Weather data retrieval from our Flask backend
 * - Caching to reduce API calls
 * - Helper methods for interpreting weather data
 * 
 * The weather data is crucial for making appropriate louver recommendations
 * as different weather conditions require different louver specifications.
 */

class WeatherService {
  /**
   * Singleton instance of the WeatherService
   */
  private static instance: WeatherService;
  
  /**
   * Base URL for the Flask backend API
   * This points to our local development server by default
   */
  private baseUrl = 'http://localhost:5000';
  
  /**
   * In-memory cache to store weather data by location
   * This reduces API calls and improves performance
   */
  private cache = new Map<string, WeatherData>();

  private constructor() {}

  /**
   * Gets the singleton instance of WeatherService
   * 
   * This ensures we only ever have one instance of the service
   * throughout the application, maintaining a consistent cache
   * and preventing duplicate API calls.
   * 
   * @returns The singleton WeatherService instance
   */
  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  /**
   * 📍 Validates a location without fetching full weather data
   * 
   * This is a lightweight API call that checks if a location exists
   * and returns its coordinates. It's used for quick validation before
   * fetching more detailed weather data.
   * 
   * @param location - The location string to validate (e.g., "Singapore")
   * @returns Promise with validated location name and coordinates
   * @throws Error if location cannot be validated
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
   * 
   * This method fetches detailed climate data including temperature,
   * rainfall, and wind information. It uses caching to avoid repeated
   * API calls for the same location.
   * 
   * The data comes from historical climate records and is used to make
   * appropriate louver recommendations based on local conditions.
   * 
   * @param location - The location string (e.g., "Singapore")
   * @returns Promise with complete WeatherData object
   * @throws Error if weather data cannot be retrieved
   */
  async getWeatherData(location: string): Promise<WeatherData> {
    // Check cache first
    const cacheKey = location.toLowerCase().trim();
    if (this.cache.has(cacheKey)) {
      console.log('Returning cached weather data for:', location);
      return this.cache.get(cacheKey)!;
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
      
      // Transform to our WeatherData interface
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

      // Cache the result
      this.cache.set(cacheKey, weatherData);
      console.log('Cached weather data for:', location);

      return weatherData;
    } catch (error) {
      console.error('Weather data fetch error:', error);
      throw error;
    }
  }

  /**
   * 📍 Gets weather data using geographic coordinates
   * 
   * An alternative way to fetch weather data using latitude and longitude
   * instead of a location name. Useful when coordinates are already known
   * or for more precise location targeting.
   * 
   * Like getWeatherData, this method uses caching for performance.
   * 
   * @param lat - Latitude coordinate
   * @param lon - Longitude coordinate
   * @returns Promise with complete WeatherData object
   * @throws Error if weather data cannot be retrieved
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
   * 
   * This health check verifies that our Flask backend is running
   * and that Google Earth Engine (used for climate data) is properly
   * initialized. It's useful for diagnosing connection issues.
   * 
   * @returns Promise with status and Earth Engine initialization state
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
   * 
   * Translates technical rain defense class codes (A, B, C, D) into
   * human-readable explanations that describe the level of protection
   * and typical rainfall conditions.
   * 
   * @param rainClass - The rain defense class code (A, B, C, or D)
   * @returns A descriptive explanation of the rain defense class
   */
  getRainClassExplanation(rainClass: string): string {
    const explanations = {
      'A': 'Class A: Highest level of rain defense required. Expect heavy rain and strong winds.',
      'B': 'Class B: High level of rain defense recommended. Moderate to heavy rainfall expected.',
      'C': 'Class C: Moderate rain defense adequate. Light to moderate rainfall typical.',
      'D': 'Class D: Basic rain defense sufficient. Low rainfall environment.'
    };
    return explanations[rainClass as keyof typeof explanations] || 'Rain class information not available.';
  }

  /**
   * 💨 Categorizes wind speed into resistance levels
   * 
   * Converts numerical wind speed values into qualitative categories
   * (Low, Medium, High) that are easier for users to understand and
   * correspond to different louver specifications.
   * 
   * @param windSpeed - The wind speed in meters per second
   * @returns Wind resistance category as 'Low', 'Medium', or 'High'
   */
  getWindResistanceCategory(windSpeed: number): 'Low' | 'Medium' | 'High' {
    if (windSpeed >= 20) return 'High';
    if (windSpeed >= 10) return 'Medium';
    return 'Low';
  }

  /**
   * 🚮 Clears the weather data cache
   * 
   * Removes all cached weather data, forcing fresh API calls
   * on subsequent requests. Primarily used during testing or
   * when you need to ensure fresh data is fetched.
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 📊 Gets statistics about the current cache state
   * 
   * Returns information about the cache size and contents,
   * which is useful for debugging and monitoring cache usage.
   * 
   * @returns Object with cache size and list of cached location keys
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const weatherService = WeatherService.getInstance();