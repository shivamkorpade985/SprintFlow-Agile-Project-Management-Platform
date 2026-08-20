/**
 * ApiStoryRepository
 *
 * Concrete implementation of `StoryRepository` backed by the ASP.NET Core REST API.
 * Communicates with backend endpoints at `/api/projects/{projectId}/stories` and `/api/stories/{id}`.
 */
import type { UserStory } from "../../features/stories/types/story";
import type {
  CreateStoryRequest,
  UpdateStoryRequest,
} from "../../features/stories/types/contracts/story";
import type { StoryRepository } from "../StoryRepository";

export class ApiStoryRepository implements StoryRepository {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl ??
      (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
      "http://localhost:5000";
  }

  async getStoriesByProject(projectId: number): Promise<UserStory[]> {
    const response = await fetch(
      `${this.baseUrl}/api/projects/${projectId}/stories`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (response.status === 404) {
      throw new Error(`Project with ID '${projectId}' was not found.`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch stories for project ${projectId}: ${response.status} ${response.statusText}${
          errorText ? ` - ${errorText}` : ""
        }`,
      );
    }

    return (await response.json()) as UserStory[];
  }

  async getStoryById(id: number): Promise<UserStory | null> {
    const response = await fetch(`${this.baseUrl}/api/stories/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch story ${id}: ${response.status} ${response.statusText}${
          errorText ? ` - ${errorText}` : ""
        }`,
      );
    }

    return (await response.json()) as UserStory;
  }

  async createStory(data: CreateStoryRequest): Promise<UserStory> {
    const payload = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      storyPoints: data.storyPoints,
      assignedUserId: data.assignedUserId ?? null,
      status: data.status,
    };

    const response = await fetch(
      `${this.baseUrl}/api/projects/${data.projectId}/stories`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create story: ${response.status} ${response.statusText}${
          errorText ? ` - ${errorText}` : ""
        }`,
      );
    }

    return (await response.json()) as UserStory;
  }

  async updateStory(
    id: number,
    data: UpdateStoryRequest,
  ): Promise<UserStory> {
    const payload = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      storyPoints: data.storyPoints,
      assignedUserId: data.assignedUserId ?? null,
      status: data.status,
    };

    const response = await fetch(`${this.baseUrl}/api/stories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 404) {
      throw new Error(`Story with ID '${id}' was not found.`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to update story ${id}: ${response.status} ${response.statusText}${
          errorText ? ` - ${errorText}` : ""
        }`,
      );
    }

    // 204 No Content returned from API; construct and return updated story
    return {
      id,
      projectId: (data as unknown as { projectId?: number }).projectId ?? 0,
      title: data.title,
      description: data.description,
      priority: data.priority,
      storyPoints: data.storyPoints,
      assignedUserId: data.assignedUserId ?? null,
      status: data.status,
      createdAt: new Date().toISOString(),
    };
  }

  async deleteStory(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/stories/${id}`, {
      method: "DELETE",
    });

    if (response.status === 404) {
      throw new Error(`Story with ID '${id}' was not found.`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to delete story ${id}: ${response.status} ${response.statusText}${
          errorText ? ` - ${errorText}` : ""
        }`,
      );
    }
  }
}
