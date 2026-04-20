from typing import Annotated
from fastapi import FastAPI, Depends
from facturation.users.schemas.user_schema import UserResponse
from fastapi.security import OAuth2PasswordBearer

from facturation.users.services.user_service import get_user

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def fake_decode_token(token):
    user = get_user(token)
    return user

# oauth2_schem se usa en una dependencia con Depends
def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    user = fake_decode_token(token)
    return user

