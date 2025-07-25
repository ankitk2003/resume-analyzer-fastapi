from sqlalchemy import Column, Integer, String , ForeignKey
from sqlalchemy.orm import relationship
from server.db.database import Base


class Resume(Base):
    __tablename__ = "resume"

    id = Column(Integer, primary_key=True, index=True)
    resume_link = String(255)
    resume_desc = String(1000)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user=relationship("User",back_populates="resumes")
    