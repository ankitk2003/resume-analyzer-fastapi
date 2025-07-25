from sqlalchemy import Column, Integer, String
from server.db.database import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)

    resumes = relationship("Resume", back_populates="user")


class Email(Base):
    __tablename__ = "email"
    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    otp = Column(Integer, nullable=False)
