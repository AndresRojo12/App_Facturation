# create connection to the database postgresql

from sqlmodel import SQLModel, create_engine
from facturation.core.config import settings

DATABASE_URL = settings.DATABASE_URL

connect_args = {}

# For SQLite, you would use:

if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    
engine = create_engine(DATABASE_URL, echo=True, connect_args=connect_args)