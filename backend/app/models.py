from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func, Boolean
from sqlalchemy.dialects.postgresql import JSON
from .database import Base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import ARRAY
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String,unique=True,nullable=False)
    email = Column(String,unique=True,nullable=False)
    hashed_password = Column(String,nullable=False) 

    profile = relationship("UserProfile", back_populates="user",uselist=False)
    messages = relationship("ChatMessage", back_populates="user", cascade="all, delete")
    drishti_messages = relationship("DrishtiMessage", back_populates="user", cascade="all, delete")
    learning_paths = relationship("LearningPath", back_populates="user", cascade="all, delete")
    arya_messages = relationship("AryaMessage", back_populates="user", cascade="all, delete")

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

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    sender = Column(String)
    message = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="messages")

#new table for counselor messages . later will be murged with chat messages with new coloumn chat_type(tatva/Drishti).
class DrishtiMessage(Base):
    __tablename__ = "drishti_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    sender = Column(String)
    message = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="drishti_messages")

class LearningPath(Base):
    __tablename__ = "learning_paths"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"),nullable=False)
    career_path = Column(String,nullable=False)
    current_step = Column(Integer,default=0)
    total_steps = Column(Integer,default=0)
    steps = Column(JSON)
    is_completed = Column(Boolean,default=False)
    is_archived = Column(Boolean,default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="learning_paths")

class AryaMessage(Base):
    __tablename__ = "arya_message"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    sender = Column(String)
    message = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="arya_messages")