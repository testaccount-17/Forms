from fastapi import APIRouter, Depends, status

from app.dependencies import AuthContext, get_current_user
from app.schemas.client import ClientResponse, OnboardingRequest
from app.services import clients as clients_service
from app.services import users as users_service

router = APIRouter(prefix="/clients", tags=["clients"])


@router.post("/onboarding", response_model=ClientResponse, status_code=status.HTTP_201_CREATED)
async def complete_onboarding(
    payload: OnboardingRequest,
    auth: AuthContext = Depends(get_current_user),
) -> ClientResponse:
    return await clients_service.complete_onboarding(
        auth.access_token,
        auth.user_id,
        auth.email,
        payload,
    )


@router.get("/me", response_model=ClientResponse)
async def get_my_client(auth: AuthContext = Depends(get_current_user)) -> ClientResponse:
    client_id = await users_service.get_client_id_for_user(auth.access_token, auth.user_id)
    return await clients_service.get_client_profile(auth.access_token, client_id)
