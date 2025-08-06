from flask import Flask, request, jsonify, make_response
import os
import sys
import json
import math
import traceback
from dotenv import load_dotenv

# Try to import optional dependencies with fallbacks
try:
    import ee
    EE_AVAILABLE = True
except ImportError:
    print("⚠️ Google Earth Engine not available - using mock data")
    EE_AVAILABLE = False

try:
    from geopy.geocoders import Nominatim
    GEOPY_AVAILABLE = True
except ImportError:
    print("⚠️ Geopy not available - using mock geocoding")
    GEOPY_AVAILABLE = False

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Railway-compatible configuration
FLASK_PORT = int(os.getenv('PORT', 5000))  # Railway uses PORT env var
FLASK_HOST = '0.0.0.0'  # Required for Railway
FLASK_DEBUG = os.getenv('FLASK_DEBUG', '0') == '1'

# CORS origins - update this after frontend deployment
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 
    'http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,https://fameline-luva-production.up.railway.app').split(',')

print(f"🚀 Flask starting: PORT={FLASK_PORT}, DEBUG={FLASK_DEBUG}")
print(f"🌐 Allowed origins: {ALLOWED_ORIGINS}")
print(f"🌍 Earth Engine available: {EE_AVAILABLE}")
print(f"📍 Geopy available: {GEOPY_AVAILABLE}")

# Initialize services
EE_INITIALIZED = False
EE_AUTHENTICATED = False
geolocator = None

# Initialize geopy
if GEOPY_AVAILABLE:
    geolocator = Nominatim(user_agent="louverboy_weather", timeout=10)

# Initialize Earth Engine
if EE_AVAILABLE:
    try:
        EE_PROJECT_ID = os.getenv('EE_PROJECT_ID')
        if EE_PROJECT_ID:
            ee.Initialize(project=EE_PROJECT_ID)
            EE_INITIALIZED = True
            EE_AUTHENTICATED = True
            print(f"✅ Earth Engine initialized with project: {EE_PROJECT_ID}")
        else:
            print("⚠️ EE_PROJECT_ID not set - Earth Engine disabled")
    except Exception as e:
        print(f"❌ Earth Engine initialization failed: {e}")
        EE_INITIALIZED = False

# CORS handler
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin in ALLOWED_ORIGINS:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization'
        response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

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

def get_mock_weather_data(latitude, longitude):
    """Return mock weather data when Earth Engine is not available"""
    # Generate reasonable mock data based on coordinates
    # Tropical regions get more rain, higher temperatures
    is_tropical = abs(latitude) < 23.5
    
    if is_tropical:
        temperature = 26 + (5 * abs(latitude) / 23.5)  # 26-31°C
        rainfall = 1800 + (200 * (1 - abs(latitude) / 23.5))  # 1800-2000mm
        rain_class = 'A' if rainfall > 1800 else 'B'
    else:
        temperature = 15 + (10 * (1 - abs(latitude) / 90))  # 5-25°C
        rainfall = 500 + (500 * (1 - abs(latitude) / 90))  # 500-1000mm
        rain_class = 'C' if rainfall > 750 else 'D'
    
    wind_speed = 3.5 + (2 * abs(latitude) / 90)  # 3.5-5.5 m/s
    wind_direction = (longitude + 180) % 360  # Simple function of longitude
    
    return {
        'temperature': temperature,
        'rainfall': rainfall,
        'wind_speed': wind_speed,
        'wind_direction': wind_direction,
        'rain_class': rain_class
    }

def get_climate_data(latitude, longitude):
    """Get climate data from Google Earth Engine or return mock data"""
    if not EE_INITIALIZED:
        return get_mock_weather_data(latitude, longitude)
    
    try:
        # Earth Engine implementation (simplified)
        point = ee.Geometry.Point([longitude, latitude])
        
        # Use ERA5 or other datasets
        temperature_dataset = ee.ImageCollection('ECMWF/ERA5_LAND/MONTHLY_AGGR') \
            .filterDate('2020-01-01', '2023-12-31') \
            .select('temperature_2m')
        
        precipitation_dataset = ee.ImageCollection('ECMWF/ERA5_LAND/MONTHLY_AGGR') \
            .filterDate('2020-01-01', '2023-12-31') \
            .select('total_precipitation_sum')
        
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
        
        # Convert units
        temp_kelvin = mean_temp.get('temperature_2m', 293.15)
        precip_m_per_hour = mean_precip.get('total_precipitation_sum', 0.0001)
        
        temp_celsius = temp_kelvin - 273.15
        rain_mm = precip_m_per_hour * 1000 * 24 * 365
        
        # Determine rain class
        if rain_mm > 2000:
            rain_class = 'A'
        elif rain_mm > 1000:
            rain_class = 'B'
        elif rain_mm > 500:
            rain_class = 'C'
        else:
            rain_class = 'D'
        
        return {
            'temperature': temp_celsius,
            'rainfall': rain_mm,
            'wind_speed': 4.2,  # Mock for now
            'wind_direction': 180,  # Mock for now
            'rain_class': rain_class
        }
        
    except Exception as e:
        print(f"Earth Engine error, falling back to mock data: {e}")
        return get_mock_weather_data(latitude, longitude)

def mock_geocode(location_str):
    """Mock geocoding for common locations"""
    mock_locations = {
        'singapore': {'lat': 1.3521, 'lng': 103.8198, 'address': 'Singapore'},
        'kuala lumpur': {'lat': 3.1390, 'lng': 101.6869, 'address': 'Kuala Lumpur, Malaysia'},
        'bangkok': {'lat': 13.7563, 'lng': 100.5018, 'address': 'Bangkok, Thailand'},
        'manila': {'lat': 14.5995, 'lng': 120.9842, 'address': 'Manila, Philippines'},
        'jakarta': {'lat': -6.2088, 'lng': 106.8456, 'address': 'Jakarta, Indonesia'},
        'hong kong': {'lat': 22.3193, 'lng': 114.1694, 'address': 'Hong Kong'},
        'tokyo': {'lat': 35.6762, 'lng': 139.6503, 'address': 'Tokyo, Japan'},
        'new york': {'lat': 40.7128, 'lng': -74.0060, 'address': 'New York, NY, USA'},
        'london': {'lat': 51.5074, 'lng': -0.1278, 'address': 'London, UK'},
        'sydney': {'lat': -33.8688, 'lng': 151.2093, 'address': 'Sydney, NSW, Australia'}
    }
    
    location_key = location_str.lower().strip()
    if location_key in mock_locations:
        loc = mock_locations[location_key]
        return type('MockLocation', (), {
            'latitude': loc['lat'],
            'longitude': loc['lng'],
            'address': loc['address']
        })()
    
    # Default to Singapore if location not found
    return type('MockLocation', (), {
        'latitude': 1.3521,
        'longitude': 103.8198,
        'address': f'{location_str} (approximate)'
    })()

# API Routes
@app.route('/', methods=['GET'])
def root():
    """Root endpoint for Railway health checks"""
    return jsonify({
        'message': 'LouverBoy Weather API',
        'status': 'running',
        'version': '1.0.0',
        'endpoints': ['/health', '/weather', '/validate-location']
    })

@app.route('/health', methods=['GET', 'OPTIONS'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'earth_engine_initialized': EE_INITIALIZED,
        'earth_engine_authenticated': EE_AUTHENTICATED,
        'geopy_available': GEOPY_AVAILABLE,
        'earth_engine_available': EE_AVAILABLE,
        'port': FLASK_PORT,
        'debug': FLASK_DEBUG
    })

@app.route('/validate-location', methods=['POST', 'OPTIONS'])
def validate_location():
    """Validate a location and return coordinates"""
    try:
        data = request.get_json()
        if not data or 'location' not in data:
            return jsonify({'error': 'Location is required'}), 400
        
        location_str = data['location']
        
        if GEOPY_AVAILABLE and geolocator:
            try:
                location = geolocator.geocode(location_str)
                if location:
                    return jsonify({
                        'location': location.address,
                        'coordinates': [location.latitude, location.longitude]
                    })
            except Exception as e:
                print(f"Geocoding error: {e}")
        
        # Fallback to mock geocoding
        location = mock_geocode(location_str)
        return jsonify({
            'location': location.address,
            'coordinates': [location.latitude, location.longitude]
        })
        
    except Exception as e:
        print(f"Validation error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/weather', methods=['GET', 'POST', 'OPTIONS'])
def get_weather():
    """Get weather data for a location"""
    try:
        latitude = None
        longitude = None
        location_address = None
        
        if request.method == 'POST':
            data = request.get_json()
            if not data or 'location' not in data:
                return jsonify({'error': 'Location is required'}), 400
            
            location_str = data['location']
            
            # Geocode location
            if GEOPY_AVAILABLE and geolocator:
                try:
                    location = geolocator.geocode(location_str)
                    if location:
                        latitude = location.latitude
                        longitude = location.longitude
                        location_address = location.address
                except Exception as e:
                    print(f"Geocoding error: {e}")
            
            # Fallback to mock geocoding
            if latitude is None:
                location = mock_geocode(location_str)
                latitude = location.latitude
                longitude = location.longitude
                location_address = location.address
                
        else:  # GET request
            latitude = float(request.args.get('lat', 1.3521))
            longitude = float(request.args.get('lon', 103.8198))
            location_address = f"{latitude}, {longitude}"
        
        # Get climate data
        climate_data = get_climate_data(latitude, longitude)
        
        # Return weather data
        weather_data = {
            'location': location_address,
            'coordinates': [latitude, longitude],
            'average_temperature': round(climate_data['temperature'], 2),
            'average_rainfall': round(climate_data['rainfall'], 2),
            'average_wind_speed': round(climate_data['wind_speed'], 2),
            'average_wind_direction': round(climate_data['wind_direction'], 1),
            'recommended_rain_class': climate_data['rain_class'],
            'period': '2020-01-01 to 2023-12-31',
            'data_source': 'Google Earth Engine' if EE_INITIALIZED else 'Mock Climate Data'
        }
        
        return jsonify(weather_data)
        
    except Exception as e:
        print(f"Weather API error: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("🚀 Starting LouverBoy Weather API...")
    print(f"🔧 Configuration: host={FLASK_HOST}, port={FLASK_PORT}, debug={FLASK_DEBUG}")
    app.run(debug=FLASK_DEBUG, port=FLASK_PORT, host=FLASK_HOST)