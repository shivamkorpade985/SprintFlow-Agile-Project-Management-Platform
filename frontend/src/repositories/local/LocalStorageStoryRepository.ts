/**
 * LocalStorageStoryRepository
 *
 * Client-side implementation of `StoryRepository` backed by browser `localStorage`.
 */
import type { UserStory } from "../../features/stories/types/story";
import type {
  CreateStoryRequest,
  UpdateStoryRequest,
} from "../../features/stories/types/contracts/story";
import { STORAGE_KEYS } from "../../constants/storageKeys";
import { getItem, setItem } from "../../storage/localStorage";
import type { StoryRepository } from "../StoryRepository";

export class LocalStorageStoryRepository implements StoryRepository {
  async getStoriesByProject(
    projectId: number,
  ): Promise<UserStory[]> {
    const stories =
      getItem<UserStory[]>(STORAGE_KEYS.STORIES) ?? [];

    return stories.filter(
      (story) => story.projectId === projectId,
    );
  }

  async getStoryById(
    id: number,
  ): Promise<UserStory | null> {
    const stories =
      getItem<UserStory[]>(STORAGE_KEYS.STORIES) ?? [];

    return (
      stories.find((story) => story.id === id) ?? null
    );
  }

  async createStory(
    data: CreateStoryRequest,
  ): Promise<UserStory> {
    const stories =
      getItem<UserStory[]>(STORAGE_KEYS.STORIES) ?? [];

    const maxId = stories.reduce((max, s) => (s.id > max ? s.id : max), 0);
    const story: UserStory = {
      id: maxId + 1,
      createdAt: new Date().toISOString(),
      ...data,
    };

    setItem(
      STORAGE_KEYS.STORIES,
      [...stories, story],
    );

    return story;
  }

  async updateStory(
    id: number,
    data: UpdateStoryRequest,
  ): Promise<UserStory> {
    const stories =
      getItem<UserStory[]>(STORAGE_KEYS.STORIES) ?? [];

    const existingStory = stories.find(
      (story) => story.id === id,
    );

    if (!existingStory) {
      throw new Error("Story not found");
    }

    const updatedStory: UserStory = {
      ...existingStory,
      ...data,
    };

    setItem(
      STORAGE_KEYS.STORIES,
      stories.map((story) =>
        story.id === id ? updatedStory : story,
      ),
    );

    return updatedStory;
  }

  async deleteStory(id: number): Promise<void> {
    const stories =
      getItem<UserStory[]>(STORAGE_KEYS.STORIES) ?? [];

    setItem(
      STORAGE_KEYS.STORIES,
      stories.filter((story) => story.id !== id),
    );
  }
}