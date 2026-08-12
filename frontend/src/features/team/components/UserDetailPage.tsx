import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BadgeIcon from "@mui/icons-material/Badge";
import PersonIcon from "@mui/icons-material/Person";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { LocalStorageUserRepository } from "../../../repositories/local/LocalStorageUserRepository";
import type { User } from "../types/user";

const userRepository = new LocalStorageUserRepository();

function UserDetailPage() {
  const { projectId, userId } = useParams<{
    projectId: string;
    userId: string;
  }>();

  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(userId));
  const [error, setError] = useState<string | null>(
    userId ? null : "User ID is missing.",
  );

  useEffect(() => {
    if (!userId) {
      return;
    }

    let isMounted = true;

    const loadUser = async () => {
      try {
        const data = await userRepository.getUserById(userId);

        if (isMounted) {
          if (!data) {
            setError("User not found.");
          } else {
            setUser(data);
          }
        }
      } catch {
        if (isMounted) {
          setError("Failed to load user.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const handleBackToTeam = () => {
    navigate(projectId ? `/projects/${projectId}/team` : "/projects");
  };

  if (!userId) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          User ID is missing.
        </Alert>

        <Button variant="outlined" onClick={handleBackToTeam}>
          Back to Team
        </Button>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error ?? "User not found."}
        </Alert>

        <Button variant="outlined" onClick={handleBackToTeam}>
          Back to Team
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto" }}>
      {/* Navigation Back Link */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBackToTeam}
        sx={{ mb: 3 }}
      >
        Back to Team
      </Button>

      {/* User Details Card Container */}
      <Card variant="outlined" sx={{ p: 1 }}>
        <CardContent sx={{ p: 3 }}>
          {/* User Profile Header */}
          <Stack direction="row" spacing={3} sx={{ alignItems: "center", mb: 3 }}>
            <Avatar
              src={user.avatar}
              sx={{
                width: 72,
                height: 72,
                bgcolor: "primary.main",
                fontSize: "1.75rem",
                fontWeight: 700,
                boxShadow: 2,
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>

            <Box>
              <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
                {user.name}
              </Typography>

              <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 1 }}>
                <Chip
                  icon={<PersonIcon fontSize="small" />}
                  label={user.role}
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Stack>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* User Metadata Grid */}
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontWeight: 700, letterSpacing: 0.5 }}>
            USER INFORMATION
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, bgcolor: "#FAFAFA" }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  SYSTEM USER ID
                </Typography>

                <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 0.5 }}>
                  <BadgeIcon fontSize="small" color="action" />

                  <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 600 }}>
                    {user.id}
                  </Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  ASSIGNED ROLE
                </Typography>

                <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 600 }}>
                  {user.role}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </CardContent>
      </Card>
    </Box>
  );
}

export default UserDetailPage;