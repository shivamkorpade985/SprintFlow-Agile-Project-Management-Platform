/**
 * ProjectMemberRepository Interface
 *
 * Persistence contract for project-user membership associations.
 *
 * Relationship Flow:
 * System User (userId) + Project (projectId) -> ProjectMember
 *
 * `ProjectTeamProvider` consumes this repository to query and update project-scoped team membership.
 */
import type { ProjectMember } from "../features/team/types/projectMember";

export interface ProjectMemberRepository {
  getMembers(projectId: string): Promise<ProjectMember[]>;
  addMember(projectId: string, userId: string): Promise<ProjectMember>;
  removeMember(
    projectId: string,
    userId: string,
  ): Promise<void>;
}