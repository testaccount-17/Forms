from app.exceptions import ForbiddenError, NotFoundError
from app.lib.supabase import create_user_client
from app.schemas.user import UserResponse


def _normalize_user(data: dict) -> dict:
    clients = data.get("clients")
    if isinstance(clients, list):
        data["clients"] = clients[0] if clients else None
    return data


async def get_user_profile(access_token: str, user_id: str) -> UserResponse:
    supabase = create_user_client(access_token)

    result = (
        supabase.table("users")
        .select("id, email, client_id, first_admin, clients(*)")
        .eq("id", user_id)
        .maybe_single()
        .execute()
    )

    if not result.data:
        raise NotFoundError("User profile not found")

    return UserResponse.model_validate(_normalize_user(result.data))


async def get_client_id_for_user(access_token: str, user_id: str) -> str:
    profile = await get_user_profile(access_token, user_id)

    if not profile.client_id:
        raise ForbiddenError("User has not completed onboarding")

    return profile.client_id


async def upsert_user_record(access_token: str, user_id: str, email: str) -> None:
    supabase = create_user_client(access_token)

    result = (
        supabase.table("users")
        .upsert({"id": user_id, "email": email, "first_admin": True}, on_conflict="id")
        .execute()
    )

    if result.data is None:
        raise NotFoundError("Failed to register user")
