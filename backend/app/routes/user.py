from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..services import create_user, get_user_by_email

router = APIRouter()

@router.post("/register")
def register_user(username: str, email: str, password: str, db: Session = Depends(get_db)):
    # Hash password (add hashing later)
    hashed_password = password  # Just for now, not secure!
    
    # Create user
    return create_user(db, username, email, hashed_password)

@router.get("/user/{email}")
def get_user(email: str, db: Session = Depends(get_db)):
    return get_user_by_email(db, email)
