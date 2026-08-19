/**
 * ProjectMemberRepository Interface
 *
 * Persistence contract for project-user membership associations.
 */
import type { ProjectMember } from "../features/team/types/projectMember";

export interface ProjectMemberRepository {
  getMembers(projectId: number): Promise<ProjectMember[]>;
  addMember(projectId: number, userId: number): Promise<ProjectMember>;
  removeMember(
    projectId: number,
    userId: number,
  ): Promise<void>;
}