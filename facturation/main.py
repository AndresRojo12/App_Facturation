import uvicorn
from contextlib import asynccontextmanager
from sqlmodel import SQLModel
from fastapi import FastAPI, Depends
from facturation.products.routers import products
from facturation.sales.routers import sale_router
from facturation.users.routers import users
from facturation.profile.routers import profile_router
from facturation.core.config import settings
from facturation.database import models  # Import all models to register them
from fastapi.middleware.cors import CORSMiddleware
from facturation.database.database_session import engine
from facturation.database.base import Base

from facturation.users.models.user_model import User  # Importar el modelo User para crear la tabla correspondiente
from facturation.profile.models.profile_model import Profile
from facturation.products.models.product_model import Product
from facturation.sales.models.sale_details_model import SaleDetail
from facturation.sales.models.sale_model import Sale

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Crear las tablas en la base de datos al iniciar la aplicación
    print("Creando tablas en la base de datos...")
    Base.metadata.create_all(bind=engine)
    print("Tablas creadas exitosamente.")
    yield
    # Aquí podrías agregar código para limpiar recursos si es necesario al cerrar la aplicación

app = FastAPI(title=settings.APP_NAME, lifespan=lifespan)
#origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(products.router)
app.include_router(users.router)
app.include_router(sale_router.router)
app.include_router(profile_router.router)
@app.get("/")
async def root():
    return {"app_name": settings.APP_NAME}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
