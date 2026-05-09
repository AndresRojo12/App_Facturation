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


async def get_sales_last_7_days(db: SessionDep):
    # Primero verificar todas las ventas en la BD
    all_sales = db.query(Sale).all()
    #print(f"DEBUG: Total de ventas en BD: {len(all_sales)}")
    for sale in all_sales:
        #print(f"DEBUG: Venta {sale.id} - Fecha: {sale.created_at} - Fecha local: {sale.created_at.astimezone()}")
        pass
    
    # Obtener la fecha actual en zona horaria local
    now = datetime.now().astimezone()
    
    # Calcular el rango: desde hace 7 días hasta ahora
    seven_days_ago = now - timedelta(days=7)
    
    #print(f"DEBUG: Fecha actual local: {now}")
    #print(f"DEBUG: Hace 7 días: {seven_days_ago}")
    
    # Convertir a UTC para la consulta en BD
    seven_days_ago_utc = seven_days_ago.astimezone(timezone.utc)
    now_utc = now.astimezone(timezone.utc)
    
    #print(f"DEBUG: Hace 7 días UTC: {seven_days_ago_utc}")
    #print(f"DEBUG: Ahora UTC: {now_utc}")
    
    sales = (
        db.query(Sale)
        .options(selectinload(Sale.details))
        .filter(Sale.created_at >= seven_days_ago_utc, Sale.created_at <= now_utc)
        .order_by(Sale.created_at.asc())
        .all()
    )
    
    #print(f"DEBUG: Ventas encontradas en rango de 7 días: {len(sales)}")
    for sale in sales:
        #print(f"DEBUG: Venta {sale.id} - Fecha: {sale.created_at} - Total: {sale.total}")
        pass

    # Crear estructura de 7 días
    daily_data = {}
    for i in range(7):
        day = (now.date() - timedelta(days=6-i)).strftime('%Y-%m-%d')
        day_date = datetime.strptime(day, '%Y-%m-%d').date()
        daily_data[day] = {
            "date": day,
            "day_name": day_date.strftime("%A"),
            "day_short": day_date.strftime("%a"),
            "total_sales": 0,
            "total_amount": 0,
            "total_products": 0,
            "sales_count": 0,
        }
    
    # Llenar datos
    for sale in sales:
        sale_date = sale.created_at.astimezone().strftime('%Y-%m-%d')
        
        if sale_date in daily_data:
            daily_data[sale_date]["total_amount"] += sale.total
            daily_data[sale_date]["sales_count"] += 1
            daily_data[sale_date]["total_products"] += sum(detail.quantity for detail in sale.details)
    
    result = list(daily_data.values())
    #print(f"DEBUG: Resultado final: {result}")
    return result