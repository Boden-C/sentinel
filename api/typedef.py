from dataclasses import asdict, dataclass
from typing import List, Optional
from datetime import datetime

@dataclass
class Reservation:
    """
    Represents a parking reservation.

    Attributes:
        reservation_id (str): Unique identifier for the reservation.
        user_id (str): Unique identifier for the user who made the reservation.
        space_id (str): Unique identifier for the parking space reserved.
        start_timestamp (datetime): Start time of the reservation.
        end_timestamp (datetime): End time of the reservation.
    """
    reservation_id: str
    user_id: str
    space_id: str
    start_timestamp: datetime
    end_timestamp: datetime
    
    def to_dict(self):
        data = asdict(self)
        data["start_timestamp"] = self.start_timestamp.isoformat() if self.start_timestamp else None
        data["end_timestamp"] = self.end_timestamp.isoformat() if self.end_timestamp else None
        return data
    
    @staticmethod
    def jsonify_list(reservations: List['Reservation'], restrict_user_id: Optional[bool] = False):
        result = []
        for reservation in reservations:
            reservation_dict = reservation.to_dict()
            if restrict_user_id:
                reservation_dict.pop("user_id", None)  # Remove user_id if restrict_user_id is True
            result.append(reservation_dict)
        return result