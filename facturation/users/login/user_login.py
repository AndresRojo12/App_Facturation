from typing import Annotated
from fastapi import FastAPI, Depends, HTTPException,status
from facturation.users.schemas.user_schema import UserResponse, TokenData
from fastapi.security import OAuth2PasswordBearer
from facturation.database.dependencies.dependencie_session import SessionDep
from jwt.exceptions import InvalidTokenError
from facturation.core.config import settings
import jwt

from facturation.users.services.user_service import get_user

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/token")

def fake_decode_token(token: str, db: SessionDep):
    user = get_user(db,token)
    return user

# oauth2_schem se usa en una dependencia con Depends
async def get_current_user(db: SessionDep, token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = await get_user(db, token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: UserResponse = Depends(get_current_user)):
    return current_user