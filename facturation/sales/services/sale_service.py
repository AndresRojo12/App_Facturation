# create new sale in the database

from starlette.exceptions import HTTPException
from facturation.database.dependencies.dependencie_session import SessionDep
from facturation.sales.models.sale_model import Sale
from facturation.sales.schemas.sale_schema import SaleCreate, SaleResponse
from facturation.sales.schemas.sale_detail_schema import SaleDetailResponse
from facturation.products.services.product_service import get_product

async def create_sale(sale: SaleCreate, db: SessionDep, current_user):
    total = 0
    details = []
    for item in sale.items:
        product = await get_product(item.product_id, db)
        if product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Not enough stock for product {product.name}")
        total += product.price * item.quantity
        details.append(SaleDetailResponse(
            product_id=item.product_id,
            quantity=item.quantity,
            price=product.price
        ))
        product.stock -= item.quantity
        db.add(product)
    
    new_sale = Sale(total=total)
    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)

    for detail in details:
        detail.sale_id = new_sale.id
        db.add(detail)
    
    db.commit()
    return SaleResponse(id=new_sale.id, total=total, details=details)