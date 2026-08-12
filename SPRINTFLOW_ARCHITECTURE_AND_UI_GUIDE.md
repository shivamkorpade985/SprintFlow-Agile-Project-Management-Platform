# SprintFlow Architecture & UI Engineering Guide

> **Target Audience:** Developers & Engineers working on SprintFlow.  
> **Source of Truth:** Inspected directly from the SprintFlow repository structure, React component tree, TypeScript contracts, and repository implementations.

---

## 1. Project Overview

### What SprintFlow Is
**SprintFlow** is an Agile Project Management Platform designed for managing software projects, team members, user stories, work item assignments, workflow states, Kanban visual boards, and project dashboards.

The platform provides a streamlined, responsive client-side interface for tracking project progress through standard Agile/Kanban stages: **Backlog**, **In Progress**, **Testing**, and **Done**.

### Main User Workflows
1. **Project Lifecycle Management:** Create new projects, edit project details, delete projects, and view high-level project metrics.
2. **Team Member Management:** Seed system users, manage project-specific team memberships, and assign users to project roles (Developer, Tester, Manager).
3. **User Story Management:** Create, list, edit, assign, prioritize, and delete user stories scoped to individual projects.
4. **Kanban Board Visualization:** Track and transition user story workflow states across Kanban columns in real time.
5. **Project Overview & Metrics:** Monitor project completion rates, story point velocity, recent story activities, and team member summaries via the project dashboard.

### Current Frontend Scope & Persistence
SprintFlow is currently implemented as a client-side Single-Page Application (SPA) built with React 19, TypeScript 6, Vite 8, Material UI 9, and React Router 8. Data is currently persisted locally using browser `localStorage` via a strict Repository Pattern abstraction.

### Persistence Architecture
```text
Current Implementation:
┌─────────────────────────────────────────────────────────────┐
│                          React UI                           │
│     (Pages, Cards, Dialogs, Dashboard, Kanban View)         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Custom Hooks                           │
│            (useProjects, useStories, useProjectTeam)        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      React Context                          │
│     (ProjectsContext, StoriesContext, ProjectTeamContext)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     React Providers                         │
│   (ProjectsProvider, StoriesProvider, ProjectTeamProvider)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                  Repository Interfaces                      │
│ (ProjectRepository, StoryRepository, UserRepository, etc.) │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                Repository Implementations                   │
│   (LocalStorageProjectRepository, LocalStorageStoryRepo)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 LocalStorage Access Layer                   │
│             (getItem, setItem, storageKeys.ts)             │
└─────────────────────────────────────────────────────────────┘
```

### Future Backend Direction
In the future, the frontend will connect to a **.NET REST API** backed by a database. Because the UI communicates exclusively with Contexts, Providers, and Repository Interfaces, replacing `LocalStorage` with an HTTP API client requires updating **only the repository implementations** without modifying a single line of React UI code.

```text
Future / Planned Architecture:
React UI → Custom Hooks → Context → Provider → Repository Interface → ApiStoryRepository → Axios/Fetch Client → REST API (.NET) → SQL Database
```

---

## 2. Technology Stack

The actual tools and dependencies defined in [`frontend/package.json`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/package.json) are:

| Technology / Library | Version | Purpose |
|---|---|---|
| **React** | `^19.2.8` | Core UI library for declarative component rendering |
| **React DOM** | `^19.2.8` | DOM renderer for React |
| **TypeScript** | `~6.0.2` | Static type checking and domain contract enforcement |
| **Vite** | `^8.2.0` | Fast build system and development server |
| **@vitejs/plugin-react** | `^6.0.4` | Vite plugin for React HMR and JSX transformation |
| **Material UI (MUI)** | `^9.3.1` | Component library providing layout grid, cards, dialogs, buttons, and inputs |
| **MUI Icons** | `^9.3.1` | SVG icon library for Material UI |
| **@emotion/react** | `^11.14.0` | Styling engine for Material UI |
| **@emotion/styled** | `^11.14.1` | Styled components API for Material UI |
| **React Router** | `^8.3.0` | Client-side routing engine (`createBrowserRouter`, `RouterProvider`, `Outlet`) |
| **ESLint** | `^10.8.0` | Code linting and formatting validation |
| **typescript-eslint** | `^8.65.0` | TypeScript linting integration for ESLint |
| **eslint-plugin-react-hooks** | `^7.1.1` | Rules enforcement for React Hooks (`useEffect`, `useCallback`) |

---

## 3. Repository Structure

The frontend repository layout in [`frontend/src`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src):

```text
frontend/src/
├── app/                                 # Global application setup & shell
│   ├── layouts/
│   │   └── AppLayout.tsx               # Main responsive layout wrapper (AppBar, Drawer, Outlet)
│   ├── theme/
│   │   └── theme.ts                    # MUI theme configuration
│   └── router.tsx                      # React Router configuration & route definitions
├── constants/                           # Global application constants
│   └── storageKeys.ts                  # LocalStorage key declarations
├── features/                            # Domain feature modules
│   ├── board/                          # Kanban Board feature
│   │   ├── components/
│   │   │   ├── BoardPage.tsx           # Page entry for Kanban board
│   │   │   ├── KanbanBoardView.tsx     # Board column grid & status filtering view
│   │   │   └── KanbanCard.tsx          # Card item with status update dropdown
│   │   ├── context/                    # (Empty by design - derives from StoriesContext)
│   │   ├── hooks/                      # (Empty by design - uses useStories hook)
│   │   └── types/                      # Feature types container
│   ├── projects/                       # Projects domain feature
│   │   ├── components/
│   │   │   ├── CreateProjectDialog.tsx # Modal dialog for creating projects
│   │   │   ├── DashboardStatCard.tsx   # Reusable metric card widget
│   │   │   ├── ProjectDashboardContent.tsx # Dashboard overview with progress & metrics
│   │   │   ├── ProjectFormDialog.tsx   # Generic project edit/create modal
│   │   │   ├── ProjectOverviewPage.tsx # Page entry for project overview dashboard
│   │   │   └── ProjectsPage.tsx        # Projects list page
│   │   ├── context/
│   │   │   ├── ProjectsProvider.tsx    # State provider for global projects
│   │   │   └── projectsContext.ts      # Context declaration for projects
│   │   ├── hooks/
│   │   │   └── useProjects.ts          # Custom hook to consume ProjectsContext
│   │   ├── projectRepository.ts        # Singleton instance export of ProjectRepository
│   │   └── types/                      # Domain entities & request contract definitions
│   ├── stories/                        # User Stories domain feature
│   │   ├── components/
│   │   │   ├── CreateStoryDialog.tsx   # Modal for creating user stories
│   │   │   ├── EditStoryDialog.tsx     # Modal for editing existing stories
│   │   │   ├── StoriesPage.tsx         # Stories listing page
│   │   │   ├── StoryCard.tsx           # Individual story list card
│   │   │   └── StoryDetailPage.tsx     # Detailed view of a single user story
│   │   ├── context/
│   │   │   ├── StoriesProvider.tsx     # State provider for project-scoped stories
│   │   │   └── storiesContext.ts       # Context declaration for stories
│   │   ├── hooks/
│   │   │   └── useStories.ts           # Custom hook to consume StoriesContext
│   │   └── types/                      # Domain types & request contracts for stories
│   └── team/                           # Team domain feature
│       ├── components/
│       │   ├── AddMemberDialog.tsx     # Modal to add user to project team
│       │   ├── TeamPage.tsx            # Team membership listing page
│       │   └── UserDetailPage.tsx      # Detailed view of individual team user
│       ├── context/
│       │   ├── ProjectTeamProvider.tsx # State provider for project team members
│       │   └── projectTeamContext.ts   # Context declaration for project team
│       ├── data/
│       │   ├── initializeTeamData.ts   # Seed script for initial team data
│       │   └── seedUsers.ts            # Default seed users list
│       ├── hooks/
│       │   └── useProjectTeam.ts       # Custom hook to consume ProjectTeamContext
│       └── types/                      # User & ProjectMember domain definitions
├── repositories/                        # Abstract repository interfaces & concrete implementations
│   ├── ProjectMemberRepository.ts      # Interface for project team memberships
│   ├── ProjectRepository.ts            # Interface for project CRUD
│   ├── StoryRepository.ts              # Interface for story CRUD
│   ├── UserRepository.ts               # Interface for user management
│   └── local/                           # Concrete LocalStorage implementations
│       ├── LocalStorageProjectMemberRepository.ts
│       ├── LocalStorageProjectRepository.ts
│       ├── LocalStorageStoryRepository.ts
│       └── LocalStorageUserRepository.ts
├── storage/                             # Raw localStorage utility wrapper
│   └── localStorage.ts                 # Safe getItem, setItem, removeItem wrappers
├── types/                               # (Reserved for shared cross-feature contracts)
├── index.css                            # Global CSS reset & base styles
└── main.tsx                             # Application bootstrap & entry point
```

> [!NOTE]
> **Implementation Note regarding `src/pages/`:**
> `src/pages/` is **not present** in the repository. This is intentional and follows the project architectural rule: feature-specific pages belong inside their feature folder (`features/<feature_name>/components/`). Global pages are only placed in `src/pages` if they are application-wide (e.g. static 404 pages).

---

## 4. Feature-Based Architecture

SprintFlow strictly enforces **Feature-Based Architecture**. Code is structured around business domain domains (**Projects**, **Team**, **Stories**, **Board**) rather than technical type categories (`components/`, `pages/`, `types/`).

```text
Feature Domain Folder Structure Pattern:
features/
└── <feature_name>/
    ├── components/    # Feature-specific pages, dialogs, cards, and sub-views
    ├── context/       # Feature state provider and context declaration
    ├── hooks/         # Custom hooks to consume the feature context safely
    └── types/         # Domain model entities and request contract interfaces
```

### Why Feature-Based Architecture is Preferred
1. **Domain Encapsulation:** All code related to User Stories lives within `features/stories/`. A developer changing how stories work does not need to search across 5 top-level global folders.
2. **Clear Ownership & Boundaries:** Components in `features/stories` rely on `useStories()`. The `board` feature consumes `useStories()` without defining duplicate story state.
3. **Scale & Maintainability:** Adding a new feature (e.g., Sprint Analytics) requires adding a new feature directory without cluttering global folders.
4. **Colocated Types & Contracts:** Domain types (`UserStory`) and contracts (`CreateStoryRequest`) are stored beside the components that use them.

---

## 5. The Complete Data Flow

Data flows through SprintFlow in a unidirectional pipeline:

```text
User Interaction (UI Component)
       ↓
Custom Hook Invocation (e.g., useStories())
       ↓
React Context & Provider (e.g., StoriesProvider)
       ↓
Repository Interface (e.g., StoryRepository)
       ↓
Concrete Repository Implementation (e.g., LocalStorageStoryRepository)
       ↓
Persistence Store (localStorage)
       ↓
Provider State Update (setStories)
       ↓
Reactive Component Re-render
```

### Step-by-Step Example: Creating a User Story

```text
[1. User Action]
User fills CreateStoryDialog form and clicks "Create Story"
       ↓
[2. Component Handler]
CreateStoryDialog handles submit and calls createStory(requestData) from useStories()
       ↓
[3. Custom Hook]
useStories() accesses StoriesContext and returns the createStory method
       ↓
[4. Provider Method Execution]
StoriesProvider.createStory(data) is executed:
  a. Calls storyRepository.createStory(data)
  b. Awaits the newly returned story entity
  c. Immutably updates local React state: setStories(prev => [...prev, createdStory])
       ↓
[5. Repository Layer]
LocalStorageStoryRepository.createStory(data):
  a. Reads current stories array from localStorage via getItem(STORAGE_KEYS.STORIES)
  b. Generates UUID id and ISO createdAt timestamp
  c. Appends new story object
  d. Writes back to localStorage via setItem(STORAGE_KEYS.STORIES, updatedList)
  e. Returns new UserStory object to Provider
       ↓
[6. UI Synchronization]
React state in StoriesProvider updates → StoriesPage, KanbanBoardView, and ProjectDashboardContent re-render automatically.
```

### Step-by-Step Example: Transitioning Story Status on Kanban Board

1. User selects a new status (e.g. `IN_PROGRESS` → `TESTING`) in the dropdown on [`KanbanCard.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/board/components/KanbanCard.tsx).
2. `KanbanCard` calls `onStatusChange(story, updateData)` which delegates to `updateStory(story.id, updateData)` from [`useStories()`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/stories/hooks/useStories.ts).
3. `StoriesProvider.updateStory()` calls `storyRepository.updateStory(id, data)`.
4. `LocalStorageStoryRepository.updateStory()` updates the record in `localStorage`.
5. `StoriesProvider` updates state using `.map()` immutably.
6. The updated state propagates to **all active views** (Kanban Board columns, Stories Page, Dashboard stats, Story Detail Page) instantly.

---

## 6. TypeScript Architecture

SprintFlow utilizes strict TypeScript interfaces to guarantee type safety and define domain boundaries.

### Domain Entities vs. Request Contracts

SprintFlow strictly separates **Domain Entities** (representing persisted data structures) from **Request Contracts** (representing payload inputs required to create or update data).

#### Domain Entity Example: `UserStory`
Defined in [`features/stories/types/story.ts`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/stories/types/story.ts):

```ts
export type StoryPriority = "LOW" | "MEDIUM" | "HIGH";
export type StoryStatus = "BACKLOG" | "IN_PROGRESS" | "TESTING" | "DONE";

export interface UserStory {
  id: string;             // Generated by system/backend
  projectId: string;      // Foreign Key ID reference
  title: string;
  description: string;
  priority: StoryPriority;
  storyPoints: number;
  assignedUserId?: string; // Optional Foreign Key ID reference
  status: StoryStatus;
  createdAt: string;      // System-assigned ISO string timestamp
}
```

#### Request Contract Example: `CreateStoryRequest` & `UpdateStoryRequest`
Defined in [`features/stories/types/contracts/story.ts`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/stories/types/contracts/story.ts):

```ts
export interface CreateStoryRequest {
  projectId: string;
  title: string;
  description: string;
  priority: StoryPriority;
  storyPoints: number;
  assignedUserId?: string;
  status: StoryStatus;
}

export interface UpdateStoryRequest {
  title: string;
  description: string;
  priority: StoryPriority;
  storyPoints: number;
  assignedUserId?: string;
  status: StoryStatus;
}
```

### Why Separate Domain Entities from Request Contracts?
- **Id Generation & Timestamps:** `id` and `createdAt` are generated by the persistence layer (or database/backend), not supplied by the UI form when creating a story.
- **Backend DTO Alignment:** When connecting to the .NET REST API, `CreateStoryRequest` directly maps to the C# backend Creation DTO (`CreateStoryDto`), while `UserStory` maps to the API Response DTO (`StoryResponseDto`).

---

## 7. Context API

React Context provides a clean dependency injection and state management mechanism without introducing heavy third-party global state libraries.

### SprintFlow Context Inventory

1. [`ProjectsContext`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/projects/context/projectsContext.ts): Provides application-wide project list, loading state, error state, and project CRUD functions.
2. [`ProjectTeamContext`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/team/context/projectTeamContext.ts): Provides team members scoped to the current `projectId`.
3. [`StoriesContext`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/stories/context/storiesContext.ts): Provides user stories scoped to the current `projectId`.

### Shape of a Context Value

Every feature context exports a standard contract interface. For example, `StoriesContextValue`:

```ts
export interface StoriesContextValue {
  stories: UserStory[];
  isLoading: boolean;
  error: string | null;
  refreshStories: () => Promise<void>;
  createStory: (data: CreateStoryRequest) => Promise<UserStory>;
  updateStory: (id: string, data: UpdateStoryRequest) => Promise<UserStory>;
  deleteStory: (id: string) => Promise<void>;
}
```

---

## 8. Providers

Providers own application and feature state, manage loading and error indicators, execute side effects (`useEffect`), and call repository methods.

### Summary of Application Providers

| Provider | Scope | Key Props | Repositories Used | State Managed |
|---|---|---|---|---|
| [`ProjectsProvider`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/projects/context/ProjectsProvider.tsx) | Global (wraps `AppLayout`) | `children` | `projectRepository` | `projects[]`, `isLoading`, `error` |
| [`ProjectTeamProvider`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/team/context/ProjectTeamProvider.tsx) | Project Scoped | `projectId`, `children` | `userRepository`, `projectMemberRepository` | `members[]`, `isLoading`, `error` |
| [`StoriesProvider`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/stories/context/StoriesProvider.tsx) | Project Scoped | `projectId`, `children` | `storyRepository` | `stories[]`, `isLoading`, `error` |

### Provider Lifecycle & Safety Pattern
Providers handle asynchronous data fetching safely with an `isMounted` guard inside `useEffect` to prevent updating unmounted state:

```tsx
useEffect(() => {
  let isMounted = true;

  const loadStories = async () => {
    try {
      const data = await storyRepository.getStoriesByProject(projectId);
      if (isMounted) setStories(data);
    } catch {
      if (isMounted) setError("Failed to load stories.");
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  void loadStories();

  return () => {
    isMounted = false;
  };
}, [projectId]);
```

---

## 9. Custom Hooks

Rather than calling `useContext(StoriesContext)` directly inside components, components consume custom hooks:

- [`useProjects()`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/projects/hooks/useProjects.ts)
- [`useStories()`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/stories/hooks/useStories.ts)
- [`useProjectTeam()`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/team/hooks/useProjectTeam.ts)

### Built-in Provider Safety
Every custom hook enforces that it is called within its matching Provider:

```ts
export function useStories() {
  const context = useContext(StoriesContext);

  if (!context) {
    throw new Error("useStories must be used within StoriesProvider");
  }

  return context;
}
```

If a developer attempts to render a story component outside of `StoriesProvider`, React immediately throws a descriptive error instead of crashing silently with `undefined` properties.

---

## 10. Repository Pattern

The **Repository Pattern** abstracts data persistence details away from the application and UI layers.

### Repository Interfaces & Concrete Implementations

```text
     ┌────────────────────────┐
     │  StoryRepository (IF)  │
     └───────────▲────────────┘
                 │ implements
     ┌───────────┴──────────────────────────┐
     │ LocalStorageStoryRepository (Class)  │
     └──────────────────────────────────────┘
```

#### Abstract Interface: [`StoryRepository.ts`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/repositories/StoryRepository.ts)
```ts
export interface StoryRepository {
  getStoriesByProject(projectId: string): Promise<UserStory[]>;
  getStoryById(id: string): Promise<UserStory | null>;
  createStory(data: CreateStoryRequest): Promise<UserStory>;
  updateStory(id: string, data: UpdateStoryRequest): Promise<UserStory>;
  deleteStory(id: string): Promise<void>;
}
```

#### Concrete Implementation: [`LocalStorageStoryRepository.ts`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/repositories/local/LocalStorageStoryRepository.ts)
Implements `StoryRepository` using `localStorage` functions. Returns `Promise` for all methods so callers treat data fetching as inherently asynchronous.

---

## 11. LocalStorage Architecture

Low-level storage interactions are isolated inside [`frontend/src/storage/localStorage.ts`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/storage/localStorage.ts) and [`frontend/src/constants/storageKeys.ts`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/constants/storageKeys.ts).

### Constants: `STORAGE_KEYS`
```ts
export const STORAGE_KEYS = {
  PROJECTS: "sprintflow_projects",
  USERS: "sprintflow_users",
  PROJECT_MEMBERS: "sprintflow_project_members",
  STORIES: "sprintflow_stories",
} as const;
```

### Storage Wrapper Functions
`localStorage.ts` wraps browser calls in `try/catch` blocks with generic type parsing:
- `getItem<T>(key: string): T | null`
- `setItem<T>(key: string, value: T): void`
- `removeItem(key: string): void`

### Crucial Architectural Constraint
```text
❌ BAD PRACTICE:
Component ──> localStorage.getItem("sprintflow_stories")

✅ SPRINTFLOW BEST PRACTICE:
Component ──> useStories() ──> StoriesProvider ──> StoryRepository ──> LocalStorageStoryRepository ──> localStorage
```

---

## 12. Backend Compatibility

SprintFlow is engineered so that migrating from client-side `localStorage` to a **.NET REST API** requires **zero UI changes**.

### Current vs. Future Integration

```text
CURRENT PERSISTENCE:
StoriesProvider ──> LocalStorageStoryRepository ──> localStorage

FUTURE API PERSISTENCE:
StoriesProvider ──> ApiStoryRepository ──> Fetch API / Axios ──> REST API (.NET) ──> SQL Database
```

When the .NET backend is ready:
1. Create `ApiStoryRepository.ts` implementing `StoryRepository`.
2. Swap the instantiation in `StoriesProvider.tsx`:
   ```ts
   // const storyRepository = new LocalStorageStoryRepository();
   const storyRepository = new ApiStoryRepository();
   ```
3. The entire React UI layer remains untouched.

---

## 13. Routing Architecture

Routing is configured in [`frontend/src/app/router.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/app/router.tsx) using React Router 8's `createBrowserRouter`.

### Route Table

| Route Path | Rendered Component | Feature Domain | Purpose |
|---|---|---|---|
| `/` | `AppLayout` | `app` | Outer shell layout with AppBar and Drawer |
| `/projects` | `ProjectsPage` | `projects` | List all projects; create project trigger |
| `/projects/:projectId` | `ProjectOverviewPage` | `projects` | Dashboard overview for selected project |
| `/projects/:projectId/board` | `BoardPage` | `board` | Kanban workflow board |
| `/projects/:projectId/stories` | `StoriesPage` | `stories` | List, filter, create, edit, delete user stories |
| `/projects/:projectId/stories/:storyId` | `StoryDetailPage` | `stories` | View single user story details |
| `/projects/:projectId/team` | `TeamPage` | `team` | Project team members list & add member |
| `/projects/:projectId/team/:userId` | `UserDetailPage` | `team` | View single team member details |

---

## 14. Projects Feature

The Projects feature manages the root level entity of SprintFlow.

### Component Overview
- [`ProjectsPage.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/projects/components/ProjectsPage.tsx): Displays project cards grid and triggers project creation.
- [`ProjectOverviewPage.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/projects/components/ProjectOverviewPage.tsx): Wraps `ProjectDashboardContent` with `StoriesProvider` and `ProjectTeamProvider`.
- [`ProjectDashboardContent.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/projects/components/ProjectDashboardContent.tsx): Renders metric cards, progress bars, recent stories, team summaries, workspace navigation, edit/delete dialogs.
- [`CreateProjectDialog.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/projects/components/CreateProjectDialog.tsx): Dialog form for project creation.
- [`ProjectFormDialog.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/projects/components/ProjectFormDialog.tsx): Reusable modal dialog for creating/editing projects.

---

## 15. Team Feature

The Team feature manages user identities and project-specific team assignments.

### Domain Separation: `User` vs `ProjectMember`
- **`User` Entity:** System identity (`id`, `name`, `role`, `avatarColor`).
- **`ProjectMember` Entity:** Association linking a `projectId` to a `userId`.

### Component Overview
- [`TeamPage.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/team/components/TeamPage.tsx): Lists members belonging to current project team and allows adding existing system users to project.
- [`UserDetailPage.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/team/components/UserDetailPage.tsx): Displays detailed profile and assigned stories for a team member.
- [`AddMemberDialog.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/team/components/AddMemberDialog.tsx): Dialog to select system users not yet added to the project.

---

## 16. Stories Feature

The Stories feature manages user stories within a project.

### Component Overview
- [`StoriesPage.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/stories/components/StoriesPage.tsx): Displays list of stories, manages create/edit dialog states, and handles story deletion.
- [`StoryCard.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/stories/components/StoryCard.tsx): Card displaying title, priority chip, points chip, assignee chip, status chip, and edit/delete actions.
- [`StoryDetailPage.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/stories/components/StoryDetailPage.tsx): Comprehensive view of a single story's attributes and assignee details.
- [`CreateStoryDialog.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/stories/components/CreateStoryDialog.tsx): Modal dialog for creating new stories.
- [`EditStoryDialog.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/stories/components/EditStoryDialog.tsx): Modal dialog pre-populated with existing story values for updating.

---

## 17. Kanban Architecture

Kanban does **not** maintain a separate data store or persistence entity for board columns.

### Derived State Pattern
The board derives columns directly from the stories array in `StoriesProvider`:

```text
                 StoriesProvider (stories[])
                              │
                              ▼
                KanbanBoardView (Filter & Group)
       ┌──────────────┬───────────────┬──────────────┬──────────────┐
       │   BACKLOG    │  IN_PROGRESS  │   TESTING    │     DONE     │
       └──────────────┴───────────────┴──────────────┴──────────────┘
```

In [`KanbanBoardView.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/board/components/KanbanBoardView.tsx):
```tsx
const KANBAN_COLUMNS: ColumnDefinition[] = [
  { status: "BACKLOG", title: "Backlog", color: "#e0e0e0" },
  { status: "IN_PROGRESS", title: "In Progress", color: "#bbdefb" },
  { status: "TESTING", title: "Testing", color: "#fff9c4" },
  { status: "DONE", title: "Done", color: "#c8e6c9" },
];

// Columns are derived dynamically during render:
{KANBAN_COLUMNS.map((column) => {
  const columnStories = stories.filter((story) => story.status === column.status);
  return <KanbanColumn key={column.status} stories={columnStories} />;
})}
```

When a user updates a story's status via [`KanbanCard.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/board/components/KanbanCard.tsx), `updateStory()` updates the `StoriesProvider` state, automatically moving the card to its new column and updating dashboard statistics simultaneously.

---

## 18. State Management Strategy

SprintFlow follows a structured state management matrix to prevent duplicate state and sync bugs:

| State Category | Definition & Usage | Example | Owner / Location |
|---|---|---|---|
| **Application State** | Global domain data used across the app | `projects[]` | `ProjectsProvider` |
| **Feature State** | Scoped domain data specific to a active project | `stories[]`, `members[]` | `StoriesProvider`, `ProjectTeamProvider` |
| **Derived State** | Values computed dynamically from existing state | Progress %, Kanban columns, Story counts | Render calculations (`useMemo` if needed) |
| **UI State** | Transient presentation flags | `isCreateDialogOpen`, `activeTab` | Component `useState` |
| **Form State** | Draft field inputs during user entry | `title`, `description`, `points` | Form Dialog `useState` |
| **URL State** | Application routing parameters and filters | `projectId`, `storyId`, search parameters | React Router (`useParams`, `useSearchParams`) |
| **Persistent State** | Underlying data on disk/storage | LocalStorage JSON items | Repository layer (`LocalStorage*Repository`) |

---

## 19. UI Architecture

SprintFlow uses Material UI (MUI 9) configured with a centralized theme.

### Component Design Hierarchy
1. **Layout Shell:** [`AppLayout.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/app/layouts/AppLayout.tsx) manages the navigation drawer, top AppBar, and responsive mobile breakpoint behavior.
2. **Page Views:** Top-level route views handle navigation buttons, page title headers, and open modal state.
3. **Cards & Widgets:** Presentational components (`StoryCard`, `DashboardStatCard`, `KanbanCard`) accept entity props and delegate actions via callback functions (`onEdit`, `onDelete`, `onStatusChange`).
4. **Modal Dialogs:** Controlled dialog components manage local form state, input validation, and submission loading spinners.

---

## 20. UI Improvement Strategy

UI enhancements must be performed without altering or breaking application data architecture.

### 6-Stage UI Improvement Process

```text
Stage 1: Design Consistency ──> Stage 2: Layout & Grid ──> Stage 3: UX & Feedback
                                                                 │
Stage 6: Visual Harmony   <── Stage 5: Responsive Design <── Stage 4: Accessibility
```

- **Stage 1 — Design Consistency:** Harmonize typography, button variants, MUI color palettes, card shadow depths (`boxShadow: 1`), and border radius.
- **Stage 2 — Layout & Grid:** Review container max-widths, flexbox alignments, responsive grid spacing (`spacing={2}`), and padding across screens.
- **Stage 3 — UX & Feedback:** Add loading spinners (`CircularProgress`), empty state alerts, confirmation dialogs, error messages, and disabled button states during API operations.
- **Stage 4 — Accessibility:** Ensure aria-labels on icon buttons, visible keyboard focus indicators, proper HTML heading hierarchy (`h1` → `h2`), and contrast ratios.
- **Stage 5 — Responsive Design:** Test layout at mobile (`xs`), tablet (`sm`), desktop (`md`), and large (`lg`) breakpoints.
- **Stage 6 — Final Visual Polish:** Verify visual cohesion across Projects, Team, Stories, Board, and Dashboard.

### Safe vs. Risky UI Changes

| Change Type | Impact Level | Examples |
|---|---|---|
| **SAFE** | Low Risk | Updating MUI spacing, color palettes, card styling, adding icons, tweaking typography, adding loading animations, fixing alignment. |
| **RISKY** | High Risk | Bypassing Context to call LocalStorage directly, moving state between providers, creating duplicate story arrays in components, modifying domain types without updating contracts, changing route paths without updating navigation calls. |

---

## 21. UI Improvement Workflow

Follow this strict cycle when making UI modifications:

```text
Inspect Component
       ↓
Identify UI Issue (e.g. alignment, spacing)
       ↓
Plan UI Modification
       ↓
Verify Zero Architectural Impact (Ensure hooks/contexts are preserved)
       ↓
Implement Incremental UI Edit
       ↓
Run Lint Validation (`npm run lint`)
       ↓
Run Build Validation (`npm run build`)
       ↓
Manual Browser Verification
       ↓
Commit & Push
```

---

## 22. Component Design Rules

1. **Single Responsibility:** A component should either lay out views, render entity details, or manage a form modal. Do not mix complex form inputs and data grids into a single giant file.
2. **Presentational vs. Data-Aware:** 
   - *Container/Data-Aware Components* (`StoriesPage`, `ProjectOverviewPage`, `KanbanBoardView`) consume custom hooks (`useStories()`) and pass data down.
   - *Presentational Components* (`StoryCard`, `DashboardStatCard`, `KanbanCard`) accept props and emit callbacks.
3. **Props & Callbacks:** Pass primitive properties or complete domain entities (`story: UserStory`). Emit actions via descriptive callbacks (`onStatusChange`, `onDelete`).
4. **Component Extraction Rule:** Extract a sub-component if a JSX block is repeated more than twice or exceeds 100 lines of presentational code.

---

## 23. Forms and Dialogs

SprintFlow uses controlled modal dialogs for all CRUD operations:
- [`CreateProjectDialog.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/projects/components/CreateProjectDialog.tsx)
- [`ProjectFormDialog.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/projects/components/ProjectFormDialog.tsx)
- [`CreateStoryDialog.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/stories/components/CreateStoryDialog.tsx)
- [`EditStoryDialog.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/stories/components/EditStoryDialog.tsx)
- [`AddMemberDialog.tsx`](file:///c:/SprintFlow-Agile-Project-Management-Platform/frontend/src/features/team/components/AddMemberDialog.tsx)

### Lifecycle of a Form Dialog
```text
Open Modal (Prop `open={true}`)
       ↓
Initialize Form State (Pre-populate from entity if editing)
       ↓
User Input & Validation (Check required fields)
       ↓
Submit Handler Triggered
       ↓
Set Local `isSubmitting` State (Disable submit button, show loading)
       ↓
Await Provider Action (e.g. `await createStory(formData)`)
       ↓
Reset Form State & Close Modal (`onClose()`)
```

---

## 24. Error and Loading Strategy

SprintFlow handles asynchronous states at both view and component levels:

1. **Initial Page Loading:** Providers maintain `isLoading: true` while fetching storage data. Components render a centered `<CircularProgress />` spinner while loading.
2. **Action/Mutation Loading:** Dialogs and cards track local submission loading state (`isSubmitting`, `isDeleting`) and display progress buttons.
3. **Error Boundaries & Alerts:** If repository execution fails, the Provider sets `error: "Failed to..."` which components render using MUI `<Alert severity="error">`.
4. **Empty Data Feedback:** If an entity array is empty (`stories.length === 0`), components render an informative `<Alert severity="info">` encouraging user creation.

---

## 25. Data Consistency

SprintFlow achieves **Single Source of Truth** data synchronization by avoiding duplicate state copies.

```text
               StoriesProvider (Single Source of Truth)
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
   StoriesPage           KanbanBoardView         ProjectDashboardContent
(Lists all stories)    (Groups by status)      (Calculates metrics & progress)
```

Because `StoriesPage`, `KanbanBoardView`, and `ProjectDashboardContent` all consume the exact same `stories` array provided by `StoriesProvider`, changing a story's status or title on the Kanban board updates the list view, detail view, and progress bars instantly without requiring manual re-fetches or page refreshes.

---

## 26. Git Development Workflow

SprintFlow strictly enforces the mentor-mandated Git workflow:

```text
main Branch (Production / Stable)
     ▲
     │ Pull Request (PR) after Mentor Review
     │
development Branch (Integration)
     ▲
     │ Daily Work & Commits
     │
Feature Branch / Work Branch
```

### Git Command Sequence
```bash
# 1. Check current status
git status

# 2. Work on development branch
git checkout development

# 3. Stage and commit changes
git add .
git commit -m "feat: implement kanban status transition flow"

# 4. Push to remote development
git push origin development

# 5. Open Pull Request (PR) from development -> main for mentor review
```

---

## 27. Validation Workflow

Before marking any coding task complete or pushing changes, developers **must** execute validation scripts:

```bash
# Step 1: Run ESLint validation
npm run lint

# Step 2: Run TypeScript compiler & Vite build build check
npm run build
```

### Validation Gates Matrix
1. **Lint Gate:** `npm run lint` ensures code adheres to formatting, unused variable rules, and React Hook rules.
2. **Build Gate:** `npm run build` runs `tsc -b` to verify strict TypeScript type correctness and generates the Vite production bundle.
3. **Manual Verification Gate:** Verify the user flow in browser.

---

## 28. Common Mistakes to Avoid

1. ❌ **Accessing `localStorage` directly in UI components.** Always route through Hooks → Providers → Repositories.
2. ❌ **Creating duplicate state arrays in components.** Never store `const [boardStories, setBoardStories] = useState([])` inside `KanbanBoardView`.
3. ❌ **Placing feature-specific pages in `src/pages`.** Keep them in `src/features/<feature>/components`.
4. ❌ **Placing feature types in root `src/types`.** Keep domain types in `src/features/<feature>/types`.
5. ❌ **Using Domain Entities as Form Inputs.** Keep `UserStory` (has `id`, `createdAt`) separate from `CreateStoryRequest`.
6. ❌ **Removing Provider checks from custom hooks.** Always throw a descriptive error if context is undefined.
7. ❌ **Hardcoding pixel widths instead of MUI responsive props.** Use `sx={{ width: { xs: "100%", md: 240 } }}`.
8. ❌ **Mutating state directly.** Always update arrays and objects immutably using spread operators or `.map()` / `.filter()`.
9. ❌ **Suppressing TypeScript or ESLint errors with `// @ts-ignore` or `// eslint-disable`.** Fix the underlying type or lint issue.
10. ❌ **Adding heavy third-party state libraries (Redux, Zustand) without approval.** Context + Repository pattern fully meets current project needs.
11. ❌ **Bypassing the Repository Interface.** Never instantiate `LocalStorageStoryRepository` directly inside a component.
12. ❌ **Creating separate Kanban persistence models.** Kanban columns are derived views of story statuses.
13. ❌ **Mixing UI redesigns with architectural refactoring.** Keep UI cosmetic updates and architecture changes in separate PRs.
14. ❌ **Modifying working codebase files during documentation-only tasks.**
15. ❌ **Committing code without running `npm run lint` and `npm run build`.**

---

## 29. "How To Read SprintFlow Code"

When attempting to trace or debug a feature in SprintFlow, follow this step-by-step procedure:

```text
Step 1: Read UI Component (e.g. StoryDetailPage.tsx)
   │
   ▼
Step 2: Identify Custom Hook used (e.g. useStories())
   │
   ▼
Step 3: Open Custom Hook file (features/stories/hooks/useStories.ts)
   │
   ▼
Step 4: Identify Context referenced (StoriesContext)
   │
   ▼
Step 5: Locate Provider implementation (features/stories/context/StoriesProvider.tsx)
   │
   ▼
Step 6: Inspect Provider state and method called (e.g. updateStory)
   │
   ▼
Step 7: Find Repository Interface (repositories/StoryRepository.ts)
   │
   ▼
Step 8: Inspect Concrete Implementation (repositories/local/LocalStorageStoryRepository.ts)
   │
   ▼
Step 9: Inspect Persistence Utility (storage/localStorage.ts & storageKeys.ts)
```

---

## 30. "How To Build a New Feature"

To introduce a new domain feature to SprintFlow (e.g., *Epics* or *Milestones*), execute this structured process:

1. **Define Domain Model:** Create domain entity interface in `features/<new_feature>/types/<entity>.ts`.
2. **Define Request Contracts:** Create payload contracts in `features/<new_feature>/types/contracts/<entity>.ts`.
3. **Define Repository Interface:** Add `repositories/<Entity>Repository.ts`.
4. **Implement Concrete Repository:** Add `repositories/local/LocalStorage<Entity>Repository.ts`.
5. **Create Context & Provider:** Add `features/<new_feature>/context/<Entity>Provider.tsx`.
6. **Create Custom Hook:** Add `features/<new_feature>/hooks/use<Entity>.ts`.
7. **Build Presentational Components & Dialogs:** Add UI components in `features/<new_feature>/components/`.
8. **Add Routes:** Register new paths in `src/app/router.tsx`.
9. **Validate:** Run `npm run lint` and `npm run build`.

---

## 31. AI / Antigravity Development Rules

When working alongside AI tools (like Antigravity), adhere to the following protocol:

```text
Inspect Repository Code ──> Formulate Implementation Plan ──> Execute Minimal Edit Slice ──> Validate (Lint & Build) ──> Explain Changes
```

### Mandated AI Rules
- **Do not rewrite working code.** Re-use existing providers, repositories, and UI components.
- **Do not invent backend APIs as existing.** Keep mock/local implementations clearly separated from future backend plans.
- **Do not bypass lint/type validation.** Always verify with `npm run lint` and `npm run build`.
- **Do not modify source files when asked ONLY to update documentation.**

---

## 32. Current Project Status

The actual status of SprintFlow features as of August 2026:

```text
┌─────────────────────────────────────────────────────────────┬─────────────┐
│ Feature / Milestone                                         │ Status      │
├─────────────────────────────────────────────────────────────┼─────────────┤
│ Project Foundation (React 19, Vite 8, MUI 9, Router 8)     │  COMPLETE   │
│ Projects Management (List, Create, Edit, Delete, Overview)  │  COMPLETE   │
│ Team Management (Seed users, Add/Remove project members)    │  COMPLETE   │
│ User Stories Management (List, Create, Edit, Delete, Assign)│  COMPLETE   │
│ Kanban Board (Derived columns, status dropdown transitions) │  COMPLETE   │
│ Project Dashboard (Derived metrics, progress bars, summary) │  COMPLETE   │
│ Search & Filtering (Query string filters, user/priority)    │ 🚧 IN PROGRESS│
│ Advanced UX States (Toast notifications, inline validation) │ 🚧 PENDING   │
│ .NET Backend REST API Integration                           │ 🔮 PLANNED  │
└─────────────────────────────────────────────────────────────┴─────────────┘
```

---

## 33. Architecture Decision Records (ADRs)

### ADR 1: Feature-Based Folder Architecture
- **Decision:** Group code by domain feature (`features/projects`, `features/stories`, etc.) rather than technical type (`components/`, `pages/`).
- **Rationale:** High cohesion within features, isolated domain boundaries, better scalability, and cleaner code navigation.

### ADR 2: Repository Pattern Abstraction
- **Decision:** Place all data persistence behind abstract TypeScript interfaces (`StoryRepository`, `ProjectRepository`).
- **Rationale:** Complete decoupling of UI from storage mechanisms. Enables seamless migration from `localStorage` to .NET REST APIs without altering UI components.

### ADR 3: Context API + Custom Hooks over Redux/Zustand
- **Decision:** Use React Context paired with scoped custom hooks for state management.
- **Rationale:** Keeps application bundle lean without third-party dependencies. Context + Repository pattern provides all required reactivity for client-side state.

### ADR 4: Derived Kanban & Dashboard State
- **Decision:** Do not maintain separate state arrays for Kanban columns or Dashboard stats. Derive them dynamically from `StoriesProvider` state.
- **Rationale:** Guarantees absolute data consistency across views and eliminates synchronization bugs.

### ADR 5: Separation of Domain Entities and Request Contracts
- **Decision:** Keep `UserStory` separate from `CreateStoryRequest`.
- **Rationale:** Reflects system generation of IDs and timestamps, and directly maps to backend API Request/Response DTO contracts.

---

## 34. Interview-Level Understanding

Developers working on SprintFlow should be able to explain the architecture in technical interviews using these Q&As:

#### Q1: Why did you choose Feature-Based Architecture for SprintFlow?
> **Answer:** Feature-based architecture groups files by business domain (`features/stories`, `features/projects`) rather than technical type. This promotes high cohesion and low coupling. Developers working on User Stories can find components, contexts, hooks, and types in one self-contained directory, making the project easier to scale and maintain.

#### Q2: How does SprintFlow prevent UI rewrites when switching from LocalStorage to a .NET REST API?
> **Answer:** We implemented the Repository Pattern. UI components communicate with React Contexts and Providers, which consume abstract repository interfaces like `StoryRepository`. Currently, `LocalStorageStoryRepository` implements this interface using `localStorage`. When the .NET backend is ready, we simply write `ApiStoryRepository` implementing `StoryRepository` and inject it into the Provider. The React UI layer requires zero modifications.

#### Q3: How does the Kanban board stay synchronized with the Stories page and Dashboard?
> **Answer:** Kanban columns are not an independent data store. They are a *derived state* calculated dynamically from `StoriesProvider.stories`. When a user changes a story's status on the Kanban board, `updateStory()` updates the single source of truth in `StoriesProvider`. Consequently, the Kanban board, Stories list, and Dashboard metrics re-render in sync automatically.

#### Q4: Why are `UserStory` and `CreateStoryRequest` separate TypeScript interfaces?
> **Answer:** `UserStory` represents the full persisted domain entity including system-generated fields like `id` and `createdAt`. `CreateStoryRequest` represents the input payload required from the client when creating a story. Separating them prevents form code from requiring dummy values for `id` or `createdAt` and aligns directly with backend REST DTO patterns.

#### Q5: What is the purpose of custom hooks like `useStories()`?
> **Answer:** Custom hooks encapsulate `useContext(StoriesContext)` calls and include a guard that throws a clear runtime exception if the hook is invoked outside its Provider. This guarantees type safety, avoids duplicate context checks in components, and simplifies component consumption.

---

## 35. Final Mental Model

```text
                       ┌────────────────────────┐
                       │     DOMAIN MODELS      │
                       │ (Project, Story, User) │
                       └───────────┬────────────┘
                                   │
                                   ▼
                       ┌────────────────────────┐
                       │  REPOSITORY CONTRACTS  │
                       │   (StoryRepository)    │
                       └───────────┬────────────┘
                                   │
                                   ▼
                       ┌────────────────────────┐
                       │    DATA PERSISTENCE    │
                       │  (LocalStorage / API)  │
                       └───────────┬────────────┘
                                   │
                                   ▼
                       ┌────────────────────────┐
                       │    FEATURE PROVIDER    │
                       │   (StoriesProvider)    │
                       └───────────┬────────────┘
                                   │
                                   ▼
                       ┌────────────────────────┐
                       │     CUSTOM HOOKS       │
                       │      (useStories)      │
                       └───────────┬────────────┘
                                   │
                                   ▼
                       ┌────────────────────────┐
                       │   FEATURE COMPONENTS   │
                       │  (Kanban, Cards, Pages)│
                       └───────────┬────────────┘
                                   │
                                   ▼
                       ┌────────────────────────┐
                       │      REACT UI / DOM    │
                       └────────────────────────┘
```
