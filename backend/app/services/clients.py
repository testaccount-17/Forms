from app.exceptions import BadRequestError
from app.lib.supabase import create_user_client
from app.schemas.client import ClientResponse, OnboardingRequest


async def complete_onboarding(
    access_token: str,
    user_id: str,
    email: str,
    payload: OnboardingRequest,
) -> ClientResponse:
    supabase = create_user_client(access_token)

    client_result = (
        supabase.table("clients")
        .upsert(
            {
                "first_name": payload.first_name,
                "middle_name": payload.middle_name,
                "last_name": payload.last_name,
                "email": email,
                "address": payload.address,
                "age": payload.age,
                "phone_no": payload.phone_no,
                "state": payload.state,
                "view": "active",
            },
            on_conflict="email",
        )
        .select()
        .execute()
    )

    if not client_result.data:
        raise BadRequestError("Failed to save client profile")

    client_data = client_result.data[0]

    user_result = (
        supabase.table("users")
        .upsert(
            {
                "id": user_id,
                "email": email,
                "client_id": client_data["id"],
                "first_admin": True,
                "password_hash": "OAUTH_MANAGED",
            },
            on_conflict="id",
        )
        .execute()
    )

    if user_result.data is None:
        raise BadRequestError("Failed to link user to client")

    return ClientResponse.model_validate(client_data)


async def get_client_profile(access_token: str, client_id: str) -> ClientResponse:
    supabase = create_user_client(access_token)

    result = (
        supabase.table("clients")
        .select("*")
        .eq("id", client_id)
        .maybe_single()
        .execute()
    )

    if not result.data:
        raise BadRequestError("Client not found")

    return ClientResponse.model_validate(result.data)
