<div align="center">

# 🛡️ Suraksha Grid — सुरक्षा ग्रिड

### India's First Portable Social Security Platform for the Unorganized Sector

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Go](https://img.shields.io/badge/Go-Gin-00ADD8?style=flat-square&logo=go&logoColor=white)](https://gin-gonic.com/)
[![MySQL](https://img.shields.io/badge/MySQL-3×_Instances-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**Helping 60M+ unorganized workers discover state-specific BOCW benefits, track labour union memberships, and build verified work seniority — all through Aadhaar e-KYC.**

[Live Demo](#demo-credentials) · [Features](#-features) · [Architecture](#-architecture) · [Getting Started](#-getting-started) · [API Reference](#-api-reference)

</div>

---

## 📋 The Problem

India's unorganized sector — construction workers, domestic helpers, migrant labourers — comprises over **60 million workers** who are entitled to government benefits under the BOCW Act, 1996 and various state welfare boards. But most workers:

- ❌ Don't know which benefits they qualify for
- ❌ Can't track their seniority across jobsites and states
- ❌ Lose union membership records when migrating between states
- ❌ Have no portable work history that follows them

**Suraksha Grid** solves this by creating a **portable digital identity** tied to Aadhaar, automatically calculating benefit eligibility based on verified attendance, and maintaining a complete timeline of union memberships and labour board registrations across states.

---

## ✨ Features

### 🎯 Benefit Discovery Engine
Automatically calculates which state-specific BOCW schemes a worker qualifies for — accident insurance, housing loans, education scholarships, pensions, maternity benefits — based on their registered state and work seniority.

### 📊 Seniority Tracking System
Every logged work-day contributes to a worker's statutory seniority. **90 work-days = 1 BOCW year.** Workers unlock new benefit tiers as they accumulate verified attendance.

### 🏛️ Union & Labour Board History
Complete timeline of labour union memberships (AITUC, INTUC, HMS, etc.) and labour board registrations (state BOCW boards, ISMW Central Board) — with registration numbers, contribution records, and certificate validity tracking.

### 🔐 Aadhaar Offline e-KYC
Secure identity verification using UIDAI's offline ZIP-based XML format. No OTP. No network dependency. The share-code encrypted XML is parsed locally for tamper-proof identity verification.

### 👷 Multi-Role Dashboards
- **Worker Dashboard** — View benefits, seniority stats, union history, and board registrations
- **Contractor Dashboard** — Manage jobsites, link workers, mark attendance
- **Supervisor Dashboard** — Oversight across contractors and workers

### ⚡ Daily Attendance Pulse
Automated CRON-based system that marks all active workers as present daily. Contractors only intervene to mark absences — saving time across hundreds of workers at scale.

---

## 🔒 Security Architecture

| Layer | Implementation |
|-------|---------------|
| **Identity** | Aadhaar offline e-KYC with share-code encrypted XML — zero network calls for verification |
| **Authentication** | bcrypt (12 rounds) password hashing + signed JWT tokens (24h expiry) |
| **API Security** | FastAPI gateway validates all input before forwarding to Go engine — no direct DB access |
| **Data Isolation** | 3 physically separate MySQL instances for domain isolation (users, contractors, labour records) |
| **Transport** | CORS-restricted origins, structured JSON communication between services |

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│  React + Vite   │────▶│  FastAPI Gateway  │────▶│  Go Gin Engine  │
│  (Port 5173)    │     │  (Port 5000)      │     │  (Port 8080)    │
│                 │     │                  │     │                 │
│  • Landing Page │     │  • Auth (JWT)     │     │  • Registration │
│  • Login/Signup │     │  • eKYC Parser    │     │  • Seniority    │
│  • Worker Dash  │     │  • bcrypt Hashing │     │  • Benefits     │
│  • Contractor   │     │  • Request Proxy  │     │  • Attendance   │
│  • Supervisor   │     │                  │     │  • CRON Pulse   │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                              ┌────────────────────────────┼────────────────────────────┐
                              │                            │                            │
                     ┌────────▼────────┐         ┌────────▼────────┐         ┌─────────▼────────┐
                     │   common_db     │         │  home_labor_db  │         │contractors_master │
                     │   (Port 3306)   │         │  (Port 3307)    │         │   (Port 3308)    │
                     │                 │         │                 │         │                  │
                     │  • users        │         │  • union_       │         │  • jobsites      │
                     │  • benefits     │         │    memberships  │         │  • active_links  │
                     │    (25 schemes  │         │  • labour_board │         │  • attendance_   │
                     │     5 states)   │         │    _registr.    │         │    logs          │
                     └─────────────────┘         └─────────────────┘         └──────────────────┘
```

### Why This Architecture?

- **Python (FastAPI)** handles what Python does best — XML parsing, cryptographic hashing, JWT generation, user-facing auth
- **Go (Gin)** handles what Go does best — high-performance SQL queries, cross-database joins, CRON scheduling, concurrent attendance processing
- **3× MySQL** provides physical data isolation between user identity, labour records, and contractor operations — a security requirement for sensitive worker data

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19, Vite 7, React Router v7 | SPA with role-based dashboards |
| **API Gateway** | Python FastAPI | Auth, eKYC parsing, request validation |
| **Business Engine** | Go (Gin Framework) | Seniority logic, benefit calculations, CRON |
| **Database** | MySQL × 3 (Docker) | Isolated data stores for each domain |
| **Auth** | JWT + bcrypt | Stateless auth with salted password hashing |
| **Identity** | Aadhaar Offline e-KYC | ZIP/XML-based identity verification |
| **Infrastructure** | Docker Compose | Multi-database orchestration |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Go** ≥ 1.21
- **Python** ≥ 3.10
- **Docker & Docker Compose** (for databases)

### Installation

```bash
# Clone the repository
git clone https://github.com/Laxmiish/Suraksha-Grid_NEURIX.git
cd Suraksha-Grid_NEURIX
```

### Frontend Only (Demo Mode with Mock Data)

```bash
npm install
npm run dev
```
Visit `http://localhost:5173` — the app works standalone with mock data and gracefully upgrades to real data when the backend is running.

### Full Stack Setup

```bash
# 1. Start the 3 MySQL databases
cd Backend
docker-compose up -d

# 2. Start the Go business engine
cd Backend
go run process.go

# 3. Start the Python API gateway
pip install -r requirements.txt
cd Backend
uvicorn incoming:app --reload --port 5000

# 4. Start the React frontend
npm run dev
```

---

## 🔑 Demo Credentials

| Role | Phone | Password | Reference ID |
|------|-------|----------|-------------|
| 👷 **Worker** | `9876543210` | `demo1234` | `SG-A3F2B-4521` |
| 🏢 **Contractor** | `9876543211` | `demo1234` | `SG-C7K9M-3381` |
| 🔑 **Supervisor** | `9876543212` | `demo1234` | `SG-S4R7N-2291` |

### Demo Worker Profile
- **120 attendance days** logged (Jan–Jul 2025) → **1.33 BOCW years** → eligible for 1-year benefits
- **3 union memberships** — AITUC Delhi, INTUC Pune, HMS Mumbai (Active)
- **3 labour board registrations** — Delhi BOCW (Expired), Maharashtra BOCW (Active), ISMW Central (Active)
- **State: Maharashtra** — eligible for Tool Kit Assistance, Maternity Benefit, and BOCW Accident Insurance

### Benefits Database (25 schemes across 5 states)
| State | Schemes | Examples |
|-------|---------|---------|
| Maharashtra | 5 | BOCW Accident Insurance ₹5L, Housing Subsidy ₹1L, Pension ₹3K/mo |
| Uttar Pradesh | 5 | Medical Aid ₹1L, Education Scholarship ₹60K, Marriage ₹55K |
| Delhi | 5 | Accident Insurance ₹2L, Free Medical OPD, Scholarship ₹12K/child |
| Karnataka | 5 | Housing ₹2L, Education Aid ₹10K, Marriage Grant ₹50K |
| Tamil Nadu | 5 | Accident Insurance ₹3L, Marriage ₹25K, Pension ₹1K/mo |

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/register` | Register with eKYC data |
| `POST` | `/api/login` | JWT-based login |
| `POST` | `/api/ekyc/upload` | Upload Aadhaar offline ZIP |

### Worker APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/worker/profile/:ref_id` | Worker profile + total days worked |
| `GET` | `/api/worker/benefits/:ref_id` | Eligible benefits based on seniority |
| `GET` | `/api/worker/union-history/:ref_id` | Union membership timeline |
| `GET` | `/api/worker/labour-boards/:ref_id` | Labour board registrations |

### Contractor APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/contractor/mark-absent` | Mark worker absent for a date |

### Seniority Calculation
The benefits engine uses a statutory formula:
```
seniority_years = total_present_days / 90
```
Where 90 work-days equals 1 year of BOCW eligibility. The engine then filters the `benefits` table for the worker's registered state where `minimumyear <= seniority_years`.

---

## 📁 Project Structure

```
Suraksha-Grid/
├── src/
│   ├── App.jsx                      # Router with 6 routes
│   ├── index.css                    # Global styles (Tailwind v4)
│   ├── api/
│   │   └── api.jsx                  # API client (7 endpoints)
│   └── frontend/
│       ├── LandingPage.jsx          # Public landing page
│       ├── LoginPage.jsx            # Role-based login
│       ├── registrationPage.jsx     # eKYC ZIP + registration flow
│       ├── workers.jsx              # Worker dashboard (API-connected)
│       ├── contractor.jsx           # Contractor dashboard
│       └── supervisory.jsx          # Supervisor dashboard
├── Backend/
│   ├── process.go                   # Go engine — Gin, 3× DB, CRON, 7 routes
│   ├── incoming.py                  # FastAPI gateway — auth, eKYC, proxy
│   ├── basemodels.py                # Pydantic request/response models
│   ├── docker-compose.yml           # 3× MySQL containers
│   └── sql_scripts/
│       ├── init_common.sql          # Users + 25 benefits (5 states)
│       ├── init_contractors.sql     # Jobsites + 120 attendance records
│       └── init_home_labor.sql      # Unions + labour board registrations
├── index.html                       # Vite entry point
├── package.json                     # Node dependencies
├── requirements.txt                 # Python dependencies
├── vite.config.js                   # Vite configuration
└── README.md                        # This file
```

---

## 📜 Relevant Legislation

This platform implements digital tracking for benefits under:

- **Building and Other Construction Workers (RE&CS) Act, 1996** — The primary legislation governing welfare of construction workers across Indian states
- **Inter-State Migrant Workmen Act, 1979** — Protects rights of workers migrating between states for employment
- **Unorganized Workers' Social Security Act, 2008** — Framework for social security of unorganized workers

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with 🇮🇳 for India's Unorganized Workforce**

[⬆ Back to Top](#️-suraksha-grid--सुरक्षा-ग्रिड)

</div>
