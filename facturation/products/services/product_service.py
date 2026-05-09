# create new product in the database

from starlette.exceptions import HTTPException

from facturation.database.dependencies.dependencie_session import SessionDep
from facturation.products.models.product_model import Product
from facturation.products.schemas.product_schema import ProductCreate, ProductResponse

# create function all get products from the database
async def get_products(db: SessionDep, offset: int = 0, limit: int = 10):
    total = db.query(Product).count()
    products = db.query(Product).offset(offset).limit(limit).all()
    pages = (total + limit - 1) // limit  # ceil(total / limit)
    return {
        "products": products,
        "total": total,
        "page": (offset // limit) + 1,
        "pages": pages
    }

# create function to create new product in the database

async def create_product(product: ProductCreate, db: SessionDep) -> ProductResponse:
    # validar si el producto ya existe 
    existing_product = db.query(Product).filter(Product.name == product.name).first()
    if existing_product:
        raise HTTPException(status_code=400, detail="Product already exists")
    
    activo = product.stock > 0
    new_product = Product(
     name=product.name, 
     price=product.price,
     stock=product.stock,
     activo=activo)
    
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

# get product by id from the database
async def get_product(product_id: int, db: SessionDep) -> ProductResponse:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# add stock to a product
async def add_stock(product_id: int, quantity: int, db: SessionDep) -> ProductResponse:
    product = await get_product(product_id, db)
    product.stock += quantity
    if product.stock > 0:
        product.activo = True

    db.add(product)
    db.commit()
    db.refresh(product)
    return product

# create function to update product in the database
async def update_product(product_id: int, product: ProductCreate, db: SessionDep) -> ProductResponse:
    existing_product = await get_product(product_id, db)
    existing_product.name = product.name
    existing_product.price = product.price
    existing_product.stock = product.stock
    existing_product.activo = product.stock > 0

    db.add(existing_product)
    db.commit()
    db.refresh(existing_product)
    return existing_product