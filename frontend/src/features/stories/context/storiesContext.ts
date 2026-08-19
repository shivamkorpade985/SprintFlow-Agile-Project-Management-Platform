/**
 * StoriesContext
 *
 * Defines the React Context contract for managing project-scoped User Story state.
 */
import { createContext } from "react";
import type { UserStory } from "../types/story";
import type {
  CreateStoryRequest,
  UpdateStoryRequest,
} from "../types/contracts/story";

export interface StoriesContextValue {
  stories: UserStory[];
  isLoading: boolean;
  error: string | null;

  refreshStories: () => Promise<void>;

  createStory: (
    data: CreateStoryRequest,
  ) => Promise<UserStory>;

  updateStory: (
    id: number,
    data: UpdateStoryRequest,
  ) => Promise<UserStory>;

  deleteStory: (id: number) => Promise<void>;
}

export const StoriesContext =
  createContext<StoriesContextValue | undefined>(
    undefined,
  );