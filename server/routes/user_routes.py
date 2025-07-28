from fastapi import FastAPI, Depends, APIRouter, UploadFile, File
from server.schemas.user_schema import UserSignup, UserLogin, UserResponse ,OtpVerifyRequest
from sqlalchemy.orm import Session
from server.db.database import get_db
from server.controllers.user_controllers import sign_up, verify_user_by_otp, user_login
from server.auth_helpers.auth import oauth2_scheme, get_current_user
from server.models.user_model import User
from server.controllers.resume_controller import handle_pdf_upload

router = APIRouter(prefix="/user", tags=["User"])


@router.post("/sign-up")
def signup(user: UserSignup, db: Session = Depends(get_db)):
    signup_otp = sign_up(user, db)
    return signup_otp


@router.post("/verify-otp")
def verify_otp(payload: OtpVerifyRequest, db: Session = Depends(get_db)):
    verify_message = verify_user_by_otp(payload.otp, db)
    return verify_message


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    token = user_login(user, db)
    return token


# @router.post("/upload")
# def upload_route(file: UploadFile = File(...),current_user=Depends(get_current_user)):
#     return handle_pdf_upload(file,current_user)


# @router.get("/profile",response_model=UserResponse)      #this is just for testing purpose
# def get_profile(current_user:dict=Depends(get_current_user)):
#     return current_user
