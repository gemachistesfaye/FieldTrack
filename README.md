# FieldSync — Offline-First Field Issue Reporting & Management System

FieldSync is an enterprise-grade full-stack platform engineered to enable field technicians to report, document, and monitor infrastructure incidents (such as broken water points, damaged electrical equipment, service outages, and safety hazards) regardless of cellular or Wi-Fi availability.

---

## Key Features & Foundations

- **Offline-First Architecture**: Built-in IndexedDB client storage via **Dexie.js** with idempotency UUID generation for seamless multi-phase reconciliation upon reconnection.
- **Idempotent API Processing**: The backend detects client UUIDs (`clientId`) preventing duplicate record creation on retries.
- **Normalized Relational Data Layer**: Powered by **PostgreSQL** and **Prisma ORM**, featuring `User`, `Report`, `ReportHistory` (audit trail), `ReportAttachment`, and `SyncEvent`.
- **Real-Time Network Detection**: Live online/offline state observer providing dynamic visual indicators across the application header and dashboard.
- **Professional Modern SaaS UI**: Tailored Tailwind CSS design system featuring dark slate/navy contrast, restrained teal accents, accessible typography, responsive sidebar navigation, and modular component primitives.
- **Type-Safe Full Stack**: End-to-end TypeScript enforcement across Express backend, Prisma ORM, and React 18 frontend.
- **Resilient API Architecture**: Standardized `ApiResponse` wrappers, operational `AppError` handling, and non-blocking database health checks.

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
│   ├── prisma/           # PostgreSQL schema, migrations & seed script
│   ├── src/
│   │   ├── config/       # Environment & Prisma client
│   │   ├── controllers/  # HTTP request handlers (Reports, Users, Health)
│   │   ├── middleware/   # Request logger, error handler, Zod validate
│   │   ├── routes/       # Express route handlers
│   │   ├── services/     # Core business logic (ReportService, UserService)
│   │   └── utils/        # Standardized API response & logger
│   └── tests/            # Vitest + Supertest integration tests
├── docs/                 # Architecture & Database documentation
│   ├── ARCHITECTURE.md
│   └── DATABASE.md
├── package.json          # Monorepo workspace orchestration
└── README.md
```

---

## Installation & Setup

### Prerequisites

- **Node.js**: v18.0.0 or higher (v22.x recommended)
- **NPM**: v9.0.0 or higher
- **PostgreSQL**: v14 or higher (running locally on port 5432 or hosted)

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

### 3. Database Migration & Seeding

```bash
# Synchronize Prisma schema with PostgreSQL
npm --workspace=backend exec prisma db push

# Generate Prisma Client
npm run prisma:generate --workspace=backend

# Populate with realistic demo fixtures (8 users, 16 incident reports, audit logs)
npm run db:seed
```

---

## Running the Application

### Development Mode (Both Frontend & Backend)

Run both the Express backend (`http://localhost:5000`) and Vite frontend (`http://localhost:5173`) concurrently:

```bash
npm run dev
```

### Or Run Individually

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

---

## REST API Endpoints

Detailed API documentation with request/response examples is available in [docs/DATABASE.md](file:///c:/Users/HP/Desktop/FieldSync/docs/DATABASE.md).

| Method | Endpoint           | Description                                                                                              |
| :----- | :----------------- | :------------------------------------------------------------------------------------------------------- |
| `GET`  | `/api/health`      | Service health and PostgreSQL connection telemetry                                                       |
| `GET`  | `/api/reports`     | List reports with pagination (`page`, `limit`), filtering (`category`, `priority`, `status`), and search |
| `POST` | `/api/reports`     | Create report (idempotent with `clientId`, auto-generates audit history)                                 |
| `GET`  | `/api/reports/:id` | Retrieve report by UUID with creator, assignee, and history trail                                        |
| `GET`  | `/api/users`       | List active users and roles                                                                              |
| `GET`  | `/api/users/:id`   | Retrieve user by ID                                                                                      |

---

## Testing & Quality Assurance

```bash
# Run all unit and integration test suites (18 tests total)
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
