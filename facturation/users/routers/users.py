from typing import List

from fastapi import APIRouter, Depends
from facturation.users.schemas.user_schema import UserCreate

router = APIRouter()

@router.post("/users")
async def create_user(user: UserCreate):
    return user