import type { UserStory } from "../../types/story";
import type {
  CreateStoryRequest,
  UpdateStoryRequest,
} from "../../types/contracts/story";
import { STORAGE_KEYS } from "../../constants/storageKeys";
import { getItem, setItem } from "../../storage/localStorage";
import type { StoryRepository } from "../StoryRepository";

export class LocalStorageStoryRepository implements StoryRepository {
  async getStories(): Promise<UserStory[]> {
    return getItem<UserStory[]>(STORAGE_KEYS.STORIES) ?? [];
  }

  async getStoryById(id: string): Promise<UserStory | null> {
    const stories = await this.getStories();

    return stories.find((story) => story.id === id) ?? null;
  }

  async createStory(data: CreateStoryRequest): Promise<UserStory> {
    const stories = await this.getStories();

    const story: UserStory = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...data,
    };

    setItem(STORAGE_KEYS.STORIES, [...stories, story]);

    return story;
  }

  async updateStory(
    id: string,
    data: UpdateStoryRequest,
  ): Promise<UserStory> {
    const stories = await this.getStories();

    const existingStory = stories.find((story) => story.id === id);

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

  async deleteStory(id: string): Promise<void> {
    const stories = await this.getStories();

    setItem(
      STORAGE_KEYS.STORIES,
      stories.filter((story) => story.id !== id),
    );
  }
}