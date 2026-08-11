import type { ProjectMember } from "../features/team/types/projectMember";

export interface ProjectMemberRepository {
  getMembers(projectId: string): Promise<ProjectMember[]>;
  addMember(projectId: string, userId: string): Promise<ProjectMember>;
  removeMember(
    projectId: string,
    userId: string,
  ): Promise<void>;
}