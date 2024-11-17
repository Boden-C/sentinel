# database/data.py
import math
import random
from typing import List, Optional, Tuple
from firebase_admin import firestore
from datetime import datetime, timedelta, timezone
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from exceptions import ClientError


def __fillDatabase():
    db = firestore.Client()

    users = db.collection('users').stream()  # Adjust collection name if necessary
    
    for user in users:
        user_ref = db.collection('users').document(user.id)
        
        # Dallas office document with energy usage
        dallas_data = {
            'location': {
                'lat': 32.77,  # Approximate coordinates for Dallas
                'lng': -96.79
            },
            'office_name': 'Dallas Office'
        }
        dallas_ref = user_ref.collection('offices').add(dallas_data)

        # Dubai office document with energy usage
        dubai_data = {
            'location': {
                'lat': 25.27,  # Approximate coordinates for Dubai
                'lng': 55.29
            },
            'office_name': 'Dubai Office'
        }
        dubai_ref = user_ref.collection('offices').add(dubai_data)

        # Get current UTC time and simulate energy usage for the last 24 hours
        now = datetime.utcnow().replace(tzinfo=timezone.UTC)
        
        for hour in range(24):
            timestamp = now - timedelta(hours=hour)
            utc_hour = timestamp.hour
            
            # Simulate energy usage using a sinusoidal pattern
            time_of_day = (utc_hour + 24) % 24  # Wrap hour to ensure no negative values
            
            # For Dallas, peak usage might be earlier in the day (e.g., starting from 7 AM)
            # For Dubai, higher baseline and more uniform pattern due to AC usage
            # Dallas Energy Usage
            energy_usage_dallas = 100 + 100 * math.sin(math.radians((time_of_day - 7) * 15)) + random.uniform(-10, 10)
            energy_usage_dallas = max(30, min(energy_usage_dallas, 250))  # Clamping to realistic values
            
            # Dubai Energy Usage
            energy_usage_dubai = 150 + 100 * math.sin(math.radians((time_of_day - 7) * 15)) + random.uniform(-10, 10)
            energy_usage_dubai = max(40, min(energy_usage_dubai, 300))  # Clamping to realistic values
            
            # Store energy usage for Dallas
            dallas_ref.collection('energy_usage').add({
                'timestamp': timestamp,
                'energy_usage_kWh': energy_usage_dallas
            })

            # Store energy usage for Dubai
            dubai_ref.collection('energy_usage').add({
                'timestamp': timestamp,
                'energy_usage_kWh': energy_usage_dubai
            })
    
