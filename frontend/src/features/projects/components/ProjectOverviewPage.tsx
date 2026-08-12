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

  return (
    <StoriesProvider projectId={projectId}>
      <ProjectTeamProvider projectId={projectId}>
        <ProjectDashboardContent projectId={projectId} />
      </ProjectTeamProvider>
    </StoriesProvider>
  );
}

export default ProjectOverviewPage;