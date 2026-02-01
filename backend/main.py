from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import models, schemas, database, ai_service

# Create DB tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Iron Lady Automation API")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
get_db = database.get_db

@app.get("/")
def read_root():
    return {"message": "Iron Lady Internal API is running"}

# --- Programs ---

@app.post("/programs/", response_model=schemas.Program)
def create_program(program: schemas.ProgramCreate, db: Session = Depends(get_db)):
    db_program = models.Program(**program.dict())
    db.add(db_program)
    db.commit()
    db.refresh(db_program)
    return db_program

@app.get("/programs/", response_model=List[schemas.Program])
def read_programs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    programs = db.query(models.Program).offset(skip).limit(limit).all()
    return programs

@app.get("/programs/{program_id}", response_model=schemas.Program)
def read_program(program_id: int, db: Session = Depends(get_db)):
    program = db.query(models.Program).filter(models.Program.id == program_id).first()
    if program is None:
        raise HTTPException(status_code=404, detail="Program not found")
    return program

@app.delete("/programs/{program_id}")
def delete_program(program_id: int, db: Session = Depends(get_db)):
    program = db.query(models.Program).filter(models.Program.id == program_id).first()
    if program is None:
        raise HTTPException(status_code=404, detail="Program not found")
    db.delete(program)
    db.commit()
    return {"ok": True}

# --- Applications ---

@app.post("/applications/", response_model=schemas.Application)
def create_application(application: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    # 1. Create App object
    app_data = application.dict()
    db_application = models.Application(**app_data)
    
    # 2. Generate AI Summary
    summary = ai_service.generate_application_summary(app_data)
    db_application.ai_summary = summary
    
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

@app.get("/applications/", response_model=List[schemas.Application])
def read_applications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    applications = db.query(models.Application).offset(skip).limit(limit).all()
    return applications

@app.get("/programs/{program_id}/applications", response_model=List[schemas.Application])
def read_program_applications(program_id: int, db: Session = Depends(get_db)):
    applications = db.query(models.Application).filter(models.Application.program_id == program_id).all()
    return applications

@app.put("/applications/{application_id}/status", response_model=schemas.Application)
def update_application_status(application_id: int, status_update: schemas.ApplicationUpdateStatus, db: Session = Depends(get_db)):
    application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    application.status = status_update.status
    db.commit()
    db.refresh(application)
    return application

@app.put("/applications/{application_id}", response_model=schemas.Application)
def update_application_details(application_id: int, app_update: schemas.ApplicationUpdate, db: Session = Depends(get_db)):
    application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Update fields if provided
    update_data = app_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(application, key, value)
    
    db.commit()
    db.refresh(application)
    return application

@app.delete("/applications/{application_id}")
def delete_application(application_id: int, db: Session = Depends(get_db)):
    application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(application)
    db.commit()
    return {"ok": True}
