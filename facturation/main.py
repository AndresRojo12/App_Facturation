from fastapi import FastAPI, Depends
from facturation.products.routers import products
from facturation.sales.routers import sale_router
from facturation.users.routers import users
from facturation.core.config import settings
from facturation.database import models  # Import all models to register them
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title=settings.APP_NAME)
origins = [
    "http://localhost:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(products.router)
app.include_router(users.router)
app.include_router(sale_router.router)
@app.get("/")
async def root():
    return {"app_name": settings.APP_NAME}
