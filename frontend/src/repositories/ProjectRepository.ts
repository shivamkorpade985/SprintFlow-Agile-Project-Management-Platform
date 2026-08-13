/**
 * ProjectRepository Interface
 *
 * Abstract repository contract defining data operations for Project entities.
 *
 * Architectural Design:
 * UI / Providers depend strictly on this interface rather than direct storage primitives.
 *
 * Current Concrete Implementation:
 * - `LocalStorageProjectRepository` (Client-side persistence via window.localStorage)
 *
 * Future Implementation:
 * - `ApiProjectRepository` (Backed by ASP.NET Core REST API)
 */
import type { Project } from "../features/projects/types/project";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../features/projects/types/contracts/project";

export interface ProjectRepository {
  getProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | null>;
  createProject(data: CreateProjectRequest): Promise<Project>;
  updateProject(id: string, data: UpdateProjectRequest): Promise<Project>;
  deleteProject(id: string): Promise<void>;
}