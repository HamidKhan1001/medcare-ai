<div align="center">

<img src="https://img.shields.io/badge/MedCare%20AI-Pakistan's%20First%20AI%20Medical%20Platform-blue?style=for-the-badge&logo=heart&logoColor=white" />

# 🏥 MedCare AI
### Pakistan's First AI-Powered Medical Diagnosis Platform

*Revolutionizing healthcare in Pakistan through cutting-edge artificial intelligence*

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.133-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square&logo=postgresql)](https://postgresql.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python)](https://python.org/)
[![LLaVA-Med](https://img.shields.io/badge/LLaVA--Med-AI%20Model-FF6B6B?style=flat-square&logo=openai)](https://github.com/microsoft/LLaVA-Med)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Atomcamp](https://img.shields.io/badge/Atomcamp-Cohort%2015-orange?style=flat-square)](https://atomcamp.com/)

---

**🇵🇰 Built for Pakistan | 🤖 Powered by LLaVA-Med | 🏆 Atomcamp Cohort 15**

[✨ Features](#-features) • [🚀 Demo](#-live-demo) • [⚡ Quick Start](#-quick-start) • [📖 Docs](#-documentation) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 What is MedCare AI?

MedCare AI is Pakistan's **first AI-powered medical diagnosis platform** that connects patients with doctors through intelligent medical imaging analysis. Built with **LLaVA-Med** (Large Language and Vision Assistant for Medicine), it provides instant AI medical reports in both **English and Urdu**, making quality healthcare accessible across Pakistan.

> *"Bringing world-class AI diagnostics to every corner of Pakistan"* 🇵🇰

---

## ✨ Features

### 🤖 AI-Powered Medical Modules

| Module | Description | AI Model |
|--------|-------------|----------|
| 🫁 **X-Ray Analyzer** | Chest X-ray analysis with radiology reports | LLaVA-Med |
| 💓 **ECG Analyzer** | Electrocardiogram interpretation | LLaVA-Med |
| 🧪 **Blood Test Reader** | Blood report analysis & interpretation | LLaVA-Med |
| 🦴 **Bone Scan** | Orthopedic imaging analysis | LLaVA-Med |
| 🔬 **Skin Analysis** | Dermatological condition detection | LLaVA-Med |
| 🧠 **Mental Health** | AI-powered mental wellness assessment | LLaVA-Med |
| 💊 **Prescription Reader** | Medicine & prescription OCR analysis | LLaVA-Med |
| 📊 **Vital Signs** | Health metrics tracking & analysis | Rule-based |
| 🚨 **Emergency Aid** | Emergency guidance with 1122 integration | Rule-based |

### 🔐 Platform Features

- **JWT Authentication** — Secure login/register for patients & doctors
- **Role-Based Access** — Separate dashboards for patients and doctors
- **Doctor Approval Flow** — Doctors review & approve AI diagnoses
- **Scan History** — Complete medical history saved in PostgreSQL
- **PDF Reports** — Professional downloadable medical reports
- **Urdu Support** 🇵🇰 — Reports available in Urdu language
- **3-Run Majority Voting** — AI runs 3x for higher accuracy
- **Severity Assessment** — 🟢 Normal → 🚨 URGENT classification
- **Confidence Scoring** — AI confidence percentage per analysis

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     MedCare AI Stack                     │
├──────────────┬──────────────────┬───────────────────────┤
│   Frontend   │     Backend      │      AI Engine        │
│              │                  │                       │
│  React 18    │   FastAPI        │   LLaVA-Med           │
│  TypeScript  │   PostgreSQL     │   (Google Colab)      │
│  Tailwind    │   SQLAlchemy     │   ngrok Tunnel        │
│  JWT Auth    │   JWT Tokens     │   3-Run Voting        │
│              │   bcrypt         │   Severity Score      │
└──────────────┴──────────────────┴───────────────────────┘
```

```
User → React Frontend (localhost:3000)
         ↓ Auth Requests
       FastAPI Backend (localhost:8000)
         ↓ Save to DB
       PostgreSQL Database
         ↓ AI Analysis
       LLaVA-Med on Colab (ngrok URL)
         ↓ Return Report
       PDF Generation + Urdu Translation
```

---

## 🚀 Live Demo

> 🔗 **Coming Soon** — GCP Deployment in progress

**Test Credentials:**
```
Patient:  hassan@test.com / test123
Doctor:   doctor@test.com / test123
```

---

## ⚡ Quick Start

### Prerequisites

```bash
# Required
Node.js 18+
Python 3.12+
PostgreSQL 16+
Google Colab (for AI model)
```

### 1️⃣ Clone Repository

```bash
git clone https://github.com/24pwai0032-gif/medcare-ai.git
cd medcare-ai
```

### 2️⃣ Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary
pip install python-jose[cryptography] passlib[bcrypt]
pip install python-dotenv alembic python-multipart
pip install torch transformers pillow opencv-python

# Setup environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Start backend
uvicorn main:app --reload
```

### 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your API URLs

# Start frontend
npm start
```

### 4️⃣ AI Model (Google Colab)

```python
# Run in Google Colab
!pip install fastapi uvicorn pyngrok nest-asyncio transformers torch

from pyngrok import ngrok
from google.colab import userdata

ngrok.set_auth_token(userdata.get('NGROK_SECRET'))
public_url = ngrok.connect(8000)
print(f"AI URL: {public_url}")

# Then run the LLaVA-Med server
# Update REACT_APP_COLAB_URL in frontend/.env
```

### 5️⃣ Environment Variables

**`backend/.env`**
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/medcare_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_HOURS=168
```

**`frontend/.env`**
```env
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_COLAB_URL=https://your-ngrok-url.ngrok-free.dev
```

---

## 📁 Project Structure

```
medcare-ai/
├── 🔧 backend/
│   ├── main.py              # FastAPI app entry point
│   ├── database.py          # PostgreSQL connection
│   ├── db_models.py         # SQLAlchemy models (User, Scan)
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # JWT authentication
│   ├── .env                 # Environment variables
│   ├── routers/
│   │   ├── users.py         # Auth + Doctor endpoints
│   │   └── imaging.py       # Medical scan endpoints
│   ├── models/
│   │   └── llava_model.py   # LLaVA-Med integration
│   └── utils/
│       └── medical_utils.py # Medical analysis utilities
│
├── 🎨 frontend/
│   └── src/
│       ├── pages/
│       │   ├── Login.tsx           # Auth page
│       │   ├── PatientDashboard.tsx # Patient view
│       │   ├── DoctorDashboard.tsx  # Doctor view
│       │   ├── XrayAnalyzer.tsx    # X-Ray module
│       │   ├── ECGAnalyzer.tsx     # ECG module
│       │   ├── BloodTestAnalyzer.tsx
│       │   ├── BoneScan.tsx
│       │   ├── MentalHealth.tsx
│       │   ├── DiagnosisAI.tsx
│       │   ├── PrescriptionReader.tsx
│       │   ├── VitalSigns.tsx
│       │   └── EmergencyAid.tsx
│       ├── services/
│       │   └── api.ts       # API service layer
│       └── utils/
│           └── generatePDF.ts # PDF generation
│
└── 📓 notebooks/            # Colab notebooks
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/users/register` | Register new user |
| POST | `/api/v1/users/login` | Login user |
| GET | `/api/v1/users/me` | Get current user |
| GET | `/api/v1/users/scans` | Get scan history |

### Medical Analysis
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/analyze/xray` | Analyze X-Ray |
| POST | `/api/v1/analyze/ecg` | Analyze ECG |
| POST | `/api/v1/analyze/blood-test` | Analyze blood test |
| POST | `/api/v1/analyze/bone` | Analyze bone scan |
| POST | `/api/v1/analyze/skin` | Analyze skin condition |

### Doctor Portal
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/doctor/pending-scans` | Get pending scans |
| PUT | `/api/v1/users/doctor/approve-scan/{id}` | Approve scan |
| PUT | `/api/v1/users/doctor/reject-scan/{id}` | Reject scan |

---

## 🧠 AI Model Details

```
Model:      LLaVA-Med (LLaVA-v1.6-Mistral-7B)
Type:       Multimodal Vision-Language Model
Training:   Fine-tuned on medical imaging datasets
Inference:  Google Colab (T4/A100 GPU)
Accuracy:   3-run majority voting system
Languages:  English + Urdu (bilingual reports)

Severity Levels:
🟢 Normal   → No intervention needed
🟡 Mild     → Monitor & follow up
🟠 Moderate → Medical attention advised
🔴 Severe   → Immediate treatment needed
🚨 URGENT   → Emergency care required
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + TypeScript
- **Tailwind CSS** — Styling
- **jsPDF** — PDF generation
- **React Hooks** — State management

### Backend
- **FastAPI** — REST API framework
- **SQLAlchemy** — ORM
- **PostgreSQL** — Database
- **JWT** — Authentication
- **bcrypt** — Password hashing
- **Pydantic** — Data validation

### AI/ML
- **LLaVA-Med** — Medical vision-language model
- **PyTorch** — Deep learning framework
- **Transformers** — HuggingFace library
- **Google Colab** — GPU inference
- **ngrok** — Tunnel to local model

### DevOps
- **GitHub** — Version control
- **Docker** — Containerization (coming)
- **GCP Cloud Run** — Deployment (coming)

---

## 📊 Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    full_name   VARCHAR NOT NULL,
    email       VARCHAR UNIQUE NOT NULL,
    password    VARCHAR NOT NULL,  -- bcrypt hashed
    role        VARCHAR DEFAULT 'patient',  -- patient/doctor
    pmdc        VARCHAR,  -- Doctor's PMDC number
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- Scans Table
CREATE TABLE scans (
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER REFERENCES users(id),
    scan_type    VARCHAR NOT NULL,
    filename     VARCHAR,
    report       TEXT,
    severity     VARCHAR,
    confidence   INTEGER,
    time_seconds FLOAT,
    status       VARCHAR DEFAULT 'pending',  -- pending/approved/rejected
    created_at   TIMESTAMP DEFAULT NOW()
);
```

---

## 🔮 Roadmap

- [x] 9 Medical Analysis Modules
- [x] JWT Authentication
- [x] PostgreSQL Database
- [x] Real AI (LLaVA-Med)
- [x] PDF Report Generation
- [x] Doctor Approval Flow
- [x] Urdu Language Support
- [x] Scan History
- [ ] GCP Cloud Deployment
- [ ] Custom Domain (medcareai.me)
- [ ] LLaVA-Med Fine-tuning on Pakistani data
- [ ] Mobile App (React Native)
- [ ] Email Notifications
- [ ] WhatsApp Integration 🇵🇰
- [ ] PMDC Doctor Verification
- [ ] Telemedicine Video Calls

---

## 👨‍💻 Developer

<div align="center">

**Syed Hassan Tayyab**

*AI Engineer | Full Stack Developer | Pakistan 🇵🇰*

[![GitHub](https://img.shields.io/badge/GitHub-24pwai0032--gif-181717?style=flat-square&logo=github)](https://github.com/24pwai0032-gif)
[![Atomcamp](https://img.shields.io/badge/Atomcamp-Cohort%2015-orange?style=flat-square)](https://atomcamp.com/)

*Built with ❤️ for Pakistan's healthcare system*

</div>

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- **Atomcamp** — For the amazing AI bootcamp program
- **Microsoft** — For LLaVA-Med model
- **HuggingFace** — For Transformers library
- **FastAPI** — For the incredible web framework
- **The people of Pakistan** — This is for you 🇵🇰

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

*MedCare AI — Bringing AI Healthcare to Pakistan* 🏥🇵🇰🤖

</div>
