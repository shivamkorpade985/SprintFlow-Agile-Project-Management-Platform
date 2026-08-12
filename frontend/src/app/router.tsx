import { createBrowserRouter } from "react-router";

import AppLayout from "./layouts/AppLayout";
import LandingLayout from "./layouts/LandingLayout";

import BoardPage from "../features/board/components/BoardPage";
import LandingPage from "../features/landing/components/LandingPage";
import ProjectOverviewPage from "../features/projects/components/ProjectOverviewPage";
import ProjectsPage from "../features/projects/components/ProjectsPage";
import StoriesPage from "../features/stories/components/StoriesPage";
import StoryDetailPage from "../features/stories/components/StoryDetailPage";
import TeamPage from "../features/team/components/TeamPage";
import UserDetailPage from "../features/team/components/UserDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingLayout,
    children: [
      {
        index: true,
        Component: LandingPage,
      },
    ],
  },
  {
    path: "/projects",
    Component: AppLayout,
    children: [
      {
        index: true,
        Component: ProjectsPage,
      },
      {
        path: ":projectId",
        Component: ProjectOverviewPage,
      },
      {
        path: ":projectId/board",
        Component: BoardPage,
      },
      {
        path: ":projectId/stories",
        Component: StoriesPage,
      },
      {
        path: ":projectId/stories/:storyId",
        Component: StoryDetailPage,
      },
      {
        path: ":projectId/team",
        Component: TeamPage,
      },
      {
        path: ":projectId/team/:userId",
        Component: UserDetailPage,
      },
    ],
  },
]);