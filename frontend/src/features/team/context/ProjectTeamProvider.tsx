/**
 * ProjectTeamProvider
 *
 * Context Provider owning the project team members state for a specific `projectId`.
 *
 * Domain Model Relationship:
 * System User (UserRepository)
 *   ↓
 * Project Membership (ProjectMemberRepository: projectId, userId)
 *   ↓
 * Project Team Members (`members: User[]`)
 *   ↓
 * Story Assignees (In CreateStoryDialog / EditStoryDialog / KanbanCard / StoryCard)
 *
 * Responsibilities:
 * - Queries project memberships and resolves full `User` objects for the specified `projectId`.
 * - Exposes `members` list used across Team Page, Story Assignees, Kanban Board, and Dashboard.
 * - Handles `addMember` and `removeMember` operations, instantly refreshing team state.
 */
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type { User } from "../types/user";
import { LocalStorageUserRepository } from "../../../repositories/local/LocalStorageUserRepository";
import { LocalStorageProjectMemberRepository } from "../../../repositories/local/LocalStorageProjectMemberRepository";

import { ProjectTeamContext } from "./projectTeamContext";

interface ProjectTeamProviderProps {
  projectId: string;
  children: React.ReactNode;
}

const userRepository = new LocalStorageUserRepository();
const projectMemberRepository =
  new LocalStorageProjectMemberRepository();

export function ProjectTeamProvider({
  projectId,
  children,
}: ProjectTeamProviderProps) {
  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshMembers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const memberships =
        await projectMemberRepository.getMembers(projectId);

      const users = await userRepository.getUsers();

      const memberUserIds = new Set(
        memberships.map(
          (membership) => membership.userId,
        ),
      );

      const projectMembers = users.filter((user) =>
        memberUserIds.has(user.id),
      );

      setMembers(projectMembers);
    } catch {
      setError("Failed to load project team.");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const addMember = useCallback(
    async (userId: string): Promise<void> => {
      try {
        setError(null);

        await projectMemberRepository.addMember(
          projectId,
          userId,
        );

        await refreshMembers();
      } catch {
        setError("Failed to add team member.");
        throw new Error("Failed to add team member.");
      }
    },
    [projectId, refreshMembers],
  );

  const removeMember = useCallback(
    async (userId: string): Promise<void> => {
      try {
        setError(null);

        await projectMemberRepository.removeMember(
          projectId,
          userId,
        );

        await refreshMembers();
      } catch {
        setError("Failed to remove team member.");
        throw new Error("Failed to remove team member.");
      }
    },
    [projectId, refreshMembers],
  );

  useEffect(() => {
    let isMounted = true;

    const loadMembers = async () => {
      try {
        const memberships =
          await projectMemberRepository.getMembers(projectId);

        const users = await userRepository.getUsers();

        const memberUserIds = new Set(
          memberships.map(
            (membership) => membership.userId,
          ),
        );

        const projectMembers = users.filter((user) =>
          memberUserIds.has(user.id),
        );

        if (isMounted) {
          setMembers(projectMembers);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load project team.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadMembers();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  return (
    <ProjectTeamContext.Provider
      value={{
        members,
        isLoading,
        error,
        refreshMembers,
        addMember,
        removeMember,
      }}
    >
      {children}
    </ProjectTeamContext.Provider>
  );
}