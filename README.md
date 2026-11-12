# FieldSync — Offline-First Field Issue Reporting & Management System

FieldSync is an enterprise-grade full-stack platform engineered to enable field technicians to report, document, and monitor infrastructure incidents (such as broken water points, damaged electrical equipment, service outages, and safety hazards) regardless of cellular or Wi-Fi availability.

---

## Key Features & Foundations

- **Offline-First Architecture**: Built-in IndexedDB client storage via **Dexie.js** with idempotency UUID generation for seamless multi-phase reconciliation upon reconnection.
- **Real-Time Network Detection**: Live online/offline state observer providing dynamic visual indicators across the application header and dashboard.
- **Professional Modern SaaS UI**: Tailored Tailwind CSS design system featuring dark slate/navy contrast, restrained teal accents, accessible typography, responsive sidebar navigation, and modular component primitives.
- **Type-Safe Full Stack**: End-to-end TypeScript enforcement across Express backend, Prisma ORM, and React 18 frontend.
- **Resilient API Architecture**: Standardized `ApiResponse` wrappers, operational `AppError` handling, and non-blocking database health checks.
- **Granular Role-Based Access Support**: Pre-configured domain models for **Field Workers**, **Coordinators**, and **Administrators**.

---

## Technology Stack

| Layer            | Technologies                                                                                      |
| :--------------- | :------------------------------------------------------------------------------------------------ |
| **Frontend**     | React 18, TypeScript, Vite, Tailwind CSS, React Router v6, TanStack Query, Dexie.js, Lucide React |
| **Backend**      | Node.js, Express 4, TypeScript, Prisma ORM, PostgreSQL, Zod, Helmet, CORS                         |
| **Testing**      | Vitest, React Testing Library, Supertest, jsdom                                                   |
| **Code Quality** | ESLint 9 (Flat Config), Prettier 3, Strict TypeScript                                             |
| **Monorepo**     | NPM Workspaces (`frontend/` + `backend/`)                                                         |

---

## Project Structure

```text
FieldSync/
├── frontend/             # React + Vite application
│   ├── src/
│   │   ├── components/   # Reusable UI components & layouts
│   │   ├── hooks/        # Network status & custom hooks
│   │   ├── pages/        # Dashboard, Reports, Workflow, Sync, etc.
│   │   ├── routes/       # Centralized route definitions
│   │   ├── services/     # Dexie.js local database & API client
│   │   └── types/        # TypeScript interfaces & domain enums
├── backend/              # Node.js + Express API
│   ├── prisma/           # PostgreSQL schema & relations
│   ├── src/
│   │   ├── config/       # Environment & Prisma client
│   │   ├── middleware/   # Request logger, error handler, Zod validate
│   │   ├── routes/       # Express route handlers
│   │   ├── services/     # Core business services
│   │   └── utils/        # Standardized API response & logger
│   └── tests/            # Vitest + Supertest integration tests
├── docs/                 # Architecture diagrams & specifications
├── package.json          # Monorepo workspace orchestration
└── README.md
```

---

## Installation & Setup

### Prerequisites

- **Node.js**: v18.0.0 or higher (v22.x recommended)
- **NPM**: v9.0.0 or higher
- **PostgreSQL**: (Optional for Step 1 health check, required for database migrations)

### 1. Clone & Install Dependencies

From the repository root directory:

```bash
# Install dependencies for all workspaces (frontend & backend)
npm install
```

### 2. Configure Environment Variables

Create `.env` files in both `backend` and `frontend` using their provided examples:

```bash
# Backend configuration
cp backend/.env.example backend/.env

# Frontend configuration
cp frontend/.env.example frontend/.env
```

#### Backend Environment Variables (`backend/.env`)

| Variable       | Description                                               | Default                                                                 |
| :------------- | :-------------------------------------------------------- | :---------------------------------------------------------------------- |
| `NODE_ENV`     | Runtime environment (`development`, `test`, `production`) | `development`                                                           |
| `PORT`         | Express HTTP server port                                  | `5000`                                                                  |
| `DATABASE_URL` | PostgreSQL connection string                              | `postgresql://postgres:postgres@localhost:5432/fieldsync?schema=public` |
| `JWT_SECRET`   | Secret token signing key                                  | `replace-with-a-secure-random-secret-key`                               |
| `CORS_ORIGIN`  | Allowed client origin for CORS                            | `http://localhost:5173`                                                 |
| `LOG_LEVEL`    | Logging verbosity                                         | `info`                                                                  |

#### Frontend Environment Variables (`frontend/.env`)

| Variable            | Description      | Default                        |
| :------------------ | :--------------- | :----------------------------- |
| `VITE_API_BASE_URL` | Backend API URL  | `http://localhost:5000/api/v1` |
| `VITE_APP_NAME`     | Application name | `FieldSync`                    |

### 3. Generate Prisma ORM Client

```bash
npm run prisma:generate --workspace=backend
```

---

## Running the Application

### Development Mode

Run the backend and frontend simultaneously or in separate terminal sessions:

```bash
# Run both applications concurrently (from root)
npm run dev:frontend
npm run dev:backend

# Or individually:
# Terminal 1 - Backend (http://localhost:5000)
cd backend && npm run dev

# Terminal 2 - Frontend (http://localhost:5173)
cd frontend && npm run dev
```

- **Frontend App**: `http://localhost:5173`
- **Backend Health Check**: `http://localhost:5000/api/v1/health`
- **Backend API Root**: `http://localhost:5000/`

---

## Testing & Quality Assurance

```bash
# Run all unit and integration test suites
npm run test

# Run frontend test suite (React Testing Library + Vitest)
npm run test:frontend

# Run backend test suite (Supertest + Vitest)
npm run test:backend

# Check TypeScript and build production artifacts
npm run build

# Run code linter
npm run lint

# Check code formatting
npm run format:check
```

---

## Health Check Verification

The backend includes a health-check endpoint that can be queried anytime:

```bash
curl http://localhost:5000/api/v1/health
```

Example response:

```json
{
  "success": true,
  "message": "FieldSync API service health check",
  "data": {
    "status": "healthy",
    "timestamp": "2026-11-12T18:27:39.278Z",
    "uptime": 12.45,
    "environment": "development",
    "database": {
      "status": "connected",
      "message": "PostgreSQL connection operational"
    },
    "version": "0.1.0"
  }
}
```

_Note: If the PostgreSQL database has not been initialized yet, the health endpoint returns a graceful status `degraded` without crashing the application._
