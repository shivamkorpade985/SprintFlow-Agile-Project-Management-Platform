import type { StoryPriority, StoryStatus } from "../story";

export interface CreateStoryRequest {
  projectId: number;
  title: string;
  description: string;
  priority: StoryPriority;
  storyPoints: number;
  assignedUserId?: number | null;
  status: StoryStatus;
}

export interface UpdateStoryRequest {
  title: string;
  description: string;
  priority: StoryPriority;
  storyPoints: number;
  assignedUserId?: number | null;
  status: StoryStatus;
}