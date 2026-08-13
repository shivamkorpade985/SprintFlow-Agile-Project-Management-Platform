/**
 * useProjects Custom Hook
 *
 * Convenience hook for consuming `ProjectsContext`.
 *
 * Throws an explicit error if invoked outside `ProjectsProvider`, ensuring invalid context usage
 * is caught early during development.
 */
import { useContext } from "react";
import { ProjectsContext } from "../context/projectsContext";

export function useProjects() {
  const context = useContext(ProjectsContext);

  if (!context) {
    throw new Error(
      "useProjects must be used within ProjectsProvider",
    );
  }

  return context;
}