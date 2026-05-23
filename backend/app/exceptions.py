class AppError(Exception):
    def __init__(self, message: str, status_code: int = 500, details: str | None = None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.details = details


class NotFoundError(AppError):
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, status_code=404)


class UnauthorizedError(AppError):
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(message, status_code=401)


class ForbiddenError(AppError):
    def __init__(self, message: str = "Forbidden"):
        super().__init__(message, status_code=403)


class BadRequestError(AppError):
    def __init__(self, message: str = "Bad request", details: str | None = None):
        super().__init__(message, status_code=400, details=details)
