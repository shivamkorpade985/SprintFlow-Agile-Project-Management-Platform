# SprintFlow — Development Guide

> Setup instructions for running SprintFlow locally, derived from the actual project configuration files.

**Related Documentation:**
- [Architecture](./architecture.md) — System architecture and engineering decisions
- [Database](./database.md) — PostgreSQL schema, migrations, and constraints
- [API Reference](./api.md) — REST API endpoints
- [Testing](./testing.md) — Verification and testing procedures

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Clone the Repository](#clone-the-repository)
- [Backend Setup](#backend-setup)
  - [PostgreSQL Setup](#postgresql-setup)
  - [Connection String](#connection-string)
  - [Apply Migrations](#apply-migrations)
  - [Run the Backend](#run-the-backend)
- [Frontend Setup](#frontend-setup)
  - [Install Dependencies](#install-dependencies)
  - [Environment Configuration](#environment-configuration)
  - [Run the Frontend](#run-the-frontend)
- [Verify the Setup](#verify-the-setup)
- [Available Scripts](#available-scripts)
- [Environment Variables Reference](#environment-variables-reference)
- [Common Issues](#common-issues)

---

## Prerequisites

| Dependency | Minimum Version | Verify With | Purpose |
|---|---|---|---|
| **.NET SDK** | 10.0 | `dotnet --version` | Backend runtime, build, and EF Core tooling |
| **Node.js** | 18+ | `node --version` | Frontend build tooling and dev server |
| **npm** | 9+ | `npm --version` | Frontend package management |
| **PostgreSQL** | 14+ | `psql --version` | Relational database |
| **Git** | — | `git --version` | Repository cloning |
| **EF Core CLI** (optional) | — | `dotnet ef --version` | Database migrations (install: `dotnet tool install --global dotnet-ef`) |

---

## Clone the Repository

```bash
git clone https://github.com/shivamkorpade985/SprintFlow-Agile-Project-Management-Platform.git
cd SprintFlow-Agile-Project-Management-Platform
```

---

## Backend Setup

### PostgreSQL Setup

1. **Start PostgreSQL** if not already running.

2. **Create the database:**

   ```sql
   CREATE DATABASE "SprintFlow";
   ```

   Or via CLI:

   ```bash
   createdb SprintFlow
   ```

3. **Verify access:**

   ```bash
   psql -U your_username -d SprintFlow -c "SELECT 1;"
   ```

### Connection String

Update the connection string in `backend/SprintFlowAPI/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=SprintFlow;Username=your_username;Password=your_password"
  }
}
```

> **Security Note:** Do not commit real credentials. The `.gitignore` is configured to exclude environment-specific files, but `appsettings.json` is tracked. For production, use environment variables or `appsettings.Development.json` (which is gitignored).

### Apply Migrations

Install the EF Core CLI tool (if not already installed):

```bash
dotnet tool install --global dotnet-ef
```

Apply all pending migrations to create the database schema:

```bash
cd backend/SprintFlowAPI
dotnet ef database update
```

This creates the following tables:
- `Projects`
- `Users`
- `Stories`
- `ProjectMembers`

With all foreign keys, indexes, and constraints configured.

**Verify the schema:**

```bash
psql -U your_username -d SprintFlow -c "\dt"
```

Expected output should list:

```
           List of relations
 Schema |      Name       | Type  
--------+-----------------+-------
 public | Projects        | table
 public | Users           | table
 public | Stories         | table
 public | ProjectMembers  | table
 public | __EFMigrationsHistory | table
```

### Run the Backend

```bash
cd backend/SprintFlowAPI
dotnet run --launch-profile http
```

The API will be available at **`http://localhost:5000`**.

**Verify the backend is running:**

```bash
curl http://localhost:5000/api/projects
```

Expected response: `[]` (empty array — no projects created yet).

**Alternative:** Build and run separately:

```bash
dotnet restore
dotnet build
dotnet run --launch-profile http
```

---

## Frontend Setup

### Install Dependencies

```bash
cd frontend
npm install
```

### Environment Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Or create `.env` manually with:

```
VITE_API_BASE_URL=http://localhost:5000
```

This tells the frontend API repositories where to send HTTP requests. If this variable is not set, the API repositories fall back to `http://localhost:5000` by default.

### Run the Frontend

```bash
npm run dev
```

The app will be available at **`http://localhost:5173`**.

> **Note:** Both the backend and frontend must be running simultaneously. The frontend communicates with the backend via REST API calls. Without the backend, the frontend will display error states.

---

## Verify the Setup

Once both the backend and frontend are running:

1. **Open** `http://localhost:5173` in your browser
2. You should see the **SprintFlow landing page**
3. Click **"Go to Projects"** or navigate to `http://localhost:5173/projects`
4. Create a project using the **"New Project"** button
5. If the project is created successfully, the full stack is working

**Quick API verification:**

```bash
# Create a test project
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Project","description":"Verifying setup."}'

# Should return 201 Created with the project JSON including an auto-generated ID
```

---

## Available Scripts

### Backend

| Command | Working Directory | Description |
|---|---|---|
| `dotnet restore` | `backend/SprintFlowAPI` | Restore NuGet packages |
| `dotnet build` | `backend/SprintFlowAPI` | Build the project |
| `dotnet run --launch-profile http` | `backend/SprintFlowAPI` | Run on `http://localhost:5000` |
| `dotnet run --launch-profile https` | `backend/SprintFlowAPI` | Run on `https://localhost:7270` + `http://localhost:5000` |
| `dotnet ef database update` | `backend/SprintFlowAPI` | Apply pending EF Core migrations |
| `dotnet ef migrations add <Name>` | `backend/SprintFlowAPI` | Create a new migration |

### Frontend

| Command | Working Directory | Description |
|---|---|---|
| `npm install` | `frontend` | Install dependencies |
| `npm run dev` | `frontend` | Start Vite dev server with HMR (port 5173) |
| `npm run build` | `frontend` | TypeScript check (`tsc -b`) + Vite production build |
| `npm run preview` | `frontend` | Serve the production build locally |
| `npm run lint` | `frontend` | Run ESLint across the codebase |

---

## Environment Variables Reference

### Backend — `appsettings.json`

| Key | Description | Example |
|---|---|---|
| `ConnectionStrings:DefaultConnection` | PostgreSQL connection string | `Host=localhost;Port=5432;Database=SprintFlow;Username=postgres;Password=***` |

### Backend — Launch Profiles (`Properties/launchSettings.json`)

| Profile | URL | Environment |
|---|---|---|
| `http` | `http://localhost:5000` | Development |
| `https` | `https://localhost:7270` + `http://localhost:5000` | Development |

### Frontend — `.env`

| Variable | Description | Default Fallback |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000` |

### CORS Origins (configured in `Program.cs`)

The backend accepts requests from:

| Origin | Purpose |
|---|---|
| `http://localhost:5173` | Vite dev server (default) |
| `http://localhost:3000` | Alternative dev port |
| `http://127.0.0.1:5173` | Loopback variant |

---

## Common Issues

### "Failed to fetch projects" in the frontend

- **Cause:** The backend is not running, or the frontend `VITE_API_BASE_URL` is incorrect.
- **Fix:** Ensure `dotnet run` is active in `backend/SprintFlowAPI` and `.env` contains `VITE_API_BASE_URL=http://localhost:5000`.

### CORS errors in the browser console

- **Cause:** The frontend is running on a port not listed in the CORS policy.
- **Fix:** Ensure the frontend runs on `localhost:5173` (default Vite port). If using a different port, add it to the CORS configuration in `Program.cs`.

### EF Core migration errors

- **Cause:** The `dotnet-ef` CLI tool is not installed.
- **Fix:** Run `dotnet tool install --global dotnet-ef`.

### PostgreSQL connection refused

- **Cause:** PostgreSQL is not running, or the connection string is incorrect.
- **Fix:** Start PostgreSQL, verify the `Host`, `Port`, `Database`, `Username`, and `Password` in `appsettings.json`.

### "Relation does not exist" errors

- **Cause:** Migrations have not been applied.
- **Fix:** Run `dotnet ef database update` in `backend/SprintFlowAPI`.
