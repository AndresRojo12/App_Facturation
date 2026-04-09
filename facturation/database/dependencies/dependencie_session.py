from typing import Annotated
from sqlmodel import SQLModel, Session
from fastapi import Depends, FastAPI
from facturation.database.connection import engine

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]
