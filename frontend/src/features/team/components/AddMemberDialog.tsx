import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

import { LocalStorageUserRepository } from "../../../repositories/local/LocalStorageUserRepository";
import type { User } from "../types/user";

interface AddMemberDialogProps {
  open: boolean;
  existingMemberIds: string[];
  onClose: () => void;
  onAdd: (userId: string) => Promise<void>;
}

const userRepository = new LocalStorageUserRepository();

function AddMemberDialog({
  open,
  existingMemberIds,
  onClose,
  onAdd,
}: AddMemberDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    let isMounted = true;

    const loadUsers = async () => {
      try {
        setIsLoadingUsers(true);
        setError(null);

        const data = await userRepository.getUsers();

        if (isMounted) {
          setUsers(data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load users.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingUsers(false);
        }
      }
    };

    void loadUsers();

    return () => {
      isMounted = false;
    };
  }, [open]);

  const availableUsers = users.filter(
    (user) => !existingMemberIds.includes(user.id),
  );

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setSelectedUserId("");
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedUserId) {
      setError("Please select a user.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await onAdd(selectedUserId);

      handleClose();
    } catch {
      setError("Failed to add team member.");
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
      <DialogTitle>Add Team Member</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {availableUsers.length === 0 &&
        !isLoadingUsers ? (
          <Alert severity="info">
            No available users to add to this project.
          </Alert>
        ) : (
          <TextField
            select
            label="User"
            value={selectedUserId}
            onChange={(event) =>
              setSelectedUserId(event.target.value)
            }
            fullWidth
            required
            disabled={isLoadingUsers || isSubmitting}
            sx={{ mt: 1 }}
          >
            {availableUsers.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name} — {user.role}
              </MenuItem>
            ))}
          </TextField>
        )}
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
          disabled={
            availableUsers.length === 0 ||
            isLoadingUsers
          }
          loading={isSubmitting}
        >
          Add Member
        </Button>
      </DialogActions>
    </Dialog>



  );
}

export default AddMemberDialog;