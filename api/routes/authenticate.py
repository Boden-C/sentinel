# routes/authenticate.py
from flask import Blueprint, jsonify, g
from wrappers import verify_token

authentication_bp = Blueprint('authentication_bp', __name__)

@authentication_bp.route('/authenticate', methods=['GET'])
@verify_token
def authenticate():
    """Route to check if user is valid."""
    return jsonify({"user_id": g.user_id}), 200