import { useCallback, useEffect, useState } from "react";
import type { Project } from "../../../types/project";
import type { CreateProjectRequest } from "../../../types/contracts/project";
import { projectRepository } from "../projectRepository";
import { ProjectsContext } from "./projectsContext";

interface ProjectsProviderProps {
  children: React.ReactNode;
}

export function ProjectsProvider({
  children,
}: ProjectsProviderProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await projectRepository.getProjects();

      setProjects(data);
    } catch {
      setError("Failed to load projects.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProject = useCallback(
  async (data: CreateProjectRequest): Promise<Project> => {
    try {
      setError(null);

      const createdProject =
        await projectRepository.createProject(data);

      setProjects((currentProjects) => [
        ...currentProjects,
        createdProject,
      ]);

      return createdProject;
    } catch {
      setError("Failed to create project.");
      throw new Error("Failed to create project.");
    }
  },
  [],
);

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        const data = await projectRepository.getProjects();

        if (isMounted) {
          setProjects(data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load projects.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        isLoading,
        error,
        refreshProjects,
        createProject,
}}
    >
      {children}
    </ProjectsContext.Provider>
  );
}