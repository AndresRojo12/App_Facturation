# create new product in the database

from starlette.exceptions import HTTPException

from facturation.database.dependencies.dependencie_session import SessionDep
from facturation.products.models.product_model import Product
from facturation.products.schemas.product_schema import ProductCreate, ProductResponse

# create function all get products from the database
async def get_products(db: SessionDep) -> list[ProductResponse]:
    products = db.query(Product).all()
    return products

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