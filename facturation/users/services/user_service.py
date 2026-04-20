# create new user in the database

from facturation.database.dependencies.dependencie_session import SessionDep
from facturation.users.models.user_model import User
from facturation.users.schemas.user_schema import UserCreate, UserInDB, UserResponse

async def create_user(user: UserCreate, db: SessionDep) -> UserResponse:
    new_user = User(
     email=user.email, 
     password=user.password)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# traer usuario de la base de datos

async def get_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return UserInDB(**user_dict)