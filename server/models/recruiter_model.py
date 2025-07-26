from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Table, JSON
from sqlalchemy.orm import relationship
from server.db.database import Base
from datetime import datetime
from sqlalchemy.sql import func


class Recruiter(Base):
    __tablename__ = "recruiters"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    user_name = Column(String(255))
    password = Column(String(255))
    uploaded_jds = relationship("JobDescription", back_populates="recruiter")
    uploaded_resumes = relationship(
        "RecruiterResume", back_populates="recruiter"
    )  # ✅ New


class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(String)  # Raw JD text
    recruiter_id = Column(Integer, ForeignKey("recruiters.id"))
    qdrant_id = Column(String)  # UUID of the vector stored in Qdrant
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    recruiter = relationship("Recruiter", back_populates="uploaded_jds")  # <-- Add this


class RecruiterResume(Base):
    __tablename__ = "recruiter_resumes"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255))
    content = Column(Text)
    qdrant_id = Column(String)  # UUID of the vector stored in Qdrant
    uploaded_by = Column(Integer, ForeignKey("recruiters.id"), nullable=True)
    recruiter = relationship("Recruiter", back_populates="uploaded_resumes")
