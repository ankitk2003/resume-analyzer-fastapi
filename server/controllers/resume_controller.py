import os
import shutil
import pdfplumber
from fastapi import UploadFile, File, HTTPException, Depends
from server.auth_helpers.auth import get_current_user

import google.generativeai as genai
from dotenv import load_dotenv
import os
import json

load_dotenv()


UPLOAD_DIR = "uploads"
os.makedirs(
    UPLOAD_DIR, exist_ok=True
)  # this will craate the folder , if it is not existing
BASE_URL = "http://localhost:8000"


def handle_pdf_upload(file: UploadFile, current_user) -> dict:
    if not file.filename.endswith(".pdf"):
        raise HTTPException(detail="Only PDFs are allowed", status_code=400)
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    text = ""
    with pdfplumber.open(file_path) as pdf:
        text = ""
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

    file_url = f"{BASE_URL}/files/{file.filename}"

    return {
        "filename": file.filename,
        "message": "File uploaded successfully",
        "text": text,
        "file_url": file_url,
        "current_user": current_user,
    }


genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-1.5-flash")


import re

def extract_json_from_text(text: str) -> dict:  #this function to extract the json from the response
    try:
        json_string = re.search(r"\{.*\}", text, re.DOTALL).group()
        return json.loads(json_string)
    except Exception as e:
        return {"raw_output": text, "json_parse_error": str(e)}


def analyze_resume_for_reccomendations(resume_text: str) -> dict:
    prompt = f"""
You are a resume evaluator. Based on the following resume text, extract and return the following information in proper JSON format:

1. Strengths – Highlight the candidate’s key strengths based on their skills, projects, tools, etc.
2. Weaknesses – Mention any visible gaps or areas of improvement.
3. Job Role Suggestions – Suggest suitable job roles that best fit the candidate’s profile.
4. overall suggestion for landing a good job
Resume Text:
\"\"\"
{resume_text}
\"\"\"

Return only the result in clean JSON format like this:
{{
  "strengths": [...],
  "weaknesses": [...],
  "job_role_suggestions": [...],
  "overall_suggestions:[...]
}}
"""
    try:
        response = model.generate_content(prompt)
        return extract_json_from_text(response.text)
    except Exception as e:
        return {"error": str(e)}