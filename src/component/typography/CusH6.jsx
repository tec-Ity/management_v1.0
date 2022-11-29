import React from "react";
import { Typography } from "@mui/material";

export default function CusH6({
  children,
  type = "sale",
  fontWeight = 700,
  frontIcon,
  sx,
  disableTitle,
  ...rest
}) {
  const colors = {
    sale: "saleMid.main",
    purchase: "purchaseMid.main",
    error: "error.main",
    standard: "custom.primary",
    primary: "primary.main",
  };
  return (
    <Typography
      variant="h6"
      color={colors[type]}
      fontWeight={fontWeight}
      sx={sx}
      textOverflow="ellipsis"
      noWrap
      title={!disableTitle ? children : ""}
      {...rest}
    >
      {frontIcon && frontIcon}
      {children}
    </Typography>
  );
}
