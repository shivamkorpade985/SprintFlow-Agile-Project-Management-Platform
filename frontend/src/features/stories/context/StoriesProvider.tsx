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

import { storyRepository } from "../storyRepository";
import { StoriesContext } from "./storiesContext";

interface StoriesProviderProps {
  projectId: number;
  children: React.ReactNode;
}

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
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load stories.";
      setError(message);
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
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create story.";
        setError(message);
        throw new Error(message, { cause: err });
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
              ? {
                  ...story,
                  ...updatedStory,
                  projectId: story.projectId,
                  createdAt: story.createdAt,
                }
              : story,
          ),
        );

        return updatedStory;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update story.";
        setError(message);
        throw new Error(message, { cause: err });
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
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete story.";
        setError(message);
        throw new Error(message, { cause: err });
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
      } catch (err) {
        if (isMounted) {
          const message =
            err instanceof Error ? err.message : "Failed to load stories.";
          setError(message);
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