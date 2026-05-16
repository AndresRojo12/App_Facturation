import os
import sys
from pydantic_settings import BaseSettings, SettingsConfigDict

# 1. Detectar el entorno real
IS_PROD = getattr(sys, 'frozen', False) or os.getenv("ENV") == "production"

# 2. Asignar el archivo .env correspondiente
env_file = ".env.production" if IS_PROD else ".env"

class Settings(BaseSettings):
    APP_NAME: str = "Facturación API"
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_DAYS: int
    DATABASE_URL: str

    model_config = SettingsConfigDict(
        env_file=env_file, 
        extra="ignore"
    )

settings = Settings()

# 3. PASO CRÍTICO: Si es producción, redirigir SQLite a una ruta segura con permisos de escritura
if IS_PROD and settings.DATABASE_URL.startswith("sqlite"):
    # Obtener la ruta enviada por Electron o usar una por defecto en Linux (~/.config/facturation-app)
    user_data_dir = os.environ.get("USER_DATA_PATH") or os.path.expanduser("~/.config/facturation-app")
    os.makedirs(user_data_dir, exist_ok=True)
    
    # Reemplazamos la ruta estática por la ruta absoluta segura del sistema
    settings.DATABASE_URL = f"sqlite:///{os.path.join(user_data_dir, 'facturation.db')}"
