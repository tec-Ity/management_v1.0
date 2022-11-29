import React from "react";
import { Box, Typography } from "@mui/material";

export default function PadButton({
  label,
  icon,
  handleClick,
  sx,
  small = false,
  textSx,
}) {
  return (
    <Box
      onClick={handleClick}
      sx={{
        boxSizing: "border-box",
        bgcolor: "transparent",
        border: "1px solid",
        borderColor: "custom.primary",
        borderRadius: small ? "6px" : { xs: "10px", lg: "20px" },
        transition: "all 0.3s",
        cursor: "pointer",
        width: { xs: "100%", lg: small ? 68 : 125 },
        minWidth: 65,
        height: { xs: 40, md: small ? 68 : 60 },
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "&:hover": {
          boxShadow:
            "0px 6px 6px -3px rgba(0, 0, 0, 0.1),0px 10px 14px 1px rgba(0, 0, 0, 0.14),0px 4px 18px 3px rgba(0, 0, 0, 0.11)",
        },
        //small later
        ...sx,
      }}
    >
      {icon}
      <Typography
        sx={{
          ml: icon ? 1 : 0,
          fontSize: small ? "13px" : { xs: "20px", lg: "30px" },
          fontWeight: small ? 400 : 600,
          ...textSx,
        }}
        noWrap
      >
        {label}
      </Typography>
    </Box>
  );
}
