import math
import random
from typing import List, Optional
from firebase_admin import firestore, initialize_app
from datetime import datetime, timedelta, timezone
import sys
import os

# Add the parent directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from exceptions import ClientError

# Initialize Firebase Admin if not already initialized
import firebase_admin
if not firebase_admin._apps:
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

def get_cached_data(user_id: str, building_name: str):
    """
    Get cached recommendations for energy usage optimization.
    """
    utc_time = datetime.utcnow()

    if building_name == "Dallas Office":
        dallas_time = utc_time - timedelta(hours=6)
        dallas_time_str = dallas_time.strftime("%H:%M")

        return [
            {
                "title": "Optimize Energy Usage",
                "description": f"It is currently {dallas_time_str} in Dallas on Sunday and is outside of business hours. HVAC is automatically lowered.",
                "impact": "Estimated 10% reduction in energy usage by reducing energy usage.",
            },
            {
                "title": "Turn Off Sprinklers",
                "description": "According to weather forecasts, Dallas is expected to have rain later today.",
                "impact": "Save up to 100 gallons of water by turning off sprinklers.",
            },
            {
                "title": "Adjust HVAC overnight",
                "description": f"Currently in Dallas, it is {dallas_time_str}, and forecasts predict no significant temperature changes until the night. HVAC settings will be lowered to maintain minimal comfort while saving energy.",
                "impact": "Reduces HVAC energy usage by 15% during off-hours."
            },
            {
                "search": [
                    {
                        "title": "Energy-Efficient Appliance Discounts",
                        "description": "Leading electronics retailers in Dubai are offering discounts of up to 25% on energy-efficient appliances, valid until November 24, 2024.",
                        "impact": "Upgrading to energy-efficient appliances can decrease household energy consumption by up to 30%, aligning with Dallas' strategy to reduce energy demand by 2030."
                    }
                ]
            }
        ]

    elif building_name == "Dubai Office":
        dubai_time = utc_time + timedelta(hours=4)
        dubai_time_str = dubai_time.strftime("%H:%M")

        return [
            {
                "title": "Evening Settings",
                "description": f"It is now {dubai_time_str} in Dubai in the night. All energy usages are turned off automatically. The weather forecast shows no significant requirements.",
                "impact": "Save up to 20% of energy usage by turning off all appliances.",
            },
            {
                "title": "Enable fan with breeze",
                "description": "Forecast predicts a cool breeze from 7:00 PM to 10:00 PM in Dubai. Ceiling fans will be activated instead of air conditioning during this period.",
                "impact": "Saves 20% energy by utilizing natural ventilation."
            },
            {
                "title": "Delay appliance start",
                "description": "Due to lower energy demand at night, running dishwashers and laundry machines is scheduled for 3:00 AM to leverage off-peak hours.",
                "impact": "Decreases energy costs by utilizing off-peak electricity rates.",
            },
            {
                "search": [
                    {
                        "title": "Solar Panel Subsidy in Dubai",
                        "description": "The Dubai government offers a subsidy program for solar panel installations, covering up to 40% of installation costs. Available until December 31, 2024.",
                        "impact": "Adopting solar panels can reduce electricity bills by approximately 20-30% annually, contributing to Dubai's goal of generating 75% of its energy from clean sources by 2050."
                    }
                ]
            }
        ]

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

