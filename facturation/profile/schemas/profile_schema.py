from typing import Annotated, Optional
from fastapi import FastAPI, Depends
from pydantic import BaseModel

class ProfileCreate(BaseModel):
    full_name: str
    phone: Optional[str] = None
    document: Optional[str] = None

class ProfileResponse(BaseModel):
    id: int
    user_id: int
    full_name: str
    phone: Optional[str] = None
    document: Optional[str] = None

    class Config:
        from_attributes = True    