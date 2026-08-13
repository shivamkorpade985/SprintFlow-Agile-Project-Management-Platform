/**
 * ProjectTeamContext
 *
 * Defines the React Context contract for project team membership management.
 *
 * Components consume this via `useProjectTeam()` custom hook.
 */
import { createContext } from "react";
import type { User } from "../types/user";

export interface ProjectTeamContextValue {
  members: User[];
  isLoading: boolean;
  error: string | null;

  refreshMembers: () => Promise<void>;

  addMember: (userId: string) => Promise<void>;
  removeMember: (userId: string) => Promise<void>;
}

export const ProjectTeamContext =
  createContext<ProjectTeamContextValue | undefined>(
    undefined,
  );