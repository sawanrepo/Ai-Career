from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models import User, UserProfile as UserProfileModel
from app.schemas import UserOut, UserProfileUpdate, UserProfile
from ..database import get_db
from ..services import get_current_user 

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("/", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return current_user

@router.put("/", response_model=UserProfile)
def update_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(UserProfileModel).filter(UserProfileModel.user_id == current_user.id).first()
    if not profile:
        profile = UserProfileModel(user_id=current_user.id)

    for field, value in profile_data.dict(exclude_unset=True).items():
        setattr(profile, field, value)

    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile
