<div align="center">

# 🔍 Proof of Work

### 🏗️ AI-Powered Public Work Verification Platform

**Verify public works with evidence, location, timestamps, AI analysis, and citizen feedback.**

<p>
  <img src="https://img.shields.io/badge/React.js-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React.js">
  <img src="https://img.shields.io/badge/Spring%20Boot-Backend-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
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

> Replace `YOUR_LIVE_WEBSITE_LINK` with your actual deployed website URL.

---

# 📌 About The Project

**Proof of Work** is a platform designed to verify public works using **before/after images, GPS location, timestamps, AI-based image verification, and citizen feedback**.

The main idea is simple:

> Instead of only marking a public work as completed, the system collects evidence and uses multiple verification signals to determine whether the submitted work can be trusted.

The platform combines a **React.js frontend**, **Spring Boot backend**, **PostgreSQL database**, and a separate **Python/FastAPI AI verification service**.

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
| 🗄️ PostgreSQL | Store users, works and verification information |

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
│ PostgreSQL   │ │ AI Verification  │
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
- PostgreSQL
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
PostgreSQL
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
              │  PostgreSQL  │        │ AI Verification │
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

Make sure **Java 17** and **PostgreSQL** are configured.

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
| **Database** | PostgreSQL |
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

# 📌 Repository

<div align="center">

<a href="https://github.com/utkarsh713/proof-of-work">
  <img src="https://img.shields.io/badge/GitHub-Proof%20of%20Work-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository">
</a>

</div>

---

<div align="center">

### 🚀 Built with React.js + Spring Boot + PostgreSQL + Python

**Proof of Work — Evidence-driven verification for public works.**

</div>
