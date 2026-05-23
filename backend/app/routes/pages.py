from fastapi import APIRouter, Depends, status

from app.dependencies import AuthContext, get_current_user
from app.schemas.page import CreatePageRequest, PageResponse, UpdatePageRequest
from app.services import pages as pages_service
from app.services import users as users_service

router = APIRouter(prefix="/pages", tags=["pages"])


@router.get("/", response_model=list[PageResponse])
async def list_pages(auth: AuthContext = Depends(get_current_user)) -> list[PageResponse]:
    client_id = await users_service.get_client_id_for_user(auth.access_token, auth.user_id)
    return await pages_service.list_pages(auth.access_token, client_id)


@router.get("/slug/{slug}", response_model=PageResponse)
async def get_page_by_slug(
    slug: str,
    auth: AuthContext = Depends(get_current_user),
) -> PageResponse:
    client_id = await users_service.get_client_id_for_user(auth.access_token, auth.user_id)
    return await pages_service.get_page_by_slug(auth.access_token, client_id, slug)


@router.get("/{page_id}", response_model=PageResponse)
async def get_page(
    page_id: str,
    auth: AuthContext = Depends(get_current_user),
) -> PageResponse:
    client_id = await users_service.get_client_id_for_user(auth.access_token, auth.user_id)
    return await pages_service.get_page_by_id(auth.access_token, client_id, page_id)


@router.post("/", response_model=PageResponse, status_code=status.HTTP_201_CREATED)
async def create_page(
    payload: CreatePageRequest,
    auth: AuthContext = Depends(get_current_user),
) -> PageResponse:
    client_id = await users_service.get_client_id_for_user(auth.access_token, auth.user_id)
    return await pages_service.create_page(auth.access_token, client_id, payload)


@router.patch("/{page_id}", response_model=PageResponse)
async def update_page(
    page_id: str,
    payload: UpdatePageRequest,
    auth: AuthContext = Depends(get_current_user),
) -> PageResponse:
    client_id = await users_service.get_client_id_for_user(auth.access_token, auth.user_id)
    return await pages_service.update_page(auth.access_token, client_id, page_id, payload)


@router.delete("/{page_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_page(
    page_id: str,
    auth: AuthContext = Depends(get_current_user),
) -> None:
    client_id = await users_service.get_client_id_for_user(auth.access_token, auth.user_id)
    await pages_service.delete_page(auth.access_token, client_id, page_id)
