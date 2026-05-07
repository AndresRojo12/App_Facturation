from fastapi import APIRouter, Depends
from facturation.sales.services.sale_service import create_sale
from facturation.users.login.user_login import get_current_active_user
from facturation.database.dependencies.dependencie_session import SessionDep
from facturation.sales.schemas.sale_schema import SaleCreate, SaleResponse

router = APIRouter(prefix="/sales", tags=["sales"])

@router.post("/", response_model=SaleResponse)
async def create_new_sale(
    sale: SaleCreate,
    db: SessionDep,
    current_user = Depends(get_current_active_user)
):
    return await create_sale(sale, db, current_user)