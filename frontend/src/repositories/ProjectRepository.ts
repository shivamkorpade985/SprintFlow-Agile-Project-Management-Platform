/**
 * ProjectRepository Interface
 *
 * Abstract repository contract defining data operations for Project entities.
 */
import type { Project } from "../features/projects/types/project";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../features/projects/types/contracts/project";

export interface ProjectRepository {
  getProjects(): Promise<Project[]>;
  getProjectById(id: number): Promise<Project | null>;
  createProject(data: CreateProjectRequest): Promise<Project>;
  updateProject(id: number, data: UpdateProjectRequest): Promise<Project>;
  deleteProject(id: number): Promise<void>;
}