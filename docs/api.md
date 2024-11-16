# API

## Reservations

### /reservations/add
    Create a new reservation using authenticated user's ID
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

### /reservations/delete/<reservation_id>
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

### /reservations/user
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

### /reservations/get
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
              description: ISO-formatted start timestamp for filtering reservations
            - in: query
              name: end_timestamp
              schema:
                type: string
                format: date-time
              description: ISO-formatted end timestamp for filtering reservations
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