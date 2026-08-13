/**
 * StoryDetailPage
 *
 * Detailed view for an individual user story (`/projects/:projectId/stories/:storyId`).
 *
 * Responsibilities:
 * - Mounts `StoriesProvider` and `ProjectTeamProvider` for the current `:projectId`.
 * - Resolves story matching `:storyId` from `stories` context.
 * - Displays full story details (Title, Status, Priority, Points, Assignee avatar/name, Created date, Description).
 * - Triggers deletion with confirmation modal and redirects back to backlog upon deletion.
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
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import SpeedIcon from "@mui/icons-material/Speed";

import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import { StoriesProvider } from "../context/StoriesProvider";
import { useStories } from "../hooks/useStories";
import type { UserStory, StoryPriority, StoryStatus } from "../types/story";

import EditStoryDialog from "./EditStoryDialog";
import { ProjectTeamProvider } from "../../team/context/ProjectTeamProvider";
import { useProjectTeam } from "../../team/hooks/useProjectTeam";

interface StoryDetailContentProps {
  projectId: string;
  storyId: string;
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

function StoryDetailContent({ projectId, storyId }: StoryDetailContentProps) {
  const navigate = useNavigate();

  const { stories, isLoading, error, deleteStory } = useStories();
  const { members } = useProjectTeam();

  const [editingStory, setEditingStory] = useState<UserStory | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const story = stories.find((currentStory) => currentStory.id === storyId);

  const handleDelete = async () => {
    if (!story) {
      return;
    }

    const confirmed = window.confirm(`Delete "${story.title}"?`);
    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteStory(story.id);
      navigate(`/projects/${projectId}/stories`);
    } catch {
      setIsDeleting(false);
    }
  };

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

  if (!story) {
    return (
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          User story not found.
        </Alert>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/projects/${projectId}/stories`)}
        >
          Back to Stories
        </Button>
      </Box>
    );
  }

  const assignee = members.find((member) => member.id === story.assignedUserId);

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      {/* Navigation Back Link */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/projects/${projectId}/stories`)}
        sx={{ mb: 3 }}
      >
        Back to Stories
      </Button>

      {/* Header View */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1 }}>
            <Chip
              label={story.status}
              color={getStatusColor(story.status)}
              size="small"
              sx={{ fontWeight: 700 }}
            />

            <Chip
              label={`Priority: ${story.priority}`}
              color={getPriorityColor(story.priority)}
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Stack>

          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: "text.primary", lineHeight: 1.25 }}>
            {story.title}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setEditingStory(story)}
          >
            Edit Story
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => void handleDelete()}
            loading={isDeleting}
          >
            Delete
          </Button>
        </Stack>
      </Box>

      {/* Main Details Paper Container */}
      <Card variant="outlined">
        <CardContent sx={{ p: 3.5 }}>
          {/* Attributes Grid Section */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 700, letterSpacing: 0.5 }}>
            STORY ATTRIBUTES
          </Typography>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "#FAFAFA" }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  ASSIGNEE
                </Typography>

                <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 1 }}>
                  {assignee ? (
                    <>
                      <Avatar sx={{ width: 24, height: 24, fontSize: "0.75rem", bgcolor: assignee.avatar || "primary.main" }}>
                        {assignee.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {assignee.name}
                      </Typography>
                    </>
                  ) : (
                    <>
                      <PersonIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Unassigned
                      </Typography>
                    </>
                  )}
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "#FAFAFA" }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  STORY POINTS
                </Typography>

                <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 1 }}>
                  <SpeedIcon fontSize="small" color="action" />

                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {story.storyPoints} points
                  </Typography>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "#FAFAFA" }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  PRIORITY
                </Typography>

                <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 1 }}>
                  <PriorityHighIcon fontSize="small" color={story.priority === "HIGH" ? "error" : "action"} />

                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {story.priority}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "#FAFAFA" }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  CREATED AT
                </Typography>

                <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 1 }}>
                  <CalendarTodayIcon fontSize="small" color="action" />

                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.8rem" }}>
                    {new Date(story.createdAt).toLocaleDateString()}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          {/* Description Section */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 700, letterSpacing: 0.5 }}>
            DESCRIPTION
          </Typography>

          <Paper variant="outlined" sx={{ p: 3, bgcolor: "#FAFAFA", minHeight: 120 }}>
            {story.description ? (
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.6,
                  color: "text.primary",
                }}
              >
                {story.description}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                No description provided for this user story.
              </Typography>
            )}
          </Paper>
        </CardContent>
      </Card>

      {/* Edit Story Dialog */}
      <EditStoryDialog
        open={editingStory !== null}
        story={editingStory}
        users={members}
        onClose={() => setEditingStory(null)}
      />
    </Box>
  );
}

function StoryDetailPageContent({ projectId, storyId }: { projectId: string; storyId: string }) {
  return (
    <ProjectTeamProvider projectId={projectId}>
      <StoryDetailContent projectId={projectId} storyId={storyId} />
    </ProjectTeamProvider>
  );
}

function StoryDetailPage() {
  const { projectId, storyId } = useParams<{ projectId: string; storyId: string }>();

  if (!projectId || !storyId) {
    return <Alert severity="error">Project ID or Story ID is missing.</Alert>;
  }

  return (
    <StoriesProvider projectId={projectId}>
      <StoryDetailPageContent projectId={projectId} storyId={storyId} />
    </StoriesProvider>
  );
}

export default StoryDetailPage;