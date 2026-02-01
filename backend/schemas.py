from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Program Schemas
class ProgramBase(BaseModel):
    name: str
    description: str

class ProgramCreate(ProgramBase):
    pass

class Program(ProgramBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

# Application Schemas
class ApplicationBase(BaseModel):
    applicant_name: str
    email: str
    role: str
    career_stage: str
    goal: str
    challenge: str
    notes: Optional[str] = None
    program_id: int

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdateStatus(BaseModel):
    status: str

class ApplicationUpdate(BaseModel):
    applicant_name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    career_stage: Optional[str] = None
    goal: Optional[str] = None
    challenge: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None

class Application(ApplicationBase):
    id: int
    status: str
    ai_summary: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True
