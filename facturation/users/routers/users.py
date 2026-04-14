from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from facturation.database.dependencies.dependencie_session import SessionDep
from facturation.users.schemas.user_schema import UserCreate, UserResponse

router = APIRouter()

@router.post("/users", response_model=UserResponse)
async def create_user(user: UserCreate, db: Session = Depends(SessionDep)):
    return user