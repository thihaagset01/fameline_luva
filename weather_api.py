from flask import Flask, request, jsonify, make_response
# Remove flask_cors import completely - we'll handle CORS manually
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
# NO CORS library - we handle it manually

# Get environment variables with defaults
FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))
FLASK_HOST = os.getenv('FLASK_HOST', '0.0.0.0')
FLASK_DEBUG = os.getenv('FLASK_DEBUG', '1') == '1'

# Parse allowed origins from environment variable
ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001').split(',')

# Manual CORS handler
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    # Only allow specific origins from environment variable
    
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

# Initialize once when server starts
# Increase timeout for geocoding requests
geolocator = Nominatim(user_agent="louvre_selector", timeout=10)

# Try to initialize Earth Engine, but provide fallback if it fails
EE_INITIALIZED = False

# Check if Earth Engine authentication has been completed
EE_CREDENTIALS_PATH = os.path.expanduser('~/.config/earthengine/credentials')
EE_GCLD_PATH = os.path.expanduser('~/.config/gcloud/application_default_credentials.json')
EE_AUTHENTICATED = os.path.exists(EE_CREDENTIALS_PATH) and os.path.exists(EE_GCLD_PATH)
    
print(f"Earth Engine credentials {'found' if EE_AUTHENTICATED else 'not found'} at {EE_CREDENTIALS_PATH}")
print(f"Google Cloud credentials {'found' if EE_AUTHENTICATED else 'not found'} at {EE_GCLD_PATH}")
    
try:
    # Use the project ID from environment variables
    ee_project_id = os.getenv('EE_PROJECT_ID')
    if ee_project_id:
        print(f"Attempting to initialize Earth Engine with project ID: {ee_project_id}")
        ee.Initialize(project=ee_project_id)
    else:
        print("Warning: No Earth Engine project ID found in environment variables")
        ee.Initialize()
    
    # Test if Earth Engine is actually working by making a simple request
    print("Testing Earth Engine initialization with a simple request...")
    try:
        # Try to get a simple image to verify Earth Engine is working
        image = ee.Image('USGS/SRTMGL1_003')
        info = image.getInfo()
        print("Earth Engine test successful! Got image info.")
        EE_INITIALIZED = True
        print("Google Earth Engine initialized successfully!")
    except Exception as test_error:
        print(f"Earth Engine initialization test failed: {test_error}")
        print("Earth Engine appears to be initialized but may not be fully functional.")
        EE_INITIALIZED = False
except Exception as e:
    
    print(f"Warning: Could not initialize Google Earth Engine: {e}")

def get_rain_class(mean_rain_fall, mean_wind_speed, mean_wind_dir, exposure_type, exposure_dir=0):
    """
    Calculate rain class based on BS EN 13030:2001 standard.
    
    Args:
        mean_rain_fall: Average rainfall in mm/day
        mean_wind_speed: Wind speed in m/s
        mean_wind_dir: Wind direction in radians
        exposure_type: Level of exposure ('high', 'medium', 'low')
        exposure_dir: Direction of exposure in radians (defaults to 0)
        
    Returns:
        A string representing the rain class ('A', 'B', 'C', or 'D')
    """
    # These exposure coefficients are directly from the standard
    exposure_map = {
        'high': 0.35,    # Coastal areas, open terrain
        'medium': 0.25,  # Suburban, forest
        'low': 0.2,      # City centers, dense urban areas
    }
    
    # Get exposure coefficient
    a = exposure_map.get(exposure_type, 0.25)  # Default to medium if not specified
    
    # Calculate wind-driven rain coefficient (C_wdr) as per BS EN 13030:2001
    wind_angle_factor = abs(math.cos(mean_wind_dir - exposure_dir))
    C_wdr = min(1, a * mean_wind_speed * wind_angle_factor)
    
    # Calculate wind-driven rain rate (l/h per m²)
    q_wdr = (mean_rain_fall/24 * C_wdr)/3600
    
    # Calculate relative exposure
    relative_exposure = q_wdr/20.83
    
    # Determine rain class based on effectiveness rating thresholds
    if relative_exposure >= 0.8:
        return 'A'  # High rain protection required
    elif relative_exposure >= 0.4:
        return 'B'  # Significant rain protection required
    elif relative_exposure >= 0.2:
        return 'C'  # Moderate rain protection required
    else:
        return 'D'  # Minimal rain protection required

@app.route('/validate-location', methods=['POST', 'OPTIONS'])
def validate_location():
    """Lightweight endpoint that only validates a location without fetching weather data"""
    try:
        # Get location from request body
        data = request.get_json()
        if not data or 'location' not in data:
            return jsonify({'error': 'Please provide a location'}), 400
        
        location_str = data['location']
        
        # Geocode the location
        try:
            location = geolocator.geocode(location_str)
            if not location:
                return jsonify({'error': f'Could not geocode location: {location_str}'}), 400
                
            # Return only the location information without weather data
            return jsonify({
                'location': location.address,
                'coordinates': [location.latitude, location.longitude]
            })
        except Exception as e:
            return jsonify({'error': f'Geocoding error: {str(e)}'}), 500
            
    except Exception as e:
        print(f"Error in validate_location: {e}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/weather', methods=['POST', 'GET', 'OPTIONS'])
def get_weather():
    """Get weather data for a location"""
    try:
        location_str = ""
        
        # Handle both GET and POST requests
        if request.method == 'GET':
            # Get location from query parameters
            lat = request.args.get('lat')
            lon = request.args.get('lon')
            
            if not lat or not lon:
                return jsonify({'error': 'Please provide lat and lon parameters'}), 400
                
            # Create a location object with the coordinates
            class LocationObj:
                def __init__(self, lat, lon):
                    self.latitude = float(lat)
                    self.longitude = float(lon)
                    self.address = f"Coordinates: {lat}, {lon}"
            
            location = LocationObj(lat, lon)
            location_str = f"Coordinates: {lat}, {lon}"
        else:  # POST request
            # Get location from request body
            data = request.get_json()
            if not data or 'location' not in data:
                return jsonify({'error': 'Please provide a location'}), 400
            
            location_str = data['location']
            
            # Geocode the location
            try:
                location = geolocator.geocode(location_str)
                if not location:
                    return jsonify({'error': f'Could not geocode location: {location_str}'}), 400
            except Exception as e:
                return jsonify({'error': f'Geocoding error: {str(e)}'}), 500
        
        # Print debug information
        print(f"Processing weather request for: {location_str}")
        print(f"Coordinates: {location.latitude}, {location.longitude}")
        
        # If Earth Engine is not initialized, return an error
        if not EE_INITIALIZED:
            print("Earth Engine not initialized, returning error")
            return jsonify({'error': 'Earth Engine is not initialized. Cannot calculate weather data.'}), 503
        
        # If Earth Engine is initialized, try to get real data
        if EE_INITIALIZED:
            try:
                # Create Earth Engine point
                print(f"Creating Earth Engine point for coordinates: {location.longitude}, {location.latitude}")
                point = ee.Geometry.Point([location.longitude, location.latitude])
                
                # Define date range for weather data (using a 5-year range for faster queries)
                end_date = '2020-07-09'  # Latest date in the dataset
                start_date = '2015-07-09'  # 5 years before the end date
                print(f"Using 5-year climate data range: {start_date} to {end_date}")
                
                # Fetch dataset with optimized query - select only bands we need
                dataset = ee.ImageCollection('ECMWF/ERA5/DAILY') \
                            .select(['mean_2m_air_temperature', 'total_precipitation', 'u_component_of_wind_10m', 'v_component_of_wind_10m']) \
                            .filterDate(start_date, end_date) \
                            .filterBounds(point)
                
                # Check if the dataset is empty
                dataset_size = dataset.size().getInfo()
                print(f"Dataset size: {dataset_size} images")
                
                if dataset_size == 0:
                    print("WARNING: Dataset is empty! Trying a different date range...")
                    # Try a different date range (3 years from an earlier period)
                    start_date = '1997-01-01'
                    end_date = '2000-01-01'
                    print(f"Using alternative 3-year climate data range: {start_date} to {end_date}")
                    
                    dataset = ee.ImageCollection('ECMWF/ERA5/DAILY') \
                                .select(['mean_2m_air_temperature', 'total_precipitation', 'u_component_of_wind_10m', 'v_component_of_wind_10m']) \
                                .filterDate(start_date, end_date) \
                                .filterBounds(point)
                    
                    dataset_size = dataset.size().getInfo()
                    print(f"New dataset size: {dataset_size} images")
                    
                    if dataset_size == 0:
                        return jsonify({
                            'error': 'No Earth Engine data available for this location'
                        }), 404
                
                print(f"Successfully fetched dataset from Earth Engine with {dataset_size} images")
                
                # Get a single image from the collection (first image)
                first_image = dataset.first()
                
                # Check if first_image is None
                if first_image is None:
                    print("ERROR: first_image is None despite dataset size > 0")
                    return jsonify({
                        'error': 'Earth Engine dataset is empty or invalid'
                    }), 500
                
                # Print available bands to debug
                print("Available bands:")
                band_names = first_image.bandNames().getInfo()
                print(band_names)
                
                # Create a buffer around the point to make it a small region
                # This helps avoid CRS issues
                buffer_distance = 1000  # 1km buffer
                region = point.buffer(buffer_distance)
                
                try:
                    # Use a single reduceRegion call to get all values at once (much faster)
                    mean_values = dataset.mean().reduceRegion(
                        reducer=ee.Reducer.mean(),
                        geometry=point,
                        scale=30000,  # Scale in meters
                        maxPixels=1e9
                    ).getInfo()
                    
                    # Extract values from the result
                    temp_kelvin = mean_values['mean_2m_air_temperature']
                    rain_m = mean_values['total_precipitation']
                    u_wind = mean_values['u_component_of_wind_10m']
                    v_wind = mean_values['v_component_of_wind_10m']
                    
                    # Convert from Kelvin to Celsius
                    temp_celsius = temp_kelvin - 273.15
                    print(f"Mean temperature: {temp_celsius:.2f}°C")
                    
                    # Convert from m to mm
                    rain_mm = rain_m * 1000
                    print(f"Mean rainfall: {rain_mm:.2f} mm")
                    
                    print(f"Wind components: u={u_wind:.2f}, v={v_wind:.2f}")
                    
                    # Extract wind components
                    if u_wind is not None and v_wind is not None:
                        # Calculate wind speed (magnitude of the wind vector)
                        wind_speed = math.sqrt(u_wind**2 + v_wind**2)
                        
                        # Calculate wind direction in radians and convert to meteorological convention
                        # (direction FROM which the wind is blowing)
                        wind_dir_rad = math.atan2(v_wind, u_wind)
                        wind_dir_deg = (math.degrees(wind_dir_rad) + 180) % 360
                        
                        print(f"Wind speed: {wind_speed:.2f} m/s")
                        print(f"Wind direction: {wind_dir_deg:.1f}° (meteorological)")
                        
                        # Calculate rain class - assume medium exposure by default
                        rain_class = get_rain_class(rain_mm, wind_speed, wind_dir_rad, 'medium')
                        print(f"Calculated rain class: {rain_class}")
                    else:
                        print("Warning: Wind data not available")
                        return jsonify({'error': 'Wind data not available from Earth Engine'}), 500
                except Exception as wind_error:
                    print(f"Error calculating wind data: {wind_error}")
                    print("Detailed error traceback:")
                    traceback.print_exc()
                    return jsonify({'error': f'Wind data calculation error: {str(wind_error)}'}), 500
                
                # Prepare response data
                weather_data = {
                    'location': location.address,
                    'coordinates': [location.latitude, location.longitude],
                    'average_temperature': round(temp_celsius, 2),
                    'average_rainfall': round(rain_mm, 2),
                    'average_wind_speed': round(wind_speed, 2),
                    'average_wind_direction': round(wind_dir_deg, 1),
                    'recommended_rain_class': rain_class,
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
        'earth_engine_authenticated': EE_AUTHENTICATED
    })

# Start the Flask server
if __name__ == '__main__':
    print("Starting Flask server for weather API...")
    print(f"Earth Engine initialized: {EE_INITIALIZED}")
    print(f"Server configuration: host={FLASK_HOST}, port={FLASK_PORT}, debug={FLASK_DEBUG}")
    app.run(debug=FLASK_DEBUG, port=FLASK_PORT, host=FLASK_HOST)