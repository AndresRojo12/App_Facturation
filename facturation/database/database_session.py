#create session to the database postgresql

from sqlalchemy.orm import sessionmaker
from facturation.database.connection import engine

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)