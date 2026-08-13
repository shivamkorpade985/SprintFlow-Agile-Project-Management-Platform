/**
 * StoriesContext
 *
 * Contract defining the context value exposed by `StoriesProvider`.
 *
 * Components consume this context via `useStories()` custom hook.
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
    id: string,
    data: UpdateStoryRequest,
  ) => Promise<UserStory>;

  deleteStory: (id: string) => Promise<void>;
}

export const StoriesContext =
  createContext<StoriesContextValue | undefined>(
    undefined,
  );