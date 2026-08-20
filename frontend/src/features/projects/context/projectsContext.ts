/**
 * ProjectsContext
 *
 * Defines the React Context contract for managing global project state.
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
    id: number,
    data: UpdateProjectRequest,
  ) => Promise<Project>;

  deleteProject: (id: number) => Promise<void>;
}

export const ProjectsContext =
  createContext<ProjectsContextValue | undefined>(undefined);