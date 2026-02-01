from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Program(Base):
    __tablename__ = "programs"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    applications = relationship("Application", back_populates="program")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    applicant_name = Column(String, index=True)
    email = Column(String)
    role = Column(String)  # Student/Professional
    career_stage = Column(String)
    goal = Column(Text)
    challenge = Column(Text)
    
    status = Column(String, default="Pending") # Pending, Approved, Rejected
    ai_summary = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    
    program_id = Column(Integer, ForeignKey("programs.id"))
    program = relationship("Program", back_populates="applications")
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
