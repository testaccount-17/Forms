from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    port: int = 4000
    environment: str = "development"
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str | None = None
    cors_origin: str = "http://localhost:3000"

    @property
    def is_dev(self) -> bool:
        return self.environment == "development"


settings = Settings()
