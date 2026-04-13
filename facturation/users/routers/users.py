from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlmodel import select

from facturation.database.dependencies.dependencie_session import SessionDep
from facturation.users.models.user_model import User, UserCreate

router = APIRouter()


@router.get("/users", response_model=List[User])
def get_users(session: Session = Depends(SessionDep)):
    users = session.exec(select(User)).all()
    return users


@router.post("/users", response_model=User, status_code=status.HTTP_201_CREATED)
def create_user(user_in: UserCreate, session: Session = Depends(SessionDep)):
    existing = session.exec(select(User).where(User.email == user_in.email)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists.",
        )
    user = User(email=user_in.email, password=user_in.password)
    session.add(user)
    try:
        session.commit()
        session.refresh(user)
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Unable to create user; email might already be registered.",
        )
    return user