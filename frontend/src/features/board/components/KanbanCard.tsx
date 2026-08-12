import {
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
import { useState } from "react";
import { useNavigate } from "react-router";

import type { UserStory, StoryStatus, StoryPriority } from "../../stories/types/story";
import type { UpdateStoryRequest } from "../../stories/types/contracts/story";
import type { User } from "../../team/types/user";

interface KanbanCardProps {
  story: UserStory;
  projectId: string;
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
): "default" | "info" | "warning" | "error" => {
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
        assignedUserId: story.assignedUserId,
        status: newStatus,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        boxShadow: 1,
        transition: "box-shadow 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            fontWeight: 600,
            cursor: "pointer",
            "&:hover": {
              textDecoration: "underline",
              color: "primary.main",
            },
          }}
          onClick={() =>
            navigate(`/projects/${projectId}/stories/${story.id}`)
          }
        >
          {story.title}
        </Typography>

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
            }}
          >
            {story.description}
          </Typography>
        )}

        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ mb: 2, flexWrap: "wrap", gap: 0.5 }}
        >
          <Chip
            label={story.priority}
            size="small"
            color={getPriorityColor(story.priority)}
            variant="outlined"
          />

          <Chip
            label={`${story.storyPoints} pts`}
            size="small"
            variant="outlined"
          />

          <Chip
            label={assignee ? assignee.name : "Unassigned"}
            size="small"
            color={assignee ? "primary" : "default"}
            variant="outlined"
          />
        </Stack>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="caption" color="text.secondary">
            Status
          </Typography>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={story.status}
              onChange={(e) => void handleStatusSelect(e)}
              disabled={isUpdating}
              sx={{ fontSize: "0.8125rem", height: 32 }}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value} sx={{ fontSize: "0.8125rem" }}>
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
