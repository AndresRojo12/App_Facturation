from typing import Annotated
from fastapi import FastAPI, Depends
from pydantic import BaseModel

class SaleDetailResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float

    class Config:
        from_attributes = True

class SaleResponse(BaseModel):
    id: int
    total: float
    details: list[SaleDetailResponse]

    class Config:
        from_attributes = True           