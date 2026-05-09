# create new sale in the database

from datetime import datetime, timedelta, timezone
from starlette.exceptions import HTTPException
from sqlalchemy.orm import selectinload
from facturation.database.dependencies.dependencie_session import SessionDep
from facturation.sales.models.sale_details_model import SaleDetail
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
        
        subtotal = product.price * item.quantity
        total += subtotal

        # descontar el stock del producto
        product.stock -= item.quantity
        db.add(product)

        # guardar el detalle de la venta

        details.append({
            "product_id": product.id,
            "quantity": item.quantity,
            "price": product.price,
            "subtotal": subtotal
        })
        
        # crear venta principal
    
    new_sale = Sale(
        user_id=current_user.id,
        total=total
    )
    db.add(new_sale)
    db.commit()
    db.refresh(new_sale)

    # crear detalles de la venta

    for item in details:
        detail = SaleDetail(
            sale_id=new_sale.id,
            product_id=item["product_id"],
            quantity=item["quantity"],
            price=item["price"],
            subtotal=item["subtotal"]
        )
        db.add(detail)
    
    db.commit()
    db.refresh(new_sale)
    return new_sale


async def get_sales(db: SessionDep):
    return (
        db.query(Sale)
        .options(selectinload(Sale.details))
        .order_by(Sale.created_at.desc())
        .all()
    )


async def get_sales_today(db: SessionDep):
    local_now = datetime.now().astimezone()
    today_local = local_now.replace(hour=0, minute=0, second=0, microsecond=0)
    tomorrow_local = today_local + timedelta(days=1)
    today_utc = today_local.astimezone(timezone.utc)
    tomorrow_utc = tomorrow_local.astimezone(timezone.utc)
    return (
        db.query(Sale)
        .options(selectinload(Sale.details))
        .filter(Sale.created_at >= today_utc, Sale.created_at < tomorrow_utc)
        .order_by(Sale.created_at.desc())
        .all()
    )