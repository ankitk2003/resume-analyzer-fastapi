from fastapi import FastAPI, Depends, APIRouter, UploadFile, File
from server.schemas.user_schema import UserSignup, UserLogin, UserResponse
from sqlalchemy.orm import Session
from typing import List
from server.db.database import get_db
from server.controllers.recruiter_auth_controllers import (
    sign_up,
    verify_user_by_otp,
    user_login,
)
from server.auth_helpers.auth import (
    oauth2_scheme,
    get_current_user,
    get_current_recruiter,
)
from server.models.user_model import User
from server.controllers.resume_controller import handle_pdf_upload
from server.controllers.resume_controller import get_current_user, handle_pdf_upload
from server.services.get_embedding import get_embedding
from server.services.store_jdembeddings import store_jd_embedding
from server.services.store_resume_embedding import store_resume_embedding
from server.models.recruiter_model import JobDescription, RecruiterResume

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


@router.get("/profile", response_model=UserResponse)  # this is just for testing purpose
def get_profile(current_recruiter: dict = Depends(get_current_recruiter)):
    return current_recruiter


@router.post("/upload-jd")
def upload_jd(
    file: UploadFile = File(...),
    curr_recruiter=Depends(get_current_recruiter),
    db: Session = Depends(get_db),
):
    file_data = handle_pdf_upload(file, curr_recruiter)
    # return file_data
    # print(file_data)
    embedding = get_embedding(file_data["text"])
    res = store_jd_embedding(embedding, file_data["current_user"].id, file_data["text"])
    jd_id = res["jd_id"]
    # print(jd_id)
    # print(embedding)

    jd = JobDescription(
        title=file_data["filename"],
        content=file_data["text"],
        recruiter_id=curr_recruiter.id,
        qdrant_id=jd_id,
    )
    db.add(jd)
    db.commit()
    db.refresh(jd)
    return {"message": "JD uploaded successfully", "jd_id": jd.id}


@router.post("/upload-resumes")
async def upload_resumes(
    files: List[UploadFile] = File(...),
    curr_recruiter=Depends(get_current_recruiter),
    db: Session = Depends(get_db),
):
    results = []

    for file in files:
        try:
            file_data = handle_pdf_upload(file, curr_recruiter)
            embedding = get_embedding(file_data["text"])
            res = store_resume_embedding(
                embedding, curr_recruiter.id, file_data["text"]
            )
            resume_qdrant_id = res["resume_id"]

            resume = RecruiterResume(
                filename=file_data["filename"],
                content=file_data["text"],
                uploaded_by=curr_recruiter.id,
                qdrant_id=resume_qdrant_id,
            )
            db.add(resume)
            db.commit()
            db.refresh(resume)

            results.append(
                {"file": file.filename, "status": "uploaded", "resume_id": resume.id}
            )
        except Exception as e:
            results.append({"file": file.filename, "status": f"failed: {str(e)}"})

    return {"message": "Resume upload complete", "results": results}
