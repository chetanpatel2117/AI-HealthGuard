# AI HealthGuard

A local AI health dashboard with a React/Vite frontend, Express server, and optional Python backend.

## Project overview

- Frontend: React + Vite
- Server: Express + `tsx` serving API routes and Vite middleware in development
- Backend: Python FastAPI in `backend/app.py` (optional separate service)
- Database: MongoDB via `mongodb` driver

## Prerequisites

- Node.js 18+ (or compatible)
- npm
- MongoDB instance or Atlas cluster
- Python 3.11+ and a backend virtual environment if you want to run the FastAPI backend

## Setup

1. Install Node dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   copy .env.example .env
   ```

3. Update `.env` with your values:
   - `GEMINI_API_KEY`
   - `MONGO_URI`
   - `MONGO_DB`
   - `JWT_SECRET`
   - `APP_URL` (optional)

## Run locally

- Start the frontend/server only:
  ```bash
  npm run dev
  ```

- Start the Python backend only:
  ```bash
  npm run dev:backend
  ```

- Start both frontend/server and Python backend together:
  ```bash
  npm run dev:all
  ```

## Build & start

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

## Notes

- The browser tab title is defined in `index.html`.
- API routes are exposed under `/api/*`.
- MongoDB configuration is loaded from `.env`.
- If `npm run dev:all` fails, ensure `backend/.venv` exists and Python dependencies are installed.
