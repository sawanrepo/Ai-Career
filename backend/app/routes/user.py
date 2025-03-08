from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..services import create_user, get_user_by_email

router = APIRouter()

@router.post("/register")
def register_user(username: str, email: str, password: str, db: Session = Depends(get_db)):
    if get_user_by_email(db, email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    return create_user(db, username, email, password)

@router.get("/{email}")
def get_user(email: str, db: Session = Depends(get_db)):
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
