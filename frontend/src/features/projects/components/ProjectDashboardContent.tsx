/**
 * ProjectDashboardContent
 *
 * Primary dashboard view displaying project statistics, completion progress, recent stories, and team members.
 *
 * Derived Metrics Architecture:
 * - All dashboard values are dynamically derived from existing Providers (`useProjects`, `useStories`, `useProjectTeam`)
 *   rather than independently persisted dashboard state:
 *   - Total Stories: `stories.length`
 *   - Done Stories: `stories.filter(s => s.status === 'DONE').length`
 *   - Story Points Velocity: `completedStoryPoints` vs `totalStoryPoints`
 *   - Overall Progress Percentage: `(doneStories / totalStories) * 100`
 *   - Team Count: `members.length`
 */
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import PeopleIcon from "@mui/icons-material/People";
import SpeedIcon from "@mui/icons-material/Speed";
import { useState } from "react";
import { useNavigate } from "react-router";

import { useProjects } from "../hooks/useProjects";
import { useStories } from "../../stories/hooks/useStories";
import { useProjectTeam } from "../../team/hooks/useProjectTeam";
import type { StoryPriority, StoryStatus } from "../../stories/types/story";
import ProjectFormDialog from "./ProjectFormDialog";
import DashboardStatCard from "./DashboardStatCard";

interface ProjectDashboardContentProps {
  projectId: string;
}

const getPriorityColor = (
  priority: StoryPriority,
): "error" | "warning" | "info" | "default" => {
  switch (priority) {
    case "HIGH":
      return "error";
    case "MEDIUM":
      return "warning";
    case "LOW":
      return "info";
    default:
      return "default";
  }
};

const getStatusColor = (
  status: StoryStatus,
): "success" | "info" | "warning" | "default" => {
  switch (status) {
    case "DONE":
      return "success";
    case "IN_PROGRESS":
      return "info";
    case "TESTING":
      return "warning";
    case "BACKLOG":
    default:
      return "default";
  }
};

function ProjectDashboardContent({ projectId }: ProjectDashboardContentProps) {
  const navigate = useNavigate();

  const {
    projects,
    isLoading: isLoadingProjects,
    error: projectsError,
    updateProject,
    deleteProject,
  } = useProjects();

  const {
    stories,
    isLoading: isLoadingStories,
    error: storiesError,
  } = useStories();

  const {
    members,
    isLoading: isLoadingTeam,
    error: teamError,
  } = useProjectTeam();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isLoading = isLoadingProjects || isLoadingStories || isLoadingTeam;
  const error = projectsError || storiesError || teamError;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const project = projects.find((item) => item.id === projectId);

  if (!project) {
    return <Alert severity="error">Project not found.</Alert>;
  }

  // Derived statistics from Provider states
  const totalStories = stories.length;
  const backlogStories = stories.filter((s) => s.status === "BACKLOG").length;
  const inProgressStories = stories.filter((s) => s.status === "IN_PROGRESS").length;
  const testingStories = stories.filter((s) => s.status === "TESTING").length;
  const doneStories = stories.filter((s) => s.status === "DONE").length;

  const totalStoryPoints = stories.reduce((sum, s) => sum + s.storyPoints, 0);
  const completedStoryPoints = stories
    .filter((s) => s.status === "DONE")
    .reduce((sum, s) => sum + s.storyPoints, 0);

  const progressPercentage =
    totalStories > 0 ? Math.round((doneStories / totalStories) * 100) : 0;

  const pointsProgressPercentage =
    totalStoryPoints > 0
      ? Math.round((completedStoryPoints / totalStoryPoints) * 100)
      : 0;

  // Recent stories (sorted newest first, max 5)
  const recentStories = [...stories]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <Box sx={{ maxWidth: 1300, mx: "auto" }}>
      {/* Back Navigation Link */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/projects")}
        sx={{ mb: 3 }}
      >
        Back to Projects
      </Button>

      {/* Project Header */}
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
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: "text.primary" }}>
            {project.name}
          </Typography>

          {project.description && (
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, lineHeight: 1.5, maxWidth: 800 }}>
              {project.description}
            </Typography>
          )}
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setIsEditDialogOpen(true)}
          >
            Edit Project
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete Project
          </Button>
        </Stack>
      </Box>

      {/* Project Workspaces Bar */}
      <Paper variant="outlined" sx={{ p: 2, mb: 4, bgcolor: "background.paper", borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
            Project Views
          </Typography>

          <Stack direction="row" spacing={1.5} sx={{ flexWrap: "wrap" }}>
            <Button
              variant="contained"
              disableElevation
              startIcon={<DashboardIcon />}
              onClick={() => navigate(`/projects/${project.id}/board`)}
              sx={{ fontWeight: 600 }}
            >
              Kanban Board
            </Button>

            <Button
              variant="outlined"
              startIcon={<AssignmentIcon />}
              onClick={() => navigate(`/projects/${project.id}/stories`)}
              sx={{ fontWeight: 600 }}
            >
              Stories ({totalStories})
            </Button>

            <Button
              variant="outlined"
              startIcon={<PeopleIcon />}
              onClick={() => navigate(`/projects/${project.id}/team`)}
              sx={{ fontWeight: 600 }}
            >
              Team ({members.length})
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Overall Progress Section */}
      <Card variant="outlined" sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1.5,
            }}
          >
            <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700 }}>
              Overall Project Progress
            </Typography>

            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
              {progressPercentage}%
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{ height: 10, borderRadius: 5, mb: 2.5, bgcolor: "divider" }}
          />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Stories Completed:</strong> {doneStories} of {totalStories} user stories
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: { sm: "right" } }}>
                <strong>Story Points Delivered:</strong> {completedStoryPoints} of {totalStoryPoints} pts ({pointsProgressPercentage}%)
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Project Statistics Grid */}
      <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700, mb: 2, letterSpacing: 0.3 }}>
        PROJECT METRICS
      </Typography>

      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardStatCard
            title="Total Stories"
            value={totalStories}
            subtitle={`${backlogStories} backlog, ${inProgressStories} in progress`}
            color="#1E64D4"
            icon={<AssignmentIcon fontSize="small" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardStatCard
            title="Active / Testing"
            value={inProgressStories + testingStories}
            subtitle={`${inProgressStories} active, ${testingStories} testing`}
            color="#D97706"
            icon={<HourglassTopIcon fontSize="small" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardStatCard
            title="Completed"
            value={doneStories}
            subtitle={`${progressPercentage}% story completion rate`}
            color="#16A34A"
            icon={<CheckCircleIcon fontSize="small" />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardStatCard
            title="Story Points"
            value={`${completedStoryPoints} / ${totalStoryPoints}`}
            subtitle={`${pointsProgressPercentage}% velocity delivered`}
            color="#9333EA"
            icon={<SpeedIcon fontSize="small" />}
          />
        </Grid>
      </Grid>

      {/* Recent Stories & Team Summary Section */}
      <Grid container spacing={3}>
        {/* Recent Stories */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700 }}>
                  Recent User Stories
                </Typography>

                <Button
                  size="small"
                  onClick={() => navigate(`/projects/${project.id}/stories`)}
                  sx={{ fontWeight: 600 }}
                >
                  View All ({totalStories})
                </Button>
              </Box>

              {recentStories.length === 0 ? (
                <Alert severity="info" sx={{ mt: 1, borderRadius: 2 }}>
                  No stories found for this project. Navigate to Stories to create one.
                </Alert>
              ) : (
                <List disablePadding sx={{ flexGrow: 1 }}>
                  {recentStories.map((story, index) => (
                    <Box key={story.id}>
                      {index > 0 && <Divider component="li" />}
                      <ListItem
                        sx={{
                          py: 1.5,
                          px: 1.5,
                          borderRadius: 2,
                          "&:hover": { backgroundColor: "#F8FAFC" },
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          navigate(`/projects/${project.id}/stories/${story.id}`)
                        }
                      >
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 700,
                                "&:hover": { color: "primary.main" },
                              }}
                            >
                              {story.title}
                            </Typography>
                          }
                          secondary={
                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{ mt: 0.8, flexWrap: "wrap", alignItems: "center" }}
                            >
                              <Chip
                                label={story.status}
                                size="small"
                                color={getStatusColor(story.status)}
                                variant="outlined"
                                sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700 }}
                              />

                              <Chip
                                label={story.priority}
                                size="small"
                                color={getPriorityColor(story.priority)}
                                variant="outlined"
                                sx={{ height: 20, fontSize: "0.65rem", fontWeight: 600 }}
                              />

                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                {story.storyPoints} pts
                              </Typography>
                            </Stack>
                          }
                        />
                      </ListItem>
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Team Summary */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card variant="outlined" sx={{ height: "100%" }}>
            <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%", p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700 }}>
                  Project Team
                </Typography>

                <Button
                  size="small"
                  onClick={() => navigate(`/projects/${project.id}/team`)}
                  sx={{ fontWeight: 600 }}
                >
                  View Team ({members.length})
                </Button>
              </Box>

              {members.length === 0 ? (
                <Alert severity="info" sx={{ mt: 1, borderRadius: 2 }}>
                  No team members added yet. Navigate to Team to add members.
                </Alert>
              ) : (
                <List disablePadding sx={{ flexGrow: 1 }}>
                  {members.slice(0, 5).map((member, index) => (
                    <Box key={member.id}>
                      {index > 0 && <Divider component="li" />}
                      <ListItem sx={{ py: 1.5, px: 1 }}>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: member.avatar || "primary.main",
                              width: 36,
                              height: 36,
                              fontSize: "0.875rem",
                              fontWeight: 700,
                            }}
                          >
                            {member.name.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                              {member.name}
                            </Typography>
                          }
                          secondary={
                            <Chip
                              label={member.role}
                              size="small"
                              variant="outlined"
                              sx={{ height: 20, fontSize: "0.65rem", mt: 0.4, fontWeight: 600 }}
                            />
                          }
                        />
                      </ListItem>
                    </Box>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Project Dialog */}
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

      {/* Delete Project Dialog */}
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

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
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

export default ProjectDashboardContent;