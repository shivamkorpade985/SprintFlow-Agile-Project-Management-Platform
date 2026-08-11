import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import { useState } from "react";

import CreateProjectDialog from "../features/projects/components/CreateProjectDialog";
import { useProjects } from "../features/projects/hooks/useProjects";
import { useNavigate } from "react-router";

function ProjectsPage() {
  const { projects, isLoading, error } = useProjects();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <Box>
      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Projects
        </Typography>

        <Button
          variant="contained"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Create Project
        </Button>
      </Box>

      {/* Project Content */}
      {projects.length === 0 ? (
        <Alert severity="info">
          No projects found. Create your first project to get started.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid
              key={project.id}
              size={{ xs: 12, sm: 6, md: 4 }}
            >
                <Card>
                      <CardContent>
                        <Typography variant="h6" component="h2">
                          {project.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {project.description}
                        </Typography>

                        <Button
                          variant="outlined"
                          size="small"
                          sx={{ mt: 2 }}
                          onClick={() => navigate(`/projects/${project.id}`)}
                        >
                          Open Project
                        </Button>
                      </CardContent>
                </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </Box>
  );
}

export default ProjectsPage;