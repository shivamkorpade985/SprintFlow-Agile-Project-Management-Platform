import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "react-router/dom";
import { initializeTeamData } from "./features/team/data/initializeTeamData";

import "./index.css";
import { theme } from "./app/theme/theme";
import { router } from "./app/router";

// mock users exist before TeamPage asks UserRepository for them.
initializeTeamData();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);