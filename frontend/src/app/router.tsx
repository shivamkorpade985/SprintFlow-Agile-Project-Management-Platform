import { createBrowserRouter } from "react-router";

import AppLayout from "./layouts/AppLayout";

import BoardPage from "../pages/BoardPage";
import ProjectOverviewPage from "../pages/ProjectOverviewPage";
import ProjectsPage from "../pages/ProjectsPage";
import StoriesPage from "../pages/StoriesPage";
import StoryDetailPage from "../pages/StoryDetailPage";
import TeamPage from "../pages/TeamPage";
import UserDetailPage from "../pages/UserDetailPage";

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