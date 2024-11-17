from flask import Blueprint, jsonify, g
from wrappers import verify_token
from main.data import get_generated_data, get_building_data
from exceptions import ClientError
from main.data import promptAI

# Define the Blueprint
data_bp = Blueprint('data_bp', __name__)

@data_bp.route('/data/generate/<building_name>', methods=['GET'])
@verify_token
def generate_data(building_name):
    """
    Generate data for the authenticated user based on the building name.
    """
    try:
        # Call get_generated_data with authenticated user's ID and building_name
        print("1"+building_name)
        data = get_generated_data(user_id=g.user_id, building_name=building_name)
        print(data)
        
        # Assuming the function returns data that you want to jsonify
        return jsonify(data), 200
    
    except ClientError as e:
        return jsonify({'message': e.message}), e.code
    
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@data_bp.route('/data/building/<building_name>', methods=['GET'])
@verify_token
def user_data(building_name):
    """
    Retrieve data for the authenticated user's bulding.
    """
    try:
        data = get_building_data(user_id=g.user_id, building_name=building_name)
        print(data)

        return jsonify(data), 200
    
    except ClientError as e:
        return jsonify({'message': e.message}), e.code

    except Exception as e:
        return jsonify({'message': str(e)}), 500
