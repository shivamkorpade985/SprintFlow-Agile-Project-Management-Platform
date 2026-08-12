import {
  AppBar,
  Box,
  Button,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import { Outlet, useNavigate } from "react-router";

export default function LandingLayout() {
  const navigate = useNavigate();

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Public Top Header Navigation */}
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between", height: 70 }}>
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
                  p: 0.8,
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ViewQuiltIcon fontSize="medium" />
              </Box>

              <Typography
                variant="h6"
                component="span"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "-0.5px",
                  color: "text.primary",
                }}
              >
                SprintFlow
              </Typography>
            </Box>

            {/* Nav Links */}
            <Stack direction="row" spacing={3} sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center" }}>
              <Button color="inherit" onClick={() => handleNavClick("features")} sx={{ fontWeight: 500 }}>
                Features
              </Button>

              <Button color="inherit" onClick={() => handleNavClick("workflow")} sx={{ fontWeight: 500 }}>
                Workflow
              </Button>

              <Button color="inherit" onClick={() => handleNavClick("preview")} sx={{ fontWeight: 500 }}>
                Product
              </Button>
            </Stack>

            {/* CTA Button */}
            <Button
              variant="contained"
              disableElevation
              onClick={() => navigate("/projects")}
              sx={{ fontWeight: 600, px: 2.5 }}
            >
              Get Started
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content Area */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 4,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <ViewQuiltIcon color="primary" fontSize="small" />

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                SprintFlow Agile Workspace
              </Typography>
            </Box>

            <Typography variant="caption" color="text.secondary">
              © {new Date().getFullYear()} SprintFlow Platform. Plan. Track. Deliver.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
