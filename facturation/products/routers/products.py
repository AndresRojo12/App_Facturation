from fastapi import APIRouter, Depends, HTTPException
from alembic.util import status
from facturation.database.dependencies.dependencie_session import SessionDep
from facturation.products.schemas.product_schema import ProductCreate, ProductResponse
from facturation.products.services.product_service import create_product, get_product, get_products


router = APIRouter()

# create routes http for products

@router.get("/products")
async def read_products(db: SessionDep):
    return await get_products(db)

@router.post("/products")
async def create_new_product(product: ProductCreate, db: SessionDep):
    return await create_product(product, db)