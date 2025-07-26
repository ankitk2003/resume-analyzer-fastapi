from fastapi import APIRouter, UploadFile, File, Depends
from server.controllers.resume_controller import (
    handle_pdf_upload,
    analyze_resume_for_reccomendations,
    save_resume,
    get_resume,
    get_resume_by_resumeid,
    delete_resume_by_id,
    rate_resume
    
)
from server.auth_helpers.auth import get_current_user
from sqlalchemy.orm import Session
from server.db.database import get_db

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.post("/upload")
def upload_route(file: UploadFile = File(...), current_user=Depends(get_current_user)):
    pdf_data = handle_pdf_upload(file, current_user)
    # print(pdf_data.text)
    # return pdf_data
    gemini_analysis = analyze_resume_for_reccomendations(pdf_data["text"])
    return {"analysis": gemini_analysis}


@router.post("/save-resume")
def save_resume_data(
    file: UploadFile = File(...),
    curr_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    pdf_data = handle_pdf_upload(file, curr_user)
    resume_ai_analysis = analyze_resume_for_reccomendations(pdf_data["text"])
    saved_resume = save_resume(pdf_data, resume_ai_analysis, db)
    return saved_resume


@router.get("/get-resumes-of-the-user")
def get_resume_by_userid(
    curr_user=Depends(get_current_user), db: Session = Depends(get_db)
):
    resume_data = get_resume(curr_user.id, db)
    return resume_data


@router.get("/get-resume-ananlysis-by-resume-id")
def get_resume_by_id(id: int, db: Session = Depends(get_db)):
    return get_resume_by_resumeid(id, db)


@router.delete("/delete-resume{id}")
def delete_resume(
    id: int,
    db: Session = Depends(get_db),
    curr_user=Depends(get_current_user),
):
    return delete_resume_by_id(id, db, curr_user)


@router.post("/rate-resume")
def rate_resume_by_gemini(file: UploadFile = File(...), current_user=Depends(get_current_user)):
    pdf_data = handle_pdf_upload(file, current_user)
    gemini_rating=rate_resume(pdf_data["text"])
    return gemini_rating