# SprintFlow — System Design & UML Diagrams

> This document provides visual representations of SprintFlow's architecture, runtime behavior, data relationships, request flows, and persistence model. All diagrams are derived from the current implementation.

**Related Documentation:**
- [System Architecture](architecture.md) — Detailed layer responsibilities, DI lifetimes, and design decisions
- [REST API Reference](api.md) — Complete endpoint schemas, request/response DTOs, and status codes
- [Database Design](database.md) — PostgreSQL schema, entity configurations, foreign keys, and migrations
- [Development Guide](development.md) — Local setup, prerequisites, and execution commands
- [Testing & Verification](testing.md) — Manual testing scenarios, Postman suites, and integration tests

---

## Table of Contents

1. [System Context Diagram](#1-system-context-diagram)
2. [High-Level Architecture Diagram](#2-high-level-architecture-diagram)
3. [Component Diagram](#3-component-diagram)
4. [End-to-End Request Lifecycle](#4-end-to-end-request-lifecycle)
5. [Frontend Data Flow](#5-frontend-data-flow)
6. [Project Creation Sequence Diagram](#6-project-creation-sequence-diagram)
7. [Story Creation Sequence Diagram (Business Validation)](#7-story-creation-sequence-diagram-business-validation)
8. [Project Member Sequence Diagram (Duplicate Prevention)](#8-project-member-sequence-diagram-duplicate-prevention)
9. [Story Assignee Business Rule Flow](#9-story-assignee-business-rule-flow)
10. [User Delete Sequence & Relational Integrity](#10-user-delete-sequence--relational-integrity)
11. [Database Entity Relationship Diagram (ERD)](#11-database-entity-relationship-diagram-erd)
12. [Domain Model / UML Class Diagram](#12-domain-model--uml-class-diagram)
13. [Transaction & Unit of Work Persistence Model](#13-transaction--unit-of-work-persistence-model)
14. [CancellationToken Propagation Flow](#14-cancellationtoken-propagation-flow)
15. [Error Propagation & Exception Handling Flow](#15-error-propagation--exception-handling-flow)
16. [Frontend Repository Abstraction](#16-frontend-repository-abstraction)
17. [Deployment Topology (Local Development)](#17-deployment-topology-local-development)
18. [Architectural Concepts Illustrated](#18-architectural-concepts-illustrated)

---

## 1. System Context Diagram

The System Context diagram establishes the high-level boundary of the SprintFlow system and shows how users interact with its runtime processes.

```mermaid
graph TB
    User["👤 Developer / Agile Team Member\n(Web Browser)"]

    subgraph ClientBoundary["Client Boundary (Port 5173)"]
        SPA["SprintFlow Web App\n(React 19 + TypeScript + Vite)"]
    end

    subgraph AppBoundary["Application Boundary (Port 5000)"]
        API["SprintFlow REST API\n(ASP.NET Core / .NET 10 Web API)"]
    end

    subgraph PersistenceBoundary["Persistence Boundary (Port 5432)"]
        DB[("PostgreSQL Database\n(Relational Storage)")]
    end

    User -->|"Interacts via GUI (HTTP/DOM)"| SPA
    SPA -->|"JSON API Requests (fetch / CORS)"| API
    API -->|"EF Core 10 / Npgsql (TCP)"| DB
```

### Context Summary
- **Client Boundary**: Single Page Application (SPA) running in the user's browser, responsible for presentation and local interaction.
- **Application Boundary**: Stateless ASP.NET Core Web API enforcing business rules, entity orchestration, and validation.
- **Persistence Boundary**: PostgreSQL instance guaranteeing ACID compliance, relational integrity, and persistent storage.
- No external third-party SaaS, message brokers, or caching proxies are utilized in the current system.

---

## 2. High-Level Architecture Diagram

SprintFlow enforces a strict, layered architectural style where dependencies only flow downward.

```mermaid
graph TD
    subgraph PresentationLayer["1. Presentation Layer (React + TypeScript)"]
        UI["Pages & Views\n(ProjectsPage, BoardPage, StoriesPage, TeamPage)"]
        Hooks["Custom Hooks & Context\n(useProjects, useStories, useProjectTeam)"]
        FrontendRepo["Repository Abstraction\n(ProjectRepository, StoryRepository, etc.)"]
    end

    subgraph TransportLayer["HTTP Transport"]
        HTTP["REST / JSON over HTTP\n(VITE_API_BASE_URL: http://localhost:5000)"]
    end

    subgraph ControllerLayer["2. API & Controller Layer (ASP.NET Core)"]
        MW["GlobalExceptionMiddleware\n(Unhandled Exception Trapping)"]
        Controllers["API Controllers\n(ProjectsController, StoriesController, UsersController, ProjectMembersController)"]
    end

    subgraph BusinessLayer["3. Business / Service Layer"]
        Services["Domain Services\n(ProjectService, StoryService, UserService, ProjectMemberService)"]
        DTOs["DTO Contracts & Mappings\n(Requests, Responses, Validators)"]
    end

    subgraph DataAccessLayer["4. Data Access Layer (EF Core 10)"]
        Repos["Repository Implementations\n(ProjectRepository, StoryRepository, UserRepository, ProjectMemberRepository)"]
        DbContext["SprintFlowDbContext\n(Change Tracker & Unit of Work)"]
    end

    subgraph PersistenceLayer["5. Persistence Layer"]
        PG[("PostgreSQL Database\n(Tables, Constraints, Indexes)")]
    end

    UI --> Hooks
    Hooks --> FrontendRepo
    FrontendRepo --> HTTP
    HTTP --> MW
    MW --> Controllers
    Controllers --> Services
    Services -.-> DTOs
    Services --> Repos
    Repos --> DbContext
    DbContext --> PG
```

### Why This Layering Exists
1. **Separation of Concerns**: Controllers only handle HTTP concerns (status codes, model binding), Services handle domain rules, Repositories handle data access.
2. **Testability**: Any layer can be unit-tested in isolation by mocking the interface below it.
3. **Storage Independence**: The data access layer encapsulates EF Core; services and controllers remain agnostic to SQL query mechanics.

---

## 3. Component Diagram

This diagram displays the key structural components across the frontend, backend, and database packages.

```mermaid
graph LR
    subgraph FrontendComponents["Frontend Features (src/features)"]
        F_Projects["Projects Feature\n(ProjectsPage, Dialogs, Context)"]
        F_Stories["Stories Feature\n(StoriesPage, DetailView, Context)"]
        F_Board["Board Feature\n(KanbanBoardView, Columns, Cards)"]
        F_Team["Team Feature\n(TeamPage, MemberDialog, Context)"]
        F_ApiRepos["API Repositories\n(ApiProjectRepo, ApiStoryRepo, ApiUserRepo, ApiMemberRepo)"]
    end

    subgraph BackendComponents["Backend Modules (SprintFlowAPI)"]
        B_Controllers["Controllers\n(Projects, Stories, Users, ProjectMembers)"]
        B_Services["Services\n(ProjectService, StoryService, UserService, ProjectMemberService)"]
        B_Repositories["Repositories\n(ProjectRepo, StoryRepo, UserRepo, ProjectMemberRepo)"]
        B_Data["Data Layer\n(SprintFlowDbContext, Migrations)"]
        B_Contracts["Contracts\n(DTOs, Models, Enums)"]
    end

    subgraph DatabaseTables["PostgreSQL Schema"]
        T_Projects[("Projects Table")]
        T_Stories[("Stories Table")]
        T_Users[("Users Table")]
        T_Members[("ProjectMembers Table")]
    end

    F_Projects --> F_ApiRepos
    F_Stories --> F_ApiRepos
    F_Board --> F_Stories
    F_Team --> F_ApiRepos

    F_ApiRepos --> B_Controllers
    B_Controllers --> B_Services
    B_Services -.-> B_Contracts
    B_Services --> B_Repositories
    B_Repositories --> B_Data

    B_Data --> T_Projects
    B_Data --> T_Stories
    B_Data --> T_Users
    B_Data --> T_Members
```

---

## 4. End-to-End Request Lifecycle

Traces a request from user action through the entire technology stack and back to the rendered view.

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant DOM as React DOM / Event
    participant Hook as useProjects() / Provider
    participant Repo as ApiProjectRepository
    participant HTTP as Network (fetch)
    participant Ctrl as ProjectsController
    participant Svc as ProjectService
    participant DAL as ProjectRepository
    participant DB as SprintFlowDbContext / PG

    User->>DOM: Clicks "Create Project" button
    DOM->>Hook: createProject(CreateProjectRequest)
    Hook->>Repo: createProject(data)
    Repo->>HTTP: POST http://localhost:5000/api/projects (JSON)
    HTTP->>Ctrl: POST /api/projects (Action Invocation)
    Ctrl->>Svc: CreateAsync(request, cancellationToken)
    Svc->>Svc: Map DTO to Project Entity (CreatedAt = UtcNow)
    Svc->>DAL: CreateAsync(projectEntity, cancellationToken)
    DAL->>DB: AddAsync() + SaveChangesAsync()
    DB-->>DAL: Returns generated numeric ID
    DAL-->>Svc: Persisted Entity
    Svc->>Svc: Map Entity to ProjectResponse DTO
    Svc-->>Ctrl: ProjectResponse
    Ctrl-->>HTTP: 201 Created (Location: /api/projects/{id})
    HTTP-->>Repo: JSON Response payload
    Repo-->>Hook: Resolves Promise with new Project
    Hook->>Hook: State update: setProjects([...prev, newProject])
    Hook-->>DOM: Trigger React Component Re-render
    DOM-->>User: UI displays newly created project in list
```

---

## 5. Frontend Data Flow

Shows how local state and asynchronous operations are isolated inside React Context Providers and custom hooks.

```mermaid
graph TD
    A["User Interaction\n(Form submit, Drag card, Click delete)"] --> B["React View Component\n(e.g., StoriesPage, KanbanBoardView)"]
    B --> C["Custom Hook Call\n(e.g., useStories())"]
    C --> D["Context Provider\n(e.g., StoriesProvider)\n[State: stories[], isLoading, error]"]
    D --> E["Repository Interface\n(StoryRepository interface)"]
    E --> F["Concrete Implementation\n(ApiStoryRepository)"]
    F --> G["Browser fetch() Client\n(Headers: Content-Type: application/json)"]
    G --> H["ASP.NET Core REST API\n(http://localhost:5000)"]
    H --> I["JSON Response Object\n(StoryResponse payload)"]
    I --> J["Provider State Mutation\n(setStories((prev) => updated))"]
    J --> K["React Virtual DOM Re-render\n(Component reflects new state)"]
```

---

## 6. Project Creation Sequence Diagram

```mermaid
sequenceDiagram
    actor User as User
    participant View as CreateProjectDialog.tsx
    participant Prov as ProjectsProvider.tsx
    participant ApiRepo as ApiProjectRepository.ts
    participant Ctrl as ProjectsController.cs
    participant Svc as ProjectService.cs
    participant Rep as ProjectRepository.cs
    participant Ctx as SprintFlowDbContext.cs
    participant DB as PostgreSQL

    User->>View: Enters Name & Description, clicks "Create"
    View->>Prov: createProject({ name, description })
    Prov->>ApiRepo: createProject(data)
    ApiRepo->>Ctrl: POST /api/projects (JSON Body)
    Ctrl->>Ctrl: Validate ModelState ([Required], [StringLength])
    alt ModelState Invalid
        Ctrl-->>ApiRepo: 400 Bad Request (Validation Errors)
    else ModelState Valid
        Ctrl->>Svc: CreateAsync(request, cancellationToken)
        Svc->>Rep: CreateAsync(project, cancellationToken)
        Rep->>Ctx: Projects.AddAsync(project)
        Rep->>Ctx: SaveChangesAsync(cancellationToken)
        Ctx->>DB: INSERT INTO "Projects" ("Name", "Description", "CreatedAt") VALUES (...)
        DB-->>Ctx: Confirmed (Id = 101)
        Ctx-->>Rep: Tracked entity with generated Id
        Rep-->>Svc: Project Model
        Svc-->>Ctrl: ProjectResponse DTO
        Ctrl-->>ApiRepo: 201 Created (Location: /api/projects/101, Body: ProjectResponse)
        ApiRepo-->>Prov: Project Object
        Prov->>Prov: Update local projects array state
        Prov-->>View: Success
        View-->>User: Closes modal & lists new project
    end
```

---

## 7. Story Creation Sequence Diagram (Business Validation)

Demonstrates the service layer performing domain validations (project existence, user existence, project team membership) before executing persistence.

```mermaid
sequenceDiagram
    actor User as User
    participant View as CreateStoryDialog.tsx
    participant Prov as StoriesProvider.tsx
    participant ApiRepo as ApiStoryRepository.ts
    participant Ctrl as StoriesController.cs
    participant Svc as StoryService.cs
    participant SRep as StoryRepository.cs
    participant PRep as ProjectRepository.cs
    participant URep as UserRepository.cs
    participant DB as PostgreSQL

    User->>View: Submits story with title, points, priority, assignedUserId
    View->>Prov: createStory(requestData)
    Prov->>ApiRepo: createStory(requestData)
    ApiRepo->>Ctrl: POST /api/projects/{projectId}/stories
    Ctrl->>Svc: CreateAsync(projectId, request, ct)

    Note over Svc: 1. Validate Project Existence
    Svc->>PRep: ExistsAsync(projectId, ct)
    PRep->>DB: SELECT 1 FROM "Projects" WHERE "Id" = projectId
    DB-->>PRep: true/false

    alt Project Does Not Exist
        Svc-->>Ctrl: throws KeyNotFoundException
        Ctrl-->>ApiRepo: 404 Not Found {"message": "Project ... not found"}
    else Project Exists
        opt If assignedUserId is provided
            Note over Svc: 2. Validate User Existence
            Svc->>URep: ExistsAsync(assignedUserId, ct)
            URep->>DB: SELECT 1 FROM "Users" WHERE "Id" = assignedUserId
            DB-->>URep: true/false
            alt User Does Not Exist
                Svc-->>Ctrl: throws InvalidOperationException("User does not exist")
                Ctrl-->>ApiRepo: 400 Bad Request
            else User Exists
                Note over Svc: 3. Validate Project Membership
                Svc->>SRep: IsUserMemberOfProjectAsync(assignedUserId, projectId, ct)
                SRep->>DB: SELECT 1 FROM "ProjectMembers" WHERE "ProjectId" = p AND "UserId" = u
                DB-->>SRep: true/false
                alt User is Not Project Member
                    Svc-->>Ctrl: throws InvalidOperationException("User must be member of project")
                    Ctrl-->>ApiRepo: 400 Bad Request
                end
            end
        end

        Note over Svc: All validations passed -> Persist
        Svc->>SRep: CreateAsync(storyEntity, ct)
        SRep->>DB: INSERT INTO "Stories" ...
        DB-->>SRep: Success (Generated Id)
        SRep-->>Svc: Story Entity
        Svc-->>Ctrl: StoryResponse DTO
        Ctrl-->>ApiRepo: 201 Created (Location: /api/stories/{id})
        ApiRepo-->>Prov: Story Object
        Prov-->>View: State updated
        View-->>User: Story added to backlog
    end
```

---

## 8. Project Member Sequence Diagram (Duplicate Prevention)

Shows `ProjectMemberService` enforcing duplicate membership prevention and returning `409 Conflict`.

```mermaid
sequenceDiagram
    actor User as User
    participant View as TeamPage.tsx / AddMemberDialog.tsx
    participant Prov as ProjectTeamProvider.tsx
    participant ApiRepo as ApiProjectMemberRepository.ts
    participant Ctrl as ProjectMembersController.cs
    participant Svc as ProjectMemberService.cs
    participant MRep as ProjectMemberRepository.cs
    participant DB as PostgreSQL

    User->>View: Selects User to add to Project Team
    View->>Prov: addMember(userId)
    Prov->>ApiRepo: addMember(projectId, userId)
    ApiRepo->>Ctrl: POST /api/projects/{projectId}/members { "userId": 2 }
    Ctrl->>Svc: AddMemberAsync(projectId, request, ct)

    Svc->>Svc: Validate Project & User Existence
    Svc->>MRep: IsMemberAsync(projectId, userId, ct)
    MRep->>DB: SELECT 1 FROM "ProjectMembers" WHERE "ProjectId" = ? AND "UserId" = ?
    DB-->>MRep: true/false

    alt User Already a Member
        MRep-->>Svc: true
        Svc-->>Ctrl: throws InvalidOperationException("User is already a member")
        Ctrl-->>ApiRepo: 409 Conflict {"message": "User is already a member of this project."}
        ApiRepo-->>Prov: throws Error (409 Conflict)
        Prov-->>View: Shows error alert: "User is already a member"
    else User Not a Member
        MRep-->>Svc: false
        Svc->>MRep: AddMemberAsync(membership, ct)
        MRep->>DB: INSERT INTO "ProjectMembers" ("ProjectId", "UserId") VALUES (...)
        DB-->>MRep: Success
        MRep-->>Svc: ProjectMember Entity
        Svc-->>Ctrl: ProjectMemberResponse DTO
        Ctrl-->>ApiRepo: 201 Created
        ApiRepo-->>Prov: Success
        Prov->>Prov: refreshMembers()
        Prov-->>View: Member displayed in Team List
    end
```

---

## 9. Story Assignee Business Rule Flow

Flowchart depicting the exact decision tree in `StoryService.ValidateAssigneeForProjectAsync()`.

```mermaid
flowchart TD
    Start(["Create / Update Story Request"]) --> CheckAssigned{"Is assignedUserId\nprovided (non-null)?"}

    CheckAssigned -- "NO (Unassigned Story)" --> AllowPersist["Validation Passed:\nAllow Persistence"]
    CheckAssigned -- "YES" --> QueryUser{"Does User exist\nin database?"}

    QueryUser -- "NO" --> ThrowNotFound["Throw InvalidOperationException\n('User does not exist')\n--> HTTP 400 Bad Request"]
    QueryUser -- "YES" --> QueryMember{"Is User an active member\nof target Project?"}

    QueryMember -- "NO" --> ThrowNotMember["Throw InvalidOperationException\n('Assignee must be a project member')\n--> HTTP 400 Bad Request"]
    QueryMember -- "YES" --> AllowPersist

    AllowPersist --> SaveStory["StoryRepository.CreateAsync() / UpdateAsync()\n--> Database Commit"]
    SaveStory --> Complete(["Return StoryResponse DTO\n--> HTTP 201 / 204"])
```

---

## 10. User Delete Sequence & Relational Integrity

Visualizes database-level cascades and nullification when a User entity is deleted.

```mermaid
sequenceDiagram
    actor Admin as Admin / User
    participant Ctrl as UsersController.cs
    participant Svc as UserService.cs
    participant URep as UserRepository.cs
    participant Ctx as SprintFlowDbContext.cs
    participant DB as PostgreSQL

    Admin->>Ctrl: DELETE /api/users/{id}
    Ctrl->>Svc: DeleteAsync(id, ct)
    Svc->>URep: DeleteAsync(id, ct)
    URep->>Ctx: Users.Remove(user)
    URep->>Ctx: SaveChangesAsync(ct)

    Note over Ctx,DB: EF Core executes atomic transaction for configured delete behaviors

    Ctx->>DB: 1. DELETE FROM "ProjectMembers" WHERE "UserId" = id (CASCADE)
    Ctx->>DB: 2. UPDATE "Stories" SET "AssignedUserId" = NULL WHERE "AssignedUserId" = id (SET NULL)
    Ctx->>DB: 3. DELETE FROM "Users" WHERE "Id" = id

    DB-->>Ctx: Transaction Committed Successfully
    Ctx-->>URep: true
    URep-->>Svc: true
    Svc-->>Ctrl: true
    Ctrl-->>Admin: 204 No Content

    Note over DB: Domain Integrity Maintained:\n- Memberships cleaned up\n- Stories preserved as Unassigned
```

---

## 11. Database Entity Relationship Diagram (ERD)

Physical schema representation reflecting EF Core `OnModelCreating` configuration and PostgreSQL database tables.

```mermaid
erDiagram
    Projects ||--o{ Stories : "1 to 0..* (OnDelete: CASCADE)"
    Projects ||--o{ ProjectMembers : "1 to 0..* (OnDelete: CASCADE)"
    Users ||--o{ ProjectMembers : "1 to 0..* (OnDelete: CASCADE)"
    Users ||--o{ Stories : "1 to 0..* (OnDelete: SET NULL)"

    Projects {
        bigint Id PK "GENERATED BY DEFAULT AS IDENTITY"
        varchar_100 Name "NOT NULL"
        varchar_1000 Description "NOT NULL"
        timestamptz CreatedAt "NOT NULL"
        timestamptz UpdatedAt "NULLABLE"
    }

    Users {
        bigint Id PK "GENERATED BY DEFAULT AS IDENTITY"
        varchar_100 Name "NOT NULL"
        varchar Role "NOT NULL (DEVELOPER, TESTER, MANAGER)"
        varchar_50 Avatar "NULLABLE (Hex or preset name)"
    }

    Stories {
        bigint Id PK "GENERATED BY DEFAULT AS IDENTITY"
        bigint ProjectId FK "NOT NULL -> Projects.Id"
        varchar_200 Title "NOT NULL"
        varchar_2000 Description "NOT NULL"
        varchar Priority "NOT NULL (LOW, MEDIUM, HIGH)"
        int StoryPoints "NOT NULL (Range: 1-100)"
        bigint AssignedUserId FK "NULLABLE -> Users.Id"
        varchar Status "NOT NULL (BACKLOG, IN_PROGRESS, TESTING, DONE)"
        timestamptz CreatedAt "NOT NULL"
        timestamptz UpdatedAt "NULLABLE"
    }

    ProjectMembers {
        bigint Id PK "GENERATED BY DEFAULT AS IDENTITY"
        bigint ProjectId FK "NOT NULL -> Projects.Id"
        bigint UserId FK "NOT NULL -> Users.Id"
    }
```

---

## 12. Domain Model / UML Class Diagram

Conceptual domain entity design in C# backend, showing models, enums, and relationships.

```mermaid
classDiagram
    class Project {
        +long Id
        +string Name
        +string Description
        +DateTime CreatedAt
        +DateTime? UpdatedAt
        +ICollection~Story~ Stories
        +ICollection~ProjectMember~ ProjectMembers
    }

    class User {
        +long Id
        +string Name
        +string Role
        +string? Avatar
        +ICollection~ProjectMember~ ProjectMemberships
        +ICollection~Story~ AssignedStories
    }

    class Story {
        +long Id
        +long ProjectId
        +string Title
        +string Description
        +StoryPriority Priority
        +int StoryPoints
        +long? AssignedUserId
        +StoryStatus Status
        +DateTime CreatedAt
        +DateTime? UpdatedAt
        +Project Project
        +User? AssignedUser
    }

    class ProjectMember {
        +long Id
        +long ProjectId
        +long UserId
        +Project Project
        +User User
    }

    class StoryPriority {
        <<enumeration>>
        LOW
        MEDIUM
        HIGH
    }

    class StoryStatus {
        <<enumeration>>
        BACKLOG
        IN_PROGRESS
        TESTING
        DONE
    }

    class UserRole {
        <<enumeration>>
        DEVELOPER
        TESTER
        MANAGER
    }

    Project "1" *-- "0..*" Story : owns
    Project "1" *-- "0..*" ProjectMember : has
    User "1" *-- "0..*" ProjectMember : participates in
    User "1" o-- "0..*" Story : assigned to
    Story --> StoryPriority : typed by
    Story --> StoryStatus : typed by
    User --> UserRole : classified by
```

---

## 13. Transaction & Unit of Work Persistence Model

Contrasts standard single-operation CRUD execution with multi-step explicit transaction boundaries.

```mermaid
graph TD
    subgraph StandardCRUD["Standard CRUD Pattern (Implemented in SprintFlow)"]
        S1["Service Operation"] --> R1["Repository Operation\n(_context.Entity.AddAsync / Remove)"]
        R1 --> CT1["DbContext ChangeTracker\n(Marks entity Added / Modified / Deleted)"]
        CT1 --> SC1["SaveChangesAsync(cancellationToken)"]
        SC1 --> TX1["EF Core Internal Transaction\n(Automatic BEGIN ... COMMIT on success / ROLLBACK on fail)"]
        TX1 --> PG1[("PostgreSQL\nAtomic persistence of tracked changes")]
    end

    subgraph ExplicitTransaction["Explicit Transaction Pattern (Reserved for Multi-Step Workflows)"]
        S2["Complex Multi-Service Workflow"] --> B2["await _context.Database.BeginTransactionAsync()"]
        B2 --> R2A["Repository A -> SaveChangesAsync()"]
        R2A --> R2B["Repository B -> SaveChangesAsync()"]
        R2B --> C2{"All steps\nsucceeded?"}
        C2 -- "YES" --> CM2["await transaction.CommitAsync()"]
        C2 -- "NO (Exception)" --> RB2["await transaction.RollbackAsync()\n(Zero partial data committed)"]
    end
```

> **Engineering Principle**: SprintFlow's CRUD operations rely on `SaveChangesAsync()`'s built-in transaction behavior. Explicit transactions (`BeginTransactionAsync`) are not needed for single-table operations, preventing unnecessary connection locking and overhead.

---

## 14. CancellationToken Propagation Flow

Demonstrates cooperative async task cancellation across all architectural tiers.

```mermaid
sequenceDiagram
    autonumber
    actor Client as Web Browser
    participant Kestrel as ASP.NET Core Runtime
    participant Ctrl as ProjectsController
    participant Svc as ProjectService
    participant Repo as ProjectRepository
    participant EF as EF Core 10
    participant PG as PostgreSQL

    Client->>Kestrel: GET /api/projects (Long running or heavy query)
    Kestrel->>Ctrl: GetAllProjects(CancellationToken ct)
    Ctrl->>Svc: GetAllAsync(ct)
    Svc->>Repo: GetAllAsync(ct)
    Repo->>EF: _context.Projects.AsNoTracking().ToListAsync(ct)
    EF->>PG: SQL: SELECT * FROM "Projects" ...

    alt Client Cancels Request (Tab Closed / Navigated away)
        Client--xKestrel: Connection Aborted by Client
        Kestrel->>Kestrel: ct.Cancel() triggered
        Kestrel-->>EF: ct is CancellationRequested
        EF-->>Repo: Throws OperationCanceledException
        Repo-->>Svc: Propagates OperationCanceledException
        Svc-->>Ctrl: Propagates OperationCanceledException
        Ctrl-->>Kestrel: Request aborted cleanly
        Note over PG: DB connection released back to pool immediately
    else Request Completes Normally
        PG-->>EF: Data Rows
        EF-->>Repo: List<Project>
        Repo-->>Svc: IEnumerable<Project>
        Svc-->>Ctrl: IEnumerable<ProjectResponse>
        Ctrl-->>Client: 200 OK (JSON Payload)
    end
```

> **Note**: `CancellationToken` provides **cooperative asynchronous cancellation**. It stops redundant computation when clients disconnect; it is distinct from database transaction rollback.

---

## 15. Error Propagation & Exception Handling Flow

Shows how different errors are mapped to specific HTTP status codes and handled on the frontend.

```mermaid
graph TD
    Req["Incoming API Request"] --> Ctrl["Controller Action"]
    Ctrl --> ModelVal{"ModelState.IsValid?"}

    ModelVal -- "NO" --> E400["400 Bad Request\n(Validation errors: missing fields, invalid ranges)"]
    ModelVal -- "YES" --> SvcCall["Call Domain Service"]

    SvcCall --> SvcTry{"Service Execution"}

    SvcTry -- "Entity Not Found\n(KeyNotFoundException)" --> E404["404 Not Found\n({'message': 'Project/User with ID was not found'})"]
    SvcTry -- "Business Rule Violation\n(InvalidOperationException)" --> CheckConflict{"Is Duplicate\nMembership?"}

    CheckConflict -- "YES" --> E409["409 Conflict\n({'message': 'User is already a member...'})"]
    CheckConflict -- "NO" --> E400_Biz["400 Bad Request\n({'message': 'Assignee must be a project member'})"]

    SvcTry -- "Unhandled Exception\n(Database down, NullRef, etc.)" --> GMW["GlobalExceptionMiddleware\n(Logs stack trace securely)"]
    GMW --> E500["500 Internal Server Error\n({'message': 'An unexpected server error occurred.'})"]

    SvcTry -- "Success" --> E200["200 OK / 201 Created / 204 NoContent"]

    E400 --> Resp["HTTP Response"]
    E404 --> Resp
    E409 --> Resp
    E400_Biz --> Resp
    E500 --> Resp
    E200 --> Resp

    Resp --> FE["ApiRepository fetch()"]
    FE --> FECheck{"response.ok?"}
    FECheck -- "NO" --> FEError["Throw Error(message)\nProvider captures error in state\nUI displays MUI Alert"]
    FECheck -- "YES" --> FESuccess["Parse JSON & update local React state\nComponent renders updated UI"]
```

---

## 16. Frontend Repository Abstraction

Illustrates how TypeScript interfaces decouple UI components from the HTTP network layer.

```mermaid
graph TB
    subgraph UIComponents["React UI Components"]
        Page["StoriesPage.tsx"]
        Board["KanbanBoardView.tsx"]
    end

    subgraph StateTier["State & Hook Tier"]
        Hook["useStories() hook"]
        Provider["StoriesProvider.tsx\n(Context & State Management)"]
    end

    subgraph RepoAbstraction["Repository Interface Boundary"]
        Interface["StoryRepository (TypeScript Interface)\n+getStoriesByProject(projectId: number)\n+getStoryById(id: number)\n+createStory(data: CreateStoryRequest)\n+updateStory(id: number, data: UpdateStoryRequest)\n+deleteStory(id: number)"]
    end

    subgraph ConcreteImplementations["Concrete Implementations"]
        API_Impl["ApiStoryRepository.ts\n(Active: fetch() -> http://localhost:5000)"]
        Local_Impl["LocalStorageStoryRepository.ts\n(Fallback / Standalone Mode)"]
    end

    Page --> Hook
    Board --> Hook
    Hook --> Provider
    Provider --> Interface
    Interface -.->|"Configured Wiring (storyRepository.ts)"| API_Impl
    Interface -.->|"Alternative Implementation"| Local_Impl
    API_Impl --> Backend["ASP.NET Core REST API"]
```

---

## 17. Deployment Topology (Local Development)

Visualizes the process and port architecture during local development execution.

```mermaid
graph TB
    subgraph HostMachine["Developer Workstation (Localhost)"]
        subgraph BrowserProcess["Web Browser"]
            Client["React SPA App\nhttp://localhost:5173"]
        end

        subgraph NodeRuntime["Node.js Environment"]
            ViteServer["Vite 8 Dev Server\nPort: 5173\n(Hot Module Replacement / Asset Bundling)"]
        end

        subgraph DotNetRuntime[".NET 10 Runtime"]
            Kestrel["ASP.NET Core Kestrel Server\nPort: 5000 (HTTP) / 7270 (HTTPS)\nCORS Policy: AllowFrontendApp"]
            APICode["SprintFlowAPI Application\n(Controllers, Services, EF Core 10)"]
        end

        subgraph DatabaseProcess["PostgreSQL Server Process"]
            PostgreEngine["PostgreSQL 14+ Engine\nPort: 5432\nDatabase: 'SprintFlow'"]
        end
    end

    Client -->|"Loads HTML/JS/CSS assets"| ViteServer
    Client -->|"REST API calls (HTTP/JSON)"| Kestrel
    Kestrel --> APICode
    APICode -->|"Npgsql TCP connection (Port 5432)"| PostgreEngine
```

---

## 18. Architectural Concepts Illustrated

The diagrams in this document illustrate the core architectural concepts of SprintFlow:

| Diagram | Primary Engineering Concept |
|---|---|
| **System Context (§1)** | System boundaries and external actor interactions |
| **High-Level Architecture (§2)** | Downward dependency flow and strict layer decoupling |
| **Component Diagram (§3)** | Package structure and cross-boundary dependencies |
| **Request Lifecycle (§4)** | End-to-end request-response cycle from DOM event to SQL query |
| **Frontend Data Flow (§5)** | React Context and custom hook state isolation |
| **Project Creation Sequence (§6)** | REST resource creation with `201 Created` and Location header |
| **Story Creation Sequence (§7)** | Cross-entity business validation inside the Service layer |
| **Member Sequence (§8)** | Duplicate constraint enforcement returning `409 Conflict` |
| **Story Assignee Flow (§9)** | Domain decision tree for project-scoped story assignments |
| **User Delete Sequence (§10)** | Multi-table relational cascade (`CASCADE` vs `SET NULL`) |
| **Database ERD (§11)** | Physical schema constraints, identity PKs, and foreign keys |
| **Domain Model (§12)** | C# entity relationships and enum typing |
| **Transaction Model (§13)** | EF Core `SaveChangesAsync()` implicit transactions vs explicit boundaries |
| **CancellationToken Flow (§14)** | Cooperative async task cancellation preventing connection leaks |
| **Error Handling Flow (§15)** | Exception-to-HTTP-status mapping and frontend error state capture |
| **Repository Abstraction (§16)** | Interface-based decoupling of presentation from transport |
| **Deployment Topology (§17)** | Multi-tier local process execution model |

---

*For detailed code-level explanations and design rationale, refer to [architecture.md](architecture.md), [database.md](database.md), and [api.md](api.md).*
