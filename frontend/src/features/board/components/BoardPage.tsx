/**
 * BoardPage
 *
 * Page component for the interactive project Kanban Board (`/projects/:projectId/board`).
 */
import { Alert } from "@mui/material";
import { useParams } from "react-router";

import { StoriesProvider } from "../../stories/context/StoriesProvider";
import { ProjectTeamProvider } from "../../team/context/ProjectTeamProvider";
import KanbanBoardView from "./KanbanBoardView";

function BoardPage() {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <Alert severity="error">Project ID is missing.</Alert>;
  }

  const numericProjectId = Number(projectId);
  if (Number.isNaN(numericProjectId) || numericProjectId <= 0) {
    return <Alert severity="error">Invalid Project ID specified.</Alert>;
  }

  return (
    <StoriesProvider projectId={numericProjectId}>
      <ProjectTeamProvider projectId={numericProjectId}>
        <KanbanBoardView projectId={numericProjectId} />
      </ProjectTeamProvider>
    </StoriesProvider>
  );
}

export default BoardPage;