# create connection to the database postgresql

from sqlmodel import SQLModel, create_engine

DATABASE_URL = "postgresql://postgres:admin@localhost:5432/facturation_db"
engine = create_engine(DATABASE_URL)