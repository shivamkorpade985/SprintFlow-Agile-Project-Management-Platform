import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useProjects } from "../hooks/useProjects";

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
}

function CreateProjectDialog({
  open,
  onClose,
}: CreateProjectDialogProps) {
  const { createProject } = useProjects();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setName("");
    setDescription("");
    setSubmitError(null);
    onClose();
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || !trimmedDescription) {
      setSubmitError("Project name and description are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await createProject({
        name: trimmedName,
        description: trimmedDescription,
      });

      handleClose();
    } catch {
      setSubmitError("Failed to create project.");
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
      <DialogTitle>Create Project</DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {submitError && (
            <Alert severity="error">
              {submitError}
            </Alert>
          )}

          <TextField
            label="Project Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            fullWidth
            required
            autoFocus
            disabled={isSubmitting}
          />

          <TextField
            label="Description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            fullWidth
            required
            multiline
            minRows={4}
            disabled={isSubmitting}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={() => void handleSubmit()}
          loading={isSubmitting}
        >
          Create Project
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CreateProjectDialog;