from flask import Flask, request, jsonify, make_response
import ee
from geopy.geocoders import Nominatim
import random
import traceback
import os
import sys
import json
import math
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Railway-specific configuration
FLASK_PORT = int(os.getenv('PORT', 5000))  # Railway uses PORT environment variable
FLASK_HOST = '0.0.0.0'  # Required for Railway
FLASK_DEBUG = os.getenv('FLASK_DEBUG', '0') == '1'  # Set to False for production

# Parse allowed origins from environment variable
# Update this with your Railway frontend URL after frontend deployment
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 
    'http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001').split(',')

print(f"Flask app starting with PORT={FLASK_PORT}, DEBUG={FLASK_DEBUG}")
print(f"Allowed origins: {ALLOWED_ORIGINS}")

# Manual CORS handler
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    
    if origin in ALLOWED_ORIGINS:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
    
    return response

# Handle preflight OPTIONS requests
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        origin = request.headers.get('Origin')
        
        response = make_response()
        if origin in ALLOWED_ORIGINS:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
            response.headers['Access-Control-Allow-Credentials'] = 'true'
        
        return response

# Initialize geocoding service
geolocator = Nominatim(user_agent="louvre_selector", timeout=10)

# Earth Engine initialization
EE_INITIALIZED = False
EE_AUTHENTICATED = False

try:
    # Try to initialize Earth Engine
    EE_PROJECT_ID = os.getenv('EE_PROJECT_ID')
    if EE_PROJECT_ID:
        ee.Initialize(project=EE_PROJECT_ID)
        EE_INITIALIZED = True
        EE_AUTHENTICATED = True
        print(f"✅ Earth Engine initialized successfully with project: {EE_PROJECT_ID}")
    else:
        print("⚠️ EE_PROJECT_ID not found in environment variables")
except Exception as e:
    print(f"❌ Earth Engine initialization failed: {e}")
    EE_INITIALIZED = False
    EE_AUTHENTICATED = False

def get_climate_data(latitude, longitude, start_date='2020-01-01', end_date='2023-12-31'):
    """Get climate data from Google Earth Engine"""
    try:
        # Define point of interest
        point = ee.Geometry.Point([longitude, latitude])
        
        # Get temperature data (ERA5 reanalysis data)
        temperature_dataset = ee.ImageCollection('ECMWF/ERA5_LAND/MONTHLY_AGGR') \
            .filterDate(start_date, end_date) \
            .select('temperature_2m')
        
        # Get precipitation data  
        precipitation_dataset = ee.ImageCollection('ECMWF/ERA5_LAND/MONTHLY_AGGR') \
            .filterDate(start_date, end_date) \
            .select('total_precipitation_sum')
        
        # Get wind data
        wind_u_dataset = ee.ImageCollection('ECMWF/ERA5_LAND/MONTHLY_AGGR') \
            .filterDate(start_date, end_date) \
            .select('u_component_of_wind_10m')
        
        wind_v_dataset = ee.ImageCollection('ECMWF/ERA5_LAND/MONTHLY_AGGR') \
            .filterDate(start_date, end_date) \
            .select('v_component_of_wind_10m')
        
        # Calculate means
        mean_temp = temperature_dataset.mean().reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=point,
            scale=25000,
            maxPixels=1e9
        ).getInfo()
        
        mean_precip = precipitation_dataset.mean().reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=point,
            scale=25000,
            maxPixels=1e9
        ).getInfo()
        
        mean_wind_u = wind_u_dataset.mean().reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=point,
            scale=25000,
            maxPixels=1e9
        ).getInfo()
        
        mean_wind_v = wind_v_dataset.mean().reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=point,
            scale=25000,
            maxPixels=1e9
        ).getInfo()
        
        # Extract values and handle potential None values
        temp_kelvin = mean_temp.get('temperature_2m', 293.15)
        precip_m_per_hour = mean_precip.get('total_precipitation_sum', 0.0001)
        wind_u = mean_wind_u.get('u_component_of_wind_10m', 0)
        wind_v = mean_wind_v.get('v_component_of_wind_10m', 0)
        
        # Convert units
        temp_celsius = temp_kelvin - 273.15
        rain_mm = precip_m_per_hour * 1000 * 24 * 365  # Convert to mm/year
        wind_speed = math.sqrt(wind_u**2 + wind_v**2)
        wind_dir_deg = math.degrees(math.atan2(wind_v, wind_u)) % 360
        
        # Determine rain defense class based on annual rainfall
        if rain_mm > 2000:
            rain_class = 'A'  # Excellent protection needed
        elif rain_mm > 1000:
            rain_class = 'B'  # Very good protection needed
        elif rain_mm > 500:
            rain_class = 'C'  # Good protection needed
        else:
            rain_class = 'D'  # Basic protection sufficient
        
        return {
            'temperature': temp_celsius,
            'rainfall': rain_mm,
            'wind_speed': wind_speed,
            'wind_direction': wind_dir_deg,
            'rain_class': rain_class
        }
        
    except Exception as e:
        print(f"Error in get_climate_data: {e}")
        raise e

@app.route('/validate-location', methods=['POST', 'OPTIONS'])
def validate_location():
    """Validate a location and return its coordinates"""
    try:
        data = request.get_json()
        location_name = data.get('location')
        
        if not location_name:
            return jsonify({'error': 'Location name is required'}), 400
        
        # Use geopy to validate and get coordinates
        location = geolocator.geocode(location_name)
        
        if not location:
            return jsonify({'error': 'Location not found'}), 404
        
        return jsonify({
            'location': location.address,
            'coordinates': [location.latitude, location.longitude]
        })
        
    except Exception as e:
        print(f"Error in validate_location: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/weather', methods=['GET', 'POST', 'OPTIONS'])
def get_weather():
    """Get weather data for a location"""
    try:
        # Handle both POST (with location name) and GET (with coordinates) requests
        if request.method == 'POST':
            data = request.get_json()
            location_name = data.get('location')
            
            if not location_name:
                return jsonify({'error': 'Location is required'}), 400
            
            # Get coordinates from location name
            location = geolocator.geocode(location_name)
            if not location:
                return jsonify({'error': 'Location not found'}), 404
                
            latitude = location.latitude
            longitude = location.longitude
            location_address = location.address
            
        else:  # GET request with lat/lon parameters
            latitude = float(request.args.get('lat'))
            longitude = float(request.args.get('lon'))
            
            # Reverse geocode to get location name
            location = geolocator.reverse(f"{latitude}, {longitude}")
            location_address = location.address if location else f"{latitude}, {longitude}"
        
        # Try to get weather data from Earth Engine
        if EE_INITIALIZED:
            try:
                climate_data = get_climate_data(latitude, longitude)
                
                start_date = '2020-01-01'
                end_date = '2023-12-31'
                
                weather_data = {
                    'location': location_address,
                    'coordinates': [latitude, longitude],
                    'average_temperature': round(climate_data['temperature'], 2),
                    'average_rainfall': round(climate_data['rainfall'], 2),
                    'average_wind_speed': round(climate_data['wind_speed'], 2),
                    'average_wind_direction': round(climate_data['wind_direction'], 1),
                    'recommended_rain_class': climate_data['rain_class'],
                    'period': f'{start_date} to {end_date}',
                    'data_source': 'Google Earth Engine'
                }
                
                return jsonify(weather_data)
            except Exception as e:
                print(f"Error getting weather data: {e}")
                print(f"Detailed error type: {type(e).__name__}")
                print("Detailed error traceback:")
                traceback.print_exc()
                return jsonify({'error': f'Earth Engine error: {str(e)}'}), 500
        
        # If Earth Engine is not initialized, return an error
        return jsonify({'error': 'Earth Engine is not initialized'}), 503
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET', 'OPTIONS'])
def health_check():
    """Simple endpoint to check if the API is running"""
    return jsonify({
        'status': 'ok',
        'earth_engine_initialized': EE_INITIALIZED,
        'earth_engine_authenticated': EE_AUTHENTICATED,
        'port': FLASK_PORT,
        'debug': FLASK_DEBUG
    })

# Root endpoint for Railway health checks
@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        'message': 'LouverBoy Weather API',
        'status': 'running',
        'endpoints': ['/health', '/weather', '/validate-location']
    })

# Start the Flask server
if __name__ == '__main__':
    print("🚀 Starting Flask server for weather API...")
    print(f"Earth Engine initialized: {EE_INITIALIZED}")
    print(f"Server configuration: host={FLASK_HOST}, port={FLASK_PORT}, debug={FLASK_DEBUG}")
    app.run(debug=FLASK_DEBUG, port=FLASK_PORT, host=FLASK_HOST)