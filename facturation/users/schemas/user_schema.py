from fastapi import FastAPI
from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    password: str

# response_model = UserCreate
# 
class UserResponse(BaseModel):
    id: int
    email: str  
        

