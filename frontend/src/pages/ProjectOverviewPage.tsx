import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router";

import { useProjects } from "../features/projects/hooks/useProjects";

function ProjectOverviewPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { projects, isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const project = projects.find(
    (item) => item.id === projectId,
  );

  if (!project) {
    return <Alert severity="error">Project not found.</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
        {project.name}
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        {project.description}
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Project Workspace
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Choose a workspace area to continue working on this
            project.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              mt: 3,
            }}
          >
            <Button
              variant="contained"
              onClick={() =>
                navigate(`/projects/${project.id}/board`)
              }
            >
              Board
            </Button>

            <Button
              variant="outlined"
              onClick={() =>
                navigate(`/projects/${project.id}/stories`)
              }
            >
              Stories
            </Button>

            <Button
              variant="outlined"
              onClick={() =>
                navigate(`/projects/${project.id}/team`)
              }
            >
              Team
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ProjectOverviewPage;