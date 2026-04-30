from typing import Annotated, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from facturation.core.security import verify_password, create_access_token
from facturation.database.dependencies.dependencie_session import SessionDep
from facturation.users.schemas.user_schema import UserCreate, UserResponse, UserInDB
from facturation.users.services.user_service import create_user, get_user
from facturation.users.login.user_login import get_current_active_user, get_current_user
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserResponse)
async def create_users(user: UserCreate, db: SessionDep):
    return await create_user(user, db)

@router.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: SessionDep = None):

    user = await get_user(db, form_data.username)

    if not user:
        raise HTTPException(status_code=400)

    if not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=400)

    token = create_access_token({"sub": user.email})

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: UserResponse = Depends(get_current_active_user)):
    return current_user
