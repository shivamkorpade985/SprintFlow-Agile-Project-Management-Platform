/**
 * CreateStoryDialog
 *
 * Dialog modal for creating a new user story.
 *
 * Responsibilities:
 * - Collects title, description, priority, story points, status, and assignee.
 * - Restricts assignees strictly to the project team members (`users` prop passed from `ProjectTeamProvider`).
 * - Validates input fields (non-empty strings, positive integer story points).
 * - Invokes `createStory` contract via `useStories()` hook.
 */
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";

import { useStories } from "../hooks/useStories";
import type {
  StoryPriority,
  StoryStatus,
} from "../types/story";
import type { User } from "../../team/types/user";

interface CreateStoryDialogProps {
  open: boolean;
  projectId: string;
  users: User[];
  onClose: () => void;
}

function CreateStoryDialog({
  open,
  projectId,
  users,
  onClose,
}: CreateStoryDialogProps) {
  const { createStory } = useStories();

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [priority, setPriority] =
    useState<StoryPriority>("MEDIUM");
  const [storyPoints, setStoryPoints] =
    useState("1");
  const [status, setStatus] =
    useState<StoryStatus>("BACKLOG");
  const [assignedUserId, setAssignedUserId] =
    useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [submitError, setSubmitError] =
    useState<string | null>(null);

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setTitle("");
    setDescription("");
    setPriority("MEDIUM");
    setStoryPoints("1");
    setStatus("BACKLOG");
    setAssignedUserId("");
    setSubmitError(null);

    onClose();
  };

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedDescription =
      description.trim();

    const parsedStoryPoints =
      Number(storyPoints);

    if (!trimmedTitle || !trimmedDescription) {
      setSubmitError(
        "Story title and description are required.",
      );
      return;
    }

    if (
      !Number.isInteger(parsedStoryPoints) ||
      parsedStoryPoints <= 0
    ) {
      setSubmitError(
        "Story points must be a positive whole number.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await createStory({
        projectId,
        title: trimmedTitle,
        description: trimmedDescription,
        priority,
        storyPoints: parsedStoryPoints,
        status,
        ...(assignedUserId
          ? { assignedUserId }
          : {}),
      });

      handleClose();
    } catch {
      setSubmitError(
        "Failed to create story.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        Create Story
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {submitError && (
            <Alert severity="error">
              {submitError}
            </Alert>
          )}

          <TextField
            label="Story Title"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
            fullWidth
            required
            autoFocus
            disabled={isSubmitting}
          />

          <TextField
            label="Description"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value,
              )
            }
            fullWidth
            required
            multiline
            minRows={4}
            disabled={isSubmitting}
          />

          <TextField
            select
            label="Priority"
            value={priority}
            onChange={(event) =>
              setPriority(
                event.target
                  .value as StoryPriority,
              )
            }
            fullWidth
            disabled={isSubmitting}
          >
            <MenuItem value="LOW">
              Low
            </MenuItem>

            <MenuItem value="MEDIUM">
              Medium
            </MenuItem>

            <MenuItem value="HIGH">
              High
            </MenuItem>
          </TextField>

          <TextField
            label="Story Points"
            type="number"
            value={storyPoints}
            onChange={(event) =>
              setStoryPoints(event.target.value)
            }
            fullWidth
            disabled={isSubmitting}
            slotProps={{
              htmlInput: {
                min: 1,
                step: 1,
              },
            }}
          />

          <TextField
            select
            label="Status"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as StoryStatus,
              )
            }
            fullWidth
            disabled={isSubmitting}
          >
            <MenuItem value="BACKLOG">
              Backlog
            </MenuItem>

            <MenuItem value="IN_PROGRESS">
              In Progress
            </MenuItem>

            <MenuItem value="TESTING">
              Testing
            </MenuItem>

            <MenuItem value="DONE">
              Done
            </MenuItem>
          </TextField>

          {/* Project Member Assignee Dropdown */}
          <TextField
            select
            label="Assignee"
            value={assignedUserId}
            onChange={(event) =>
              setAssignedUserId(
                event.target.value,
              )
            }
            fullWidth
            disabled={isSubmitting}
          >
            <MenuItem value="">
              Unassigned
            </MenuItem>

            {users.length === 0 ? (
              <MenuItem value="" disabled>
                No team members available
              </MenuItem>
            ) : (
              users.map((user) => (
                <MenuItem
                  key={user.id}
                  value={user.id}
                >
                  {user.name} — {user.role}
                </MenuItem>
              ))
            )}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{ px: 3, pb: 2 }}
      >
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={() =>
            void handleSubmit()
          }
          loading={isSubmitting}
        >
          Create Story
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateStoryDialog;