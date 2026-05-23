from fastapi import APIRouter, Depends, status

from app.dependencies import AuthContext, get_current_user
from app.schemas.user import UserResponse
from app.services import users as users_service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
async def get_me(auth: AuthContext = Depends(get_current_user)) -> UserResponse:
    return await users_service.get_user_profile(auth.access_token, auth.user_id)


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(auth: AuthContext = Depends(get_current_user)) -> dict[str, str]:
    await users_service.upsert_user_record(auth.access_token, auth.user_id, auth.email)
    return {"message": "User registered"}
