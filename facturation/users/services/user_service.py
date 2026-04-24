# create new user in the database

from facturation.database.dependencies.dependencie_session import SessionDep
from facturation.users.models.user_model import User
from facturation.users.schemas.user_schema import UserCreate, UserInDB, UserResponse
from facturation.core.security import fake_hash_password

async def create_user(user: UserCreate, db: SessionDep) -> UserResponse:
    hashed_password = fake_hash_password(user.password)
    new_user = User(
     email=user.email, 
     password=hashed_password)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# traer usuario de la base de datos

async def get_user(db: SessionDep, email: str):
    return db.query(User).filter(User.email == email).first()