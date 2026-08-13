/**
 * EditStoryDialog
 *
 * Modal dialog for modifying existing user story details.
 *
 * Key Behaviors:
 * - Initializes state from current `story` target entity.
 * - Handles edge case where a story's assigned user is no longer a member of the project team:
 *   Renders fallback option `<MenuItem value={form.assignedUserId} disabled>Former member</MenuItem>`.
 * - Restricts new assignee selections strictly to active project team members.
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
  UserStory,
} from "../types/story";
import type { User } from "../../team/types/user";

interface EditStoryDialogProps {
  open: boolean;
  story: UserStory | null;
  users: User[];
  onClose: () => void;
}

interface StoryFormState {
  title: string;
  description: string;
  priority: StoryPriority;
  storyPoints: string;
  status: StoryStatus;
  assignedUserId: string;
}

function getInitialFormState(
  story: UserStory,
): StoryFormState {
  return {
    title: story.title,
    description: story.description,
    priority: story.priority,
    storyPoints: String(story.storyPoints),
    status: story.status,
    assignedUserId: story.assignedUserId ?? "",
  };
}

interface EditStoryFormProps {
  story: UserStory;
  users: User[];
  onClose: () => void;
}

function EditStoryForm({
  story,
  users,
  onClose,
}: EditStoryFormProps) {
  const { updateStory } = useStories();

  const [form, setForm] = useState<StoryFormState>(
    () => getInitialFormState(story),
  );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState<string | null>(null);

  const updateField = <
    K extends keyof StoryFormState,
  >(
    field: K,
    value: StoryFormState[K],
  ) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const trimmedTitle = form.title.trim();
    const trimmedDescription =
      form.description.trim();

    const parsedStoryPoints =
      Number(form.storyPoints);

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

      await updateStory(story.id, {
        title: trimmedTitle,
        description: trimmedDescription,
        priority: form.priority,
        storyPoints: parsedStoryPoints,
        status: form.status,
        ...(form.assignedUserId
          ? {
              assignedUserId:
                form.assignedUserId,
            }
          : {}),
      });

      onClose();
    } catch {
      setSubmitError(
        "Failed to update story.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogTitle>
        Edit Story
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
            value={form.title}
            onChange={(event) =>
              updateField(
                "title",
                event.target.value,
              )
            }
            fullWidth
            required
            autoFocus
            disabled={isSubmitting}
          />

          <TextField
            label="Description"
            value={form.description}
            onChange={(event) =>
              updateField(
                "description",
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
            value={form.priority}
            onChange={(event) =>
              updateField(
                "priority",
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
            value={form.storyPoints}
            onChange={(event) =>
              updateField(
                "storyPoints",
                event.target.value,
              )
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
            value={form.status}
            onChange={(event) =>
              updateField(
                "status",
                event.target
                  .value as StoryStatus,
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

          <TextField
            select
            label="Assignee"
            value={form.assignedUserId}
            onChange={(event) =>
              updateField(
                "assignedUserId",
                event.target.value,
              )
            }
            fullWidth
            disabled={isSubmitting}
          >
            <MenuItem value="">
              Unassigned
            </MenuItem>

            {/* Handle former team member fallback if assigned user was removed from project team */}
            {form.assignedUserId &&
              !users.some((user) => user.id === form.assignedUserId) && (
                <MenuItem value={form.assignedUserId} disabled>
                  Former member
                </MenuItem>
              )}

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
          onClick={onClose}
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
          Save Changes
        </Button>
      </DialogActions>
    </>
  );
}

function EditStoryDialog({
  open,
  story,
  users,
  onClose,
}: EditStoryDialogProps) {
  return (
    <Dialog
      open={open && story !== null}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      {story && (
        <EditStoryForm
          key={story.id}
          story={story}
          users={users}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
}

export default EditStoryDialog;