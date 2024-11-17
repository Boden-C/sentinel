import openmeteo_requests
import requests_cache
import pandas as pd
from retry_requests import retry

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

    # Print general information
    print(f"Coordinates {response.Latitude()}°N {response.Longitude()}°E")
    print(f"Elevation {response.Elevation()} m asl")
    print(f"Timezone {response.Timezone()} {response.TimezoneAbbreviation()}")
    print(f"Timezone difference to GMT+0 {response.UtcOffsetSeconds()} s")

    # Current values
    current = response.Current()
    current_data = {
        "time": current.Time(),
        "temperature_2m": current.Variables(0).Value(),
        "is_day": current.Variables(1).Value(),
        "rain": current.Variables(2).Value()
    }
    print("Current weather:")
    for key, value in current_data.items():
        print(f"{key}: {value}")

    # Hourly values
    hourly = response.Hourly()
    hourly_data = {
        "date": pd.date_range(
            start=pd.to_datetime(hourly.Time(), unit="s", utc=True),
            end=pd.to_datetime(hourly.TimeEnd(), unit="s", utc=True),
            freq=pd.Timedelta(seconds=hourly.Interval()),
            inclusive="left"
        ),
        "temperature_2m": hourly.Variables(0).ValuesAsNumpy(),
        "rain": hourly.Variables(1).ValuesAsNumpy()
    }
    hourly_dataframe = pd.DataFrame(data=hourly_data)

    print("Hourly weather data:")
    print(hourly_dataframe)

    return current_data, hourly_dataframe

def time_until_rain(hourly_dataframe):
    """
    Calculate the time until it rains based on the hourly forecast data.
    Returns the duration in hours and the exact time of rain.
    """
    # Find the first occurrence of rain greater than 0
    rain_data = hourly_dataframe[hourly_dataframe["rain"] > 0]
    
    if rain_data.empty:
        return "No rain expected in the forecast period."
    
    first_rain_time = rain_data["date"].iloc[0]
    current_time = hourly_dataframe["date"].iloc[0]
    
    # Calculate time difference
    time_diff = first_rain_time - current_time
    hours_until_rain = time_diff.total_seconds() / 3600

    return f"Time until rain: {hours_until_rain:.2f} hours. Expected at {first_rain_time}."


if __name__ == "__main__":
    latitude = 32.779167  # Texas, USA
    longitude = -96.808891
    timezone = "America/Chicago"
    
    current_data, hourly_dataframe = fetch_weather_data(latitude, longitude, timezone)
    
    # Calculate and print time until rain
    rain_info = time_until_rain(hourly_dataframe)
    print(rain_info)


