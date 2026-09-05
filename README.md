# Flavorly

A full-stack **recipe sharing platform** — built as a software-engineering selection task by **Qasim Zahoor**.

Flavorly combines a hand-crafted, animated product UI with a real REST API backend: users register/login with JWT, browse and search a recipe library, open rich recipe detail pages, and publish their own recipes which immediately appear in the live library.

## Highlights

- **Frontend** — `flavorly/index.html`, a zero-dependency single-file app with 7 views (Home, Browse, Search/Detail, Submit, Login, Register, Profile), skeleton loaders, responsive layout with mobile hamburger menu, and full client-side pagination.
- **Backend** — `backend/`, a Node.js + Express REST API with JSON-file persistence (no external database service required).
- **Auth** — registration + login backed by JSON Web Tokens (JWT) with bcrypt password hashing. Protected routes reject unauthenticated and unauthorized (non-owner) requests.
- **Live connection** — the UI talks to the API over `fetch` (CORS-enabled). Browse/search/filters hit real endpoints; login/register/publish use the real auth + CRUD flow; if the backend is unreachable the UI degrades gracefully to demo data.
- **Zero console/API errors** — verified with headless end-to-end browser tests.

## Tech

| Layer    | Stack                                                              |
| -------- | ------------------------------------------------------------------ |
| Frontend | HTML + CSS + vanilla JS (single-file prototype; no build step)      |
| Backend  | Node.js 22, Express, cors, dotenv                                   |
| Auth     | bcryptjs + jsonwebtoken (JWT, 7-day expiry)                          |
| Storage  | Persistent JSON datastore (`backend/src/data/db.json`, gitignored)   |
| Testing  | Puppeteer headless end-to-end + REST smoke tests                    |

## Run it

### 1. Start the API server

```bash
cd backend
npm install
npm run seed     # seeds 12 recipes on first run
npm start        # http://localhost:5000
```

Health check: `GET http://localhost:5000/api/health`

### 2. Open the frontend

Just open `flavorly/index.html` in a browser. The app auto-detects the local API and switches into **live mode** (browse, search, filters, detail, register, login, publish all hit the real backend). Without the server it falls back to built-in demo data.

## Deploy on Vercel

The repo is configured for single-project deployment on Vercel:

- `api/index.js` — serverless entrypoint that exports the Express app (`@vercel/node`).
- `vercel.json` — routes `/api/*` to the function and serves `flavorly/index.html` as the homepage.
- `package.json` — root manifest so Vercel installs backend dependencies.

The frontend auto-detects its API base URL: when served over HTTP(S) it uses **same-origin `/api`**; when opened from `file://` it falls back to `http://localhost:5000/api`.

> **Note:** the JSON datastore is ephemeral on serverless hosting (Vercel's filesystem is read-only except `/tmp`). The API auto-seeds the 12 recipes on every cold start, so browse/search/detail always work; user registrations and new recipes live in-memory for the warm instance's lifetime. For durable persistence, swap `backend/src/config/db.js` for Vercel Postgres/KV or MongoDB (single-module change).

## API reference

| Method | Endpoint                     | Auth | Description                                  |
| ------ | ---------------------------- | ---- | -------------------------------------------- |
| GET    | `/api/health`                | —    | Health check                                |
| GET    | `/api/recipes`               | —    | List (supports `search`, `category`, `maxTime`) |
| GET    | `/api/recipes/categories`    | —    | List of categories                          |
| GET    | `/api/recipes/:id`           | —    | Single recipe                                |
| POST   | `/api/recipes`               | JWT  | Create recipe (owner)                        |
| PUT    | `/api/recipes/:id`           | JWT  | Update own recipe                            |
| DELETE | `/api/recipes/:id`           | JWT  | Delete own recipe                            |
| POST   | `/api/recipes/:id/rate`      | JWT  | Rate a recipe                                |
| POST   | `/api/auth/register`         | —    | Register (`name`, `email`, `password`)       |
| POST   | `/api/auth/login`            | —    | Login → JWT token                           |
| GET    | `/api/auth/me`               | JWT  | Current user                                 |

## Feature checklist

- [x] Homepage — logo + navbar, search bar, hero banner, Browse CTA, Submit CTA, categories, recipe listing & cards
- [x] Recipe cards — rating, difficulty, category & time filters
- [x] Recipe detail — ingredients, numbered instructions, rating
- [x] Submit Recipe form (JWT-protected, validated)
- [x] Express server — GET / POST / DELETE APIs
- [x] Registration + Login + JWT auth
- [x] Persistent database (JSON datastore, swappable to MongoDB)
- [x] Frontend ↔ Backend connection (live mode)
- [x] Responsive UI + no console/API errors (verified headlessly)

## Project structure

```
api/index.js             Vercel serverless entrypoint (exports the Express app)
vercel.json              Vercel build routes (API + static frontend)
package.json             root manifest for Vercel installs
backend/
  src/
    server.js              entrypoint
    app.js                 Express app, routes, error handlers (auto-seeds if empty)
    config/db.js           JSON datastore (load/save/CRUD; Vercel-aware /tmp)
    config/env.js          env config (PORT, JWT, optional GEMINI key)
    models/                user + recipe (schema + validation + search)
    controllers/           auth + recipe controllers
    middleware/            JWT guard + input validation
    routes/                auth + recipe routers
    seed-data.js, seed.js  12 seeded recipes
  .env.example
flavorly/
  index.html               single-file interactive UI
```

## Notes

- DB is stored in `backend/src/data/db.json` (auto-created, gitignored).
- `GEMINI_API_KEY` in `.env` is optional and reserved for a future AI-assisted feature; the key is never committed.
- Made with ❤ by [Qasim Zahoor](https://github.com/qasimzahoor825) — UI concept, full-stack architecture, and end-to-end testing done in a single day.