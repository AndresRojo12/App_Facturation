from datetime import datetime
from pydantic import BaseModel
from facturation.sales.schemas.sale_detail_schema import SaleDetailResponse

class SaleItem(BaseModel):
    product_id: int
    quantity: int

class SaleCreate(BaseModel):
    items: list[SaleItem]

class SaleResponse(BaseModel):
    id: int
    total: float
    created_at: datetime
    seller_name: str | None = None
    seller_email: str | None = None
    details: list[SaleDetailResponse]

    class Config:
        from_attributes = True