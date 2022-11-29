import React from "react";
import { Typography } from "@mui/material";

export default function CusH6({
  children,
  type = "sale",
  fontWeight = 700,
  sx,
  ...rest
}) {
  const colors = {
    sale: "saleMid.main",
    purchase: "purchaseMid.main",
    error: "error.main",
    standard: "custom.primary",
  };
  return (
    <Typography
      variant="h5"
      color={colors[type]}
      fontWeight={fontWeight}
      sx={sx}
      textOverflow="ellipsis"
      noWrap
      title={children}
      {...rest}
    >
      {children}
    </Typography>
  );
}
