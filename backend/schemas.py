# backend/schemas.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# ── User Schemas ──────────────────────────

class UserRegister(BaseModel):
    full_name : str
    email     : str
    password  : str
    role      : str = "patient"
    pmdc      : Optional[str] = None

class UserLogin(BaseModel):
    email    : str
    password : str

class UserResponse(BaseModel):
    id        : int
    full_name : str
    email     : str
    role      : str
    created_at: datetime

    class Config:
        from_attributes = True

# ── Token Schemas ─────────────────────────

class Token(BaseModel):
    access_token : str
    token_type   : str
    user         : UserResponse

# ── Scan Schemas ──────────────────────────

class ScanResponse(BaseModel):
    id          : int
    scan_type   : str
    filename    : str
    report      : Optional[str]
    severity    : Optional[str]
    confidence  : Optional[float]
    status      : str
    created_at  : datetime

    class Config:
        from_attributes = True