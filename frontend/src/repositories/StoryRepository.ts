/**
 * StoryRepository Interface
 *
 * Persistence abstraction for User Story CRUD operations.
 *
 * All story queries (listing, creation, updates, deletion) pass through this contract.
 * `StoriesProvider` relies on this interface to keep UI components decoupled from storage.
 */
import type { UserStory } from "../features/stories/types/story";
import type {
  CreateStoryRequest,
  UpdateStoryRequest,
} from "../features/stories/types/contracts/story";

export interface StoryRepository {
  getStoriesByProject(projectId: string): Promise<UserStory[]>;  
  getStoryById(id: string): Promise<UserStory | null>;
  createStory(data: CreateStoryRequest): Promise<UserStory>;
  updateStory(id: string, data: UpdateStoryRequest): Promise<UserStory>;
  deleteStory(id: string): Promise<void>;
}