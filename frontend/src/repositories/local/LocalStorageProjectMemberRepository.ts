/**
 * LocalStorageProjectMemberRepository
 *
 * Client-side implementation of `ProjectMemberRepository` backed by `localStorage`.
 *
 * Storage Details:
 * - Key: `STORAGE_KEYS.PROJECT_MEMBERS` ("sprintflow_project_members")
 * - `getMembers`: Filters global membership records by `projectId`.
 * - `addMember`: Prevents duplicate `(projectId, userId)` membership records.
 * - `removeMember`: Removes matching `(projectId, userId)` association.
 */
import type { ProjectMember } from "../../features/team/types/projectMember";
import { STORAGE_KEYS } from "../../constants/storageKeys";
import { getItem, setItem } from "../../storage/localStorage";
import type { ProjectMemberRepository } from "../ProjectMemberRepository";

export class LocalStorageProjectMemberRepository
  implements ProjectMemberRepository
{
  async getMembers(
    projectId: string,
  ): Promise<ProjectMember[]> {
    const memberships =
      getItem<ProjectMember[]>(
        STORAGE_KEYS.PROJECT_MEMBERS,
      ) ?? [];

    return memberships.filter(
      (membership) =>
        membership.projectId === projectId,
    );
  }

  async addMember(
    projectId: string,
    userId: string,
  ): Promise<ProjectMember> {
    const memberships =
      getItem<ProjectMember[]>(
        STORAGE_KEYS.PROJECT_MEMBERS,
      ) ?? [];

    const existingMembership = memberships.find(
      (membership) =>
        membership.projectId === projectId &&
        membership.userId === userId,
    );

    if (existingMembership) {
      return existingMembership;
    }

    const membership: ProjectMember = {
      projectId,
      userId,
    };

    setItem(STORAGE_KEYS.PROJECT_MEMBERS, [
      ...memberships,
      membership,
    ]);

    return membership;
  }

  async removeMember(
    projectId: string,
    userId: string,
  ): Promise<void> {
    const memberships =
      getItem<ProjectMember[]>(
        STORAGE_KEYS.PROJECT_MEMBERS,
      ) ?? [];

    setItem(
      STORAGE_KEYS.PROJECT_MEMBERS,
      memberships.filter(
        (membership) =>
          !(
            membership.projectId === projectId &&
            membership.userId === userId
          ),
      ),
    );
  }
}