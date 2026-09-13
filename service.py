from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.users.model import User


def create_user(
    db: Session,
    full_name: str,
    email: str,
    password: str,
    role: str = "agent",
):
    existing = db.execute(
        select(User).where(User.email == email.lower())
    ).scalar_one_or_none()

    if existing:
        return None

    user = User(
        full_name=full_name,
        email=email.lower(),
        hashed_password=hash_password(password),
        role=role,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def authenticate_user(
    db: Session,
    email: str,
    password: str,
):
    user = db.execute(
        select(User).where(User.email == email.lower())
    ).scalar_one_or_none()

    if not user:
        return None

    if not verify_password(
        password,
        user.hashed_password,
    ):
        return None

    if not user.is_active:
        return None

    return user


def create_login_token(user: User):
    return create_access_token(
        {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role,
        }
    )