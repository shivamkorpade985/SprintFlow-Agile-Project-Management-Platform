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
  color = "primary.main",
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
        borderTop: 3,
        borderTopColor: color,
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>

          {icon && <Box sx={{ color }}>{icon}</Box>}
        </Box>

        <Typography variant="h4" component="div" sx={{ fontWeight: 700, my: 0.5 }}>
          {value}
        </Typography>

        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default DashboardStatCard;
