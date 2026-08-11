import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";


import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import ProjectFormDialog from "./ProjectFormDialog";
import { useProjects } from "../hooks/useProjects";

function ProjectOverviewPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

    const {
          projects,
          isLoading,
          error,
          updateProject,
          deleteProject,
    } = useProjects();


  //To edit project
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // To delete project
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          mb: 1,
        }}
      >
        <Box>
          <Typography variant="h4" component="h1">
            {project.name}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            {project.description}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => setIsEditDialogOpen(true)}
            >
              Edit Project
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete Project
            </Button>
        </Box>

      </Box>

      <Card sx={{ mt: 4 }}>
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

      <ProjectFormDialog
        open={isEditDialogOpen}
        title="Edit Project"
        submitLabel="Save Changes"
        initialValues={{
          name: project.name,
          description: project.description,
        }}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={async (values) => {
          await updateProject(project.id, values);
        }}
      />

      <Dialog
  open={isDeleteDialogOpen}
  onClose={() => {
    if (!isDeleting) {
      setIsDeleteDialogOpen(false);
    }
  }}
>
  <DialogTitle>Delete Project</DialogTitle>

  <DialogContent>
    <Typography>
      Are you sure you want to delete "{project.name}"?
    </Typography>

    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ mt: 1 }}
    >
      This action cannot be undone.
    </Typography>
  </DialogContent>

  <DialogActions>
    <Button
      onClick={() => setIsDeleteDialogOpen(false)}
      disabled={isDeleting}
    >
      Cancel
    </Button>

    <Button
      color="error"
      variant="contained"
      loading={isDeleting}
      onClick={async () => {
        try {
          setIsDeleting(true);

          await deleteProject(project.id);

          setIsDeleteDialogOpen(false);

          navigate("/projects");
        } finally {
          setIsDeleting(false);
        }
      }}
    >
      Delete Project
    </Button>
  </DialogActions>
</Dialog>


    </Box>
  );
}

export default ProjectOverviewPage;