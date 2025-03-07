from sqlalchemy.orm import Session
from app.models import User

# Create a new user
def create_user(db: Session, username: str, email: str, hashed_password: str):
    user = User(username=username, email=email, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# Get user by email
def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()
