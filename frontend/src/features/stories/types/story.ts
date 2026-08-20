export type StoryPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export type StoryStatus =
  | "BACKLOG"
  | "IN_PROGRESS"
  | "TESTING"
  | "DONE";

export interface UserStory {
  id: number;
  projectId: number;
  title: string;
  description: string;
  priority: StoryPriority;
  storyPoints: number;
  assignedUserId?: number | null;
  status: StoryStatus;
  createdAt: string;
}