import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import GroupsIcon from "@mui/icons-material/Groups";
import LayersIcon from "@mui/icons-material/Layers";
import ViewKanbanIcon from "@mui/icons-material/ViewKanban";
import { useNavigate } from "react-router";

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FolderOpenIcon fontSize="large" color="primary" />,
      title: "Project Management",
      description:
        "Organize multiple project workspaces, track overall project health, and manage timelines efficiently.",
    },
    {
      icon: <AssignmentIcon fontSize="large" color="primary" />,
      title: "User Stories",
      description:
        "Draft detailed story descriptions, estimate story points, assign priorities, and link stories to project team members.",
    },
    {
      icon: <ViewKanbanIcon fontSize="large" color="primary" />,
      title: "Kanban Board",
      description:
        "Visualize work in progress across Backlog, In Progress, Testing, and Done workflow columns with real-time updates.",
    },
    {
      icon: <GroupsIcon fontSize="large" color="primary" />,
      title: "Team Collaboration",
      description:
        "Add team members with role-based identities (Developer, Tester, Manager) and track member story workloads.",
    },
  ];

  const workflowSteps = [
    { label: "Project", desc: "Create workspace", icon: <FolderOpenIcon /> },
    { label: "Stories", desc: "Define backlog", icon: <AssignmentIcon /> },
    { label: "Kanban", desc: "Track progress", icon: <DashboardIcon /> },
    { label: "Team", desc: "Assign members", icon: <GroupsIcon /> },
    { label: "Delivery", desc: "Ship sprints", icon: <CheckCircleIcon /> },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={3} sx={{ alignItems: "center", textAlign: "center" }}>
            <Chip
              icon={<LayersIcon fontSize="small" />}
              label="Agile Project Management Workspace"
              color="primary"
              variant="outlined"
              sx={{ fontWeight: 600, borderRadius: 2 }}
            />

            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "2.25rem", sm: "3.25rem", md: "3.75rem" },
                letterSpacing: "-1px",
                lineHeight: 1.15,
                color: "text.primary",
              }}
            >
              Plan. Track. Deliver.
            </Typography>

            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                maxWidth: 680,
                fontWeight: 400,
                fontSize: { xs: "1rem", md: "1.25rem" },
                lineHeight: 1.6,
              }}
            >
              An Agile project management workspace for teams to organize projects,
              manage user stories, and track workflow progress seamlessly.
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ pt: 2, width: { xs: "100%", sm: "auto" } }}
            >
              <Button
                variant="contained"
                size="large"
                disableElevation
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate("/projects")}
                sx={{ py: 1.5, px: 4, fontWeight: 700, fontSize: "1rem" }}
              >
                Get Started
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  const el = document.getElementById("features");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                sx={{ py: 1.5, px: 3, fontWeight: 600, fontSize: "1rem" }}
              >
                Explore Features
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Product Preview Section */}
      <Box id="preview" sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography
              variant="caption"
              color="primary"
              sx={{ fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}
            >
              PRODUCT PREVIEW
            </Typography>

            <Typography variant="h4" component="h2" sx={{ fontWeight: 700, mt: 1 }}>
              Designed for Focused Sprint Execution
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 600, mx: "auto" }}>
              Experience a clean, distraction-free environment built to manage your user stories and team workload.
            </Typography>
          </Box>

          {/* Interactive UI Mockup */}
          <Paper
            elevation={4}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 3,
              bgcolor: "#FFFFFF",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {/* Mock Workspace Header */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                pb: 2.5,
                mb: 3,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    SprintFlow Core Platform
                  </Typography>

                  <Chip label="ACTIVE SPRINT" size="small" color="primary" sx={{ fontWeight: 600 }} />
                </Stack>

                <Typography variant="body2" color="text.secondary">
                  Agile workspace • 12 Active Stories
                </Typography>
              </Box>

              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Box sx={{ minWidth: 140 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    Sprint Progress: 75%
                  </Typography>

                  <LinearProgress variant="determinate" value={75} sx={{ height: 6, borderRadius: 3, mt: 0.5 }} />
                </Box>
              </Stack>
            </Box>

            {/* Mock Kanban Board Snippet */}
            <Grid container spacing={2}>
              {/* Backlog Column */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "#F8FAFC", minHeight: 220 }}>
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
                      Backlog
                    </Typography>

                    <Chip label="2" size="small" sx={{ height: 20, fontSize: "0.75rem", fontWeight: 700 }} />
                  </Stack>

                  <Card variant="outlined" sx={{ mb: 1.5, p: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      Setup OAuth2 Authentication
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Chip label="HIGH" size="small" color="error" variant="outlined" sx={{ height: 18, fontSize: "0.65rem" }} />

                      <Typography variant="caption" color="text.secondary">
                        5 pts
                      </Typography>
                    </Stack>
                  </Card>

                  <Card variant="outlined" sx={{ p: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      Design System Alignment
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Chip label="MEDIUM" size="small" color="warning" variant="outlined" sx={{ height: 18, fontSize: "0.65rem" }} />

                      <Typography variant="caption" color="text.secondary">
                        3 pts
                      </Typography>
                    </Stack>
                  </Card>
                </Paper>
              </Grid>

              {/* In Progress Column */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "#F0F7FF", minHeight: 220, borderColor: "primary.light" }}>
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.dark" }}>
                      In Progress
                    </Typography>

                    <Chip label="1" size="small" color="primary" sx={{ height: 20, fontSize: "0.75rem", fontWeight: 700 }} />
                  </Stack>

                  <Card variant="outlined" sx={{ p: 1.5, borderColor: "primary.light" }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      Implement Rest API Endpoints
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "center" }}>
                      <Chip label="HIGH" size="small" color="error" variant="outlined" sx={{ height: 18, fontSize: "0.65rem" }} />

                      <Avatar sx={{ width: 22, height: 22, fontSize: "0.65rem", bgcolor: "primary.main" }}>
                        SK
                      </Avatar>
                    </Stack>
                  </Card>
                </Paper>
              </Grid>

              {/* Testing Column */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "#FFFDF0", minHeight: 220 }}>
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "warning.dark" }}>
                      Testing
                    </Typography>

                    <Chip label="1" size="small" color="warning" sx={{ height: 20, fontSize: "0.75rem", fontWeight: 700 }} />
                  </Stack>

                  <Card variant="outlined" sx={{ p: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                      Kanban Drag-and-Drop QA
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Chip label="LOW" size="small" color="info" variant="outlined" sx={{ height: 18, fontSize: "0.65rem" }} />

                      <Typography variant="caption" color="text.secondary">
                        2 pts
                      </Typography>
                    </Stack>
                  </Card>
                </Paper>
              </Grid>

              {/* Done Column */}
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "#F0FDF4", minHeight: 220 }}>
                  <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "success.dark" }}>
                      Done
                    </Typography>

                    <Chip label="3" size="small" color="success" sx={{ height: 20, fontSize: "0.75rem", fontWeight: 700 }} />
                  </Stack>

                  <Card variant="outlined" sx={{ p: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, textDecoration: "line-through", color: "text.secondary" }}>
                      Project Overview Dashboard
                    </Typography>

                    <Chip label="DONE" size="small" color="success" sx={{ height: 18, fontSize: "0.65rem" }} />
                  </Card>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Features Section */}
      <Box id="features" sx={{ py: { xs: 8, md: 12 }, bgcolor: "background.paper", borderTop: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="caption"
              color="primary"
              sx={{ fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}
            >
              CORE CAPABILITIES
            </Typography>

            <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mt: 1 }}>
              Everything Your Team Needs
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 600, mx: "auto" }}>
              Streamlined tools tailored specifically for Agile methodologies and sprint planning.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, idx) => (
              <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>

                    <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {feature.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Agile Workflow Section */}
      <Box id="workflow" sx={{ py: { xs: 8, md: 12 }, bgcolor: "background.default", borderTop: "1px solid", borderColor: "divider" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="caption"
              color="primary"
              sx={{ fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase" }}
            >
              AGILE PIPELINE
            </Typography>

            <Typography variant="h3" component="h2" sx={{ fontWeight: 700, mt: 1 }}>
              How SprintFlow Works
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 600, mx: "auto" }}>
              From initial project setup to sprint delivery in five clear steps.
            </Typography>
          </Box>

          <Grid container spacing={2} sx={{ justifyContent: "center" }}>
            {workflowSteps.map((step, index) => (
              <Grid key={index} size={{ xs: 12, sm: 6, md: 2.4 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 3,
                    textAlign: "center",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                      fontWeight: 700,
                    }}
                  >
                    {step.icon}
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                    {step.label}
                  </Typography>

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {step.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Final CTA Section */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          bgcolor: "primary.main",
          color: "white",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2 }}>
            Ready to organize your next sprint?
          </Typography>

          <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400, mb: 4, maxWidth: 550, mx: "auto" }}>
            Create projects, manage team assignments, and track user stories in one unified workspace.
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/projects")}
            sx={{
              bgcolor: "white",
              color: "primary.main",
              fontWeight: 700,
              px: 4,
              py: 1.5,
              fontSize: "1.05rem",
              "&:hover": {
                bgcolor: "grey.100",
              },
            }}
          >
            Go to Projects
          </Button>
        </Container>
      </Box>
    </Box>
  );
}
