import openmeteo_requests
import requests_cache
import pandas as pd
from retry_requests import retry
from geopy.geocoders import Nominatim
import ssl
import certifi

def fetch_weather_data(lat, lon, timezone, temperature_unit="fahrenheit", wind_speed_unit="mph", precipitation_unit="inch", models="gfs_seamless"):
    """
    Fetch weather data for a given latitude and longitude using Open-Meteo API.
    """
    # Setup the session with caching and retry
    cache_session = requests_cache.CachedSession('.cache', expire_after=3600)
    retry_session = retry(cache_session, retries=5, backoff_factor=0.2)
    openmeteo = openmeteo_requests.Client(session=retry_session)

    # API endpoint and parameters
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "current": ["temperature_2m", "is_day", "rain"],
        "hourly": ["temperature_2m", "rain"],
        "temperature_unit": temperature_unit,
        "wind_speed_unit": wind_speed_unit,
        "precipitation_unit": precipitation_unit,
        "timezone": timezone,
        "models": models
    }

    # Make the API request
    responses = openmeteo.weather_api(url, params=params)
    response = responses[0]  # Process the first location

    # Current values
    current = response.Current()
    current_data = {
        "time": current.Time(),
        "temperature_2m": current.Variables(0).Value(),
        "is_day": current.Variables(1).Value(),
        "rain": current.Variables(2).Value()
    }

    return current_data

def describe_weather(temperature, is_day, rain):
    """
    Describe the weather condition based on temperature, day/night, and rain.
    """
    temperature = round(temperature)  # Convert to whole number
    condition = "Sunny" if is_day == 1 and rain == 0 else "Cloudy" if rain == 0 else "Rainy"
    return f"{temperature}° {condition}"

def get_location(lat, lon):
    """
    Get the city and country name for a given latitude and longitude in English.
    """
    # Use a custom SSL context with certifi's CA bundle
    ctx = ssl.create_default_context(cafile=certifi.where())
    geolocator = Nominatim(user_agent="geoapi", ssl_context=ctx)
    location = geolocator.reverse((lat, lon), exactly_one=True, language="en")  # Specify English

    if location and location.raw.get("address"):
        address = location.raw["address"]
        city = address.get("city", address.get("town", address.get("village", "Unknown City")))
        country_code = address.get("country_code", "").upper()
        return f"{city}, {country_code}"

    return "Location not found"

if __name__ == "__main__":
    latitude = 25.27  # Dubai, UAE
    longitude = 55.29
    timezone = "Asia/Dubai"
    
    # Fetch weather data
    current_data = fetch_weather_data(latitude, longitude, timezone)
    
    # Extract and format weather
    weather_description = describe_weather(
        temperature=current_data["temperature_2m"],
        is_day=current_data["is_day"],
        rain=current_data["rain"]
    )
    
    # Get location
    location = get_location(latitude, longitude)
    
    # Prepare the dictionary
    output = {
        "timezone": timezone,
        "day_of_week": pd.Timestamp.now(tz=timezone).day_name(),
        "location": location,
        "weather": weather_description
    }
    
    # Print the dictionary
    print(output)
