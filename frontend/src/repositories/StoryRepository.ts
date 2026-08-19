/**
 * StoryRepository Interface
 *
 * Persistence abstraction for User Story CRUD operations.
 */
import type { UserStory } from "../features/stories/types/story";
import type {
  CreateStoryRequest,
  UpdateStoryRequest,
} from "../features/stories/types/contracts/story";

export interface StoryRepository {
  getStoriesByProject(projectId: number): Promise<UserStory[]>;
  getStoryById(id: number): Promise<UserStory | null>;
  createStory(data: CreateStoryRequest): Promise<UserStory>;
  updateStory(id: number, data: UpdateStoryRequest): Promise<UserStory>;
  deleteStory(id: number): Promise<void>;
}