from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..services import create_user, get_user_by_email, get_user_by_username
from ..schemas import UserRegister

router = APIRouter()

@router.post("/register")
def register_user(user: UserRegister, db: Session = Depends(get_db)):
    if get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="Email already registered")

    if get_user_by_username(db, user.username):
        raise HTTPException(status_code=400, detail="Username already taken")

    return create_user(db, user.username, user.email, user.password)
