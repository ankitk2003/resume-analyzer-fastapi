# test_user.py
import pytest
from fastapi.testclient import TestClient
import sys
import os

# Add project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../")))

# Now import after sys.path change
from server.main import app
from server.db.database import SessionLocal
from server.models import user_model

client = TestClient(app)


def cleanup_test_user(email: str):
    db = SessionLocal()
    try:
        # Delete test user data
        db.query(user_model.Email).filter(user_model.Email.email == email).delete()
        db.query(user_model.User).filter(user_model.User.email == email).delete()
        db.commit()
    finally:
        db.close()


def test_signup_verify_login():
    test_email = "testuser@example.com"

    # Step 0: Clean any existing test data
    cleanup_test_user(test_email)

    # Step 1: Sign up
    signup_data = {
        "email": test_email,
        "password": "testpass123",
        "user_name": "testuser",
    }
    signup_response = client.post("/user/sign-up", json=signup_data)
    assert signup_response.status_code == 200
    signup_json = signup_response.json()
    assert "otp" in signup_json
    assert signup_json["message"] == "OTP sent successfully"
    otp = signup_json["otp"]

    # Step 2: Verify OTP
    verify_response = client.post("/user/verify-otp", json={"otp": otp})
    assert verify_response.status_code == 200
    verify_json = verify_response.json()
    assert verify_json["message"] == "Sign-up-sucessfull"
    assert "access_token" in verify_json

    # Step 3: Login
    login_data = {"email": test_email, "password": "testpass123"}
    login_response = client.post("/user/login", json=login_data)
    assert login_response.status_code == 200
    login_json = login_response.json()
    assert "access_token" in login_json
    assert login_json["token_type"] == "bearer"


def test_invalid_otp_verification():
    test_mail="invalidotp@example.com"
    cleanup_test_user(test_mail)

    signup_data={
        "email":test_mail,
        "password":"wrongpass@123",
        "user_name":"wrongotpuser"
    }

    signup_response=client.post("/user/sign-up",json=signup_data)
    assert signup_response.status_code==200

    wrong_otp="000000"
    verify_response=client.post("/user/verify-otp",json={"otp":wrong_otp})

    assert verify_response.status_code==400
    assert verify_response.json()["detail"]=="Invalid or expired OTP"