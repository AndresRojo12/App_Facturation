from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from facturation.database.dependencies.dependencie_session import SessionDep
from facturation.users.schemas.user_schema import UserCreate, UserResponse
from facturation.users.services.user_service import create_user
from facturation.users.login.user_login import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserResponse)
async def create_users(user: UserCreate, db: SessionDep):
    return await create_user(user, db)

@router.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: UserResponse = Depends(get_current_user)):
    return current_user
