from fastapi import FastAPI
from facturation.products.routers import products
from facturation.users.routers import users

app = FastAPI()
app.include_router(products.router)
app.include_router(users.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}