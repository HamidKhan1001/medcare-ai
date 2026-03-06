# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

from database import engine
import db_models as models
from routers import imaging
from routers.users import router as users_router

# Database tables create
models.Base.metadata.create_all(bind=engine)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="MedCare AI",
    description="Pakistan's First AI Medical Platform — Syed Hassan Tayyab",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(imaging.router)
app.include_router(users_router)

@app.on_event("startup")
async def startup():
    logger.info("🏥 MedCare AI Backend Started!")
    logger.info("📦 Database: PostgreSQL — medcare_db")
    logger.info("🚀 Docs: http://localhost:8000/docs")

@app.get("/")
def root():
    return {
        "app"      : "MedCare AI",
        "status"   : "running ✅",
        "docs"     : "/docs",
        "developer": "Syed Hassan Tayyab",
        "cohort"   : "Atomcamp 15"
    }

@app.get("/health")
def health():
    return {"status": "healthy ✅"}