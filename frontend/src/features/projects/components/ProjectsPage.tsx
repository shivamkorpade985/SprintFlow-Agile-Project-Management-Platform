import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import { useState } from "react";
import { useNavigate } from "react-router";

import CreateProjectDialog from "./CreateProjectDialog";
import { useProjects } from "../hooks/useProjects";

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
          alignItems: "center",
          minHeight: 400,
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
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          mb: 4,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ color: "text.primary" }}>
            Projects
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your Agile projects and sprint workspaces.
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="medium"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
          disableElevation
          sx={{ px: 2.5, py: 1 }}
        >
          Create Project
        </Button>
      </Box>

      {/* Project Cards Content */}
      {projects.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No projects found. Create your first project workspace to get started.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid key={project.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.08)",
                    borderColor: "primary.light",
                  },
                }}
              >
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                    <Chip
                      icon={<FolderOpenIcon fontSize="small" />}
                      label="Workspace"
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ fontSize: "0.75rem", fontWeight: 600 }}
                    />
                  </Stack>

                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary",
                      cursor: "pointer",
                      "&:hover": { color: "primary.main" },
                      lineHeight: 1.3,
                    }}
                    onClick={() => navigate(`/projects/${project.id}`)}
                  >
                    {project.name}
                  </Typography>

                  {project.description ? (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        lineHeight: 1.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        minHeight: 63,
                      }}
                    >
                      {project.description}
                    </Typography>
                  ) : (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1, minHeight: 63, fontStyle: "italic" }}
                    >
                      No project description provided.
                    </Typography>
                  )}
                </CardContent>

                <CardActions sx={{ px: 3, pb: 2.5, pt: 0 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    endIcon={<ArrowForwardIcon fontSize="small" />}
                    onClick={() => navigate(`/projects/${project.id}`)}
                    sx={{ fontWeight: 600 }}
                  >
                    Open Project
                  </Button>
                </CardActions>
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