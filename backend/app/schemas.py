from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserProfileBase(BaseModel):
    skills: Optional[List[str]] = []
    interests: Optional[List[str]] = []
    education: Optional[str] = None
    goals: Optional[str] = None

class UserProfileCreate(UserProfileBase):
    pass

class UserProfile(UserProfileBase):
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    profile: Optional[UserProfile] = None

    class Config:
        from_attributes = True

class UserProfileUpdate(UserProfileBase):
    pass

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    sender: str
    message: str
    timestamp: datetime

class ChatHistoryResponse(BaseModel):
    history: List[ChatResponse]