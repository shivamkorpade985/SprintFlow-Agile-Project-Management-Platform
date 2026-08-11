import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import { theme } from "../theme/theme";
import { ProjectsProvider } from "../../features/projects/context/ProjectsProvider";

const drawerWidth = 240;

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navigationItems = [
    {
      label: "Projects",
      path: "/projects",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);

    if (!isDesktop) {
      setMobileDrawerOpen(false);
    }
  };

  return (
    <ProjectsProvider>
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
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

          <Typography variant="h6" component="div">
            SprintFlow
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
        aria-label="main navigation"
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
            },
          }}
        >
          <Toolbar />

          <List>
            {navigationItems.map((item) => (
              <ListItemButton
                key={item.path}
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}>
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
     </ProjectsProvider>
  );
}

export default AppLayout;