from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Program, Application

SQLALCHEMY_DATABASE_URL = "sqlite:///./iron_lady.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

print("Programs:")
programs = db.query(Program).all()
for p in programs:
    print(f"ID: {p.id}, Name: {p.name}")

if not programs:
    print("No programs found! Creating default one...")
    default_program = Program(id=1, name="Iron Lady Leadership", description="Default Program")
    db.add(default_program)
    db.commit()
    print("Created Program 1.")
else:
    print("Programs exist.")

print("\nApplications:")
apps = db.query(Application).all()
for a in apps:
    print(f"ID: {a.id}, Name: {a.applicant_name}, Status: {a.status}, AI: {True if a.ai_summary else False}")
