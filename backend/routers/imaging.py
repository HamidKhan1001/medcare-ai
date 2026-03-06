# backend/routers/imaging.py
from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from sqlalchemy.orm import Session
import logging
import time
import cv2
import numpy as np
from PIL import Image
import io

from database import get_db
import db_models as models
import auth
from utils.medical_utils import (
    analyze_image as analyze_medical_image,
    translate_to_urdu,
    XRAY_PROMPT,
    ECG_PROMPT,
    BLOOD_TEST_PROMPT,
    BONE_PROMPT,
    SKIN_PROMPT,
)

logger = logging.getLogger(__name__)
router = APIRouter(
    prefix="/api/v1/analyze",
    tags=["Medical Imaging"]
)

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/bmp", "image/avif", "image/tiff"}
SCAN_PROMPTS = {
    "xray":       XRAY_PROMPT,
    "ecg":        ECG_PROMPT,
    "blood-test": BLOOD_TEST_PROMPT,
    "bone":       BONE_PROMPT,
    "skin":       SKIN_PROMPT,
}

async def analyze_scan(
    scan_type: str,
    file: UploadFile,
    db: Session,
    current_user = None
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: JPEG, PNG, WEBP, BMP"
        )

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty file")

    start_time = time.time()

    try:
        prompt = SCAN_PROMPTS[scan_type]
        report, severity, confidence = analyze_medical_image(
            contents, prompt
        )
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    time_taken = round(time.time() - start_time, 1)

    urdu_report = translate_to_urdu(report)

    # Database mein save karo
    if current_user:
        try:
            scan = models.Scan(
                user_id      = current_user.id,
                scan_type    = scan_type,
                filename     = file.filename,
                report       = report,
                severity     = severity,
                confidence   = confidence,
                time_seconds = time_taken,
                status       = "pending"
            )
            db.add(scan)
            db.commit()
            db.refresh(scan)
            logger.info(f"Scan saved: ID {scan.id}")
        except Exception as e:
            logger.error(f"DB save error: {e}")

    return {
        "success"     : True,
        "scan_type"   : scan_type,
        "filename"    : file.filename,
        "report"      : report,
        "report_urdu" : urdu_report,
        "severity"    : severity,
        "confidence"  : confidence,
        "time_seconds": time_taken,
        "runs"        : 3,
    }


# Optional auth — login karo to save hoga
def get_optional_user(
    db: Session = Depends(get_db),
    token: str = ""
):
    try:
        return auth.get_current_user(token, db)
    except:
        return None


@router.post("/xray")
async def analyze_xray(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    return await analyze_scan("xray", file, db)

@router.post("/ecg")
async def analyze_ecg(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    return await analyze_scan("ecg", file, db)

@router.post("/blood-test")
async def analyze_blood_test(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    return await analyze_scan("blood-test", file, db)

@router.post("/bone")
async def analyze_bone(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    return await analyze_scan("bone", file, db)

@router.post("/skin")
async def analyze_skin(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    return await analyze_scan("skin", file, db)