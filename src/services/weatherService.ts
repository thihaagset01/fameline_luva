import { WeatherData } from '@/types';

class WeatherService {
  private static instance: WeatherService;
  private baseUrl = 'http://localhost:5000'; // Flask backend URL
  private cache = new Map<string, WeatherData>();

  private constructor() {}

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  /**
   * Validate a location without fetching weather data (fast)
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
   * Get comprehensive weather data for a location
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
   * Get weather data using coordinates
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
   * Check if the weather service is available
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
   * Get rain defense class explanation
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
   * Get wind resistance category
   */
  getWindResistanceCategory(windSpeed: number): 'Low' | 'Medium' | 'High' {
    if (windSpeed >= 20) return 'High';
    if (windSpeed >= 10) return 'Medium';
    return 'Low';
  }

  /**
   * Clear the cache (useful for testing)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const weatherService = WeatherService.getInstance();