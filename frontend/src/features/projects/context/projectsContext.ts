/**
 * ProjectsContext
 *
 * Defines the React Context contract for managing global project state.
 *
 * Components consume this state via `useProjects()` custom hook rather than calling
 * `useContext(ProjectsContext)` directly.
 */
import { createContext } from "react";
import type { CreateProjectRequest, UpdateProjectRequest } from "../types/contracts/project";
import type { Project } from "../types/project";

export interface ProjectsContextValue {
  projects: Project[];
  isLoading: boolean;
  error: string | null;

  refreshProjects: () => Promise<void>;

  createProject: (
    data: CreateProjectRequest,
  ) => Promise<Project>;

  updateProject: (
    id: string,
    data: UpdateProjectRequest,
  ) => Promise<Project>;

  deleteProject: (id: string) => Promise<void>;
}

export const ProjectsContext =
  createContext<ProjectsContextValue | undefined>(undefined);