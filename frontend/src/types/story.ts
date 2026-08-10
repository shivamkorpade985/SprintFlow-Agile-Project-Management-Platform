export type StoryPriority = "LOW" | "MEDIUM" | "HIGH";

export type StoryStatus =
  | "BACKLOG"
  | "IN_PROGRESS"
  | "TESTING"
  | "DONE";

  export interface UserStory {
  id: string;
  title: string;
  description: string;
  priority: StoryPriority;
  storyPoints: number;
  assignedUserId?: string;
  status: StoryStatus;
  createdAt: string;
}