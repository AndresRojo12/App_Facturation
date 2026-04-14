from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    email: str
    password: str

# response_model = UserCreate
# 
class UserResponse(BaseModel):
    id: int
    email: str  
    created_at: datetime
    updated_at: datetime


