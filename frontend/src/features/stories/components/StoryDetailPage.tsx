import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  ArrowBack,
  Delete,
  Edit,
} from "@mui/icons-material";
import {
  useNavigate,
  useParams,
} from "react-router";

import {
  StoriesProvider,
} from "../context/StoriesProvider";
import { useStories } from "../hooks/useStories";
import type { UserStory } from "../types/story";

import EditStoryDialog from "./EditStoryDialog";

import {
  ProjectTeamProvider,
} from "../../team/context/ProjectTeamProvider";
import {
  useProjectTeam,
} from "../../team/hooks/useProjectTeam";

interface StoryDetailContentProps {
  projectId: string;
  storyId: string;
}

function StoryDetailContent({
  projectId,
  storyId,
}: StoryDetailContentProps) {
  const navigate = useNavigate();

  const {
    stories,
    isLoading,
    error,
    deleteStory,
  } = useStories();

  const {
    members,
  } = useProjectTeam();

  const [editingStory, setEditingStory] =
    useState<UserStory | null>(null);

  const [isDeleting, setIsDeleting] =
    useState(false);

  const story = stories.find(
    (currentStory) =>
      currentStory.id === storyId,
  );

  const handleDelete = async () => {
    if (!story) {
      return;
    }

    const confirmed = window.confirm(
      `Delete "${story.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);

      await deleteStory(story.id);

      navigate(
        `/projects/${projectId}/stories`,
      );
    } catch {
      setIsDeleting(false);
    }
  };

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
    return (
      <Alert severity="error">
        {error}
      </Alert>
    );
  }

  if (!story) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Story not found.
        </Alert>

        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() =>
            navigate(
              `/projects/${projectId}/stories`,
            )
          }
        >
          Back to Stories
        </Button>
      </Box>
    );
  }

  const assignee = members.find(
    (member) =>
      member.id === story.assignedUserId,
  );

  return (
    <Box>
      {/* Back button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() =>
          navigate(
            `/projects/${projectId}/stories`,
          )
        }
        sx={{ mb: 3 }}
      >
        Back to Stories
      </Button>

      {/* Page header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
          >
            {story.title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Story Details
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
        >
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={() =>
              setEditingStory(story)
            }
          >
            Edit
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() =>
              void handleDelete()
            }
            loading={isDeleting}
          >
            Delete
          </Button>
        </Stack>
      </Box>

      {/* Story information */}
      <Card>
        <CardContent>
          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}
          >
            Description
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              whiteSpace: "pre-wrap",
              mb: 3,
            }}
          >
            {story.description}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}
          >
            Story Information
          </Typography>

          <Stack
          direction="row"
          spacing={2}
          useFlexGap
          sx={{ flexWrap: "wrap" }}
          >
            <Chip
              label={`Priority: ${story.priority}`}
            />

            <Chip
              label={`Story Points: ${story.storyPoints}`}
            />

            <Chip
              label={`Status: ${story.status}`}
            />

            <Chip
              label={
                assignee
                  ? `Assignee: ${assignee.name}`
                  : "Unassigned"
              }
            />
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Created:{" "}
            {new Date(
              story.createdAt,
            ).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <EditStoryDialog
        open={editingStory !== null}
        story={editingStory}
        users={members}
        onClose={() =>
          setEditingStory(null)
        }
      />
    </Box>
  );
}

interface StoryDetailPageContentProps {
  projectId: string;
  storyId: string;
}

function StoryDetailPageContent({
  projectId,
  storyId,
}: StoryDetailPageContentProps) {
  return (
    <ProjectTeamProvider
      projectId={projectId}
    >
      <StoryDetailContent
        projectId={projectId}
        storyId={storyId}
      />
    </ProjectTeamProvider>
  );
}

function StoryDetailPage() {
  const {
    projectId,
    storyId,
  } = useParams<{
    projectId: string;
    storyId: string;
  }>();

  if (!projectId || !storyId) {
    return (
      <Alert severity="error">
        Project ID or Story ID is missing.
      </Alert>
    );
  }

  return (
    <StoriesProvider
      projectId={projectId}
    >
      <StoryDetailPageContent
        projectId={projectId}
        storyId={storyId}
      />
    </StoriesProvider>
  );
}

export default StoryDetailPage;