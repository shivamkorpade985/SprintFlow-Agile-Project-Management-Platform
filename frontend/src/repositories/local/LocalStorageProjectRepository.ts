/**
 * LocalStorageProjectRepository
 *
 * Client-side implementation of `ProjectRepository` backed by browser `localStorage`.
 */
import type { Project } from "../../features/projects/types/project";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../../features/projects/types/contracts/project";
import { STORAGE_KEYS } from "../../constants/storageKeys";
import { getItem, setItem } from "../../storage/localStorage";
import type { ProjectRepository } from "../ProjectRepository";

export class LocalStorageProjectRepository implements ProjectRepository {
  async getProjects(): Promise<Project[]> {
    return getItem<Project[]>(STORAGE_KEYS.PROJECTS) ?? [];
  }

  async getProjectById(id: number): Promise<Project | null> {
    const projects = await this.getProjects();

    return projects.find((project) => project.id === id) ?? null;
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    const projects = await this.getProjects();

    const maxId = projects.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const project: Project = {
      id: maxId + 1,
      ...data,
    };

    setItem(STORAGE_KEYS.PROJECTS, [...projects, project]);

    return project;
  }

  async updateProject(
    id: number,
    data: UpdateProjectRequest,
  ): Promise<Project> {
    const projects = await this.getProjects();

    const existingProject = projects.find((project) => project.id === id);

    if (!existingProject) {
      throw new Error("Project not found");
    }

    const updatedProject: Project = {
      ...existingProject,
      ...data,
    };

    setItem(
      STORAGE_KEYS.PROJECTS,
      projects.map((project) =>
        project.id === id ? updatedProject : project,
      ),
    );

    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    const projects = await this.getProjects();

    setItem(
      STORAGE_KEYS.PROJECTS,
      projects.filter((project) => project.id !== id),
    );
  }
}