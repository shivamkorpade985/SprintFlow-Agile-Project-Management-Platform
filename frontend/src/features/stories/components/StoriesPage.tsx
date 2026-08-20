/**
 * StoriesPage
 *
 * Backlog & user story management view (`/projects/:projectId/stories`).
 */
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import { ProjectTeamProvider } from "../../team/context/ProjectTeamProvider";
import { useProjectTeam } from "../../team/hooks/useProjectTeam";

import { StoriesProvider } from "../context/StoriesProvider";
import { useStories } from "../hooks/useStories";
import type { UserStory } from "../types/story";

import CreateStoryDialog from "./CreateStoryDialog";
import EditStoryDialog from "./EditStoryDialog";
import StoryCard from "./StoryCard";
import StoryFilters from "./StoryFilters";

interface StoriesContentProps {
  projectId: number;
}

function StoriesContent({ projectId }: StoriesContentProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { stories, isLoading: isLoadingStories, error: storiesError, deleteStory } = useStories();
  const { members, isLoading: isLoadingTeam, error: teamError } = useProjectTeam();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<UserStory | null>(null);

  const isLoading = isLoadingStories || isLoadingTeam;
  const error = storiesError || teamError;

  const handleDeleteStory = async (story: UserStory) => {
    const confirmed = window.confirm(`Delete "${story.title}"?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteStory(story.id);
    } catch {
      // Error is already handled by StoriesProvider.
    }
  };

  // URL query parameter filters derivation
  const searchParam = searchParams.get("search") || "";
  const assigneeParam = searchParams.get("assignee") || "ALL";
  const priorityParam = searchParams.get("priority") || "ALL";
  const myTasksParam = searchParams.get("myTasks") === "true";

  const filteredStories = stories.filter((story) => {
    // 1. Title Search (case-insensitive)
    if (searchParam) {
      const term = searchParam.toLowerCase();
      if (!story.title.toLowerCase().includes(term)) {
        return false;
      }
    }

    // 2. Assignee Filter
    if (assigneeParam && assigneeParam !== "ALL") {
      if (assigneeParam === "UNASSIGNED") {
        if (story.assignedUserId) return false;
      } else {
        const numericAssigneeId = Number(assigneeParam);
        if (story.assignedUserId !== numericAssigneeId) return false;
      }
    }

    // 3. Priority Filter
    if (priorityParam && priorityParam !== "ALL") {
      if (story.priority !== priorityParam) return false;
    }

    // 4. My Tasks Filter (Requires authenticated user session)
    if (myTasksParam) {
      return false;
    }

    return true;
  });

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

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto" }}>
      {/* Back to Project Navigation */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/projects/${projectId}`)}
        sx={{ mb: 3 }}
      >
        Back to Project
      </Button>

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
          <Typography variant="h4" component="h1">
            User Stories
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Create, filter, and prioritize backlog work items for your sprint.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
          disableElevation
          sx={{ px: 2.5, py: 1 }}
        >
          Create Story
        </Button>
      </Box>

      {/* Filter Toolbar */}
      {stories.length > 0 && (
        <StoryFilters
          users={members}
          totalStoriesCount={stories.length}
          filteredStoriesCount={filteredStories.length}
        />
      )}

      {/* Stories List Content / Empty States */}
      {stories.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No stories found. Create your first user story to get started.
        </Alert>
      ) : filteredStories.length === 0 ? (
        <Alert
          severity="info"
          sx={{ borderRadius: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => setSearchParams({}, { replace: true })}
              sx={{ fontWeight: 600 }}
            >
              Clear Filters
            </Button>
          }
        >
          No stories match your current filters.
        </Alert>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {filteredStories.map((story) => {
            const assignee = members.find(
              (user) => user.id === story.assignedUserId,
            );

            return (
              <StoryCard
                key={story.id}
                story={story}
                projectId={projectId}
                assignee={assignee}
                onEdit={(selectedStory) => setEditingStory(selectedStory)}
                onDelete={(selectedStory) =>
                  void handleDeleteStory(selectedStory)
                }
              />
            );
          })}
        </Box>
      )}

      {/* Create Story Dialog */}
      <CreateStoryDialog
        open={isCreateDialogOpen}
        projectId={projectId}
        users={members}
        onClose={() => setIsCreateDialogOpen(false)}
      />

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

function StoriesPage() {
  const { projectId } = useParams<{
    projectId: string;
  }>();

  if (!projectId) {
    return <Alert severity="error">Project ID is missing.</Alert>;
  }

  const numericProjectId = Number(projectId);
  if (Number.isNaN(numericProjectId) || numericProjectId <= 0) {
    return <Alert severity="error">Invalid Project ID specified.</Alert>;
  }

  return (
    <ProjectTeamProvider projectId={numericProjectId}>
      <StoriesProvider projectId={numericProjectId}>
        <StoriesContent projectId={numericProjectId} />
      </StoriesProvider>
    </ProjectTeamProvider>
  );
}

export default StoriesPage;