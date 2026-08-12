import {
  AppBar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import { useState } from "react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router";

import { theme } from "../theme/theme";
import { ProjectsProvider } from "../../features/projects/context/ProjectsProvider";
import { useProjects } from "../../features/projects/hooks/useProjects";

const drawerWidth = 260;

function AppLayoutContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ projectId?: string }>();
  const projectId = params.projectId;

  const { projects } = useProjects();
  const currentProject = projects.find((p) => p.id === projectId);

  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    if (!isDesktop) {
      setMobileDrawerOpen(false);
    }
  };

  const isOverviewActive =
    Boolean(projectId) && location.pathname === `/projects/${projectId}`;
  const isBoardActive =
    Boolean(projectId) &&
    location.pathname.startsWith(`/projects/${projectId}/board`);
  const isStoriesActive =
    Boolean(projectId) &&
    location.pathname.startsWith(`/projects/${projectId}/stories`);
  const isTeamActive =
    Boolean(projectId) &&
    location.pathname.startsWith(`/projects/${projectId}/team`);
  const isAllProjectsActive = location.pathname === "/projects";

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Toolbar />

      {projectId ? (
        // Contextual Sidebar Navigation — Inside Project
        <Box sx={{ p: 2, flexGrow: 1, overflowY: "auto" }}>
          {/* Project Header */}
          <Box sx={{ mb: 2, px: 1 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 700, letterSpacing: 0.8 }}
            >
              PROJECT
            </Typography>

            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                lineHeight: 1.3,
                mt: 0.5,
                wordBreak: "break-word",
              }}
            >
              {currentProject ? currentProject.name : "Loading..."}
            </Typography>
          </Box>

          <Divider sx={{ mb: 1 }} />

          {/* Project Links */}
          <List component="nav" disablePadding>
            <ListItemButton
              selected={isOverviewActive}
              onClick={() => handleNavigation(`/projects/${projectId}`)}
              sx={{ borderRadius: 1.5, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: isOverviewActive ? "primary.main" : "inherit" }}>
                <DashboardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: isOverviewActive ? 700 : 500 }}>
                    Overview
                  </Typography>
                }
              />
            </ListItemButton>

            <ListItemButton
              selected={isBoardActive}
              onClick={() => handleNavigation(`/projects/${projectId}/board`)}
              sx={{ borderRadius: 1.5, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: isBoardActive ? "primary.main" : "inherit" }}>
                <ViewKanbanIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: isBoardActive ? 700 : 500 }}>
                    Board
                  </Typography>
                }
              />
            </ListItemButton>

            <ListItemButton
              selected={isStoriesActive}
              onClick={() => handleNavigation(`/projects/${projectId}/stories`)}
              sx={{ borderRadius: 1.5, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: isStoriesActive ? "primary.main" : "inherit" }}>
                <AssignmentIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: isStoriesActive ? 700 : 500 }}>
                    Stories
                  </Typography>
                }
              />
            </ListItemButton>

            <ListItemButton
              selected={isTeamActive}
              onClick={() => handleNavigation(`/projects/${projectId}/team`)}
              sx={{ borderRadius: 1.5, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: isTeamActive ? "primary.main" : "inherit" }}>
                <PeopleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: isTeamActive ? 700 : 500 }}>
                    Team
                  </Typography>
                }
              />
            </ListItemButton>
          </List>

          <Divider sx={{ my: 2 }} />

          {/* Workspace Switcher Link */}
          <Box sx={{ px: 1, mb: 0.5 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 700, letterSpacing: 0.8 }}
            >
              WORKSPACE
            </Typography>
          </Box>

          <List component="nav" disablePadding>
            <ListItemButton
              selected={isAllProjectsActive}
              onClick={() => handleNavigation("/projects")}
              sx={{ borderRadius: 1.5 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: isAllProjectsActive ? "primary.main" : "inherit" }}>
                <FolderOpenIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: isAllProjectsActive ? 700 : 500 }}>
                    All Projects
                  </Typography>
                }
              />
            </ListItemButton>
          </List>
        </Box>
      ) : (
        // Contextual Sidebar Navigation — Workspace / All Projects
        <Box sx={{ p: 2, flexGrow: 1 }}>
          <List
            component="nav"
            disablePadding
            subheader={
              <ListSubheader
                component="div"
                disableSticky
                sx={{
                  px: 1,
                  lineHeight: "24px",
                  fontWeight: 700,
                  letterSpacing: 0.8,
                  fontSize: "0.75rem",
                  color: "text.secondary",
                  mb: 1,
                }}
              >
                WORKSPACE
              </ListSubheader>
            }
          >
            <ListItemButton
              selected={isAllProjectsActive}
              onClick={() => handleNavigation("/projects")}
              sx={{ borderRadius: 1.5 }}
            >
              <ListItemIcon sx={{ minWidth: 36, color: isAllProjectsActive ? "primary.main" : "inherit" }}>
                <FolderOpenIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: isAllProjectsActive ? 700 : 500 }}>
                    Projects
                  </Typography>
                }
              />
            </ListItemButton>
          </List>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Top Application Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar>
          {!isDesktop && (
            <IconButton
              color="inherit"
              aria-label="open navigation"
              edge="start"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Brand Logo & Name */}
          <Box
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
            }}
          >
            <Box
              sx={{
                bgcolor: "primary.main",
                color: "white",
                p: 0.6,
                borderRadius: 1.2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ViewQuiltIcon fontSize="small" />
            </Box>

            <Typography variant="h6" component="div" sx={{ fontWeight: 700, letterSpacing: "-0.5px" }}>
              SprintFlow
            </Typography>
          </Box>

          {/* Active Project Breadcrumb Indicator (Desktop) */}
          {currentProject && isDesktop && (
            <Box sx={{ display: "flex", alignItems: "center", ml: 3 }}>
              <Typography color="text.secondary" variant="body2" sx={{ mr: 1, fontWeight: 500 }}>
                /
              </Typography>

              <Chip
                icon={<FolderOpenIcon fontSize="small" />}
                label={currentProject.name}
                variant="outlined"
                color="primary"
                size="small"
                sx={{ fontWeight: 600, borderRadius: 1.5 }}
              />
            </Box>
          )}

          {/* Future User Area Spacer */}
          <Box sx={{ flexGrow: 1 }} />
        </Toolbar>
      </AppBar>

      {/* Responsive Navigation Drawer */}
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
        aria-label="application navigation"
      >
        <Drawer
          variant={isDesktop ? "permanent" : "temporary"}
          open={isDesktop || mobileDrawerOpen}
          onClose={() => setMobileDrawerOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderColor: "divider",
              bgcolor: "background.paper",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Viewport */}
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default function AppLayout() {
  return (
    <ProjectsProvider>
      <AppLayoutContent />
    </ProjectsProvider>
  );
}