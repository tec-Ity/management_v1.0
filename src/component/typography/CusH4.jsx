import React from "react";
import { Typography } from "@mui/material";

export default function CusH4({ children, color = 2, fontWeight = 700, sx }) {
  const colors = {
    1: "custom.primary",
    2: "saleMid.main",
    3: "custom.error",
  };
  return (
    <Typography
      variant="h4"
      color={colors[color]}
      fontWeight={fontWeight}
      sx={sx}
    >
      {children}
    </Typography>
  );
}
