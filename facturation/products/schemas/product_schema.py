from typing import Annotated
from fastapi import FastAPI, Depends
from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    price: float
    stock: int
    activo: bool = True

class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    stock: int
    activo: bool