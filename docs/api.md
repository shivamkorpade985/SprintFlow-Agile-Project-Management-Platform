# SprintFlow — REST API Reference

> Complete API documentation derived from the actual controller implementations, DTOs, and service-layer business rules.

**Base URL:** `http://localhost:5000`  
**Content Type:** `application/json`  
**Enum Serialization:** All enum values (`StoryStatus`, `StoryPriority`, `UserRole`) are serialized as **strings** via `JsonStringEnumConverter`.

**Related Documentation:**
- [Architecture](./architecture.md) — Backend layered architecture, dependency injection, transaction strategy
- [Database](./database.md) — Entity relationships, constraints, delete behaviors
- [Development](./development.md) — Setup and running the API locally

---

## Table of Contents

- [HTTP Status Codes](#http-status-codes)
- [Projects API](#projects-api)
- [Users API](#users-api)
- [Stories API](#stories-api)
- [Project Members API](#project-members-api)
- [Error Handling](#error-handling)
- [Validation](#validation)

---

## HTTP Status Codes

The API uses the following HTTP status codes consistently:

| Code | Meaning | Used When |
|---|---|---|
| `200 OK` | Request succeeded | Successful GET requests |
| `201 Created` | Resource created | Successful POST requests (includes `Location` header) |
| `204 No Content` | Request succeeded, no body | Successful PUT and DELETE requests |
| `400 Bad Request` | Invalid input | Validation failures, business rule violations |
| `404 Not Found` | Resource not found | Entity with specified ID does not exist |
| `409 Conflict` | Duplicate/conflict | Duplicate project membership |
| `500 Internal Server Error` | Server error | Unhandled exceptions (caught by GlobalExceptionMiddleware) |

---

## Projects API

**Controller:** `ProjectsController`  
**Route Prefix:** `/api/projects`

---

### GET /api/projects

Returns all projects ordered by creation date (newest first).

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "name": "SprintFlow Core Platform",
    "description": "Agile project management platform.",
    "createdAt": "2026-08-18T18:30:00Z",
    "updatedAt": null
  }
]
```

**Response DTO — `ProjectResponse`:**

| Field | Type | Description |
|---|---|---|
| `id` | `long` | Auto-generated numeric identifier |
| `name` | `string` | Project name |
| `description` | `string` | Project description |
| `createdAt` | `DateTime` | UTC timestamp of creation |
| `updatedAt` | `DateTime?` | UTC timestamp of last update (null if never updated) |

---

### GET /api/projects/{id}

Returns a single project by numeric ID.

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | `long` | Numeric project identifier |

**Responses:**

| Code | Body | Condition |
|---|---|---|
| `200 OK` | `ProjectResponse` | Project found |
| `404 Not Found` | `{ "message": "Project with ID '{id}' was not found." }` | No project with that ID |

---

### POST /api/projects

Creates a new project with an auto-generated numeric ID.

**Request Body — `CreateProjectRequest`:**

```json
{
  "name": "SprintFlow Core Platform",
  "description": "Next-generation agile sprint planning and tracking platform."
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `name` | `string` | Yes | 1–100 characters |
| `description` | `string` | Yes | 1–1000 characters |

**Responses:**

| Code | Body | Condition |
|---|---|---|
| `201 Created` | `ProjectResponse` | Success. Includes `Location` header via `CreatedAtAction` |
| `400 Bad Request` | Validation errors | Missing or invalid fields |

**`Location` Header:** Points to `GET /api/projects/{id}` for the newly created project.

---

### PUT /api/projects/{id}

Updates an existing project (full replacement).

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | `long` | Numeric project identifier |

**Request Body — `UpdateProjectRequest`:**

```json
{
  "name": "SprintFlow Core Platform (Updated)",
  "description": "Updated project description."
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `name` | `string` | Yes | 1–100 characters |
| `description` | `string` | Yes | 1–1000 characters |

**Responses:**

| Code | Body | Condition |
|---|---|---|
| `204 No Content` | — | Successfully updated |
| `400 Bad Request` | Validation errors | Missing or invalid fields |
| `404 Not Found` | `{ "message": "..." }` | No project with that ID |

---

### DELETE /api/projects/{id}

Deletes a project. **Cascades:** All stories and project member associations belonging to this project are also deleted (cascade delete configured in EF Core).

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | `long` | Numeric project identifier |

**Responses:**

| Code | Body | Condition |
|---|---|---|
| `204 No Content` | — | Successfully deleted |
| `404 Not Found` | `{ "message": "..." }` | No project with that ID |

---

## Users API

**Controller:** `UsersController`  
**Route Prefix:** `/api/users`

---

### GET /api/users

Returns all users ordered alphabetically by name.

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "name": "Alice Johnson",
    "role": "DEVELOPER",
    "avatar": "#1E64D4"
  }
]
```

**Response DTO — `UserResponse`:**

| Field | Type | Description |
|---|---|---|
| `id` | `long` | Auto-generated numeric identifier |
| `name` | `string` | User display name |
| `role` | `string` | Role string. Values: `"DEVELOPER"`, `"TESTER"`, `"MANAGER"` |
| `avatar` | `string?` | Avatar color hex or preset name (nullable) |

---

### GET /api/users/{id}

Returns a single user by numeric ID.

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | `long` | Numeric user identifier |

**Responses:**

| Code | Body | Condition |
|---|---|---|
| `200 OK` | `UserResponse` | User found |
| `404 Not Found` | `{ "message": "User with ID '{id}' was not found." }` | No user with that ID |

---

### POST /api/users

Creates a new user with an auto-generated numeric ID.

**Request Body — `CreateUserRequest`:**

```json
{
  "name": "Alice Johnson",
  "role": "DEVELOPER",
  "avatar": "#1E64D4"
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `name` | `string` | Yes | 1–100 characters |
| `role` | `UserRole` | Yes | Must be `"DEVELOPER"`, `"TESTER"`, or `"MANAGER"` |
| `avatar` | `string?` | No | Max 50 characters |

**Responses:**

| Code | Body | Condition |
|---|---|---|
| `201 Created` | `UserResponse` | Success. Includes `Location` header |
| `400 Bad Request` | Validation errors | Missing or invalid fields |

---

### PUT /api/users/{id}

Updates an existing user (full replacement).

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | `long` | Numeric user identifier |

**Request Body — `UpdateUserRequest`:**

```json
{
  "name": "Alice Johnson",
  "role": "MANAGER",
  "avatar": "#7C3AED"
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `name` | `string` | Yes | 1–100 characters |
| `role` | `UserRole` | Yes | Must be `"DEVELOPER"`, `"TESTER"`, or `"MANAGER"` |
| `avatar` | `string?` | No | Max 50 characters |

**Responses:**

| Code | Body | Condition |
|---|---|---|
| `204 No Content` | — | Successfully updated |
| `400 Bad Request` | Validation errors | Missing or invalid fields |
| `404 Not Found` | `{ "message": "..." }` | No user with that ID |

---

### DELETE /api/users/{id}

Deletes a user. **Side effects:**
- All project memberships for this user are **cascade deleted**
- All story assignments to this user are **set to null** (stories are preserved)

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | `long` | Numeric user identifier |

**Responses:**

| Code | Body | Condition |
|---|---|---|
| `204 No Content` | — | Successfully deleted |
| `404 Not Found` | `{ "message": "..." }` | No user with that ID |

---

## Stories API

**Controller:** `StoriesController`  
**Route Prefixes:** `/api/projects/{projectId}/stories` (project-scoped) and `/api/stories/{id}` (direct access)

---

### GET /api/projects/{projectId}/stories

Returns all user stories for a specific project, ordered by creation date (newest first).

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `projectId` | `long` | Numeric project identifier |

**Responses:**

| Code | Body | Condition |
|---|---|---|
| `200 OK` | `StoryResponse[]` | Stories returned (may be empty array) |
| `404 Not Found` | `{ "message": "..." }` | No project with that ID |

**Response DTO — `StoryResponse`:**

| Field | Type | Description |
|---|---|---|
| `id` | `long` | Auto-generated numeric identifier |
| `projectId` | `long` | Owning project identifier |
| `title` | `string` | Story title |
| `description` | `string` | Story description |
| `priority` | `string` | `"LOW"`, `"MEDIUM"`, or `"HIGH"` |
| `storyPoints` | `int` | Effort estimate (1–100) |
| `assignedUserId` | `long?` | Assigned user ID or `null` if unassigned |
| `status` | `string` | `"BACKLOG"`, `"IN_PROGRESS"`, `"TESTING"`, or `"DONE"` |
| `createdAt` | `DateTime` | UTC timestamp of creation |

---

### GET /api/stories/{id}

Returns a single story by numeric ID.

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | `long` | Numeric story identifier |

**Responses:**

| Code | Body | Condition |
|---|---|---|
| `200 OK` | `StoryResponse` | Story found |
| `404 Not Found` | `{ "message": "Story with ID '{id}' was not found." }` | No story with that ID |

---

### POST /api/projects/{projectId}/stories

Creates a new user story in the specified project.

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `projectId` | `long` | Numeric project identifier (from route, NOT request body) |

**Request Body — `CreateStoryRequest`:**

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

| Field | Type | Required | Validation |
|---|---|---|---|
| `title` | `string` | Yes | 1–200 characters |
| `description` | `string` | Yes | 1–2000 characters |
| `priority` | `StoryPriority` | Yes | `"LOW"`, `"MEDIUM"`, `"HIGH"` (default: `MEDIUM`) |
| `storyPoints` | `int` | Yes | Range 1–100 |
| `assignedUserId` | `long?` | No | If provided, must pass assignment validation (see below) |
| `status` | `StoryStatus` | Yes | `"BACKLOG"`, `"IN_PROGRESS"`, `"TESTING"`, `"DONE"` (default: `BACKLOG`) |

**Business Rule — Story Assignment Validation:**

When `assignedUserId` is provided, `StoryService.ValidateAssigneeForProjectAsync()` enforces:

1. The user with `assignedUserId` **must exist** in the `Users` table
2. The user **must be an active member** of the story's project (via `ProjectMembers`)

If either check fails → `400 Bad Request` with a descriptive error message.

**Responses:**

| Code | Body | Condition |
|---|---|---|
| `201 Created` | `StoryResponse` | Success. Includes `Location` header pointing to `GET /api/stories/{id}` |
| `400 Bad Request` | `{ "message": "..." }` | Validation failure or assignee not a project member |
| `404 Not Found` | `{ "message": "..." }` | Project does not exist |

---

### PUT /api/stories/{id}

Updates an existing story (full replacement). This endpoint is used for both **story editing** and **Kanban status changes** — both send a complete payload.

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | `long` | Numeric story identifier |

**Request Body — `UpdateStoryRequest`:**

```json
{
  "title": "Implement user authentication",
  "description": "Updated description.",
  "priority": "HIGH",
  "storyPoints": 8,
  "assignedUserId": 1,
  "status": "IN_PROGRESS"
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `title` | `string` | Yes | 1–200 characters |
| `description` | `string` | Yes | 1–2000 characters |
| `priority` | `StoryPriority` | Yes | `"LOW"`, `"MEDIUM"`, `"HIGH"` |
| `storyPoints` | `int` | Yes | Range 1–100 |
| `assignedUserId` | `long?` | No | If provided, same assignment validation applies. Passing `null` clears assignment |
| `status` | `StoryStatus` | Yes | `"BACKLOG"`, `"IN_PROGRESS"`, `"TESTING"`, `"DONE"` |

> **Note:** `projectId` is NOT included in the update request. The story's project association cannot be changed after creation.

**Responses:**

| Code | Body | Condition |
|---|---|---|
| `204 No Content` | — | Successfully updated |
| `400 Bad Request` | `{ "message": "..." }` | Validation failure or assignee not a project member |
| `404 Not Found` | `{ "message": "..." }` | No story with that ID |

---

### DELETE /api/stories/{id}

Deletes a user story.

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | `long` | Numeric story identifier |

**Responses:**

| Code | Body | Condition |
|---|---|---|
| `204 No Content` | — | Successfully deleted |
| `404 Not Found` | `{ "message": "Story with ID '{id}' was not found." }` | No story with that ID |

---

## Project Members API

**Controller:** `ProjectMembersController`  
**Route Prefix:** `/api/projects/{projectId}/members`

---

### GET /api/projects/{projectId}/members

Returns all team members for a project, including nested user details.

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `projectId` | `long` | Numeric project identifier |

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "projectId": 1,
    "userId": 1,
    "user": {
      "id": 1,
      "name": "Alice Johnson",
      "role": "DEVELOPER",
      "avatar": "#1E64D4"
    }
  }
]
```

**Response DTO — `ProjectMemberResponse`:**

| Field | Type | Description |
|---|---|---|
| `id` | `long` | Membership record identifier |
| `projectId` | `long` | Project identifier |
| `userId` | `long` | User identifier |
| `user` | `UserResponse?` | Nested user details (included via `.Include(pm => pm.User)`) |

**Responses:**

| Code | Body | Condition |
|---|---|---|
| `200 OK` | `ProjectMemberResponse[]` | Members listed (may be empty) |
| `404 Not Found` | `{ "message": "..." }` | Project does not exist |

---

### POST /api/projects/{projectId}/members

Adds a user as a member of a project.

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `projectId` | `long` | Numeric project identifier (from route) |

**Request Body — `AddProjectMemberRequest`:**

```json
{
  "userId": 1
}
```

| Field | Type | Required | Validation |
|---|---|---|---|
| `userId` | `long` | Yes | Must be a positive number (`[Range(1, long.MaxValue)]`) |

**Business Rules (enforced by `ProjectMemberService`):**

1. The project must exist → `404 Not Found` if not
2. The user must exist → `404 Not Found` if not
3. The user must NOT already be a member of this project → `409 Conflict` if duplicate

**Responses:**

| Code | Body | Condition |
|---|---|---|
| `201 Created` | `ProjectMemberResponse` | Success. Includes `Location` header |
| `400 Bad Request` | Validation errors | Invalid `userId` |
| `404 Not Found` | `{ "message": "..." }` | Project or user does not exist |
| `409 Conflict` | `{ "message": "..." }` | User is already a member of this project |

---

### DELETE /api/projects/{projectId}/members/{userId}

Removes a user from a project's team.

**Path Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `projectId` | `long` | Numeric project identifier |
| `userId` | `long` | Numeric user identifier |

**Responses:**

| Code | Body | Condition |
|---|---|---|
| `204 No Content` | — | Successfully removed |
| `404 Not Found` | `{ "message": "..." }` | Membership not found, project not found, or user not a member |

---

## Error Handling

### Global Exception Middleware

`GlobalExceptionMiddleware` wraps the entire request pipeline. Any unhandled exception is caught, logged with stack trace, and returned as:

```json
{
  "message": "An unexpected server error occurred. Please try again later."
}
```

**Status Code:** `500 Internal Server Error`

No internal details (stack traces, connection strings, entity names) are exposed to API consumers.

### Controller-Level Exception Translation

Controllers catch specific exception types thrown by services and translate them to HTTP status codes:

| Exception Type | HTTP Status | Used For |
|---|---|---|
| `KeyNotFoundException` | `404 Not Found` | Entity not found (project, user, story) |
| `InvalidOperationException` | `400 Bad Request` or `409 Conflict` | Business rule violations (invalid assignee, duplicate member) |

### Model Validation

ASP.NET Core automatically validates `[FromBody]` request DTOs against Data Annotations:

| Annotation | Effect | Example |
|---|---|---|
| `[Required]` | Field must be present and non-null | `"Project name is required."` |
| `[StringLength(max, MinimumLength = min)]` | String length constraint | `"Project name must be between 1 and 100 characters."` |
| `[Range(min, max)]` | Numeric range constraint | `"Story points must be between 1 and 100."` |

When validation fails, the controller returns `400 Bad Request` with a `ModelState` dictionary containing field-specific error messages.

---

## Validation

### Data Annotation Validation (Automatic)

| DTO | Field | Rule |
|---|---|---|
| `CreateProjectRequest` | `name` | Required, 1–100 chars |
| `CreateProjectRequest` | `description` | Required, 1–1000 chars |
| `UpdateProjectRequest` | `name` | Required, 1–100 chars |
| `UpdateProjectRequest` | `description` | Required, 1–1000 chars |
| `CreateUserRequest` | `name` | Required, 1–100 chars |
| `CreateUserRequest` | `role` | Required, valid `UserRole` enum |
| `CreateUserRequest` | `avatar` | Optional, max 50 chars |
| `UpdateUserRequest` | `name` | Required, 1–100 chars |
| `UpdateUserRequest` | `role` | Required, valid `UserRole` enum |
| `UpdateUserRequest` | `avatar` | Optional, max 50 chars |
| `CreateStoryRequest` | `title` | Required, 1–200 chars |
| `CreateStoryRequest` | `description` | Required, 1–2000 chars |
| `CreateStoryRequest` | `priority` | Required, valid `StoryPriority` enum |
| `CreateStoryRequest` | `storyPoints` | Required, range 1–100 |
| `CreateStoryRequest` | `status` | Required, valid `StoryStatus` enum |
| `UpdateStoryRequest` | `title` | Required, 1–200 chars |
| `UpdateStoryRequest` | `description` | Required, 1–2000 chars |
| `UpdateStoryRequest` | `priority` | Required, valid `StoryPriority` enum |
| `UpdateStoryRequest` | `storyPoints` | Required, range 1–100 |
| `UpdateStoryRequest` | `status` | Required, valid `StoryStatus` enum |
| `AddProjectMemberRequest` | `userId` | Required, must be ≥ 1 |

### Service-Layer Business Validation

| Rule | Service | Behavior |
|---|---|---|
| Story assignee must exist as a user | `StoryService` | `InvalidOperationException` → `400 Bad Request` |
| Story assignee must be a project member | `StoryService` | `InvalidOperationException` → `400 Bad Request` |
| Project must exist (for story listing) | `StoryService` | `KeyNotFoundException` → `404 Not Found` |
| Project must exist (for member ops) | `ProjectMemberService` | `KeyNotFoundException` → `404 Not Found` |
| User must exist (for member add) | `ProjectMemberService` | `KeyNotFoundException` → `404 Not Found` |
| User must not already be a member | `ProjectMemberService` | `InvalidOperationException` → `409 Conflict` |

### Database-Level Constraints

| Constraint | Table | Effect |
|---|---|---|
| Unique index `(ProjectId, UserId)` | `ProjectMembers` | Prevents duplicate memberships at DB level (defense in depth) |
| Foreign key `ProjectId` | `Stories` | Cannot reference non-existent project |
| Foreign key `AssignedUserId` | `Stories` | Cannot reference non-existent user (when not null) |
