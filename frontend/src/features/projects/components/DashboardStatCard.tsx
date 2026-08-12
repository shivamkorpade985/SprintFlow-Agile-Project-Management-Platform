import { Card, CardContent, Typography, Box } from "@mui/material";
import type { ReactNode } from "react";

interface DashboardStatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  color?: string;
  icon?: ReactNode;
}

function DashboardStatCard({
  title,
  value,
  subtitle,
  color = "#1E64D4",
  icon,
}: DashboardStatCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 6px 16px -4px rgba(0, 0, 0, 0.06)",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 0.2 }}>
            {title}
          </Typography>

          {icon && (
            <Box
              sx={{
                bgcolor: `${color}15`,
                color: color,
                p: 1,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </Box>
          )}
        </Box>

        <Typography variant="h4" component="div" sx={{ fontWeight: 800, my: 0.5, color: "text.primary" }}>
          {value}
        </Typography>

        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default DashboardStatCard;
