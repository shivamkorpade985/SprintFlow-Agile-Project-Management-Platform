# SprintFlow

**Agile Project Management Platform** — A modern, full-featured sprint planning and tracking tool built with React, TypeScript, and Material UI.

> Plan. Track. Deliver.

SprintFlow enables software teams to manage projects, author user stories, track sprint progress on a Kanban board, and monitor delivery velocity — all from a clean, responsive interface. Built on a layered architecture with repository abstractions, the frontend is designed to operate standalone with `localStorage` today and seamlessly integrate with a REST API backend tomorrow, without modifying a single UI component.

---

## 📸 Product Preview

### Landing Experience

![SprintFlow Landing Page](docs/landing_page.png)

### Project Workspace

![Projects Page](docs/projects_page.png)

### Project Dashboard

<p>
  <img src="docs/project_overview_with_dashboard1.png" alt="Dashboard — Progress & Metrics" width="48%" />
  <img src="docs/project_overview_with_dashboard2.png" alt="Dashboard — Stories & Team" width="48%" />
</p>

### Kanban Board

![Kanban Board](docs/board.png)

### User Stories

![Stories Backlog](docs/stories.png)

### Story Details

![Story Detail Page](docs/story_detail_page.png)

### Team Management

![Team Page](docs/teams_page.png)

---

## ✨ Features

### Project Management

- Create, edit, and delete projects with name and description
- Project overview dashboard with live metrics
- Project-scoped navigation (Overview · Board · Stories · Team)
- Workspace-level project listing with cards

### User Stories

- Full CRUD — create, view, edit, and delete user stories
- Story attributes: title, description, priority (`HIGH` · `MEDIUM` · `LOW`), story points, workflow status
- Workflow states: `BACKLOG` → `IN_PROGRESS` → `TESTING` → `DONE`
- Assign stories to project team members
- Detailed story view with attributes grid

### Search & Filters

- Real-time title search (case-insensitive)
- Filter by assignee (team members or unassigned)
- Filter by priority level
- Active filter chips with individual clear actions
- Result count indicator ("Showing X of Y stories")
- URL query parameter synchronization — filters persist across navigation and page refreshes

### Kanban Board

- Four-column board: Backlog · In Progress · Testing · Done
- **Drag-and-drop** story cards between columns to change workflow status
- Inline status selector on each card
- All status changes persist through the repository layer
- Columns derived from provider state — zero duplicate data

### Team Management

- Add existing system users to project teams
- Remove members from project teams
- Role-based membership: `DEVELOPER` · `TESTER` · `MANAGER`
- Visual avatar selection with 6 color presets
- User detail profile view
- Seed data provides initial system users out of the box

### Project Dashboard

- Overall completion percentage with progress bar
- Story points velocity (delivered vs. total)
- KPI metric cards: Total Stories · Active/Testing · Completed · Story Points
- Recent user stories list (5 newest)
- Team summary with role badges
- All metrics derived dynamically — no stale counters

### Landing Experience

- Public landing page with hero section and CTA
- Interactive product preview mockup
- Core capabilities grid (4 feature cards)
- Agile pipeline workflow steps
- Separate layout from the workspace app shell

### UX Polish

- Responsive layout — permanent sidebar on desktop, drawer toggle on mobile
- Contextual sidebar adapts to current project context
- Dynamic breadcrumbs with active project name
- Loading spinners, empty states, and error alerts
- Hover card elevations and smooth transitions
- Consistent color-coded chips for status, priority, and roles

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | Declarative UI with functional components and hooks |
| **TypeScript** | 6 | Static typing, domain models, and repository contracts |
| **Vite** | 8 | Development server, HMR, and production builds |
| **Material UI** | 9 | Component library — Cards, Dialogs, Grid, AppBar, Drawer |
| **Emotion** | 11 | CSS-in-JS styling engine for MUI |
| **React Router** | 8 | Client-side routing, `useParams`, `useSearchParams` |
| **ESLint** | 10 | Linting with TypeScript and React Hooks rules |

---

## 🏗️ Architecture

SprintFlow follows a **feature-based architecture** with strict separation of concerns. UI components never access `localStorage` directly — all data flows through a layered pipeline:

```
React Component
     ↓
Custom Hook (useStories, useProjects, useProjectTeam)
     ↓
React Context
     ↓
Provider (StoriesProvider, ProjectsProvider, ProjectTeamProvider)
     ↓
Repository Interface (StoryRepository, ProjectRepository, ...)
     ↓
Concrete Implementation (LocalStorageStoryRepository, ...)
     ↓
Storage Utilities (localStorage.ts + storageKeys.ts)
     ↓
Browser localStorage
```

### Key Architectural Principles

- **Single source of truth** — Domain state lives in Providers. Kanban columns, dashboard metrics, and filtered lists are derived during render.
- **Repository pattern** — Abstract interfaces define data contracts. Swapping `localStorage` for an HTTP API requires replacing only the concrete implementations.
- **URL as state** — Search filters and route parameters are stored in the URL via React Router, not duplicated in component state.
- **Feature isolation** — Each domain (projects, stories, board, team) owns its components, context, hooks, and types.

---

## 🧩 Project Structure

```
SprintFlow-Agile-Project-Management-Platform/
├── docs/                              # Product screenshots
├── backend/                           # .NET backend (planned)
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── src/
│       ├── main.tsx                   # Application entry point
│       ├── index.css                  # Global CSS reset
│       │
│       ├── app/                       # Application shell
│       │   ├── router.tsx             # Route definitions (LandingLayout + AppLayout)
│       │   ├── layouts/
│       │   │   ├── AppLayout.tsx      # Workspace shell — AppBar, Drawer, ProjectsProvider
│       │   │   └── LandingLayout.tsx  # Public layout — Header, Footer
│       │   └── theme/
│       │       └── theme.ts           # MUI theme tokens & component overrides
│       │
│       ├── features/                  # Feature-based domain modules
│       │   ├── landing/               # Public landing page
│       │   │   └── components/
│       │   ├── projects/              # Project CRUD, dashboard, overview
│       │   │   ├── components/
│       │   │   ├── context/
│       │   │   ├── hooks/
│       │   │   └── types/
│       │   ├── stories/               # User story CRUD, filters, detail view
│       │   │   ├── components/
│       │   │   ├── context/
│       │   │   ├── hooks/
│       │   │   └── types/
│       │   ├── board/                 # Kanban board with drag-and-drop
│       │   │   └── components/
│       │   └── team/                  # Team membership, avatars, user profiles
│       │       ├── components/
│       │       ├── constants/         # Avatar color presets
│       │       ├── context/
│       │       ├── data/              # Seed users
│       │       ├── hooks/
│       │       └── types/
│       │
│       ├── repositories/              # Data access layer
│       │   ├── ProjectRepository.ts   # Interface
│       │   ├── StoryRepository.ts     # Interface
│       │   ├── UserRepository.ts      # Interface
│       │   ├── ProjectMemberRepository.ts  # Interface
│       │   └── local/                 # Concrete localStorage implementations
│       │
│       ├── storage/                   # Low-level localStorage wrapper
│       │   └── localStorage.ts
│       └── constants/
│           └── storageKeys.ts         # Storage key registry
```

---

## 🔄 Core Data Flow

### Read Path (Component → Storage)

```
UI Component (e.g. StoriesPage)
     ↓  calls
useStories()
     ↓  reads from
StoriesContext
     ↓  provided by
StoriesProvider  ──→  loads on mount via storyRepository.getStoriesByProject()
     ↓                        ↓
     ↓               LocalStorageStoryRepository
     ↓                        ↓
     ↓                  localStorage
     ↓
stories[] available to all consumers
```

### Write Path (User Action → Persistence → Re-render)

```
User clicks "Save" in CreateStoryDialog
     ↓
createStory(data) via useStories()
     ↓
StoriesProvider calls storyRepository.createStory(data)
     ↓
LocalStorageStoryRepository writes to localStorage
     ↓
Provider updates state: setStories(prev => [...prev, newStory])
     ↓
All consumers re-render (Stories list, Kanban board, Dashboard metrics)
```

### Kanban Drag-and-Drop Flow

```
User drags card from "Backlog" → drops on "In Progress" column
     ↓
onDrop extracts storyId from dataTransfer
     ↓
updateStory(storyId, { status: "IN_PROGRESS" })
     ↓
StoriesProvider → StoryRepository → localStorage
     ↓
Provider state updates → card moves to new column
     ↓
Dashboard metrics recalculate automatically
```

---

## 🧠 State Management

SprintFlow uses React Context + Providers for domain state, with no external state management libraries.

| Category | Examples | Location |
|---|---|---|
| **Domain State** | `projects[]`, `stories[]`, `members[]` | Context Providers |
| **Derived State** | Kanban columns, dashboard %, filtered stories | Computed during render |
| **UI State** | Dialog open/close, loading flags, form drafts | Component `useState` |
| **URL State** | `projectId`, `storyId`, search & filter params | React Router |
| **Persistent State** | All domain entities | `localStorage` via repositories |

**Why no Redux or Zustand?** Domain state is naturally scoped to Provider boundaries (`ProjectsProvider` at the app level, `StoriesProvider` and `ProjectTeamProvider` at the project level). Derived values are computed inline. URL state handles filters. This eliminates the need for a global store while keeping the architecture simple and testable.

---

## 🗺️ Route Map

| Path | Page | Description |
|---|---|---|
| `/` | Landing Page | Public marketing page with hero, features, and CTA |
| `/projects` | Projects | Workspace project listing and creation |
| `/projects/:projectId` | Dashboard | Project overview with KPI metrics and progress |
| `/projects/:projectId/board` | Kanban Board | Four-column drag-and-drop workflow board |
| `/projects/:projectId/stories` | Stories | Filterable story backlog with search |
| `/projects/:projectId/stories/:storyId` | Story Detail | Full story view with attributes and actions |
| `/projects/:projectId/team` | Team | Project team members with role management |
| `/projects/:projectId/team/:userId` | User Detail | Individual team member profile |

The `/` route uses `LandingLayout` (public header + footer). All `/projects/*` routes use `AppLayout` (workspace shell with sidebar, AppBar, and breadcrumbs).

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/shivamkorpade985/SprintFlow-Agile-Project-Management-Platform.git
cd SprintFlow-Agile-Project-Management-Platform

# Install frontend dependencies
cd frontend
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

```bash
# Type-check and build for production
npm run build

# Preview the production build
npm run preview
```

### Lint

```bash
npm run lint
```

---

## 📋 Available Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start Vite dev server with HMR |
| `build` | `npm run build` | TypeScript check (`tsc -b`) + Vite production build |
| `preview` | `npm run preview` | Serve the production build locally |
| `lint` | `npm run lint` | Run ESLint across the codebase |

---

## 🔮 Roadmap

- [ ] **.NET REST API Backend** — Replace `localStorage` repositories with HTTP API clients. The repository pattern makes this a drop-in swap with zero UI changes.
- [ ] **Authentication & Authorization** — User login, session management, and role-based access control.
- [ ] **Sprint Management** — Time-boxed sprint containers for grouping user stories.
- [ ] **Real-time Collaboration** — Multi-user updates with WebSocket or SignalR integration.

---

## 🧑‍💻 Contributing

SprintFlow follows a feature-based architecture. To add a new domain feature:

1. Define domain types in `features/<feature>/types/`
2. Create repository interface in `repositories/`
3. Implement concrete repository in `repositories/local/`
4. Build Context + Provider in `features/<feature>/context/`
5. Create custom hook in `features/<feature>/hooks/`
6. Build UI components in `features/<feature>/components/`
7. Register routes in `app/router.tsx`
8. Validate with `npm run lint && npm run build`

### Validation Gates

```bash
cd frontend
npm run lint    # ESLint — must pass with 0 errors
npm run build   # TypeScript + Vite — must compile cleanly
```

---

## 📄 License

This project is part of an academic engineering portfolio. All rights reserved.
