from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    YOUTUBE_API_KEY: str = ""
    YOUTUBE_CHANNEL_ID: str = "UC1KsjcxnadL7HTnONYb9XTA"  # Can be @handle or UC... channel ID
    INSTAGRAM_ACCESS_TOKEN: str = ""
    INSTAGRAM_USER_ID: str = "me"  # Will auto-resolve via /me endpoint
    INSTAGRAM_USERNAME: str = "legend_editx"  # For reference only
    DEMO_MODE: bool = True
    TEMP_DIR: str = "./tmp/downloads"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
