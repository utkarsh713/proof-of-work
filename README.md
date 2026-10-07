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

> 

---


---

# 📌 Problem Statement

Public works such as roads, drainage systems, streetlights and other infrastructure are often marked as completed based on submitted evidence and manual verification.

The problem is that a single photograph or project status does not reliably prove:

- whether the evidence was captured at the actual project location
- whether the evidence is recent
- whether the claimed work is visibly completed
- whether the submitted evidence is duplicated or suspicious
- whether citizens agree that the work was actually completed

This creates difficulties for authorities in efficiently verifying projects and makes it difficult for citizens to independently assess public work claims.

Proof of Work addresses this problem through multi-layer evidence verification.

---

# 🔎 Existing Solutions

Existing approaches can include government project portals, manual field inspections, project completion reports, photographic evidence, GIS/mapping platforms, and citizen reporting systems.

### Limitations

These approaches can provide project information or individual evidence, but they may not combine multiple verification signals into a single verification workflow.

For example:

- A project portal may show that a project is marked completed but may not independently verify the submitted evidence.
- A photograph can show the work but does not by itself prove its location or timing.
- GPS services can verify location but cannot determine whether the actual work was completed.
- Citizen reporting provides human feedback but is not sufficient as the only verification mechanism.

### Identified Gap

Our identified gap is the need for a unified verification workflow that combines:

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

---

# 💡 Proposed Solution

Proof of Work proposes an evidence-driven verification platform for public works.

The system collects before/after images and combines them with GPS location, timestamps, image analysis, work description and citizen feedback. These signals are evaluated together instead of relying on a single photograph or a single verification source.

The goal is not to completely replace human inspection. Instead, the system assists authorities by producing a structured verification result and helping identify projects that require further review.

---

# 📌 About The Project

**Proof of Work** is a platform designed to verify public works using **before/after images, GPS location, timestamps, AI-based image verification, and citizen feedback**.

The main idea is simple:

> Instead of only marking a public work as completed, the system collects evidence and uses multiple verification signals to determine whether the submitted work can be trusted.

The platform combines a **React.js frontend**, **Spring Boot backend**, **MySQL database**, and a separate **Python/FastAPI AI verification service**.

---

# 🔄 How It Works

```text
Register Work
      ↓
Upload Before Image
      ↓
Upload After Image
      ↓
GPS + Timestamp Check
      ↓
AI Verification
      ↓
Citizen Verification
      ↓
Final Status
```

---

# ✨ Key Features

| Feature | Description |
|---|---|
| 🏗️ Work Registration | Register public works with relevant details |
| 🖼️ Before/After Evidence | Upload images showing work before and after completion |
| 📍 GPS Verification | Compare evidence location with registered work location |
| 🕒 Timestamp Verification | Validate the chronological order of evidence |
| 🤖 AI Verification | Analyze submitted images and verification signals |
| 👥 Citizen Feedback | Add an additional layer of verification |
| 📊 Verification Status | Display structured verification results |
| 🔗 REST APIs | Connect frontend, backend and AI service |
| 🗄️ MySQL | Store users, works and verification information |

---

# 🧩 Main Parts of the Project

The project is divided into three major components:

```text
┌─────────────────────────────┐
│        React Frontend       │
│       User Interface        │
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
│ MySQL   │      │ AI Verification  │
│   Database   │ │ Python + FastAPI │
└──────────────┘ └────────┬─────────┘
                          ↓
                   Image Analysis
```

---

# 🎨 Frontend

The frontend is built using **React.js** and is responsible for the user interface and interaction with the platform.

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
- Before/after image upload
- GPS location capture
- Verification progress
- AI verification results
- Work status
- Verification reports

## 🔄 Frontend Flow

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

---

# ⚙️ Backend

The backend handles the main application logic and communication between the frontend, database, and AI verification service.

Built using **Java and Spring Boot**.

## 🛠️ Technologies

- Java 17
- Spring Boot
- REST API
- MySQL
- Maven

## 📋 Responsibilities

- User management
- Public work management
- REST APIs
- Project information storage
- Evidence handling
- Database operations
- GPS and timestamp data handling
- Communication with AI verification service
- Verification result storage
- Sending results to frontend

## 🔄 Backend Flow

```text
React Frontend
      ↓
Spring Boot REST API
      ↓
MySQL
      ↓
AI Verification Service
      ↓
Verification Result
      ↓
Frontend
```

---

# 🤖 AI Verification Service

The **AI Verification Service** is a separate Python service used to analyze evidence submitted for a public work.

It primarily works with:

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

The service receives the images submitted before and after the work.

```text
Before Image
      +
After Image
      ↓
Image Analysis
      ↓
Verification Result
```

This helps identify whether there is a visible change between the two stages.

---

## 2️⃣ Image Metadata

Available metadata is extracted from submitted images.

Possible information includes:

- GPS coordinates
- Timestamp
- EXIF information

---

## 3️⃣ 📍 GPS Verification

The evidence location is compared with the registered location of the public work.

```text
Registered Location
        ↓
Evidence GPS
        ↓
Distance Calculation
        ↓
GPS Verification
```

---

## 4️⃣ 🕒 Timestamp Verification

Available timestamps are checked to verify the expected chronological order.

```text
Before Timestamp
        ↓
After Timestamp
        ↓
Timestamp Check
```

---

## 5️⃣ 📝 Work Description

The work description is provided as additional context for the verification process.

Example:

```text
Work:
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

---

# 🧠 AI Verification Flow

```text
                     Evidence
                        ↓
              ┌─────────┴─────────┐
              ↓                   ↓
        Before Image          After Image
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

---

# 🔌 AI Service API

The AI service provides a REST API using **FastAPI**.

### Endpoint

```http
POST /verify
```

The request can contain:

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


---

# 🔐 Security Considerations

The platform should protect evidence, user information and verification records.

Key considerations include:

- Authentication and authorization for users and administrators
- Validation of uploaded files and supported image formats
- Secure handling of uploaded evidence
- Protection of GPS and timestamp information
- API authentication and access control
- Rate limiting for citizen feedback and public endpoints
- Prevention of unauthorized modification of verification records
- Audit logs for important verification actions
- Protection against duplicate or abusive submissions

The system should treat GPS, timestamps, metadata and AI results as verification signals rather than absolute proof.

---

# 🧮 Algorithms & Methodologies

The verification workflow can use the following methodologies:

- GPS distance calculation between registered and evidence locations
- Timestamp ordering and consistency checks
- EXIF metadata extraction
- Before/after image comparison
- Image quality and similarity analysis
- Evidence signal aggregation
- Rule-based decision logic for verification status

The decision engine can combine these signals to classify a case as **Verified, Flagged, or Pending Review**, depending on the available evidence and detected inconsistencies.

---

# 🏗️ Infrastructure Requirements

A practical deployment can include:

- Web browser for users
- React.js frontend
- Spring Boot backend server
- MySQL database
- Python/FastAPI AI verification service
- File storage for evidence images
- HTTPS-enabled API communication
- Server or cloud infrastructure for deployment

The AI verification service is kept separate so that image-processing workloads can be scaled independently from the main application backend.

---

# 🏛️ Overall Architecture

```text
                         ┌──────────────────┐
                         │  React Frontend  │
                         └────────┬─────────┘
                                  │
                              REST API
                                  │
                                  ↓
                         ┌──────────────────┐
                         │ Spring Boot API  │
                         └────────┬─────────┘
                                  │
                     ┌────────────┴────────────┐
                     ↓                         ↓
              ┌──────────────┐        ┌─────────────────┐
              │   MySQL      │        │ AI Verification │
              │   Database   │        │ Python/FastAPI  │
              └──────────────┘        └────────┬────────┘
                                               ↓
                                        Image Analysis
```

---

# 📊 Verification Signals

| Signal | Purpose |
|---|---|
| 🖼️ Before Image | Shows the initial condition |
| 🖼️ After Image | Shows the condition after work |
| 📍 GPS | Checks the evidence location |
| 🕒 Timestamp | Checks evidence timing |
| 📏 Distance | Calculates location difference |
| 🤖 AI Analysis | Helps analyze submitted images |
| 📝 Work Description | Provides verification context |
| 👥 Citizen Feedback | Adds another verification layer |

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

Then run the Spring Boot application using your preferred IDE or Maven.

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

# 👨‍💻 Team

| Member | Responsibility |
|---|---|
| **Utkarsh** | Backend & Database |
| **Anjali** | Frontend & UI |
| **Sujal** | AI Verification & Image Analysis |
| **Sarat** | Research, Testing & Documentation |

---


---

# 📈 Expected Impact

Proof of Work can benefit:

- Government departments
- Municipal authorities
- Project administrators
- Infrastructure organizations
- Citizens

The platform can help:

- Reduce unnecessary manual verification
- Prioritize suspicious projects for inspection
- Create a structured evidence trail
- Improve transparency of public works
- Give citizens an additional verification channel
- Support more consistent project verification

If successfully implemented at scale, the system could help authorities process evidence more systematically and provide citizens with greater visibility into the verification status of public works.

The system is intended to assist human verification, not completely replace field inspection.

---

# ⚙️ Feasibility

The proposed system uses established and widely used technologies:

- React.js for the web interface
- Spring Boot and Java for backend services
- MySQL for structured data storage
- Python and FastAPI for the verification service
- Image-processing and metadata techniques for evidence analysis

The modular architecture allows the frontend, backend, database and AI verification service to be developed and scaled independently.

The initial solution can be implemented as an MVP and gradually extended with stronger computer-vision models, improved security mechanisms and larger-scale deployment.

---

# ⚠️ Limitations

Proof of Work does not claim that AI or any individual signal can guarantee that a public work is genuine.

Potential limitations include:

- GPS data can potentially be manipulated or spoofed
- Images can potentially be edited or manipulated
- EXIF metadata may be missing or modified
- AI/image analysis may produce false positives or false negatives
- Citizen feedback can be subject to abuse
- Some verification cases may still require physical inspection
- Different types of public works may require different verification rules

Therefore, conflicting or suspicious evidence should be flagged for human review instead of being automatically treated as verified.

---

# 🔮 Future Improvements

- 🔬 Better image similarity detection
- 🛡️ Image tampering detection
- 🧠 More advanced computer vision models
- 🗺️ Public map for verified works
- 📱 Mobile application
- 👥 Improved citizen reporting
- 🔔 Notification system
- 📊 Detailed analytics
- 🏛️ Government system integration

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

Public projects should not only be marked as **"completed"**.

They should have **evidence**.

Proof of Work brings together:

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

---



<div align="center">

### 🚀 Built with React.js + Spring Boot + MySQL + Python

**Proof of Work — Evidence-driven verification for public works.**

</div>
