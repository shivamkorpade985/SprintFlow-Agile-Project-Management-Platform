/**
 * useProjectTeam Custom Hook
 *
 * Convenience hook for accessing project team members state and operations.
 *
 * Throws an explicit error if invoked outside `ProjectTeamProvider`.
 */
import { useContext } from "react";

import { ProjectTeamContext } from "../context/projectTeamContext";

export function useProjectTeam() {
  const context = useContext(ProjectTeamContext);

  if (!context) {
    throw new Error(
      "useProjectTeam must be used within ProjectTeamProvider",
    );
  }

  return context;
}