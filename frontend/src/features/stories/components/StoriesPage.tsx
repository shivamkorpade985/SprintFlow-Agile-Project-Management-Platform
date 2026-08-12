import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  ArrowBack,
} from "@mui/icons-material";
import {
  useNavigate,
  useParams,
} from "react-router";

import { LocalStorageUserRepository } from "../../../repositories/local/LocalStorageUserRepository";
import type { User } from "../../team/types/user";

import { StoriesProvider } from "../context/StoriesProvider";
import { useStories } from "../hooks/useStories";
import type { UserStory } from "../types/story";

import CreateStoryDialog from "./CreateStoryDialog";
import EditStoryDialog from "./EditStoryDialog";
import StoryCard from "./StoryCard";

const userRepository =
  new LocalStorageUserRepository();

interface StoriesContentProps {
  projectId: string;
}

function StoriesContent({
  projectId,
}: StoriesContentProps) {
  const navigate = useNavigate();

  const {
    stories,
    isLoading,
    error,
    deleteStory,
  } = useStories();

  const [
    isCreateDialogOpen,
    setIsCreateDialogOpen,
  ] = useState(false);

  const [editingStory, setEditingStory] =
    useState<UserStory | null>(null);

  const [users, setUsers] =
    useState<User[]>([]);

  const [isLoadingUsers, setIsLoadingUsers] =
    useState(false);

  const [userLoadError, setUserLoadError] =
    useState<string | null>(null);

  const handleOpenCreateDialog =
    async () => {
      try {
        setIsLoadingUsers(true);
        setUserLoadError(null);

        const data =
          await userRepository.getUsers();

        setUsers(data);
        setIsCreateDialogOpen(true);
      } catch {
        setUserLoadError(
          "Failed to load team members.",
        );
      } finally {
        setIsLoadingUsers(false);
      }
    };

  const handleDeleteStory = async (
    story: UserStory,
  ) => {
    const confirmed = window.confirm(
      `Delete "${story.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteStory(story.id);
    } catch {
      // Error is already handled by StoriesProvider.
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

  return (
    <Box>
      {/* Back to Project */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() =>
          navigate(`/projects/${projectId}`)
        }
        sx={{ mb: 3 }}
      >
        Back to Project
      </Button>

      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
        >
          Stories
        </Typography>

        <Button
          variant="contained"
          onClick={() =>
            void handleOpenCreateDialog()
          }
          loading={isLoadingUsers}
        >
          Create Story
        </Button>
      </Box>

      {/* User loading error */}
      {userLoadError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {userLoadError}
        </Alert>
      )}

      {/* Story Content */}
      {stories.length === 0 ? (
        <Alert severity="info">
          No stories found. Create your first
          story to get started.
        </Alert>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {stories.map((story) => {
            const assignee = users.find(
              (user) =>
                user.id === story.assignedUserId,
            );

            return (
              <StoryCard
                key={story.id}
                story={story}
                projectId={projectId}
                assignee={assignee}
                onEdit={(selectedStory) =>
                  setEditingStory(selectedStory)
                }
                onDelete={(selectedStory) =>
                  void handleDeleteStory(
                    selectedStory,
                  )
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
        onClose={() =>
          setIsCreateDialogOpen(false)
        }
      />

      {/* Edit Story Dialog */}
      <EditStoryDialog
        open={editingStory !== null}
        story={editingStory}
        users={users}
        onClose={() =>
          setEditingStory(null)
        }
      />
    </Box>
  );
}

function StoriesPage() {
  const { projectId } =
    useParams<{
      projectId: string;
    }>();

  if (!projectId) {
    return (
      <Typography color="error">
        Project ID is missing.
      </Typography>
    );
  }

  return (
    <StoriesProvider projectId={projectId}>
      <StoriesContent
        projectId={projectId}
      />
    </StoriesProvider>
  );
}

export default StoriesPage;