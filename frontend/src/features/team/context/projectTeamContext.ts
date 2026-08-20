/**
 * ProjectTeamContext
 *
 * Defines the React Context contract for project team membership management.
 */
import { createContext } from "react";
import type { User } from "../types/user";

export interface ProjectTeamContextValue {
  members: User[];
  isLoading: boolean;
  error: string | null;

  refreshMembers: () => Promise<void>;

  addMember: (userId: number) => Promise<void>;
  removeMember: (userId: number) => Promise<void>;
}

export const ProjectTeamContext =
  createContext<ProjectTeamContextValue | undefined>(
    undefined,
  );