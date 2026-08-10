import type { StoryPriority, StoryStatus } from "../story";

export interface CreateStoryRequest {
  title: string;
  description: string;
  priority: StoryPriority;
  storyPoints: number;
  assignedUserId?: string;
  status: StoryStatus;
}

export interface UpdateStoryRequest {
  title: string;
  description: string;
  priority: StoryPriority;
  storyPoints: number;
  assignedUserId?: string;
  status: StoryStatus;
}