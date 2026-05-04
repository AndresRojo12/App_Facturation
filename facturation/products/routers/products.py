from fastapi import APIRouter, Depends, HTTPException
from alembic.util import status
from facturation.database.dependencies.dependencie_session import SessionDep
from facturation.products.schemas.product_schema import ProductCreate, ProductResponse
from facturation.products.services.product_service import create_product, get_product, get_products
from facturation.users.login.user_login import get_current_active_user
from facturation.users.schemas.user_schema import UserResponse

router = APIRouter(prefix="/products", tags=["products"])

# create routes http for products

@router.get("/", response_model=list[ProductResponse])
async def read_products(db: SessionDep, current_user: UserResponse = Depends(get_current_active_user)):
    return await get_products(db)

@router.post("/", response_model=ProductResponse)
async def create_new_product(product: ProductCreate, db: SessionDep, current_user: UserResponse = Depends(get_current_active_user)):
    return await create_product(product, db)