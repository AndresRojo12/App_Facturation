from fastapi import FastAPI
from products.routers import products
from users.routers import users

app = FastAPI()
app.include_router(products.router)
app.include_router(users.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}