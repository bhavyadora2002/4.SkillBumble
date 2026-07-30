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
│       │   ├── skill_model.py        # Skill queries
│       │   ├── give_take_model.py    # Give & Take post queries
│       │   └── match_model.py        # Match request queries
│       ├── controllers/              # (C) Business logic
│       │   ├── auth_controller.py    # Signup/login/me logic
│       │   ├── skills_controller.py  # Skill listing logic
│       │   ├── give_take_controller.py  # Post creation & listing
│       │   ├── match_controller.py   # Match request & response logic
│       │   └── user_controller.py    # Public profile logic
│       ├── routes/                   # (V) Thin HTTP route handlers
│       │   ├── auth_routes.py        # POST /api/auth/signup, /login, GET /me
│       │   ├── skills_routes.py      # GET /api/skills
│       │   ├── give_take_routes.py   # POST/GET /api/give-take/posts
│       │   ├── match_routes.py       # POST/GET /api/matches, PUT /api/matches/:id
│       │   └── user_routes.py        # GET /api/users/:id
│       └── database/
│           ├── schema.sql            # Full DB schema (8 tables)
│           ├── migration.sql         # Give & Take column additions
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
        │   ├── skillService.js       # Skill endpoints
        │   ├── postService.js        # Give & Take post endpoints
        │   ├── matchService.js       # Match request endpoints
        │   └── userService.js        # User profile endpoints
        ├── context/
        │   └── AuthContext.jsx       # Auth state (token, user, login, logout)
        ├── components/
        │   ├── Navbar.jsx            # Top navigation bar
        │   ├── SkillPicker.jsx       # Reusable skill selector component
        │   ├── PostCard.jsx          # Give & Take post card
        │   └── MatchCard.jsx         # Match request card with Accept/Reject
        └── pages/
            ├── LoginPage.jsx         # Login form view
            ├── SignupPage.jsx        # Registration form view
            ├── DashboardPage.jsx     # User dashboard after login
            ├── GiveTakePage.jsx      # Browse offers + manage matches
            ├── CreatePostPage.jsx    # Create a new Give & Take offer
            └── UserProfilePage.jsx   # View another user's profile
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

Then run the migration for Give & Take:

```bash
mysql -u root -p skillbumble < backend/src/database/migration.sql
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

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account (name, email, password, meeting_link, skills[]) |
| POST | `/api/auth/login` | Sign in (email, password) → token + user |
| GET | `/api/auth/me` | Get current user profile (requires JWT) |

### Skills
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/skills` | List all skills in catalog |

### Give & Take
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/give-take/posts` | Create an offer (skill_id, type, proficiency_level, title, description) |
| GET | `/api/give-take/posts` | List all open offers from other users |
| GET | `/api/give-take/posts/:id` | Get a single offer |

### Matches
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/matches` | Request a match on a post (post_id) |
| GET | `/api/matches` | List my matches (incoming + outgoing) |
| PUT | `/api/matches/:id` | Accept or reject (body: { status: "confirmed" | "cancelled" }) |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/:id` | View public profile (name, bio, meeting link, rating, skills) |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

## Give & Take Feature Flow

1. **Create an offer** → User picks a skill from catalog, sets type (teach/learn) and level, writes a title + description → post created with status `open`
2. **Browse offers** → Other users see all open posts, can click the poster's name to view their profile
3. **Request a match** → Interested user clicks "Request Match" → match created with status `pending`
4. **Owner reviews** → The post owner sees the incoming request with the requester's profile (name, bio, meeting link, rating, skills)
5. **Accept or Reject** → Owner clicks Accept → match becomes `confirmed`, post becomes `matched`. Owner clicks Reject → match becomes `cancelled`

## Adding New Features

- **New DB query** → add function in `backend/src/models/`
- **New business logic** → add function in `backend/src/controllers/`
- **New API endpoint** → add route in `backend/src/routes/`, import the controller, register blueprint in `app.py`
- **New API call from frontend** → add method in `frontend/src/services/`
- **New page** → create in `frontend/src/pages/`, add route in `App.jsx`
- **New reusable UI** → create in `frontend/src/components/`
