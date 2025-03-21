from sqlalchemy.orm import Session
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from app.models import User, UserProfile, ChatMessage, DrishtiMessage
import os
from fastapi.security import OAuth2PasswordBearer
from .database import get_db
from fastapi import Depends, HTTPException, status
from dotenv import load_dotenv
load_dotenv()

# Hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY") 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 24 * 60 * 7  # Token expires in 7 days

# Hash password
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# Verify password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Create JWT Token
def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Decode JWT Token
def decode_access_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except JWTError:
        return None

# Create a new user (now hashes password before saving)
def create_user(db: Session, username: str, email: str, password: str):
    hashed_password = get_password_hash(password)  # Securely hash the password
    user = User(username=username, email=email, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)

    #creating a empty user profile for the user
    profile = UserProfile(user_id=user.id)
    db.add(profile)
    db.commit()

    return user

# Get user by email
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

#get current user
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    if not token:
        raise HTTPException(status_code=401, detail="Token not provided")

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = get_user_by_email(db, email)
    if user is None:
        raise credentials_exception

    return user

#tatva logic
def save_chat_message(db: Session, user_id: int, sender: str, message: str):
    new_msg = ChatMessage(user_id=user_id, sender=sender, message=message)
    db.add(new_msg)
    db.commit()
    messages = db.query(ChatMessage).filter_by(user_id=user_id).order_by(ChatMessage.timestamp.asc()).all()
    if len(messages) > 40:
        for msg in messages[:len(messages) - 40]:
            db.delete(msg)
        db.commit()

def get_chat_history(db: Session, user_id: int):
    return db.query(ChatMessage).filter_by(user_id=user_id).order_by(ChatMessage.timestamp.asc()).all()

def reset_chat_history(db: Session, user_id: int):
    db.query(ChatMessage).filter_by(user_id=user_id).delete()
    db.commit()

def get_user_profile(db: Session, user_id: int):
    return db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

#drishti logic
def save_drishti_message(db: Session, user_id: int, sender: str, message: str):
    new_msg = DrishtiMessage(user_id=user_id, sender=sender, message=message)
    db.add(new_msg)
    db.commit()
    messages = db.query(DrishtiMessage).filter_by(user_id=user_id).order_by(DrishtiMessage.timestamp.asc()).all()
    if len(messages) > 40:
        for msg in messages[:len(messages) - 40]:
            db.delete(msg)
        db.commit()

def get_drishti_history(db: Session, user_id: int):
    return db.query(DrishtiMessage).filter_by(user_id=user_id).order_by(DrishtiMessage.timestamp.asc()).all()

def reset_drishti_history(db: Session, user_id: int):
    db.query(DrishtiMessage).filter_by(user_id=user_id).delete()
    db.commit()