from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Table, JSON
from sqlalchemy.orm import relationship
from server.db.database import Base
from datetime import datetime

class Recruiter(Base):
    __tablename__ = "recruiters"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    user_name=Column(String(255))
    password=Column(String(255))
    uploaded_jds = relationship("JobDescription", back_populates="recruiter")


class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    recruiter_id = Column(Integer, ForeignKey("recruiters.id"))
    recruiter = relationship("Recruiter", back_populates="uploaded_jds")


class RecruiterResume(Base):
    __tablename__ = "recruiter_resumes"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255))
    content = Column(Text)
    embedding = Column(Text)  # You could change this to ARRAY(Float) if using PG vector
    matched_jd_ids = Column(JSON)  # List of JD IDs matched to this resume
    uploaded_by = Column(Integer, ForeignKey("recruiters.id"), nullable=True)
    recruiter = relationship("Recruiter")
