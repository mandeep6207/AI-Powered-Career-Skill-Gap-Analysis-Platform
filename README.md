# SkillGap Navigator

Full-stack SaaS-style demo: React + Vite frontend and Flask backend with SQLite.

Run frontend:

```bash
cd frontend
npm install
npm run dev
# or for production-style serve
npm run build
npm run preview
```

Run backend (create venv recommended):

```bash
cd backend
python -m pip install -r requirements.txt
python db_init.py  # create sqlite schema
python app.py
```

API endpoints:
- POST /signup
- POST /login
- POST /analyze
- GET /history
- GET /profile
- POST /logout

This repo scaffolds a minimal working example for local development.
