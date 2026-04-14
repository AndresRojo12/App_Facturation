from fastapi import FastAPI
from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    password: str

