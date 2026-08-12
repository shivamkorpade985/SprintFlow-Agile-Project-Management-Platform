import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import type { UserStory } from "../types/story";
import type { User } from "../../team/types/user";
import { useNavigate } from "react-router";

interface StoryCardProps {
  story: UserStory;
  projectId: string;
  assignee?: User;
  onEdit: (story: UserStory) => void;
  onDelete: (story: UserStory) => void;
}

function StoryCard({
  story,
  projectId,
  assignee,
  onEdit,
  onDelete,
}: StoryCardProps) {

    const navigate = useNavigate();
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography
                variant="h6"
                component="h2"
                sx={{
                    cursor: "pointer",
                    "&:hover": {
                    textDecoration: "underline",
                    },
                }}
                onClick={() =>
                    navigate(
                    `/projects/${projectId}/stories/${story.id}`,
                    )
                }
                >
                {story.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              {story.description}
            </Typography>

            <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        mt: 2,
                        flexWrap: "wrap",
            }}
            >
              <Chip
                label={`Priority: ${story.priority}`}
                size="small"
              />

              <Chip
                label={`Points: ${story.storyPoints}`}
                size="small"
              />

              <Chip
                label={`Status: ${story.status}`}
                size="small"
              />

              <Chip
                label={
                  assignee
                    ? `Assignee: ${assignee.name}`
                    : "Unassigned"
                }
                size="small"
              />
            </Stack>
          </Box>

          <Box>
            <IconButton
              aria-label={`Edit ${story.title}`}
              onClick={() => onEdit(story)}
            >
              <EditIcon />
            </IconButton>

            <IconButton
              color="error"
              aria-label={`Delete ${story.title}`}
              onClick={() => onDelete(story)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default StoryCard;