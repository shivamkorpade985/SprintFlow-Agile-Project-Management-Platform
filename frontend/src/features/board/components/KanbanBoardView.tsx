/**
 * KanbanBoardView
 *
 * Presentation layer for the 4-stage project Kanban board (Backlog, In Progress, Testing, Done).
 *
 * Single Source of Truth Architecture:
 * - Does NOT maintain a duplicate local copy of story state or a custom `BoardProvider`.
 * - Columns (`KANBAN_COLUMNS`) are dynamically derived by filtering `stories` from `StoriesProvider` by `StoryStatus`.
 *
 * Drag and Drop Workflow:
 * User Drags KanbanCard
 *   ↓ HTML5 e.dataTransfer.setData("text/plain", story.id)
 * User Drops Card on Target Column (KanbanBoardView column paper)
 *   ↓ onDrop triggers handleDrop(storyId, targetStatus)
 * updateStory(story.id, { ...story, status: targetStatus })
 *   ↓
 * StoriesProvider updates state & LocalStorageStoryRepository persists change
 *   ↓
 * All subscribers re-render automatically
 */
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
import { useState } from "react";
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

// Fixed 4-stage workflow column definitions
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
  // Drag highlight indicator state
  const [draggedOverColumn, setDraggedOverColumn] = useState<StoryStatus | null>(null);

  const isLoading = isLoadingStories || isLoadingTeam;
  const error = storiesError || teamError;

  const handleStatusChange = async (story: UserStory, updateData: UpdateStoryRequest) => {
    await updateStory(story.id, updateData);
  };

  // Drop event handler for moving story cards between Kanban columns
  const handleDrop = async (storyId: string, targetStatus: StoryStatus) => {
    setDraggedOverColumn(null);
    const story = stories.find((s) => s.id === storyId);
    if (!story || story.status === targetStatus) {
      return;
    }

    try {
      await updateStory(story.id, {
        title: story.title,
        description: story.description,
        priority: story.priority,
        storyPoints: story.storyPoints,
        assignedUserId: story.assignedUserId,
        status: targetStatus,
      });
    } catch {
      // Error handling is managed by StoriesProvider context
    }
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
          // Derive column stories dynamically from StoriesProvider
          const columnStories = stories.filter(
            (story) => story.status === column.status,
          );
          const isTargeted = draggedOverColumn === column.status;

          return (
            <Grid key={column.status} size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper
                variant="outlined"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDraggedOverColumn(column.status);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDraggedOverColumn(null);
                  }
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const storyId = e.dataTransfer.getData("text/plain");
                  if (storyId) {
                    void handleDrop(storyId, column.status);
                  } else {
                    setDraggedOverColumn(null);
                  }
                }}
                sx={{
                  p: 2,
                  bgcolor: column.bgColor,
                  minHeight: 560,
                  display: "flex",
                  flexDirection: "column",
                  borderTop: 4,
                  borderTopColor: column.accentColor,
                  borderRadius: 3,
                  outline: isTargeted ? `2px dashed ${column.accentColor}` : "none",
                  outlineOffset: -2,
                  boxShadow: isTargeted ? `0 0 0 4px ${column.accentColor}20` : "none",
                  transition: "outline 0.15s ease, box-shadow 0.15s ease",
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
