from fastapi import FastAPI, Depends
from facturation.products.routers import products
from facturation.users.routers import users
from facturation.users.schemas.user_schema import UserCreate, UserResponse

app = FastAPI()
app.include_router(products.router)
app.include_router(users.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}
