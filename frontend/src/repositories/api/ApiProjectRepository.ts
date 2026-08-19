/**
 * ApiProjectRepository
 *
 * Concrete implementation of `ProjectRepository` backed by the ASP.NET Core REST API.
 * Communicates with backend endpoints at `/api/projects` using numeric IDs.
 */
import type { Project } from "../../features/projects/types/project";
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
} from "../../features/projects/types/contracts/project";
import type { ProjectRepository } from "../ProjectRepository";

export class ApiProjectRepository implements ProjectRepository {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl ??
      (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
      "http://localhost:5000";
  }

  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${this.baseUrl}/api/projects`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch projects: ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as Project[];
  }

  async getProjectById(id: number): Promise<Project | null> {
    const response = await fetch(`${this.baseUrl}/api/projects/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch project ${id}: ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as Project;
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    const response = await fetch(`${this.baseUrl}/api/projects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create project: ${response.status} ${response.statusText}${
          errorText ? ` - ${errorText}` : ""
        }`,
      );
    }

    return (await response.json()) as Project;
  }

  async updateProject(
    id: number,
    data: UpdateProjectRequest,
  ): Promise<Project> {
    const response = await fetch(`${this.baseUrl}/api/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.status === 404) {
      throw new Error(`Project with ID '${id}' was not found.`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to update project ${id}: ${response.status} ${response.statusText}${
          errorText ? ` - ${errorText}` : ""
        }`,
      );
    }

    // 204 No Content returned from API; construct and return updated project
    return {
      id,
      name: data.name,
      description: data.description,
    };
  }

  async deleteProject(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/projects/${id}`, {
      method: "DELETE",
    });

    if (response.status === 404) {
      throw new Error(`Project with ID '${id}' was not found.`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to delete project ${id}: ${response.status} ${response.statusText}${
          errorText ? ` - ${errorText}` : ""
        }`,
      );
    }
  }
}