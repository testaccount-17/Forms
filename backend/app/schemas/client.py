from pydantic import BaseModel, Field


class ClientResponse(BaseModel):
    id: str
    first_name: str
    middle_name: str | None = None
    last_name: str
    email: str
    address: str | None = None
    age: int | None = None
    phone_no: str | None = None
    state: str | None = None
    view: str
    created_at: str | None = None
    updated_at: str | None = None


class OnboardingRequest(BaseModel):
    first_name: str = Field(min_length=1)
    middle_name: str | None = None
    last_name: str = Field(min_length=1)
    address: str | None = None
    age: int | None = None
    phone_no: str | None = None
    state: str | None = None
