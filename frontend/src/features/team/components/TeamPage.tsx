import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import { ProjectTeamProvider } from "../context/ProjectTeamProvider";
import { useProjectTeam } from "../hooks/useProjectTeam";
import AddMemberDialog from "./AddMemberDialog";

const getRoleChipColor = (role: string): "primary" | "secondary" | "info" | "default" => {
  switch (role) {
    case "MANAGER":
      return "primary";
    case "DEVELOPER":
      return "info";
    case "TESTER":
      return "secondary";
    default:
      return "default";
  }
};

function TeamContent() {
  const { members, isLoading, error, addMember, removeMember } = useProjectTeam();
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

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
            Team Members
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage team members and role assignments for this project.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddMemberDialogOpen(true)}
          disableElevation
          sx={{ px: 2.5, py: 1 }}
        >
          Add Member
        </Button>
      </Box>

      {/* Member Cards Grid */}
      {members.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No team members assigned to this project workspace yet. Click "Add Member" to invite users.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {members.map((member) => (
            <Grid key={member.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 12px -2px rgba(0, 0, 0, 0.06)",
                  },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Stack direction="row" spacing={2} sx={{ alignItems: "center", justifyContent: "space-between" }}>
                    <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexGrow: 1, minWidth: 0 }}>
                      <Avatar
                        src={member.avatar}
                        sx={{
                          bgcolor: "primary.main",
                          width: 48,
                          height: 48,
                          fontWeight: 700,
                          fontSize: "1.1rem",
                        }}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </Avatar>

                      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            color: "text.primary",
                            cursor: "pointer",
                            "&:hover": { color: "primary.main" },
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          onClick={() => {
                            if (projectId) {
                              navigate(`/projects/${projectId}/team/${member.id}`);
                            }
                          }}
                        >
                          {member.name}
                        </Typography>

                        <Chip
                          icon={<PersonIcon fontSize="small" />}
                          label={member.role}
                          size="small"
                          color={getRoleChipColor(member.role)}
                          variant="outlined"
                          sx={{ mt: 0.5, height: 22, fontSize: "0.7rem", fontWeight: 600 }}
                        />
                      </Box>
                    </Stack>

                    <Tooltip title={`Remove ${member.name} from project`}>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          if (window.confirm(`Remove ${member.name} from this project?`)) {
                            void removeMember(member.id);
                          }
                        }}
                        sx={{
                          bgcolor: "error.50",
                          "&:hover": { bgcolor: "error.100" },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Member Dialog */}
      <AddMemberDialog
        open={isAddMemberDialogOpen}
        existingMemberIds={members.map((m) => m.id)}
        onClose={() => setIsAddMemberDialogOpen(false)}
        onAdd={addMember}
      />
    </Box>
  );
}

function TeamPage() {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <Alert severity="error">Project ID is missing.</Alert>;
  }

  return (
    <ProjectTeamProvider projectId={projectId}>
      <TeamContent />
    </ProjectTeamProvider>
  );
}

export default TeamPage;