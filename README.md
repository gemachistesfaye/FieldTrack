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

## Authentication & Role-Based Access Control (RBAC)

FieldSync incorporates a security architecture built on short-lived JWT access tokens and database-backed rotating refresh tokens stored in secure, HTTP-only cookies.

### Security Architecture

- **Password Hashing**: Cryptographically salted bcrypt (10 rounds). Plaintext passwords are never stored or logged.
- **Access Tokens**: Short-lived (15 minutes default) signed JWTs held in memory on the client (never in `localStorage`) to protect against XSS token exfiltration.
- **Refresh Tokens & Rotation**: Long-lived (7 days default) cryptographically signed tokens with unique `jti` identifiers delivered via `HttpOnly`, `SameSite: 'lax'`, `path: '/'` cookies. On every refresh, the presented token is revoked and rotated.
- **SHA-256 Token Vaulting**: Raw refresh tokens are never persisted in the database. Only deterministic SHA-256 hashes (`tokenHash`) are stored, protecting user sessions against database disclosure attacks.
- **Replay / Reuse Detection**: If a revoked refresh token is presented (indicating interception or theft), the system automatically revokes all active sessions for that user across all devices.
- **Safe Public Registration Policy**: Public registration (`POST /api/auth/register`) strictly assigns the `FIELD_WORKER` role. Any client attempts to elevate privileges to `ADMIN` or `COORDINATOR` are rejected with a 400 Bad Request.

### Role Permission Matrix

| Capability / Route | FIELD_WORKER | COORDINATOR | ADMIN |
| :--- | :---: | :---: | :---: |
| Self-Register & Login | Yes | Login Only | Login Only |
| View Own Incident Reports | Yes | Yes | Yes |
| View Reports by Other Technicians | No (403) | Yes | Yes |
| Create Incident Reports | Yes (Own ID) | Yes | Yes |
| Edit Draft Reports | Yes (Own Drafts) | Yes | Yes |
| Assign Reports to Technicians | No (403) | Yes | Yes |
| Transition Workflow Status (In Progress, Resolved, Rejected) | No (403) | Yes | Yes |
| Coordinator Command Board (`/workflow`) | Hidden / 403 | Yes | Yes |
| Audit Trail & Analytics (`/activity`, `/analytics`) | Hidden / 403 | Yes | Yes |
| View Team Member Directory (`/users`) | No (403) | Yes (View Only) | Yes |
| Provision New Coordinators & Admins | No (403) | No (403) | Yes |
| Deactivate Accounts & Revoke Sessions | No (403) | No (403) | Yes |
| System Settings (`/settings`) | Hidden / 403 | Hidden / 403 | Yes |

---

## Seed Data & Demo Accounts

The database seed (`npm run db:seed`) provides test accounts with pre-hashed credentials. All accounts use password: **`Password123!`**.

| Role | Name | Email | Default Dashboard Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | Elena Rostova | `admin@fieldsync.local` | System configuration, user provisioning, role promotion, full report oversight |
| **Coordinator** | Marcus Vance | `marcus.vance@fieldsync.local` | Workflow triage, incident assignment, status lifecycle management |
| **Coordinator** | David Kimani | `david.kimani@fieldsync.local` | Dispatch coordination, regional incident monitoring |
| **Field Worker** | Amina Osei | `amina.osei@fieldsync.local` | Field discovery, report submission, offline draft sync |
| **Field Worker** | Samuel Kiprop | `samuel.kiprop@fieldsync.local` | Water & pipeline fault reporting |
| **Field Worker** | Grace Mwangi | `grace.mwangi@fieldsync.local` | Electrical relay & substation inspection |
| **Deactivated** | Deactivated Worker | `deactivated.worker@fieldsync.local` | Test account for account suspension & 403 rejection |

---

## REST API Endpoints

Detailed API documentation with request/response examples is available in [docs/DATABASE.md](file:///c:/Users/HP/Desktop/FieldSync/docs/DATABASE.md).

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new technician account (defaults strictly to `FIELD_WORKER`) |
| `POST` | `/api/auth/login` | Public | Authenticate credentials; sets HTTP-only refresh cookie and returns access token |
| `GET` | `/api/auth/me` | Authenticated | Retrieve authenticated user profile and assigned role |
| `POST` | `/api/auth/refresh` | Public / Cookie | Rotate refresh token and issue fresh access token |
| `POST` | `/api/auth/logout` | Public / Cookie | Revoke current session's refresh token and clear cookie |
| `POST` | `/api/auth/logout-all` | Authenticated | Revoke all active sessions across all devices for the current user |

### Report Management Endpoints (`/api/reports`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reports` | Authenticated | List reports (scoped to own reports for `FIELD_WORKER`, full list for Coordinator/Admin) |
| `POST` | `/api/reports` | Authenticated | Create report (idempotent via `clientId`, auto-generates audit history) |
| `GET` | `/api/reports/:id` | Authenticated | Retrieve report by UUID (ownership enforced for `FIELD_WORKER`) |
| `PATCH` | `/api/reports/:id` | Authenticated | Update draft fields, coordinator assignment, or workflow status |

### User Management Endpoints (`/api/users`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Coordinator, Admin | List team members and assigned roles |
| `POST` | `/api/users` | Admin Only | Provision new user accounts with specific roles |
| `GET` | `/api/users/:id` | Coordinator, Admin | Retrieve user profile by ID |
| `PATCH` | `/api/users/:id` | Admin Only | Update role or toggle account active status (`isActive`) |

### System Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Public | Service health and PostgreSQL database connectivity telemetry |

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
