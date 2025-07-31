# Resume Analyzer – FastAPI, Embeddings & Qdrant

A backend service built with FastAPI, PostgreSQL, and Qdrant that allows recruiters to upload job descriptions and match them with user-uploaded resumes using vector similarity based on embeddings from OpenAI or Gemini.

## Demo Videos

- Uploading a Job Description  for candiate
  [Google drive](https://drive.google.com/file/d/1_hTQvb_OkMWWutQoakR0gkIftFo4xlvS/view?usp=sharing)

- Matching Resumes with Job Descriptions  for recruiters
  [Google drive](https://drive.google.com/file/d/1t8Oo2O19pDDrYonHmSWnCK8QG2xYjNPb/view?usp=sharing)


## Features

- JWT authentication for recruiters and users
- Resume upload and embedding
- Job description upload and embedding
- Resume matching with job descriptions using Qdrant vector search
- PostgreSQL + SQLAlchemy for database operations
- Modular FastAPI backend
- Pytest-based testing suite

## Project Structure

resume-analyzer-fastapi/
├── app/
│ ├── auth/
│ ├── recruiters/
│ ├── users/
│ ├── job_descriptions/
│ ├── embeddings/
│ ├── qdrant/
│ └── core/
├── tests/
├── main.py
├── requirements.txt
├── .env



## Getting Started

### Prerequisites

- Python 3.10+
- PostgreSQL
- Qdrant (cloud)
- OpenAI or Gemini API key for embeddings

### Installation

```bash
git clone https://github.com/ankitk2003/resume-analyzer-fastapi.git
cd resume-analyzer-fastapi

python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

pip install -r requirements.txt


OPENAI_API_KEY=your_openai_key
DATABASE_URL=postgresql://username:password@localhost:5432/dbname
JWT_SECRET_KEY=your_jwt_secret
QDRANT_HOST=http://localhost:6333

```
run the app:
```bash
uvicorn main:app --reload
```
run the test :
```bash
pytest --cov=server
```

Tech Stack
FastAPI

PostgreSQL

SQLAlchemy

Qdrant

OpenAI Embeddings

Gemini API

Pytest


Author
Ankit Kumar
GitHub: ankitk2003
LinkedIn: linkedin.com/in/ankitkumar2003




