from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from .database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String,unique=True,nullable=False)
    email = Column(String,unique=True,nullable=False)
    hashed_password = Column(String,nullable=False) 

    profile = relationship("UserProfile", back_populates="user",uselist=False)

class UserProfile(Base):
    __tablename__ = "user_profiles"

    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    skills = Column(ARRAY(String))
    interests = Column(ARRAY(String))
    education = Column(String)
    goals = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="profile")