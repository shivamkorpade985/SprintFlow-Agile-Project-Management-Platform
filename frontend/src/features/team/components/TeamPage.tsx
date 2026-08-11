import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";


import { useState } from "react";

import { ProjectTeamProvider } from "../context/ProjectTeamProvider";
import { useProjectTeam } from "../hooks/useProjectTeam";
import { useNavigate, useParams } from "react-router";
import AddMemberDialog from "./AddMemberDialog";

function TeamContent() {
  const {
    members,
    isLoading,
    error,
    addMember,
    removeMember,
  } = useProjectTeam();

const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const navigate = useNavigate();

  const { projectId } = useParams<{
    projectId: string;
  }>();



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
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
          <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Typography variant="h4" component="h1">
        Team
      </Typography>

      <Button
        variant="contained"
        onClick={() => setIsAddMemberDialogOpen(true)}
      >
        Add Member
      </Button>
    </Box>

      {members.length === 0 ? (
        <Alert severity="info">
          No team members found for this project.
        </Alert>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {members.map((member) => (
            <Card key={member.id}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Avatar src={member.avatar}>
                      {member.name.charAt(0).toUpperCase()}
                    </Avatar>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        variant="h6"
                        component="button"
                        onClick={() => {
                          if (!projectId) {
                            return;
                          }

                          navigate(
                            `/projects/${projectId}/team/${member.id}`,
                          );
                        }}
                        sx={{
                          border: 0,
                          background: "none",
                          padding: 0,
                          cursor: "pointer",
                          textAlign: "left",
                          font: "inherit",
                          color: "primary.main",
                        }}
                      >
                        {member.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {member.role}
                      </Typography>
                    </Box>

                    <IconButton
                      color="error"
                      aria-label={`Remove ${member.name}`}
                      title={`Remove ${member.name}`}
                      onClick={() => {
                        if (
                          window.confirm(
                            `Remove ${member.name} from this project?`,
                          )
                        ) {
                          void removeMember(member.id);
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
            </Card>
          ))}
        </Box>
      )}
      
      <AddMemberDialog
  open={isAddMemberDialogOpen}
  existingMemberIds={members.map(
    (member) => member.id,
  )}
  onClose={() => setIsAddMemberDialogOpen(false)}
  onAdd={addMember}
/>

    </Box>
  );
}

function TeamPage() {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return (
      <Alert severity="error">
        Project ID is missing.
      </Alert>
    );
  }

  return (
    <ProjectTeamProvider projectId={projectId}>
      <TeamContent />
    </ProjectTeamProvider>
  );
}

export default TeamPage;