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