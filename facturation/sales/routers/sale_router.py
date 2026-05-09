from typing import List

from fastapi import APIRouter, Depends
from facturation.sales.services.sale_service import create_sale, get_sales, get_sales_today
from facturation.users.login.user_login import get_current_active_user
from facturation.database.dependencies.dependencie_session import SessionDep, get_session
from facturation.sales.schemas.sale_schema import SaleCreate, SaleResponse

router = APIRouter(prefix="/sales", tags=["sales"])

@router.get("/", response_model=List[SaleResponse])
async def read_sales(
    db: SessionDep,
    today: bool = False,
    current_user = Depends(get_current_active_user),
):
    if today:
        return await get_sales_today(db)
    return await get_sales(db)

@router.post("/", response_model=SaleResponse)
async def create_new_sale(
    sale: SaleCreate,
    db: SessionDep,
    current_user = Depends(get_current_active_user)
):
    return await create_sale(sale, db, current_user)