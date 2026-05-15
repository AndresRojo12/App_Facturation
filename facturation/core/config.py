from pydantic_settings import BaseSettings, SettingsConfigDict
import os

ENV = os.getenv("ENV", "development")

env_file = ".env.production" if ENV == "production" else ".env"

class Settings(BaseSettings):
    APP_NAME: str = "Facturación API"

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_DAYS: int

    DATABASE_URL: str

    model_config = SettingsConfigDict(env_file=env_file, extra="ignore")

settings = Settings()
