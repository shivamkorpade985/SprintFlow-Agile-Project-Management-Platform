//Here context definitions are 

import { createContext } from "react";
import type { Project } from "../../../types/project";
import type { CreateProjectRequest } from "../../../types/contracts/project";

export interface ProjectsContextValue {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  refreshProjects: () => Promise<void>;
  createProject: (data: CreateProjectRequest) => Promise<Project>;

}

export const ProjectsContext =
  createContext<ProjectsContextValue | undefined>(undefined);