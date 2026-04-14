from typing import List

from fastapi import APIRouter, Depends
from facturation.users.schemas.user_schema import UserCreate, UserResponse

router = APIRouter()

@router.post("/users", response_model=UserResponse)
async def create_user(user: UserCreate):
    return user