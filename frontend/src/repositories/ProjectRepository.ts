import type { Project } from "../types/project";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../types/contracts/project";

export interface ProjectRepository {
  getProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | null>;
  createProject(data: CreateProjectRequest): Promise<Project>;
  updateProject(id: string, data: UpdateProjectRequest): Promise<Project>;
  deleteProject(id: string): Promise<void>;
}