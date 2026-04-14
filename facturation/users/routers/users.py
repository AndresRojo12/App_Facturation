from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from facturation.database.dependencies.dependencie_session import SessionDep
from facturation.users.schemas.user_schema import UserCreate, UserResponse
from facturation.users.services.user_service import create_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserResponse)
async def create_users(user: UserCreate, db: SessionDep):
    return await create_user(user, db)