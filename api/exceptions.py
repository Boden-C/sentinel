class ClientError(Exception):
    def __init__(self, message: str, code: int = 400):
        """
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
        """
        super().__init__(message)
        self.message = message
        self.code = code