from typing import Any, Literal

from pydantic import BaseModel, Field


PageStatus = Literal["draft", "published", "archived"]


class PageResponse(BaseModel):
    id: str
    client_id: str
    title: str
    slug: str
    description: str | None = None
    form_schema: dict[str, Any] = Field(default_factory=dict, alias="schema_json")
    status: PageStatus
    created_at: str
    updated_at: str

    model_config = {"populate_by_name": True}


class CreatePageRequest(BaseModel):
    title: str = Field(min_length=1)
    slug: str = Field(min_length=1)
    description: str | None = None
    form_schema: dict[str, Any] = Field(default_factory=dict, alias="schema_json")
    status: PageStatus = "draft"

    model_config = {"populate_by_name": True}


class UpdatePageRequest(BaseModel):
    title: str | None = None
    slug: str | None = None
    description: str | None = None
    form_schema: dict[str, Any] | None = Field(default=None, alias="schema_json")
    status: PageStatus | None = None

    model_config = {"populate_by_name": True}
