from pydantic import BaseModel


class UserBase(BaseModel):
    email: str
    password: str


class UserSignup(BaseModel):
    email: str
    password: str
    user_name: str


class UserLogin(BaseModel):
    email: str
    password: str


class UserEmail(BaseModel):
    user_name: str
    password: str
    otp: int


class UserResponse(BaseModel):
    email: str
    user_name: str
    id: int
