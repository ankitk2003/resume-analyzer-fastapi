from sqlalchemy import Column, Integer, String, ForeignKey,Text
from sqlalchemy.orm import relationship
from server.db.database import Base


class Resume(Base):
    __tablename__ = "resume"

    id = Column(Integer, primary_key=True, index=True)
    resume_name = Column(String(255))
    resume_link = Column(String(255))
    resume_ai_response = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="resumes")

