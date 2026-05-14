from pydantic import BaseModel

class SaleDetailResponse(BaseModel):
    id: int
    product_id: int
    product_name: str | None = None
    quantity: int
    price: float

    class Config:
        from_attributes = True
           