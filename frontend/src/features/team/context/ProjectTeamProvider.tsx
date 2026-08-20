/**
 * ProjectTeamProvider
 *
 * Context Provider owning the project team members state for a specific numeric `projectId`.
 */
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type { User } from "../types/user";
import { userRepository } from "../userRepository";
import { projectMemberRepository } from "../projectMemberRepository";
import { ProjectTeamContext } from "./projectTeamContext";

interface ProjectTeamProviderProps {
  projectId: number;
  children: React.ReactNode;
}

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
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load project team.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const addMember = useCallback(
    async (userId: number): Promise<void> => {
      try {
        setError(null);

        await projectMemberRepository.addMember(
          projectId,
          userId,
        );

        await refreshMembers();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to add team member.";
        setError(message);
        throw new Error(message, { cause: err });
      }
    },
    [projectId, refreshMembers],
  );

  const removeMember = useCallback(
    async (userId: number): Promise<void> => {
      try {
        setError(null);

        await projectMemberRepository.removeMember(
          projectId,
          userId,
        );

        await refreshMembers();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to remove team member.";
        setError(message);
        throw new Error(message, { cause: err });
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
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof Error ? err.message : "Failed to load project team.";
          setError(message);
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