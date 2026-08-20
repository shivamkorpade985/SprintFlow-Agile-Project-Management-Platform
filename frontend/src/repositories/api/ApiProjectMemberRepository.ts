/**
 * ApiProjectMemberRepository
 *
 * Concrete implementation of `ProjectMemberRepository` backed by the ASP.NET Core REST API.
 * Communicates with backend endpoints at `/api/projects/{projectId}/members` and `/api/projects/{projectId}/members/{userId}`.
 */
import type { ProjectMember } from "../../features/team/types/projectMember";
import type { ProjectMemberRepository } from "../ProjectMemberRepository";

export class ApiProjectMemberRepository implements ProjectMemberRepository {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl =
      baseUrl ??
      (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
      "http://localhost:5000";
  }

  async getMembers(projectId: number): Promise<ProjectMember[]> {
    const response = await fetch(
      `${this.baseUrl}/api/projects/${projectId}/members`,
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
        `Failed to fetch project members for project ${projectId}: ${response.status} ${response.statusText}${
          errorText ? ` - ${errorText}` : ""
        }`,
      );
    }

    return (await response.json()) as ProjectMember[];
  }

  async addMember(
    projectId: number,
    userId: number,
  ): Promise<ProjectMember> {
    const response = await fetch(
      `${this.baseUrl}/api/projects/${projectId}/members`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ userId }),
      },
    );

    if (!response.ok) {
      let errorMessage = `Failed to add member: ${response.status} ${response.statusText}`;
      try {
        const errorJson = (await response.json()) as { message?: string };
        if (errorJson?.message) {
          errorMessage = errorJson.message;
        }
      } catch {
        const errorText = await response.text().catch(() => "");
        if (errorText) {
          errorMessage += ` - ${errorText}`;
        }
      }
      throw new Error(errorMessage);
    }

    return (await response.json()) as ProjectMember;
  }

  async removeMember(
    projectId: number,
    userId: number,
  ): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/api/projects/${projectId}/members/${userId}`,
      {
        method: "DELETE",
      },
    );

    if (response.status === 404) {
      throw new Error(
        `User with ID '${userId}' is not a member of project '${projectId}'.`,
      );
    }

    if (!response.ok) {
      let errorMessage = `Failed to remove member: ${response.status} ${response.statusText}`;
      try {
        const errorJson = (await response.json()) as { message?: string };
        if (errorJson?.message) {
          errorMessage = errorJson.message;
        }
      } catch {
        const errorText = await response.text().catch(() => "");
        if (errorText) {
          errorMessage += ` - ${errorText}`;
        }
      }
      throw new Error(errorMessage);
    }
  }
}
