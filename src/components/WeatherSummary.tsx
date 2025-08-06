import React from 'react';
import { WeatherData } from '@/types';
import { MapPin, Thermometer, CloudRain, Wind } from 'lucide-react';
import WeatherService from '@/services/weatherService';

const weatherService = WeatherService.getInstance();

interface WeatherSummaryProps {
  weatherData: WeatherData;
  className?: string;
}

export const WeatherSummary: React.FC<WeatherSummaryProps> = ({ 
  weatherData, 
  className = "" 
}) => {
  const rainDefenseExplanation = weatherService.getRainDefenseExplanation(
    weatherData.recommended_rain_class
  );

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-emerald-400" />
        <h3 className="text-lg font-semibold text-white">Weather Analysis</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center gap-3">
          <Thermometer className="w-4 h-4 text-orange-400" />
          <div>
            <p className="text-gray-400 text-sm">Temperature</p>
            <p className="text-white font-medium">{weatherData.temperature.toFixed(1)}°C</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <CloudRain className="w-4 h-4 text-blue-400" />
          <div>
            <p className="text-gray-400 text-sm">Annual Rainfall</p>
            <p className="text-white font-medium">{weatherData.rainfall.toFixed(0)}mm</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Wind className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-gray-400 text-sm">Wind Speed</p>
            <p className="text-white font-medium">{weatherData.windSpeed.toFixed(1)} m/s</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-700/50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-emerald-400 mb-2">
          Recommended Rain Defense: Class {weatherData.recommended_rain_class}
        </h4>
        <p className="text-gray-300 text-sm">{rainDefenseExplanation}</p>
      </div>
      
      <p className="text-gray-500 text-xs mt-3">
        Data period: {weatherData.period} | Source: {weatherData.dataSource}
      </p>
    </div>
  );
};