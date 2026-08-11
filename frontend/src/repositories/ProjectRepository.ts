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