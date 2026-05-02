from fastapi import FastAPI, Depends
from facturation.products.routers import products
from facturation.users.routers import users
from facturation.users.schemas.user_schema import UserCreate, UserResponse
from facturation.core.config import settings
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

@app.get("/")
async def root():
    return {"app_name": settings.APP_NAME}
