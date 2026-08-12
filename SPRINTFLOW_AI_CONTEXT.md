# SPRINTFLOW — AI ENGINEERING CONTEXT

> Working source of truth for AI-assisted development of SprintFlow.
> Place this file at the repository root and give it to Antigravity before implementation work.

## 1. Project

**SprintFlow — Agile Project Management Platform**

Goal: manage multiple projects, team members, user stories, assignments, workflow states, Kanban visualization, search/filtering, and persistent application state.

### Stack

- React
- TypeScript
- Vite
- Material UI (MUI)
- React Router
- ESLint

Current persistence:

```text
React UI
  ↓
Application / Feature State
  ↓
Repository Interface
  ↓
LocalStorage Repository
  ↓
LocalStorage
```

Future:

```text
React UI
  ↓
Application / Feature State
  ↓
Repository Interface
  ↓
API Repository
  ↓
API Client
  ↓
REST API
  ↓
.NET Backend
  ↓
Database
```

**Critical principle:** the UI must not depend directly on LocalStorage or HTTP. Backend migration should require changing the repository implementation, not rewriting UI components.

---

## 2. Product Scope

Required:

- Multiple projects
- Multiple users per project
- Multiple stories
- Story assignment
- Workflow tracking
- Kanban board
- Persistent state
- Search
- User filtering
- Priority filtering
- My Tasks
- URL-driven routing/filter state
- Cross-view synchronization

The product is primarily implementing Agile project-management concepts with a Kanban-style workflow.

Do **not** introduce unnecessary Scrum concepts such as Sprint ceremonies, Scrum Master, Product Owner, etc.

---

## 3. Domain Model

### Project

```ts
interface Project {
  id: string;
  name: string;
}
```

Existing implementation may contain additional fields such as `description`; preserve working fields.

### User

```ts
interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarColor: string;
}

type UserRole =
  | "DEVELOPER"
  | "TESTER"
  | "MANAGER";
```

### User Story

```ts
interface UserStory {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: StoryPriority;
  storyPoints: number;
  assignedUserId?: string;
  status: StoryStatus;
  createdAt: string;
}
```

```ts
type StoryPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

type StoryStatus =
  | "BACKLOG"
  | "IN_PROGRESS"
  | "TESTING"
  | "DONE";
```

Use IDs for relationships. Do not embed complete User objects inside UserStory as the primary persisted representation.

Use ISO-8601 strings for persisted/API-facing dates.

---

## 4. Feature Architecture

Current structure:

```text
frontend/
└── src/
    ├── app/
    │   ├── layouts/
    │   ├── theme/
    │   └── router.tsx
    ├── constants/
    ├── features/
    │   ├── projects/
    │   ├── team/
    │   ├── stories/
    │   └── board/
    ├── repositories/
    ├── storage/
    ├── types/
    ├── pages/
    ├── index.css
    └── main.tsx
```

### Mentor-mandated folder rule

If a page primarily exists because of a feature, it belongs inside that feature.

If a type primarily belongs to a feature, keep it inside that feature's `types` directory.

Preferred pattern:

```text
features/
├── projects/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   └── types/
├── team/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   └── types/
├── stories/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   └── types/
└── board/
    ├── components/
    ├── hooks/
    └── types/
```

`src/pages` is only for genuinely general/application-wide pages.

---

## 5. Current Routes

```text
/projects
/projects/:projectId
/projects/:projectId/board
/projects/:projectId/stories
/projects/:projectId/stories/:storyId
/projects/:projectId/team
/projects/:projectId/team/:userId
```

The router uses `createBrowserRouter`.

The application uses `AppLayout` and nested routing.

Path parameters represent identity:

- `projectId`
- `storyId`
- `userId`

Query parameters should represent search/filter state.

---

## 6. Current Implementation Status

### Foundation — COMPLETE

- React + TypeScript
- Vite
- ESLint
- MUI
- MUI theme
- ThemeProvider
- React Router
- AppLayout
- Nested routing
- Git repository
- GitHub remote
- Development branch workflow
- `npm run lint` and `npm run build` used as validation gates

### Projects — COMPLETE

Implemented:

- Create project
- List projects
- Select/open project
- Project overview
- Edit project
- Delete project
- Persistence
- Repository abstraction
- Context/provider
- Project form dialog
- Feature-specific pages/types

Flow:

```text
Projects
 ↓
Create Project
 ↓
Persist Project
 ↓
Project Card
 ↓
Open Project
 ↓
/projects/:projectId
 ↓
Project Overview
 ├── Board
 ├── Stories
 └── Team
```

### Team — IMPLEMENTED / REFINEMENT MAY REMAIN

Existing architecture includes:

```text
features/team/
├── components/
├── context/
│   ├── projectTeamContext.ts
│   └── ProjectTeamProvider.tsx
├── hooks/
│   └── useProjectTeam.ts
└── types/
```

Also present:

- User repository
- Project member repository
- LocalStorage project-member repository
- Team provider
- Add-member functionality

User and project membership remain separate concepts.

### Stories — COMPLETE FOR CURRENT FRONTEND SCOPE

Implemented:

- Story types
- Request contracts
- Repository interface
- LocalStorage repository
- StoriesProvider
- StoriesContext
- `useStories`
- Create
- List
- Edit
- Delete
- Assignment
- Status
- Story detail
- Navigation
- Back-to-project navigation
- Edit dialog populated with existing story values
- Project-scoped stories

Current flow:

```text
StoriesPage
 ↓
StoriesProvider
 ↓
useStories()
 ↓
StoryRepository
 ↓
LocalStorageStoryRepository
 ↓
LocalStorage
```

**Story status is the workflow source of truth.**

---

## 7. Remaining Roadmap

Do not incorrectly say that only two features remain.

Major remaining work:

```text
Projects             ✅
Team                 ✅ / refinement as needed
Stories              ✅
Kanban               🚧 NEXT
Dashboard            🚧
Search & Filtering   🚧
Routing refinement   🚧
UX states            🚧
Validation           🚧
Accessibility        🚧
Responsive review    🚧
Performance review   🚧
Testing              🚧
Code cleanup         🚧
Backend preparation  🚧
Backend integration  → after frontend completion
```

Immediate priority: **Kanban Board**.

---

## 8. Kanban Architecture

The board must derive columns from existing stories.

```text
Stories
 ↓
groupByStatus()
 ↓
┌──────────┬─────────────┬─────────┬──────┐
│ Backlog  │ In Progress │ Testing │ Done │
└──────────┴─────────────┴─────────┴──────┘
```

**Do not create a separate Kanban data model or persistence source.**

Status change:

```text
User changes status
 ↓
updateStory()
 ↓
StoryRepository
 ↓
Stories state
 ↓
React re-render
 ↓
Board + Stories + Detail + other consumers update
```

Initial implementation does not require drag-and-drop. Buttons/selects are acceptable.

If drag-and-drop is added later:

```text
Drag and Drop
 ↓
updateStoryStatus()
 ↓
same Story model
```

---

## 9. Source of Truth

One application data source must feed all views.

```text
Story state
   ↓
Board
Dashboard
Stories list
Story detail
Team/user views
```

Do not maintain duplicate copies such as:

```text
boardStories
dashboardStories
userStories
detailStory
```

when these can be derived.

Example:

```text
stories
 +
filters
 ↓
filteredStories

filteredStories
 +
status
 ↓
kanbanColumns

stories
 ↓
dashboardStats
```

Derived data should be computed, not independently stored.

---

## 10. State Strategy

Do not introduce Redux/Zustand merely because they are popular.

Use:

- React state
- Context where genuinely useful
- Repository abstraction
- Derived state
- URL state

State categories:

| State | Example | Location |
|---|---|---|
| Application data | projects, users, stories | Context/provider |
| UI state | dialog open/closed | Component |
| URL state | IDs/search/filters | Router URL |
| Persistent state | LocalStorage | Repository |
| Derived state | filtered stories/columns | Computed |
| Form state | title/description | Form |
| Future server state | API data | API/application layer |

---

## 11. Repository Rules

Bad:

```text
StoryCard
 ↓
localStorage
```

Good:

```text
StoryCard
 ↓
callback
 ↓
StoriesProvider
 ↓
StoryRepository
 ↓
LocalStorageStoryRepository
```

Future:

```text
StoriesProvider
 ↓
StoryRepository
 ↓
ApiStoryRepository
 ↓
API Client
 ↓
REST API
```

Avoid excessive abstraction chains. Prefer:

```text
UI
 ↓
Feature/Application Logic
 ↓
Repository
 ↓
Data Source
```

---

## 12. Backend Compatibility

Conceptual APIs only — these are not confirmed existing backend APIs.

Projects:

```text
GET    /api/projects
GET    /api/projects/{id}
POST   /api/projects
PUT    /api/projects/{id}
DELETE /api/projects/{id}
```

Project users:

```text
GET    /api/projects/{projectId}/users
POST   /api/projects/{projectId}/users
GET    /api/projects/{projectId}/users/{userId}
PUT    /api/projects/{projectId}/users/{userId}
DELETE /api/projects/{projectId}/users/{userId}
```

Project stories:

```text
GET    /api/projects/{projectId}/stories
POST   /api/projects/{projectId}/stories
GET    /api/projects/{projectId}/stories/{storyId}
PUT    /api/projects/{projectId}/stories/{storyId}
DELETE /api/projects/{projectId}/stories/{storyId}
```

Before backend integration, confirm:

- DTOs
- endpoints
- IDs
- dates
- enums
- relationships
- request structures
- response structures
- validation
- errors

---

## 13. Backend Migration Rule

If connecting the backend requires rewriting UI components, the architecture has failed.

Expected:

```text
- LocalStorageStoryRepository
+ ApiStoryRepository
```

Not:

```text
- Rewrite StoryPage
- Rewrite StoryCard
- Rewrite Board
- Rewrite Dashboard
- Rewrite StoryForm
```

Migration sequence:

1. Confirm backend contract
2. Create API client
3. Implement API repository
4. Replace Project repository
5. Replace User repository
6. Replace Story repository
7. Migrate status operations
8. Remove LocalStorage only after API-backed flow is stable

---

## 14. Search & Filtering

Required:

- Search by title
- User filter
- Priority filter
- My Tasks

Pipeline:

```text
Project Stories
 ↓
Search
 ↓
User Filter
 ↓
Priority Filter
 ↓
My Tasks
 ↓
Visible Stories
```

Prefer pure transformation functions.

Filters should live in URL query parameters, e.g.:

```text
/projects/p1/stories?search=login&priority=HIGH&user=u1&myTasks=true
```

"My Tasks" currently requires a current-user concept. Authentication is not confirmed in the current scope. If a mock current user is needed, isolate it clearly.

---

## 15. Dashboard

Dashboard must derive metrics from existing story state.

```text
stories
 ↓
calculateStats()
 ↓
Total
Backlog
In Progress
Testing
Done
```

Optional useful metrics:

- Completion percentage
- Story points
- User workload

Do not create duplicate dashboard state.

---

## 16. UX States

Major screens should support:

- Loading
- Error
- Empty
- Success
- Validation
- Confirmation

Example:

```text
Loading Stories...
No stories found.
Unable to load stories.
Try again.
```

---

## 17. Validation

Frontend validation improves UX.

Typical Story validation:

- Title required
- Description required
- Priority valid
- Story points positive
- Status valid
- Assignee according to current product rule

Backend validation will be authoritative after integration.

---

## 18. Security

Frontend role checks are UX only, not real security.

After backend integration:

```text
Frontend
 ↓
Backend authentication/authorization
 ↓
Database
```

Backend must enforce authentication, authorization, RBAC and validation.

Do not add authentication unless explicitly required.

---

## 19. Accessibility & Responsive Design

Use:

- Semantic HTML
- Proper labels
- Keyboard navigation
- Visible focus states
- Accessible buttons
- Meaningful error messages
- Modal focus management
- Sufficient contrast

Target:

- Desktop first
- Tablet
- Mobile

---

## 20. Performance

Do not prematurely optimize.

Start with normal React rendering.

Use `useMemo`, `useCallback`, or `React.memo` only when there is a demonstrated reason.

---

## 21. Git Workflow

Repository:

```text
SprintFlow-Agile-Project-Management-Platform/
├── frontend/
└── backend/
```

Mentor workflow:

```text
main
  ↓
development
  ↓
daily implementation
  ↓
commit
  ↓
push development
  ↓
raise PR before mentor meeting
  ↓
mentor review
  ↓
approval/merge
```

Do not push development work directly to `main`.

Typical:

```bash
git status
git add .
git commit -m "feat: ..."
git push origin development
```

Then raise the PR from `development` to `main`.

---

## 22. Commit Convention

Good:

```text
feat: implement project management flow
feat: implement team management
feat: implement story management
feat: add kanban workflow
feat: add story filtering
feat: add dashboard metrics
test: add story domain tests
refactor: simplify story state management
fix: correct story detail navigation
```

Avoid:

```text
update
changes
final
final2
done
```

A commit should represent one coherent logical change.

---

## 23. Validation Gates

Before considering a task complete:

```bash
npm run lint
npm run build
```

Then manually test the relevant user flow.

Do not suppress TypeScript/ESLint errors without addressing the cause.

---

## 24. AI MUST NOT

Antigravity must NOT:

- Rewrite working features unnecessarily
- Recreate existing repositories
- Create duplicate contexts without justification
- Put feature-specific pages in `src/pages`
- Put feature-specific types in global `src/types`
- Access LocalStorage from UI components
- Create duplicate story/board/dashboard state
- Create a separate Kanban persistence model
- Introduce Redux/Zustand without a real architectural reason
- Install libraries without justification
- Invent backend APIs as existing APIs
- Add authentication when not confirmed
- Add unnecessary Scrum functionality
- Add drag-and-drop before basic Kanban works
- Perform broad unrelated refactors
- Change unrelated working files
- Suppress lint/type errors
- Optimize prematurely

---

## 25. ANTIGRAVITY WORKING PROTOCOL

Before implementing any task:

### Step 1 — Inspect

Inspect relevant:

- Types
- Repositories
- Providers/contexts
- Hooks
- Routes
- Components
- Tests
- Existing conventions

### Step 2 — Explain

State:

- What will change
- Why
- Files involved
- Existing code being reused
- How backend compatibility is preserved

### Step 3 — Implement

Implement only the requested slice.

Do not expand scope without approval.

### Step 4 — Validate

Run:

```bash
npm run lint
npm run build
```

Then manually verify the relevant UI.

### Step 5 — Explain

Explain briefly:

- Data flow
- State ownership
- Repository interaction
- Important TypeScript decisions
- Edge cases
- Backend compatibility

### Step 6 — Stop

Do not automatically start another feature.

---

## 26. HUMAN + AI LEARNING WORKFLOW

The goal is speed **without losing learning**.

Use:

```text
Requirement
 ↓
Developer understands requirement
 ↓
AI proposes plan
 ↓
Antigravity implements small slice
 ↓
Developer reviews code
 ↓
Developer runs/tests application
 ↓
AI explains/fixes issues
 ↓
Lint
 ↓
Build
 ↓
Commit
 ↓
PR
```

For every feature, the developer should be able to answer:

1. Why does this file exist?
2. Why does this state live here?
3. What is the source of truth?
4. What changes when the backend replaces LocalStorage?
5. What can fail?

Never blindly accept generated code.

---

## 27. IMMEDIATE ROADMAP

```text
CURRENT
  ↓
Kanban Board
  ↓
Dashboard
  ↓
Search & Filtering
  ↓
Routing refinement
  ↓
Loading/Error/Empty/Success/Confirmation
  ↓
Validation
  ↓
Accessibility
  ↓
Responsive review
  ↓
Performance review
  ↓
Tests
  ↓
Code cleanup
  ↓
Backend contract alignment
  ↓
.NET backend
  ↓
API repositories
```

---

## 28. FIRST KANBAN TASK

Before coding, inspect:

```text
features/board/
features/stories/
features/stories/context/
features/stories/hooks/
features/stories/types/
repositories/StoryRepository.ts
repositories/local/LocalStorageStoryRepository.ts
app/router.tsx
```

Reuse the existing Stories state.

Expected:

```text
StoriesProvider
 ↓
stories
 ↓
project stories
 ↓
groupByStatus()
 ↓
Kanban columns
 ↓
Story cards
 ↓
status change
 ↓
updateStory()
 ↓
StoriesProvider
 ↓
all consumers update
```

---

## 29. ENGINEERING LEARNING OUTCOME

The goal is not simply to build a Kanban board.

The intended engineering progression is:

```text
Requirement
 ↓
Domain Model
 ↓
TypeScript Contract
 ↓
Architecture
 ↓
State Design
 ↓
Data Access Abstraction
 ↓
Feature
 ↓
UI
 ↓
Testing
 ↓
Backend Integration
```

Guiding principle:

> Simple enough to understand, structured enough to scale, and designed so the backend can replace LocalStorage without forcing a frontend rewrite.

---

## 30. SOURCE / AUTHORITY RULE

This context consolidates the uploaded project requirements, project details, blueprint, and implementation progress through August 12, 2026.

If this document conflicts with the actual repository code:

1. Inspect the repository first.
2. Preserve working functionality.
3. Do not blindly overwrite code.

If an old planning statement conflicts with a current explicit mentor instruction, follow the current mentor instruction.

---

# END OF SPRINTFLOW AI CONTEXT
