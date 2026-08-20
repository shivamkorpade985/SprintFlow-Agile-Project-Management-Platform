/**
 * AddMemberDialog
 *
 * Modal dialog for assigning existing system users to a project team.
 */
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useEffect, useState } from "react";

import { userRepository } from "../userRepository";
import { AVATAR_OPTIONS } from "../constants/avatars";
import type { User } from "../types/user";

interface AddMemberDialogProps {
  open: boolean;
  existingMemberIds: number[];
  onClose: () => void;
  onAdd: (userId: number) => Promise<void>;
}

function AddMemberDialog({
  open,
  existingMemberIds,
  onClose,
  onAdd,
}: AddMemberDialogProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
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
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof Error ? err.message : "Failed to load users.";
          setError(message);
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

  // Filter out system users who are already members of this project
  const availableUsers = users.filter(
    (user) => !existingMemberIds.includes(user.id),
  );

  const selectedNumericId = selectedUserId ? Number(selectedUserId) : null;
  const selectedUser = users.find((user) => user.id === selectedNumericId);

  const handleSelectUser = (userIdStr: string) => {
    setSelectedUserId(userIdStr);
    const user = users.find((u) => u.id === Number(userIdStr));
    setSelectedAvatar(user?.avatar || AVATAR_OPTIONS[0].color);
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setSelectedUserId("");
    setSelectedAvatar("");
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    if (!selectedUserId || !selectedUser) {
      setError("Please select a user.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Persist avatar selection if updated
      const avatarToSave = selectedAvatar || selectedUser.avatar || AVATAR_OPTIONS[0].color;
      if (avatarToSave !== selectedUser.avatar) {
        await userRepository.updateUser(selectedUser.id, {
          name: selectedUser.name,
          role: selectedUser.role,
          avatar: avatarToSave,
        });
      }

      await onAdd(selectedUser.id);

      handleClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to add team member.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Team Member</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          {availableUsers.length === 0 && !isLoadingUsers ? (
            <Alert severity="info">
              No available system users to add to this project workspace.
            </Alert>
          ) : (
            <>
              {/* Section 1: System User Selection */}
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mb: 1, display: "block" }}>
                  EXISTING SYSTEM USER
                </Typography>

                <TextField
                  select
                  label="Select System User"
                  value={selectedUserId}
                  onChange={(event) => handleSelectUser(event.target.value)}
                  fullWidth
                  required
                  disabled={isLoadingUsers || isSubmitting}
                >
                  {availableUsers.map((user) => (
                    <MenuItem key={user.id} value={String(user.id)}>
                      {user.name} — {user.role}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              {/* Section 2: User Attributes Preview */}
              {selectedUser && (
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "#FAFAFA", borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: "block", mb: 1 }}>
                    PROJECT MEMBERSHIP ATTRIBUTES
                  </Typography>

                  <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                    <Avatar
                      sx={{
                        width: 44,
                        height: 44,
                        bgcolor: selectedAvatar || selectedUser.avatar || "primary.main",
                        fontWeight: 700,
                      }}
                    >
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </Avatar>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {selectedUser.name}
                      </Typography>

                      <Chip
                        icon={<PersonIcon fontSize="small" />}
                        label={selectedUser.role}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mt: 0.5, height: 20, fontSize: "0.65rem", fontWeight: 600 }}
                      />
                    </Box>
                  </Stack>
                </Paper>
              )}

              {/* Section 3: Visual Avatar Color Selection */}
              {selectedUser && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, mb: 1.5, display: "block" }}>
                    AVATAR SELECTION
                  </Typography>

                  <Grid container spacing={1.5}>
                    {AVATAR_OPTIONS.map((option) => {
                      const isSelected = (selectedAvatar || selectedUser.avatar || AVATAR_OPTIONS[0].color) === option.color;

                      return (
                        <Grid key={option.id} size={{ xs: 4, sm: 2 }}>
                          <Paper
                            variant="outlined"
                            onClick={() => !isSubmitting && setSelectedAvatar(option.color)}
                            sx={{
                              p: 1.5,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: isSubmitting ? "default" : "pointer",
                              position: "relative",
                              borderRadius: 2,
                              borderColor: isSelected ? "primary.main" : "divider",
                              borderWidth: isSelected ? 2 : 1,
                              bgcolor: isSelected ? "primary.50" : "background.paper",
                              transition: "all 0.15s ease-in-out",
                              "&:hover": {
                                borderColor: isSelected ? "primary.main" : "text.secondary",
                              },
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: option.color,
                                fontWeight: 700,
                                fontSize: "1rem",
                              }}
                            >
                              {selectedUser.name.charAt(0).toUpperCase()}
                            </Avatar>

                            {isSelected && (
                              <CheckCircleIcon
                                color="primary"
                                sx={{
                                  fontSize: 16,
                                  position: "absolute",
                                  top: 4,
                                  right: 4,
                                }}
                              />
                            )}
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              )}
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={() => void handleSubmit()}
          disabled={availableUsers.length === 0 || !selectedUserId || isLoadingUsers}
          loading={isSubmitting}
        >
          Add Member
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddMemberDialog;