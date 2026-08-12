import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
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
  accentColor: string;
  bgColor: string;
}

const KANBAN_COLUMNS: ColumnDefinition[] = [
  { status: "BACKLOG", title: "Backlog", accentColor: "#64748B", bgColor: "#F8FAFC" },
  { status: "IN_PROGRESS", title: "In Progress", accentColor: "#1E64D4", bgColor: "#F0F7FF" },
  { status: "TESTING", title: "Testing", accentColor: "#D97706", bgColor: "#FFFDF0" },
  { status: "DONE", title: "Done", accentColor: "#16A34A", bgColor: "#F0FDF4" },
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
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto" }}>
      {/* Navigation Back Link */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/projects/${projectId}`)}
        sx={{ mb: 3 }}
      >
        Back to Project
      </Button>

      {/* Page Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1">
            Kanban Board
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Visualize workflow stages and track story progression in real time.
          </Typography>
        </Box>
      </Box>

      {/* Kanban Columns Grid */}
      <Grid container spacing={2.5}>
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
                  bgcolor: column.bgColor,
                  minHeight: 560,
                  display: "flex",
                  flexDirection: "column",
                  borderTop: 4,
                  borderTopColor: column.accentColor,
                  borderRadius: 3,
                }}
              >
                {/* Column Header */}
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    pb: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 700, color: "text.primary" }}>
                    {column.title}
                  </Typography>

                  <Chip
                    label={columnStories.length}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      bgcolor: "background.paper",
                      border: "1px solid",
                      borderColor: "divider",
                    }}
                  />
                </Stack>

                {/* Column Story Items Container */}
                <Box sx={{ flexGrow: 1 }}>
                  {columnStories.length === 0 ? (
                    <Box
                      sx={{
                        p: 3,
                        textAlign: "center",
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        border: "1px dashed #CBD5E1",
                        mt: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
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
