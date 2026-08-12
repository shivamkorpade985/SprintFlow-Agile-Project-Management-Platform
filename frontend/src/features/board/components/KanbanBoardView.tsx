import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router";

import { useStories } from "../../stories/hooks/useStories";
import { useProjectTeam } from "../../team/hooks/useProjectTeam";
import type { UserStory, StoryStatus } from "../../stories/types/story";
import type { UpdateStoryRequest } from "../../stories/types/contracts/story";
import KanbanCard from "./KanbanCard";

interface KanbanBoardViewProps {
  projectId: string;
}

interface ColumnDefinition {
  status: StoryStatus;
  title: string;
  color: string;
}

const KANBAN_COLUMNS: ColumnDefinition[] = [
  { status: "BACKLOG", title: "Backlog", color: "#e0e0e0" },
  { status: "IN_PROGRESS", title: "In Progress", color: "#bbdefb" },
  { status: "TESTING", title: "Testing", color: "#fff9c4" },
  { status: "DONE", title: "Done", color: "#c8e6c9" },
];

function KanbanBoardView({ projectId }: KanbanBoardViewProps) {
  const navigate = useNavigate();
  const { stories, isLoading: isLoadingStories, error: storiesError, updateStory } = useStories();
  const { members, isLoading: isLoadingTeam, error: teamError } = useProjectTeam();

  const isLoading = isLoadingStories || isLoadingTeam;
  const error = storiesError || teamError;

  const handleStatusChange = async (story: UserStory, updateData: UpdateStoryRequest) => {
    await updateStory(story.id, updateData);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/projects/${projectId}`)}
        sx={{ mb: 3 }}
      >
        Back to Project
      </Button>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" component="h1">
          Kanban Board
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {KANBAN_COLUMNS.map((column) => {
          const columnStories = stories.filter(
            (story) => story.status === column.status,
          );

          return (
            <Grid key={column.status} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  backgroundColor: "#f8f9fa",
                  minHeight: 500,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    pb: 1,
                    borderBottom: 2,
                    borderColor: column.color,
                  }}
                >
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                    {column.title}
                  </Typography>

                  <Chip
                    label={columnStories.length}
                    size="small"
                    color="default"
                    sx={{ fontWeight: "bold" }}
                  />
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  {columnStories.length === 0 ? (
                    <Box
                      sx={{
                        p: 2,
                        textAlign: "center",
                        backgroundColor: "#ffffff",
                        borderRadius: 1,
                        border: "1px dashed #bdbdbd",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No stories in {column.title.toLowerCase()}
                      </Typography>
                    </Box>
                  ) : (
                    columnStories.map((story) => {
                      const assignee = members.find(
                        (member) => member.id === story.assignedUserId,
                      );

                      return (
                        <KanbanCard
                          key={story.id}
                          story={story}
                          projectId={projectId}
                          assignee={assignee}
                          onStatusChange={handleStatusChange}
                        />
                      );
                    })
                  )}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default KanbanBoardView;
