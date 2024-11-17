from flask import Blueprint, jsonify, g
from wrappers import verify_token
from main.data import getGeneratedData, getUserData
from exceptions import ClientError

# Define the Blueprint
data_bp = Blueprint('data_bp', __name__)

@data_bp.route('/data/generate', methods=['GET'])
@verify_token
def generate_data():
    """
    Generate data for the authenticated user.
    """
    try:
        # Call getGeneratedData with authenticated user's ID
        data = getGeneratedData(user_id=g.user_id)

        return jsonify(data), 200
    
    except ClientError as e:
        return jsonify({'message': e.message}), e.code
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@data_bp.route('/data/user', methods=['GET'])
@verify_token
def user_data():
    """
    Retrieve data for the authenticated user.
    """
    try:
        # Call getUserData with authenticated user's ID
        data = getUserData(user_id=g.user_id)

        return jsonify(data), 200
    
    except ClientError as e:
        return jsonify({'message': e.message}), e.code

    except Exception as e:
        return jsonify({'message': str(e)}), 500
