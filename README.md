# ⚡ NIKA OS - Enterprise Performance Matrix

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_LLM-F56565?style=for-the-badge&logo=artificial-intelligence&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

### 🌍 Live Deployment Links
* **Frontend (Live Platform):** [https://nikaos.netlify.app/](https://nikaos.netlify.app/)
* **Backend (Render Dashboard):** [View Deployment](https://dashboard.render.com/web/srv-d7gbgdnaqgkc73epn2og/deploys/dep-d7gbgdvaqgkc73epn38g?r=2026-04-16%4010%3A20%3A43%7E2026-04-16%4010%3A24%3A53)
* **Database (Supabase Console):** [View SQL Architecture](https://supabase.com/dashboard/project/xhrasxfzldqkybbgkqbw/sql/ed6d1336-1794-49db-be62-6efb0bd05907)

---

## 📖 Product Overview (Product Document)
NIKA OS is a next-generation Performance & Goal Management System (PMS/GMS) designed to replace fragmented email threads and informal spreadsheets with a centralized, AI-driven ecosystem. 

Built with a bespoke **Prismatic Glassmorphism** UI, it serves three distinct roles—Employee, Manager, and Admin—ensuring structural accountability, intelligent sentiment tracking, and strict timeline compliance for probation and quarterly review cycles.

### Core Value Proposition
* **For Employees:** Empowers goal ownership with AI-assisted SMART goal generation and visual progression tracking.
* **For Managers:** Streamlines approval workflows and incorporates dual-party cryptographic form seals.
* **For Admins:** Provides a macroscopic "Command Center" featuring an LLM-powered Sentiment Radar to instantly detect flight risks and toxicity.

---

## 🏗️ System Architecture (Design Document)
NIKA OS utilizes a decoupled, serverless architecture to ensure high availability, fast response times, and secure data handling.

* **Frontend (Client Layer):** `React.js` + `Tailwind CSS` + `Framer Motion`. Hosted on Netlify's edge network. Manages role-based state switching and real-time UI validation.
* **Backend (API Layer):** `Python` + `FastAPI`. Hosted on Render. Highly typed using Pydantic `Optional` models to guarantee crash-proof data ingestion and handle null states gracefully.
* **Database (Storage Layer):** `PostgreSQL` via Supabase. Ensures ACID compliance for relational data.
* **AI Engine (Intelligence Layer):** `Groq API` (Llama-3-8b-8192). Handles NLP tasks with sub-second latency, specifically engineered to process complex semantic negations.

### Database Schema Map
1. **`goals` Table:** `id` (UUID), `title` (Str), `weight` (Int), `hierarchy_level` (Str), `status` (Str), `completion_percentage` (Int).
2. **`feedback` Table:** `id` (UUID), `employee_submitted` (Bool), `employee_rating` (Str), `manager_submitted` (Bool), `manager_rating` (Str), `manager_text` (Text), `is_flagged` (Bool), `sentiment_label` (Str).
3. **`system_config` Table:** `id` (Int), `is_configured` (Bool). Acts as a global kill-switch for review cycles.

---

## ✨ Core Engineering Implementations
This platform handles complex PRD edge cases through strict code-level constraints:

1. **The 100% Weightage Lock (GMS Core):** The UI actively blocks objective deployment until the user's active goal weightage equals exactly 100%, ensuring mathematical integrity in performance metrics.
2. **Context-Aware Sentiment Radar:** The Python backend utilizes an advanced LLM prompt to detect linguistic negations (e.g., correctly flagging *"not good"* as a critical negative toxicity alert, bypassing the standard positive keyword trap).
3. **Cryptographic Sealing:** Review forms utilize a dual-key visibility matrix. Feedback remains obfuscated in the UI until both the employee and manager booleans flip to `True` in the database.
4. **Player-Coach Context Switching:** Managers who also serve as individual contributors can swap their UI context state dynamically without requiring separate user accounts.
5. **Corporate Objective Aggregation:** Global company goals are algorithmically separated from individual nodes and displayed in a dedicated macroscopic Admin matrix.

---

## 💻 Local Setup & Installation

If you wish to run the architecture locally for testing, follow these steps:

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/nika-os.git](https://github.com/your-username/nika-os.git)
cd nika-os
```
2. Backend Setup (FastAPI)
Open your terminal and navigate to the backend folder:

```Bash
cd backend
pip install -r requirements.txt
Note: Create a .env file in the backend directory with SUPABASE_URL, SUPABASE_KEY, and GROQ_API_KEY.
```
```Bash
uvicorn main:app --reload
(The API will run on http://127.0.0.1:8000)
```
3. Frontend Setup (React)
Open a separate terminal and navigate to the frontend folder:

```Bash
cd frontend
npm install
npm run dev
```
(The UI will run on http://localhost:5173 or similar depending on Vite/CRA).
