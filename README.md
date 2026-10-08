# 🔍 Proof of Work

### AI-Powered Public Work Verification Platform

> **Don't just mark public work as completed. Prove it.**

Proof of Work is an evidence-driven platform for verifying public works
using **before/after evidence, GPS, timestamps, AI-assisted image
analysis, and citizen feedback**.

**Stack:** React.js • Spring Boot • MySQL • Python • FastAPI

------------------------------------------------------------------------

## 📌 Problem Statement

Public works such as roads, drainage systems and streetlights are often
marked as completed using submitted photos and manual verification.

A single photo or status does not always prove: - the evidence was
captured at the correct location - the evidence is recent - the claimed
work is actually completed - the evidence is suspicious or duplicated -
citizens agree with the completion claim

This makes verification difficult for authorities and reduces
transparency for citizens.

------------------------------------------------------------------------

## 🔎 Existing Solutions & Gap

Existing approaches include government portals, manual inspections,
completion reports, photographs, GIS platforms and citizen reporting.

The main gap is that these verification signals are often handled
separately.

``` text
Evidence + GPS + Timestamp + AI Analysis + Citizen Feedback
                              ↓
                    Structured Verification
```

Proof of Work combines these signals into one verification workflow.

------------------------------------------------------------------------

## 💡 Proposed Solution

Proof of Work collects **before/after images, GPS location, timestamps,
work description and citizen feedback** and uses a separate AI service
to assist with evidence analysis.

The system produces a structured result such as:

``` text
VERIFIED
FLAGGED
PENDING REVIEW
```

The platform is designed to **assist human verification**, not
completely replace physical inspection.

------------------------------------------------------------------------

## 🔄 How It Works

``` text
Register Public Work
        ↓
Upload Before Evidence
        ↓
Upload After Evidence
        ↓
GPS + Timestamp Check
        ↓
AI Image Verification
        ↓
Citizen Feedback
        ↓
Final Verification Status
```

------------------------------------------------------------------------

## ✨ Key Features

  Feature                     Purpose
  --------------------------- -------------------------------------------
  🏗️ Work Registration        Register public works and project details
  🖼️ Before/After Evidence    Show the work before and after completion
  📍 GPS Verification         Check evidence location
  🕒 Timestamp Verification   Check evidence timing
  🤖 AI Verification          Assist with image/evidence analysis
  👥 Citizen Feedback         Add another verification layer
  📊 Verification Status      Show structured results
  🔔 Notifications            Show important system events
  📈 Analytics                Show project and verification trends
  📜 Audit Logs               Track important actions

------------------------------------------------------------------------

## 🏛️ System Architecture

``` text
                 ┌──────────────────┐
                 │  React Frontend  │
                 └────────┬─────────┘
                          │ REST API
                          ▼
                 ┌──────────────────┐
                 │ Spring Boot API │
                 │  Main Backend   │
                 └───────┬──────────┘
                         │
                ┌────────┴────────┐
                ▼                 ▼
         ┌─────────────┐   ┌─────────────────┐
         │    MySQL    │   │ Python/FastAPI  │
         │  Database   │   │   AI Service    │
         └─────────────┘   └────────┬────────┘
                                    ▼
                             Image Analysis
```

------------------------------------------------------------------------

# 🎨 Frontend

Built with **React.js**.

### Responsibilities

-   Login and registration
-   Dashboard
-   Work registration
-   Evidence upload
-   GPS capture
-   Verification status
-   AI results
-   Citizen reports
-   Analytics and notifications

### Technologies

React.js • Tailwind CSS • React Router • Framer Motion • Lucide React •
Browser Geolocation API

------------------------------------------------------------------------

# ⚙️ Backend

Built with **Java 17 + Spring Boot**.

### Responsibilities

-   Authentication and user management
-   Public work management
-   REST APIs
-   Evidence handling
-   Database operations
-   GPS and timestamp data
-   AI service communication
-   Verification result storage

### Flow

``` text
React
  ↓
Spring Boot REST API
  ↓
MySQL
  ↓
FastAPI AI Service
  ↓
Verification Result
  ↓
React
```

------------------------------------------------------------------------

# 🤖 AI Verification Service

The AI service is a separate **Python/FastAPI** service.

### Inputs

-   Before image
-   After image
-   Work description
-   GPS information
-   Timestamp/metadata

### Process

``` text
Before + After Images
          ↓
    Image Analysis
          ↓
  Metadata Extraction
          ↓
 GPS + Timestamp Checks
          ↓
  Verification Logic
          ↓
    JSON Result
```

### Technologies

Python • FastAPI • Uvicorn • Pillow • AI/ML • EXIF Metadata

### API

``` http
POST /verify
```

Example:

``` json
{
  "verified": true,
  "gps_verified": true,
  "timestamp_verified": true,
  "image_verified": true
}
```

> The response fields should match the current AI-service
> implementation.

------------------------------------------------------------------------

# 📊 Dashboard Modules

``` text
Dashboard
├── Works
├── Evidence
├── Verifications
├── Citizen Reports
├── Users
├── Notifications
├── Analytics
├── AI Insights
├── Audit Logs
└── Settings
```

-   **Evidence:** before/after evidence, GPS, timestamps and upload
    details.
-   **Verifications:** pending, verified, rejected and flagged cases.
-   **Citizen Reports:** complaints, feedback and reported issues.
-   **Users:** platform users and roles.
-   **Notifications:** verification and system events.
-   **Analytics:** project counts, verification rates and trends.
-   **AI Insights:** AI results and flagged cases.
-   **Audit Logs:** important user/system actions.

------------------------------------------------------------------------

# 📊 Verification Signals

  Signal                Purpose
  --------------------- -------------------------------
  🖼️ Before Image       Initial condition
  🖼️ After Image        Condition after work
  📍 GPS                Evidence location
  🕒 Timestamp          Evidence timing
  📏 Distance           Location difference
  🤖 AI Analysis        Image verification assistance
  📝 Work Description   Project context
  👥 Citizen Feedback   Additional verification layer

------------------------------------------------------------------------

# 🔐 Security

The platform considers: - Authentication and authorization - File
validation - Secure evidence handling - GPS and timestamp protection -
API access control - Rate limiting - Audit logs - Protection against
duplicate/abusive submissions

GPS, timestamps, metadata and AI results are treated as **verification
signals**, not absolute proof.

------------------------------------------------------------------------

# 🧮 Verification Methodology

The workflow can use: - GPS distance calculation - Timestamp
consistency - EXIF metadata - Before/after image comparison - Image
quality/similarity analysis - Evidence signal aggregation - Rule-based
verification logic

Possible outcomes:

``` text
VERIFIED  |  FLAGGED  |  PENDING REVIEW
```

Suspicious or conflicting evidence can be sent for human review.

------------------------------------------------------------------------

# 🌍 Expected Impact

Proof of Work can support government departments, municipal authorities,
project administrators, infrastructure organizations and citizens.

### Benefits

-   Reduce unnecessary manual verification
-   Identify suspicious projects for review
-   Maintain a structured evidence trail
-   Improve transparency
-   Give citizens an additional verification channel
-   Support consistent project verification

------------------------------------------------------------------------

# ⚠️ Limitations

No single signal can guarantee that public work is genuine.

Possible limitations include GPS spoofing, manipulated images, missing
metadata, AI false positives/negatives, abusive reports and cases
requiring physical inspection.

Therefore, suspicious evidence should be **flagged for human review**.

------------------------------------------------------------------------

# 🔮 Future Improvements

-   Advanced image similarity detection
-   Image tampering detection
-   Improved computer-vision models
-   Public map of verified works
-   Mobile application
-   Improved citizen reporting
-   Advanced notifications and analytics
-   Government system integration

------------------------------------------------------------------------

# 🚀 Getting Started

## Frontend

``` bash
cd frontend
npm install
npm run dev
```

## Backend

Make sure **Java 17 and MySQL** are configured.

``` bash
mvn spring-boot:run
```

## AI Service

``` bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload
```

------------------------------------------------------------------------

# 📁 Project Structure

``` text
proof-of-work/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   └── pom.xml
├── ai-service/
│   ├── main.py
│   ├── requirements.txt
│   └── README.md
└── README.md
```

------------------------------------------------------------------------

# 👨‍💻 Team

  Member        Responsibility
  ------------- -----------------------------------
  **Utkarsh**   Backend & Database
  **Anjali**    Frontend & UI
  **Sujal**     AI Verification & Image Analysis
  **Sarat**     Research, Testing & Documentation

------------------------------------------------------------------------

# 🌟 Why Proof of Work?

Public projects should not only be marked **"Completed"**.

They should have **evidence**.

``` text
Evidence
   +
Location
   +
Time
   +
Image Analysis
   +
Citizen Feedback
        ↓
Transparent & Evidence-Driven Verification
```

> **Proof of Work --- Don't just mark public work as completed. Prove
> it.**

::: {align="center"}
### 🚀 React.js + Spring Boot + MySQL + Python/FastAPI
:::
