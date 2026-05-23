from pydantic import BaseModel

from app.schemas.client import ClientResponse


class UserResponse(BaseModel):
    id: str
    email: str
    client_id: str | None = None
    first_admin: bool
    clients: ClientResponse | None = None
