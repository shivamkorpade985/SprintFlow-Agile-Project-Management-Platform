/**
 * StoryCard
 *
 * Card component for displaying individual user stories within the backlog listing (`StoriesPage`).
 */
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router";

import type { UserStory, StoryPriority, StoryStatus } from "../types/story";
import type { User } from "../../team/types/user";

interface StoryCardProps {
  story: UserStory;
  projectId: number;
  assignee?: User;
  onEdit: (story: UserStory) => void;
  onDelete: (story: UserStory) => void;
}

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

const getStatusColor = (
  status: StoryStatus,
): "success" | "info" | "warning" | "default" => {
  switch (status) {
    case "DONE":
      return "success";
    case "IN_PROGRESS":
      return "info";
    case "TESTING":
      return "warning";
    case "BACKLOG":
    default:
      return "default";
  }
};

function StoryCard({
  story,
  projectId,
  assignee,
  onEdit,
  onDelete,
}: StoryCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      variant="outlined"
      sx={{
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 16px -4px rgba(0, 0, 0, 0.08)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            {/* Story Title */}
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                cursor: "pointer",
                lineHeight: 1.35,
                "&:hover": {
                  color: "primary.main",
                  textDecoration: "underline",
                },
              }}
              onClick={() => navigate(`/projects/${projectId}/stories/${story.id}`)}
            >
              {story.title}
            </Typography>

            {/* Story Description Snippet */}
            {story.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                  lineHeight: 1.5,
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

            {/* Story Metadata Badges */}
            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 2, flexWrap: "wrap", gap: 0.5, alignItems: "center" }}
            >
              <Chip
                label={story.status}
                size="small"
                color={getStatusColor(story.status)}
                variant="outlined"
                sx={{ fontWeight: 700, fontSize: "0.7rem", height: 22 }}
              />

              <Chip
                label={`Priority: ${story.priority}`}
                size="small"
                color={getPriorityColor(story.priority)}
                variant="outlined"
                sx={{ fontWeight: 600, fontSize: "0.7rem", height: 22 }}
              />

              <Chip
                label={`${story.storyPoints} pts`}
                size="small"
                variant="outlined"
                sx={{ fontWeight: 600, fontSize: "0.7rem", height: 22 }}
              />

              {assignee ? (
                <Chip
                  avatar={
                    <Avatar sx={{ width: 18, height: 18, fontSize: "0.65rem", bgcolor: assignee.avatar || "primary.main" }}>
                      {assignee.name.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  label={assignee.name}
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 600, fontSize: "0.7rem", height: 22 }}
                />
              ) : (
                <Chip
                  icon={<PersonIcon fontSize="small" />}
                  label="Unassigned"
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 500, fontSize: "0.7rem", height: 22 }}
                />
              )}
            </Stack>
          </Box>

          {/* Action Buttons */}
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Edit Story">
              <IconButton
                size="small"
                aria-label={`Edit ${story.title}`}
                onClick={() => onEdit(story)}
                sx={{ color: "text.secondary", "&:hover": { color: "primary.main" } }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Story">
              <IconButton
                size="small"
                color="error"
                aria-label={`Delete ${story.title}`}
                onClick={() => onDelete(story)}
                sx={{ color: "error.main", "&:hover": { bgcolor: "error.50" } }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

export default StoryCard;