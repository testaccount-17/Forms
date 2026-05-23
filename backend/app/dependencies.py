from dataclasses import dataclass

from fastapi import Depends, Header

from app.exceptions import UnauthorizedError
from app.lib.supabase import create_user_client


@dataclass
class AuthContext:
    user_id: str
    email: str
    access_token: str


async def get_current_user(
    authorization: str | None = Header(default=None),
) -> AuthContext:
    if not authorization or not authorization.startswith("Bearer "):
        raise UnauthorizedError("Missing or invalid authorization header")

    access_token = authorization.removeprefix("Bearer ").strip()
    supabase = create_user_client(access_token)

    try:
        result = supabase.auth.get_user(access_token)
    except Exception as exc:
        raise UnauthorizedError("Invalid or expired token") from exc

    user = getattr(result, "user", None)
    if not user:
        raise UnauthorizedError("Invalid or expired token")

    return AuthContext(
        user_id=user.id,
        email=user.email or "",
        access_token=access_token,
    )
