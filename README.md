# Iron Lady – Task 2
## Internal Business Automation Solution

### 📌 Overview
This project is an **internal business automation system** built for **Iron Lady** to streamline application review and candidate management using AI-assisted insights.

The solution focuses on reducing manual effort, improving consistency in decision-making, and supporting internal teams with a structured workflow.

---

### 🎯 Problem Statement
Iron Lady receives multiple applications for leadership and career programs.  
Manual review of applications is:
- Time-consuming
- Inconsistent
- Difficult to scale

Internal teams need a system to **review, analyze, and manage applications efficiently**.

---

### 💡 Solution
An **AI-assisted internal dashboard** that:
- Accepts applications via a simulator
- Automatically analyzes applications using AI
- Provides structured insights (score, summary, strengths, questions)
- Allows admins to approve or reject applications
- Manages approved candidates with full CRUD operations

---

### 🧩 Key Features
- Application Simulator (for demo/testing)
- AI-based application analysis
- Admin Dashboard for application review
- Approve / Reject workflow
- Candidates management (Create, Read, Update, Delete)
- Clean separation between user-facing and internal operations

---

### 🤖 AI Usage
AI is used as a **decision-support layer** to:
- Generate suitability scores
- Summarize applicant profiles
- Highlight strengths
- Suggest interview questions

Final decisions are always made by the admin.

---

### 🔄 Workflow
1. Application submitted via simulator
2. AI analyzes application data
3. Admin reviews AI insights
4. Admin approves or rejects application
5. Approved applicants move to Candidates section
6. Internal team manages candidates (CRUD)

---

### 🛠️ Tech Stack
- **Backend:** Python, FastAPI
- **Frontend:** HTML / CSS / JavaScript
- **AI:** Groq LLM (free-tier compatible)
- **Database:** SQLite / In-memory (demo)
- **Server:** Uvicorn
- **Environment Management:** python-dotenv

---

### 🎥 Demo Video
A 2–3 minute demo video is included in this repository showing:
- Problem identification
- Application submission
- AI-generated analysis
- Admin decision flow
- Candidates CRUD operations

⚠️ Submissions without demo videos are not evaluated.

---

### 🚀 How to Run Locally
```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Open in browser:
```
http://127.0.0.1:8000
```

---

### 📈 Business Impact
- Reduces manual review effort
- Improves consistency and speed of decisions
- Supports scalable internal operations
- Demonstrates practical AI adoption in business workflows

---

### 📌 Notes
- This is a prototype focused on workflow automation and AI integration
- Authentication and production hardening can be added in future versions

---

### 👤 Author
**Sandeep Gudasi**  
AI & Technology Intern Assignment – Iron Lady
