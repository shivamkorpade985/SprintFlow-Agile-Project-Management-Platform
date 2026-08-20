/**
 * StoryFilters
 *
 * Filter toolbar component for searching and refining the user story backlog list.
 */
import {
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ClearIcon from "@mui/icons-material/Clear";
import FilterListIcon from "@mui/icons-material/FilterList";
import PersonIcon from "@mui/icons-material/Person";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import SearchIcon from "@mui/icons-material/Search";
import { useSearchParams } from "react-router";

import type { User } from "../../team/types/user";

interface StoryFiltersProps {
  users: User[];
  totalStoriesCount: number;
  filteredStoriesCount: number;
}

export default function StoryFilters({
  users,
  totalStoriesCount,
  filteredStoriesCount,
}: StoryFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParam = searchParams.get("search") || "";
  const assigneeParam = searchParams.get("assignee") || "ALL";
  const priorityParam = searchParams.get("priority") || "ALL";
  const myTasksParam = searchParams.get("myTasks") === "true";

  const hasActiveFilters = Boolean(
    searchParam ||
      (assigneeParam && assigneeParam !== "ALL") ||
      (priorityParam && priorityParam !== "ALL") ||
      myTasksParam,
  );

  // Helper method for updating individual URL query parameters
  const updateParam = (key: string, value: string | boolean) => {
    const nextParams = new URLSearchParams(searchParams);

    if (typeof value === "boolean") {
      if (value) {
        nextParams.set(key, "true");
      } else {
        nextParams.delete(key);
      }
    } else {
      const trimmed = value.trim();
      if (trimmed && trimmed !== "ALL") {
        nextParams.set(key, trimmed);
      } else {
        nextParams.delete(key);
      }
    }

    setSearchParams(nextParams, { replace: true });
  };

  const handleClearFilters = () => {
    setSearchParams({}, { replace: true });
  };

  return (
    <Box
      sx={{
        p: 2,
        mb: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack spacing={2}>
        {/* Top Filter Controls Grid */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            alignItems: "center",
          }}
        >
          {/* Title Search Input */}
          <TextField
            size="small"
            placeholder="Search stories by title..."
            value={searchParam}
            onChange={(e) => updateParam("search", e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchParam ? (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label="clear search"
                      onClick={() => updateParam("search", "")}
                      edge="end"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              },
            }}
            sx={{ flexGrow: 1, minWidth: { xs: "100%", sm: 220 } }}
          />

          {/* Assignee Filter Dropdown */}
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 170 } }}>
            <Select
              value={assigneeParam}
              onChange={(e) => updateParam("assignee", e.target.value)}
              displayEmpty
              startAdornment={
                <InputAdornment position="start" sx={{ mr: 0.5 }}>
                  <PersonIcon fontSize="small" color="action" />
                </InputAdornment>
              }
              sx={{ fontSize: "0.875rem" }}
            >
              <MenuItem value="ALL">All Team Members</MenuItem>
              <MenuItem value="UNASSIGNED">Unassigned</MenuItem>
              {users.map((user) => (
                <MenuItem key={user.id} value={String(user.id)}>
                  {user.name} ({user.role})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Priority Filter Dropdown */}
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 150 } }}>
            <Select
              value={priorityParam}
              onChange={(e) => updateParam("priority", e.target.value)}
              displayEmpty
              startAdornment={
                <InputAdornment position="start" sx={{ mr: 0.5 }}>
                  <PriorityHighIcon fontSize="small" color="action" />
                </InputAdornment>
              }
              sx={{ fontSize: "0.875rem" }}
            >
              <MenuItem value="ALL">All Priorities</MenuItem>
              <MenuItem value="HIGH">High Priority</MenuItem>
              <MenuItem value="MEDIUM">Medium Priority</MenuItem>
              <MenuItem value="LOW">Low Priority</MenuItem>
            </Select>
          </FormControl>

          {/* My Tasks Filter Button / Toggle */}
          <Tooltip title="Requires authenticated user session (coming with backend API)">
            <span>
              <Chip
                icon={<AccountCircleIcon fontSize="small" />}
                label="My Tasks"
                clickable={false}
                disabled
                variant={myTasksParam ? "filled" : "outlined"}
                color={myTasksParam ? "primary" : "default"}
                sx={{ height: 40, px: 1 }}
              />
            </span>
          </Tooltip>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <Button
              size="small"
              color="secondary"
              startIcon={<FilterListIcon />}
              onClick={handleClearFilters}
              sx={{ fontWeight: 600 }}
            >
              Clear Filters
            </Button>
          )}
        </Box>

        {/* Results Counter & Active Filter Indicators */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
            pt: 0.5,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {hasActiveFilters ? (
              <>
                Showing <strong>{filteredStoriesCount}</strong> of{" "}
                <strong>{totalStoriesCount}</strong> stories
              </>
            ) : (
              <>
                Total stories: <strong>{totalStoriesCount}</strong>
              </>
            )}
          </Typography>

          {/* Active Filter Chips Bar */}
          {hasActiveFilters && (
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 0.5 }}>
              {searchParam && (
                <Chip
                  size="small"
                  label={`Search: "${searchParam}"`}
                  onDelete={() => updateParam("search", "")}
                />
              )}

              {assigneeParam !== "ALL" && (
                <Chip
                  size="small"
                  label={`Assignee: ${
                    assigneeParam === "UNASSIGNED"
                      ? "Unassigned"
                      : users.find((u) => u.id === Number(assigneeParam))?.name || assigneeParam
                  }`}
                  onDelete={() => updateParam("assignee", "ALL")}
                />
              )}

              {priorityParam !== "ALL" && (
                <Chip
                  size="small"
                  label={`Priority: ${priorityParam}`}
                  onDelete={() => updateParam("priority", "ALL")}
                />
              )}
            </Stack>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
