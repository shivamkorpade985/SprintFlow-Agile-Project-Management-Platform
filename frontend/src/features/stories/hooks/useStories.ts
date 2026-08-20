/**
 * useStories Custom Hook
 *
 * Custom React hook providing access to project-scoped story state and operations.
 *
 * Throws an explicit error if invoked outside `StoriesProvider`.
 */
import { useContext } from "react";

import { StoriesContext } from "../context/storiesContext";

export function useStories() {
  const context = useContext(StoriesContext);

  if (!context) {
    throw new Error(
      "useStories must be used within StoriesProvider",
    );
  }

  return context;
}