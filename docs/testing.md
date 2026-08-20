# SprintFlow — Testing & Verification

> Describes the testing and verification approach used during SprintFlow development. No automated test suite (unit tests, integration tests) currently exists. Testing was performed through build verification, manual API testing, and frontend-backend integration verification.

**Related Documentation:**
- [API Reference](./api.md) — Complete endpoint documentation for structuring test scenarios
- [Database](./database.md) — Schema constraints and delete behaviors to verify
- [Development](./development.md) — Setup instructions for running the application locally

---

## Table of Contents

- [Testing Status](#testing-status)
- [Build Verification](#build-verification)
- [API Testing with Postman](#api-testing-with-postman)
  - [Projects — Test Scenarios](#projects--test-scenarios)
  - [Users — Test Scenarios](#users--test-scenarios)
  - [Project Members — Test Scenarios](#project-members--test-scenarios)
  - [Stories — Test Scenarios](#stories--test-scenarios)
- [Frontend-Backend Integration Verification](#frontend-backend-integration-verification)
- [Business Rule Verification](#business-rule-verification)
- [Database Constraint Verification](#database-constraint-verification)
- [Future: Automated Testing](#future-automated-testing)

---

## Testing Status

| Category | Status |
|---|---|
| Build verification (backend) | ✅ `dotnet build` passes |
| Build verification (frontend) | ✅ `npm run build` passes |
| Lint verification (frontend) | ✅ `npm run lint` passes |
| Manual API testing (Postman) | ✅ All endpoints verified |
| Frontend-backend integration | ✅ All features verified against API |
| Automated unit tests | ❌ Not implemented |
| Automated integration tests | ❌ Not implemented |
| End-to-end tests | ❌ Not implemented |

---

## Build Verification

### Backend

```bash
cd backend/SprintFlowAPI
dotnet build
```

The build must complete with **0 errors and 0 warnings**. This verifies:
- All C# source files compile
- All NuGet dependencies resolve
- EF Core model configurations are valid
- DTO types match service/controller signatures

### Frontend

```bash
cd frontend
npm run lint    # ESLint — must pass with 0 errors
npm run build   # TypeScript check (tsc -b) + Vite production build
```

The lint must complete with **0 errors**. The build must complete successfully. This verifies:
- All TypeScript types are correct
- All imports resolve
- No unused variables or missing dependencies
- Production bundle generates successfully

---

## API Testing with Postman

All REST API endpoints were tested manually using **Postman**. The project also includes an `SprintFlowAPI.http` file for HTTP client testing in IDEs (VS Code REST Client, Rider, Visual Studio).

**Base URL:** `http://localhost:5000`

### Projects — Test Scenarios

| # | Scenario | Method | Endpoint | Expected Status | Expected Behavior |
|---|---|---|---|---|---|
| 1 | List all projects (empty) | `GET` | `/api/projects` | `200 OK` | Returns `[]` |
| 2 | Create a project | `POST` | `/api/projects` | `201 Created` | Returns project with auto-generated `id`, `createdAt`. Includes `Location` header |
| 3 | Create project — missing name | `POST` | `/api/projects` | `400 Bad Request` | Validation error for `name` field |
| 4 | Create project — empty body | `POST` | `/api/projects` | `400 Bad Request` | Validation errors for all required fields |
| 5 | Get project by ID | `GET` | `/api/projects/1` | `200 OK` | Returns the created project |
| 6 | Get project — nonexistent ID | `GET` | `/api/projects/999` | `404 Not Found` | `{ "message": "Project with ID '999' was not found." }` |
| 7 | Update a project | `PUT` | `/api/projects/1` | `204 No Content` | Project updated in database |
| 8 | Update project — nonexistent ID | `PUT` | `/api/projects/999` | `404 Not Found` | Error message |
| 9 | Delete a project | `DELETE` | `/api/projects/1` | `204 No Content` | Project removed |
| 10 | Delete project — nonexistent ID | `DELETE` | `/api/projects/999` | `404 Not Found` | Error message |
| 11 | List all projects (after create) | `GET` | `/api/projects` | `200 OK` | Returns array with created projects, ordered newest first |

<details>
<summary><strong>Sample Postman requests</strong></summary>

**POST /api/projects**

```json
{
  "name": "SprintFlow Core Platform",
  "description": "Agile project management platform with PostgreSQL backend."
}
```

**PUT /api/projects/1**

```json
{
  "name": "SprintFlow Core Platform (Updated)",
  "description": "Updated description for the project."
}
```

</details>

---

### Users — Test Scenarios

| # | Scenario | Method | Endpoint | Expected Status | Expected Behavior |
|---|---|---|---|---|---|
| 1 | List all users (empty) | `GET` | `/api/users` | `200 OK` | Returns `[]` |
| 2 | Create a user (DEVELOPER) | `POST` | `/api/users` | `201 Created` | Returns user with `id`, role as `"DEVELOPER"` |
| 3 | Create a user (TESTER) | `POST` | `/api/users` | `201 Created` | Role serialized as `"TESTER"` |
| 4 | Create a user (MANAGER) | `POST` | `/api/users` | `201 Created` | Role serialized as `"MANAGER"` |
| 5 | Create user — missing role | `POST` | `/api/users` | `400 Bad Request` | Validation error |
| 6 | Create user — invalid role | `POST` | `/api/users` | `400 Bad Request` | JSON deserialization error (invalid enum) |
| 7 | Get user by ID | `GET` | `/api/users/1` | `200 OK` | Returns user with all fields |
| 8 | Get user — nonexistent ID | `GET` | `/api/users/999` | `404 Not Found` | Error message |
| 9 | Update a user | `PUT` | `/api/users/1` | `204 No Content` | User updated |
| 10 | Delete a user | `DELETE` | `/api/users/1` | `204 No Content` | User removed; story assignments set to null |

<details>
<summary><strong>Sample Postman requests</strong></summary>

**POST /api/users**

```json
{
  "name": "Alice Johnson",
  "role": "DEVELOPER",
  "avatar": "#1E64D4"
}
```

</details>

---

### Project Members — Test Scenarios

| # | Scenario | Method | Endpoint | Expected Status | Expected Behavior |
|---|---|---|---|---|---|
| 1 | List members (empty) | `GET` | `/api/projects/1/members` | `200 OK` | Returns `[]` |
| 2 | Add a member | `POST` | `/api/projects/1/members` | `201 Created` | Returns membership with nested user details |
| 3 | Add duplicate member | `POST` | `/api/projects/1/members` | `409 Conflict` | `{ "message": "..." }` — duplicate prevented |
| 4 | Add member — nonexistent project | `POST` | `/api/projects/999/members` | `404 Not Found` | Project not found |
| 5 | Add member — nonexistent user | `POST` | `/api/projects/1/members` | `404 Not Found` | User not found |
| 6 | List members (after add) | `GET` | `/api/projects/1/members` | `200 OK` | Returns array with member(s) and nested user details |
| 7 | Remove a member | `DELETE` | `/api/projects/1/members/1` | `204 No Content` | Membership removed |
| 8 | Remove non-member | `DELETE` | `/api/projects/1/members/999` | `404 Not Found` | User is not a member |
| 9 | List members for nonexistent project | `GET` | `/api/projects/999/members` | `404 Not Found` | Project not found |

<details>
<summary><strong>Sample Postman requests</strong></summary>

**POST /api/projects/1/members**

```json
{
  "userId": 1
}
```

</details>

---

### Stories — Test Scenarios

| # | Scenario | Method | Endpoint | Expected Status | Expected Behavior |
|---|---|---|---|---|---|
| 1 | List stories (empty) | `GET` | `/api/projects/1/stories` | `200 OK` | Returns `[]` |
| 2 | Create story (unassigned) | `POST` | `/api/projects/1/stories` | `201 Created` | Story with `assignedUserId: null` |
| 3 | Create story (assigned to member) | `POST` | `/api/projects/1/stories` | `201 Created` | Story with valid `assignedUserId` |
| 4 | Create story — invalid assignee (not a member) | `POST` | `/api/projects/1/stories` | `400 Bad Request` | Service validates assignee is a project member |
| 5 | Create story — nonexistent assignee | `POST` | `/api/projects/1/stories` | `400 Bad Request` | Service validates user exists |
| 6 | Create story — nonexistent project | `POST` | `/api/projects/999/stories` | `404 Not Found` | Project not found |
| 7 | Create story — missing title | `POST` | `/api/projects/1/stories` | `400 Bad Request` | Validation error |
| 8 | Create story — story points out of range | `POST` | `/api/projects/1/stories` | `400 Bad Request` | Must be 1–100 |
| 9 | Get story by ID | `GET` | `/api/stories/1` | `200 OK` | Returns full story |
| 10 | Get story — nonexistent ID | `GET` | `/api/stories/999` | `404 Not Found` | Error message |
| 11 | Update story — change status (Kanban) | `PUT` | `/api/stories/1` | `204 No Content` | Status changed (e.g., BACKLOG → IN_PROGRESS) |
| 12 | Update story — reassign | `PUT` | `/api/stories/1` | `204 No Content` | New assignee validated as project member |
| 13 | Update story — clear assignment | `PUT` | `/api/stories/1` | `204 No Content` | `assignedUserId: null` |
| 14 | Delete a story | `DELETE` | `/api/stories/1` | `204 No Content` | Story removed |
| 15 | List stories by project | `GET` | `/api/projects/1/stories` | `200 OK` | Returns stories ordered by creation date desc |

<details>
<summary><strong>Sample Postman requests</strong></summary>

**POST /api/projects/1/stories**

```json
{
  "title": "Implement user authentication",
  "description": "Add login/logout flow with JWT tokens.",
  "priority": "HIGH",
  "storyPoints": 8,
  "assignedUserId": 1,
  "status": "BACKLOG"
}
```

**PUT /api/stories/1** (Kanban status change)

```json
{
  "title": "Implement user authentication",
  "description": "Add login/logout flow with JWT tokens.",
  "priority": "HIGH",
  "storyPoints": 8,
  "assignedUserId": 1,
  "status": "IN_PROGRESS"
}
```

</details>

---

## Frontend-Backend Integration Verification

The following integration scenarios verify that the frontend React application communicates correctly with the backend API:

| # | Feature | Verification |
|---|---|---|
| 1 | **Project CRUD** | Create, edit, delete projects via the Projects page. Verify changes persist after page refresh |
| 2 | **User CRUD** | Create, edit, delete users via the Team page. Verify roles and avatars persist |
| 3 | **Team membership** | Add/remove members via the Team page. Verify duplicate prevention (409 Conflict displayed in UI) |
| 4 | **Story CRUD** | Create, edit, delete stories via the Stories page. Verify all fields persist |
| 5 | **Story assignment** | Assign a story to a project member. Attempt to assign to a non-member — verify error displayed |
| 6 | **Kanban board** | Drag a story card between columns. Verify the status change persists after page refresh |
| 7 | **Dashboard metrics** | Create multiple stories with different statuses. Verify dashboard percentages and counts are correct |
| 8 | **Story filters** | Search by title, filter by priority and assignee. Verify URL query parameters update and persist across navigation |
| 9 | **Cascade delete** | Delete a project. Verify all stories and memberships are removed |
| 10 | **User delete** | Delete a user who is assigned to stories. Verify stories still exist but `assignedUserId` is null |
| 11 | **Empty states** | Navigate to a new project's stories/team. Verify appropriate empty state messages display |
| 12 | **Error states** | Stop the backend server. Verify the frontend displays error alerts (not blank pages) |

---

## Business Rule Verification

These scenarios verify service-layer business rules enforced by the backend:

| Rule | Test | Expected Result |
|---|---|---|
| Story assignee must be a project member | Create a story with `assignedUserId` of a user who is NOT a member of the project | `400 Bad Request` with descriptive message |
| Story assignee must exist | Create a story with `assignedUserId: 99999` (nonexistent user) | `400 Bad Request` with message |
| Duplicate membership prevention | POST the same `userId` to a project's members twice | First: `201 Created`. Second: `409 Conflict` |
| Project must exist for story creation | POST story to `/api/projects/99999/stories` | `404 Not Found` |
| Cascade delete: project → stories | Delete a project with stories. Query stories by old project ID | Stories no longer exist |
| SetNull: user → story assignment | Delete a user assigned to stories. Query those stories | `assignedUserId` is `null`, stories still exist |

---

## Database Constraint Verification

| Constraint | Test | Expected Result |
|---|---|---|
| Unique index on `ProjectMembers(ProjectId, UserId)` | Bypass service layer and attempt direct duplicate INSERT | PostgreSQL rejects with unique violation |
| FK on `Stories.ProjectId` | Attempt to insert story with nonexistent `ProjectId` | PostgreSQL rejects with FK violation |
| FK on `Stories.AssignedUserId` | Attempt to insert story with nonexistent `AssignedUserId` | PostgreSQL rejects with FK violation |
| NOT NULL on required columns | Attempt to insert project with `Name = NULL` | PostgreSQL rejects |

---

## Future: Automated Testing

Automated testing is not currently implemented. The following would be recommended additions:

### Backend

| Test Type | Framework | Scope |
|---|---|---|
| Unit tests | xUnit + Moq | Service-layer business logic (e.g., `StoryService.ValidateAssigneeForProjectAsync`) |
| Integration tests | xUnit + `WebApplicationFactory` | End-to-end controller → database round trips with a test database |
| Repository tests | xUnit + In-Memory/SQLite provider | EF Core query correctness |

### Frontend

| Test Type | Framework | Scope |
|---|---|---|
| Component tests | Vitest + React Testing Library | Individual component rendering and user interactions |
| Hook tests | Vitest + `renderHook` | Context provider state management |
| E2E tests | Playwright or Cypress | Full user workflows (create project → add stories → use Kanban board) |
