from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.users import service
from app.users.schema import (
    LoginRequest,
    TokenResponse,
    UserCreate,
    UserRead,
)

router = APIRouter()


@router.post(
    "/register",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
)
def register(
    data: UserCreate,
    db: Session = Depends(get_db),
):
    user = service.create_user(
        db=db,
        full_name=data.full_name,
        email=data.email,
        password=data.password,
        role=data.role,
    )

    if user is None:
        raise HTTPException(
            status_code=409,
            detail="Email already registered",
        )

    return user


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
):
    user = service.authenticate_user(
        db=db,
        email=data.email,
        password=data.password,
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    token = service.create_login_token(user)

    return {
        "access_token": token,
        "token_type": "bearer",
    }