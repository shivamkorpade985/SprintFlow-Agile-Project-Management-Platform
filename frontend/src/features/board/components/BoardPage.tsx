/**
 * BoardPage
 *
 * Page component for the interactive project Kanban Board (`/projects/:projectId/board`).
 *
 * Responsibilities:
 * - Reads `:projectId` parameter from URL.
 * - Wraps `KanbanBoardView` with `StoriesProvider` (for story lifecycle & drag updates)
 *   and `ProjectTeamProvider` (for resolving story assignee names and avatars).
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

  return (
    <StoriesProvider projectId={projectId}>
      <ProjectTeamProvider projectId={projectId}>
        <KanbanBoardView projectId={projectId} />
      </ProjectTeamProvider>
    </StoriesProvider>
  );
}

export default BoardPage;