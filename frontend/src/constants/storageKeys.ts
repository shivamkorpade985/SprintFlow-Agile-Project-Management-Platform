/**
 * Storage Key Constants
 *
 * Centralized registry of all local storage key names used by SprintFlow concrete repositories.
 */
export const STORAGE_KEYS = {
  PROJECTS: "sprintflow.projects",
  USERS: "sprintflow.users",
  STORIES: "sprintflow.stories",
  PROJECT_MEMBERS: "sprintflow.projectMembers",
} as const;