from typing import Annotated
from fastapi import FastAPI, Depends
from pydantic import BaseModel

class SaleItem(BaseModel):
    product_id: int
    quantity: int

class SaleCreate(BaseModel):
    items: list[SaleItem]
