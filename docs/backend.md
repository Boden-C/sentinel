# Backend Function Documentaion

## api/exceptions.py
`api.exceptions.__init__(self, message: str, code: int)`
```
Custom exception for client-side errors.
    This should be the only error explicitly raised in the API routes.
    
    Args:
        message (str): The error message.
        code (int, optional): The HTTP status code for the error. Defaults to 400.
        
    Common codes:
        400 Bad Request
        404 Not Found: Resource doesn't exist
        406 Not Acceptable: Resource doesn't match client's accept headers
        408 Request Timeout: Client request took too long
        409 Conflict: Request conflicts with server state
        410 Gone: Resource is no longer available.
        422 Unprocessable Entity: Valid syntax but semantic issues
```

## api/typedef.py
`api.typedef.to_dict(self)`
```

```

`api.typedef.jsonify_list(reservations: List['Reservation'], restrict_user_id: Optional[bool])`
```

```

## api/wrappers.py
`api.wrappers.verify_token(f: Callable) -> Callable`
```
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
```

`api.wrappers.decorated() -> Union[Tuple[Dict[str, str], int], Any]`
```

```

## api/database/reservations.py
`api.database.reservations.create_reservation(user_id: str, space_id: str, start_timestamp: datetime, end_timestamp: datetime) -> str`
```
Create a new reservation in Firestore.
    
    Args:
        user_id (str): ID of the user making the reservation
        space_id (str): ID of the space being reserved
        start_timestamp (datetime): Start time of the reservation
        end_timestamp (datetime): End time of the reservation
    
    Returns:
        str: Reservation ID
```

`api.database.reservations.delete_reservation(reservation_id: str) -> None`
```
Delete a reservation from Firestore.
    
    Args:
        reservation_id (str): ID of the reservation to delete
```

`api.database.reservations.get_reservations(reservation_id: Optional[str], user_id: Optional[str], space_id: Optional[str], start_timestamp: Optional[str], end_timestamp: Optional[str]) -> List['Reservation']`
```
Fetches reservations based on provided filters, with flexible operators for timestamps.
    
    Args:
        reservation_id (str, optional): Unique ID of the reservation.
        user_id (str, optional): The ID of the user who made the reservation.
        space_id (str, optional): The ID of the parking space for the reservation.
        start_timestamp (datetime, optional): Start timestamp for filtering reservations.
        end_timestamp (datetime, optional): End timestamp for filtering reservations.
        start_timestamp (str, optional): Operator-prefixed start timestamp for filtering.
        end_timestamp (str, optional): Operator-prefixed end timestamp for filtering.
    
    Returns:
        List[Reservation]: List of reservations matching the filters.
    
    Raises:
        ClientError: If timestamp format is invalid or query execution fails.
        
    Example:
        get_reservations(start_timestamp='>=2022-01-01T00:00:00Z')
```

`api.database.reservations.schedule(user_id: str, space_id: str, start_timestamp: str, end_timestamp: str) -> str`
```
Validates reservation times and creates a new reservation in Firestore.
    
    Args:
        user_id (str): ID of the user making the reservation
        space_id (str): ID of the space being reserved
        start_timestamp (str): Start time of the reservation in ISO format
        end_timestamp (str): End time of the reservation in ISO format
    
    Returns:
        str: Reservation ID
```

`api.database.reservations.parse_operator_timestamp(value: str) -> Tuple[str, datetime]`
```

```

## api/routes/authenticate.py
`api.routes.authenticate.authenticate()`
```
Route to check if user is valid.
```

## api/routes/reservations.py
`api.routes.reservations.create_reservation()`
```
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
```

`api.routes.reservations.delete_reservation(reservation_id)`
```
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
```

`api.routes.reservations.get_user_reservations()`
```
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
```

`api.routes.reservations.get_reservations_route()`
```
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
```

