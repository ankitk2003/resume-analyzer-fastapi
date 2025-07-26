from fastapi import FastAPI, Depends, APIRouter, UploadFile, File
from server.schemas.user_schema import UserSignup, UserLogin, UserResponse
from sqlalchemy.orm import Session
from server.db.database import get_db
from server.controllers.recruiter_auth_controllers import sign_up, verify_user_by_otp, user_login
from server.auth_helpers.auth import oauth2_scheme, get_current_user
from server.models.user_model import User
from server.controllers.resume_controller import handle_pdf_upload

router = APIRouter(prefix="/recruiter", tags=["Recruiter"])


@router.post("/sign-up")
def signup(user: UserSignup, db: Session = Depends(get_db)):
    signup_otp = sign_up(user, db)
    return signup_otp


@router.post("/verify-otp")
def verify_otp(otp: int, db: Session = Depends(get_db)):
    verify_message = verify_user_by_otp(otp, db)
    return verify_message


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    token = user_login(user, db)
    return token