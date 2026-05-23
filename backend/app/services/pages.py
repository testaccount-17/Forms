from datetime import UTC, datetime

from app.exceptions import BadRequestError, NotFoundError
from postgrest.exceptions import APIError
from app.lib.supabase import create_user_client
from app.schemas.page import CreatePageRequest, PageResponse, UpdatePageRequest


async def list_pages(access_token: str, client_id: str) -> list[PageResponse]:
    supabase = create_user_client(access_token)

    try:
        result = (
            supabase.table("pages")
            .select("*")
            .eq("client_id", client_id)
            .order("updated_at", desc=True)
            .execute()
        )
    except APIError as exc:
        error_message = str(exc)
        if "PGRST205" in error_message or "public.pages" in error_message:
            raise BadRequestError(
                "Pages table not found. Run supabase/migrations/001_create_pages.sql in the Supabase SQL editor.",
                error_message,
            ) from exc
        raise BadRequestError("Failed to fetch pages", error_message) from exc

    return [PageResponse.model_validate(row) for row in (result.data or [])]


async def get_page_by_id(access_token: str, client_id: str, page_id: str) -> PageResponse:
    supabase = create_user_client(access_token)

    result = (
        supabase.table("pages")
        .select("*")
        .eq("id", page_id)
        .eq("client_id", client_id)
        .maybe_single()
        .execute()
    )

    if not result.data:
        raise NotFoundError("Page not found")

    return PageResponse.model_validate(result.data)


async def get_page_by_slug(access_token: str, client_id: str, slug: str) -> PageResponse:
    supabase = create_user_client(access_token)

    result = (
        supabase.table("pages")
        .select("*")
        .eq("slug", slug)
        .eq("client_id", client_id)
        .maybe_single()
        .execute()
    )

    if not result.data:
        raise NotFoundError("Page not found")

    return PageResponse.model_validate(result.data)


async def create_page(
    access_token: str,
    client_id: str,
    payload: CreatePageRequest,
) -> PageResponse:
    supabase = create_user_client(access_token)

    result = (
        supabase.table("pages")
        .insert(
            {
                "client_id": client_id,
                "title": payload.title,
                "slug": payload.slug,
                "description": payload.description,
                "schema_json": payload.form_schema,
                "status": payload.status,
            }
        )
        .select()
        .execute()
    )

    if not result.data:
        raise BadRequestError("Failed to create page")

    return PageResponse.model_validate(result.data[0])


async def update_page(
    access_token: str,
    client_id: str,
    page_id: str,
    payload: UpdatePageRequest,
) -> PageResponse:
    supabase = create_user_client(access_token)

    updates = payload.model_dump(exclude_unset=True, by_alias=False)
    if "form_schema" in updates:
        updates["schema_json"] = updates.pop("form_schema")
    updates["updated_at"] = datetime.now(UTC).isoformat()

    result = (
        supabase.table("pages")
        .update(updates)
        .eq("id", page_id)
        .eq("client_id", client_id)
        .execute()
    )

    if not result.data:
        raise NotFoundError("Page not found")

    return PageResponse.model_validate(result.data[0])


async def delete_page(access_token: str, client_id: str, page_id: str) -> None:
    supabase = create_user_client(access_token)

    result = (
        supabase.table("pages")
        .delete()
        .eq("id", page_id)
        .eq("client_id", client_id)
        .execute()
    )

    if result.data is None:
        raise BadRequestError("Failed to delete page")
