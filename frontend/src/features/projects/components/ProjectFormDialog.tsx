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

export interface ProjectFormValues {
  name: string;
  description: string;
}

interface ProjectFormDialogProps {
  open: boolean;
  title: string;
  submitLabel: string;
  initialValues: ProjectFormValues;
  onClose: () => void;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
}

function ProjectFormDialog({
  open,
  title,
  submitLabel,
  initialValues,
  onClose,
  onSubmit,
}: ProjectFormDialogProps) {
  const [name, setName] = useState(initialValues.name);
  const [description, setDescription] = useState(
    initialValues.description,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setName(initialValues.name);
    setDescription(initialValues.description);
    setSubmitError(null);

    onClose();
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || !trimmedDescription) {
      setSubmitError(
        "Project name and description are required.",
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await onSubmit({
        name: trimmedName,
        description: trimmedDescription,
      });

      handleClose();
    } catch {
      setSubmitError("Failed to save project.");
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
      <DialogTitle>{title}</DialogTitle>

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
          {submitLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProjectFormDialog;