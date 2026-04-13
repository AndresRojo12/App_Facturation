from typing import Annotated

from fastapi import Depends
from sqlalchemy.orm import Session

from facturation.database.database_session import SessionLocal


def get_session():
    with SessionLocal() as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]
