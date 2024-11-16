# api/routes/reservations.py
from datetime import datetime
from database.reservations import schedule, get_reservations, delete_reservation
from flask import Blueprint, request, jsonify, g
from firebase_admin import firestore
from exceptions import ClientError
import sys
import os
from typedef import Reservation
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from wrappers import verify_token  # Using absolute import

# Define the Blueprint - keeping your original name
reservations_bp = Blueprint('reservations_bp', __name__)

@reservations_bp.route('/reservations/add', methods=['POST'])
@verify_token
def create_reservation():
    """
    Create a new reservation using authenticated user'snpm run  ID
    ---
    post:
        summary: Create a new reservation
        requestBody:
            required: true
            content:
                application/json:
                    schema:
                        type: object
                        properties:
                            space_id:
                                type: string
                                description: ID of the parking space to reserve
                            start_timestamp:
                                type: string
                                format: date-time
                                description: ISO-formatted start time of the reservation
                            end_timestamp:
                                type: string
                                format: date-time
                                description: ISO-formatted end time of the reservation
        responses:
            201:
                description: Reservation created successfully
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                id:
                                    type: string
                                    description: ID of the created reservation
                                message:
                                    type: string
            400:
                description: Missing required fields
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
            500:
                description: Internal server error
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
    """
    try:
        # Get request data
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['space_id', 'start_timestamp', 'end_timestamp']
        if not all(field in data for field in required_fields):
            raise ClientError('Missing required fields', 400)
        
        # Schedule the reservation using authenticated user's ID
        reservation_id = schedule(
            user_id=g.user_id,
            space_id=data['space_id'],
            start_timestamp=data['start_timestamp'],
            end_timestamp=data['end_timestamp']
        )
        
        # Return success response
        return jsonify({
            'id': reservation_id,
            'message': 'Reservation created successfully'
        }), 201
        
    except ClientError as e:
        return jsonify({
            'message': e.message
        }), e.code
        
    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 500


@reservations_bp.route('/reservations/delete/<reservation_id>', methods=['DELETE'])
@verify_token
def delete_reservation(reservation_id):
    """
    Delete an existing reservation by ID, if it belongs to the authenticated user
    ---
    delete:
        summary: Delete a reservation
        parameters:
            - in: path
              name: reservation_id
              required: true
              schema:
                type: string
              description: ID of the reservation to delete
    responses:
        200:
            description: Reservation deleted successfully
        403:
            description: Unauthorized action
        404:
            description: Reservation not found
    """
    try:
        # Get the reservation
        reservations = get_reservations(reservation_id=reservation_id)
        
        # Check if reservation exists
        if len(reservations) == 0:
            raise ClientError("Reservation not found", 404)
        
        # Ensure the reservation belongs to the authenticated user
        if reservations[0].user_id != g.user_id:
            raise ClientError("Unauthorized action", 403)
        
        # Delete the reservation
        delete_reservation(reservation_id)
        
        # Return success response
        return jsonify({
            'message': 'Reservation deleted successfully'
        }), 200
    
    except ClientError as e:
        return jsonify({
            'message': e.message
        }), e.code
    
    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 500
        
@reservations_bp.route('/reservations/user', methods=['GET'])
@verify_token
def get_user_reservations():
    """
    Get all reservations for the authenticated user
    ---
    get:
        summary: Get user's reservations
    responses:
        200:
            description: List of reservations
            content:
                application/json:
                    schema:
                        type: array
                        items: Reservation
    """
    try:
        # Get reservations for the authenticated user
        reservations = get_reservations(user_id=g.user_id)
        
        # Return success response
        return Reservation.jsonify_list(reservations=reservations), 200
    
    except ClientError as e:
        return jsonify({
            'message': e.message
        }), e.code
    
    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 500

from flask import jsonify, request
from typing import List


@reservations_bp.route('/reservations/get', methods=['GET'])
def get_reservations_route():
    """
    Get reservations based on filters
    ---
    get:
        summary: Get reservations based on optional filters
        parameters:
            - in: query
              name: reservation_id
              schema:
                type: string
              description: Unique ID of the reservation
            - in: query
              name: space_id
              schema:
                type: string
              description: The ID of the parking space for the reservation
            - in: query
              name: start_timestamp
              schema:
                type: string
                format: date-time
              description: Operator-prefixed ISO formatted start timestamp for filtering reservations
            - in: query
              name: end_timestamp
              schema:
                type: string
                format: date-time
              description: Operator-prefixed ISO formatted end timestamp for filtering reservations
        responses:
            200:
                description: List of reservations matching the filters
                content:
                    application/json:
                        schema:
                            type: array
                            items: Reservation
            403:
                description: Unauthorized request for user_id filter
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                message:
                                    type: string
    """
    try:
        # Extract query parameters
        reservation_id = request.args.get('reservation_id')
        user_id = request.args.get('user_id')
        space_id = request.args.get('space_id')
        start_timestamp = request.args.get('start_timestamp')
        end_timestamp = request.args.get('end_timestamp')

        # Check if user_id is provided and raise a 403 error
        if user_id:
            return jsonify({
                'message': 'Please send an authenticated request to /reservations/user to access user-specific reservations.'
            }), 403

        # Fetch reservations based on provided filters
        reservations = get_reservations(
            reservation_id=reservation_id,
            space_id=space_id,
            start_timestamp=start_timestamp,
            end_timestamp=end_timestamp
        )
        print(len(reservations))

        # Return filtered reservations
        return Reservation.jsonify_list(reservations=reservations, restrict_user_id=True), 200

    except ClientError as e:
        return jsonify({
            'message': e.message
        }), e.code

    except Exception as e:
        return jsonify({
            'message': str(e)
        }), 500
        
