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
        from_attributes = True

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

#using duplicate (for tatva and drishti) for now. will be updated later.
class DrishtiChatResponse(BaseModel):
    sender: str
    message: str
    timestamp: datetime

class DrishtiChatHistoryResponse(BaseModel):
    history: List[DrishtiChatResponse]

class LearningResource(BaseModel):
    title: str
    type: str
    url: str
class LearningStep(BaseModel):
    title: str
    description: Optional[str] = None
    resources: Optional[List[LearningResource]] = None

class LearningPathCreate(BaseModel):
    career_path: str
    steps: Optional[List[LearningStep]] = None

class LearningPathUpdate(BaseModel):
    current_step: Optional[int] = None
    is_completed: Optional[bool] = None
    is_archived: Optional[bool] = None

class LearningPathOut(BaseModel):
    id: int
    career_path: str
    current_step: int
    total_steps: int
    steps: List[LearningStep]
    is_completed: bool
    is_archived: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True