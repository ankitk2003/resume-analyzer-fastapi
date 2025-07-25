from server.core.config import settings
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from server.db.database import get_db
from sqlalchemy.orm import Session
from server.models.user_model import User

# imports for mail
import smtplib
import secrets
from email.message import EmailMessage

SENDER_EMAIL = settings.EMAIL
EMAIL_PASSWORD = settings.EMAIL_PASSWORD

SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/user/login")

# hashing confuguration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now() + (timedelta(ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials , please login again",
        headers={"WWW_Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        user_id = payload.get("sub")
        if user_id is None:
            return credential_exception
    except JWTError:
        raise credential_exception
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credential_exception
    return user


#function to send otp in mail
def send_mail(receiver_mail: str) -> str:
    otp = "".join(
        secrets.choice("0123456789") for _ in range(6)
    )  # generating a 6-digit otp

    msg = EmailMessage()
    msg.set_content(f"Your OTP is:{otp}")
    msg["Subject"] = "Your OTP Code"
    msg["From"] = SENDER_EMAIL
    msg["To"] = receiver_mail

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(SENDER_EMAIL, EMAIL_PASSWORD)
            smtp.send_message(msg)
            print("OTP sent successfully !")

    except Exception as e:
        print(f"Failed to send OTP:{e}")
        return None
    return otp
