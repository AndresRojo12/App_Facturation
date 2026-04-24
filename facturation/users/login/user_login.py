from typing import Annotated
from fastapi import FastAPI, Depends, HTTPException
from facturation.users.schemas.user_schema import UserResponse
from fastapi.security import OAuth2PasswordBearer
from facturation.database.dependencies.dependencie_session import SessionDep

from facturation.users.services.user_service import get_user

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="users/token")


def fake_decode_token(token: str, db: SessionDep):
    user = get_user(db,token)
    return user

# oauth2_schem se usa en una dependencia con Depends
def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    user = fake_decode_token(token)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

async def get_current_active_user(current_user: UserResponse = Depends(get_current_user)):
    return current_user