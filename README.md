# AI HealthGuard

A local AI health dashboard with a React/Vite frontend and Express server.

## Project overview

- Frontend: React + Vite
- Server: Express + `tsx` serving API routes and Vite middleware in development
- Database: MongoDB via `mongodb` driver

## Prerequisites

- Node.js 18+ (or compatible)
- npm
- MongoDB instance or Atlas cluster

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

## Run locally\r?\n\r?\n- Start the frontend/server only:\r?\n  ```bash\r?\n  npm run dev\r?\n  ```\r?\n\r?\n## Build & start

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


