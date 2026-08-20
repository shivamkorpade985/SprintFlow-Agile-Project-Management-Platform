/**
 * ProjectOverviewPage
 *
 * Overview and dashboard metrics page for an active project (`/projects/:projectId`).
 */
import { Alert } from "@mui/material";
import { useParams } from "react-router";

import { StoriesProvider } from "../../stories/context/StoriesProvider";
import { ProjectTeamProvider } from "../../team/context/ProjectTeamProvider";
import ProjectDashboardContent from "./ProjectDashboardContent";

function ProjectOverviewPage() {
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
        <ProjectDashboardContent projectId={numericProjectId} />
      </ProjectTeamProvider>
    </StoriesProvider>
  );
}

export default ProjectOverviewPage;