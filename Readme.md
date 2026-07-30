# SkillBumble

Peer-to-peer skill exchange platform. Users teach what they know and learn what they don't — no money involved.

## Project Structure

```
4.SkillBumble/
├── backend/                          # Flask API (MVC)
│   ├── app.py                        # App factory, CORS, JWT config
│   ├── requirements.txt
│   ├── .env                          # DB credentials, secrets
│   └── src/
│       ├── config.py                 # Env-based configuration
│       ├── db.py                     # MySQL connection helper
│       ├── models/                   # (M) Data access layer
│       │   ├── user_model.py         # User CRUD queries
│       │   └── skill_model.py        # Skill queries
│       ├── controllers/              # (C) Business logic
│       │   ├── auth_controller.py    # Signup/login/me logic
│       │   └── skills_controller.py  # Skill listing logic
│       ├── routes/                   # (V) Thin HTTP route handlers
│       │   ├── auth_routes.py        # POST /api/auth/signup, /login, GET /me
│       │   └── skills_routes.py      # GET /api/skills
│       └── database/
│           ├── schema.sql            # Full DB schema (8 tables)
│           └── seed.sql              # Sample data (5 users, skills, matches)
│
└── frontend/                         # React + Vite
    ├── package.json
    ├── index.html
    ├── .env                          # VITE_API_BASE_URL
    ├── vite.config.js
    └── src/
        ├── main.jsx                  # Entry point, router + auth provider
        ├── App.jsx                   # Routes + protected route wrapper
        ├── App.css                   # All styles
        ├── api/
        │   └── client.js             # HTTP fetch wrapper
        ├── services/                 # API service layer
        │   ├── authService.js        # Auth endpoints
        │   └── skillService.js       # Skill endpoints
        ├── context/
        │   └── AuthContext.jsx       # Auth state (token, user, login, logout)
        ├── components/
        │   └── SkillPicker.jsx       # Reusable skill selector component
        └── pages/
            ├── LoginPage.jsx         # Login form view
            ├── SignupPage.jsx        # Registration form view
            └── DashboardPage.jsx     # User dashboard after login
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL 8.0+ (running on `localhost:3306`)

## Setup

### 1. Database

Create the database and tables, then seed sample data:

```bash
mysql -u root -p < backend/src/database/schema.sql
mysql -u root -p skillbumble < backend/src/database/seed.sql
```

### 2. Backend

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate      # Windows
# source venv/bin/activate    # Mac/Linux
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and update credentials if needed (defaults work for local dev).

### 3. Frontend

```bash
cd frontend
npm install
```

## Run the App

### Backend (terminal 1)

```bash
cd backend
.\venv\Scripts\activate
python app.py
```

Server starts at `http://localhost:5000`.

### Frontend (terminal 2)

```bash
cd frontend
npm run dev
```

App opens at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account (name, email, password, meeting_link, skills[]) |
| POST | `/api/auth/login` | Sign in (email, password) → token + user |
| GET | `/api/auth/me` | Get current user profile (requires JWT) |
| GET | `/api/skills` | List all skills in catalog |
| GET | `/api/health` | Health check |

## Adding New Features

- **New DB query** → add function in `backend/src/models/`
- **New business logic** → add function in `backend/src/controllers/`
- **New API endpoint** → add route in `backend/src/routes/`, import the controller
- **New API call from frontend** → add method in `frontend/src/services/`
- **New page** → create in `frontend/src/pages/`, add route in `App.jsx`
- **New reusable UI** → create in `frontend/src/components/`
