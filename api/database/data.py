import math
import random
import firebase_admin
from firebase_admin import initialize_app
from flask import logging
from typing import Dict, List, Optional, Tuple
from firebase_admin import firestore
from datetime import datetime, timedelta, timezone
import sys
import os

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from exceptions import ClientError

# Initialize Firebase Admin if not already initialized
if not firebase_admin:
    initialize_app()

def get_building_id(user_id: str, building_name: str) -> Optional[str]:
    """
    Retrieve the building ID for the specified building name.

    Args:
        user_id (str): The user ID.
        building_name (str): The building name.

    Returns:
        str: The building ID if found, otherwise None.
    """
    db = firestore.Client()

    try:
        user_ref = db.collection('users').document(user_id)
        buildings = user_ref.collection('offices').where('office_name', '==', building_name).stream()

        for building in buildings:
            return building.id

    except Exception as e:
        raise ClientError(f"Error retrieving building ID: {e}")

    return None

def get_cached_data(user_id: str, building_name: str) -> List[Dict[str, str]]:
    """
    Get cached building data with proper timezone adjustments and error handling.
    
    Args:
        user_id (str): The ID of the user requesting the data
        building_name (str): Name of the building ("Dallas Office" or "Dubai Office")
        
    Returns:
        List[Dict[str, str]]: List of building status dictionaries
        
    Raises:
        ValueError: If building_name is not recognized
    """
    try:
        # Get the current UTC time
        utc_time = datetime.utcnow()

        def round_to_nearest_hour(time: datetime) -> datetime:
            """Round a datetime object to the nearest hour."""
            if time.minute >= 30:
                return time.replace(minute=0, second=0, microsecond=0) + timedelta(hours=1)
            return time.replace(minute=0, second=0, microsecond=0)

        if not isinstance(building_name, str):
            logging.error(f"Building name must be a string, got {type(building_name)}")
            raise ValueError(f"Building name must be a string, got {type(building_name)}")

        if building_name == "Dallas Office":
            # Dallas is UTC-6 hours during Standard Time
            dallas_time = utc_time - timedelta(hours=6)
            rounded_dallas_time = round_to_nearest_hour(dallas_time)
            dallas_time_str = rounded_dallas_time.strftime("%H:%M")

            return [
                {
                    "title": "Optimize Energy Usage",
                    "description": f"The AI checked at {dallas_time_str} in Dallas on Sunday and is outside of business hours, HVAC is automatically lowered.",
                    "impact": "Estimated 10% reduction in energy usage by reducing energy usage.",
                },
                {
                    "title": "Turn Off Sprinklers",
                    "description": "According to weather forecasts, Dallas is expected to have rain later today.",
                    "impact": "Save up to 100 gallons of water by turning off sprinklers.",
                }
            ]

        elif building_name == "Dubai Office":
            # Dubai is UTC+4 hours year-round
            dubai_time = utc_time + timedelta(hours=4)
            rounded_dubai_time = round_to_nearest_hour(dubai_time)
            dubai_time_str = rounded_dubai_time.strftime("%H:%M")

            return [
                {
                    "title": "Evening Settings",
                    "description": f"The AI checked at {dubai_time_str} in Dubai in the night, all energy usages are turned automatically off. The weather forecasts show no significant requirements.",
                    "impact": "Save up to 20% of energy usage by turning off all appliances.",
                }
            ]
        else:
            logging.error(f"Unknown building name: {building_name}")
            raise ValueError(f"Unknown building name: {building_name}")

    except Exception as e:
        logging.error(f"Error in get_cached_data for user {user_id}, building {building_name}: {str(e)}")
        raise

def __fillDatabase():
    """
    Populate the database with simulated office data and energy usage.
    """
    db = firestore.Client()

    try:
        users = db.collection('users').stream()

        for user in users:
            user_ref = db.collection('users').document(user.id)

            # Add Dallas office
            dallas_data = {
                'location': {'lat': 32.77, 'lng': -96.79},
                'office_name': 'Dallas Office'
            }
            dallas_ref = user_ref.collection('offices').add(dallas_data)[1]

            # Add Dubai office
            dubai_data = {
                'location': {'lat': 25.27, 'lng': 55.29},
                'office_name': 'Dubai Office'
            }
            dubai_ref = user_ref.collection('offices').add(dubai_data)[1]

            # Simulate and store energy usage
            now = datetime.utcnow().replace(tzinfo=timezone.utc)

            for hour in range(24):
                timestamp = now - timedelta(hours=hour)
                time_of_day = (timestamp.hour + 24) % 24

                # Simulated usage values
                energy_usage_dallas = max(30, min(250, 100 + 100 * math.sin(math.radians((time_of_day - 7) * 15)) + random.uniform(-10, 10)))
                energy_usage_dubai = max(40, min(300, 150 + 100 * math.sin(math.radians((time_of_day - 7) * 15)) + random.uniform(-10, 10)))

                dallas_ref.collection('energy_usage').add({
                    'timestamp': timestamp,
                    'energy_usage_kWh': energy_usage_dallas
                })

                dubai_ref.collection('energy_usage').add({
                    'timestamp': timestamp,
                    'energy_usage_kWh': energy_usage_dubai
                })
    except Exception as e:
        raise ClientError(f"Error filling database: {e}")

