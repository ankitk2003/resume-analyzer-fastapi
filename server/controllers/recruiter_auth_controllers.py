from server.schemas.user_schema import UserSignup, UserLogin
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from server.db.database import get_db
from server.models import user_model
from server.auth_helpers.auth import (
    hash_password,
    send_mail,
    verify_password,
    create_access_token,
)
from server.models.recruiter_model import Recruiter

def sign_up(user: UserSignup, db: Session):
    existing_user = (
        db.query(Recruiter.email).filter(Recruiter.email == user.email).first()
    )
    if existing_user:
        raise HTTPException(status_code=409, detail="Email already registered")

    otp = send_mail(user.email)
    if otp is None:
        return {"message": "error in email function"}
    hashed_password = hash_password(user.password)
    db_user = user_model.Email(
        user_name=user.user_name, email=user.email, password=hashed_password, otp=otp
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"Message otp  Successfully", otp}


def verify_user_by_otp(otp: int, db: Session):
    existing_user = (
        db.query(user_model.Email).filter(user_model.Email.otp == otp).first()
    )
    if not existing_user:
        return {"message": "register fisrt"}
    db_user = Recruiter(
        user_name=existing_user.user_name,
        email=existing_user.email,
        password=existing_user.password,
    )
    db.add(db_user)
    db.delete(
        existing_user
    )  # delete the record from email after adding it to the users table
    db.commit()
    db.refresh(db_user)
    access_token = create_access_token(data={"sub": str(db_user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "message": "Sign-up-sucessfull",
    }
    # return {"message": "User verified and registered successfully"}


def user_login(user: UserLogin, db: Session):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong credentials"
    )
    print("Login Email", user.email)
    user_found = (
        db.query(Recruiter).filter(Recruiter.email == user.email).first()
    )

    if not user_found:
        print("user verification failed")
        raise credential_exception

    if not verify_password(user.password, user_found.password):
        print("Password verification failed")
        raise credential_exception
    else:
        print("Password verification passed")

    access_token = create_access_token(data={"sub": str(user_found.id)})
    return {"access_token": access_token, "token_type": "bearer"}
