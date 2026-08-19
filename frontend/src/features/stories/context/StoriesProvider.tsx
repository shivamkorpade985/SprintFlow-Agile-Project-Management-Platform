/**
 * StoriesProvider
 *
 * Context Provider owning project-scoped user stories state for a given numeric `projectId`.
 */
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type { UserStory } from "../types/story";
import type {
  CreateStoryRequest,
  UpdateStoryRequest,
} from "../types/contracts/story";

import { LocalStorageStoryRepository } from "../../../repositories/local/LocalStorageStoryRepository";

import { StoriesContext } from "./storiesContext";

interface StoriesProviderProps {
  projectId: number;
  children: React.ReactNode;
}

const storyRepository =
  new LocalStorageStoryRepository();

export function StoriesProvider({
  projectId,
  children,
}: StoriesProviderProps) {
  const [stories, setStories] = useState<UserStory[]>(
    [],
  );

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null,
  );

  const refreshStories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data =
        await storyRepository.getStoriesByProject(
          projectId,
        );

      setStories(data);
    } catch {
      setError("Failed to load stories.");
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const createStory = useCallback(
    async (
      data: CreateStoryRequest,
    ): Promise<UserStory> => {
      try {
        setError(null);

        const createdStory =
          await storyRepository.createStory(data);

        setStories((currentStories) => [
          ...currentStories,
          createdStory,
        ]);

        return createdStory;
      } catch {
        setError("Failed to create story.");
        throw new Error("Failed to create story.");
      }
    },
    [],
  );

  const updateStory = useCallback(
    async (
      id: number,
      data: UpdateStoryRequest,
    ): Promise<UserStory> => {
      try {
        setError(null);

        const updatedStory =
          await storyRepository.updateStory(
            id,
            data,
          );

        setStories((currentStories) =>
          currentStories.map((story) =>
            story.id === id
              ? updatedStory
              : story,
          ),
        );

        return updatedStory;
      } catch {
        setError("Failed to update story.");
        throw new Error("Failed to update story.");
      }
    },
    [],
  );

  const deleteStory = useCallback(
    async (id: number): Promise<void> => {
      try {
        setError(null);

        await storyRepository.deleteStory(id);

        setStories((currentStories) =>
          currentStories.filter(
            (story) => story.id !== id,
          ),
        );
      } catch {
        setError("Failed to delete story.");
        throw new Error("Failed to delete story.");
      }
    },
    [],
  );

  useEffect(() => {
    let isMounted = true;

    const loadStories = async () => {
      try {
        const data =
          await storyRepository.getStoriesByProject(
            projectId,
          );

        if (isMounted) {
          setStories(data);
        }
      } catch {
        if (isMounted) {
          setError("Failed to load stories.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadStories();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  return (
    <StoriesContext.Provider
      value={{
        stories,
        isLoading,
        error,
        refreshStories,
        createStory,
        updateStory,
        deleteStory,
      }}
    >
      {children}
    </StoriesContext.Provider>
  );
}