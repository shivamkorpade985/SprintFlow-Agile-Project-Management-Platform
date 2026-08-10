import type { UserStory } from "../types/story";
import type {
  CreateStoryRequest,
  UpdateStoryRequest,
} from "../types/contracts/story";

export interface StoryRepository {
  getStories(): Promise<UserStory[]>;
  getStoryById(id: string): Promise<UserStory | null>;
  createStory(data: CreateStoryRequest): Promise<UserStory>;
  updateStory(id: string, data: UpdateStoryRequest): Promise<UserStory>;
  deleteStory(id: string): Promise<void>;
}