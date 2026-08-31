<div align="center">

# 🔐 PROOF-OF-WORK

### AI-Powered Verification of Public Services

**From "Completed" to "Verified with Evidence."**

<p>
  <strong>Before/After Evidence</strong> •
  <strong>GPS</strong> •
  <strong>Timestamp</strong> •
  <strong>AI Verification</strong> •
  <strong>Citizen Feedback</strong>
</p>

<br>

<a href="https://github.com/utkarsh713/proof-of-work">
  <img src="https://img.shields.io/badge/GitHub-Proof--of--Work-181717?style=for-the-badge&logo=github" />
</a>
<a href="https://github.com/utkarsh713/proof-of-work">
  <img src="https://img.shields.io/github/stars/utkarsh713/proof-of-work?style=for-the-badge&color=yellow&logo=github" />
</a>
<a href="https://github.com/utkarsh713/proof-of-work">
  <img src="https://img.shields.io/github/forks/utkarsh713/proof-of-work?style=for-the-badge&color=blue&logo=github" />
</a>

<br><br>

<img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Spring%20Boot-Backend-6DB33F?style=flat-square&logo=springboot&logoColor=white" />
<img src="https://img.shields.io/badge/Java-17-ED8B00?style=flat-square&logo=openjdk&logoColor=white" />
<img src="https://img.shields.io/badge/Python-AI%20Service-3776AB?style=flat-square&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/FastAPI-AI%20API-009688?style=flat-square&logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/OpenCV-Computer%20Vision-5C3EE8?style=flat-square&logo=opencv&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white" />

<br><br>
</div>
---

# 🌍 About the Project

**Proof-of-Work** is an AI-powered civic issue resolution and public-work verification platform designed to make public service completion **evidence-driven, transparent and accountable**.

In many public infrastructure workflows, a project can be marked as **"Completed"**, while citizens may have limited ways to verify whether the work was actually completed as claimed.

Proof-of-Work addresses this gap by creating a complete evidence trail using:

- 📸 Before & After evidence
- 📍 GPS location validation
- 🕒 Timestamp validation
- 🤖 AI-assisted image verification
- 🔍 Image quality and change analysis
- ♻️ Duplicate/reuse detection
- 👥 Citizen  feedback
- 📊 Multi-signal final verification status

> **Core Principle:**  
> ### "Public work should be verified by evidence, not only by claims."

---

# 🚨 The Problem

Public infrastructure projects such as roads, drainage, sanitation, streetlights and other civic works need reliable verification.

### Existing challenges

- ❌ Work can be marked completed without easily accessible evidence
- ❌ Photos alone do not prove where or when they were captured
- ❌ Reused or duplicate images can create misleading evidence
- ❌ Manual verification is slow and difficult to scale
- ❌ Citizens often have limited visibility into project status
- ❌ Location and timestamp authenticity can be difficult to validate

The key question is:

> **How can a "Completed" label become an evidence-backed and transparent status?**

---

# 💡 Our Solution

Proof-of-Work creates an evidence-driven verification pipeline.

```text
        REGISTER PUBLIC WORK
                │
                ▼
        BEFORE EVIDENCE
                │
                ▼
         AFTER EVIDENCE
                │
                ▼
      GPS + TIMESTAMP CHECK
                │
                ▼
       AI IMAGE VERIFICATION
                │
                ▼
       CITIZEN FEEDBACK
                │
                ▼
         FINAL STATUS
```

The system combines multiple independent signals instead of relying on a single photo or claim.

---

# ✨ Key Features

## 🏗️ Public Work Registration

Authorities can register public works with:

- Project information
- Work description
- Registered location
- GPS coordinates
- Work-related metadata

---

## 📸 Before & After Evidence

The system captures evidence at different stages of the work.

```text
BEFORE IMAGE
     +
AFTER IMAGE
     ↓
AI CHANGE ANALYSIS
     ↓
VERIFICATION SIGNAL
```

This allows the system to evaluate whether meaningful visual changes are present.

---

## 📍 GPS Verification

The evidence location can be compared against the registered work location.

```text
Registered Work Location
          │
          ▼
Evidence GPS
          │
          ▼
Distance Calculation
          │
          ▼
GPS PASS / FAIL
```

This adds a geographic verification layer to the evidence.

---

## 🕒 Timestamp Verification

The system validates evidence timestamps and their ordering.

For example:

```text
BEFORE timestamp
       ↓
AFTER timestamp
```

If the evidence order is inconsistent, the system can flag the verification.

---

## 🤖 AI-Assisted Verification

The AI service performs explainable verification checks including:

- 🖼️ Image quality/readability
- 🔄 Before-vs-after change analysis
- ♻️ Basic duplicate/reuse checks
- 🚨 Issue detection
- 📊 Verification scoring
- 📝 Possible issue identification
- 💡 Recommendation

The AI layer works together with explicit metadata checks rather than replacing them.

---

# 🧠 AI Verification Pipeline

```text
              IMAGE EVIDENCE
                    │
                    ▼
              ┌───────────┐
              │  QUALITY  │
              └─────┬─────┘
                    │
                    ▼
          ┌──────────────────┐
          │ BEFORE vs AFTER  │
          │ CHANGE ANALYSIS  │
          └────────┬─────────┘
                   │
                   ▼
          ┌──────────────────┐
          │ ISSUE DETECTION  │
          └────────┬─────────┘
                   │
                   ▼
             AI SCORE
                   │
                   ▼
        ┌─────────────────────┐
        │ GPS + TIMESTAMP     │
        │ METADATA CHECKS     │
        └──────────┬──────────┘
                   │
                   ▼
            FINAL SIGNALS
```

The AI service produces:

- Score
- Passed checks
- Failed checks
- Possible issues
- Recommendation

:contentReference[oaicite:2]{index=2}

---

# 👥 User Roles

Proof-of-Work supports three major roles.

### 👨‍💼 Admin

- Manage users
- View and manage works
- Monitor system activity
- Access analytics and oversight

### 🏛️ Authority

- Register public works
- Upload evidence
- Track verification
- Respond to citizen reports


:contentReference[oaicite:3]{index=3}

---

# 🔄 End-to-End Workflow

```text
┌──────────────────────┐
│   Register Work      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Upload BEFORE       │
│     Evidence         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Work Completed      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Upload AFTER        │
│     Evidence         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ GPS + Timestamp      │
│     Validation       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│   AI Verification    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Citizen Feedback     │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    Final Status      │
└──────────────────────┘
```

---

# 📊 Verification Decision

Multiple signals contribute to the final status.

| Verification Signal | Possible Result |
|---|---|
| 📍 GPS | PASS / FAIL |
| 🕒 Timestamp | PASS / FAIL |
| 🖼️ Image Change | PASS / REVIEW |
| 🔍 Image Quality | PASS / LOW |
| 👥 Citizen Feedback | SUPPORT / ISSUE |
| 🤖 AI Analysis | Score / Issues |
| ✅ Final Status | VERIFIED / NEEDS REVIEW / REJECTED |

The system is designed around **multi-signal verification**, rather than depending only on AI.

---

# 🏛️ System Architecture

```text
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │ Forms • Dashboard   │
                    │ Maps • Results      │
                    └──────────┬──────────┘
                               │
                          REST / JSON
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Spring Boot API   │
                    │ Java 17 • REST APIs │
                    │ Business Logic      │
                    └───────┬───────┬─────┘
                            │       │
                            │       │
                            ▼       ▼
                 ┌──────────────┐  ┌──────────────────┐
                 │ PostgreSQL   │  │  Python FastAPI  │
                 │              │  │   AI Service     │
                 │ Users        │  │                  │
                 │ Works        │  │ OpenCV           │
                 │ Evidence     │  │ Image Analysis   │
                 │ Reports      │  │ Scoring          │
                 └──────────────┘  └──────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ Evidence / File │
                   │ Storage Layer   │
                   └─────────────────┘
```

:contentReference[oaicite:4]{index=4}

---

# 🛠️ Technology Stack

### Frontend

- ⚛️ React.js
- Dashboard UI
- Forms
- Maps
- Verification results

### Backend

- ☕ Java 17
- 🌱 Spring Boot
- REST APIs
- Business logic
- API integration

### AI Service

- 🐍 Python
- ⚡ FastAPI
- 👁️ OpenCV
- Image verification
- Scoring and issue detection

### Database

- 🐘 PostgreSQL
- Users
- Works
- Evidence
- Reports

### Integration

- 🔗 REST
- 📦 JSON
- 🗺️ Google Maps API
- GitHub

:contentReference[oaicite:5]{index=5}

---

# 🗂️ Project Structure

```text
proof-of-work/
│
├── frontend/
│   └── React application
│
├── backend/
│   └── Spring Boot application
│
├── ai-service/
│   └── Python + FastAPI + OpenCV
│
├── docs/
│   └── Documentation
│
├── ppt/
│   └── Project presentations
│
├── demo-data/
│   ├── road-before.jpg
│   ├── road-after.jpg
│   ├── park-before.jpg
│   ├── park-after.jpg
│   ├── fake-same-image.jpg
│   └── blurry-image.jpg
│
└── README.md
```

---

# 🖥️ Frontend User Journey

```text
Login
  ↓
Dashboard
  ↓
Register Work
  ↓
Upload Before
  ↓
Upload After
  ↓
View Verification Result
  ↓
Authorities Check
```

The intended demo flow keeps the judge experience simple and end-to-end.

:contentReference[oaicite:6]{index=6}

---

# 🧪 Verification Test Cases

The system should handle different evidence scenarios.

### ✅ Genuine Work

```text
Before Image       ✓
After Image        ✓
GPS                ✓
Timestamp          ✓

             ↓

          VERIFIED
```

### ♻️ Reused Image

```text
Before ≈ After

       ↓

REVIEW / REJECT
```

### 📍 Wrong GPS

```text
Work Location
      ≠
Evidence Location

       ↓

GPS FAILED
```

### 🕒 Wrong Timestamp

```text
After Timestamp
      <
Before Timestamp

       ↓

TIME FAILED
```

### 🖼️ Poor Image

```text
Unreadable / Blurry Evidence

          ↓

      LOW QUALITY
```

### ❌ Missing Metadata

```text
GPS / Time unavailable

          ↓

INSUFFICIENT METADATA
```

:contentReference[oaicite:7]{index=7}

---

# 🔐 Security & Reliability

The project follows important MVP security and reliability practices.

### Security

- Role-based access
- Backend input validation
- Environment variables for secrets
- API keys and passwords excluded from Git
- Restricted modification endpoints
- JWT authentication where enabled

### Reliability

- Stable API contracts
- Consistent error responses
- Missing-metadata handling
- Failure logging
- End-to-end testing
- Backup demo dataset

:contentReference[oaicite:8]{index=8}

---

# 🌱 Real-World Applications

Proof-of-Work can support verification of:

- 🛣️ Road construction
- 🚰 Drainage and water infrastructure
- 💡 Streetlights
- 🧹 Sanitation work
- 🌳 Parks and public spaces
- 🏗️ Public construction
- 🏫 Public infrastructure

The platform is intended to support official decision-making and transparency, not replace statutory inspection or approval. :contentReference[oaicite:9]{index=9}

---

# 📈 Impact

## 🏛️ Authorities

- Faster verification
- Structured evidence
- Audit trail
- Anomaly visibility
- Centralized records

## 👷 Contractors

- Clear evidence requirements
- Fewer disputes
- Verified track record

## 🌍 Society

- Transparency
- Accountability
- Evidence-based governance

:contentReference[oaicite:10]{index=10}

---

# 🚀 Future Scope

The platform can be extended with:

- 🤖 Advanced tampering detection
- 🧠 More robust duplicate detection
- 🗺️ Public map of verified works
- 📱 Mobile field-evidence capture
- 🔔 Notifications
- 🌐 Advanced geospatial validation
- 🏛️ Government system integrations
- 🔗 Evidence-integrity / blockchain audit trail where justified
- 📊 Large-scale analytics
- 🚨 Advanced anomaly detection

:contentReference[oaicite:11]{index=11}

---

# 💼 Future Business Opportunity

Potential models include:

```text
Government SaaS
      │
      ├── Per-Project Verification
      │
      ├── AI Verification API
      │
      └── Analytics
```

A future workflow could support milestone-based payment decisions based on verified completion evidence, subject to applicable departmental rules.

> ### NO PROOF → NO PAYMENT

:contentReference[oaicite:12]{index=12}

---

# 🌐 Deployment Architecture

For production deployment, the intended architecture is:

```text
┌─────────────────────┐
│   React Frontend    │
│      Vercel         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Spring Boot API   │
│       Cloud         │
└───────┬───────┬─────┘
        │       │
        ▼       ▼
┌────────────┐ ┌─────────────────┐
│ PostgreSQL │ │  AI Service     │
│   Cloud    │ │ Python/FastAPI  │
└────────────┘ └─────────────────┘
```

For development and demonstrations, a local environment remains useful as a backup.

---

# ⚙️ Local Development

Clone the repository:

```bash
git clone https://github.com/utkarsh713/proof-of-work.git
cd proof-of-work
```

Then run the three application layers independently:

```text
Frontend
   ↓
Backend
   ↓
AI Service
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

Open the `backend` directory in your Java IDE and run the Spring Boot application.

### AI Service

Open the `ai-service` directory and start the FastAPI application according to its project configuration.

> **Note:** Configure your environment variables and database settings before starting the complete system.

---

# 🔗 Service Integration

```text
React
  │
  │ REST API
  ▼
Spring Boot
  │
  ├──────────────► PostgreSQL
  │
  │
  └──────────────► FastAPI AI Service
                         │
                         ▼
                    OpenCV Analysis
                         │
                         ▼
                  Verification Result
```

The core integration goal is:

**Frontend ↔ Backend ↔ AI ↔ Database**

:contentReference[oaicite:13]{index=13}

---

# 🔀 Git Workflow

For collaborative development:

```text
feature branch
      ↓
    commit
      ↓
     push
      ↓
 Pull Request
      ↓
    review
      ↓
    merge
      ↓
     main
```

Recommended branches:

```text
main
frontend
backend
ai
docs
```

This keeps frontend, backend, AI and documentation work organized. :contentReference[oaicite:14]{index=14}

---

# 📚 Project Documentation

The repository contains project documentation covering:

- System architecture
- API integration
- AI verification pipeline
- Testing scenarios
- Demo workflow
- Presentation material
- Development structure

---

# ⭐ Why Proof-of-Work?

Traditional approach:

```text
"Work Completed"
```

Proof-of-Work approach:

```text
Work
 ↓
Evidence
 ↓
Metadata
 ↓
AI Verification
 ↓
Citizen Verification
 ↓
Final Status
```

### The difference is simple:

> **Don't just claim that the work is completed. Prove it.**

---

# 📊 Project Vision

<div align="center">

### REGISTER → PROVE → VERIFY → DECIDE

📋 **REGISTER**  
Public Work

⬇️

📸 **PROVE**  
Before / After + GPS + Time

⬇️

🤖 **VERIFY**  
AI + Metadata + Citizen

⬇️

✅ **DECIDE**  
Final Status

<br>

### From "Completed" to "Verified with Evidence."

</div>

---

# 🤝 Contributing

Contributions, suggestions and improvements are welcome.

```bash
git checkout -b feature/your-feature
git add .
git commit -m "Add your feature"
git push origin feature/your-feature
```

Then open a Pull Request.

---

# 📜 License

This project was created as a hackathon project by **Team ProofForge**.

---

<div align="center">

## ⭐ ProofForge

### Evidence → Verification → Citizen Trust

**Built with ❤️ by Team ProofForge ☣️**

<br>

<a href="https://github.com/utkarsh713">
  <img src="https://komarev.com/ghpvc/?username=utkarsh713&label=PROFILE+VIEWS&color=00ff99&style=for-the-badge" />
</a>

<br><br>

<a href="https://github.com/utkarsh713/proof-of-work">
  ⭐ View Repository
</a>

</div>
