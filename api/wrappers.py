#decorators.py
from flask import request, g
from typing import Callable, Dict, Tuple, Union, Any
from functools import wraps
from firebase_admin import auth

def verify_token(f: Callable) -> Callable:
    """
    Decorator that verifies Firebase JWT tokens from the Authorization header.
    Sets both the full decoded token and user_id in Flask's g object.
    
    Sets:
        g.user (Dict): Full decoded token containing user data
        g.user_id (str): Firebase user ID (UID)
    
    Returns:
        If token is valid: Original route response
        If token is invalid: Tuple[Dict[str, str], int] with error message and 401 status
    
    Usage:
        @app.route('/protected')
        @verify_token
        def protected_route():
            user_id = g.user_id  # access just the ID
            user_data = g.user   # access full token data
            return {'message': f'Hello {user_id}'}
    """
    @wraps(f)
    def decorated(*args, **kwargs) -> Union[Tuple[Dict[str, str], int], Any]:
        token = None
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return {'message': 'No token provided'}, 401
        
        if not auth_header.startswith('Bearer '):
            return {'message': 'Invalid token format'}, 401

        try:
            token = auth_header.split('Bearer ')[1]
            decoded_token = auth.verify_id_token(token)
            
            # Set both user dict and user_id in g
            g.user = decoded_token
            g.user_id = decoded_token['uid']
            
            return f(*args, **kwargs)
        
        except auth.ExpiredIdTokenError:
            return {'message': 'Token has expired'}, 401
        except auth.RevokedIdTokenError:
            return {'message': 'Token has been revoked'}, 401
        except auth.InvalidIdTokenError:
            return {'message': 'Invalid token'}, 401
        
        except Exception as e:
            return {'message': str(e)}, 500

    return decorated