from typing import Annotated
from fastapi import FastAPI, Depends
from pydantic import BaseModel
from datetime import datetime

class UserCreate(BaseModel):
    email: str
    password: str

# response_model = UserCreate

class UserResponse(BaseModel):
    id: int
    email: str  
    
class UserInDB(UserResponse):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str    

class TokenData(BaseModel):
    username: str | None = None