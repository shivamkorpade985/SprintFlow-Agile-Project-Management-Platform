import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import { LocalStorageUserRepository } from "../../../repositories/local/LocalStorageUserRepository";
import type { User } from "../../team/types/user";

import { StoriesProvider } from "../context/StoriesProvider";
import { useStories } from "../hooks/useStories";
import type { UserStory } from "../types/story";

import CreateStoryDialog from "./CreateStoryDialog";
import EditStoryDialog from "./EditStoryDialog";
import StoryCard from "./StoryCard";
import StoryFilters from "./StoryFilters";

const userRepository = new LocalStorageUserRepository();

interface StoriesContentProps {
  projectId: string;
}

function StoriesContent({ projectId }: StoriesContentProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { stories, isLoading, error, deleteStory } = useStories();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<UserStory | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userLoadError, setUserLoadError] = useState<string | null>(null);

  // Load team users on mount so filters & cards have assignee identities
  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        const data = await userRepository.getUsers();
        if (isMounted) {
          setUsers(data);
        }
      } catch {
        if (isMounted) {
          setUserLoadError("Failed to load team members.");
        }
      }
    };

    void loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenCreateDialog = async () => {
    try {
      setIsLoadingUsers(true);
      setUserLoadError(null);
      const data = await userRepository.getUsers();
      setUsers(data);
      setIsCreateDialogOpen(true);
    } catch {
      setUserLoadError("Failed to load team members.");
    } finally {
      setIsLoadingUsers(false);
    }
  };

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
        if (story.assignedUserId !== assigneeParam) return false;
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
          onClick={() => void handleOpenCreateDialog()}
          loading={isLoadingUsers}
          disableElevation
          sx={{ px: 2.5, py: 1 }}
        >
          Create Story
        </Button>
      </Box>

      {/* User loading error alert */}
      {userLoadError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {userLoadError}
        </Alert>
      )}

      {/* Filter Toolbar */}
      {stories.length > 0 && (
        <StoryFilters
          users={users}
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
            const assignee = users.find(
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
        users={users}
        onClose={() => setIsCreateDialogOpen(false)}
      />

      {/* Edit Story Dialog */}
      <EditStoryDialog
        open={editingStory !== null}
        story={editingStory}
        users={users}
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
    return <Typography color="error">Project ID is missing.</Typography>;
  }

  return (
    <StoriesProvider projectId={projectId}>
      <StoriesContent projectId={projectId} />
    </StoriesProvider>
  );
}

export default StoriesPage;