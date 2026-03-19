# Ai-tools
We're building this to help people understand ai instead of drowning in hype like currently i am drowning 
lets build realism

---

## 📦 Project Structure

```
ai-mvp-project/
├── backend/
│   ├── prisma/              # Database schema & migrations
│   ├── scripts/             # Utility scripts (seeding, local DB management)
│   │   ├── seed-admin.js    # Seeds the initial admin user
│   │   └── start-db.sh      # Starts the local PostgreSQL instance
│   ├── tests/
│   │   ├── unit/            # Unit tests (isolated function tests)
│   │   └── integration/     # Integration tests (multi-service tests)
│   └── src/
│       ├── config/          # Database & third-party client setup (Prisma, Cloudinary)
│       ├── controllers/     # HTTP layer — parse request, call service, send response
│       ├── middleware/       # Auth, rate limiting, error handling, validation
│       ├── routes/          # API route definitions
│       ├── services/        # Business logic & database queries (the "brain")
│       ├── utils/           # Generic helpers (AppError, ApiResponse, softDelete, logger)
│       └── validations/     # Zod schemas for request validation
└── frontend/                # React/TypeScript frontend
```

---

## 🏗️ Architecture — Enterprise N-Tier Pattern

| Layer | Folder | Responsibility |
|---|---|---|
| **Route** | `routes/` | Defines API endpoints, applies middleware |
| **Validation** | `validations/` + `middleware/validate.js` | Validates request body using **Zod** before hitting controllers |
| **Controller** | `controllers/` | Parses `req`, calls the service, returns `res` |
| **Service** | `services/` | All business logic and Prisma database queries |
| **Config** | `config/` | Prisma client, Cloudinary setup — initialized once, imported everywhere |

---

## 🚀 Getting Started (Backend)

### Prerequisites
- Node.js v18+
- PostgreSQL (local or Supabase)

### Local Setup
```bash
cd backend
npm install
cp .env.example .env     # fill in your DATABASE_URL and secrets
npm run db:start         # start local postgres (if using local setup)
npm run seed             # seed the admin user
npm run dev              # start dev server on port 5000
```

### Environment Variables
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `NODE_ENV` | `development` or `production` |
| `CLOUDINARY_*` | Cloudinary API credentials |

---

## 🔑 API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/admin/login` | ❌ | Admin login |
| GET | `/api/news` | ❌ | List published articles |
| GET | `/api/news/:slug` | ❌ | Get article by slug |
| POST | `/api/news` | ✅ | Create article |
| GET | `/api/tools` | ❌ | List AI tools |
| GET | `/api/search/suggestions` | ❌ | Search suggestions |
| GET | `/api/categories` | ❌ | List categories |
| GET | `/api/logs` | ✅ | View activity logs |

---

## 🏭 Deployment (Render + Supabase)

**Build Command:**
```bash
npm run build
```
This runs: `npm install` → `prisma generate` → `prisma migrate deploy` → `seed admin`.

**Start Command:**
```bash
npm start
```

**Required Render Environment Variables:** `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`, `CLOUDINARY_*`