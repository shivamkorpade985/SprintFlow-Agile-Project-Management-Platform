/**
 * Application Router Configuration
 *
 * Defines the main URL routing structure for SprintFlow using React Router v7.
 *
 * Route Hierarchy:
 * 1. Public Layout ("/") -> LandingLayout
 *    - Renders public marketing / landing page without workspace navigation drawer.
 *
 * 2. Workspace Layout ("/projects") -> AppLayout
 *    - Renders application workspace with top app bar, navigation drawer, and project contexts.
 *    - Child routes use parameter abstractions (:projectId, :storyId, :userId) for contextual views:
 *      - GET /projects                   -> Global project listing page.
 *      - GET /projects/:projectId        -> Project overview & dashboard metrics.
 *      - GET /projects/:projectId/board  -> Interactive Kanban board view.
 *      - GET /projects/:projectId/stories -> Backlog & user story management.
 *      - GET /projects/:projectId/stories/:storyId -> Detailed story view.
 *      - GET /projects/:projectId/team   -> Project team membership management.
 *      - GET /projects/:projectId/team/:userId -> Team member profile details.
 */
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
    // Public Experience (Marketing Landing Page)
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
    // Application Workspace Experience (Projects, Boards, Stories, Team)
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