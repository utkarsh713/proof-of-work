<div align="center">

# 🔍 Proof of Work

### 🏗️ AI-Powered Public Work Verification Platform

**Verify public works with evidence, location, timestamps, AI analysis, and citizen feedback.**

<p>
  <img src="https://img.shields.io/badge/React.js-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React.js">
  <img src="https://img.shields.io/badge/Spring%20Boot-Backend-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/MySQL-Database-4169E1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Python-AI%20Service-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/FastAPI-AI%20API-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
</p>

<p>
  📍 GPS Verification &nbsp; • &nbsp;
  🕒 Timestamp Verification &nbsp; • &nbsp;
  🖼️ Image Analysis &nbsp; • &nbsp;
  🤖 AI Verification &nbsp; • &nbsp;
  👥 Citizen Feedback
</p>

</div>

---

## 🌐 Live Demo

<div align="center">

### 🚧 Proof of Work

**AI-powered verification for transparent and accountable public works.**

<a href="YOUR_LIVE_WEBSITE_LINK">
  <img src="https://img.shields.io/badge/🚀%20Live%20Demo-Visit%20Website-00C853?style=for-the-badge" alt="Live Demo">
</a>

</div>

---

# 📌 Problem Statement

Public works such as roads, drainage systems, streetlights and other infrastructure are often marked as completed using submitted photos and manual verification.

A single photo or project status does not always prove:

- whether the evidence was captured at the actual project location
- whether the evidence is recent
- whether the claimed work is actually completed
- whether the submitted evidence is duplicated or suspicious
- whether citizens agree that the work was actually completed

This makes verification difficult for authorities and reduces transparency for citizens.

---

# 🔎 Existing Solutions & Identified Gap

Existing approaches include government project portals, manual field inspections, project completion reports, photographic evidence, GIS/mapping platforms and citizen reporting systems.

These approaches can provide useful information, but the verification signals are often handled separately.

### The Gap

A unified workflow is needed that combines multiple signals instead of depending on one photograph or one project status.

<div align="center">

```text
Evidence
   +
GPS
   +
Timestamp
   +
Image Analysis
   +
Citizen Feedback
   ↓
Structured Verification
```

</div>

---

# 💡 Proposed Solution

**Proof of Work** is an evidence-driven public work verification platform.

It collects **before/after images, GPS location, timestamps, work description and citizen feedback** and combines these signals with AI-assisted image analysis.

The platform produces a structured verification result:

<div align="center">

**✅ VERIFIED &nbsp;&nbsp; | &nbsp;&nbsp; ⚠️ FLAGGED &nbsp;&nbsp; | &nbsp;&nbsp; 🔍 PENDING REVIEW**

</div>

> The system is designed to assist human verification and identify cases that may require further review. It does not claim to completely replace physical inspection.

---

# 📌 About The Project

**Proof of Work** is designed to make public-work completion more transparent and evidence-driven.

Instead of only showing:

> **"Work Completed"**

the platform creates a verification trail using:

**Evidence + Location + Time + AI Analysis + Citizen Feedback**

The system combines:

- **React.js** for the frontend
- **Spring Boot / Java** for the main backend
- **MySQL** for structured data
- **Python / FastAPI** for the AI verification service

---

# 🔄 How It Works

<div align="center">

```text
Register Public Work
        ↓
Upload Before Evidence
        ↓
Upload After Evidence
        ↓
GPS + Timestamp Check
        ↓
AI-Assisted Verification
        ↓
Citizen Feedback
        ↓
Final Verification Status
```

</div>

---

# ✨ Key Features

| Feature | Description |
|---|---|
| 🏗️ **Work Registration** | Register public works with project details and location |
| 🖼️ **Before/After Evidence** | Upload evidence showing the work before and after completion |
| 📍 **GPS Verification** | Compare evidence location with the registered work location |
| 🕒 **Timestamp Verification** | Check evidence timing and chronological order |
| 🤖 **AI Verification** | Assist with image and evidence analysis |
| 👥 **Citizen Feedback** | Add another verification layer through public feedback |
| 📊 **Verification Status** | Display structured verification results |
| 🔔 **Notifications** | Show important verification and system events |
| 📈 **Analytics** | Track project and verification statistics |
| 📜 **Audit Logs** | Maintain a record of important system actions |
| 🔗 **REST APIs** | Connect frontend, backend and AI service |

---

# 🧩 Main Parts of the Project

The platform is divided into three major technical components.

<div align="center">

```text
┌─────────────────────────────┐
│       React Frontend        │
│        User Interface       │
└──────────────┬──────────────┘
               │
               │ REST API
               ↓
┌─────────────────────────────┐
│      Spring Boot Backend    │
│      Business Logic + API   │
└──────────────┬──────────────┘
               │
        ┌──────┴──────┐
        ↓             ↓
┌──────────────┐ ┌──────────────────┐
│    MySQL     │ │ AI Verification  │
│   Database   │ │ Python + FastAPI │
└──────────────┘ └────────┬─────────┘
                          ↓
                   Image Analysis
```

</div>

---

# 🎨 Frontend

The frontend is built using **React.js** and provides the user interface for interacting with the platform.

## 🛠️ Technologies

- React.js
- Tailwind CSS
- React Router
- Framer Motion
- Lucide React
- Browser Geolocation API

## 📋 Responsibilities

- User login and registration
- Dashboard
- Public work registration
- Before/after evidence upload
- GPS location capture
- Verification progress
- AI verification results
- Work status
- Citizen reports
- Analytics and reports
- Notifications

## 🔄 Frontend Flow

<div align="center">

```text
User
 ↓
React UI
 ↓
Register Work
 ↓
Upload Evidence
 ↓
Get GPS Location
 ↓
Send Data to Backend
 ↓
Display Verification Result
```

</div>

---

# ⚙️ Backend

The main backend handles application logic and communication between the frontend, database and AI verification service.

Built using **Java 17 + Spring Boot**.

## 🛠️ Technologies

- Java 17
- Spring Boot
- REST API
- MySQL
- Maven

## 📋 Responsibilities

- User management
- Authentication
- Public work management
- REST APIs
- Project information storage
- Evidence handling
- Database operations
- GPS and timestamp data handling
- Communication with AI verification service
- Verification result storage
- Sending results to the frontend

## 🔄 Backend Flow

<div align="center">

```text
React Frontend
      ↓
Spring Boot REST API
      ↓
MySQL Database
      ↓
AI Verification Service
      ↓
Verification Result
      ↓
Frontend
```

</div>

---

# 🤖 AI Verification Service

The **AI Verification Service** is a separate Python service used to analyze evidence submitted for a public work.

## 📥 Main Inputs

- Before image
- After image
- Image metadata
- GPS information
- Timestamp information
- Work description

## 🛠️ Technologies

- Python
- FastAPI
- Uvicorn
- Pillow
- AI/ML
- EXIF Metadata

---

# 🔍 What Does The AI Service Check?

## 1️⃣ Before & After Images

The service receives images submitted before and after the work.

<div align="center">

```text
Before Image
      +
After Image
      ↓
Image Analysis
      ↓
Verification Result
```

</div>

This helps identify whether there is a visible change between the two stages.

---

## 2️⃣ Image Metadata

Available metadata can provide:

- GPS coordinates
- Timestamp
- EXIF information

---

## 3️⃣ 📍 GPS Verification

The evidence location is compared with the registered location of the public work.

<div align="center">

```text
Registered Location
        ↓
Evidence GPS
        ↓
Distance Calculation
        ↓
GPS Verification
```

</div>

---

## 4️⃣ 🕒 Timestamp Verification

Available timestamps are checked to verify the expected chronological order.

<div align="center">

```text
Before Timestamp
        ↓
After Timestamp
        ↓
Timestamp Check
```

</div>

---

## 5️⃣ 📝 Work Description

The work description provides additional context for the verification process.

Example:

<div align="center">

```text
Road repair near the community park
              +
         Before Image
              +
          After Image
              +
             GPS
              +
          Timestamp
              ↓
        AI Verification
```

</div>

---

# 🧠 AI Verification Flow

<div align="center">

```text
                       Evidence
                          ↓
                ┌─────────┴─────────┐
                ↓                   ↓
          Before Image        After Image
                │                   │
                └─────────┬─────────┘
                          ↓
                   Image Analysis
                          ↓
                 Metadata Extraction
                          ↓
                ┌─────────┼─────────┐
                ↓         ↓         ↓
               GPS    Timestamp   Image Data
                │         │         │
                └─────────┼─────────┘
                          ↓
                  Distance Calculation
                          ↓
                   Work Description
                          ↓
                    AI Verification
                          ↓
                     JSON Response
```

</div>

---

# 🔌 AI Service API

The AI service provides a REST API using **FastAPI**.

### Endpoint

```http
POST /verify
```

### Request Can Contain

- Before image
- After image
- Work description
- Registered latitude
- Registered longitude

### Example Response

```json
{
  "verified": true,
  "gps_verified": true,
  "timestamp_verified": true,
  "image_verified": true
}
```

> Keep the example response aligned with the actual response returned by your current AI service.

---

# 🗂️ AI Service Structure

```text
ai-service/
│
├── main.py
├── requirements.txt
├── .gitignore
└── README.md
```

### `main.py`

Contains the FastAPI application and verification logic.

### `requirements.txt`

Contains the Python packages required by the AI service.

---

# 📊 Dashboard Modules

The main dashboard contains separate modules for different responsibilities.

```text
Dashboard
├── 🏗️ Works
├── 🖼️ Evidence
├── ✅ Verifications
├── 👥 Citizen Reports
├── 👤 Users
├── 🔔 Notifications
├── 📈 Analytics
├── 🤖 AI Insights
├── 📜 Audit Logs
└── ⚙️ Settings
```

### 🏗️ Works
Manage registered public works, project details, locations and statuses.

### 🖼️ Evidence
View before/after evidence, GPS, timestamps, upload details and evidence status.

### ✅ Verifications
Review pending, verified, rejected or flagged verification cases.

### 👥 Citizen Reports
Manage citizen complaints, feedback and reported public-work issues.

### 👤 Users
Manage platform users, roles and account status.

### 🔔 Notifications
Display important events such as evidence uploads, verification completion and citizen reports.

### 📈 Analytics
Show project counts, verification rates, issues and project trends.

### 🤖 AI Insights
Display AI analysis results, verification scores and flagged cases.

### 📜 Audit Logs
Record important actions performed by users and the system.

### ⚙️ Settings
Manage account and platform preferences according to user permissions.

---

# 📊 Verification Signals

| Signal | Purpose |
|---|---|
| 🖼️ **Before Image** | Shows the initial condition |
| 🖼️ **After Image** | Shows the condition after work |
| 📍 **GPS** | Checks the evidence location |
| 🕒 **Timestamp** | Checks evidence timing |
| 📏 **Distance** | Calculates location difference |
| 🤖 **AI Analysis** | Helps analyze submitted images |
| 📝 **Work Description** | Provides verification context |
| 👥 **Citizen Feedback** | Adds another verification layer |

---

# 🔐 Security Considerations

The platform should protect evidence, user information and verification records.

Key considerations include:

- Authentication and authorization
- Validation of uploaded files
- Secure evidence handling
- Protection of GPS and timestamp information
- API authentication and access control
- Rate limiting
- Prevention of unauthorized modification
- Audit logs
- Protection against duplicate or abusive submissions

> GPS, timestamps, metadata and AI results are verification signals, not absolute proof.

---

# 🧮 Algorithms & Methodologies

The verification workflow can use:

- GPS distance calculation
- Timestamp ordering and consistency checks
- EXIF metadata extraction
- Before/after image comparison
- Image quality and similarity analysis
- Evidence signal aggregation
- Rule-based verification logic

Possible outcomes:

<div align="center">

### ✅ VERIFIED &nbsp;&nbsp; | &nbsp;&nbsp; ⚠️ FLAGGED &nbsp;&nbsp; | &nbsp;&nbsp; 🔍 PENDING REVIEW

</div>

Suspicious or conflicting evidence can be sent for human review.

---

# 🏗️ Infrastructure Requirements

A practical deployment can include:

- Web browser
- React.js frontend
- Spring Boot backend server
- MySQL database
- Python/FastAPI AI service
- File storage for evidence images
- HTTPS-enabled API communication
- Server or cloud infrastructure

The AI verification service is kept separate so image-processing workloads can be developed and scaled independently from the main application backend.

---

# 🏛️ Overall Architecture

<div align="center">

```text
                         ┌──────────────────┐
                         │  React Frontend  │
                         └────────┬─────────┘
                                  │
                               REST API
                                  │
                                  ▼
                         ┌──────────────────┐
                         │ Spring Boot API  │
                         └────────┬─────────┘
                                  │
                     ┌────────────┴────────────┐
                     ↓                         ↓
              ┌──────────────┐        ┌─────────────────┐
              │    MySQL     │        │ AI Verification │
              │   Database   │        │ Python/FastAPI  │
              └──────────────┘        └────────┬────────┘
                                               ↓
                                        Image Analysis
```

</div>

---

# 📈 Expected Impact

Proof of Work can benefit:

- Government departments
- Municipal authorities
- Project administrators
- Infrastructure organizations
- Citizens

### Key Benefits

- Reduce unnecessary manual verification
- Prioritize suspicious projects for inspection
- Create a structured evidence trail
- Improve public-work transparency
- Give citizens an additional verification channel
- Support more consistent project verification

> The system is intended to assist human verification, not completely replace field inspection.

---

# ⚙️ Feasibility

The platform uses established technologies:

- React.js for the web interface
- Spring Boot and Java for backend services
- MySQL for structured data
- Python and FastAPI for AI verification
- Image-processing and metadata techniques for evidence analysis

The modular architecture allows the frontend, backend, database and AI service to be developed and scaled independently.

The solution can start as an MVP and later be extended with stronger computer-vision models, improved security and larger-scale deployment.

---

# ⚠️ Limitations

Proof of Work does not claim that AI or any individual signal can guarantee that a public work is genuine.

Potential limitations include:

- GPS data can potentially be manipulated or spoofed
- Images can potentially be edited or manipulated
- EXIF metadata may be missing or modified
- AI/image analysis may produce false positives or false negatives
- Citizen feedback can be subject to abuse
- Some cases may still require physical inspection
- Different public works may require different verification rules

Therefore, conflicting or suspicious evidence should be **flagged for human review** instead of being automatically treated as verified.

---

# 🔮 Future Improvements

- 🔬 Better image similarity detection
- 🛡️ Image tampering detection
- 🧠 Advanced computer-vision models
- 🗺️ Public map for verified works
- 📱 Mobile application
- 👥 Improved citizen reporting
- 🔔 Advanced notification system
- 📊 Detailed analytics
- 🏛️ Government system integration

---

# 🚀 Getting Started

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Backend

Make sure **Java 17** and **MySQL** are configured.

```bash
mvn spring-boot:run
```

---

## AI Service

```bash
cd ai-service

pip install -r requirements.txt

uvicorn main:app --reload
```

---

# 📁 Project Structure

```text
proof-of-work/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── ai-service/
│   ├── main.py
│   ├── requirements.txt
│   ├── .gitignore
│   └── README.md
│
└── README.md
```

---

# 👨‍💻 Team

| Member | Responsibility |
|---|---|
| **Utkarsh** | Backend & Database |
| **Anjali** | Frontend & UI |
| **Sujal** | AI Verification & Image Analysis |
| **Sarat** | Research, Testing & Documentation |

---

# 🛠️ Tech Stack

<div align="center">

| Layer | Technologies |
|---|---|
| **Frontend** | React.js, Tailwind CSS, React Router, Framer Motion |
| **Backend** | Java 17, Spring Boot, REST API, Maven |
| **Database** | MySQL |
| **AI Service** | Python, FastAPI, Uvicorn, Pillow |
| **Verification** | AI/ML, Image Analysis, EXIF, GPS, Timestamp |
| **Tools** | Git, GitHub, Postman, VS Code |

</div>

---

# 🌟 Why Proof of Work?

Public projects should not only be marked as **"Completed"**.

They should have **evidence**.

<div align="center">

```text
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
More Transparent Verification
```

</div>

---

<div align="center">

### 🚀 Built with React.js + Spring Boot + MySQL + Python

**Proof of Work — Evidence-driven verification for public works.**

</div>
