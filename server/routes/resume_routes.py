from fastapi import APIRouter ,UploadFile,File,Depends
from server.controllers.resume_controller import handle_pdf_upload,analyze_resume_for_reccomendations
from server.auth_helpers.auth import get_current_user
router=APIRouter(prefix="/resume",tags=["Resume"])

@router.post("/upload")
def upload_route(file: UploadFile = File(...),current_user=Depends(get_current_user)):
    pdf_data=handle_pdf_upload(file,current_user)
    # print(pdf_data.text)
    # return pdf_data
    gemini_analysis=analyze_resume_for_reccomendations(pdf_data["text"])
    return{
        "analysis":gemini_analysis
    }
