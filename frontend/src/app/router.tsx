import { createBrowserRouter } from "react-router";

import AppLayout from "./layouts/AppLayout";

import BoardPage from "../features/board/components/BoardPage";
import ProjectOverviewPage from "../features/projects/components/ProjectOverviewPage";
import ProjectsPage from "../features/projects/components/ProjectsPage";
import StoriesPage from "../features/stories/components/StoriesPage";
import StoryDetailPage from "../features/stories/components/StoryDetailPage";
import TeamPage from "../features/team/components/TeamPage";
import UserDetailPage from "../features/team/components/UserDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      {
        path: "projects",
        Component: ProjectsPage,
      },
      {
        path: "projects/:projectId",
        Component: ProjectOverviewPage,
      },
      {
        path: "projects/:projectId/board",
        Component: BoardPage,
      },
      {
        path: "projects/:projectId/stories",
        Component: StoriesPage,
      },
      {
        path: "projects/:projectId/stories/:storyId",
        Component: StoryDetailPage,
      },
      {
        path: "projects/:projectId/team",
        Component: TeamPage,
      },
      {
        path: "projects/:projectId/team/:userId",
        Component: UserDetailPage,
      },
    ],
  },
]);