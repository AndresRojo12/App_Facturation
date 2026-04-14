# create new user in the database

from facturation.database.dependencies.dependencie_session import SessionDep
from facturation.users.models.user_model import User
from facturation.users.schemas.user_schema import UserCreate, UserResponse

async def create_user(user: UserCreate, db: SessionDep) -> UserResponse:
    new_user = User(
     email=user.email, 
     password=user.password)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user