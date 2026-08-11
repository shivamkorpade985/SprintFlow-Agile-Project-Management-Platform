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