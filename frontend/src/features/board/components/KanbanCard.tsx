/**
 * KanbanCard
 *
 * Story card item rendered inside Kanban column lists.
 */
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import { useNavigate } from "react-router";

import type { UserStory, StoryStatus, StoryPriority } from "../../stories/types/story";
import type { UpdateStoryRequest } from "../../stories/types/contracts/story";
import type { User } from "../../team/types/user";

interface KanbanCardProps {
  story: UserStory;
  projectId: number;
  assignee?: User;
  onStatusChange: (story: UserStory, updateData: UpdateStoryRequest) => Promise<void>;
}

const STATUS_OPTIONS: { value: StoryStatus; label: string }[] = [
  { value: "BACKLOG", label: "Backlog" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "TESTING", label: "Testing" },
  { value: "DONE", label: "Done" },
];

const getPriorityColor = (
  priority: StoryPriority,
): "error" | "warning" | "info" | "default" => {
  switch (priority) {
    case "HIGH":
      return "error";
    case "MEDIUM":
      return "warning";
    case "LOW":
      return "info";
    default:
      return "default";
  }
};

function KanbanCard({
  story,
  projectId,
  assignee,
  onStatusChange,
}: KanbanCardProps) {
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Status select dropdown change handler
  const handleStatusSelect = async (event: SelectChangeEvent<string>) => {
    const newStatus = event.target.value as StoryStatus;
    if (newStatus === story.status) {
      return;
    }

    try {
      setIsUpdating(true);
      await onStatusChange(story, {
        title: story.title,
        description: story.description,
        priority: story.priority,
        storyPoints: story.storyPoints,
        assignedUserId: story.assignedUserId ?? null,
        status: newStatus,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card
      variant="outlined"
      draggable
      onDragStart={(e) => {
        // Attach story ID as string to drag data transfer object
        e.dataTransfer.setData("text/plain", String(story.id));
        e.dataTransfer.effectAllowed = "move";
        setIsDragging(true);
      }}
      onDragEnd={() => {
        setIsDragging(false);
      }}
      sx={{
        mb: 2,
        bgcolor: "background.paper",
        cursor: isDragging ? "grabbing" : "grab",
        opacity: isDragging ? 0.5 : 1,
        transition: "transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 12px -2px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        {/* Story Title */}
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            fontWeight: 700,
            cursor: "pointer",
            lineHeight: 1.3,
            "&:hover": {
              color: "primary.main",
              textDecoration: "underline",
            },
          }}
          onClick={() => navigate(`/projects/${projectId}/stories/${story.id}`)}
        >
          {story.title}
        </Typography>

        {/* Story Description */}
        {story.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              mb: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: "0.8125rem",
              lineHeight: 1.4,
            }}
          >
            {story.description}
          </Typography>
        )}

        {/* Badges Stack */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ mb: 2, flexWrap: "wrap", gap: 0.5, alignItems: "center" }}
        >
          <Chip
            label={story.priority}
            size="small"
            color={getPriorityColor(story.priority)}
            variant="outlined"
            sx={{ height: 20, fontSize: "0.65rem", fontWeight: 700 }}
          />

          <Chip
            label={`${story.storyPoints} pts`}
            size="small"
            variant="outlined"
            sx={{ height: 20, fontSize: "0.65rem", fontWeight: 600 }}
          />

          {assignee ? (
            <Chip
              avatar={
                <Avatar sx={{ width: 16, height: 16, fontSize: "0.6rem", bgcolor: assignee.avatar || "primary.main" }}>
                  {assignee.name.charAt(0).toUpperCase()}
                </Avatar>
              }
              label={assignee.name}
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: "0.65rem", fontWeight: 600 }}
            />
          ) : (
            <Chip
              icon={<PersonIcon fontSize="small" />}
              label="Unassigned"
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: "0.65rem", fontWeight: 500 }}
            />
          )}
        </Stack>

        {/* Status Dropdown */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Status
          </Typography>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={story.status}
              onChange={(e) => void handleStatusSelect(e)}
              disabled={isUpdating}
              sx={{ fontSize: "0.75rem", height: 30, borderRadius: 1.5 }}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value} sx={{ fontSize: "0.75rem" }}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </CardContent>
    </Card>
  );
}

export default KanbanCard;
