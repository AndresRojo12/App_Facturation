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
    new_product = Product(
     name=product.name, 
     price=product.price,
     stock=product.stock,
     activo=product.activo)
    
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