import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
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

  if (!userId) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          User ID is missing.
        </Alert>

        <Button
          variant="outlined"
          onClick={() =>
            navigate(
              projectId
                ? `/projects/${projectId}/team`
                : "/projects",
            )
          }
        >
          Back to Team
        </Button>
      </Box>
    );
  }

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

  if (error || !user) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error ?? "User not found."}
        </Alert>

        <Button
          variant="outlined"
          onClick={() =>
            navigate(
              projectId
                ? `/projects/${projectId}/team`
                : "/projects",
            )
          }
        >
          Back to Team
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        variant="text"
        onClick={() =>
          navigate(
            projectId
              ? `/projects/${projectId}/team`
              : "/projects",
          )
        }
        sx={{ mb: 2 }}
      >
        ← Back to Team
      </Button>

      <Typography
        variant="h4"
        component="h1"
        sx={{ mb: 3 }}
      >
        User Details
      </Typography>

      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3,
            }}
          >
            <Avatar
              src={user.avatar}
              sx={{
                width: 64,
                height: 64,
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>

            <Box>
              <Typography variant="h5">
                {user.name}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
              >
                {user.role}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Typography
            variant="body2"
            color="text.secondary"
          >
            User ID
          </Typography>

          <Typography variant="body1">
            {user.id}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default UserDetailPage;